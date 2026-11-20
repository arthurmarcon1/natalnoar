/* Editores de carrossel. As fotos são lidas e desenhadas só no navegador: nada é enviado a servidor.
   - montarAmostra: 1 tela, com marca-d'água AMOSTRA (inclusive no PNG).
   - montarEditorCompleto: área da cliente, 4 telas por carrossel, PNGs numerados sem marca-d'água. */
import { desenharTela, carregarFontes, carregarFoto, W, H } from "./render.js";
import { nomeArquivo, zipStore, slug } from "./logic.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fotosCache = new Map();
export async function fotoDeArquivo(caminho) {
  if (!fotosCache.has(caminho)) fotosCache.set(caminho, fetch(caminho).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(carregarFoto).catch(() => null));
  return fotosCache.get(caminho);
}
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
const novaTela = t => ({ tipo: t.tipo, texto: t.texto, preco: t.preco || "", apoio: t.apoio || "", fotoSrc: t.foto || null, foto: null, ajuste: { zoom: 1, fx: 0.5, fy: 0.5 } });
function ligarFoto(raiz, obterTela, aoMudar, toast) {
  raiz.querySelectorAll("[data-arquivo]").forEach(inp => inp.addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    if (!ehImagem(f)) { toast("Escolha um arquivo de imagem."); return; }
    const t = obterTela();
    try { t.foto = await carregarFoto(f); t.ajuste = { zoom: 1, fx: 0.5, fy: 0.5 }; aoMudar(true); toast("Foto trocada."); }
    catch { toast("Não consegui abrir essa foto. Tente outra (JPG ou PNG)."); }
  }));
  raiz.querySelector("[data-tirar]").addEventListener("click", () => { obterTela().foto = null; aoMudar(true); });
  raiz.querySelectorAll("[data-aj]").forEach(inp => inp.addEventListener("input", () => { obterTela().ajuste[inp.dataset.aj] = +inp.value; aoMudar(false); }));
}
function sincronizarFoto(raiz, t) {
  raiz.querySelector(".ed-ajuste").hidden = !t.foto; raiz.querySelector("[data-tirar]").hidden = !t.foto;
  raiz.querySelectorAll("[data-aj]").forEach(inp => inp.value = t.ajuste[inp.dataset.aj]);
}
const desenhar = (canvas, t, marca, indice, total, amostra) =>
  desenharTela(canvas, t, { marca, foto: t.foto && t.foto.img, fw: t.foto && t.foto.w, fh: t.foto && t.foto.h, ajuste: t.ajuste, indice, total, amostra });

/* ---------------- amostra: 1 tela com marca-d'água ---------------- */
export function montarAmostra(raiz, demo, { toast }) {
  const p = demo.produtos[0];
  const t = novaTela({ tipo: "produto", texto: p.nome, preco: p.preco, apoio: p.paraQuem, foto: p.foto });
  raiz.innerHTML = `
    <div class="am-grade">
      <figure class="am-previa"><canvas width="${W}" height="${H}" aria-label="Prévia da tela de amostra"></canvas>
        <figcaption class="hint">Amostra com marca-d'água. Na campanha comprada, as imagens saem sem marca.</figcaption></figure>
      <div class="ed-painel">
        <p class="am-passo"><b>1.</b> Troque a foto</p>
        ${blocoFoto()}
        <p class="am-passo"><b>2.</b> Mude o produto e o preço</p>
        <label class="campo"><span>Nome do produto</span><input data-campo="texto" maxlength="40" autocomplete="off"></label>
        <label class="campo"><span>Preço</span><input data-campo="preco" maxlength="20" autocomplete="off"></label>
        <button type="button" class="btn ghost sm" data-baixar-amostra>Baixar amostra (PNG com marca-d'água)</button>
      </div>
    </div>`;
  const canvas = raiz.querySelector("canvas");
  const campos = [...raiz.querySelectorAll("[data-campo]")];
  campos.forEach(c => c.value = t[c.dataset.campo]);
  let raf = 0;
  const redesenhar = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; desenhar(canvas, t, demo.marca, 1, 4, true); }); };
  ligarFoto(raiz, () => t, mudouFoto => { if (mudouFoto) sincronizarFoto(raiz, t); redesenhar(); }, toast);
  campos.forEach(c => c.addEventListener("input", () => { t[c.dataset.campo] = c.value; redesenhar(); }));
  raiz.querySelector("[data-baixar-amostra]").addEventListener("click", async () => {
    await carregarFontes(); desenhar(canvas, t, demo.marca, 1, 4, true);
    baixar(await toBlob(canvas), "amostra-natal-no-ar.png"); toast("Amostra baixada (com marca-d'água).");
  });
  (async () => {
    await carregarFontes();
    t.foto = await fotoDeArquivo(p.foto); sincronizarFoto(raiz, t);
    desenhar(canvas, t, demo.marca, 1, 4, true);
  })();
}

/* ---------------- editor completo (área da cliente) ---------------- */
/**
 * @param modelo  { marca, telas:[{tipo,texto,preco,apoio,foto?}] }
 * @param opcoes  { nome, numero, legenda:(estado)=>string, exemplo?:modelo, toast }
 */
export function montarEditorCompleto(raiz, modelo, opcoes) {
  const { toast } = opcoes;
  const novo = m => ({ marca: m.marca, telas: m.telas.map(novaTela) });
  let st = novo(modelo), ativa = 0, versao = 0;
  const share = podeCompartilhar();
  const total = st.telas.length;
  raiz.innerHTML = `
    ${opcoes.exemplo ? `<div class="ed-modelos" role="group" aria-label="Ponto de partida"><button type="button" class="chip on" data-modelo="modelo">Modelo em branco</button><button type="button" class="chip" data-modelo="exemplo">Ver exemplo preenchido</button></div>` : ""}
    <div class="ed-grade">
      <div class="ed-previa">
        <div class="ed-telas" role="list" aria-label="As ${total} telas do carrossel">
          ${st.telas.map((_, i) => `<button type="button" class="ed-tela" role="listitem" data-tela="${i}" aria-label="Editar tela ${i + 1}"><canvas width="${W}" height="${H}"></canvas><span>Tela ${i + 1}</span></button>`).join("")}
        </div>
        <p class="hint ed-dica">Deslize para ver as ${total} telas. Toque numa tela para editar.</p>
      </div>
      <div class="ed-painel">
        <label class="campo"><span>Nome da loja (marca)</span><input data-marca autocomplete="organization" maxlength="40"></label>
        <div class="ed-abas" role="tablist" aria-label="Tela em edição">${st.telas.map((_, i) => `<button type="button" role="tab" data-aba="${i}">Tela ${i + 1}</button>`).join("")}</div>
        ${blocoFoto()}
        <label class="campo"><span data-rot-texto>Texto</span><input data-campo="texto" maxlength="60"></label>
        <label class="campo"><span>Preço</span><input data-campo="preco" maxlength="24"></label>
        <label class="campo"><span>Linha de apoio</span><input data-campo="apoio" maxlength="60"></label>
      </div>
      <aside class="ed-legenda"><h3>Legenda</h3><pre class="legenda-txt" data-legenda></pre><button type="button" class="btn ghost block" data-copiar-legenda>Copiar legenda</button></aside>
    </div>
    <div class="ed-baixar">
      <h3>Baixar as imagens</h3>
      <p class="hint">${total} PNGs de 1080 × 1350, numerados na ordem de postagem, sem marca-d'água.</p>
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
  const pintar = i => desenhar(canvases[i], st.telas[i], st.marca, i, total, false);
  const pintarTodas = () => st.telas.forEach((_, i) => pintar(i));
  const pend = new Set(); let raf = 0;
  const agendar = (...is) => { is.forEach(i => pend.add(i)); if (!raf) raf = requestAnimationFrame(() => { raf = 0; pend.forEach(pintar); pend.clear(); }); };
  const legenda = () => { $("[data-legenda]").textContent = opcoes.legenda(st); };
  const preencher = () => {
    const t = st.telas[ativa];
    marca.value = st.marca; campos.forEach(c => c.value = t[c.dataset.campo]);
    $("[data-rot-texto]").textContent = t.tipo === "capa" ? "Texto da capa" : "Produto";
    sincronizarFoto(raiz, t);
    raiz.querySelectorAll("[data-aba]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.aba === ativa)));
    raiz.querySelectorAll(".ed-tela").forEach(b => b.classList.toggle("on", +b.dataset.tela === ativa));
  };
  const selecionar = (i, rolar) => {
    ativa = i; preencher();
    if (rolar) { const el = raiz.querySelectorAll(".ed-tela")[i]; el.parentElement.scrollTo({ left: el.offsetLeft - el.parentElement.offsetLeft - 8, behavior: "smooth" }); }
  };
  async function carregar(qual) {
    const v = ++versao;
    st = novo(qual === "exemplo" ? opcoes.exemplo : modelo);
    raiz.querySelectorAll("[data-modelo]").forEach(b => b.classList.toggle("on", b.dataset.modelo === qual));
    await carregarFontes();
    const fotos = await Promise.all(st.telas.map(t => t.fotoSrc ? fotoDeArquivo(t.fotoSrc) : null));
    if (v !== versao) return;
    fotos.forEach((f, i) => st.telas[i].foto = f);
    pintarTodas(); preencher(); legenda();
  }
  raiz.addEventListener("click", e => {
    const m = e.target.closest("[data-modelo]"); if (m) { carregar(m.dataset.modelo); return; }
    const t = e.target.closest("[data-tela]"); if (t) { selecionar(+t.dataset.tela, false); return; }
    const a = e.target.closest("[data-aba]"); if (a) { selecionar(+a.dataset.aba, true); return; }
  });
  ligarFoto(raiz, () => st.telas[ativa], mudouFoto => { if (mudouFoto) sincronizarFoto(raiz, st.telas[ativa]); agendar(ativa); }, toast);
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
  carregar("modelo");
  return { estado: () => st };
}
