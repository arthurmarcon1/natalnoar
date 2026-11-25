// Página inicial (celular e computador) e página da campanha. Uso:
//   URL=http://localhost:8767/ node vitrine.mjs <pasta-de-saída>
import { chromium } from "playwright";
const URL = process.env.URL, out = process.argv[2] || ".";
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const browser = await chromium.launch();
const novo = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, ...opts });
  const page = await ctx.newPage(); page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("console", m => m.type() === "error" && !/401|503|Failed to load resource/.test(m.text()) && page.errs.push(m.text()));
  return { ctx, page };
};
const w = (p, ms) => p.waitForTimeout(ms);
const semRolagem = p => p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const arrastar = async (ctx, page, sel, de, ate) => {
  const b = await page.locator(sel).boundingBox(), y = Math.round(b.y + b.height / 2), cdp = await ctx.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: de, y }] });
  for (let x = de; de > ate ? x >= ate : x <= ate; x += de > ate ? -20 : 20) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] }); await w(page, 16); }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};

/* ===== página inicial: chamada com a volta à mão, leque de capas, nome na capa, vídeo, galeria ===== */
let ctx, page;
const prontoHome = p => p.waitForFunction(() => document.querySelector(".ab")?.dataset.pronto === "1", null, { timeout: 15000 });
const pixel = (p, i) => p.evaluate(i => { const c = document.querySelectorAll(".ab-capa canvas")[i]; const d = c.getContext("2d").getImageData(0, 0, 1080, 400).data; let h = 0; for (let k = 0; k < d.length; k += 97) h = (h * 31 + d[k]) >>> 0; return h; }, i);
const frente = p => p.evaluate(() => document.querySelector(".ab").dataset.carrossel);
for (const [nome, opts] of [["celular", { viewport: { width: 390, height: 844 } }], ["computador", { viewport: { width: 1366, height: 820 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 }]]) {
  ({ ctx, page } = await novo(opts));
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  // os botões funcionam enquanto a volta ainda está sendo desenhada
  await page.waitForSelector('.seg [data-seg="servico"]');
  await prontoHome(page);
  const durante = await page.evaluate(() => document.querySelector(".ab-vp").dataset.volta !== "1");
  await page.locator('.seg [data-seg="servico"]').click(); await page.locator('.seg [data-seg="loja"]').click();
  ok(durante && await page.locator('.seg [data-seg="loja"]').getAttribute("aria-checked") === "true", `${nome}: os botões respondem durante a animação da volta`);
  await page.waitForFunction(() => document.querySelector(".ab-vp").dataset.volta === "1", null, { timeout: 5000 }); await w(page, 600);
  const h1 = await page.evaluate(() => ({ txt: document.querySelector("h1").innerText.replace(/\s+/g, " ").trim(), pre: parseFloat(getComputedStyle(document.querySelector(".ab-pre")).fontSize), big: parseFloat(getComputedStyle(document.querySelector(".ab-big")).fontSize), fam: getComputedStyle(document.querySelector(".ab-h1")).fontFamily, btn: getComputedStyle(document.querySelector(".seg button")).fontFamily, vp: document.querySelector(".ab-vp em").getClientRects().length }));
  ok(h1.txt === "Fim de ano corrido? Seu conteúdo vem pronto." && h1.big > h1.pre * 1.8 && h1.vp === 1, `${nome}: "Fim de ano corrido?" menor e "Seu conteúdo vem pronto." grande, com "vem pronto." numa linha só`);
  ok(/Bricolage/.test(h1.fam) && /Bricolage/.test(h1.btn), `${nome}: chamada e botões em sem serifa de traço firme (Bricolage Grotesque)`);
  const volta = await page.evaluate(() => { const path = document.querySelector(".ab-traco"), svg = document.querySelector(".ab-volta").getBoundingClientRect(), b = path.getBBox(), em = document.querySelector(".ab-vp em").getBoundingClientRect();
    return { x0: svg.left + b.x, x1: svg.left + b.x + b.width, y0: svg.top + b.y, y1: svg.top + b.y + b.height, em: [em.left, em.right, em.top, em.bottom], vw: document.documentElement.clientWidth, off: parseFloat(getComputedStyle(path).strokeDashoffset) }; });
  ok(volta.x0 >= 0 && volta.x1 <= volta.vw && volta.x0 < volta.em[0] && volta.x1 > volta.em[1] && volta.y0 < volta.em[2] && volta.y1 > volta.em[3] && volta.off < 1, `${nome}: a volta fecha por fora de "vem pronto." e cabe na tela (${Math.round(volta.x0)}–${Math.round(volta.x1)} de ${volta.vw})`);
  const fundo = await page.evaluate(() => [getComputedStyle(document.body).backgroundColor, getComputedStyle(document.querySelector(".ab")).backgroundImage]);
  ok(fundo[0] === "rgb(255, 251, 246)" && fundo[1] === "none", `${nome}: fundo branco quente, sem degradê rosa`);
  const segs = await page.locator(".seg [data-seg]").allInnerTexts();
  ok(segs.join("|") === "Tenho uma loja|Presto serviços", `${nome}: "Tenho uma loja" e "Presto serviços" logo abaixo da chamada`);
  ok(await page.locator(".ab-capa canvas").count() === 3 && await frente(page) === "ate-100", `${nome}: loja abre com 3 capas reais e "5 presentes até R$ 100" na frente`);
  await page.waitForFunction(() => [...document.querySelectorAll(".ab-capa")].every(c => !c.getAnimations().some(a => a.playState === "running")), null, { timeout: 5000 }); await w(page, 500);
  const capa = await page.locator('.ab-capa[data-pos="0"]').boundingBox();
  ok(capa.width >= 250 && capa.x >= 0 && capa.x + capa.width <= opts.viewport.width && capa.y + capa.height <= opts.viewport.height + (nome === "celular" ? 160 : 0), `${nome}: a primeira capa inteira e legível (${Math.round(capa.width)} px de largura)`);
  if (nome === "celular") await page.screenshot({ path: `${out}/home-celular-loja.png` });
  // folhear
  if (nome === "celular") await arrastar(ctx, page, "#ab-pilha", 300, 80); else await page.locator('[data-ab-ir="1"]').click();
  await w(page, 600);
  const f2 = await frente(page);
  ok(f2 === "cara-dela", `${nome}: ${nome === "celular" ? "deslizar o dedo" : "a seta"} folheia para a próxima capa (${f2})`);
  await page.locator('[data-ab-ir="-1"]').click(); await w(page, 500);
  ok(await frente(page) === "ate-100", `${nome}: a seta volta para a primeira capa`);
  // nome na assinatura
  const antes = await pixel(page, 0);
  await page.locator("[data-nome-marca]").fill("Ateliê da Bia"); await w(page, 250);
  ok(await page.evaluate(() => document.querySelector(".ab").dataset.marca) === "Ateliê da Bia" && await pixel(page, 0) !== antes, `${nome}: o nome digitado aparece na capa na hora`);
  await page.locator("[data-nome-marca]").fill("Studio Mariana Albuquerque Beauty & Co"); await w(page, 250);
  ok(await semRolagem(page), `${nome}: nome comprido não quebra a página`);
  // serviços
  await page.locator('.seg [data-seg="servico"]').click(); await w(page, 1200);
  ok(await frente(page) === "tres-estilos" && await page.evaluate(() => document.querySelector(".ab").dataset.marca).then(m => m.startsWith("Studio Mariana")), `${nome}: "Presto serviços" troca para "3 estilos para as festas", mantendo o nome`);
  ok(await page.locator("[data-escolher]").getAttribute("href") === "#campanha/seu-toque-nas-festas", `${nome}: "Escolher minha campanha" leva a Seu toque nas festas`);
  ok(await page.locator("[data-testar]").getAttribute("href") === "#editar/seu-toque-nas-festas/tres-estilos" && await page.locator("#como-editar video source[src$='como-editar.mp4']").count() === 1 && await page.locator("#como-editar video source[src$='como-editar.webm']").count() === 1 && await page.locator("[data-play]").count() === 1, `${nome}: "Veja como editar" com o vídeo e o botão de play`);
  await page.locator("[data-play]").scrollIntoViewIfNeeded(); await page.locator("[data-play]").click(); await w(page, 1500);
  ok(await page.locator("#como-editar video").evaluate(v => !v.paused && v.currentTime > 0 && v.videoWidth === 1080 && v.videoHeight === 1920), `${nome}: o play toca o vídeo (1080 × 1920)`);
  await page.locator("#como-editar video").evaluate(v => v.pause());
  ok(/Pronta para a ceia/.test(await page.locator("#dia1").innerText()), `${nome}: o Dia 1 continua com a peça do calendário`);
  await page.locator("[data-nome-marca]").fill("Bia Make"); await w(page, 300);
  await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/home-${nome}-servico.png` });
  // escolher (campo vazio)
  await page.locator("[data-nome-marca]").fill(""); await w(page, 200);
  await page.locator("[data-escolher]").click(); await w(page, 900);
  ok(page.url().endsWith("#campanha/seu-toque-nas-festas"), `${nome}: com o campo vazio, "Escolher minha campanha" abre a coleção de serviços`);
  await page.goto(URL + "#inicio"); await prontoHome(page); await w(page, 1200);
  // testar o editor
  await page.locator("[data-testar]").click();
  await page.waitForFunction(() => document.querySelector("#estudio")?.dataset.pronto === "1", null, { timeout: 15000 });
  ok(/#editar\/seu-toque-nas-festas\/tres-estilos$/.test(page.url()), `${nome}: "Testar o editor" abre o editor com o modelo em destaque`);
  await page.goto(URL + "#inicio"); await prontoHome(page); await w(page, 1500);
  ok(await page.locator(".gh-capa").count() === 8 && await page.locator(".galeria-home").evaluate(e => getComputedStyle(e).backgroundColor) === "rgb(244, 238, 232)", `${nome}: galeria com as capas lado a lado, no fundo neutro`);
  ok(await page.locator(".venda").count() === 2 && await page.locator("#gestao").count() === 1, `${nome}: campanhas à venda e gestão mensal mais abaixo`);
  ok(await semRolagem(page), `${nome}: página inicial sem rolagem lateral`);
  ok(page.errs.length === 0, `${nome}: sem erros de JS ${page.errs.join(" | ")}`);
  await page.evaluate(() => { try { sessionStorage.clear(); localStorage.removeItem("nna-publico"); } catch {} });
  await ctx.close();
}
/* movimento reduzido: a volta já aparece pronta e as capas trocam sem animação */
({ ctx, page } = await novo({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" }));
await page.goto(URL); await prontoHome(page);
await page.waitForFunction(() => document.querySelector(".ab-vp").dataset.volta === "1", null, { timeout: 3000 }).catch(() => {});
ok(await page.evaluate(() => document.querySelector(".ab-vp").dataset.volta === "1" && parseFloat(getComputedStyle(document.querySelector(".ab-traco")).strokeDashoffset) < 1), "movimento reduzido: a volta aparece pronta");
await page.locator('.seg [data-seg="servico"]').click(); await w(page, 150);
ok(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length) === 0, "movimento reduzido: troca de segmento sem animação");
await ctx.close();

/* ===== campanha: miniaturas, carrossel e Stories ===== */
({ ctx, page } = await novo({ viewport: { width: 390, height: 844 } }));
await page.goto(URL + "#campanha/presentes-por-orcamento", { waitUntil: "networkidle" }); await w(page, 1800);
const cont = () => page.locator(".car-cont").innerText();
await page.locator('[data-pm="2"]').click(); await w(page, 900);
ok(await cont() === "4 / 4" && await page.locator('[data-pm="2"]').getAttribute("aria-checked") === "true", "tocar em Brincos leva a prévia à tela dos brincos (imagem, nome e preço juntos)");
await page.locator('[data-pm="0"]').click(); await w(page, 900);
ok(await cont() === "2 / 4", "tocar em Clutch volta para a tela da clutch");
await arrastar(ctx, page, ".carrossel", 320, 60); await w(page, 900);
ok(await cont() === "3 / 4" && await page.locator('[data-pm="1"]').getAttribute("aria-checked") === "true", "deslizar o carrossel com o dedo acompanha e sincroniza a miniatura");
await page.locator('[data-aba-prev="stories"]').click(); await w(page, 400);
const st = await page.evaluate(() => ({ car: document.getElementById("carrossel").hidden, foto: document.querySelector('.st-f[data-f="1"] img').getAttribute("src"), enq: document.querySelectorAll(".opc").length }));
ok(st.car && /03-lenco/.test(st.foto) && st.enq === 3, "Stories mostra a mesma foto (lenço) e uma enquete");
await page.locator('.opc[data-voto="1"]').click(); await w(page, 1600);
ok((await page.locator(".st-nome").innerText()).startsWith("Lenço de seda"), "a visitante responde a enquete e vê o produto escolhido");
await page.locator('[data-aba-prev="reel"]').click(); await w(page, 400);
ok(await page.locator('.fmt[data-painel="reel"]').isVisible(), "aba Reel mostra as cenas");
await page.locator('[data-aba-prev="carrossel"]').click(); await w(page, 300);
ok(await page.locator("#carrossel").isVisible(), "volta ao carrossel");
// planos: capas extras de cada nível
await page.locator("#planos").scrollIntoViewIfNeeded(); await w(page, 2500);
const niveis = await page.locator(".plano").evaluateAll(cs => cs.map(c => ({ n: c.querySelectorAll(".pl-capas img").length, novas: c.querySelectorAll(".pl-capas img.nova").length, rot: (c.querySelector(".pl-rot") || {}).textContent || "" })));
ok(niveis[0].n === 5 && niveis[1].novas === 3 && /Pronto/.test(niveis[1].rot) && niveis[2].novas === 3 && /Completo/.test(niveis[2].rot), `planos mostram as capas que entram em cada nível (${niveis.map(x => x.n).join("/")})`);
await page.locator('[data-plano="natal-virada"]').click(); await w(page, 300);
ok((await page.locator("#pl-botao a").innerText()).trim() === "Comprar Natal + Virada · R$ 189,90", "botão de compra com o plano escolhido");
ok(await semRolagem(page), "campanha sem rolagem lateral");
await page.locator("#planos").screenshot({ path: `${out}/vit-planos.png` });
ok(page.errs.length === 0, `sem erros de JS ${page.errs.join(" | ")}`);
await ctx.close();
console.log(fails ? `${fails} FALHA(S)` : "TUDO OK");
await browser.close(); process.exit(fails ? 1 : 0);
