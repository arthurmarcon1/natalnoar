/* GET /api/pedido → { ativo, provedor }: o pagamento online está configurado?
   POST /api/pedido  { campanha, plano, email, confirmacao }
   Registra o pedido (assinado, com o preço do servidor) e prepara o pagamento no provedor ativo:
   - IPG do Sicredi:  { formulario: { acao, campos } } (o navegador envia o formulário para a página segura do IPG)
   - InfinitePay:     { url } (o navegador abre o link de pagamento)
   Teste com valor baixo: cabeçalho x-admin-token + { teste: true } usa PRECO_TESTE_CENTAVOS. */
import { json, lerCorpo } from "./_http.js";
import { segredoConfere } from "../private/acesso.js";
import { criarPedido, criarLink, resumoPedido, baseDoSite, tokenWebhook } from "../private/pagamento.js";
import { provedorAtivo, formularioIPG } from "../private/ipg.js";

export default async function handler(req, res) {
  const segredoOk = !!(process.env.ACESSO_SECRET && process.env.ACESSO_SECRET.length >= 32);
  // GET: a revisão do pedido mostra o WhatsApp enquanto o pagamento online não estiver configurado
  if (req.method === "GET") { const p = segredoOk ? provedorAtivo() : null; return json(res, 200, { ativo: !!p, provedor: p }); }
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "GET, POST" });
  let corpo; try { corpo = JSON.parse((await lerCorpo(req)) || "{}"); } catch { return json(res, 400, { erro: "Pedido inválido." }); }
  const email = String(corpo.email || "").trim().toLowerCase();
  if (email !== String(corpo.confirmacao || "").trim().toLowerCase()) return json(res, 400, { erro: "Os dois e-mails não são iguais." });
  const teste = corpo.teste === true && segredoConfere(req.headers["x-admin-token"], process.env.ADMIN_TOKEN);
  try {
    const segredo = process.env.ACESSO_SECRET, pedido = criarPedido({ campanha: corpo.campanha, plano: corpo.plano, email, teste }, segredo), base = baseDoSite(req);
    const provedor = provedorAtivo();
    if (provedor === "ipg") return json(res, 200, { formulario: formularioIPG(pedido, { base, segredo, tokenAviso: tokenWebhook(segredo) }), pedido: pedido.nsu, resumo: resumoPedido(pedido) });
    const url = await criarLink(pedido, { base, segredo });
    return json(res, 200, { url, pedido: pedido.nsu, resumo: resumoPedido(pedido) });
  } catch (e) { return json(res, e.status || 500, { erro: e.status ? e.message : "Não foi possível iniciar o pagamento." }); }
}
