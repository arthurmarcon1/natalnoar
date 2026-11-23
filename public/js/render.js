/* Desenha uma tela do carrossel em <canvas> 1080 × 1350 (4:5, Instagram).
   A prévia e o PNG exportado saem do mesmo desenho. */
import { coverRect, ajustarTexto } from "./logic.js";
import { desenharModelo, temLayout } from "./modelos.js";

export const W = 1080, H = 1350;
// iOS 15 e navegadores antigos não têm roundRect no canvas
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(Array.isArray(r) ? (r[0] || 0) : typeof r === "number" ? r : 0, w / 2, h / 2);
    this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath();
  };
}
const PAD = 72;
const SERIF = '"Fraunces", Georgia, serif';
const SANS = '"Plus Jakarta Sans", system-ui, sans-serif';
const COR = { papel: "#F6F1E8", tinta: "#1C1B18", creme: "#F4E4C4", baga: "#A3262A", fundo: "#E7DFD1", listra: "#DDD3C2", vazio: "#7A7266" };

/* Espera as fontes antes de desenhar, para a exportação sair igual à prévia. */
let fontesProntas = null;
export function carregarFontes() {
  if (!fontesProntas) {
    const amostra = "Áãçé R$ 0123456789 →";
    fontesProntas = Promise.all([
      `600 96px ${SERIF}`, `italic 600 96px ${SERIF}`,
      `600 36px ${SANS}`, `700 30px ${SANS}`, `800 52px ${SANS}`
    ].map(f => document.fonts.load(f, amostra))).then(() => document.fonts.ready).catch(() => {});
  }
  return fontesProntas;
}

function pill(ctx, x, y, h, w, cor) {
  ctx.fillStyle = cor; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
}
function estrela(ctx, cx, cy, r, cor) {
  ctx.fillStyle = cor; ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = Math.PI / 4 * i - Math.PI / 2, rr = i % 2 ? r * 0.32 : r; ctx.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
  ctx.closePath(); ctx.fill();
}

function fundoVazio(ctx) {
  ctx.fillStyle = COR.fundo; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = COR.listra; ctx.lineWidth = 18;
  for (let x = -H; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke(); }
  const cy = H * 0.34;
  ctx.fillStyle = COR.fundo; ctx.beginPath(); ctx.roundRect(W / 2 - 230, cy - 120, 460, 240, 32); ctx.fill();
  ctx.strokeStyle = COR.vazio; ctx.lineWidth = 6; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.roundRect(W / 2 - 62, cy - 70, 124, 88, 16); ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, cy - 26, 24, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = COR.vazio; ctx.font = `600 40px ${SANS}`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.fillText("Sua foto aqui", W / 2, cy + 78);
}

/* Marca-d'água da amostra: padrão diagonal (claro com contorno escuro, aparece em foto clara e escura).
   Fica por baixo dos textos e da etiqueta de preço, para não atrapalhar a leitura. */
function marcaDagua(ctx) {
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 7);
  ctx.font = `800 60px ${SANS}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round"; ctx.lineWidth = 3;
  const PX = 430, PY = 200;
  for (let i = -6; i <= 6; i++) {
    const y = i * PY, off = (i & 1) * PX / 2;
    for (let x = -W * 1.3; x <= W * 1.3; x += PX) {
      ctx.strokeStyle = "rgba(0,0,0,.32)"; ctx.strokeText("AMOSTRA", x + off, y);
      ctx.fillStyle = "rgba(255,255,255,.36)"; ctx.fillText("AMOSTRA", x + off, y);
    }
  }
  ctx.restore();
}

function sombraTexto(ctx, on) { ctx.shadowColor = on ? "rgba(0,0,0,.35)" : "transparent"; ctx.shadowBlur = on ? 14 : 0; ctx.shadowOffsetY = on ? 2 : 0; }

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{tipo:"capa"|"produto", texto:string, preco:string, apoio:string}} tela
 * @param {{marca:string, foto?:CanvasImageSource|null, fw?:number, fh?:number, ajuste?:{zoom:number,fx:number,fy:number}, indice:number, total:number}} o
 */
export function desenharTela(canvas, tela, o) {
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (temLayout(tela)) { ctx.clearRect(0, 0, W, H); desenharModelo(ctx, tela, o); return; }
  ctx.save(); ctx.clearRect(0, 0, W, H);

  // 1. Foto em "cover" (ou espaço para a foto)
  if (o.foto) {
    const a = o.ajuste || { zoom: 1, fx: 0.5, fy: 0.5 };
    const r = coverRect(o.fw, o.fh, W, H, a.zoom, a.fx, a.fy);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(o.foto, r.sx, r.sy, r.sw, r.sh, 0, 0, W, H);
  } else fundoVazio(ctx);

  // 2. Degradê escuro sob o texto: contraste em foto clara ou escura
  const g = ctx.createLinearGradient(0, H * 0.36, 0, H);
  g.addColorStop(0, "rgba(18,16,13,0)"); g.addColorStop(0.35, "rgba(18,16,13,.55)"); g.addColorStop(1, "rgba(18,16,13,.9)");
  ctx.fillStyle = g; ctx.fillRect(0, H * 0.36, W, H * 0.64);
  const gt = ctx.createLinearGradient(0, 0, 0, 220);
  gt.addColorStop(0, "rgba(18,16,13,.28)"); gt.addColorStop(1, "rgba(18,16,13,0)");
  ctx.fillStyle = gt; ctx.fillRect(0, 0, W, 220);

  if (o.amostra) marcaDagua(ctx);

  // 3. Marca (pílula clara) e contador (na amostra: etiqueta AMOSTRA)
  ctx.textBaseline = "middle"; ctx.textAlign = "left";
  const marca = (o.marca || "").trim().toUpperCase() || "[NOME DA LOJA]";
  ctx.font = `700 30px ${SANS}`;
  const mw = Math.min(ctx.measureText(marca).width, W - 2 * PAD - 220);
  pill(ctx, PAD, PAD, 64, mw + 104, "rgba(246,241,232,.95)");
  estrela(ctx, PAD + 40, PAD + 32, 15, COR.baga);
  ctx.fillStyle = COR.tinta; ctx.fillText(marca, PAD + 68, PAD + 33, mw);
  const cont = o.amostra ? "AMOSTRA" : `${o.indice + 1}/${o.total}`;
  ctx.font = `${o.amostra ? 800 : 700} 28px ${SANS}`;
  const cw = ctx.measureText(cont).width + 44;
  pill(ctx, W - PAD - cw, PAD + 6, 52, cw, o.amostra ? COR.baga : "rgba(18,16,13,.5)");
  ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(cont, W - PAD - cw / 2, PAD + 33);

  // 4. Textos, de baixo para cima
  const maxW = W - 2 * PAD;
  const medir = fam => (s, size) => { ctx.font = fam(size); return ctx.measureText(s).width; };
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  let y = H - PAD;

  const apoio = (tela.apoio || "").trim();
  if (apoio) {
    const fa = s => `600 ${s}px ${SANS}`;
    const a = ajustarTexto(apoio, maxW, 2, [38, 34, 30], medir(fa));
    ctx.font = fa(a.size); ctx.fillStyle = COR.creme; sombraTexto(ctx, true);
    for (let i = a.linhas.length - 1; i >= 0; i--) { ctx.fillText(a.linhas[i], PAD, y, maxW); y -= a.size * 1.3; }
    y -= 18;
  }

  const texto = (tela.texto || "").trim();
  const preco = (tela.preco || "").trim();
  if (tela.tipo === "capa") {
    if (preco) {
      const fp = s => `italic 600 ${s}px ${SERIF}`;
      const p = ajustarTexto(preco, maxW, 1, [190, 160, 136, 116, 100, 86], medir(fp));
      ctx.font = fp(p.size); ctx.fillStyle = COR.papel;
      ctx.fillText(p.linhas[0], PAD, y, maxW); y -= p.size * 0.98;
    }
    if (texto) {
      const ft = s => `600 ${s}px ${SERIF}`;
      const t = ajustarTexto(texto, maxW, 2, [100, 88, 76, 66, 58], medir(ft));
      ctx.font = ft(t.size); ctx.fillStyle = "#fff";
      for (let i = t.linhas.length - 1; i >= 0; i--) { ctx.fillText(t.linhas[i], PAD, y, maxW); y -= t.size * 1.06; }
    }
  } else {
    if (texto) {
      const ft = s => `600 ${s}px ${SERIF}`;
      const t = ajustarTexto(texto, maxW, 2, [92, 80, 70, 62, 54], medir(ft));
      ctx.font = ft(t.size); ctx.fillStyle = "#fff";
      for (let i = t.linhas.length - 1; i >= 0; i--) { ctx.fillText(t.linhas[i], PAD, y, maxW); y -= t.size * 1.08; }
      y -= 22;
    }
    if (preco) {
      sombraTexto(ctx, false);
      const fp = s => `800 ${s}px ${SANS}`;
      const p = ajustarTexto(preco, maxW - 64, 1, [54, 46, 40], medir(fp));
      ctx.font = fp(p.size);
      const pw = Math.min(ctx.measureText(p.linhas[0]).width, maxW - 64) + 64, ph = p.size + 40;
      pill(ctx, PAD, y - ph, ph, pw, COR.papel);
      ctx.fillStyle = COR.tinta; ctx.textBaseline = "middle";
      ctx.fillText(p.linhas[0], PAD + 32, y - ph / 2 + 2, maxW - 64);
    }
  }
  ctx.restore();
}

/* Carrega uma foto do aparelho respeitando a orientação (EXIF) e reduz para no máximo 2400 px. */
export async function carregarFoto(fonte) {
  let img;
  try { img = await createImageBitmap(fonte, { imageOrientation: "from-image" }); }
  catch {
    img = await new Promise((ok, erro) => {
      const el = new Image(); el.decoding = "async";
      el.onload = () => ok(el); el.onerror = erro;
      el.src = typeof fonte === "string" ? fonte : URL.createObjectURL(fonte);
    });
  }
  const w = img.width || img.naturalWidth, h = img.height || img.naturalHeight;
  const max = 2400, k = Math.min(1, max / Math.max(w, h));
  if (k === 1) return { img, w, h };
  const c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  if (img.close) img.close();
  return { img: c, w: c.width, h: c.height };
}

/* ---------- fotos de exemplo (com cache) e telas prontas a partir dos caminhos ---------- */
const fotosCache = new Map();
export function fotoDeArquivo(caminho) {
  if (!caminho) return Promise.resolve(null);
  if (!fotosCache.has(caminho)) fotosCache.set(caminho, fetch(caminho).then(r => { if (!r.ok) throw 0; return r.blob(); }).then(carregarFoto).catch(() => null));
  return fotosCache.get(caminho);
}
/* desenha uma tela de exemplo (fotos por caminho) num canvas */
export async function desenharExemplo(canvas, tela, o) {
  await carregarFontes();
  const [f, f2] = await Promise.all([fotoDeArquivo(tela.foto), fotoDeArquivo(tela.foto2)]);
  desenharTela(canvas, tela, { ...o, foto: f && f.img, fw: f && f.w, fh: f && f.h, ajuste: tela.ajuste, foto2: f2 && f2.img, fw2: f2 && f2.w, fh2: f2 && f2.h, ajuste2: tela.ajuste2 });
}
/* miniatura leve (JPEG) de uma tela, para capas em cartões e galerias */
const minis = new Map();
let fila = Promise.resolve();
export function miniatura(tela, o, largura = 360) {
  const chave = JSON.stringify([tela, o.marca, o.cor, largura]);
  if (!minis.has(chave)) minis.set(chave, fila = fila.then(async () => {
    const grande = document.createElement("canvas");
    await desenharExemplo(grande, tela, { indice: 0, total: 4, ...o, amostra: false });
    const peq = document.createElement("canvas"); peq.width = largura; peq.height = Math.round(largura * H / W);
    const ctx = peq.getContext("2d"); ctx.imageSmoothingQuality = "high"; ctx.drawImage(grande, 0, 0, peq.width, peq.height);
    grande.width = grande.height = 0;
    return peq.toDataURL("image/jpeg", 0.86);
  }));
  return minis.get(chave);
}
