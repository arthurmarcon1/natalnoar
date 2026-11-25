// Pagamento (InfinitePay) e liberação automática: pedido assinado, conferência, acesso único, e-mail e reenvio.
// A InfinitePay e o e-mail são simulados (fetch falso e pasta local); nenhum dinheiro nem e-mail real.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { verificarToken } from "../private/acesso.js";

const SEG = "s".repeat(48);
const saida = mkdtempSync(join(tmpdir(), "emails-"));
Object.assign(process.env, { ACESSO_SECRET: SEG, ADMIN_TOKEN: "a".repeat(40), INFINITEPAY_HANDLE: "loja-teste", INFINITEPAY_API_BASE: "https://ip.falso", SITE_URL: "https://natal.test", EMAIL_SAIDA_DIR: saida, PRECO_TESTE_CENTAVOS: "100" });
delete process.env.INFINITEPAY_API_KEY;
const P = await import("../private/pagamento.js");
const { default: apiPedido } = await import("../api/pedido.js");
const { default: apiWebhook } = await import("../api/infinitepay.js");
const { default: apiRetorno } = await import("../api/retorno.js");

/* InfinitePay falsa: links criados, pagamentos marcados como pagos */
const ip = { links: [], pagos: new Map(), status: 200 };
globalThis.fetch = async (url, op = {}) => {
  const b = JSON.parse(op.body || "{}"), resp = (st, d) => ({ ok: st < 400, status: st, json: async () => d });
  if (url === "https://ip.falso/links") { ip.links.push(b); return resp(200, { url: `https://checkout.infinitepay.io/loja-teste/${ip.links.length}` }); }
  if (url === "https://ip.falso/payment_check") {
    if (ip.status !== 200) return resp(ip.status, {});
    const p = ip.pagos.get(`${b.order_nsu}|${b.transaction_nsu}|${b.slug}`);
    return resp(200, p && b.handle === "loja-teste" ? { success: true, paid: true, amount: p, paid_amount: p, installments: 1, capture_method: "pix" } : { success: true, paid: false });
  }
  throw new Error("fetch inesperado: " + url);
};
function chamar(handler, { method = "POST", url = "/", headers = {}, body } = {}) {
  return new Promise(ok => {
    const res = { statusCode: 200, h: {}, setHeader(k, v) { this.h[k.toLowerCase()] = v; }, end(x) { ok({ status: this.statusCode, json: x ? JSON.parse(x) : null }); } };
    Promise.resolve(handler({ method, url, headers: { host: "natal.test", ...headers }, body: body && JSON.stringify(body) }, res));
  });
}
const emails = () => readdirSync(saida).map(f => JSON.parse(readFileSync(join(saida, f), "utf8")));
const webhook = (k, corpo) => chamar(apiWebhook, { url: `/api/infinitepay?k=${k}`, body: corpo });
const K = P.tokenWebhook(SEG);

test("pedido: preço do servidor nos três planos, link com redirect e webhook", async () => {
  for (const [plano, v] of [["natal-pronto", 8990], ["natal-completo", 13990], ["natal-virada", 18990]]) {
    const r = await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano, email: "Maria@Teste.com", confirmacao: "maria@teste.com", valor: 1 } });
    assert.equal(r.status, 200); assert.equal(r.json.resumo.valor, v); assert.match(r.json.url, /^https:\/\//);
    const l = ip.links.at(-1);
    assert.equal(l.items[0].price, v, "o preço enviado é o do servidor, nunca o do navegador");
    assert.equal(l.handle, "loja-teste"); assert.equal(l.order_nsu, r.json.pedido); assert.equal(l.customer.email, "maria@teste.com");
    assert.equal(l.redirect_url, "https://natal.test/retorno.html"); assert.equal(l.webhook_url, `https://natal.test/api/infinitepay?k=${K}`);
    assert.ok(l.order_nsu.length < 200);
  }
  assert.equal(P.lerPedido(ip.links[0].order_nsu, SEG).plano.id, "natal-pronto");
});

test("pedido: e-mails diferentes, coleção em preparação, plano errado e teste sem admin são recusados", async () => {
  assert.equal((await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "a@b.com", confirmacao: "c@b.com" } })).status, 400);
  assert.equal((await chamar(apiPedido, { body: { campanha: "looks-para-celebrar", plano: "natal-pronto", email: "a@b.com", confirmacao: "a@b.com" } })).status, 400);
  assert.equal((await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "vip", email: "a@b.com", confirmacao: "a@b.com" } })).status, 400);
  assert.equal((await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "sem-arroba", confirmacao: "sem-arroba" } })).status, 400);
  const semAdmin = await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "a@b.com", confirmacao: "a@b.com", teste: true } });
  assert.equal(semAdmin.json.resumo.valor, 8990, "preço de teste só com o ADMIN_TOKEN");
  const comAdmin = await chamar(apiPedido, { headers: { "x-admin-token": "a".repeat(40) }, body: { campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "a@b.com", confirmacao: "a@b.com", teste: true } });
  assert.equal(comAdmin.json.resumo.valor, 100); assert.ok(comAdmin.json.resumo.teste); assert.match(ip.links.at(-1).items[0].description, /\(teste\)/);
  const h = process.env.INFINITEPAY_HANDLE; delete process.env.INFINITEPAY_HANDLE;
  assert.equal((await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "a@b.com", confirmacao: "a@b.com" } })).status, 503, "sem a InfiniteTag: pagamento não configurado");
  process.env.INFINITEPAY_HANDLE = h;
});

test("pedido adulterado não vale", () => {
  const p = P.criarPedido({ campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "a@b.com" }, SEG);
  const [d, sig] = p.nsu.split(".");
  const outro = Buffer.from(Buffer.from(d, "base64url").toString().replace("natal-pronto", "natal-virada")).toString("base64url");
  assert.equal(P.lerPedido(`${outro}.${sig}`, SEG), null);
  assert.equal(P.lerPedido(p.nsu, "t".repeat(48)), null);
  assert.ok(P.lerPedido(p.nsu, SEG));
});

test("pendente, aprovado, confirmação repetida e reenvio do e-mail", async () => {
  const r = await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "natal-pronto", email: "cliente@teste.com", confirmacao: "cliente@teste.com" } });
  const nsu = r.json.pedido, aviso = { order_nsu: nsu, transaction_nsu: "tx-1", invoice_slug: "fat-1", amount: 8990, paid_amount: 8990, capture_method: "pix" };
  const n0 = emails().length;
  // token do aviso errado
  assert.equal((await webhook("errado", aviso)).status, 401);
  // pendente: o aviso chegou, mas a InfinitePay ainda não confirma → nada é liberado
  const pend = await webhook(K, aviso);
  assert.equal(pend.status, 200); assert.equal(pend.json.pago, false); assert.equal(emails().length, n0);
  const volta = await chamar(apiRetorno, { body: { pedido: nsu, transacao: "tx-1", slug: "fat-1" } });
  assert.equal(volta.json.status, "pendente"); assert.ok(!volta.json.token, "voltar ao site sem pagar não libera");
  // aprovado
  ip.pagos.set(`${nsu}|tx-1|fat-1`, 8990);
  const ok1 = await webhook(K, aviso);
  assert.equal(ok1.status, 200); assert.equal(ok1.json.email, "enviado");
  const e1 = emails().at(-1);
  assert.equal(e1.para, "cliente@teste.com"); assert.match(e1.assunto, /Presentes por orçamento/);
  const link1 = e1.texto.match(/https:\/\/natal\.test\/#acesso=\S+/)[0];
  const acesso = verificarToken(link1.split("#acesso=")[1], SEG);
  assert.equal(acesso.campanha, "presentes-por-orcamento"); assert.equal(acesso.plano, "natal-pronto");
  // confirmação repetida: o mesmo acesso (mesmo link), nunca um segundo
  await webhook(K, aviso);
  const link2 = emails().at(-1).texto.match(/https:\/\/natal\.test\/#acesso=\S+/)[0];
  assert.equal(link2, link1);
  // volta da cliente: "Abrir minha campanha" com o mesmo acesso
  const pago = await chamar(apiRetorno, { body: { pedido: nsu, transacao: "tx-1", slug: "fat-1" } });
  assert.equal(pago.json.status, "pago"); assert.equal(pago.json.link, link1); assert.equal(pago.json.resumo.email, "cl•••@teste.com");
  // reenviar o e-mail: sem nova cobrança, mesmo link
  const n = emails().length, re = await chamar(apiRetorno, { body: { pedido: nsu, transacao: "tx-1", slug: "fat-1", reenviar: true } });
  assert.equal(re.json.email, "enviado"); assert.equal(emails().length, n + 1); assert.ok(emails().at(-1).texto.includes(link1));
  assert.equal(ip.links.filter(l => l.order_nsu === nsu).length, 1, "nenhum link de pagamento novo");
});

test("valor menor, outra transação e falha temporária da InfinitePay não liberam", async () => {
  const r = await chamar(apiPedido, { body: { campanha: "seu-toque-nas-festas", plano: "natal-virada", email: "b@teste.com", confirmacao: "b@teste.com" } });
  const nsu = r.json.pedido;
  ip.pagos.set(`${nsu}|tx-9|fat-9`, 100);   // pago, mas com valor menor que o do plano
  const menor = await webhook(K, { order_nsu: nsu, transaction_nsu: "tx-9", invoice_slug: "fat-9" });
  assert.equal(menor.json.pago, false); assert.equal(menor.json.motivo, "valor-diferente");
  const outra = await chamar(apiRetorno, { body: { pedido: nsu, transacao: "tx-x", slug: "fat-9" } });
  assert.equal(outra.json.status, "pendente");
  ip.status = 503; const falha = await webhook(K, { order_nsu: nsu, transaction_nsu: "tx-9", invoice_slug: "fat-9" }); ip.status = 200;
  assert.equal(falha.status, 400, "falha temporária: a InfinitePay tenta de novo");
  assert.equal((await webhook(K, { order_nsu: "qualquer.coisa", transaction_nsu: "1", invoice_slug: "2" })).json.ignorado, "pedido-desconhecido");
});

test("e-mail não configurado: o aviso pede nova tentativa e a página oferece reenviar", async () => {
  const dir = process.env.EMAIL_SAIDA_DIR; delete process.env.EMAIL_SAIDA_DIR; delete process.env.RESEND_API_KEY;
  const r = await chamar(apiPedido, { body: { campanha: "presentes-por-orcamento", plano: "natal-completo", email: "c@teste.com", confirmacao: "c@teste.com" } });
  ip.pagos.set(`${r.json.pedido}|tx-c|fat-c`, 13990);
  const w = await webhook(K, { order_nsu: r.json.pedido, transaction_nsu: "tx-c", invoice_slug: "fat-c" });
  assert.equal(w.status, 400); assert.equal(w.json.pago, true); assert.match(w.json.email, /não configurado/);
  const re = await chamar(apiRetorno, { body: { pedido: r.json.pedido, transacao: "tx-c", slug: "fat-c", reenviar: true } });
  assert.equal(re.json.status, "pago"); assert.ok(re.json.token, "o acesso aparece na tela mesmo sem e-mail"); assert.match(re.json.email, /não configurado/);
  process.env.EMAIL_SAIDA_DIR = dir;
});
