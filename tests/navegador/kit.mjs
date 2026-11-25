// Kit pago no celular (390 × 844): as duas coleções nos três planos.
// Confere quantidades, TODOS os atalhos do calendário, Reels (gravar × copiar), Stories editáveis
// (3 PNGs 1080 × 1920 iguais à prévia) e a largura da tela. Precisa do servidor local e de Playwright:
//   ACESSO_SECRET=<32+ caracteres> ADMIN_TOKEN=b node tests/servidor.mjs 8767
//   URL=http://localhost:8767/ ADMIN_TOKEN=b node kit.mjs <pasta-de-saída>
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const URL = process.env.URL, out = process.argv[2] || ".";
let fails = 0; const ok = (c, m) => { if (!c) fails++; console.log(`${c ? "OK  " : "FAIL"} ${m}`); };
const ESPERADO = { "natal-pronto": { c: 5, r: 5, s: 5, cals: ["dez", "expressa"] }, "natal-completo": { c: 8, r: 8, s: 5, cals: ["quinze", "expressa"] }, "natal-virada": { c: 11, r: 11, s: 8, cals: ["quinze", "reveillon", "expressa"] } };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, acceptDownloads: true });
await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new globalThis.URL(URL).origin });
const page = await ctx.newPage(); const errs = [];
page.on("pageerror", e => errs.push(e.message));
page.on("console", m => m.type() === "error" && !/401|503|Failed to load resource/.test(m.text()) && errs.push(m.text()));
const w = ms => page.waitForTimeout(ms);
const pronto = sel => page.waitForFunction(s => document.querySelector(s)?.dataset.pronto === "1", sel, { timeout: 20000 });
const semRolagem = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const liberar = (campanha, plano) => fetch(URL + "api/liberar", { method: "POST", headers: { "x-admin-token": process.env.ADMIN_TOKEN, "content-type": "application/json" }, body: JSON.stringify({ campanha, plano, dias: 3 }) }).then(r => r.json());

for (const camp of ["presentes-por-orcamento", "seu-toque-nas-festas"]) for (const [plano, E] of Object.entries(ESPERADO)) {
  const tag = `${camp} · ${plano}`;
  const r = await liberar(camp, plano);
  await page.goto(URL + "#acesso=" + r.link.split("#acesso=")[1]); await page.waitForSelector(".area-abas", { timeout: 15000 }); await w(300);
  ok(await page.locator(".area-abas a").allInnerTexts().then(t => ["Calendário", "Carrosséis", "Reels", "Stories"].every((x, i) => t[i] === x)), `${tag}: abas Calendário, Carrosséis, Reels e Stories`);
  ok(new RegExp(`^${E.c} carrosséis · ${E.r} roteiros de Reels · ${E.s} sequências de Stories`).test(await page.locator("[data-totais]").innerText()), `${tag}: ${E.c} carrosséis, ${E.r} Reels e ${E.s} Stories no topo`);
  const cals = await page.locator("[data-cal]").evaluateAll(b => b.map(x => x.dataset.cal));
  ok(JSON.stringify(cals) === JSON.stringify(E.cals), `${tag}: calendários ${cals.join(", ")}`);
  const dias = await page.locator("[data-calv]").evaluateAll(ls => Object.fromEntries(ls.map(l => [l.dataset.calv, l.children.length])));
  ok((dias.dez || dias.quinze) === (plano === "natal-pronto" ? 10 : 15) && dias.expressa === 3 && (plano !== "natal-virada" || dias.reveillon === 5), `${tag}: dias ${JSON.stringify(dias)}`);
  ok(await page.locator(".cal-item").evaluateAll(xs => xs.every(x => x.querySelector(".tipo") && x.querySelector(".cal-nome").textContent.trim() && /^Preparar: ./.test(x.querySelector(".prep").textContent) && x.querySelector(".cal-abrir"))), `${tag}: cada dia diz formato, título, o que preparar e tem "Abrir"`);
  if (plano === "natal-virada") await page.screenshot({ path: `${out}/kit-${camp}-calendario.png`, fullPage: true });
  ok(await semRolagem(), `${tag}: calendário sem rolagem lateral`);
  // todos os atalhos (cada um uma vez)
  const atalhos = [...new Set(await page.locator("[data-atalho]").evaluateAll(as => as.map(a => a.getAttribute("href"))))];
  const quebrados = [];
  for (const h of atalhos) {
    const [, aba, id] = h.slice(1).split("/");
    await page.goto(URL + h); await w(150);
    let certo = false;
    if (aba === "carrosseis") { await pronto("#estudio-kit"); certo = await page.evaluate(id => document.getElementById("estudio-kit").dataset.carrossel === id && location.hash.endsWith(id), id); }
    else if (aba === "stories") { await pronto("#estudio-stories"); certo = await page.evaluate(id => document.getElementById("estudio-stories").dataset.carrossel === id, id); }
    else if (aba === "reels") certo = await page.locator(`[data-reel="${id}"]`).count() === 1;
    else if (aba === "mensagens") certo = await page.locator(`#msg-${id}.alvo`).count() === 1;
    if (!certo) quebrados.push(h);
  }
  ok(atalhos.length > 0 && !quebrados.length, `${tag}: ${atalhos.length} atalhos do calendário abrem o material certo ${quebrados.join(" ")}`);
  // listas de cada aba
  await page.goto(URL + "#area/carrosseis"); await pronto("#estudio-kit");
  ok(await page.locator("#estudio-kit [data-es-carr] option").count() === E.c, `${tag}: ${E.c} carrosséis no editor`);
  await page.goto(URL + "#area/reels"); await w(200);
  ok(await page.locator("[data-ir-reel] option").count() === E.r, `${tag}: ${E.r} roteiros de Reels`);
  ok(await page.locator(".reel-sec.gravar .cenas li").count() >= 5 && await page.locator(".reel-sec.copiar .copiavel").count() >= 6 && await page.locator(".sem-aparecer").count() === 1, `${tag}: Reel separa "Para gravar" (com "Sem aparecer") de "Para copiar"`);
  await page.goto(URL + "#area/stories"); await pronto("#estudio-stories");
  ok(await page.locator("#estudio-stories [data-es-carr] option").count() === E.s, `${tag}: ${E.s} sequências de Stories`);
  ok(await page.locator("#estudio-stories .es-tela canvas").evaluateAll(cs => cs.length === 3 && cs.every(c => c.width === 1080 && c.height === 1920)), `${tag}: 3 telas de Stories em 1080 × 1920`);
  ok(await page.locator(".st-notas li").count() === 3 && /Foto:/.test(await page.locator(".st-notas").innerText()), `${tag}: cada tela diz onde entra a foto`);
  ok(await semRolagem(), `${tag}: Stories sem rolagem lateral`);
}

/* detalhes com a coleção de lojistas, plano mais completo */
const r = await liberar("presentes-por-orcamento", "natal-virada");
await page.goto(URL + "#acesso=" + r.link.split("#acesso=")[1]); await page.waitForSelector(".area-abas");
await page.goto(URL + "#area/reels/r-amigo-secreto"); await w(300);
ok(/Tirou alguém que tu conhece pouco\?/.test(await page.locator(".reel-sec.copiar").innerText()), "Reel do amigo secreto abre com “Tirou alguém que tu conhece pouco?”");
await page.locator('[data-copiar="r-amigo-secreto-leg"]').click(); await w(300);
ok((await page.evaluate(() => navigator.clipboard.readText())).startsWith("Tirou alguém que tu conhece pouco no amigo secreto?"), "Copiar legenda do Reel");
await page.screenshot({ path: `${out}/kit-reel.png`, fullPage: true });
ok(await semRolagem(), "Reel sem rolagem lateral");
await page.goto(URL + "#area/stories/s-cara-dela"); await pronto("#estudio-stories"); await w(400);
await page.locator('[data-copiar="s-cara-dela-n1-p"]').click(); await w(200);
ok((await page.evaluate(() => navigator.clipboard.readText())) === "Ela é mais…", "Stories: copiar a pergunta da enquete");
ok(/Enquete/.test(await page.locator(".st-notas").innerText()) && await page.locator(".st-notas .resp .copiavel").count() === 2, "Stories: enquete com as duas respostas e o aviso do adesivo");
// trocar a foto da tela 2 e exportar: 3 PNGs 1080 × 1920 iguais à prévia
await page.locator('#estudio-stories [data-es-aba="fotos"]').click(); await page.locator('#estudio-stories [data-es-ir="1"]').click();
await page.locator('#estudio-stories [data-es-arquivo="0"]').first().setInputFiles({ name: "minha.jpg", mimeType: "image/jpeg", buffer: readFileSync(new globalThis.URL("../../public/assets/exemplo/10-camisa.jpg", import.meta.url)) }); await w(900);
ok((await page.evaluate(() => document.getElementById("estudio-stories").dataset.marcas)) === "limpa,limpa,limpa", "Stories do kit saem sem AMOSTRA");
const [dl] = await Promise.all([page.waitForEvent("download"), page.locator("#estudio-stories [data-es-zip]").click()]);
const zip = readFileSync(await dl.path()); const arqs = []; let p = 0;
while (zip.readUInt32LE(p) === 0x04034b50) { const n = zip.readUInt32LE(p + 18), ln = zip.readUInt16LE(p + 26); arqs.push({ nome: zip.slice(p + 30, p + 30 + ln).toString(), dados: zip.slice(p + 30 + ln, p + 30 + ln + n) }); p += 30 + ln + n; }
ok(arqs.map(a => a.nome).join(",") === "01-s-cara-dela-story-1.png,02-s-cara-dela-story-2.png,03-s-cara-dela-story-3.png", `Stories: zip ${arqs.map(a => a.nome).join(", ")}`);
const dif = await page.evaluate(async pngs => { const cvs = [...document.querySelectorAll("#estudio-stories .es-tela canvas")];
  return Promise.all(pngs.map(async (b64, i) => { const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode(); if (img.naturalWidth !== 1080 || img.naturalHeight !== 1920) return "tam";
    const t = document.createElement("canvas"); t.width = 1080; t.height = 1920; const x = t.getContext("2d"); x.drawImage(img, 0, 0); const a = x.getImageData(0, 0, 1080, 1920).data, b = cvs[i].getContext("2d").getImageData(0, 0, 1080, 1920).data;
    let d = 0; for (let k = 0; k < a.length; k++) if (Math.abs(a[k] - b[k]) > 2) d++; return d; })); }, arqs.map(a => a.dados.toString("base64")));
ok(dif.every(d => d === 0), `Stories: PNGs 1080 × 1920 iguais à prévia (${dif.join(" / ")})`);
writeFileSync(`${out}/kit-story-2.png`, arqs[1].dados);
await page.screenshot({ path: `${out}/kit-stories.png`, fullPage: true });
// a marca vale para Stories e carrosséis
await page.locator('#estudio-stories [data-es-aba="marca"]').click(); await page.locator("#estudio-stories [data-es-marca]").fill("Loja da Bia"); await w(400);
await page.goto(URL + "#area/carrosseis/ate-100"); await pronto("#estudio-kit");
ok(await page.locator("#estudio-kit [data-es-legenda]").innerText().then(t => /Loja da Bia/.test(t)), "marca digitada nos Stories aparece nos carrosséis");
await page.goto(URL + "#area/mensagens/w-prazo"); await w(300);
ok(await page.locator("#msg-w-prazo.alvo").count() === 1 && await page.locator(".passos li").count() >= 5, "Mensagens e tutorial");
ok(!errs.length, "sem erros de JS " + errs.join(" | "));
console.log(fails ? `${fails} FALHA(S)` : "TUDO OK");
await browser.close();
process.exit(fails ? 1 : 0);
