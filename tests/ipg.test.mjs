// IPG do Sicredi (Fiserv Connect): hash do pedido igual ao exemplo oficial, formulário, volta, aviso e acesso único.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHmac } from "node:crypto";
import { verificarToken } from "../private/acesso.js";

const SEG = "s".repeat(48), LOJA = "1234567890", SS = "segredo-compartilhado";
const saida = mkdtempSync(join(tmpdir(), "emails-ipg-"));
Object.assign(process.env, { ACESSO_SECRET: SEG, ADMIN_TOKEN: "a".repeat(40), PAGAMENTO_PROVEDOR: "ipg", IPG_STORENAME: LOJA, IPG_SHARED_SECRET: SS, SITE_URL: "https://natal.test", EMAIL_SAIDA_DIR: saida });
delete process.env.IPG_URL; delete process.env.INFINITEPAY_HANDLE;
const I = await import("../private/ipg.js");
const P = await import("../private/pagamento.js");
const { default: apiPedido } = await import("../api/pedido.js");
const { default: apiAviso } = await import("../api/ipg.js");
const { default: apiVolta } = await import("../api/ipg-retorno.js");
const { default: apiRetorno } = await import("../api/retorno.js");

function chamar(handler, { method = "POST", url = "/", headers = {}, body, form } = {}) {
  return new Promise(ok => {
    const res = { statusCode: 200, h: {}, setHeader(k, v) { this.h[k.toLowerCase()] = v; }, end(x) { ok({ status: this.statusCode, headers: this.h, json: x ? JSON.parse(x) : null }); } };
    Promise.resolve(handler({ method, url, headers: { host: "natal.test", ...headers }, body: form ? new URLSearchParams(form).toString() : body && JSON.stringify(body) }, res));
  });
}
const emails = () => readdirSync(saida).map(f => JSON.parse(readFileSync(join(saida, f), "utf8")));
const hmac = s => createHmac("sha256", SS).update(s).digest("base64");
/* o que o IPG devolve para um pedido (como o simulador e o guia) */
function resultadoIPG(campos, status = "APPROVED", extra = {}) {
  const r = { approval_code: status === "APPROVED" ? "Y:123456:4567:YYYM:1" : status === "WAITING" ? "?:waiting" : "N:05:Nao autorizada", oid: campos.oid, status, txndatetime: campos.txndatetime, chargetotal: campos.chargetotal, currency: campos.currency, ipgTransactionId: "84123456789", ...extra };
  r.response_hash = hmac([r.approval_code, r.chargetotal, r.currency, r.txndatetime, LOJA].join("|"));
  r.notification_hash = hmac([r.chargetotal, r.currency, r.txndatetime, LOJA, r.approval_code].join("|"));
  return r;
}
async function novoPedido(plano = "natal-pronto", email = "cliente@teste.com", campanha = "presentes-por-orcamento") {
  const r = await chamar(apiPedido, { body: { campanha, plano, email, confirmacao: email } });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  return r.json;
}

test("hashExtended igual ao exemplo oficial do Connect Integration Guide", () => {
  const c = { chargetotal: "13.00", checkoutoption: "combinedpage", currency: "978", hash_algorithm: "HMACSHA256", paymentMethod: "M", responseFailURL: "https://localhost:8643/webshop/response_failure.jsp", responseSuccessURL: "https://localhost:8643/webshop/response_success.jsp", storename: "10123456789", timezone: "Europe/Berlin", transactionNotificationURL: "https://localhost:8643/webshop/transactionNotification", txndatetime: "2021:09:06-16:43:04", txntype: "sale" };
  assert.equal(I.hashExtended(c, "sharedsecret"), "EapafBqqOF6N/kch8USkHPGh+fwSko24h6FpQnQHfQ8=");
});

test("formulário do IPG: preço do servidor em reais, BRL, oid válido, endereços com o pedido e hash correto", async () => {
  const g = await chamar(apiPedido, { method: "GET" });
  assert.deepEqual(g.json, { ativo: true, provedor: "ipg" });
  for (const [plano, v] of [["natal-pronto", "89.90"], ["natal-completo", "139.90"], ["natal-virada", "189.90"]]) {
    const d = await novoPedido(plano), f = d.formulario, c = f.campos;
    assert.equal(f.acao, I.IPG_URL_TESTE, "sem IPG_URL: ambiente de testes da Fiserv");
    assert.equal(c.chargetotal, v); assert.equal(c.currency, "986"); assert.equal(c.txntype, "sale"); assert.equal(c.storename, LOJA);
    assert.equal(c.checkoutoption, "combinedpage"); assert.equal(c.language, "pt_BR"); assert.equal(c.timezone, "America/Sao_Paulo"); assert.equal(c.hash_algorithm, "HMACSHA256");
    assert.match(c.txndatetime, /^\d{4}:\d{2}:\d{2}-\d{2}:\d{2}:\d{2}$/);
    assert.match(c.oid, /^[A-Za-z0-9-]{1,32}$/, "oid só com letras, números e hífen, até 32");
    assert.ok(c.responseSuccessURL.startsWith("https://natal.test/api/ipg-retorno?p=") && c.transactionNotificationURL.startsWith(`https://natal.test/api/ipg?k=${P.tokenWebhook(SEG)}&p=`));
    const { hashExtended, ...resto } = c;
    assert.equal(hashExtended, hmac(Object.keys(resto).sort().map(k => resto[k]).join("|")));
    assert.ok(!("cardnumber" in c) && !("cvm" in c), "nenhum dado de cartão passa pelo site");
  }
});

test("volta do IPG: aprovado leva ao comprovante; recusado, aguardando e hash falso não liberam", async () => {
  const d = await novoPedido(), c = d.formulario.campos, url = `/api/ipg-retorno?p=${encodeURIComponent(d.pedido)}`;
  const ok = await chamar(apiVolta, { url, form: resultadoIPG(c) });
  assert.equal(ok.status, 303); assert.match(ok.headers.location, /^https:\/\/natal\.test\/#retorno\?pedido=.+&comprovante=[\w-]{32}$/);
  const comp = new URLSearchParams(ok.headers.location.split("?")[1]).get("comprovante");
  const ret = await chamar(apiRetorno, { body: { pedido: d.pedido, comprovante: comp } });
  assert.equal(ret.json.status, "pago"); assert.equal(verificarToken(ret.json.token, SEG).plano, "natal-pronto");
  assert.equal((await chamar(apiRetorno, { body: { pedido: d.pedido, comprovante: "x".repeat(32) } })).json.status, "pendente", "comprovante inventado não libera");
  assert.match((await chamar(apiVolta, { url, form: resultadoIPG(c, "DECLINED", { fail_reason: "recusada" }) })).headers.location, /&recusado=1$/);
  assert.match((await chamar(apiVolta, { url, form: resultadoIPG(c, "WAITING") })).headers.location, /&espera=1$/);
  const falso = { ...resultadoIPG(c), response_hash: "AAAA" };
  assert.match((await chamar(apiVolta, { url, form: falso })).headers.location, /&erro=confirmacao$/);
  const outroValor = resultadoIPG({ ...c, chargetotal: "1.00" });
  assert.doesNotMatch((await chamar(apiVolta, { url, form: outroValor })).headers.location, /comprovante=/, "valor menor não libera");
  const outro = await novoPedido("natal-virada", "outra@teste.com");
  assert.doesNotMatch((await chamar(apiVolta, { url: `/api/ipg-retorno?p=${encodeURIComponent(outro.pedido)}`, form: resultadoIPG(c) })).headers.location, /comprovante=/, "aprovação de um pedido não vale para outro");
});

test("aviso do IPG: aprovado envia o e-mail; repetido mantém o mesmo acesso; token e hash errados são recusados", async () => {
  const d = await novoPedido("natal-pronto", "aviso@teste.com"), c = d.formulario.campos;
  const url = `/api/ipg?k=${P.tokenWebhook(SEG)}&p=${encodeURIComponent(d.pedido)}`, { response_hash, ...aviso } = resultadoIPG(c);
  assert.equal((await chamar(apiAviso, { url: `/api/ipg?k=errado&p=${encodeURIComponent(d.pedido)}`, form: aviso })).status, 401);
  assert.equal((await chamar(apiAviso, { url, form: { ...aviso, notification_hash: "AAAA" } })).status, 401);
  const n0 = emails().length;
  const espera = await chamar(apiAviso, { url, form: (({ response_hash, ...a }) => a)(resultadoIPG(c, "WAITING")) });
  assert.equal(espera.json.pago, false); assert.equal(emails().length, n0, "aguardando: nada liberado");
  const r1 = await chamar(apiAviso, { url, form: aviso });
  assert.equal(r1.status, 200); assert.equal(r1.json.email, "enviado");
  const e1 = emails().at(-1), link1 = e1.texto.match(/https:\/\/natal\.test\/#acesso=\S+/)[0];
  assert.equal(e1.para, "aviso@teste.com");
  const a = verificarToken(link1.split("#acesso=")[1], SEG); assert.equal(a.campanha, "presentes-por-orcamento"); assert.equal(a.plano, "natal-pronto");
  await chamar(apiAviso, { url, form: aviso });
  assert.equal(emails().at(-1).texto.match(/https:\/\/natal\.test\/#acesso=\S+/)[0], link1, "aviso repetido: o mesmo acesso");
  const recusado = await chamar(apiAviso, { url, form: (({ response_hash, ...a }) => a)(resultadoIPG(c, "DECLINED")) });
  assert.equal(recusado.json.pago, false);
});

test("sem as credenciais do IPG, o pagamento online fica desligado (WhatsApp)", async () => {
  const s = process.env.IPG_SHARED_SECRET; delete process.env.IPG_SHARED_SECRET;
  assert.deepEqual((await chamar(apiPedido, { method: "GET" })).json, { ativo: false, provedor: null });
  process.env.IPG_SHARED_SECRET = s;
});
