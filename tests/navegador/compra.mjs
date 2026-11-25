// Compra de ponta a ponta no celular (390 × 844), com a InfinitePay SIMULADA (tests/infinitepay-falso.mjs).
//   INFINITEPAY_HANDLE=natalnoar-teste node tests/infinitepay-falso.mjs 8790
//   ACESSO_SECRET=<32+> ADMIN_TOKEN=b INFINITEPAY_HANDLE=natalnoar-teste INFINITEPAY_API_BASE=http://localhost:8790 \
//     SITE_URL=http://localhost:8767 EMAIL_SAIDA_DIR=<pasta> node tests/servidor.mjs 8767
//   URL=http://localhost:8767/ IP=http://localhost:8790/ EMAILS=<pasta> node compra.mjs <saida>
import { chromium } from "playwright";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
const URL = process.env.URL, IP = process.env.IP, EMAILS = process.env.EMAILS, out = process.argv[2] || ".";
let fails = 0; const ok = (c, m) => { if (!c) fails++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const emails = () => readdirSync(EMAILS).sort().map(f => JSON.parse(readFileSync(join(EMAILS, f), "utf8")));
const linkDe = e => (e.texto.match(/https?:\/\/\S+#acesso=\S+/) || [])[0];
const links = () => fetch(IP + "_links").then(r => r.json());
const b = await chromium.launch();
const celular = () => b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const erros = [];
const nova = async ctx => { const p = await ctx.newPage(); p.on("pageerror", e => erros.push(e.message)); return p; };
const w = (p, ms) => p.waitForTimeout(ms);

/* 1. Natal Pronto (R$ 89,90) por Pix, do plano à campanha */
let ctx = await celular(), p = await nova(ctx);
await p.goto(URL + "#campanha/presentes-por-orcamento"); await w(p, 1200);
await p.locator('[data-plano="natal-pronto"]').first().click(); await w(p, 300);
await p.locator('#planos a[href^="#pedido/"]').first().click(); await w(p, 600);
ok(p.url().endsWith("#pedido/presentes-por-orcamento/natal-pronto"), "plano escolhido abre a revisão do pedido");
const recibo = await p.locator(".recibo").innerText();
ok(/Presentes por orçamento/.test(recibo) && /Natal Pronto/.test(recibo) && /R\$\s?89,90/.test(recibo), "revisão mostra coleção, plano e total de R$ 89,90");
await p.screenshot({ path: `${out}/compra-1-revisao.png`, fullPage: true });
await p.locator('[name="email"]').fill("maria.cliente@teste.com"); await p.locator('[name="confirmacao"]').fill("maria.client@teste.com");
await p.locator(".pg-form button[type=submit]").click(); await w(p, 300);
ok(/não são iguais/.test(await p.locator(".pg-erro").innerText()), "e-mails diferentes: avisa antes de cobrar");
await p.locator('[name="confirmacao"]').fill("maria.cliente@teste.com");
await Promise.all([p.waitForURL(/localhost:8790\/pagar\//), p.locator(".pg-form button[type=submit]").click()]);
ok(/R\$ 89,90/.test(await p.locator("body").innerText()), "a página de pagamento cobra R$ 89,90");
await p.screenshot({ path: `${out}/compra-2-pagamento.png`, fullPage: true });
const n0 = emails().length;
await Promise.all([p.waitForURL(/#retorno/), p.locator("#pix").click()]);
await p.waitForFunction(() => document.body.dataset.retorno === "pago", null, { timeout: 15000 }); await w(p, 300);
ok(/Pagamento confirmado/.test(await p.locator("h1").innerText()) && await p.locator("[data-abrir-campanha]").count() === 1, "volta ao site: \"Pagamento confirmado!\" e \"Abrir minha campanha\"");
ok(/ma•••@teste\.com/.test(await p.locator(".pg-email").innerText()), "mostra para qual e-mail o acesso foi");
await p.screenshot({ path: `${out}/compra-3-retorno.png`, fullPage: true });
const e1 = emails().slice(n0);
ok(e1.length === 1 && e1[0].para === "maria.cliente@teste.com" && /Presentes por orçamento/.test(e1[0].assunto), "e-mail com o acesso enviado uma vez");
await p.locator("[data-abrir-campanha]").click(); await p.waitForSelector(".area-abas", { timeout: 15000 }); await w(p, 600);
ok(/Natal Pronto/i.test(await p.locator(".area-topo").innerText()), "\"Abrir minha campanha\" abre a área no plano comprado");
await ctx.close();

/* 2. O link do e-mail no celular: Presentes por orçamento com os cinco carrosséis certos */
ctx = await celular(); p = await nova(ctx);
await p.goto(linkDe(e1[0]).replace("http://localhost:8767", URL.replace(/\/$/, ""))); await p.waitForSelector(".area-abas", { timeout: 15000 });
await p.goto(URL + "#area/carrosseis"); await p.waitForFunction(() => document.querySelector("#estudio-kit")?.dataset.pronto === "1", null, { timeout: 20000 }); await w(p, 600);
const carr = await p.locator("#estudio-kit [data-es-carr] option").evaluateAll(os => os.map(o => o.value));
ok(JSON.stringify(carr) === JSON.stringify(["ate-100", "cara-dela", "escolha", "duplas", "ainda-da-tempo"]), `link do e-mail: os 5 carrosséis de Presentes por orçamento (${carr.join(", ")})`);
ok(/Presentes por orçamento/.test(await p.locator("h1").innerText()), "link do e-mail abre a coleção escolhida");
await p.screenshot({ path: `${out}/compra-4-email-abre-kit.png` });
await ctx.close();

/* 3. Confirmação repetida: o mesmo acesso */
const l1 = (await links()).find(l => l.email === "maria.cliente@teste.com");
const n1 = emails().length;
await fetch(`${IP}_webhook/${l1.id}`, { method: "POST" });
const rep = emails().slice(n1);
ok(rep.length <= 1 && (!rep.length || linkDe(rep[0]) === linkDe(e1[0])), "confirmação repetida: o mesmo link de acesso, nenhum acesso novo");

/* 4. Pendente: pedido criado, pagamento ainda não confirmado */
ctx = await celular(); p = await nova(ctx);
const ped = await fetch(URL + "api/pedido", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ campanha: "presentes-por-orcamento", plano: "natal-virada", email: "pendente@teste.com", confirmacao: "pendente@teste.com" }) }).then(r => r.json());
await p.goto(`${URL}#retorno?order_nsu=${ped.pedido}&transaction_nsu=ainda-nao&slug=fat-x&capture_method=pix`);
await p.waitForFunction(() => document.body.dataset.retorno === "pendente", null, { timeout: 10000 }); await w(p, 300);
ok(/Aguardando/.test(await p.locator("h1").innerText()) && await p.locator("[data-abrir-campanha]").count() === 0, "pendente: \"Aguardando a confirmação\", sem acesso");
ok(/expirou ou o cartão foi recusado/.test(await p.locator(".pg-dica").innerText()), "orienta se o Pix expirou ou o cartão foi recusado");
await p.screenshot({ path: `${out}/compra-5-pendente.png`, fullPage: true });
await ctx.close();

/* 5. Pix pago e aba fechada: o acesso chega por e-mail mesmo assim */
ctx = await celular(); p = await nova(ctx);
await p.goto(URL + "#pedido/presentes-por-orcamento/natal-pronto"); await w(p, 400);
await p.locator('[name="email"]').fill("fechou@teste.com"); await p.locator('[name="confirmacao"]').fill("fechou@teste.com");
await Promise.all([p.waitForURL(/localhost:8790\/pagar\//), p.locator(".pg-form button[type=submit]").click()]);
const n2 = emails().length;
await p.locator("#pix-fechar").click(); await w(p, 600); await ctx.close();
const fe = emails().slice(n2);
ok(fe.length === 1 && fe[0].para === "fechou@teste.com" && linkDe(fe[0]), "fechou a aba depois do Pix: o link chega por e-mail");

/* 6. Cartão recusado: nada é liberado */
ctx = await celular(); p = await nova(ctx);
await p.goto(URL + "#pedido/seu-toque-nas-festas/natal-completo"); await w(p, 400);
await p.locator('[name="email"]').fill("recusado@teste.com"); await p.locator('[name="confirmacao"]').fill("recusado@teste.com");
await Promise.all([p.waitForURL(/localhost:8790\/pagar\//), p.locator(".pg-form button[type=submit]").click()]);
const n3 = emails().length;
await p.locator("#recusado").click(); await w(p, 500);
ok(emails().length === n3, "cartão recusado: nenhum acesso liberado");
/* 7. Cartão aprovado: Seu toque nas festas, Natal Completo (R$ 139,90) */
await p.goBack(); await w(p, 300);
await Promise.all([p.waitForURL(/#retorno/), p.locator("#cartao").click()]);
await p.waitForFunction(() => document.body.dataset.retorno === "pago", null, { timeout: 15000 });
ok(/Seu toque nas festas/.test(await p.locator(".recibo").innerText()) && /R\$\s?139,90/.test(await p.locator(".recibo").innerText()), "cartão aprovado: Seu toque nas festas, R$ 139,90");
await p.locator("[data-abrir-campanha]").click(); await p.waitForSelector(".area-abas");
await p.goto(URL + "#area/carrosseis"); await p.waitForFunction(() => document.querySelector("#estudio-kit")?.dataset.pronto === "1", null, { timeout: 20000 });
ok(await p.locator("#estudio-kit [data-es-carr] option").count() === 8, "Natal Completo: 8 carrosséis");
// reenviar o e-mail na página de retorno
await p.goBack(); await p.goBack(); await w(p, 400);
const n4 = emails().length;
if (await p.locator("[data-rt-reenviar]").count()) { await p.locator("[data-rt-reenviar]").click(); await w(p, 1500); }
ok(emails().length === n4 + 1 && emails().at(-1).para === "recusado@teste.com", "\"reenvie o e-mail\" manda o acesso de novo, sem nova cobrança");
const total = await links();
ok(total.filter(l => l.email === "recusado@teste.com").length === 1, "um único link de pagamento para esse pedido");
await ctx.close();

ok(!erros.length, "sem erros de JS " + erros.join(" | "));
console.log(fails ? `${fails} FALHA(S)` : "TUDO OK"); await b.close(); process.exit(fails ? 1 : 0);
