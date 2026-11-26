// Simulador LOCAL do IPG do Sicredi (Fiserv Connect), só para testes. Segue o Connect Integration Guide:
// formulário assinado (hashExtended), página de pagamento, volta por formulário com response_hash e aviso com notification_hash.
// Uso: IPG_STORENAME=... IPG_SHARED_SECRET=... node tests/ipg-falso.mjs 8791
//   (e o site com IPG_URL=http://localhost:8791/connect/gateway/processing)
//   POST /_confirmar/<id>  confirma um pagamento que ficou aguardando (como um Pix pago depois)
//   POST /_aviso/<id>      reenvia o último aviso (confirmação repetida)
//   GET  /_transacoes      estado, para os testes
import { createServer } from "node:http";
import { createHmac, randomUUID } from "node:crypto";
const porta = +process.argv[2] || 8791, LOJA = process.env.IPG_STORENAME, SEGREDO = process.env.IPG_SHARED_SECRET;
const trans = new Map();
const hmac = s => createHmac("sha256", SEGREDO).update(s).digest("base64");
const ler = req => new Promise(ok => { let s = ""; req.on("data", c => s += c); req.on("end", () => ok(Object.fromEntries(new URLSearchParams(s)))); });
const html = (res, corpo) => { res.setHeader("content-type", "text/html; charset=utf-8"); res.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui;max-width:420px;margin:auto;padding:20px">${corpo}</body>`); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function resultado(t, status) {
  const approval_code = status === "APPROVED" ? `Y:${String(Math.floor(Math.random() * 1e6)).padStart(6, "0")}:4567:YYYM:${t.id}` : status === "WAITING" ? "?:waiting" : "N:05:Nao autorizada";
  const r = { approval_code, oid: t.campos.oid, status, txndatetime: t.campos.txndatetime, chargetotal: t.campos.chargetotal, currency: t.campos.currency, ipgTransactionId: t.id, processor_response_code: status === "APPROVED" ? "00" : "05", ...(status === "DECLINED" ? { fail_reason: "Transação não autorizada pelo emissor" } : {}) };
  r.response_hash = hmac([r.approval_code, r.chargetotal, r.currency, r.txndatetime, LOJA].join("|"));
  r.notification_hash = hmac([r.chargetotal, r.currency, r.txndatetime, LOJA, r.approval_code].join("|"));
  return r;
}
async function avisar(t, r) {
  t.ultimo = r;
  const { response_hash, ...aviso } = r;
  try { const x = await fetch(t.campos.transactionNotificationURL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(aviso) }); t.avisos.push(x.status); return x.status; }
  catch { t.avisos.push("erro"); return 0; }
}
const voltar = (res, url, r) => { const { notification_hash, ...volta } = r;
  html(res, `<p>Redirecionando…</p><form id="f" method="post" action="${esc(url)}">${Object.entries(volta).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join("")}</form><script>document.getElementById("f").submit()</script>`); };
createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  if (req.method === "POST" && u.pathname === "/connect/gateway/processing") {
    const c = await ler(req), { hashExtended, ...resto } = c;
    const nomes = Object.keys(resto).filter(k => resto[k] !== "").sort(), esperado = hmac(nomes.map(k => resto[k]).join("|"));
    if (c.storename !== LOJA || hashExtended !== esperado) return html(res, `<h2 id="erro-hash">Erro: hash inválido ou loja desconhecida.</h2>`);
    if (!/^[A-Za-z0-9-]{1,32}$/.test(c.oid || "") || c.currency !== "986" || !/^\d+\.\d{2}$/.test(c.chargetotal)) return html(res, `<h2 id="erro-campos">Erro: campos inválidos.</h2>`);
    const id = randomUUID().slice(0, 8); trans.set(id, { id, campos: c, avisos: [], ultimo: null });
    return html(res, `<p style="background:#fff3cd;padding:8px;border-radius:8px"><b>Simulador do IPG Sicredi</b>: nenhum dinheiro de verdade.</p>
      <h2>Pagamento seguro</h2><p style="font-size:28px;font-weight:800">R$ ${c.chargetotal.replace(".", ",")}</p><p>Pedido ${esc(c.oid)}</p>
      <form method="post" action="/pagar/${id}/aprovar"><button id="aprovar" style="font-size:18px;padding:12px;width:100%">Pagar com cartão (aprovado)</button></form><br>
      <form method="post" action="/pagar/${id}/recusar"><button id="recusar" style="padding:10px;width:100%">Cartão recusado</button></form><br>
      <form method="post" action="/pagar/${id}/aguardar"><button id="aguardar" style="padding:10px;width:100%">Pix (aguardando confirmação)</button></form>`);
  }
  let m = u.pathname.match(/^\/pagar\/(\w+)\/(aprovar|recusar|aguardar)$/);
  if (req.method === "POST" && m && trans.has(m[1])) {
    const t = trans.get(m[1]), st = { aprovar: "APPROVED", recusar: "DECLINED", aguardar: "WAITING" }[m[2]], r = resultado(t, st);
    await avisar(t, r);
    return voltar(res, st === "DECLINED" ? t.campos.responseFailURL : t.campos.responseSuccessURL, r);
  }
  m = u.pathname.match(/^\/_(confirmar|aviso)\/(\w+)$/);
  if (req.method === "POST" && m && trans.has(m[2])) { const t = trans.get(m[2]); const r = m[1] === "confirmar" ? resultado(t, "APPROVED") : t.ultimo; res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ status: await avisar(t, r) })); }
  if (u.pathname === "/_transacoes") { res.setHeader("content-type", "application/json"); return res.end(JSON.stringify([...trans.values()].map(t => ({ id: t.id, oid: t.campos.oid, valor: t.campos.chargetotal, avisos: t.avisos, status: t.ultimo && t.ultimo.status, sucesso: t.campos.responseSuccessURL })))); }
  res.statusCode = 404; res.end("não encontrado");
}).listen(porta, () => console.log(`IPG falso em http://localhost:${porta}/`));
