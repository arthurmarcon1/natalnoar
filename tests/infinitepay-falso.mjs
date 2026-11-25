// Simulador LOCAL da InfinitePay (Checkout Integrado), só para testes. A InfinitePay não tem ambiente de testes.
// Segue os campos da documentação oficial: POST /links, webhook, volta para redirect_url e POST /payment_check.
// Uso: node tests/infinitepay-falso.mjs 8790   (e o servidor do site com INFINITEPAY_API_BASE=http://localhost:8790)
//   GET  /pagar/<id>            página de pagamento falsa (Pix, cartão aprovado, cartão recusado, pagar e fechar a aba)
//   POST /_webhook/<id>         reenvia o aviso (confirmação repetida)
//   GET  /_links                estado, para os testes
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
const porta = +process.argv[2] || 8790, HANDLE = process.env.INFINITEPAY_HANDLE || "natalnoar-teste";
const links = new Map();
const lerJSON = req => new Promise(ok => { let s = ""; req.on("data", c => s += c); req.on("end", () => { try { ok(JSON.parse(s || "{}")); } catch { ok(null); } }); });
const responder = (res, st, corpo, tipo = "application/json") => { res.statusCode = st; res.setHeader("content-type", tipo); res.end(typeof corpo === "string" ? corpo : JSON.stringify(corpo)); };
const aviso = l => ({ invoice_slug: l.slug, amount: l.preco, paid_amount: l.preco, installments: 1, capture_method: l.metodo, transaction_nsu: l.transacao, order_nsu: l.corpo.order_nsu, receipt_url: `http://localhost:${porta}/recibo/${l.id}`, items: l.corpo.items });
async function enviarWebhook(l) {
  if (!l.corpo.webhook_url) return 0;
  try { const r = await fetch(l.corpo.webhook_url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(aviso(l)) }); l.avisos.push(r.status); return r.status; }
  catch { l.avisos.push("erro"); return 0; }
}
createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "POST" && url.pathname === "/links") {
    const b = await lerJSON(req);
    if (!b || b.handle !== HANDLE) return responder(res, 400, { error: "external_checkout_not_enabled", message: "External checkout is not enabled for this merchant" });
    const it = Array.isArray(b.items) && b.items[0];
    if (!it || !Number.isInteger(it.price) || it.price < 100 || it.quantity !== 1) return responder(res, 422, { error: "invalid_items" });
    const id = randomUUID().slice(0, 8), preco = it.price;
    links.set(id, { id, corpo: b, preco, pago: false, slug: `fat-${id}`, transacao: null, metodo: null, avisos: [] });
    return responder(res, 200, { url: `http://localhost:${porta}/pagar/${id}` });
  }
  if (req.method === "POST" && url.pathname === "/payment_check") {
    const b = await lerJSON(req) || {};
    const l = [...links.values()].find(x => x.corpo.order_nsu === b.order_nsu && x.slug === b.slug && x.transacao === b.transaction_nsu);
    if (!l || b.handle !== HANDLE) return responder(res, 200, { success: false, paid: false });
    return responder(res, 200, { success: true, paid: l.pago, amount: l.preco, paid_amount: l.preco, installments: 1, capture_method: l.metodo });
  }
  if (req.method === "GET" && url.pathname === "/_links") return responder(res, 200, [...links.values()].map(l => ({ id: l.id, order_nsu: l.corpo.order_nsu, preco: l.preco, pago: l.pago, slug: l.slug, transacao: l.transacao, avisos: l.avisos, descricao: l.corpo.items[0].description, email: l.corpo.customer && l.corpo.customer.email })));
  let m = url.pathname.match(/^\/_webhook\/(\w+)$/);
  if (req.method === "POST" && m && links.has(m[1])) return responder(res, 200, { status: await enviarWebhook(links.get(m[1])) });
  m = url.pathname.match(/^\/pagar\/(\w+)$/);
  if (req.method === "GET" && m && links.has(m[1])) {
    const l = links.get(m[1]);
    return responder(res, 200, `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>InfinitePay (simulador)</title>
<body style="font-family:system-ui;max-width:420px;margin:auto;padding:20px">
<p style="background:#fff3cd;padding:8px;border-radius:8px"><b>Simulador local</b>: nenhum dinheiro de verdade.</p>
<h2>${l.corpo.items[0].description}</h2><p style="font-size:28px;font-weight:800">R$ ${(l.preco / 100).toFixed(2).replace(".", ",")}</p>
<p>${l.pago ? "Pago." : "Escolha:"}</p>
<form method="post" action="/pagar/${l.id}/pix"><button id="pix" style="font-size:18px;padding:12px;width:100%">Pagar com Pix</button></form><br>
<form method="post" action="/pagar/${l.id}/cartao"><button id="cartao" style="font-size:18px;padding:12px;width:100%">Pagar com cartão</button></form><br>
<form method="post" action="/pagar/${l.id}/recusado"><button id="recusado" style="padding:10px;width:100%">Cartão recusado</button></form><br>
<form method="post" action="/pagar/${l.id}/pix-fechar"><button id="pix-fechar" style="padding:10px;width:100%">Pagar com Pix e fechar a aba (sem voltar)</button></form></body>`, "text/html; charset=utf-8");
  }
  m = url.pathname.match(/^\/pagar\/(\w+)\/(pix|cartao|recusado|pix-fechar)$/);
  if (req.method === "POST" && m && links.has(m[1])) {
    const l = links.get(m[1]), acao = m[2];
    if (acao === "recusado") return responder(res, 200, `<body style="font-family:system-ui;padding:20px"><h2 id="recusado-msg">Pagamento recusado pelo banco.</h2><a href="/pagar/${l.id}">Tentar de novo</a></body>`, "text/html; charset=utf-8");
    l.pago = true; l.metodo = acao === "cartao" ? "credit_card" : "pix"; l.transacao = l.transacao || randomUUID();
    await enviarWebhook(l);
    if (acao === "pix-fechar") return responder(res, 200, `<body style="font-family:system-ui;padding:20px"><h2 id="pago-msg">Pix pago.</h2></body>`, "text/html; charset=utf-8");
    const volta = new URL(l.corpo.redirect_url);
    for (const [k, v] of Object.entries({ receipt_url: `http://localhost:${porta}/recibo/${l.id}`, order_nsu: l.corpo.order_nsu, slug: l.slug, capture_method: l.metodo, transaction_nsu: l.transacao })) volta.searchParams.set(k, v);
    res.statusCode = 303; res.setHeader("location", volta.toString()); return res.end();
  }
  responder(res, 404, { error: "not_found" });
}).listen(porta, () => console.log(`InfinitePay falsa em http://localhost:${porta}/`));
