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

/* ===== página inicial: segmento, celular com o carrossel do dia 1, nome na arte, primeiro dia ===== */
let ctx, page;
const prontoHome = p => p.waitForFunction(() => document.querySelector(".h2")?.dataset.pronto === "1", null, { timeout: 15000 });
const pixel = (p, i) => p.evaluate(i => { const c = document.querySelectorAll("[data-ig-tela]")[i]; const d = c.getContext("2d").getImageData(0, 0, 1080, 260).data; let h = 0; for (let k = 0; k < d.length; k += 97) h = (h * 31 + d[k]) >>> 0; return h; }, i);
for (const [nome, opts] of [["celular", { viewport: { width: 390, height: 844 } }], ["computador", { viewport: { width: 1366, height: 820 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 }]]) {
  ({ ctx, page } = await novo(opts));
  await page.goto(URL, { waitUntil: "domcontentloaded" }); await prontoHome(page); await w(page, 300);
  const h1 = await page.evaluate(() => document.querySelector("h1").innerText.replace(/\s+/g, " ").trim());
  const em = await page.evaluate(() => [...document.querySelectorAll("h1 em")].map(e => e.textContent));
  ok(h1 === "Fim de ano corrido? Seu conteúdo vem pronto." && em.join() === "vem pronto.", `${nome}: chamada exata, só "vem pronto." em itálico`);
  const segs = await page.locator(".seg [data-seg]").allInnerTexts();
  ok(segs.join("|") === "Tenho uma loja|Presto serviços", `${nome}: "Tenho uma loja" e "Presto serviços"`);
  ok(await page.locator('.seg [data-seg="loja"]').getAttribute("aria-checked") === "true" && await page.evaluate(() => document.querySelector(".h2").dataset.seg) === "loja", `${nome}: começa em "Tenho uma loja"`);
  const box = { seg: await page.locator(".seg").boundingBox(), cel: await page.locator(".ed").boundingBox(), h: opts.viewport.height };
  ok(box.seg.y + box.seg.height <= box.h && box.cel.y < box.h * 0.75, `${nome}: segmento e celular aparecem juntos na primeira tela (botões até ${Math.round(box.seg.y + box.seg.height)}px, celular a partir de ${Math.round(box.cel.y)}px)`);
  if (nome === "celular") ok(box.cel.y - (box.seg.y + box.seg.height) < 60, "celular: prévia logo abaixo da escolha de segmento");
  else ok(box.cel.x > box.seg.x + box.seg.width, "computador: prévia ao lado da chamada");
  ok(await page.locator(".cel, .ig-top, .ig-acoes, .h2 .selo-pronto, .lat").count() === 0, `${nome}: sem moldura de celular, perfil, ícones do Instagram nem faixa`);
  const capa = await page.locator('[data-ig-tela="0"]').boundingBox();
  ok(Math.abs(capa.width / capa.height - 0.8) < 0.01 && capa.y + capa.height <= box.h + (nome === "celular" ? 140 : 0), `${nome}: capa inteira em 4:5 (${Math.round(capa.width)} × ${Math.round(capa.height)})`);
  ok(await page.locator(".ed-atras").evaluate(c => !c.hidden && c.getBoundingClientRect().right > document.querySelector("#ig-post").getBoundingClientRect().right), `${nome}: borda da próxima tela aparece atrás`);
  ok(await page.evaluate(() => document.querySelector(".h2").dataset.marca) === "Nome da loja aqui", `${nome}: capa "5 presentes até R$ 100" com "Nome da loja aqui"`);
  ok(await page.locator("[data-ig-tela]").count() === 4 && await page.evaluate(() => document.querySelector(".h2").dataset.carrossel) === "ate-100", `${nome}: loja abre com as 4 telas de "5 presentes até R$ 100"`);
  ok(/5 presentes até R\$ 100/.test(await page.locator("#dia1").innerText()) && /Separe cinco produtos da loja e troque as fotos no carrossel\./.test(await page.locator("#dia1").innerText()), `${nome}: primeiro dia "5 presentes até R$ 100" com a instrução do kit`);
  if (nome === "celular") await page.screenshot({ path: `${out}/home-celular-loja.png` });
  // marca na arte, também na tela seguinte
  const antes = await pixel(page, 0);
  await page.locator("[data-nome-marca]").fill("Ateliê da Bia"); await w(page, 250);
  ok(await page.evaluate(() => document.querySelector(".h2").dataset.marca) === "Ateliê da Bia" && await pixel(page, 0) !== antes, `${nome}: o nome digitado entra na arte`);
  if (nome === "celular") { const pb = await page.locator("#ig-post").boundingBox(); await arrastar(ctx, page, "#ig-post", Math.round(pb.x + pb.width - 24), Math.round(pb.x + 30)); }
  else await page.locator('[data-ig-ir="1"]').click();
  await w(page, 700);
  ok(await page.evaluate(() => document.querySelector(".h2").dataset.tela) === "1", `${nome}: ${nome === "celular" ? "deslizar o dedo" : "a seta"} passa para a tela 2`);
  const t2 = await page.locator('[data-ig-tela="1"]').boundingBox(), post = await page.locator("#ig-post").boundingBox();
  ok(Math.abs(t2.x - post.x) < 3, `${nome}: tela 2 inteira à vista`);
  // nome comprido
  await page.locator("[data-nome-marca]").fill("Studio Mariana Albuquerque Beauty & Co"); await w(page, 300);
  const cx = await page.evaluate(async () => { const { desenharEstudio } = await import("/js/estudio.js"); const { CATALOGO } = await import("/catalogo/index.js"); const { estiloOriginal } = await import("/catalogo/colecoes.js");
    const x = CATALOGO["presentes-por-orcamento"].carrosseis[0], cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1350; const out = [];
    x.telas.forEach(t => { const cx = []; desenharEstudio(cv.getContext("2d"), t, estiloOriginal("presentes-por-orcamento", x), { marca: "Studio Mariana Albuquerque Beauty & Co", imgs: [], ajustes: [], caixas: cx }); out.push(...cx.filter(b => b.campo === "marca" && (b.x < 0 || b.x + b.w > 1081))); }); return out.length; });
  ok(cx === 0 && await semRolagem(page), `${nome}: nome comprido cabe na arte (reduz e termina em "…") sem quebrar a página`);
  // trocar de segmento
  await page.locator('.seg [data-seg="servico"]').click(); await w(page, 900);
  ok(await page.evaluate(() => document.querySelector(".h2").dataset.seg) === "servico" && await page.evaluate(() => document.querySelector(".h2").dataset.carrossel) === "tres-estilos", `${nome}: "Presto serviços" abre "3 estilos para as festas"`);
  ok(/Pronta para a ceia/.test(await page.locator("#dia1").innerText()), `${nome}: o Dia 1 continua com a peça do calendário (Pronta para a ceia)`);
  ok((await page.locator("[data-convite]").innerText()) === "Quer ver com o nome da sua marca?", `${nome}: convite muda para "nome da sua marca"`);
  ok(await page.evaluate(() => document.querySelector(".h2").dataset.tela) === "0" && await page.evaluate(() => document.querySelector(".h2").dataset.marca).then(m => m.startsWith("Studio Mariana")), `${nome}: nova coleção abre na capa, com o nome que já estava digitado`);
  ok(await page.locator("[data-quero]").getAttribute("href") === "#campanha/seu-toque-nas-festas", `${nome}: botão de compra leva à campanha de serviços`);
  await page.locator("[data-nome-marca]").fill("Bia Make"); await w(page, 400);
  await page.locator(".h2").evaluate(e => e.scrollIntoView()); await page.evaluate(() => scrollTo(0, 0)); await w(page, 200);
  await page.screenshot({ path: `${out}/home-${nome}-servico.png` });
  // botão com o campo vazio
  await page.locator('.seg [data-seg="loja"]').click(); await w(page, 900);
  await page.locator("[data-nome-marca]").fill(""); await w(page, 300);
  ok(await page.evaluate(() => document.querySelector(".h2").dataset.marca) === "Nome da loja aqui", `${nome}: campo vazio volta para "Nome da loja aqui"`);
  if (nome === "computador") await page.screenshot({ path: `${out}/home-computador-loja.png` });
  const quero = page.locator("[data-quero]");
  ok((await quero.innerText()).replace(/\s+/g, " ") === "Quero essa campanha · a partir de R$ 89,90", `${nome}: "Quero essa campanha · a partir de R$ 89,90"`);
  await quero.click(); await w(page, 1500);
  const pl = await page.locator("#planos").boundingBox();
  ok(page.url().endsWith("#campanha/presentes-por-orcamento") && pl && Math.abs(pl.y) < 140, `${nome}: com o campo vazio, o botão abre os planos de Presentes por orçamento`);
  // o resto da página
  await page.goto(URL + "#inicio"); await prontoHome(page); await w(page, 1500);
  ok(await page.locator(".venda").count() === 2 && await page.locator(".venda img").evaluateAll(is => is.every(i => i.naturalWidth > 0)) && /A partir de R\$ 89,90/.test(await page.locator(".vendas").innerText()), `${nome}: as duas campanhas à venda com capa, público e preço`);
  ok(await page.locator(".gh-capa").count() === 8 && await page.locator('a[href="#galeria"]').filter({ hasText: "Explorar a galeria" }).count() === 1, `${nome}: "Explorar a galeria" com as outras 8 coleções`);
  ok(await page.locator("#gestao").count() === 1, `${nome}: gestão mensal como opção secundária`);
  ok(await semRolagem(page), `${nome}: página inicial sem rolagem lateral`);
  ok(page.errs.length === 0, `${nome}: sem erros de JS ${page.errs.join(" | ")}`);
  await ctx.close();
}
/* movimento reduzido: troca de segmento sem animação */
({ ctx, page } = await novo({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" }));
await page.goto(URL); await prontoHome(page);
await page.locator('.seg [data-seg="servico"]').click(); await w(page, 120);
ok(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length) === 0, "movimento reduzido: troca sem animação");
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
