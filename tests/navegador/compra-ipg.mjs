// Compra de ponta a ponta no celular (390 × 844) com o IPG do Sicredi SIMULADO (tests/ipg-falso.mjs).
//   IPG_STORENAME=loja IPG_SHARED_SECRET=seg node tests/ipg-falso.mjs 8791
//   ACESSO_SECRET=<32+> ADMIN_TOKEN=b PAGAMENTO_PROVEDOR=ipg IPG_STORENAME=loja IPG_SHARED_SECRET=seg \
//     IPG_URL=http://localhost:8791/connect/gateway/processing SITE_URL=http://localhost:8767 EMAIL_SAIDA_DIR=<pasta> node tests/servidor.mjs 8767
//   URL=http://localhost:8767/ IPG=http://localhost:8791/ EMAILS=<pasta> node compra-ipg.mjs <saida>
import { chromium } from "playwright";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const URL = process.env.URL, IPG = process.env.IPG, EMAILS = process.env.EMAILS, out = process.argv[2] || ".";
let fails = 0; const ok = (c, m) => { if (!c) fails++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const emails = () => readdirSync(EMAILS).sort().map(f => JSON.parse(readFileSync(join(EMAILS, f), "utf8")));
const linkDe = e => (e.texto.match(/https?:\/\/\S+#acesso=\S+/) || [])[0];
const trans = () => fetch(IPG + "_transacoes").then(r => r.json());
const b = await chromium.launch(), erros = [];
const celular = () => b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const nova = async ctx => { const p = await ctx.newPage(); p.on("pageerror", e => erros.push(e.message)); return p; };
const w = (p, ms) => p.waitForTimeout(ms);
async function ateOPagamento(p, rota, email) {
  await p.goto(URL + rota); await p.waitForSelector(".pg-form:not([hidden])", { timeout: 10000 });
  await p.locator('[name="email"]').fill(email); await p.locator('[name="confirmacao"]').fill(email);
  await Promise.all([p.waitForURL(/localhost:8791\/connect/), p.locator(".pg-form button[type=submit]").click()]);
}

/* 1. Natal Pronto (R$ 89,90), cartão aprovado */
let ctx = await celular(), p = await nova(ctx);
await p.goto(URL + "#campanha/presentes-por-orcamento"); await w(p, 1200);
await p.locator('[data-plano="natal-pronto"]').first().click(); await w(p, 300);
await p.locator('#planos a[href^="#pedido/"]').first().click(); await p.waitForSelector(".pg-form:not([hidden])", { timeout: 10000 });
ok(/página segura do Sicredi/.test(await p.locator("[data-pg-metodos]").innerText()), "revisão: \"Você paga na página segura do Sicredi\"");
ok(/R\$\s?89,90/.test(await p.locator(".recibo").innerText()), "revisão: total de R$ 89,90");
await p.screenshot({ path: `${out}/ipg-1-revisao.png`, fullPage: true });
await p.locator('[name="email"]').fill("maria@teste.com"); await p.locator('[name="confirmacao"]').fill("maria@teste.com");
await Promise.all([p.waitForURL(/localhost:8791\/connect/), p.locator(".pg-form button[type=submit]").click()]);
ok(await p.locator("#erro-hash").count() === 0 && /R\$ 89,90/.test(await p.locator("body").innerText()), "IPG aceita o formulário assinado (hash e loja) e cobra R$ 89,90");
await p.screenshot({ path: `${out}/ipg-2-pagina-segura.png`, fullPage: true });
const n0 = emails().length;
await Promise.all([p.waitForURL(/#retorno/), p.locator("#aprovar").click()]);
await p.waitForFunction(() => document.body.dataset.retorno === "pago", null, { timeout: 15000 }); await w(p, 300);
ok(/Pagamento confirmado/.test(await p.locator("h1").innerText()) && await p.locator("[data-abrir-campanha]").count() === 1, "volta: \"Pagamento confirmado!\" e \"Abrir minha campanha\"");
await p.screenshot({ path: `${out}/ipg-3-confirmado.png`, fullPage: true });
const e1 = emails().slice(n0);
ok(e1.length === 1 && e1[0].para === "maria@teste.com", "aviso do IPG: e-mail com o acesso enviado uma vez");
await p.locator("[data-abrir-campanha]").click(); await p.waitForSelector(".area-abas", { timeout: 15000 });
ok(/Natal Pronto/i.test(await p.locator(".area-topo").innerText()), "\"Abrir minha campanha\" abre a área no plano comprado");
await ctx.close();

/* 2. link do e-mail no celular: os cinco carrosséis certos */
ctx = await celular(); p = await nova(ctx);
await p.goto(linkDe(e1[0])); await p.waitForSelector(".area-abas", { timeout: 15000 });
await p.goto(URL + "#area/carrosseis"); await p.waitForFunction(() => document.querySelector("#estudio-kit")?.dataset.pronto === "1", null, { timeout: 20000 });
const carr = await p.locator("#estudio-kit [data-es-carr] option").evaluateAll(os => os.map(o => o.value));
ok(JSON.stringify(carr) === JSON.stringify(["ate-100", "cara-dela", "escolha", "duplas", "ainda-da-tempo"]), `link do e-mail: os 5 carrosséis de Presentes por orçamento (${carr.join(", ")})`);
await ctx.close();

/* 3. aviso repetido: o mesmo acesso */
const t1 = (await trans()).find(t => t.status === "APPROVED");
const n1 = emails().length; await fetch(`${IPG}_aviso/${t1.id}`, { method: "POST" });
const rep = emails().slice(n1);
ok(rep.length <= 1 && (!rep.length || linkDe(rep[0]) === linkDe(e1[0])), "aviso repetido: o mesmo link, nenhum acesso novo");

/* 4. cartão recusado: nada liberado, orientação para tentar de novo */
ctx = await celular(); p = await nova(ctx);
await ateOPagamento(p, "#pedido/presentes-por-orcamento/natal-completo", "recusado@teste.com");
const n2 = emails().length;
await Promise.all([p.waitForURL(/#retorno/), p.locator("#recusar").click()]);
await p.waitForFunction(() => document.body.dataset.retorno === "recusado", null, { timeout: 10000 });
ok(/não aprovado/.test(await p.locator("h1").innerText()) && /nada foi cobrado/.test(await p.locator("#retorno").innerText()) && emails().length === n2, "cartão recusado: \"Pagamento não aprovado\", nada cobrado, nenhum acesso");
ok((await p.locator("#retorno a.btn").getAttribute("href")) === "#pedido/presentes-por-orcamento/natal-completo", "\"Tentar de novo\" volta para o mesmo plano");
await p.screenshot({ path: `${out}/ipg-4-recusado.png`, fullPage: true });
await ctx.close();

/* 5. Pix aguardando, aba fechada, confirmado depois: o acesso chega por e-mail */
ctx = await celular(); p = await nova(ctx);
await ateOPagamento(p, "#pedido/presentes-por-orcamento/natal-pronto", "pix@teste.com");
await Promise.all([p.waitForURL(/#retorno/), p.locator("#aguardar").click()]);
await p.waitForFunction(() => document.body.dataset.retorno === "pendente", null, { timeout: 10000 });
ok(/Aguardando/.test(await p.locator("h1").innerText()), "pagamento aguardando: \"Aguardando a confirmação do pagamento\"");
await p.screenshot({ path: `${out}/ipg-5-aguardando.png`, fullPage: true });
await ctx.close();
const n3 = emails().length, tp = (await trans()).find(t => t.status === "WAITING");
await fetch(`${IPG}_confirmar/${tp.id}`, { method: "POST" });
const ep = emails().slice(n3);
ok(ep.length === 1 && ep[0].para === "pix@teste.com" && linkDe(ep[0]), "confirmado depois, com a aba fechada: o link chega por e-mail");

/* 6. Seu toque nas festas, Natal Completo: 8 carrosséis */
ctx = await celular(); p = await nova(ctx);
await ateOPagamento(p, "#pedido/seu-toque-nas-festas/natal-completo", "ana@teste.com");
ok(/R\$ 139,90/.test(await p.locator("body").innerText()), "Natal Completo: R$ 139,90 na página segura");
await Promise.all([p.waitForURL(/#retorno/), p.locator("#aprovar").click()]);
await p.waitForFunction(() => document.body.dataset.retorno === "pago", null, { timeout: 15000 });
await p.locator("[data-abrir-campanha]").click(); await p.waitForSelector(".area-abas");
await p.goto(URL + "#area/carrosseis"); await p.waitForFunction(() => document.querySelector("#estudio-kit")?.dataset.pronto === "1", null, { timeout: 20000 });
ok(await p.locator("#estudio-kit [data-es-carr] option").count() === 8 && /Seu toque/.test(await p.locator("h1").innerText()), "Seu toque nas festas, Natal Completo: 8 carrosséis");
await ctx.close();

ok(!erros.length, "sem erros de JS " + erros.join(" | "));
console.log(fails ? `${fails} FALHA(S)` : "TUDO OK"); await b.close(); process.exit(fails ? 1 : 0);
