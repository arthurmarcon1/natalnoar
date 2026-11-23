/* Editores de carrossel. As fotos são lidas e desenhadas só no navegador: nada é enviado a servidor.
   - montarAmostra: teste grátis de 1 tela. Foto de exemplo = limpa; foto própria = marca-d'água
     AMOSTRA na prévia e no PNG; voltar à foto de exemplo tira a marca.
   - montarEditorCompleto: área da cliente, 4 telas por carrossel, PNGs numerados sem marca-d'água. */
import { desenharTela, carregarFontes, carregarFoto, fotoDeArquivo, W, H } from "./render.js";
import { nomeArquivo, zipStore, slug } from "./logic.js";
import { LAYOUT_INFO } from "./modelos.js";
export { fotoDeArquivo };

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const toBlob = c => new Promise(ok => c.toBlob(ok, "image/png"));
const espera = ms => new Promise(ok => setTimeout(ok, ms));
export function baixar(blob, nome) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const podeCompartilhar = () => { try { return !!(navigator.canShare && navigator.canShare({ files: [new File([new Uint8Array(1)], "a.png", { type: "image/png" })] })); } catch { return false; } };
const ehImagem = f => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(f.name);

/* Botões de foto + ajustes de enquadramento (compartilhado pelos dois editores) */
const blocoFoto = () => `
  <div class="ed-foto">
    <label class="btn sm arquivo">Trocar foto<input type="file" data-arquivo accept="image/*"></label>
    <label class="btn ghost sm arquivo">Tirar foto<input type="file" data-arquivo accept="image/*" capture="environment"></label>
    <button type="button" class="link" data-tirar hidden>Remover foto</button>
  </div>
  <div class="ed-ajuste" hidden>
    <label class="campo mini"><span>Zoom</span><input type="range" data-aj="zoom" min="1" max="2.5" step="0.01"></label>
    <label class="campo mini"><span>Posição ← →</span><input type="range" data-aj="fx" min="0" max="1" step="0.01"></label>
    <label class="campo mini"><span>Posição ↑ ↓</span><input type="range" data-aj="fy" min="0" max="1" step="0.01"></label>
  </div>`;
const novaTelaSimples = t => ({ tipo: t.tipo, texto: t.texto, preco: t.preco || "", apoio: t.apoio || "", fotoSrc: t.foto || null, foto: null, ajuste: { zoom: 1, fx: 0.5, fy: 0.5 } });
function ligarFoto(raiz, obterTela, aoMudar, toast, { aoCarregar, aoTirar } = {}) {
  raiz.querySelectorAll("[data-arquivo]").forEach(inp => inp.addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    if (!ehImagem(f)) { toast("Escolha um arquivo de imagem."); return; }
    const t = obterTela();
    try { t.foto = await carregarFoto(f); t.ajuste = { zoom: 1, fx: 0.5, fy: 0.5 }; if (aoCarregar) aoCarregar(t); aoMudar(true); toast("Foto trocada."); }
    catch { toast("Não consegui abrir essa foto. Tente outra (JPG ou PNG)."); }
  }));
  raiz.querySelector("[data-tirar]").addEventListener("click", async () => { if (aoTirar) await aoTirar(obterTela()); else obterTela().foto = null; aoMudar(true); });
  raiz.querySelectorAll("[data-aj]").forEach(inp => inp.addEventListener("input", () => { obterTela().ajuste[inp.dataset.aj] = +inp.value; aoMudar(false); }));
}
function sincronizarFoto(raiz, t) {
  raiz.querySelector(".ed-ajuste").hidden = !t.foto; raiz.querySelector("[data-tirar]").hidden = !t.foto;
  raiz.querySelectorAll("[data-aj]").forEach(inp => inp.value = t.ajuste[inp.dataset.aj]);
}
const desenhar = (canvas, t, marca, indice, total, amostra) =>
  desenharTela(canvas, t, { marca, foto: t.foto && t.foto.img, fw: t.foto && t.foto.w, fh: t.foto && t.foto.h, ajuste: t.ajuste, indice, total, amostra });

/* ---------------- teste grátis: 1 tela ---------------- */
export function montarAmostra(raiz, demo, { toast }) {
  const p = demo.produtos[0];
  const t = novaTelaSimples({ tipo: "produto", texto: p.nome, preco: p.preco, apoio: p.paraQuem, foto: p.foto });
  t.propria = false;
  raiz.innerHTML = `
    <div class="am-grade">
      <figure class="am-previa"><canvas width="${W}" height="${H}" aria-label="Prévia da tela de teste"></canvas>
        <figcaption class="hint" data-estado></figcaption></figure>
      <div class="ed-painel">
        ${blocoFoto()}
        <label class="campo"><span>Nome do produto</span><input data-campo="texto" maxlength="40" autocomplete="off"></label>
        <label class="campo"><span>Preço</span><input data-campo="preco" maxlength="20" autocomplete="off"></label>
        <button type="button" class="btn ghost sm" data-baixar-amostra>Baixar esta tela (PNG)</button>
      </div>
    </div>`;
  const canvas = raiz.querySelector("canvas"), estado = raiz.querySelector("[data-estado]");
  raiz.querySelector("[data-tirar]").textContent = "Voltar à foto de exemplo";
  const campos = [...raiz.querySelectorAll("[data-campo]")];
  campos.forEach(c => c.value = t[c.dataset.campo]);
  const pintar = () => {
    desenhar(canvas, t, demo.marca, 1, 4, t.propria);
    raiz.dataset.marca = t.propria ? "amostra" : "limpa";
    estado.textContent = t.propria ? "Com a sua foto, o teste grátis leva a marca AMOSTRA. Na campanha comprada, as imagens saem limpas." : "Foto de exemplo. Troque pela sua para ver como fica.";
    raiz.querySelector("[data-tirar]").hidden = !t.propria;
  };
  let raf = 0;
  const redesenhar = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pintar(); }); };
  ligarFoto(raiz, () => t, mudouFoto => { if (mudouFoto) { sincronizarFoto(raiz, t); raiz.querySelector("[data-tirar]").hidden = !t.propria; } redesenhar(); }, toast, {
    aoCarregar: tela => { tela.propria = true; },
    aoTirar: async tela => { tela.propria = false; tela.foto = await fotoDeArquivo(p.foto); tela.ajuste = { zoom: 1, fx: 0.5, fy: 0.5 }; toast("Foto de exemplo de volta, sem marca."); }
  });
  campos.forEach(c => c.addEventListener("input", () => { t[c.dataset.campo] = c.value; redesenhar(); }));
  raiz.querySelector("[data-baixar-amostra]").addEventListener("click", async () => {
    await carregarFontes(); pintar();
    baixar(await toBlob(canvas), t.propria ? "teste-natal-no-ar-amostra.png" : "exemplo-natal-no-ar.png");
    toast(t.propria ? "Tela baixada com a marca AMOSTRA." : "Tela de exemplo baixada.");
  });
  (async () => {
    await carregarFontes();
    t.foto = await fotoDeArquivo(p.foto); sincronizarFoto(raiz, t);
    pintar();
  })();
}

/* ---------------- editor completo: kit pago e teste grátis ---------------- */
/**
 * Abre um carrossel (4 telas) com a composição que a cliente viu na vitrine.
 * @param modelo  { marca, telas:[{layout?, tipo?, texto, preco, apoio, foto?, foto2?, chips?, ajuste?}] }
 * @param opcoes  { nome, numero, legenda:(estado)=>string, exemplo?:modelo, toast,
 *                  amostra?:boolean  (teste grátis: foto própria leva AMOSTRA; exemplo fica limpo),
 *                  cores?:[{nome,hex}], cor?:string }
 */
const ajusteDe = a => ({ zoom: 1, fx: 0.5, fy: 0.5, ...(a || {}) });
function novaTela(t) {
  return { layout: t.layout, chips: t.chips, tipo: t.tipo, texto: t.texto, preco: t.preco || "", apoio: t.apoio || "",
    fotoSrc: t.foto || null, foto2Src: t.foto2 || null, foto: null, foto2: null,
    ajuste: ajusteDe(t.ajuste), ajuste2: ajusteDe(t.ajuste2), ajusteOrig: ajusteDe(t.ajuste), ajuste2Orig: ajusteDe(t.ajuste2), propria: false, propria2: false };
}
const infoDe = t => LAYOUT_INFO[t.layout] || { fotos: 1, texto: t.tipo === "capa" ? "Texto da capa" : "Produto", preco: "Preço", apoio: "Linha de apoio" };
const temPropria = t => t.propria || t.propria2;
export function montarEditorCompleto(raiz, modelo, opcoes) {
  const { toast } = opcoes, gratis = !!opcoes.amostra, cores = opcoes.cores || [];
  const novo = m => ({ marca: m.marca, cor: opcoes.cor || (cores[0] && cores[0].hex) || null, telas: m.telas.map(novaTela) });
  let st = novo(gratis && opcoes.exemplo ? opcoes.exemplo : modelo), ativa = 0, slot = 1, versao = 0;
  const share = podeCompartilhar(), total = st.telas.length;
  raiz.innerHTML = `
    ${opcoes.exemplo && !gratis ? `<div class="ed-modelos" role="group" aria-label="Ponto de partida"><button type="button" class="chip on" data-modelo="modelo">Modelo em branco</button><button type="button" class="chip" data-modelo="exemplo">Ver exemplo preenchido</button></div>` : ""}
    <div class="ed-grade">
      <div class="ed-previa">
        <div class="ed-telas" role="list" aria-label="As ${total} telas do carrossel">
          ${st.telas.map((_, i) => `<button type="button" class="ed-tela" role="listitem" data-tela="${i}" aria-label="Editar tela ${i + 1}"><canvas width="${W}" height="${H}"></canvas><span>Tela ${i + 1}</span></button>`).join("")}
        </div>
        <p class="hint ed-dica">Deslize para ver as ${total} telas. Toque numa tela para editar.</p>
      </div>
      <div class="ed-painel">
        <label class="campo"><span>Nome da loja (marca)</span><input data-marca autocomplete="organization" maxlength="40"></label>
        ${cores.length ? `<div class="campo"><span>Cor de destaque</span><div class="ed-cores" role="radiogroup" aria-label="Cor de destaque">${cores.map(c => `<button type="button" role="radio" class="ed-cor" data-cor="${c.hex}" style="--c:${c.hex}" aria-label="${esc(c.nome)}" title="${esc(c.nome)}"></button>`).join("")}</div></div>` : ""}
        <div class="ed-abas" role="tablist" aria-label="Tela em edição">${st.telas.map((_, i) => `<button type="button" role="tab" data-aba="${i}">Tela ${i + 1}</button>`).join("")}</div>
        <div class="ed-slots" role="group" aria-label="Qual foto" hidden><button type="button" class="chip" data-slot="1">Foto 1</button><button type="button" class="chip" data-slot="2">Foto 2</button></div>
        ${blocoFoto()}
        <label class="campo" data-campo-box="texto"><span data-rot="texto">Texto</span><input data-campo="texto" maxlength="70"></label>
        <label class="campo" data-campo-box="preco"><span data-rot="preco">Preço</span><input data-campo="preco" maxlength="24"></label>
        <label class="campo" data-campo-box="apoio"><span data-rot="apoio">Linha de apoio</span><input data-campo="apoio" maxlength="70"></label>
        ${gratis ? `<p class="hint" data-aviso-marca></p>` : ""}
      </div>
      <aside class="ed-legenda"><h3>Legenda</h3><pre class="legenda-txt" data-legenda></pre><button type="button" class="btn ghost block" data-copiar-legenda>Copiar legenda</button></aside>
    </div>
    <div class="ed-baixar">
      <h3>Baixar as imagens</h3>
      <p class="hint">${total} PNGs de 1080 × 1350, numerados na ordem de postagem${gratis ? ". No teste grátis, telas com a sua foto saem com a marca AMOSTRA" : ", sem marca-d'água"}.</p>
      <div class="ed-botoes">
        ${share ? `<button type="button" class="btn" data-share>Compartilhar imagens</button>` : ""}
        <button type="button" class="btn ${share ? "ghost" : ""}" data-png>Baixar as ${total} imagens</button>
        <button type="button" class="btn ghost" data-zip>Baixar tudo em .zip</button>
      </div>
      ${share ? `<p class="hint">No iPhone, use "Compartilhar imagens" e toque em "Salvar imagens".</p>` : ""}
    </div>`;
  const $ = s => raiz.querySelector(s);
  const canvases = [...raiz.querySelectorAll(".ed-tela canvas")];
  const campos = [...raiz.querySelectorAll("[data-campo]")], marca = $("[data-marca]");
  const pintar = i => {
    const t = st.telas[i];
    desenharTela(canvases[i], t, { marca: st.marca, cor: st.cor, indice: i, total, amostra: gratis && temPropria(t),
      foto: t.foto && t.foto.img, fw: t.foto && t.foto.w, fh: t.foto && t.foto.h, ajuste: t.ajuste,
      foto2: t.foto2 && t.foto2.img, fw2: t.foto2 && t.foto2.w, fh2: t.foto2 && t.foto2.h, ajuste2: t.ajuste2 });
    raiz.dataset.marcas = st.telas.map(x => gratis && temPropria(x) ? "amostra" : "limpa").join(",");
  };
  const pintarTodas = () => st.telas.forEach((_, i) => pintar(i));
  const pend = new Set(); let raf = 0;
  const agendar = (...is) => { is.forEach(i => pend.add(i)); if (!raf) raf = requestAnimationFrame(() => { raf = 0; pend.forEach(pintar); pend.clear(); }); };
  const legenda = () => { $("[data-legenda]").textContent = opcoes.legenda(st); };
  const fotoAtual = t => slot === 2 ? { f: t.foto2, a: t.ajuste2, p: t.propria2 } : { f: t.foto, a: t.ajuste, p: t.propria };
  const sincronizar = () => {
    const t = st.telas[ativa], { f, a, p } = fotoAtual(t);
    $(".ed-ajuste").hidden = !f;
    raiz.querySelectorAll("[data-aj]").forEach(inp => inp.value = a[inp.dataset.aj]);
    const tirar = $("[data-tirar]");
    tirar.textContent = gratis ? "Voltar à foto de exemplo" : "Remover foto";
    tirar.hidden = gratis ? !p : !f;
    if (gratis) $("[data-aviso-marca]").textContent = temPropria(t) ? "Esta tela está com a sua foto: no teste grátis ela leva a marca AMOSTRA. Na campanha comprada, sai limpa." : "Foto de exemplo: sem marca. Troque pela sua para ver como fica.";
  };
  const preencher = () => {
    const t = st.telas[ativa], info = infoDe(t);
    if (info.fotos < 2) slot = 1;
    marca.value = st.marca; campos.forEach(c => c.value = t[c.dataset.campo]);
    for (const k of ["texto", "preco", "apoio"]) { const box = $(`[data-campo-box="${k}"]`); box.hidden = info[k] === null; $(`[data-rot="${k}"]`).textContent = info[k] || ""; }
    $(".ed-slots").hidden = info.fotos < 2;
    raiz.querySelectorAll("[data-slot]").forEach(b => b.classList.toggle("on", +b.dataset.slot === slot));
    raiz.querySelectorAll("[data-cor]").forEach(b => { const on = b.dataset.cor === st.cor; b.classList.toggle("on", on); b.setAttribute("aria-checked", String(on)); });
    sincronizar();
    raiz.querySelectorAll("[data-aba]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.aba === ativa)));
    raiz.querySelectorAll(".ed-tela").forEach(b => b.classList.toggle("on", +b.dataset.tela === ativa));
  };
  const selecionar = (i, rolar) => {
    ativa = i; slot = 1; preencher();
    if (rolar) { const el = raiz.querySelectorAll(".ed-tela")[i]; el.parentElement.scrollTo({ left: el.offsetLeft - el.parentElement.offsetLeft - 8, behavior: "smooth" }); }
  };
  async function carregar(qual) {
    const v = ++versao;
    st = { ...novo(qual === "exemplo" ? opcoes.exemplo : modelo), cor: st.cor };
    raiz.querySelectorAll("[data-modelo]").forEach(b => b.classList.toggle("on", b.dataset.modelo === qual));
    await carregarFontes();
    const fotos = await Promise.all(st.telas.map(t => Promise.all([fotoDeArquivo(t.fotoSrc), fotoDeArquivo(t.foto2Src)])));
    if (v !== versao) return;
    fotos.forEach(([f, f2], i) => { st.telas[i].foto = f; st.telas[i].foto2 = f2; });
    pintarTodas(); preencher(); legenda();
  }
  raiz.addEventListener("click", e => {
    const dentro = sel => { const el = e.target.closest(sel); return el && el !== raiz && raiz.contains(el) ? el : null; };
    const m = dentro("[data-modelo]"); if (m) { carregar(m.dataset.modelo); return; }
    const t = dentro("[data-tela]"); if (t) { selecionar(+t.dataset.tela, false); return; }
    const a = dentro("[data-aba]"); if (a) { selecionar(+a.dataset.aba, true); return; }
    const sl = e.target.closest("[data-slot]"); if (sl) { slot = +sl.dataset.slot; preencher(); return; }
    const c = e.target.closest("[data-cor]"); if (c) { st.cor = c.dataset.cor; preencher(); agendar(...st.telas.keys()); return; }
  });
  // fotos: trocar (marca a tela como "foto própria"), voltar ao exemplo, enquadrar
  raiz.querySelectorAll("[data-arquivo]").forEach(inp => inp.addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    if (!ehImagem(f)) { toast("Escolha um arquivo de imagem."); return; }
    const t = st.telas[ativa], s2 = slot === 2;
    try {
      const img = await carregarFoto(f);
      if (s2) { t.foto2 = img; t.ajuste2 = ajusteDe(); t.propria2 = true; } else { t.foto = img; t.ajuste = ajusteDe(); t.propria = true; }
      sincronizar(); agendar(ativa); toast(gratis ? "Foto trocada. No teste grátis, ela leva a marca AMOSTRA." : "Foto trocada.");
    } catch { toast("Não consegui abrir essa foto. Tente outra (JPG ou PNG)."); }
  }));
  $("[data-tirar]").addEventListener("click", async () => {
    const t = st.telas[ativa], s2 = slot === 2;
    if (gratis) {
      if (s2) { t.foto2 = await fotoDeArquivo(t.foto2Src); t.ajuste2 = { ...t.ajuste2Orig }; t.propria2 = false; }
      else { t.foto = await fotoDeArquivo(t.fotoSrc); t.ajuste = { ...t.ajusteOrig }; t.propria = false; }
      toast("Foto de exemplo de volta, sem marca.");
    } else if (s2) t.foto2 = null; else t.foto = null;
    sincronizar(); agendar(ativa);
  });
  raiz.querySelectorAll("[data-aj]").forEach(inp => inp.addEventListener("input", () => { const t = st.telas[ativa]; (slot === 2 ? t.ajuste2 : t.ajuste)[inp.dataset.aj] = +inp.value; agendar(ativa); }));
  marca.addEventListener("input", () => { st.marca = marca.value; agendar(...st.telas.keys()); legenda(); });
  campos.forEach(c => c.addEventListener("input", () => { st.telas[ativa][c.dataset.campo] = c.value; agendar(ativa); legenda(); }));
  $("[data-copiar-legenda]").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("[data-legenda]").textContent); toast("Legenda copiada."); }
    catch { const r = document.createRange(); r.selectNodeContents($("[data-legenda]")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Legenda selecionada. Use copiar do seu aparelho."); }
  });
  const arquivos = async () => { await carregarFontes(); pintarTodas(); return Promise.all(canvases.map(async (c, i) => ({ name: nomeArquivo(i, st.telas[i]), blob: await toBlob(c) }))); };
  const nomeZip = `carrossel-${opcoes.numero}-${slug(opcoes.nome)}.zip`;
  $("[data-png]").addEventListener("click", async () => { const fs = await arquivos(); for (const f of fs) { baixar(f.blob, f.name); await espera(350); } toast(`${fs.length} imagens baixadas, de 01 a ${String(fs.length).padStart(2, "0")}.`); });
  $("[data-zip]").addEventListener("click", async () => {
    const fs = await arquivos();
    baixar(new Blob([zipStore(await Promise.all(fs.map(async f => ({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()) }))))], { type: "application/zip" }), nomeZip);
    toast("Arquivo .zip baixado.");
  });
  $("[data-share]")?.addEventListener("click", async () => {
    const fs = await arquivos();
    try { await navigator.share({ files: fs.map(f => new File([f.blob], f.name, { type: "image/png" })), title: opcoes.nome }); }
    catch (err) { if (err && err.name !== "AbortError") toast("Não deu para compartilhar. Use \"Baixar as imagens\"."); }
  });
  carregar(gratis && opcoes.exemplo ? "exemplo" : "modelo");
  return { estado: () => st };
}
