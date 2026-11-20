/* Editor "Experimentar uma publicação" e a amostra antes/depois.
   As fotos são lidas e desenhadas só no navegador: nada é enviado a servidor. */
import { desenharTela, carregarFontes, carregarFoto, W, H } from "./render.js";
import { legendaEditor, nomeArquivo, zipStore } from "./logic.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const fotosCache = new Map();
async function fotoDeArquivo(caminho) {
  if (!fotosCache.has(caminho)) fotosCache.set(caminho, fetch(caminho).then(r => r.blob()).then(carregarFoto).catch(() => null));
  return fotosCache.get(caminho);
}
const toBlob = c => new Promise(ok => c.toBlob(ok, "image/png"));
const espera = ms => new Promise(ok => setTimeout(ok, ms));

/* ---------------- amostra antes/depois (página inicial) ---------------- */
export async function montarAntesDepois(raiz, campanha, indice = 1) {
  const ed = campanha.editor, antes = ed.antes.telas[indice], depois = ed.exemplo.telas[indice];
  raiz.innerHTML = `
    <figure class="ad-item"><canvas width="${W}" height="${H}" aria-label="Antes: a peça como chega, com foto genérica e marcadores"></canvas><figcaption><b>Antes</b> Como a peça chega: marcadores para trocar</figcaption></figure>
    <figure class="ad-item"><canvas width="${W}" height="${H}" aria-label="Depois: a mesma peça com foto, preço e marca da loja"></canvas><figcaption><b>Depois</b> Com a foto, o preço e a marca da loja</figcaption></figure>`;
  const [ca, cd] = raiz.querySelectorAll("canvas");
  await carregarFontes();
  const total = ed.antes.telas.length;
  desenharTela(ca, antes, { marca: ed.antes.marca, foto: null, indice, total });
  const f = await fotoDeArquivo(depois.foto);
  desenharTela(cd, depois, { marca: ed.exemplo.marca, foto: f && f.img, fw: f && f.w, fh: f && f.h, indice, total });
}

/* ---------------- editor ---------------- */
export function montarEditor(raiz, campanha, { toast }) {
  const ed = campanha.editor;
  const novo = modelo => ({
    marca: modelo.marca,
    telas: modelo.telas.map(t => ({ tipo: t.tipo, texto: t.texto, preco: t.preco, apoio: t.apoio, fotoSrc: t.foto || null, foto: null, ajuste: { zoom: 1, fx: 0.5, fy: 0.5 } }))
  });
  let st = novo(ed.antes), ativa = 0, versao = 0;
  const podeCompartilhar = (() => { try { return !!(navigator.canShare && navigator.canShare({ files: [new File([new Uint8Array(1)], "a.png", { type: "image/png" })] })); } catch { return false; } })();

  raiz.innerHTML = `
    <div class="ed-modelos" role="group" aria-label="Ponto de partida">
      <button type="button" class="chip on" data-modelo="antes">Começar do modelo</button>
      <button type="button" class="chip" data-modelo="exemplo">Ver exemplo preenchido</button>
    </div>
    <div class="ed-grade">
      <div class="ed-previa">
        <div class="ed-telas" role="list" aria-label="As 4 telas do carrossel">
          ${st.telas.map((_, i) => `<button type="button" class="ed-tela" role="listitem" data-tela="${i}" aria-label="Editar tela ${i + 1}"><canvas width="${W}" height="${H}"></canvas><span>Tela ${i + 1}</span></button>`).join("")}
        </div>
        <p class="hint ed-dica">Deslize para ver as 4 telas. Toque numa tela para editar.</p>
      </div>
      <div class="ed-painel">
        <label class="campo"><span>Nome da loja (marca)</span><input id="ed-marca" autocomplete="organization" maxlength="40"></label>
        <div class="ed-abas" role="tablist" aria-label="Tela em edição">${st.telas.map((_, i) => `<button type="button" role="tab" data-aba="${i}">Tela ${i + 1}</button>`).join("")}</div>
        <div class="ed-campos">
          <div class="ed-foto">
            <label class="btn ghost sm arquivo">Trocar foto<input type="file" id="ed-arquivo" accept="image/*"></label>
            <label class="btn ghost sm arquivo">Tirar foto<input type="file" id="ed-camera" accept="image/*" capture="environment"></label>
            <button type="button" class="link" id="ed-tirar">Remover foto</button>
          </div>
          <div class="ed-ajuste">
            <label class="campo mini"><span>Zoom</span><input type="range" id="ed-zoom" min="1" max="2.5" step="0.01"></label>
            <label class="campo mini"><span>Posição ← →</span><input type="range" id="ed-fx" min="0" max="1" step="0.01"></label>
            <label class="campo mini"><span>Posição ↑ ↓</span><input type="range" id="ed-fy" min="0" max="1" step="0.01"></label>
          </div>
          <label class="campo"><span id="ed-texto-rot">Texto</span><input id="ed-texto" maxlength="60"></label>
          <label class="campo"><span>Preço</span><input id="ed-preco" maxlength="24" inputmode="text"></label>
          <label class="campo"><span>Linha de apoio</span><input id="ed-apoio" maxlength="60"></label>
        </div>
      </div>
      <aside class="ed-legenda">
        <h3>Legenda</h3>
        <pre id="ed-leg" class="legenda-txt"></pre>
        <button type="button" class="btn ghost block" id="ed-copiar">Copiar legenda</button>
      </aside>
    </div>
    <div class="ed-baixar">
      <h3>Baixar as imagens</h3>
      <p class="hint">4 imagens em PNG, 1080 × 1350 (formato do Instagram), numeradas na ordem de postagem.</p>
      <div class="ed-botoes">
        ${podeCompartilhar ? `<button type="button" class="btn" id="ed-share">Compartilhar imagens</button>` : ""}
        <button type="button" class="btn ${podeCompartilhar ? "ghost" : ""}" id="ed-png">Baixar as 4 imagens</button>
        <button type="button" class="btn ghost" id="ed-zip">Baixar tudo em .zip</button>
      </div>
      ${podeCompartilhar ? `<p class="hint">No iPhone, use "Compartilhar imagens" e toque em "Salvar imagens".</p>` : ""}
    </div>`;

  const $ = s => raiz.querySelector(s);
  const canvases = [...raiz.querySelectorAll(".ed-tela canvas")];
  const campos = { marca: $("#ed-marca"), texto: $("#ed-texto"), preco: $("#ed-preco"), apoio: $("#ed-apoio"), zoom: $("#ed-zoom"), fx: $("#ed-fx"), fy: $("#ed-fy") };

  const desenhar = i => {
    const t = st.telas[i];
    desenharTela(canvases[i], t, { marca: st.marca, foto: t.foto && t.foto.img, fw: t.foto && t.foto.w, fh: t.foto && t.foto.h, ajuste: t.ajuste, indice: i, total: st.telas.length });
  };
  const desenharTodas = () => st.telas.forEach((_, i) => desenhar(i));
  let pendente = new Set(), raf = 0;
  const agendar = (...is) => { is.forEach(i => pendente.add(i)); if (!raf) raf = requestAnimationFrame(() => { raf = 0; pendente.forEach(desenhar); pendente.clear(); }); };

  const atualizarLegenda = () => { $("#ed-leg").textContent = legendaEditor(ed.legenda, st); };
  const preencherCampos = () => {
    const t = st.telas[ativa];
    campos.marca.value = st.marca; campos.texto.value = t.texto; campos.preco.value = t.preco; campos.apoio.value = t.apoio;
    campos.zoom.value = t.ajuste.zoom; campos.fx.value = t.ajuste.fx; campos.fy.value = t.ajuste.fy;
    $("#ed-texto-rot").textContent = t.tipo === "capa" ? "Texto da capa" : "Produto";
    raiz.querySelector(".ed-ajuste").hidden = !t.foto; $("#ed-tirar").hidden = !t.foto;
    raiz.querySelectorAll("[data-aba]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.aba === ativa)));
    raiz.querySelectorAll(".ed-tela").forEach(b => b.classList.toggle("on", +b.dataset.tela === ativa));
  };
  const selecionar = (i, rolar) => {
    ativa = i; preencherCampos();
    if (rolar) { const el = raiz.querySelectorAll(".ed-tela")[i]; el.parentElement.scrollTo({ left: el.offsetLeft - el.parentElement.offsetLeft - 8, behavior: "smooth" }); }
  };

  async function carregarModelo(nome) {
    const v = ++versao;
    st = novo(nome === "exemplo" ? ed.exemplo : ed.antes);
    raiz.querySelectorAll("[data-modelo]").forEach(b => b.classList.toggle("on", b.dataset.modelo === nome));
    await carregarFontes();
    if (nome === "exemplo") {
      const fotos = await Promise.all(st.telas.map(t => t.fotoSrc ? fotoDeArquivo(t.fotoSrc) : null));
      if (v !== versao) return;
      fotos.forEach((f, i) => st.telas[i].foto = f);
    }
    desenharTodas(); preencherCampos(); atualizarLegenda();
  }

  async function trocarFoto(arquivo) {
    if (!arquivo) return;
    if (!/^image\//.test(arquivo.type) && !/\.(jpe?g|png|webp|heic|heif|gif)$/i.test(arquivo.name)) { toast("Escolha um arquivo de imagem."); return; }
    const i = ativa;
    try {
      const f = await carregarFoto(arquivo);
      st.telas[i].foto = f; st.telas[i].ajuste = { zoom: 1, fx: 0.5, fy: 0.5 };
      desenhar(i); if (i === ativa) preencherCampos();
      toast(`Foto da tela ${i + 1} trocada.`);
    } catch { toast("Não consegui abrir essa foto. Tente outra (JPG ou PNG)."); }
  }

  raiz.addEventListener("click", e => {
    const m = e.target.closest("[data-modelo]"); if (m) { carregarModelo(m.dataset.modelo); return; }
    const t = e.target.closest("[data-tela]"); if (t) { selecionar(+t.dataset.tela, false); campos.texto.focus({ preventScroll: true }); return; }
    const a = e.target.closest("[data-aba]"); if (a) { selecionar(+a.dataset.aba, true); return; }
  });
  $("#ed-arquivo").addEventListener("change", e => { trocarFoto(e.target.files[0]); e.target.value = ""; });
  $("#ed-camera").addEventListener("change", e => { trocarFoto(e.target.files[0]); e.target.value = ""; });
  $("#ed-tirar").addEventListener("click", () => { st.telas[ativa].foto = null; desenhar(ativa); preencherCampos(); });
  campos.marca.addEventListener("input", () => { st.marca = campos.marca.value; agendar(0, 1, 2, 3); atualizarLegenda(); });
  for (const k of ["texto", "preco", "apoio"]) campos[k].addEventListener("input", () => { st.telas[ativa][k] = campos[k].value; agendar(ativa); atualizarLegenda(); });
  for (const k of ["zoom", "fx", "fy"]) campos[k].addEventListener("input", () => { st.telas[ativa].ajuste[k] = +campos[k].value; agendar(ativa); });

  $("#ed-copiar").addEventListener("click", async () => {
    const txt = $("#ed-leg").textContent;
    try { await navigator.clipboard.writeText(txt); toast("Legenda copiada."); }
    catch { const r = document.createRange(); r.selectNodeContents($("#ed-leg")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Legenda selecionada. Use copiar do seu aparelho."); }
  });

  const arquivos = async () => {
    await carregarFontes(); desenharTodas();
    return Promise.all(canvases.map(async (c, i) => ({ name: nomeArquivo(i, st.telas[i]), blob: await toBlob(c) })));
  };
  const baixar = (blob, nome) => { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); };
  $("#ed-png").addEventListener("click", async () => {
    const fs = await arquivos();
    for (const f of fs) { baixar(f.blob, f.name); await espera(350); }
    toast("4 imagens baixadas, de 01 a 04.");
  });
  $("#ed-zip").addEventListener("click", async () => {
    const fs = await arquivos();
    const zip = zipStore(await Promise.all(fs.map(async f => ({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()) }))));
    baixar(new Blob([zip], { type: "application/zip" }), "natal-no-ar-carrossel.zip");
    toast("Arquivo .zip baixado.");
  });
  $("#ed-share")?.addEventListener("click", async () => {
    const fs = await arquivos();
    const files = fs.map(f => new File([f.blob], f.name, { type: "image/png" }));
    try { await navigator.share({ files, title: "Carrossel Natal no Ar" }); }
    catch (err) { if (err && err.name !== "AbortError") toast("Não deu para compartilhar. Use \"Baixar as 4 imagens\"."); }
  });

  carregarModelo("antes");
  return { carregarModelo, estado: () => st };
}
