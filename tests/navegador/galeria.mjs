// Verificação no navegador (celular 390 px): galeria de modelos, editor, marca-d'água, exportação e cartões dos planos.
// Requer Playwright (fora do projeto). Uso:
//   ACESSO_SECRET=... ADMIN_TOKEN=... node tests/servidor.mjs 8767 &
//   URL=http://localhost:8767/ ADMIN_TOKEN=... node galeria.mjs <pasta-de-saída>
import { chromium } from "playwright";
import { readFileSync, mkdirSync, rmSync } from "node:fs";
const URL = process.env.URL, ADMIN = process.env.ADMIN_TOKEN, out = process.argv[2] || ".", dl = `${out}/dl-galeria`;
rmSync(dl, { recursive: true, force: true }); mkdirSync(dl, { recursive: true });
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const browser = await chromium.launch();
const novo = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, acceptDownloads: true, ...opts });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(URL).origin }).catch(() => {});
  const page = await ctx.newPage(); page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("console", m => m.type() === "error" && !/401|503|Failed to load resource/.test(m.text()) && page.errs.push(m.text()));
  return { ctx, page };
};
const w = (p, ms) => p.waitForTimeout(ms);
const semRolagem = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const etiquetaAmostra = (p, sel, i) => p.evaluate(([sel, i]) => { const d = document.querySelectorAll(sel)[i].getContext("2d").getImageData(1080 - 64 - 80, 70, 30, 30).data; let n = 0; for (let k = 0; k < d.length; k += 4) if (d[k] > 140 && d[k + 1] < 70 && d[k + 2] < 80) n++; return n > 60; }, [sel, i]);
const fotoPropria = page => page.evaluate(() => { const c = document.createElement("canvas"); c.width = 1200; c.height = 1600; const x = c.getContext("2d"); x.fillStyle = "#F7F7F2"; x.fillRect(0, 0, 1200, 1600); x.fillStyle = "#D9CDBD"; x.fillRect(300, 400, 600, 700); return c.toDataURL("image/jpeg", .9).split(",")[1]; });
const subir = async (page, b64, nome = "minha.jpg") => { await page.locator("[data-arquivo]").first().setInputFiles({ name: nome, mimeType: "image/jpeg", buffer: Buffer.from(b64, "base64") }); await w(page, 900); };
const IDS = ["faixa-de-preco", "cada-estilo", "favorito-da-loja", "duplas", "ultimas-compras"];

/* ===== galeria ===== */
let { ctx, page } = await novo();
await page.goto(URL + "#galeria", { waitUntil: "networkidle" }); await w(page, 3500);
const capas = await page.locator(".gal-item img").evaluateAll(is => is.map(i => [i.naturalWidth, i.src.length, i.getAttribute("data-mini")]));
ok(capas.length === 5 && capas.every(c => c[0] > 0), `galeria: 5 capas preenchidas (${capas.map(c => c[2]).join(", ")})`);
ok(new Set(capas.map(c => c[1])).size === 5, "as 5 capas são diferentes entre si");
const cmp = await page.locator(".cmp-grade img").evaluateAll(is => is.map(i => i.naturalWidth));
ok(cmp.length === 2 && cmp.every(n => n > 0), "comparação: capa de Presentes ao lado da capa-piloto de Por trás do resultado");
ok(await page.locator(".ident").count() >= 2, "identidade de cada coleção (paleta, tipografia, fotos, elementos)");
ok(await semRolagem(page), "galeria sem rolagem lateral");
await page.screenshot({ path: `${out}/gal-1.png` });
for (const id of IDS) {
  await page.goto(URL + `#galeria/${id}`, { waitUntil: "networkidle" }); await w(page, 1500);
  const seq = await page.evaluate(() => ({ n: document.querySelectorAll("#seq-carrossel canvas").length, leg: document.getElementById("seq-legenda").innerText, topo: document.getElementById("sequencia").getBoundingClientRect().top }));
  const { MODELOS } = await page.evaluate(async () => ({ MODELOS: (await import("/amostra/modelos.js")).MODELOS }));
  ok(seq.n === 4 && seq.leg.replace(/\s+/g, " ").trim() === MODELOS[id].legenda.replace(/\s+/g, " ").trim() && seq.topo < 200, `${id}: abre a sequência de 4 telas com a legenda própria`);
  if (id === "duplas") await page.screenshot({ path: `${out}/gal-2-duplas.png` });
}
await page.locator("[data-copiar='seq-legenda']").click(); await w(page, 300);
ok((await page.evaluate(() => navigator.clipboard.readText())).includes("Ainda dá tempo") || (await page.evaluate(() => navigator.clipboard.readText())).includes("última hora"), "copiar legenda da sequência");
ok(page.errs.length === 0, `galeria sem erros de JS ${page.errs.join(" | ")}`);
await ctx.close();

/* ===== legibilidade: títulos e preços longos cabem em todas as composições ===== */
({ ctx, page } = await novo());
await page.goto(URL + "#inicio", { waitUntil: "networkidle" });
const leg = await page.evaluate(async () => {
  const { desenharTela, carregarFontes } = await import("/js/render.js");
  const { LAYOUT_INFO } = await import("/js/modelos.js");
  await carregarFontes();
  const longo = { texto: "Bolsa de couro legítimo com alça dourada removível e forro de cetim", preco: "R$ 1.289,90", apoio: "Para a mãe que ama sair, viajar e ainda volta cheia de sacolas", chips: ["Clássica", "Chama atenção", "Correria"] };
  const res = {};
  for (const layout of Object.keys(LAYOUT_INFO)) {
    const c = document.createElement("canvas"), caixas = [];
    desenharTela(c, { ...longo, layout, preco: LAYOUT_INFO[layout].preco ? (/Data/.test(LAYOUT_INFO[layout].preco) ? "23/12" : longo.preco) : "" }, { marca: "Ateliê Aurora Moda e Presentes", indice: 1, total: 4, caixas });
    res[layout] = { dentro: caixas.every(b => b.x >= -1 && b.y >= 0 && b.x + b.w <= 1081 && b.y + b.h <= 1322 && b.w <= b.maxW + 1), cortou: caixas.some(b => b.cortou), menor: Math.min(...caixas.map(b => b.size)), n: caixas.length };
  }
  return res;
});
for (const [l, r] of Object.entries(leg)) ok(r.dentro && !r.cortou && r.n >= 2 && r.menor >= 22, `título longo cabe inteiro e legível em ${l} (menor fonte ${r.menor}px em 1080)`);
await ctx.close();

/* ===== editor do teste grátis: foto, enquadramento, marca, texto, cor, preço, legenda, exportação ===== */
({ ctx, page } = await novo());
await page.goto(URL + "#testar/faixa-de-preco", { waitUntil: "networkidle" }); await w(page, 1800);
const marcas = () => page.locator("#editor-teste").getAttribute("data-marcas");
ok(await page.locator("#editor-teste .ed-tela canvas").count() === 4 && await marcas() === "limpa,limpa,limpa,limpa", "teste abre o layout da vitrine com fotos de exemplo, limpo");
ok(!(await etiquetaAmostra(page, "#editor-teste .ed-tela canvas", 0)), "exemplo sem etiqueta AMOSTRA");
const assin = i => page.evaluate(i => document.querySelectorAll("#editor-teste .ed-tela canvas")[i].toDataURL().length, i);
await page.locator('[data-aba="1"]').click(); await w(page, 200);
const b64 = await fotoPropria(page);
const antesFoto = await assin(1);
await subir(page, b64);
ok(await marcas() === "limpa,amostra,limpa,limpa" && await etiquetaAmostra(page, "#editor-teste .ed-tela canvas", 1) && !(await etiquetaAmostra(page, "#editor-teste .ed-tela canvas", 2)), "foto própria na tela 2: só ela leva AMOSTRA");
ok(await assin(1) !== antesFoto, "trocar a foto muda a tela");
const antesZoom = await assin(1);
await page.locator('[data-aj="zoom"]').fill("1.8"); await w(page, 200);
ok(await assin(1) !== antesZoom, "enquadramento (zoom) muda a tela");
await page.fill("[data-marca]", "Loja da Bia"); await w(page, 300);
await page.fill('[data-campo="texto"]', "Bolsa de couro legítimo com alça dourada removível"); await page.fill('[data-campo="preco"]', "R$ 1.289,90"); await w(page, 400);
const legd = await page.locator("[data-legenda]").innerText();
ok(legd.includes("Loja da Bia"), "legenda acompanha a marca");
const corAntes = await assin(0);
await page.locator('[data-cor]').nth(1).click(); await w(page, 300);
ok(await assin(0) !== corAntes && await page.locator('[data-cor].on').count() === 1, "trocar a cor de destaque redesenha as telas");
await page.locator("#editor-teste .ed-telas").evaluate(el => el.scrollTo({ left: el.querySelectorAll(".ed-tela")[1].offsetLeft - 8 }));
await page.locator("#editor-teste .ed-tela").nth(1).screenshot({ path: `${out}/gal-3-titulo-longo.png` });
await page.locator("[data-copiar-legenda]").click(); await w(page, 300);
ok((await page.evaluate(() => navigator.clipboard.readText())) === legd, "Copiar legenda");
// exportação das 4 telas
const prev = await page.evaluate(() => [...document.querySelectorAll("#editor-teste .ed-tela canvas")].map(c => c.toDataURL("image/png").split(",")[1]));
const recebidos = new Promise(res => { const arr = []; page.on("download", async d => { const f = `${dl}/${d.suggestedFilename()}`; await d.saveAs(f); arr.push([d.suggestedFilename(), readFileSync(f)]); if (arr.length === 4) res(arr); }); });
await page.locator("#editor-teste [data-png]").click();
const arqs = await Promise.race([recebidos, new Promise(r => setTimeout(() => r(null), 15000))]).then(a => a && a.sort((x, y) => x[0].localeCompare(y[0])));
ok(arqs && arqs.map(a => a[0].slice(0, 3)).join() === "01-,02-,03-,04-", `4 PNGs numerados: ${arqs && arqs.map(a => a[0]).join(", ")}`);
if (arqs) ok(arqs.every(([, b], i) => b.readUInt32BE(16) === 1080 && b.readUInt32BE(20) === 1350 && b.toString("base64") === prev[i]), "PNGs 1080 × 1350, iguais à prévia (a tela 2 com AMOSTRA, as outras limpas)");
page.removeAllListeners("download");
// voltar ao exemplo tira a marca
await page.locator('[data-aba="1"]').click(); await page.locator("[data-tirar]").click(); await w(page, 700);
ok(await marcas() === "limpa,limpa,limpa,limpa", "voltar à foto de exemplo tira a marca");
ok(await semRolagem(page), "editor sem rolagem lateral");
ok(page.errs.length === 0, `editor sem erros de JS ${page.errs.join(" | ")}`);
await ctx.close();

/* duplas: segunda foto */
({ ctx, page } = await novo());
await page.goto(URL + "#testar/duplas", { waitUntil: "networkidle" }); await w(page, 1800);
ok(await page.locator(".ed-slots").isVisible(), "duplas: escolha entre Foto 1 e Foto 2");
await page.locator('[data-slot="2"]').click(); await subir(page, b64);
ok((await page.locator("#editor-teste").getAttribute("data-marcas")).startsWith("amostra"), "foto própria na Foto 2 também leva AMOSTRA");
await ctx.close();

/* ===== cartões dos planos ===== */
({ ctx, page } = await novo());
await page.goto(URL + "#campanha/presentes-por-orcamento", { waitUntil: "networkidle" }); await w(page, 3500);
const cards = await page.locator(".plano").evaluateAll(cs => cs.map(c => ({ txt: c.innerText.replace(/\s+/g, " "), capas: [...c.querySelectorAll(".pl-capas img")].filter(i => i.naturalWidth > 0).length, novas: c.querySelectorAll(".pl-capas img.nova").length, right: c.getBoundingClientRect().right })));
const esper = [["Natal Pronto", "R$ 89,90", "5 carrosséis editáveis + 5 roteiros de Reels", "5 sequências de Stories (15 telas)", "Calendário de 10 dias", 5, 0],
  ["Natal Completo", "R$ 139,90", "8 carrosséis + 8 roteiros de Reels", "Calendário de 15 dias", "Por R$ 50 a mais, leve 3 novos temas, cada um com carrossel e roteiro de Reel.", 3, 3],
  ["Natal + Virada", "R$ 189,90", "11 carrosséis + 11 roteiros de Reels", "8 sequências de Stories (24 telas)", "Por mais R$ 50 em relação ao Completo, seu conteúdo de Réveillon também vem pronto.", 3, 3]];
esper.forEach((e, i) => ok(e.slice(0, 5).every(x => cards[i].txt.includes(x)) && cards[i].capas === e[5] && cards[i].novas === e[6] && cards[i].right <= 390, `cartão ${e[0]}: quantidades, textos e ${cards[i].capas} capas reais (${cards[i].novas} novas no nível)`));
const corpo = await page.locator("body").innerText();
ok((corpo.match(/Todos os planos incluem legendas, 3 mensagens de WhatsApp, calendário e tutorial\./g) || []).length === 1, "\"Todos os planos incluem…\" aparece uma vez");
ok(!/peças prontas/.test(corpo), "sem \"peças prontas\"");
await page.locator('[data-plano="natal-completo"]').click(); await w(page, 300);
ok((await page.locator("#pl-botao a").innerText()).trim() === "Comprar Natal Completo · R$ 139,90" && await page.locator("#pl-botao a").evaluate(a => getComputedStyle(a).backgroundColor) === "rgb(179, 18, 46)", "botão cereja com o nome e o preço do plano escolhido");
ok((await page.locator("#gestao, .gestao").count()) === 0 && /Gestão mensal/.test(await page.locator(".menu").innerText()), "gestão mensal separada (no menu, fora da página da campanha)");
await page.locator("#planos").scrollIntoViewIfNeeded(); await page.screenshot({ path: `${out}/gal-4-planos.png` });
ok(await semRolagem(page), "campanha sem rolagem lateral");
await ctx.close();

/* ===== kit pago: mesmo layout, foto própria sem marca ===== */
if (ADMIN) {
  ({ ctx, page } = await novo());
  const r = await fetch(new globalThis.URL("/api/liberar", URL), { method: "POST", headers: { "content-type": "application/json", "x-admin-token": ADMIN }, body: JSON.stringify({ campanha: "presentes-por-orcamento", plano: "natal-pronto", dias: 2 }) });
  const tk = (await r.json()).link.split("#acesso=")[1];
  await page.goto(new globalThis.URL(`/#acesso=${tk}`, URL).href, { waitUntil: "networkidle" }); await w(page, 1800);
  ok(await page.locator("#editor-completo [data-cor]").count() === 4, "kit pago: editor com as cores da coleção");
  await page.locator('[data-aba="1"]').click(); await subir(page, b64);
  ok(await page.locator("#editor-completo").getAttribute("data-marcas") === "limpa,limpa,limpa,limpa" && !(await etiquetaAmostra(page, "#editor-completo .ed-tela canvas", 1)), "kit pago: foto própria sai sem marca-d'água");
  await page.locator('[data-item="3"]').click(); await w(page, 1200);
  ok(await page.locator(".ed-slots").count() === 1 && (await page.locator(".ideia").innerText()).startsWith("Duplas"), "kit pago: Duplas abre com o layout de duas fotos");
  await page.screenshot({ path: `${out}/gal-5-kit.png` });
  ok(page.errs.length === 0, `kit pago sem erros de JS ${page.errs.join(" | ")}`);
  await ctx.close();
}
console.log(fails ? `${fails} FALHA(S)` : "TUDO OK");
await browser.close(); process.exit(fails ? 1 : 0);
