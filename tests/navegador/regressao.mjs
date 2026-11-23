// Checagem rápida de regressão (celular 390 px). Uso igual ao de galeria.mjs: URL=... ADMIN_TOKEN=... node regressao.mjs
import { chromium } from "playwright";
const U = process.env.URL, ADMIN = process.env.ADMIN_TOKEN; let f = 0;
const ok = (c, m) => { if (!c) f++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage(); const errs = []; p.on("pageerror", e => errs.push(e.message));
for (const r of ["#inicio", "#campanhas", "#campanha/seu-toque-nas-festas", "#testar/seu-toque-nas-festas", "#pedido/seu-toque-nas-festas/natal-virada", "#pedido/presentes-por-orcamento/natal-completo"]) {
  await p.goto(U + r, { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth) && !/peças prontas/.test(await p.locator("body").innerText()), `${r}: carrega, sem rolagem lateral, sem "peças prontas"`);
}
ok((await p.locator(".recibo").innerText()).includes("R$ 139,90"), "pedido do Completo com R$ 139,90");
await p.goto(U + "#campanha/seu-toque-nas-festas", { waitUntil: "networkidle" }); await p.waitForTimeout(2500);
ok(await p.locator(".plano").first().locator(".pl-capas img").count() === 4, "prestadoras: cartões com as capas da própria campanha");
const r = await fetch(new URL("/api/liberar", U), { method: "POST", headers: { "content-type": "application/json", "x-admin-token": ADMIN }, body: JSON.stringify({ campanha: "presentes-por-orcamento", plano: "natal-virada" }) });
const tk = (await r.json()).link.split("#acesso=")[1];
await p.goto(new URL(`/#acesso=${tk}`, U).href, { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
ok(await p.locator("[data-item]").count() === 11, "área Natal + Virada: 11 carrosséis");
await p.locator('[data-item="5"]').click(); await p.waitForTimeout(1200);
ok(await p.locator(".ed-tela canvas").count() === 4 && await p.locator("#editor-completo [data-cor]").count() === 0, "tema extra (sem modelo novo ainda) abre no editor com o desenho atual");
await p.locator('[data-item="0"]').click(); await p.waitForTimeout(1200);
ok(await p.locator("#editor-completo [data-cor]").count() === 4, "carrossel 1 abre com a composição nova");
ok(errs.length === 0, `sem erros de JS ${errs.join(" | ")}`);
console.log(f ? `${f} FALHA(S)` : "TUDO OK"); await b.close();
