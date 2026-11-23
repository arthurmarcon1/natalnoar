/* =====================================================================
   MODELOS DE CARROSSEL: identidade de cada coleção + composição de cada tela.

   Cada coleção tem paleta, tipografia, tratamento de foto e elementos
   próprios. Dentro da coleção, cada carrossel tem composições desenhadas
   para o tema. Regra de legibilidade: título e preço ficam sempre sobre
   papel, cartão ou etiqueta (nunca soltos sobre a foto da cliente) e
   diminuem de tamanho para caber.

   Uma tela é { layout, texto, preco, apoio, foto?, foto2?, chips? }.
   Desenho em 1080 × 1350; a prévia e o PNG exportado saem daqui.
   ===================================================================== */
import { coverRect, ajustarTexto } from "./logic.js";

const W = 1080, H = 1350, P = 64;
const SERIF = '"Fraunces", Georgia, serif';
const SANS = '"Plus Jakarta Sans", system-ui, sans-serif';

/* ---------------- coleções ---------------- */
export const COLECOES = {
  presentes: {
    id: "presentes",
    nome: "Presentes por orçamento",
    publico: "Para lojistas",
    paleta: { papel: "#F4ECE1", papel2: "#E9DDCB", tinta: "#221A17", suave: "#6E5F55", verde: "#1E3A2B", ouro: "#C9A45C" },
    cores: [
      { id: "cereja", nome: "Cereja", hex: "#A3122A" },
      { id: "pinho", nome: "Pinho", hex: "#1E5A3F" },
      { id: "dourado", nome: "Dourado", hex: "#9C7128" },
      { id: "ameixa", nome: "Ameixa", hex: "#5B2A4A" }
    ],
    tipografia: "Fraunces para títulos, preço em itálico grande; Plus Jakarta Sans em caixa alta para rótulos.",
    fotos: "Foto com moldura de papel e cantos arredondados. Texto e preço sempre em papel ou etiqueta, legíveis com qualquer foto.",
    elementos: "Etiqueta de presente com o preço, estrela ✦ e fita dupla na cor de destaque."
  },
  bastidores: {
    id: "bastidores",
    nome: "Por trás do resultado",
    publico: "Para prestadoras de serviço",
    paleta: { fundo: "#151311", filme: "#0B0A09", tinta: "#F6F1EA", suave: "#A99C8D", ouro: "#D4B06A", rec: "#E0483E" },
    cores: [
      { id: "areia", nome: "Areia", hex: "#E8D9C5" },
      { id: "ouro", nome: "Ouro", hex: "#D4B06A" },
      { id: "rose", nome: "Rosé", hex: "#E7B7B0" }
    ],
    tipografia: "Fraunces itálico em todos os títulos; rótulos em caixa alta bem espaçados.",
    fotos: "Foto em quadro de filme (folha de contato), sobre fundo escuro de estúdio.",
    elementos: "Furos de filme, ponto REC e uma estrela dourada discreta."
  }
};

/* rótulos dos campos no editor e quantas fotos cada composição usa */
export const LAYOUT_INFO = {
  "faixa-capa": { colecao: "presentes", fotos: 1, texto: "Texto acima do valor", preco: "Valor", apoio: "Linha de apoio" },
  "faixa-produto": { colecao: "presentes", fotos: 1, texto: "Produto", preco: "Preço", apoio: "Para quem combina" },
  "estilo-capa": { colecao: "presentes", fotos: 1, texto: "Título", preco: null, apoio: "Linha de apoio" },
  "estilo-produto": { colecao: "presentes", fotos: 1, texto: "Produto", preco: "Preço", apoio: "Estilo de quem vai ganhar" },
  "favorito-capa": { colecao: "presentes", fotos: 1, texto: "Título", preco: null, apoio: "Linha de apoio" },
  "favorito-revela": { colecao: "presentes", fotos: 1, texto: "Título", preco: "Preço (opcional)", apoio: "Linha de apoio" },
  "dupla-capa": { colecao: "presentes", fotos: 2, texto: "Título", preco: null, apoio: "Linha de apoio" },
  "dupla-produto": { colecao: "presentes", fotos: 2, texto: "Dupla", preco: "Preço da dupla", apoio: "Para quem" },
  "urgencia-capa": { colecao: "presentes", fotos: 1, texto: "Título", preco: "Data", apoio: "Linha de apoio" },
  "urgencia-info": { colecao: "presentes", fotos: 1, texto: "Título do prazo", preco: "Data", apoio: "Detalhe" },
  "urgencia-produto": { colecao: "presentes", fotos: 1, texto: "Produto", preco: "Preço", apoio: "Linha de apoio" },
  "bastidores-capa": { colecao: "bastidores", fotos: 1, texto: "Título", preco: null, apoio: "Rótulo" }
};
export const temLayout = t => !!(t && t.layout && LAYOUTS[t.layout]);
export const colecaoDoLayout = layout => COLECOES[(LAYOUT_INFO[layout] || {}).colecao] || null;

/* ---------------- utilidades de desenho ---------------- */
function caminho(ctx, x, y, w, h, r = 0) { ctx.beginPath(); if (r) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function vazio(ctx, x, y, w, h) {
  ctx.fillStyle = "#E4DACB"; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#D8CCBA"; ctx.lineWidth = 16;
  for (let k = -h; k < w; k += 60) { ctx.beginPath(); ctx.moveTo(x + k, y); ctx.lineTo(x + k + h, y + h); ctx.stroke(); }
  const cx = x + w / 2, cy = y + h / 2;
  ctx.fillStyle = "#E4DACB"; caminho(ctx, cx - 170, cy - 70, 340, 140, 24); ctx.fill();
  ctx.fillStyle = "#7A6E62"; ctx.font = `600 36px ${SANS}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("Sua foto aqui", cx, cy);
}
/* foto em "cover" dentro de um retângulo (slot 1 ou 2) */
function foto(ctx, o, slot, x, y, w, h, r = 0) {
  const f = slot === 2 ? o.foto2 : o.foto, fw = slot === 2 ? o.fw2 : o.fw, fh = slot === 2 ? o.fh2 : o.fh;
  const a = (slot === 2 ? o.ajuste2 : o.ajuste) || { zoom: 1, fx: 0.5, fy: 0.5 };
  ctx.save(); caminho(ctx, x, y, w, h, r); ctx.clip();
  if (f) { const c = coverRect(fw, fh, w, h, a.zoom, a.fx, a.fy); ctx.imageSmoothingQuality = "high"; ctx.drawImage(f, c.sx, c.sy, c.sw, c.sh, x, y, w, h); }
  else vazio(ctx, x, y, w, h);
  ctx.restore();
}
/* texto que diminui para caber; desenha a partir do topo e devolve a altura usada */
function bloco(ctx, o, txt, { x, y, maxW, linhas = 2, tamanhos, fonte, cor, alinhar = "left", entre = 1.08, espaco = 0, caixaAlta = false }) {
  txt = String(txt || "").trim(); if (!txt) return 0;
  if (caixaAlta) txt = txt.toUpperCase();
  const f = s => fonte(s);
  const medir = (s, size) => { ctx.font = f(size); ctx.letterSpacing = espaco ? `${espaco}px` : "0px"; return ctx.measureText(s).width; };
  const r = ajustarTexto(txt, maxW, linhas, tamanhos, medir);
  ctx.font = f(r.size); ctx.letterSpacing = espaco ? `${espaco}px` : "0px";
  ctx.fillStyle = cor; ctx.textAlign = alinhar; ctx.textBaseline = "alphabetic";
  const lh = r.size * entre;
  // último recurso: se nem o menor tamanho couber, a última linha termina em "…" (nada some em silêncio)
  if (r.linhas.length > linhas) { let ult = r.linhas.slice(linhas - 1).join(" "); while (ult.length > 1 && medir(ult + "…", r.size) > maxW) ult = ult.slice(0, -1).trimEnd(); r.linhas = [...r.linhas.slice(0, linhas - 1), ult + "…"]; ctx.font = f(r.size); }
  r.linhas.slice(0, linhas).forEach((l, i) => ctx.fillText(l, alinhar === "center" ? x + maxW / 2 : alinhar === "right" ? x + maxW : x, y + r.size * 0.86 + i * lh, maxW));
  ctx.letterSpacing = "0px";
  const usadas = Math.min(r.linhas.length, linhas), alt = r.size * 0.86 + (usadas - 1) * lh + r.size * 0.24;
  if (o.caixas) o.caixas.push({ campo: txt, x: x + (o._dx || 0), y: y + (o._dy || 0), w: Math.max(...r.linhas.slice(0, linhas).map(l => medir(l, r.size))), h: alt, maxW, size: r.size, linhas: usadas, cortou: r.linhas.some(l => l.endsWith("…")) });
  return alt;
}
function estrela(ctx, cx, cy, r, cor) {
  ctx.fillStyle = cor; ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = Math.PI / 4 * i - Math.PI / 2, rr = i % 2 ? r * 0.32 : r; ctx.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
  ctx.closePath(); ctx.fill();
}
function fita(ctx, y, cor) { ctx.fillStyle = cor; ctx.fillRect(0, y, W, 7); ctx.fillRect(0, y + 14, W, 3); }
function marcaPill(ctx, o, x, y, { papel, tinta, acento }) {
  const m = (o.marca || "").trim().toUpperCase() || "[NOME DA LOJA]";
  ctx.font = `700 28px ${SANS}`; ctx.letterSpacing = "2px";
  const mw = Math.min(ctx.measureText(m).width, 560);
  ctx.fillStyle = papel; caminho(ctx, x, y, mw + 96, 58, 29); ctx.fill();
  estrela(ctx, x + 34, y + 29, 13, acento);
  ctx.fillStyle = tinta; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(m, x + 60, y + 31, mw);
  ctx.letterSpacing = "0px";
}
function contador(ctx, o, x, y, { fundo, cor }) {
  const txt = o.amostra ? "AMOSTRA" : `${o.indice + 1}/${o.total}`;
  ctx.font = `${o.amostra ? 800 : 700} 26px ${SANS}`;
  const w = ctx.measureText(txt).width + 40;
  ctx.fillStyle = o.amostra ? "#A3262A" : fundo; caminho(ctx, x - w, y, w, 50, 25); ctx.fill();
  ctx.fillStyle = o.amostra ? "#FFFFFF" : cor; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, x - w / 2, y + 26);
}
/* etiqueta de presente com o preço (forma de tag com furo e barbante) */
function etiqueta(ctx, o, txt, cx, cy, { papel, tinta, acento, rot = -0.07, tamanhos = [72, 62, 54, 46], maxW = 420 }) {
  txt = String(txt || "").trim(); if (!txt) return;
  const medir = (s, size) => { ctx.font = `800 ${size}px ${SANS}`; return ctx.measureText(s).width; };
  const r = ajustarTexto(txt, maxW, 1, tamanhos, medir), s = r.size, tw = Math.min(medir(r.linhas[0], s), maxW);
  const h = s * 1.75, w = tw + s * 1.6, bico = h * 0.42;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.strokeStyle = acento; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-w / 2 + bico * 0.62, 0); ctx.bezierCurveTo(-w / 2 - 30, -50, -w / 2 - 70, -40, -w / 2 - 110, -90); ctx.stroke();
  ctx.shadowColor = "rgba(0,0,0,.28)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 8;
  ctx.fillStyle = papel; ctx.beginPath();
  ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2 + bico, -h / 2); ctx.lineTo(w / 2 - 14, -h / 2); ctx.arcTo(w / 2, -h / 2, w / 2, 0, 14);
  ctx.arcTo(w / 2, h / 2, 0, h / 2, 14); ctx.lineTo(-w / 2 + bico, h / 2); ctx.closePath(); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = acento; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath();
  ctx.moveTo(-w / 2 + 14, 0); ctx.lineTo(-w / 2 + bico + 6, -h / 2 + 12); ctx.lineTo(w / 2 - 12, -h / 2 + 12); ctx.lineTo(w / 2 - 12, h / 2 - 12); ctx.lineTo(-w / 2 + bico + 6, h / 2 - 12); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = acento; ctx.beginPath(); ctx.arc(-w / 2 + bico * 0.62, 0, 9, 0, 7); ctx.fill();
  ctx.fillStyle = tinta; ctx.font = `800 ${s}px ${SANS}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(r.linhas[0], bico * 0.42, s * 0.04, maxW);
  ctx.restore();
  if (o.caixas) o.caixas.push({ campo: txt, tipo: "etiqueta", x: cx - w / 2, y: cy - h / 2, w, h, maxW: w, size: s, linhas: 1, cortou: false });
}
/* marca-d'água da amostra: só quando a visitante usa foto própria no teste grátis */
function marcaDagua(ctx, o) {
  if (!o.amostra) return;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 7);
  ctx.font = `800 60px ${SANS}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round"; ctx.lineWidth = 3;
  for (let i = -6; i <= 6; i++) { const y = i * 200, off = (i & 1) * 215; for (let x = -W * 1.3; x <= W * 1.3; x += 430) { ctx.strokeStyle = "rgba(0,0,0,.32)"; ctx.strokeText("AMOSTRA", x + off, y); ctx.fillStyle = "rgba(255,255,255,.36)"; ctx.fillText("AMOSTRA", x + off, y); } }
  ctx.restore();
}
const cores = (o, col) => ({ ...col.paleta, acento: o.cor || col.cores[0].hex });
const temP = t => String(t.preco || "").trim();

/* ---------------- coleção PRESENTES ---------------- */
const PR = COLECOES.presentes;
function moldura(ctx, o, x, y, w, h, c, slot = 1) {
  ctx.fillStyle = "#FFFFFF"; caminho(ctx, x - 12, y - 12, w + 24, h + 24, 28); ctx.fill();
  foto(ctx, o, slot, x, y, w, h, 20);
}

export const LAYOUTS = {
  /* 1. Presentes por faixa de preço: valor em destaque na capa, uma foto por tela */
  "faixa-capa"(ctx, t, o) {
    const c = cores(o, PR);
    ctx.fillStyle = c.papel; ctx.fillRect(0, 0, W, H); fita(ctx, 30, c.acento);
    marcaPill(ctx, o, P, 86, { papel: c.papel2, tinta: c.tinta, acento: c.acento });
    let y = 200 + bloco(ctx, o, t.texto, { x: P, y: 200, maxW: W - 2 * P, linhas: 2, tamanhos: [52, 46, 40, 34], fonte: s => `800 ${s}px ${SANS}`, cor: c.tinta, espaco: 5, caixaAlta: true });
    y += 6 + bloco(ctx, o, temP(t), { x: P - 6, y: y + 6, maxW: W - 2 * P + 12, linhas: 1, tamanhos: [300, 260, 224, 190, 160, 132, 110, 92], fonte: s => `italic 600 ${s}px ${SERIF}`, cor: c.acento, entre: 1 });
    const fy = Math.min(Math.max(y + 46, 560), 760);
    moldura(ctx, o, P + 12, fy, W - 2 * P - 24, 1196 - fy, c);
    marcaDagua(ctx, o);
    contador(ctx, o, W - P, 90, { fundo: c.tinta, cor: c.papel });
    estrela(ctx, P + 14, 1290, 14, c.acento);
    bloco(ctx, o, t.apoio, { x: P + 40, y: 1262, maxW: W - 2 * P - 40, linhas: 1, tamanhos: [34, 30, 26], fonte: s => `700 ${s}px ${SANS}`, cor: c.suave });
  },
  "faixa-produto"(ctx, t, o) {
    const c = cores(o, PR);
    ctx.fillStyle = c.papel; ctx.fillRect(0, 0, W, H);
    foto(ctx, o, 1, P, P, W - 2 * P, 960, 24);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P + 24, P + 24, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P - 24, P + 28, { fundo: "rgba(34,26,23,.75)", cor: c.papel });
    if (temP(t)) etiqueta(ctx, o, temP(t), W - P - 210, P + 920, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 1066, maxW: W - 2 * P, linhas: 2, tamanhos: [80, 70, 60, 52, 46], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta });
    bloco(ctx, o, t.apoio, { x: P, y: 1066 + h1 + 10, maxW: W - 2 * P, linhas: 2, tamanhos: [36, 32, 28, 25], fonte: s => `600 ${s}px ${SANS}`, cor: c.acento });
    fita(ctx, H - 26, c.acento);
  },

  /* 2. Um presente para cada estilo: capa com os estilos em etiquetas; produtos em polaroide */
  "estilo-capa"(ctx, t, o) {
    const c = cores(o, PR);
    foto(ctx, o, 1, 0, 0, W, H, 0);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, P, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, P + 4, { fundo: "rgba(34,26,23,.75)", cor: c.papel });
    const chips = t.chips && t.chips.length ? t.chips : ["Clássica", "Chama atenção", "Correria"];
    let x = P, y = 760;
    ctx.font = `800 34px ${SANS}`;
    chips.forEach((ch, i) => { const w = ctx.measureText(ch).width + 56; if (x + w > W - P) { x = P; y += 74; } ctx.fillStyle = i === 1 ? c.acento : c.papel; caminho(ctx, x, y, w, 60, 30); ctx.fill(); ctx.fillStyle = i === 1 ? c.papel : c.tinta; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(ch, x + w / 2, y + 32); x += w + 14; });
    const cy = Math.max(y + 92, 860);
    ctx.fillStyle = c.papel; caminho(ctx, P, cy, W - 2 * P, H - P - cy, 28); ctx.fill();
    ctx.fillStyle = c.acento; caminho(ctx, P, cy, W - 2 * P, 12, [28, 28, 0, 0]); ctx.fill();
    const h1 = bloco(ctx, o, t.texto, { x: P + 44, y: cy + 46, maxW: W - 2 * P - 88, linhas: 2, tamanhos: [84, 74, 64, 56, 48], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta });
    bloco(ctx, o, t.apoio, { x: P + 44, y: cy + 46 + h1 + 12, maxW: W - 2 * P - 88, linhas: 2, tamanhos: [34, 30, 26], fonte: s => `600 ${s}px ${SANS}`, cor: c.suave });
  },
  "estilo-produto"(ctx, t, o) {
    const c = cores(o, PR);
    ctx.fillStyle = c.papel2; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; for (let y = 40; y < H; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.save(); ctx.translate(W / 2, 600); ctx.rotate(-0.04);
    ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-400, -470, 800, 960); ctx.shadowColor = "transparent";
    foto(ctx, o, 1, -360, -430, 720, 720, 4);
    ctx.restore();
    marcaDagua(ctx, o);
    ctx.save(); ctx.translate(W / 2, 600); ctx.rotate(-0.04); o._dx = W / 2; o._dy = 600; // caixas em coordenadas da tela
    bloco(ctx, o, t.apoio, { x: -360, y: 314, maxW: 720, linhas: 3, tamanhos: [54, 48, 42, 36, 32], fonte: s => `italic 600 ${s}px ${SERIF}`, cor: c.acento, alinhar: "center" });
    o._dx = o._dy = 0; ctx.restore();
    marcaPill(ctx, o, P, 40, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, 44, { fundo: c.tinta, cor: c.papel });
    bloco(ctx, o, t.texto, { x: P, y: 1118, maxW: 600, linhas: 3, tamanhos: [66, 58, 50, 44, 40, 36], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta });
    if (temP(t)) etiqueta(ctx, o, temP(t), W - P - 170, 1215, { papel: c.papel, tinta: c.tinta, acento: c.acento, tamanhos: [60, 52, 46, 40], maxW: 300 });
  },

  /* 3. O favorito da loja: abre num close e revela a peça inteira ao deslizar */
  "favorito-capa"(ctx, t, o) {
    const c = cores(o, PR);
    foto(ctx, o, 1, 0, 0, W, 1060, 0);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, P, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, P + 4, { fundo: "rgba(34,26,23,.75)", cor: c.papel });
    const sx = W - 250, sy = 400, r = 175;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(0.14);
    ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 24; ctx.fillStyle = c.acento; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.shadowColor = "transparent";
    ctx.strokeStyle = c.papel; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.arc(0, 0, r - 22, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    estrela(ctx, 0, -78, 22, c.papel);
    ctx.fillStyle = c.papel; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `800 54px ${SANS}`; ctx.letterSpacing = "3px"; ctx.fillText("FAVORITO", 0, 4);
    ctx.font = `italic 600 40px ${SERIF}`; ctx.letterSpacing = "0px"; ctx.fillText("da loja", 0, 66);
    ctx.restore();
    ctx.fillStyle = c.papel; ctx.fillRect(0, 1060, W, H - 1060); fita(ctx, 1060, c.acento);
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 1104, maxW: W - 2 * P, linhas: 2, tamanhos: [70, 62, 54, 46], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta });
    bloco(ctx, o, t.apoio, { x: P, y: 1104 + h1 + 10, maxW: W - 2 * P, linhas: 2, tamanhos: [32, 28, 25, 23], fonte: s => `600 ${s}px ${SANS}`, cor: c.suave });
  },
  "favorito-revela"(ctx, t, o) {
    const c = cores(o, PR);
    foto(ctx, o, 1, 0, 0, W, 1060, 0);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, P, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, P + 4, { fundo: "rgba(34,26,23,.75)", cor: c.papel });
    // indicador do "zoom" saindo: três círculos que vão abrindo
    const z = (o.ajuste && o.ajuste.zoom) || 1;
    [0, 1, 2].forEach(k => { ctx.strokeStyle = c.papel; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(W / 2 - 60 + k * 60, 1010, 10 + k * 6, 0, 7); ctx.stroke(); if (z <= 1.7 - k * 0.35) { ctx.fillStyle = c.papel; ctx.fill(); } });
    ctx.fillStyle = c.papel; ctx.fillRect(0, 1060, W, H - 1060); fita(ctx, 1060, c.acento);
    const comPreco = !!temP(t), larg = comPreco ? W - 2 * P - 330 : W - 2 * P;
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 1090, maxW: larg, linhas: 2, tamanhos: [66, 58, 50, 44, 40, 36, 34], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta });
    bloco(ctx, o, t.apoio, { x: P, y: 1090 + h1 + 8, maxW: larg, linhas: 2, tamanhos: [32, 28, 25, 23], fonte: s => `600 ${s}px ${SANS}`, cor: c.suave });
    if (comPreco) etiqueta(ctx, o, temP(t), W - P - 150, 1200, { papel: c.papel2, tinta: c.tinta, acento: c.acento, tamanhos: [58, 50, 44, 38], maxW: 260, rot: -0.05 });
  },

  /* 4. Duplas que combinam: duas fotos lado a lado */
  "dupla-capa"(ctx, t, o) {
    const c = cores(o, PR), g = 22, fw = (W - 2 * P - g) / 2;
    ctx.fillStyle = c.papel; ctx.fillRect(0, 0, W, H);
    foto(ctx, o, 1, P, 170, fw, 800, 22); foto(ctx, o, 2, P + fw + g, 170, fw, 800, 22);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, 70, { papel: c.papel2, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, 74, { fundo: c.tinta, cor: c.papel });
    ctx.fillStyle = c.acento; ctx.beginPath(); ctx.arc(W / 2, 570, 74, 0, 7); ctx.fill();
    ctx.strokeStyle = c.papel; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W / 2, 570, 74, 0, 7); ctx.stroke();
    ctx.fillStyle = c.papel; ctx.fillRect(W / 2 - 30, 564, 60, 12); ctx.fillRect(W / 2 - 6, 540, 12, 60);
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 1010, maxW: W - 2 * P, linhas: 2, tamanhos: [88, 76, 66, 56], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta, alinhar: "center" });
    bloco(ctx, o, t.apoio, { x: P, y: 1010 + h1 + 12, maxW: W - 2 * P, linhas: 1, tamanhos: [34, 30, 26], fonte: s => `600 ${s}px ${SANS}`, cor: c.suave, alinhar: "center" });
    fita(ctx, H - 40, c.acento);
  },
  "dupla-produto"(ctx, t, o) {
    const c = cores(o, PR), g = 18, fw = (W - 2 * P - g) / 2;
    ctx.fillStyle = c.papel; ctx.fillRect(0, 0, W, H);
    foto(ctx, o, 1, P, 150, fw, 760, 20); foto(ctx, o, 2, P + fw + g, 150, fw, 760, 20);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, 60, { papel: c.papel2, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, 64, { fundo: c.tinta, cor: c.papel });
    ctx.fillStyle = c.acento; ctx.beginPath(); ctx.arc(W / 2, 530, 50, 0, 7); ctx.fill();
    ctx.fillStyle = c.papel; ctx.fillRect(W / 2 - 20, 525, 40, 10); ctx.fillRect(W / 2 - 5, 510, 10, 40);
    const larg = W - 2 * P - 450;
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 960, maxW: larg, linhas: 3, tamanhos: [62, 54, 48, 42, 36], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta });
    bloco(ctx, o, t.apoio, { x: P, y: 960 + h1 + 12, maxW: larg, linhas: 2, tamanhos: [34, 30, 26, 24], fonte: s => `700 ${s}px ${SANS}`, cor: c.acento });
    if (temP(t)) etiqueta(ctx, o, temP(t), W - P - 150, 1090, { papel: c.papel2, tinta: c.tinta, acento: c.acento, tamanhos: [60, 52, 46, 40], maxW: 260, rot: -0.04 });
    fita(ctx, H - 40, c.acento);
  },

  /* 5. Últimas compras: fundo pinho, página de calendário com a data */
  "urgencia-capa"(ctx, t, o) {
    const c = cores(o, PR);
    ctx.fillStyle = c.verde; ctx.fillRect(0, 0, W, H);
    [[140, 1180, 10], [990, 240, 12], [930, 692, 8], [520, 300, 7], [180, 860, 9]].forEach(([x, y, r]) => estrela(ctx, x, y, r, c.ouro));
    ctx.save(); ctx.translate(800, 1000); ctx.rotate(0.06);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-210, -250, 420, 500); foto(ctx, o, 1, -190, -230, 380, 400, 4);
    ctx.restore();
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, P, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, P + 4, { fundo: "rgba(244,236,225,.18)", cor: c.papel });
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 170, maxW: W - 2 * P, linhas: 2, tamanhos: [112, 98, 86, 74, 64, 56, 50], fonte: s => `italic 600 ${s}px ${SERIF}`, cor: c.papel });
    const cy = 170 + h1 + 50;
    ctx.fillStyle = c.papel; caminho(ctx, P, cy, 440, 480, 20); ctx.fill();
    ctx.fillStyle = c.acento; caminho(ctx, P, cy, 440, 104, [20, 20, 0, 0]); ctx.fill();
    ctx.fillStyle = c.papel; ctx.font = `800 36px ${SANS}`; ctx.letterSpacing = "6px"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("DEZEMBRO", P + 220, cy + 54); ctx.letterSpacing = "0px";
    [P + 90, P + 350].forEach(x => { ctx.fillStyle = c.tinta; ctx.beginPath(); ctx.arc(x, cy, 12, 0, 7); ctx.fill(); });
    bloco(ctx, o, temP(t) || "[data]", { x: P + 30, y: cy + 160, maxW: 380, linhas: 1, tamanhos: [190, 160, 130, 110, 90], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta, alinhar: "center", entre: 1 });
    bloco(ctx, o, t.apoio, { x: P, y: 1228, maxW: 620, linhas: 2, tamanhos: [32, 28, 25, 22], fonte: s => `600 ${s}px ${SANS}`, cor: c.papel2 });
  },
  "urgencia-info"(ctx, t, o) {
    const c = cores(o, PR);
    ctx.fillStyle = c.verde; ctx.fillRect(0, 0, W, H);
    [[1000, 160, 10], [120, 1250, 9], [560, 1220, 7]].forEach(([x, y, r]) => estrela(ctx, x, y, r, c.ouro));
    moldura(ctx, o, 580, 640, 420, 560, c);
    marcaDagua(ctx, o);
    marcaPill(ctx, o, P, P, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    contador(ctx, o, W - P, P + 4, { fundo: "rgba(244,236,225,.18)", cor: c.papel });
    const cy = 200;
    ctx.fillStyle = c.papel; caminho(ctx, P, cy, 560, 620, 22); ctx.fill();
    ctx.fillStyle = c.acento; caminho(ctx, P, cy, 560, 150, [22, 22, 0, 0]); ctx.fill();
    bloco(ctx, o, t.texto, { x: P + 30, y: cy + 26, maxW: 500, linhas: 3, tamanhos: [46, 40, 34, 30, 26, 23], fonte: s => `800 ${s}px ${SANS}`, cor: c.papel, alinhar: "center", espaco: 2, caixaAlta: true });
    bloco(ctx, o, temP(t) || "[data]", { x: P + 30, y: cy + 230, maxW: 500, linhas: 1, tamanhos: [220, 180, 150, 120, 96], fonte: s => `600 ${s}px ${SERIF}`, cor: c.tinta, alinhar: "center", entre: 1 });
    bloco(ctx, o, t.apoio, { x: P, y: 880, maxW: 480, linhas: 3, tamanhos: [40, 35, 30, 26], fonte: s => `600 ${s}px ${SANS}`, cor: c.papel, entre: 1.25 });
  },
  "urgencia-produto"(ctx, t, o) {
    const c = cores(o, PR);
    foto(ctx, o, 1, 0, 0, W, 1060, 0);
    marcaDagua(ctx, o);
    ctx.save(); ctx.translate(W - 190, 190); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = c.acento; ctx.fillRect(-380, -46, 760, 92);
    ctx.fillStyle = c.papel; ctx.font = `800 32px ${SANS}`; ctx.letterSpacing = "4px"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("PRONTO PRA PRESENTE", 0, 2); ctx.letterSpacing = "0px";
    ctx.restore();
    marcaPill(ctx, o, P, P, { papel: c.papel, tinta: c.tinta, acento: c.acento });
    ctx.fillStyle = c.verde; ctx.fillRect(0, 1060, W, H - 1060);
    const larg = W - 2 * P - 330;
    const h1 = bloco(ctx, o, t.texto, { x: P, y: 1090, maxW: larg, linhas: 2, tamanhos: [66, 58, 50, 44, 40, 36, 34], fonte: s => `600 ${s}px ${SERIF}`, cor: c.papel });
    bloco(ctx, o, t.apoio, { x: P, y: 1090 + h1 + 8, maxW: larg, linhas: 2, tamanhos: [32, 28, 25, 23], fonte: s => `600 ${s}px ${SANS}`, cor: c.ouro });
    if (temP(t)) etiqueta(ctx, o, temP(t), W - P - 150, 1200, { papel: c.papel, tinta: c.tinta, acento: c.acento, tamanhos: [58, 50, 44, 38], maxW: 260 });
    contador(ctx, o, W - P, 1000, { fundo: "rgba(34,26,23,.75)", cor: c.papel });
  },

  /* ---------------- coleção BASTIDORES (piloto) ---------------- */
  "bastidores-capa"(ctx, t, o) {
    const c = { ...COLECOES.bastidores.paleta, acento: o.cor || COLECOES.bastidores.cores[0].hex };
    ctx.fillStyle = c.fundo; ctx.fillRect(0, 0, W, H);
    const fy = 160, fh = 800;
    ctx.fillStyle = c.filme; ctx.fillRect(0, fy, W, fh);
    ctx.fillStyle = "rgba(232,217,197,.85)";
    for (let x = 26; x < W; x += 74) { caminho(ctx, x, fy + 18, 40, 30, 6); ctx.fill(); caminho(ctx, x, fy + fh - 48, 40, 30, 6); ctx.fill(); }
    foto(ctx, o, 1, P, fy + 72, W - 2 * P, fh - 144, 6);
    marcaDagua(ctx, o);
    ctx.fillStyle = c.rec; ctx.beginPath(); ctx.arc(P + 14, 86, 14, 0, 7); ctx.fill();
    ctx.fillStyle = c.tinta; ctx.font = `700 30px ${SANS}`; ctx.letterSpacing = "6px"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("REC", P + 42, 88); ctx.letterSpacing = "0px";
    contador(ctx, o, W - P, 62, { fundo: "rgba(246,241,234,.12)", cor: c.tinta });
    ctx.fillStyle = c.acento; ctx.font = `700 24px ${SANS}`; ctx.letterSpacing = "5px"; ctx.textAlign = "right"; ctx.fillText("BASTIDORES · 01", W - P, fy + fh + 40); ctx.letterSpacing = "0px";
    const h1 = bloco(ctx, o, t.texto, { x: P, y: fy + fh + 70, maxW: W - 2 * P - 40, linhas: 2, tamanhos: [80, 70, 62, 54, 46], fonte: s => `italic 600 ${s}px ${SERIF}`, cor: c.tinta });
    estrela(ctx, W - P - 10, fy + fh + 110, 14, c.ouro);
    const rot = (t.apoio || `${(o.marca || "[nome do negócio]")} · bastidores`);
    bloco(ctx, o, rot, { x: P, y: fy + fh + 70 + h1 + 16, maxW: W - 2 * P, linhas: 2, tamanhos: [28, 25, 22, 20], fonte: s => `700 ${s}px ${SANS}`, cor: c.acento, espaco: 4, caixaAlta: true });
  }
};

/* desenha uma tela com composição; devolve false se a tela não tiver layout */
export function desenharModelo(ctx, t, o) {
  const f = LAYOUTS[t.layout];
  if (!f) return false;
  ctx.save(); f(ctx, t, o); ctx.restore();
  return true;
}
