/* =====================================================================
   EDITOR DO ESTÚDIO (celular primeiro).

   Abre exatamente a composição escolhida na galeria. A cliente troca:
   marca (nome ou logo), textos, preços e datas, fotos (JPEG com fundo, com
   zoom e posição), cores de fundo/texto/destaque, par de fontes e ícone.
   Estilo: "Aplicar a este carrossel", "Aplicar à coleção inteira",
   "Desfazer" e "Restaurar estilo original". A aplicação em lote muda só o
   estilo: fotos, textos, preços e composições ficam como estão.

   Tudo fica salvo NESTE aparelho: textos e estilo no localStorage, fotos e
   logo no IndexedDB. Nada é enviado a servidor.
   modo "teste": tela com foto própria leva AMOSTRA (prévia e PNG).
   modo "kit":   área da cliente, tudo limpo.
   ===================================================================== */
import { desenharEstudio, carregarPar, LAYOUTS, PARES, ICONES, W, alturaDoLayout } from "./estudio.js";
import { carregarFoto, fotoDeArquivo } from "./render.js";
import { zipStore, slug } from "./logic.js";
import { CATALOGO, GRUPOS, carrossel as achar, estiloOriginal, EDITAVEIS, COLECOES, legendaPreenchida, marcaExemplo } from "../catalogo/index.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const toBlob = c => new Promise(ok => c.toBlob(ok, "image/png"));
const espera = ms => new Promise(ok => setTimeout(ok, ms));
const ehImagem = f => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(f.name);
const LONGOS = /^(texto|porque|frase|citacao|nota|apoio|passo\d|item\d|linha\d)$/;
export function baixar(blob, nome) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const podeCompartilhar = () => { try { return !!(navigator.canShare && navigator.canShare({ files: [new File([new Uint8Array(1)], "a.png", { type: "image/png" })] })); } catch { return false; } };

/* ---------------- armazenamento local ---------------- */
const chaveProjeto = (modo, camp) => `nna-estudio:${modo}:${camp}`;
function lerProjeto(modo, camp) {
  try { const v = JSON.parse(localStorage.getItem(chaveProjeto(modo, camp)) || "null"); if (v && typeof v === "object") return { marca: "", estilo: {}, carr: {}, ...v }; } catch {}
  return { marca: "", estilo: {}, carr: {} };
}
function gravarProjeto(modo, camp, p) { try { localStorage.setItem(chaveProjeto(modo, camp), JSON.stringify(p)); return true; } catch { return false; } }
let dbP = null;
const abrirDB = () => dbP || (dbP = new Promise((ok, erro) => {
  try { const r = indexedDB.open("nna-estudio", 1); r.onupgradeneeded = () => r.result.createObjectStore("arquivos"); r.onsuccess = () => ok(r.result); r.onerror = () => erro(r.error); }
  catch (e) { erro(e); }
}));
async function idb(op, chave, valor) {
  try {
    const db = await abrirDB();
    return await new Promise((ok, erro) => {
      const tx = db.transaction("arquivos", op === "get" ? "readonly" : "readwrite"), st = tx.objectStore("arquivos");
      const r = op === "get" ? st.get(chave) : op === "put" ? st.put(valor, chave) : st.delete(chave);
      r.onsuccess = () => ok(r.result ?? null); r.onerror = () => erro(r.error);
    });
  } catch { return null; }
}
const pick = (o, ks) => Object.fromEntries(ks.filter(k => o && o[k] != null).map(k => [k, o[k]]));

/**
 * @param raiz    elemento
 * @param op      { campanha, carrossel, modo: "teste"|"kit", nivel (1..3), toast, aoTrocar?(id),
 *                  pecas?: lista própria (ex.: sequências de Stories da área paga, cada uma { id, nivel, nome, ideia, telas }),
 *                  tipo?: "carrossel" | "stories", lateral?(peça) → HTML da coluna ao lado (no lugar da legenda) }
 */
export function montarEstudio(raiz, op) {
  const camp = CATALOGO[op.campanha]; if (!camp) { raiz.innerHTML = `<p class="aviso">Campanha não encontrada.</p>`; return null; }
  const modo = op.modo === "kit" ? "kit" : "teste", teste = modo === "teste", nivel = op.nivel || 3, toast = op.toast || (() => {});
  const stories = op.tipo === "stories";
  const col = COLECOES[camp.id], lista = (op.pecas || camp.carrosseis).filter(x => x.nivel <= nivel);
  const N = lista[0].telas.length, H = alturaDoLayout(lista[0].telas[0].l), qtd = N === 4 ? "4" : String(N);
  let carr = lista.find(x => x.id === op.carrossel) || lista[0];
  const proj = lerProjeto(modo, camp.id);
  let telas = [], ativa = 0, aba = "textos", rascunho = {}, historico = [], logo = null, versao = 0;
  const share = podeCompartilhar();

  raiz.innerHTML = `
  <div class="es ${stories ? "es-stories" : ""}" data-modo="${modo}" data-tipo="${stories ? "stories" : "carrossel"}">
    <div class="es-topo">
      <label class="campo es-sel"><span>${stories ? "Sequência de Stories" : "Carrossel"}</span>
        <select data-es-carr>${GRUPOS.filter(([n]) => n <= nivel && lista.some(x => x.nivel === n)).map(([n, g, plano]) => `<optgroup label="${esc(g)} · ${esc(plano)}">${lista.filter(x => x.nivel === n).map(x => `<option value="${x.id}">${esc(x.nome)}</option>`).join("")}</optgroup>`).join("")}</select></label>
      <p class="hint es-ideia" data-es-ideia></p>
    </div>
    <div class="es-grade">
      <div class="es-previa">
        <div class="es-telas" role="list" aria-label="As ${qtd} telas ${stories ? "da sequência" : "do carrossel"}">
          ${[...Array(N).keys()].map(i => `<button type="button" class="es-tela" role="listitem" data-es-tela="${i}" aria-label="Editar a tela ${i + 1}"><canvas width="${W}" height="${H}"></canvas><span>Tela ${i + 1}</span></button>`).join("")}
        </div>
        <p class="hint es-salvo" data-es-salvo aria-live="polite">As edições ficam salvas neste aparelho.</p>
      </div>
      <div class="es-painel">
        <div class="es-abas" role="tablist" aria-label="O que editar">
          ${[["textos", "Textos"], ["fotos", "Fotos"], ["estilo", "Estilo"], ["marca", "Marca"]].map(([k, n]) => `<button type="button" role="tab" data-es-aba="${k}" aria-selected="${k === aba}">${n}</button>`).join("")}
        </div>
        <div class="es-qual" role="group" aria-label="Tela em edição" data-es-qual>${[...Array(N).keys()].map(i => `<button type="button" class="chip" data-es-ir="${i}">Tela ${i + 1}</button>`).join("")}</div>
        <section class="es-sec" data-es-painel="textos"></section>
        <section class="es-sec" data-es-painel="fotos" hidden></section>
        <section class="es-sec" data-es-painel="estilo" hidden>
          ${["fundo", "texto", "destaque"].map(k => `<div class="es-cor-linha"><span>${k === "fundo" ? "Cor do fundo" : k === "texto" ? "Cor do texto" : "Cor de destaque"}</span>
            <div class="es-cores">${col.cores.map(h => `<button type="button" class="ed-cor" data-es-cor="${k}" data-hex="${h}" style="--c:${h}" aria-label="${k}: ${h}"></button>`).join("")}
            <label class="es-cor-livre" title="Outra cor"><input type="color" data-es-cor-livre="${k}" aria-label="Escolher outra cor de ${k}"></label></div></div>`).join("")}
          <div class="es-cor-linha"><span>Fontes</span><div class="es-pares">${Object.entries(PARES).map(([k, p]) => `<button type="button" class="chip es-par" data-es-par="${k}" style="font-family:${esc(p.t)}">${esc(p.nome)}</button>`).join("")}</div></div>
          <div class="es-cor-linha"><span>Ícone decorativo</span><div class="es-icones">${Object.entries(ICONES).map(([k, n]) => `<button type="button" class="chip" data-es-icone="${k}">${esc(n)}</button>`).join("")}</div></div>
          <p class="es-rascunho" data-es-rascunho hidden>Prévia com mudanças ainda não aplicadas.</p>
          <div class="es-acoes">
            <button type="button" class="btn sm" data-es-aplicar="carrossel">Aplicar ${stories ? "a esta sequência" : "a este carrossel"}</button>
            <button type="button" class="btn sm ghost" data-es-aplicar="colecao">Aplicar à coleção inteira</button>
            <button type="button" class="btn sm ghost" data-es-desfazer>Desfazer</button>
            <button type="button" class="link" data-es-restaurar>Restaurar estilo original</button>
          </div>
          <p class="hint">Aplicar à coleção muda as cores, fontes e ícones de todos os carrosséis e Stories da coleção e mantém fotos, textos, preços e composições.</p>
        </section>
        <section class="es-sec" data-es-painel="marca" hidden>
          <label class="campo"><span>Nome da loja ou do negócio</span><input data-es-marca maxlength="40" autocomplete="organization" placeholder="${esc(camp.marca)}"></label>
          <div class="es-logo">
            <label class="btn sm arquivo">Inserir logo<input type="file" data-es-logo accept="image/*"></label>
            <button type="button" class="link" data-es-tirar-logo hidden>Remover logo</button>
          </div>
          <p class="hint" data-es-logo-txt>Com logo, ele entra no lugar do nome em todas as telas. PNG com fundo transparente fica melhor.</p>
        </section>
        ${teste ? `<p class="hint es-aviso" data-es-aviso></p>` : ""}
      </div>
      ${op.lateral ? `<aside class="ed-legenda es-lateral" data-es-lateral></aside>` : `<aside class="ed-legenda"><h3>Legenda</h3><pre class="legenda-txt" data-es-legenda></pre><button type="button" class="btn ghost block" data-es-copiar>Copiar legenda</button></aside>`}
    </div>
    <div class="ed-baixar">
      <h3>Baixar as imagens</h3>
      <p class="hint">${qtd} PNGs de 1080 × ${H}, numerados na ordem de postagem${teste ? ". No teste grátis, as telas com a sua foto saem com a marca AMOSTRA" : ", sem marca-d'água"}.</p>
      <div class="ed-botoes">
        ${share ? `<button type="button" class="btn" data-es-share>Compartilhar imagens</button>` : ""}
        <button type="button" class="btn ${share ? "ghost" : ""}" data-es-png>Baixar as ${qtd} imagens</button>
        <button type="button" class="btn ghost" data-es-zip>Baixar tudo em .zip</button>
      </div>
      ${share ? `<p class="hint">No iPhone, use "Compartilhar imagens" e toque em "Salvar imagens".</p>` : ""}
    </div>
  </div>`;

  const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];
  const canvases = $$(".es-tela canvas");
  const salvoEl = $("[data-es-salvo]");
  let salvarT = 0;
  const salvar = () => { clearTimeout(salvarT); salvarT = setTimeout(() => { salvoEl.textContent = gravarProjeto(modo, camp.id, proj) ? "Edições salvas neste aparelho." : "Não deu para salvar neste aparelho (modo privado?)."; }, 250); };
  const projCarr = () => (proj.carr[carr.id] = proj.carr[carr.id] || { estilo: {}, telas: [] });
  const fotoChave = (ti, k) => `${modo}:${camp.id}:${carr.id}:${ti}:${k}`;

  /* ---------- estilo ---------- */
  const original = () => estiloOriginal(camp.id, carr);
  const estiloAtual = () => ({ ...original(), ...pick(proj.estilo, EDITAVEIS), ...pick(projCarr().estilo, EDITAVEIS), ...rascunho });
  const instantaneo = () => JSON.stringify({ estilo: proj.estilo, carr: Object.fromEntries(Object.entries(proj.carr).map(([k, v]) => [k, v.estilo || {}])) });
  const lembrar = () => { historico.push(instantaneo()); if (historico.length > 40) historico.shift(); };
  const voltar = snap => { const s = JSON.parse(snap); proj.estilo = s.estilo; Object.entries(proj.carr).forEach(([k, v]) => { v.estilo = s.carr[k] || {}; }); };

  /* ---------- estado das telas ---------- */
  function montarTelas() {
    const salvo = projCarr().telas || [];
    telas = carr.telas.map((t, i) => {
      const sv = salvo[i] || {}, nf = (LAYOUTS[t.l] || { fotos: 0 }).fotos;
      return { l: t.l, inv: t.inv, c: { ...t.c, ...(sv.c || {}) }, orig: t,
        aj: Array.from({ length: nf }, (_, k) => ({ zoom: 1, fx: 0.5, fy: 0.5, ...((t.aj || [])[k] || {}), ...((sv.aj || [])[k] || {}) })),
        p: Array.from({ length: nf }, (_, k) => (sv.p || [])[k] || 0), // 0 exemplo, 1 foto própria, 2 sem foto
        imgs: Array(nf).fill(null) };
    });
  }
  function guardarTelas() {
    projCarr().telas = telas.map(t => {
      const c = Object.fromEntries(Object.entries(t.c).filter(([k, v]) => v !== t.orig.c[k]));
      const aj = t.aj.map((a, k) => { const o = { zoom: 1, fx: 0.5, fy: 0.5, ...((t.orig.aj || [])[k] || {}) }; return a.zoom === o.zoom && a.fx === o.fx && a.fy === o.fy ? null : a; });
      return { c, aj, p: t.p };
    });
    salvar();
  }
  async function carregarFotos() {
    const v = versao;
    await Promise.all(telas.flatMap((t, ti) => t.imgs.map(async (_, k) => {
      let img = null;
      if (t.p[k] === 1) { const blob = await idb("get", fotoChave(ti, k)); if (blob) { try { img = await carregarFoto(blob); } catch {} } if (!img) t.p[k] = 0; }
      if (t.p[k] === 0) img = await fotoDeArquivo(t.orig.f[k]);
      if (v === versao) t.imgs[k] = img;
    })));
  }

  /* ---------- desenho ---------- */
  const temPropria = t => t.p.some(x => x === 1);
  function pintar(i, ctx = canvases[i].getContext("2d"), caixas) {
    const t = telas[i]; if (!t) return;
    desenharEstudio(ctx, t, estiloAtual(), { marca: (proj.marca || "").trim() || marcaExemplo(camp.id, carr), logo, imgs: t.imgs, ajustes: t.aj, amostra: teste && temPropria(t), caixas });
  }
  /* caixas de texto de uma tela (verificação: nada sai da tela nem é cortado) */
  function medir(i) { const c = document.createElement("canvas"); c.width = W; c.height = H; const cx = []; pintar(i, c.getContext("2d"), cx); return cx; }
  const pend = new Set(); let raf = 0;
  const agendar = (...is) => { (is.length ? is : [...Array(N).keys()]).forEach(i => pend.add(i)); if (!raf) raf = requestAnimationFrame(() => { raf = 0; pend.forEach(i => pintar(i)); pend.clear(); marcas(); }); };
  const marcas = () => { raiz.dataset.marcas = telas.map(t => teste && temPropria(t) ? "amostra" : "limpa").join(","); };
  const legenda = () => { if (op.lateral) { $("[data-es-lateral]").innerHTML = op.lateral(carr); return; } $("[data-es-legenda]").textContent = legendaPreenchida(carr, telas, proj.marca, marcaExemplo(camp.id, carr)); };

  /* ---------- painéis ---------- */
  function painelTextos() {
    const t = telas[ativa], lay = LAYOUTS[t.l];
    $('[data-es-painel="textos"]').innerHTML = `<p class="es-lay">Tela ${ativa + 1} · ${esc(lay.nome)}</p>` + lay.campos.map(([k, rot]) => {
      const v = esc(t.c[k] ?? ""), id = `es-${k}`;
      return `<label class="campo" for="${id}"><span>${esc(rot)}</span>${LONGOS.test(k) ? `<textarea id="${id}" data-es-campo="${k}" rows="2" maxlength="140">${v}</textarea>` : `<input id="${id}" data-es-campo="${k}" maxlength="90" value="${v}" autocomplete="off">`}</label>`;
    }).join("") + (lay.campos.some(([k]) => /titulo|estilo|frase|texto|nome|citacao/.test(k)) ? `<p class="hint">Dica: escreva a palavra entre *asteriscos* para ela sair em destaque.</p>` : "");
  }
  function painelFotos() {
    const t = telas[ativa], lay = LAYOUTS[t.l];
    $('[data-es-painel="fotos"]').innerHTML = `<p class="es-lay">Tela ${ativa + 1} · ${esc(lay.nome)}</p>` + (lay.fotos ? t.aj.map((a, k) => `
      <div class="es-foto" data-es-slot="${k}">
        <p class="es-foto-t"><b>${esc((lay.rotFotos || [])[k] || (lay.fotos > 1 ? `Foto ${k + 1}` : "Foto"))}</b> <span class="hint">${t.p[k] === 1 ? "sua foto" : t.p[k] === 2 ? "sem foto" : "foto de exemplo"}</span></p>
        <div class="ed-foto">
          <label class="btn sm arquivo">Trocar foto<input type="file" data-es-arquivo="${k}" accept="image/*"></label>
          <label class="btn ghost sm arquivo">Tirar foto<input type="file" data-es-arquivo="${k}" accept="image/*" capture="environment"></label>
          ${t.p[k] !== 0 ? `<button type="button" class="link" data-es-exemplo="${k}">Voltar à foto de exemplo</button>` : ""}
          ${!teste && t.p[k] !== 2 ? `<button type="button" class="link" data-es-sem="${k}">Remover foto</button>` : ""}
        </div>
        <div class="ed-ajuste">
          <label class="campo mini"><span>Zoom</span><input type="range" data-es-aj="zoom" data-k="${k}" min="1" max="3" step="0.01" value="${a.zoom}"></label>
          <label class="campo mini"><span>Posição ← →</span><input type="range" data-es-aj="fx" data-k="${k}" min="0" max="1" step="0.01" value="${a.fx}"></label>
          <label class="campo mini"><span>Posição ↑ ↓</span><input type="range" data-es-aj="fy" data-k="${k}" min="0" max="1" step="0.01" value="${a.fy}"></label>
        </div>
      </div>`).join("") : `<p class="hint">Esta tela não usa foto: ela é só tipográfica. Mude as cores e as fontes na aba Estilo.</p>`);
  }
  function painelEstilo() {
    const s = estiloAtual();
    $$("[data-es-cor]").forEach(b => { const on = s[b.dataset.esCor].toLowerCase() === b.dataset.hex.toLowerCase(); b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    $$("[data-es-cor-livre]").forEach(i => { i.value = s[i.dataset.esCorLivre]; });
    $$("[data-es-par]").forEach(b => b.classList.toggle("on", b.dataset.esPar === s.par));
    $$("[data-es-icone]").forEach(b => b.classList.toggle("on", b.dataset.esIcone === s.icone));
    $("[data-es-rascunho]").hidden = !Object.keys(rascunho).length;
    $("[data-es-desfazer]").disabled = !historico.length && !Object.keys(rascunho).length;
  }
  function painelMarca() {
    $("[data-es-marca]").value = proj.marca || "";
    $("[data-es-tirar-logo]").hidden = !logo;
    $("[data-es-logo-txt]").textContent = logo ? "Logo em uso em todas as telas desta campanha." : "Com logo, ele entra no lugar do nome em todas as telas. PNG com fundo transparente fica melhor.";
  }
  function aviso() {
    if (!teste) return;
    const t = telas[ativa];
    $("[data-es-aviso]").textContent = temPropria(t) ? "Esta tela está com a sua foto: no teste grátis ela leva a marca AMOSTRA. No plano comprado, sai limpa." : "Fotos de exemplo saem sem marca. Troque pela sua para ver como fica.";
  }
  function selecionar(i, rolar) {
    ativa = i;
    $$("[data-es-tela]").forEach(b => b.classList.toggle("on", +b.dataset.esTela === i));
    $$("[data-es-ir]").forEach(b => b.classList.toggle("on", +b.dataset.esIr === i));
    if (aba === "textos") painelTextos(); if (aba === "fotos") painelFotos();
    aviso();
    if (rolar) { const el = $$(".es-tela")[i]; el.parentElement.scrollTo({ left: el.offsetLeft - el.parentElement.offsetLeft - 8, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
  }
  function mostrarAba(k) {
    aba = k;
    $$("[data-es-aba]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.esAba === k)));
    $$("[data-es-painel]").forEach(p => p.hidden = p.dataset.esPainel !== k);
    $("[data-es-qual]").hidden = !(k === "textos" || k === "fotos");
    if (k === "textos") painelTextos(); if (k === "fotos") painelFotos(); if (k === "estilo") painelEstilo(); if (k === "marca") painelMarca();
  }

  /* ---------- abrir um carrossel ---------- */
  async function abrir(id) {
    const v = ++versao;
    if (Object.keys(rascunho).length) toast("As mudanças de estilo não aplicadas foram descartadas.");
    rascunho = {};
    carr = lista.find(x => x.id === id) || lista[0];
    $("[data-es-carr]").value = carr.id;
    $("[data-es-ideia]").textContent = carr.ideia + (carr.paraQuem ? ` Faz sentido para: ${carr.paraQuem}.` : "");
    raiz.dataset.carrossel = carr.id; raiz.dataset.pronto = "";
    montarTelas();
    await Promise.all([carregarPar(estiloAtual().par), carregarFotos()]);
    if (v !== versao) return;
    agendar(); legenda(); selecionar(Math.min(ativa, N - 1), false); mostrarAba(aba);
    raiz.dataset.pronto = "1";
    if (op.aoTrocar) op.aoTrocar(carr.id);
  }

  /* ---------- eventos ---------- */
  raiz.addEventListener("click", async e => {
    const el = sel => e.target.closest(sel);
    let b;
    if ((b = el("[data-es-tela]"))) { selecionar(+b.dataset.esTela, false); if (aba !== "textos" && aba !== "fotos") mostrarAba("textos"); return; }
    if ((b = el("[data-es-ir]"))) { selecionar(+b.dataset.esIr, true); return; }
    if ((b = el("[data-es-aba]"))) { mostrarAba(b.dataset.esAba); return; }
    if ((b = el("[data-es-cor]"))) { rascunho[b.dataset.esCor] = b.dataset.hex; painelEstilo(); agendar(); return; }
    if ((b = el("[data-es-par]"))) { rascunho.par = b.dataset.esPar; painelEstilo(); await carregarPar(b.dataset.esPar); agendar(); return; }
    if ((b = el("[data-es-icone]"))) { rascunho.icone = b.dataset.esIcone; painelEstilo(); agendar(); return; }
    if ((b = el("[data-es-aplicar]"))) {
      const pc = projCarr(), mods = { ...pick(pc.estilo, EDITAVEIS), ...rascunho };
      if (!Object.keys(mods).length) { toast("Escolha uma cor, fonte ou ícone primeiro."); return; }
      lembrar();
      if (b.dataset.esAplicar === "carrossel") { pc.estilo = { ...pc.estilo, ...rascunho }; toast(`Estilo aplicado ${stories ? "a esta sequência" : "a este carrossel"}.`); }
      else {
        proj.estilo = { ...proj.estilo, ...mods };
        Object.values(proj.carr).forEach(c => { c.estilo = Object.fromEntries(Object.entries(c.estilo || {}).filter(([k]) => !(k in mods))); });
        toast("Estilo aplicado à coleção inteira.");
      }
      rascunho = {}; salvar(); painelEstilo(); agendar(); return;
    }
    if (el("[data-es-desfazer]")) {
      if (Object.keys(rascunho).length) { rascunho = {}; toast("Mudanças não aplicadas desfeitas."); }
      else if (historico.length) { voltar(historico.pop()); salvar(); toast("Desfeito."); }
      painelEstilo(); await carregarPar(estiloAtual().par); agendar(); return;
    }
    if (el("[data-es-restaurar]")) {
      lembrar(); rascunho = {};
      projCarr().estilo = pick(original(), Object.keys(pick(proj.estilo, EDITAVEIS)));
      salvar(); painelEstilo(); await carregarPar(estiloAtual().par); agendar(); toast(`Estilo original de volta ${stories ? "nesta sequência" : "neste carrossel"}.`); return;
    }
    if ((b = el("[data-es-exemplo]"))) {
      const k = +b.dataset.esExemplo, t = telas[ativa];
      t.p[k] = 0; t.imgs[k] = await fotoDeArquivo(t.orig.f[k]); t.aj[k] = { zoom: 1, fx: 0.5, fy: 0.5, ...((t.orig.aj || [])[k] || {}) };
      idb("del", fotoChave(ativa, k)); guardarTelas(); painelFotos(); aviso(); agendar(ativa);
      toast(teste ? "Foto de exemplo de volta, sem marca." : "Foto de exemplo de volta."); return;
    }
    if ((b = el("[data-es-sem]"))) { const k = +b.dataset.esSem, t = telas[ativa]; t.p[k] = 2; t.imgs[k] = null; idb("del", fotoChave(ativa, k)); guardarTelas(); painelFotos(); agendar(ativa); return; }
    if (el("[data-es-tirar-logo]")) { logo = null; idb("del", `${modo}:${camp.id}:logo`); painelMarca(); agendar(); toast("Logo removido. O nome volta para as telas."); return; }
    if (el("[data-es-copiar]")) {
      const txt = $("[data-es-legenda]").textContent;
      try { await navigator.clipboard.writeText(txt); toast("Legenda copiada."); }
      catch { const r = document.createRange(); r.selectNodeContents($("[data-es-legenda]")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Legenda selecionada. Use copiar do seu aparelho."); }
      return;
    }
    if (el("[data-es-png]")) { const fs = await arquivos(); for (const f of fs) { baixar(f.blob, f.name); await espera(350); } toast(`${qtd} imagens baixadas, de 01 a 0${N}.`); return; }
    if (el("[data-es-zip]")) {
      const fs = await arquivos();
      baixar(new Blob([zipStore(await Promise.all(fs.map(async f => ({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()) }))))], { type: "application/zip" }), `${slug(camp.id)}-${slug(carr.id)}.zip`);
      toast("Arquivo .zip baixado."); return;
    }
    if (el("[data-es-share]")) {
      const fs = await arquivos();
      try { await navigator.share({ files: fs.map(f => new File([f.blob], f.name, { type: "image/png" })), title: carr.nome }); }
      catch (err) { if (err && err.name !== "AbortError") toast(`Não deu para compartilhar. Use "Baixar as ${qtd} imagens".`); }
    }
  });
  raiz.addEventListener("input", e => {
    const c = e.target.closest("[data-es-campo]");
    if (c) { telas[ativa].c[c.dataset.esCampo] = c.value; agendar(ativa); legenda(); guardarTelas(); return; }
    const a = e.target.closest("[data-es-aj]");
    if (a) { telas[ativa].aj[+a.dataset.k][a.dataset.esAj] = +a.value; agendar(ativa); guardarTelas(); return; }
    const cl = e.target.closest("[data-es-cor-livre]");
    if (cl) { rascunho[cl.dataset.esCorLivre] = cl.value; painelEstilo(); agendar(); return; }
    if (e.target.matches("[data-es-marca]")) { proj.marca = e.target.value; salvar(); agendar(); legenda(); }
  });
  raiz.addEventListener("change", async e => {
    if (e.target.matches("[data-es-carr]")) { abrir(e.target.value); return; }
    const inp = e.target.closest("[data-es-arquivo]"), lg = e.target.closest("[data-es-logo]");
    if (!inp && !lg) return;
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    if (!ehImagem(f)) { toast("Escolha um arquivo de imagem."); return; }
    try {
      const img = await carregarFoto(f);
      if (lg) {
        const k = Math.min(1, 600 / Math.max(img.w, img.h)), c = document.createElement("canvas");
        c.width = Math.round(img.w * k); c.height = Math.round(img.h * k); c.getContext("2d").drawImage(img.img, 0, 0, c.width, c.height);
        logo = { img: c, w: c.width, h: c.height };
        c.toBlob(bl => idb("put", `${modo}:${camp.id}:logo`, bl), "image/png");
        painelMarca(); agendar(); toast("Logo inserido em todas as telas."); return;
      }
      const k = +inp.dataset.esArquivo, t = telas[ativa];
      t.imgs[k] = img; t.p[k] = 1; t.aj[k] = { zoom: 1, fx: 0.5, fy: 0.5 };
      idb("put", fotoChave(ativa, k), f);
      guardarTelas(); painelFotos(); aviso(); agendar(ativa);
      toast(teste ? "Foto trocada. No teste grátis, esta tela leva a marca AMOSTRA." : "Foto trocada.");
    } catch { toast("Não consegui abrir essa foto. Tente outra (JPG ou PNG)."); }
  });

  /* ---------- exportação: o mesmo desenho da prévia ---------- */
  async function arquivos() {
    await carregarPar(estiloAtual().par); canvases.forEach((_, i) => pintar(i));
    return Promise.all(canvases.map(async (c, i) => ({ name: `${String(i + 1).padStart(2, "0")}-${slug(carr.id)}-${stories ? `story-${i + 1}` : i === 0 ? "capa" : `tela-${i + 1}`}.png`, blob: await toBlob(c) })));
  }

  /* ---------- início: logo salvo e carrossel pedido ---------- */
  (async () => {
    const bl = await idb("get", `${modo}:${camp.id}:logo`);
    if (bl) { try { logo = await carregarFoto(bl); } catch {} }
    await abrir(carr.id);
  })();
  const api = { carrossel: () => carr.id, estilo: () => estiloAtual(), medir, estado: () => ({ proj, telas: telas.map(t => ({ l: t.l, c: t.c, aj: t.aj, p: t.p, fotos: t.imgs.map(Boolean) })), rascunho, historico: historico.length, logo: !!logo }), abrir, destruir: () => { versao++; } };
  raiz.__estudio = api;
  return api;
}
