/* =====================================================================
   PAGAMENTO (InfinitePay, Checkout Integrado) e LIBERAÇÃO AUTOMÁTICA do kit.
   Só roda no servidor (funções em api/). Nada aqui vai para o navegador.

   Sem banco de dados:
   - O PEDIDO viaja no próprio order_nsu, assinado com HMAC (coleção, plano, valor em centavos,
     e-mail e data). O preço é sempre o do servidor (SITE.planos); ninguém consegue alterar o pedido
     sem invalidar a assinatura.
   - O ACESSO é determinístico: o mesmo pedido gera sempre o mesmo link (data de emissão = data do
     pedido, referência = pedido). Confirmação repetida = o mesmo acesso, nunca um segundo.
   - A confirmação vem do webhook OU da volta da cliente, mas só vale depois de conferir na
     InfinitePay (POST /payment_check): pago, mesmo pedido e valor >= o do plano.
     O webhook não tem assinatura (documentação oficial), por isso a conferência é obrigatória.

   Variáveis de ambiente (cadastrar em privado na hospedagem):
     ACESSO_SECRET         (já usado pela área da cliente; também assina os pedidos)
     INFINITEPAY_HANDLE    InfiniteTag da conta, sem o "$"
     INFINITEPAY_API_KEY   opcional (inchk_...): link de pagamento único e com validade
     SITE_URL              ex.: https://natal-no-ar.vercel.app
     RESEND_API_KEY, EMAIL_REMETENTE   envio do e-mail com o acesso (private/email.js)
     PRECO_TESTE_CENTAVOS  opcional: preço de um pedido de TESTE criado com o ADMIN_TOKEN (ex.: 100 = R$ 1,00)
     INFINITEPAY_API_BASE  só para testes locais (simulador); padrão https://api.checkout.infinitepay.io
   ===================================================================== */
import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE } from "../public/config.js";
import { planoPorId, temaPorId, fmtBRL } from "../public/js/logic.js";
import { CAMPANHAS } from "./campanhas/index.js";
import { emitirToken } from "./acesso.js";

const API = () => (process.env.INFINITEPAY_API_BASE || "https://api.checkout.infinitepay.io").replace(/\/$/, "");
const b64 = s => Buffer.from(s).toString("base64url");
const hmac = (ctx, dados, segredo) => createHmac("sha256", segredo).update(`${ctx}:${dados}`).digest("base64url");
const igual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
export const EMAIL_OK = e => typeof e === "string" && e.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export const mascararEmail = e => { const [u, d] = String(e).split("@"); return `${u.slice(0, 2)}•••@${d}`; };

/* campanhas à venda (status disponível + conteúdo pago existente) e preço de cada plano em centavos */
export const CAMPANHAS_A_VENDA = () => Object.keys(CAMPANHAS).filter(id => { const t = temaPorId(SITE, id); return t && t.status === "disponivel"; });
export const centavos = plano => Math.round(plano.preco * 100);

/* ---------- pedido assinado ---------- */
export function criarPedido({ campanha, plano: planoId, email, teste = false }, segredo, agora = Date.now()) {
  if (!segredo || segredo.length < 32) throw Object.assign(new Error("Servidor sem ACESSO_SECRET."), { status: 503 });
  const tema = temaPorId(SITE, campanha), plano = planoPorId(SITE, planoId);
  if (!tema || !CAMPANHAS_A_VENDA().includes(campanha)) throw Object.assign(new Error("Coleção indisponível."), { status: 400 });
  if (!plano) throw Object.assign(new Error("Plano desconhecido."), { status: 400 });
  email = String(email || "").trim().toLowerCase();
  if (!EMAIL_OK(email)) throw Object.assign(new Error("E-mail inválido."), { status: 400 });
  const testePreco = teste ? Number(process.env.PRECO_TESTE_CENTAVOS) : 0;
  const valor = testePreco >= 100 ? Math.round(testePreco) : centavos(plano);   // mínimo da InfinitePay: R$ 1,00
  // formato curto (o limite do order_nsu não é documentado): campanha~plano~valor~e-mail~data(base 36)~teste
  const dados = b64([campanha, plano.id, valor, email, Math.floor(agora / 1000).toString(36), valor !== centavos(plano) ? 1 : 0].join("~"));
  const nsu = `${dados}.${hmac("pedido", dados, segredo).slice(0, 22)}`;
  return { nsu, campanha, tema, plano, valor, email, criado: Math.floor(agora / 1000) * 1000, teste: valor !== centavos(plano) };
}
export function lerPedido(nsu, segredo) {
  if (!segredo || typeof nsu !== "string" || nsu.length > 600) return null;
  const [dados, sig, ...resto] = nsu.split(".");
  if (!dados || !sig || resto.length || !igual(sig, hmac("pedido", dados, segredo).slice(0, 22))) return null;
  const [c, pl, v, e, t, x] = Buffer.from(dados, "base64url").toString("utf8").split("~");
  const tema = temaPorId(SITE, c), plano = planoPorId(SITE, pl), valor = Number(v), criado = parseInt(t, 36) * 1000;
  if (!tema || !plano || !EMAIL_OK(e) || !Number.isInteger(valor) || !(criado > 0)) return null;
  return { nsu, campanha: c, tema, plano, valor, email: e, criado, teste: x === "1" };
}

/* ---------- InfinitePay ---------- */
const cabecalhos = () => ({ "content-type": "application/json", ...(process.env.INFINITEPAY_API_KEY ? { "x-api-key": process.env.INFINITEPAY_API_KEY } : {}) });
export const tokenWebhook = segredo => hmac("webhook", "infinitepay", segredo).slice(0, 32);

/* cria o link de pagamento; devolve a URL do checkout */
export async function criarLink(pedido, { base, segredo }) {
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) throw Object.assign(new Error("Pagamento ainda não configurado (INFINITEPAY_HANDLE)."), { status: 503 });
  const corpo = {
    handle, order_nsu: pedido.nsu,
    items: [{ quantity: 1, price: pedido.valor, description: `Natal no Ar · ${pedido.tema.nome} · ${pedido.plano.nome}${pedido.teste ? " (teste)" : ""}` }],
    redirect_url: `${base}/retorno.html`,
    webhook_url: `${base}/api/infinitepay?k=${tokenWebhook(segredo)}`,
    customer: { email: pedido.email }
  };
  // com a API Key: link de pagamento único, válido por 2 dias, Pix e cartão (o cartão não pode ser desligado)
  if (process.env.INFINITEPAY_API_KEY) corpo.options = { single_payment: true, valid_until: new Date(Date.now() + 2 * 86400e3).toISOString().replace(/\.\d+Z$/, "Z"), payment_methods_enabled: ["pix", "credit_card"] };
  const r = await fetch(`${API()}/links`, { method: "POST", headers: cabecalhos(), body: JSON.stringify(corpo) });
  const d = await r.json().catch(() => ({}));
  // a documentação não mostra o nome do campo da URL na resposta: aceita os nomes possíveis
  const url = d.url || d.checkout_url || d.link || d.payment_url || (d.data && (d.data.url || d.data.checkout_url));
  const seguro = process.env.INFINITEPAY_API_BASE ? /^https?:\/\//.test(url || "") : /^https:\/\//.test(url || ""); // http só com o simulador local
  if (!r.ok || typeof url !== "string" || !seguro) {
    const erro = d.error || d.message || d.erro || `HTTP ${r.status}`;
    throw Object.assign(new Error(/not_enabled/.test(JSON.stringify(d)) ? "Checkout Integrado não habilitado na conta InfinitePay." : `A InfinitePay não gerou o link (${erro}).`), { status: 502 });
  }
  return url;
}

/* confere o pagamento na InfinitePay; só libera com paid: true, mesmo pedido e valor >= o do pedido */
export async function conferirPagamento(pedido, { transacao, slug }) {
  if (!transacao || !slug) return { pago: false, motivo: "sem-transacao" };
  const r = await fetch(`${API()}/payment_check`, { method: "POST", headers: cabecalhos(),
    body: JSON.stringify({ handle: process.env.INFINITEPAY_HANDLE, order_nsu: pedido.nsu, transaction_nsu: String(transacao), slug: String(slug) }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) return { pago: false, motivo: `http-${r.status}` };
  if (!d.success || !d.paid) return { pago: false, motivo: "nao-pago" };
  if (!(Number(d.amount) >= pedido.valor)) return { pago: false, motivo: "valor-diferente" };   // paid_amount pode ser maior (juros do parcelamento)
  return { pago: true, metodo: d.capture_method || "", valor: Number(d.amount), pagoValor: Number(d.paid_amount || d.amount) };
}

/* ---------- acesso: sempre o mesmo para o mesmo pedido ---------- */
export function acessoDoPedido(pedido, segredo, base) {
  const token = emitirToken({ campanha: pedido.campanha, plano: pedido.plano.id, dias: 365, referencia: `ip-${hmac("ref", pedido.nsu, segredo).slice(0, 12)}` }, segredo, pedido.criado);
  return { token, link: `${base}/#acesso=${token}` };
}
export const resumoPedido = p => ({ campanha: p.tema.nome, campanhaId: p.campanha, plano: p.plano.nome, planoId: p.plano.id, valor: p.valor, valorTexto: fmtBRL(p.valor / 100), email: mascararEmail(p.email), teste: p.teste });
export const baseDoSite = req => (process.env.SITE_URL || `https://${req.headers.host}`).replace(/\/$/, "");
