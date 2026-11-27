// Teste como cliente no celular (390 × 844): galeria, editor do estúdio, persistência, estilo em lote,
// exportação e área paga. Precisa do servidor local com segredos (tests/servidor.mjs) e Playwright:
//   ACESSO_SECRET=a ADMIN_TOKEN=b node tests/servidor.mjs 8767
//   URL=http://localhost:8767/ ADMIN_TOKEN=b node estudio.mjs <pasta-de-saída>
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const URL = process.env.URL, out = process.argv[2] || ".", raiz = fileURLToPath(new URL_("../../", import.meta.url));
function URL_(a, b) { return new globalThis.URL(a, b); }
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, acceptDownloads: true });
const page = await ctx.newPage(); const errs = [];
page.on("pageerror", e => errs.push(e.message));
page.on("console", m => m.type() === "error" && !/401|503|Failed to load resource/.test(m.text()) && errs.push(m.text()));
const w = ms => page.waitForTimeout(ms);
const semRolagem = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const jpeg = nome => ({ name: nome, mimeType: "image/jpeg", buffer: readFileSync(`${raiz}public/assets/exemplo/${nome}`) });
const pronto = async (sel = "#estudio") => { await page.waitForFunction(s => document.querySelector(s)?.dataset.pronto === "1", sel, { timeout: 20000 }); await w(400); };
const api = (fn, arg, sel = "#estudio") => page.evaluate(([f, a, s]) => new Function("e", "a", `return (${f})(e, a)`)(document.querySelector(s).__estudio, a), [fn.toString(), arg, sel]);
const aba = async k => { await page.locator(`[data-es-aba="${k}"]`).click(); await w(150); };
const tela = async i => { await page.locator(`[data-es-ir="${i}"]`).click(); await w(150); };
const campo = async (k, v) => { const el = page.locator(`[data-es-campo="${k}"]`); await el.fill(v); await w(250); };
const cabe = async (rotulo, n = 4, sel = "#estudio") => {
  const r = await api((e, n) => Array.from({ length: n }, (_, i) => e.medir(i)).flat().filter(b => b.cortou || b.x < -1 || b.y < -1 || b.x + b.w > 1081 || b.y + b.h > 1351).map(b => `${b.campo}:${b.cortou ? "cortou" : "fora"}`), n, sel);
  ok(r.length === 0, `${rotulo}: textos cabem nas 4 telas ${r.join(" ")}`);
};
/* exporta o zip e confere: 4 PNGs 1080 × 1350, em ordem, pixel a pixel iguais à prévia */
async function exportar(rotulo, sel = "#estudio") {
  const [dl] = await Promise.all([page.waitForEvent("download"), page.locator(`${sel} [data-es-zip]`).click()]);
  const zip = readFileSync(await dl.path()); writeFileSync(`${out}/${dl.suggestedFilename()}`, zip);
  const arqs = []; let p = 0;
  while (zip.readUInt32LE(p) === 0x04034b50) { const n = zip.readUInt32LE(p + 18), ln = zip.readUInt16LE(p + 26); arqs.push({ nome: zip.slice(p + 30, p + 30 + ln).toString(), dados: zip.slice(p + 30 + ln, p + 30 + ln + n) }); p += 30 + ln + n; }
  ok(arqs.length === 4 && arqs.every((a, i) => a.nome.startsWith(String(i + 1).padStart(2, "0") + "-") && a.nome.endsWith(".png")), `${rotulo}: zip com 01 a 04 em ordem (${arqs.map(a => a.nome).join(", ")})`);
  const iguais = await page.evaluate(async ([s, pngs]) => {
    const cvs = [...document.querySelectorAll(`${s} .es-tela canvas`)];
    return Promise.all(pngs.map(async (b64, i) => {
      const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
      if (img.naturalWidth !== 1080 || img.naturalHeight !== 1350) return "tamanho " + img.naturalWidth + "x" + img.naturalHeight;
      const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"); x.drawImage(img, 0, 0);
      const a = x.getImageData(0, 0, 1080, 1350).data, b = cvs[i].getContext("2d").getImageData(0, 0, 1080, 1350).data;
      let dif = 0; for (let k = 0; k < a.length; k += 4) if (Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]) > 6) dif++;
      return dif / (a.length / 4);
    }));
  }, [sel, arqs.map(a => a.dados.toString("base64"))]);
  ok(iguais.every(d => d === 0), `${rotulo}: PNGs de 1080 × 1350 iguais à prévia (${iguais.join(" / ")})`);
  return arqs;
}

/* ===== galeria ===== */
await page.goto(URL + "#galeria", { waitUntil: "domcontentloaded" }); await w(1500);
const gal = await page.evaluate(() => { const ids = [...document.querySelectorAll("[data-gal]")].map(i => i.dataset.gal); const por = {}; ids.forEach(x => { const c = x.split("/")[0]; por[c] = (por[c] || 0) + 1; }); return { n: ids.length, unicos: new Set(ids).size, por }; });
ok(gal.n === 110 && gal.unicos === 110 && Object.keys(gal.por).length === 10 && Object.values(gal.por).every(v => v === 11), `galeria: 110 capas reais, 10 campanhas × 11 (${gal.n})`);
await page.locator('[data-gal="favoritos-da-loja/preco-amigo"]').scrollIntoViewIfNeeded(); await w(2500);
ok(await page.locator('[data-gal="favoritos-da-loja/preco-amigo"]').evaluate(i => i.naturalWidth > 0), "capa desenhada ao entrar na tela");
ok(await semRolagem(), "galeria sem rolagem lateral");
await page.screenshot({ path: `${out}/galeria-favoritos.png` });
ok(await page.locator(".gal-btn").count() === 110 && await page.locator('#gal-presentes-por-orcamento .gal-acoes a[href="#campanha/presentes-por-orcamento"]').first().isVisible() && /Comprar/.test(await page.locator("#gal-presentes-por-orcamento .gal-acoes").innerText()) && await page.locator("#gal-favoritos-da-loja .gal-acoes a.btn").count() === 0, "galeria: \"Editar grátis\" em cada capa, \"Comprar\" nas coleções à venda");
await page.locator('[data-gal="favoritos-da-loja/preco-amigo"]').click(); await pronto();
ok(await page.evaluate(() => location.hash) === "#editar/favoritos-da-loja/preco-amigo" && await api(e => e.carrossel()) === "preco-amigo", "tocar na capa abre exatamente aquela composição no editor");

/* ===== lojista: 5 presentes até R$ 100 ===== */
await page.evaluate(() => { localStorage.clear(); indexedDB.deleteDatabase("nna-estudio"); });
await page.goto(URL + "#editar/presentes-por-orcamento/ate-100"); await page.reload(); await pronto();
ok(await page.locator(".es-tela").count() === 4, "lojista: 4 telas grandes no editor");
await campo("valor", "R$ 150");
ok((await page.locator("[data-es-legenda]").innerText()).includes("5 presentes até R$ 150"), "R$ 100 → R$ 150 aparece na tela e na legenda");
await aba("marca");
await page.locator("[data-es-marca]").fill("Loja da Bia"); await w(200);
const logo = await page.evaluate(() => { const c = document.createElement("canvas"); c.width = 400; c.height = 160; const x = c.getContext("2d"); x.fillStyle = "#1E4A35"; x.font = "bold 90px serif"; x.fillText("BIA", 60, 120); return c.toDataURL("image/png").split(",")[1]; });
await page.locator("[data-es-logo]").setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from(logo, "base64") }); await w(600);
ok(await api(e => e.estado().logo), "logo inserido");
ok((await api(e => [0, 1, 2, 3].map(i => e.medir(i).some(b => b.logo)))).every(Boolean), "logo aparece nas 4 telas no lugar do nome");
await aba("fotos"); await tela(1);
await page.locator('[data-es-arquivo="0"]').first().setInputFiles(jpeg("10-camisa.jpg")); await w(800);
await page.locator('[data-es-aj="zoom"][data-k="0"]').fill("1.6"); await page.locator('[data-es-aj="fx"][data-k="0"]').fill("0.3"); await w(300);
ok((await page.evaluate(() => document.getElementById("estudio").dataset.marcas)) === "limpa,amostra,limpa,limpa", "teste grátis: só a tela com foto própria leva AMOSTRA");
await aba("textos"); await tela(3);
const longo = "Perfume Flor de Laranjeira edição especial de Natal com caixa presente";
await campo("nome", longo);
ok(longo.length >= 67, `título longo com ${longo.length} caracteres`);
await cabe("lojista");
await page.locator(".es-previa").screenshot({ path: `${out}/lojista-previa.png` });
/* estilo na coleção inteira */
await aba("estilo");
await page.locator('[data-es-cor="destaque"][data-hex="#1E4A35"]').click(); await w(200);
ok(await page.locator("[data-es-rascunho]").isVisible(), "prévia avisa que a cor ainda não foi aplicada");
await page.locator('[data-es-aplicar="colecao"]').click(); await w(400);
const antes = await api(e => e.estado().telas[1]);
await page.locator("[data-es-carr]").selectOption("cara-dela"); await pronto();
ok((await api(e => e.estilo().destaque)) === "#1E4A35", "nova cor aplicada a outro carrossel da coleção");
await page.locator("[data-es-carr]").selectOption("ultimos-dias"); await pronto();
const rev = await api(e => e.estilo());
ok(rev.destaque === "#1E4A35" && rev.fundo === "#5C0F1F", "Réveillon recebe a cor nova e mantém o próprio fundo");
await page.locator("[data-es-carr]").selectOption("ate-100"); await pronto();
const depois = await api(e => e.estado().telas[1]);
ok(JSON.stringify(depois.aj) === JSON.stringify(antes.aj) && depois.p[0] === 1 && (await api(e => e.estado().telas[0].c.valor)) === "R$ 150", "fotos, enquadramento, textos e preços mantidos depois da aplicação em lote");
await aba("estilo");
await page.locator("[data-es-desfazer]").click(); await w(300);
ok((await api(e => e.estilo().destaque)) === "#B0853F", "Desfazer volta a cor original");
await page.locator('[data-es-cor="destaque"][data-hex="#1E4A35"]').click(); await page.locator('[data-es-aplicar="colecao"]').click(); await w(300);
await page.locator('[data-es-par="moderna"]').click(); await page.locator('[data-es-aplicar="carrossel"]').click(); await w(500);
ok((await api(e => e.estilo().par)) === "moderna", "outra dupla de fontes aplicada a este carrossel");
await page.locator("[data-es-restaurar]").click(); await w(400);
const rest = await api(e => e.estilo());
ok(rest.par === "editorial" && rest.destaque === "#B0853F", "Restaurar estilo original neste carrossel");
await page.locator('[data-es-aplicar="colecao"]').click(); await w(200); // sem mudança: só avisa
await page.locator('[data-es-cor="destaque"][data-hex="#1E4A35"]').click(); await page.locator('[data-es-aplicar="colecao"]').click(); await w(400);
await cabe("lojista com cor nova");
const arqLoja = await exportar("lojista");
writeFileSync(`${out}/lojista-01.png`, arqLoja[0].dados); writeFileSync(`${out}/lojista-02.png`, arqLoja[1].dados);
/* reabrir: tudo salvo no aparelho */
await page.goto(URL + "#inicio"); await w(300); await page.goto(URL + "#editar/presentes-por-orcamento/ate-100"); await page.reload(); await pronto(); await w(600);
const re = await api(e => ({ s: e.estado(), est: e.estilo() }));
ok(re.s.telas[0].c.valor === "R$ 150" && re.s.telas[3].c.nome.startsWith("Perfume Flor") && re.s.proj.marca === "Loja da Bia", "reabrir: textos e marca salvos");
ok(re.s.telas[1].p[0] === 1 && re.s.telas[1].fotos[0] && re.s.telas[1].aj[0].zoom === 1.6 && re.s.telas[1].aj[0].fx === 0.3 && re.s.logo, "reabrir: foto própria, enquadramento e logo salvos");
ok(re.est.destaque === "#1E4A35", "reabrir: cor da coleção salva");
ok(await page.locator("[data-es-copiar]").isVisible(), "botão Copiar legenda");
await page.locator("[data-es-copiar]").click(); await w(200);
ok(await semRolagem(), "editor sem rolagem lateral em 390 px");

/* ===== prestadora: Seu toque nas festas ===== */
await page.goto(URL + "#editar/seu-toque-nas-festas/tres-estilos"); await pronto();
await aba("marca"); await page.locator("[data-es-marca]").fill("Studio Lu Make"); await w(200);
await aba("textos"); await tela(0);
await campo("titulo", "3 estilos de maquiagem para as festas de fim de ano da sua *agenda*");
await aba("fotos"); await tela(2);
await page.locator('[data-es-arquivo="0"]').first().setInputFiles(jpeg("21-esmaltes.jpg")); await w(800);
await aba("estilo");
await page.locator('[data-es-cor="fundo"][data-hex="#3B1E2B"]').click(); await page.locator('[data-es-cor="texto"][data-hex="#F4DCD6"]').click();
await page.locator('[data-es-aplicar="colecao"]').click(); await w(500);
await cabe("prestadora");
ok((await page.locator("[data-es-legenda]").innerText()).includes("Studio Lu Make"), "prestadora: marca na legenda");
await page.locator(".es-previa").screenshot({ path: `${out}/prestadora-previa.png` });
const arqPrest = await exportar("prestadora"); writeFileSync(`${out}/prestadora-01.png`, arqPrest[0].dados);

/* ===== Réveillon: Um tempo para cuidar ===== */
await page.goto(URL + "#editar/um-tempo-para-cuidar/ano-cuidado"); await pronto();
ok((await api(e => e.estilo().fundo)) === "#2F3B2E", "Réveillon usa a variação de virada da coleção");
await aba("textos"); await campo("ano", "2027"); await campo("titulo", "Um ano inteiro de cuidado, carinho e muitas pausas *merecidas*");
await aba("fotos");
await page.locator('[data-es-arquivo="1"]').first().setInputFiles(jpeg("20-spa.jpg")); await w(800);
await aba("marca"); await page.locator("[data-es-logo]").setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from(logo, "base64") }); await w(500);
await aba("estilo"); await page.locator('[data-es-icone="floco"]').click(); await page.locator('[data-es-cor="destaque"][data-hex="#B88A7A"]').click(); await page.locator('[data-es-aplicar="colecao"]').click(); await w(500);
await cabe("Réveillon");
await page.locator(".es-previa").screenshot({ path: `${out}/reveillon-previa.png` });
const arqRev = await exportar("Réveillon"); writeFileSync(`${out}/reveillon-01.png`, arqRev[0].dados);

/* ===== planos: capas reais por nível, tocar abre o editor ===== */
await page.goto(URL + "#campanha/presentes-por-orcamento"); await w(500); await page.locator("#planos").scrollIntoViewIfNeeded(); await w(3000);
const niv = await page.locator("[data-capas]").evaluateAll(bs => bs.map(b => b.querySelectorAll("a[data-capa-link] img").length));
ok(niv.join() === "5,3,3", `planos: capas reais 5 / +3 / +3 (${niv.join()})`);
await page.locator('[data-capas="3"] a[data-capa-link]').first().click(); await pronto();
ok(/^#editar\/presentes-por-orcamento\/cores-virada$/.test(await page.evaluate(() => location.hash)), "capa do plano abre a composição no editor");

/* ===== área paga: Natal Completo, sem marca-d'água ===== */
if (process.env.ADMIN_TOKEN) {
  const r = await (await fetch(URL + "api/liberar", { method: "POST", headers: { "x-admin-token": process.env.ADMIN_TOKEN, "content-type": "application/json" }, body: JSON.stringify({ campanha: "presentes-por-orcamento", plano: "natal-completo", dias: 2 }) })).json();
  await page.goto(URL + "#acesso=" + r.link.split("#acesso=")[1]); await page.waitForSelector(".area-abas"); await page.goto(URL + "#area/carrosseis"); await pronto("#estudio-kit");
  ok(await page.locator("#estudio-kit [data-es-carr] option").count() === 8, "área Natal Completo: 8 carrosséis no editor");
  await page.locator("#estudio-kit [data-es-aba=\"fotos\"]").click(); await page.locator('#estudio-kit [data-es-ir="1"]').click();
  await page.locator('#estudio-kit [data-es-arquivo="0"]').first().setInputFiles(jpeg("10-camisa.jpg")); await w(800);
  ok((await page.evaluate(() => document.getElementById("estudio-kit").dataset.marcas)) === "limpa,limpa,limpa,limpa", "kit pago: foto própria sem AMOSTRA");
  ok(/Reel ·/.test(await page.locator("#do-tema").innerText()), "área: atalho para o Reel do mesmo tema ao lado do carrossel");
  await page.locator("#estudio-kit [data-es-carr]").selectOption("equipe"); await pronto("#estudio-kit");
  ok(/O que a equipe daria/.test(await page.locator("#do-tema").innerText()), "trocar de carrossel troca o atalho do tema");
  await exportar("kit", "#estudio-kit");
}
ok(errs.length === 0, `sem erros de JS ${errs.join(" | ")}`);
console.log(fails ? `${fails} FALHA(S)` : "TUDO OK");
await browser.close(); process.exit(fails ? 1 : 0);
