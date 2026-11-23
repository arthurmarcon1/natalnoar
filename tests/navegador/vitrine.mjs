// Verificação da vitrine pop no celular (390 × 664 e 390 × 844). Uso igual ao de galeria.mjs:
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

/* ===== abertura ===== */
let { ctx, page } = await novo();
await page.goto(URL, { waitUntil: "domcontentloaded" }); await w(page, 200);
const h1 = await page.evaluate(() => ({ txt: document.querySelector("h1").innerText.replace(/\s+/g, " ").trim(), em: getComputedStyle(document.querySelector("h1 em")), fs: parseFloat(getComputedStyle(document.querySelector("h1")).fontSize) }));
const em = await page.evaluate(() => { const c = getComputedStyle(document.querySelector("h1 em")); return { estilo: c.fontStyle, cor: c.color, vars: c.fontVariationSettings, tam: parseFloat(c.fontSize) }; });
ok(h1.txt === "Fim de ano corrido? Seu conteúdo vem pronto.", `chamada mantida: "${h1.txt}"`);
ok(em.estilo === "italic" && em.cor === "rgb(179, 18, 46)" && /WONK/.test(em.vars) && em.tam > h1.fs * 1.3, `"vem pronto." em itálico expressivo e maior (${Math.round(em.tam)}px)`);
const linhas = await page.evaluate(() => [...document.querySelectorAll("h1 .l, h1 em")].every(l => { const r = document.createRange(); r.selectNodeContents(l); const b = r.getBoundingClientRect(); return b.left >= 0 && b.right <= innerWidth - 8; }));
ok(linhas, "chamada inteira na tela, sem corte");
const btn = await page.locator(".hero .btn").boundingBox();
const clicavel = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest(".hero .btn"), [btn.x + btn.width / 2, btn.y + btn.height / 2]);
ok(btn.y + btn.height <= 664 && clicavel, `"Escolher minha campanha" visível e clicável desde o início, em 390 × 664 (base em ${Math.round(btn.y + btn.height)}px)`);
const vpb = await page.locator("#vitrine-pop").boundingBox(), h1b = await page.locator("h1").boundingBox();
ok(vpb.y >= h1b.y + h1b.height - 4 && vpb.y < h1b.y + h1b.height + 40, "foto do produto logo abaixo da chamada");
const fase = await page.evaluate(() => ({ abre: document.getElementById("vitrine-pop").classList.contains("abre"), preco: +getComputedStyle(document.querySelector(".vp-preco")).opacity, atras: +getComputedStyle(document.querySelector('.vp-card[data-pos="1"]')).opacity }));
ok(fase.abre && fase.preco < 1 && fase.atras < 1, "animação começa: foto primeiro, título e telas de trás ainda entrando");
await page.screenshot({ path: `${out}/vit-0.png` });
await w(page, 3200);
const fim = await page.evaluate(() => ({ abre: document.getElementById("vitrine-pop").classList.contains("abre"), cards: [...document.querySelectorAll(".vp-card")].map(c => [c.dataset.pos, +getComputedStyle(c).opacity]), mini: [...document.querySelectorAll("[data-vp-mini]")].every(i => i.naturalWidth > 0) }));
ok(!fim.abre && fim.cards.every(([, o]) => o === 1) && fim.mini, "termina em leque de 3 telas (moldura, título, preço e duas telas atrás)");
ok(await page.evaluate(() => document.querySelectorAll(".selo-pronto").length >= 1 && /pronto pra postar/i.test(document.querySelector(".vp .selo-pronto").textContent)), "assinatura: etiqueta cereja \"pronto pra postar\"");
await arrastar(ctx, page, "#vitrine-pop", 280, 80); await w(page, 500);
const pos1 = await page.evaluate(() => [...document.querySelectorAll(".vp-card")].map(c => c.dataset.pos).join());
ok(pos1 !== "0,1,2", `deslizar a pilha traz outra tela para a frente (${pos1})`);
await page.locator('[data-vp="0"]').click(); await w(page, 450);
ok(await page.evaluate(() => document.querySelector('.vp-card[data-i="0"]').dataset.pos) === "0", "pontos levam a uma tela específica");
const est = page.locator("[data-estrela]").first();
await est.click(); ok(await est.evaluate(e => e.classList.contains("gira")), "estrela desenhada reage ao toque");
ok(await semRolagem(page), "abertura sem rolagem lateral");
// a abertura acontece uma vez: voltar ao início não repete
await page.goto(URL + "#campanhas"); await w(page, 300); await page.goto(URL + "#inicio"); await w(page, 200);
ok(!(await page.evaluate(() => document.getElementById("vitrine-pop").classList.contains("abre"))), "a animação não se repete ao voltar para o início");
ok(page.errs.length === 0, `sem erros de JS ${page.errs.join(" | ")}`);
await ctx.close();

/* movimento reduzido: sem animação, composição final na hora */
({ ctx, page } = await novo({ reducedMotion: "reduce" }));
await page.goto(URL, { waitUntil: "domcontentloaded" }); await w(page, 150);
const rm = await page.evaluate(() => ({ anim: document.getAnimations().filter(a => a.playState === "running").length, cards: [...document.querySelectorAll(".vp-card")].map(c => +getComputedStyle(c).opacity), preco: +getComputedStyle(document.querySelector(".vp-preco")).opacity }));
ok(rm.anim === 0 && rm.cards.every(o => o === 1) && rm.preco === 1, "movimento reduzido: leque pronto na hora, sem animação");
await ctx.close();

/* ===== vitrine de campanhas (captura) ===== */
({ ctx, page } = await novo({ viewport: { width: 390, height: 844 } }));
await page.goto(URL + "#campanhas", { waitUntil: "networkidle" }); await w(page, 2500);
const capa = await page.locator("[data-capa-camp]").evaluateAll(is => is.map(i => i.naturalWidth));
ok(capa.length === 1 && capa[0] > 0, "lojistas: capa real da campanha, na identidade da coleção");
await page.screenshot({ path: `${out}/vit-campanhas.png` });
await page.locator('[data-publico="servico"]').click(); await w(page, 2000);
ok(await page.locator("[data-capa-camp]").evaluate(i => i.naturalWidth > 0 && i.dataset.capaCamp === "seu-toque-nas-festas"), "prestadoras: capa com a identidade de bastidores");
ok(/Ver o que vem no kit/.test(await page.locator("body").innerText()), "explicações em \"Ver o que vem no kit\"");
ok(await page.locator(".fita-d").count() >= 2, "traços de fita nas passagens de seção");
ok(await semRolagem(page), "vitrine de campanhas sem rolagem lateral");
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
