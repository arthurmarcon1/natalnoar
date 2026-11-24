/* =====================================================================
   ESTÚDIO: motor de camadas dos carrosséis (1080 × 1350).

   Cada tela é desenhada em camadas separadas, nesta ordem:
     1. fundo (cor + textura da coleção)
     2. fotos (cada uma com seu enquadramento) e elementos fotográficos
        (ex.: a caixa de presente), que são imagens independentes
     3. ícones decorativos (trocáveis ou removíveis)
     4. textos, preços e datas (sempre sobre fundo, papel ou etiqueta)
     5. marca da cliente (nome ou logo)
     6. marca-d'água AMOSTRA, só no teste grátis com foto própria
   Nenhum texto fica gravado em imagem: tudo vem dos campos editáveis.

   tela   = { l: layout, c: { campo: texto }, f: [caminhos das fotos], inv?, aj?: [ajustes] }
   estilo = { fundo, texto, destaque, par, icone } (+ papel, moldura, textura da coleção)
   o      = { marca, logo?, imgs: [{img,w,h}|null], ajustes: [{zoom,fx,fy}], amostra, caixas? }
   ===================================================================== */
import { coverRect } from "./logic.js";

export const W = 1080, H = 1350;
const M = 72; // margem

/* ---------------- pares de fontes testados ---------------- */
export const PARES = {
  editorial: { nome: "Editorial", t: '"Playfair Display", Georgia, serif', tp: 700, ti: 700, x: '"Plus Jakarta Sans", system-ui, sans-serif', k: 0.94 },
  classica: { nome: "Clássica", t: '"Cormorant Garamond", Georgia, serif', tp: 700, ti: 600, x: '"Jost", system-ui, sans-serif', k: 1.12 },
  suave: { nome: "Suave", t: '"Fraunces", Georgia, serif', tp: 700, ti: 600, x: '"Jost", system-ui, sans-serif', k: 1 },
  display: { nome: "Display", t: '"DM Serif Display", Georgia, serif', tp: 400, ti: 400, x: '"Jost", system-ui, sans-serif', k: 1 },
  instrument: { nome: "Instrument", t: '"Instrument Serif", Georgia, serif', tp: 400, ti: 400, x: '"Plus Jakarta Sans", system-ui, sans-serif', k: 1.1 },
  moderna: { nome: "Moderna", t: '"Bricolage Grotesque", system-ui, sans-serif', tp: 800, ti: null, x: '"Plus Jakarta Sans", system-ui, sans-serif', k: 0.9 }
};
const fontesCarregadas = new Map();
export function carregarPar(id) {
  const p = PARES[id] || PARES.editorial;
  if (!fontesCarregadas.has(id)) {
    const am = "Áãçé R$ 0123456789 →";
    const lista = [`${p.tp} 80px ${p.t}`, `500 30px ${p.x}`, `700 30px ${p.x}`, `800 30px ${p.x}`];
    if (p.ti) lista.push(`italic ${p.ti} 80px ${p.t}`);
    fontesCarregadas.set(id, typeof document === "undefined" ? Promise.resolve() : Promise.all(lista.map(f => document.fonts.load(f, am))).catch(() => {}));
  }
  return fontesCarregadas.get(id);
}
export const carregarTodosPares = () => Promise.all(Object.keys(PARES).map(carregarPar));

/* ---------------- ícones natalinos (vetor, na cor de destaque) ---------------- */
export const ICONES = {
  estrela: "Estrela", floco: "Floco", laco: "Laço", azevinho: "Azevinho", ramo: "Ramo",
  sino: "Sino", taca: "Taça", fogos: "Fogos", coracao: "Coração", nenhum: "Sem ícone"
};
function icone(ctx, nome, cx, cy, r, cor, rot = 0) {
  if (!nome || nome === "nenhum") return;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = cor; ctx.strokeStyle = cor; ctx.lineCap = "round"; ctx.lineJoin = "round";
  const lw = Math.max(3, r * 0.12);
  if (nome === "estrela") {
    ctx.beginPath(); ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0); ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
    ctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0); ctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r); ctx.fill();
  } else if (nome === "floco") {
    ctx.lineWidth = lw;
    for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate(i * Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r);
      ctx.moveTo(0, -r * 0.55); ctx.lineTo(-r * 0.25, -r * 0.8); ctx.moveTo(0, -r * 0.55); ctx.lineTo(r * 0.25, -r * 0.8); ctx.stroke(); ctx.restore(); }
  } else if (nome === "laco") {
    ctx.lineWidth = lw;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(s * r * 0.9, -r * 0.9, s * r * 1.15, r * 0.15, 0, 0); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-r * 0.1, r * 0.05); ctx.quadraticCurveTo(-r * 0.4, r * 0.5, -r * 0.55, r); ctx.moveTo(r * 0.1, r * 0.05); ctx.quadraticCurveTo(r * 0.4, r * 0.5, r * 0.6, r * 0.95); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.16, 0, 7); ctx.fill();
  } else if (nome === "azevinho") {
    for (const s of [-1, 1]) { ctx.save(); ctx.rotate(s * 0.7); ctx.beginPath(); ctx.ellipse(s * r * 0.5, -r * 0.1, r * 0.55, r * 0.22, 0, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = 0.85; [[-0.14, 0.18], [0.16, 0.2], [0, -0.02]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x * r, y * r, r * 0.17, 0, 7); ctx.fill(); }); ctx.restore();
  } else if (nome === "ramo") {
    ctx.lineWidth = lw * 0.8; ctx.beginPath(); ctx.moveTo(0, r); ctx.quadraticCurveTo(r * 0.1, 0, 0, -r); ctx.stroke();
    for (let i = 0; i < 5; i++) { const y = r * 0.7 - i * r * 0.38; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s * r * (0.55 - i * 0.07), y - r * 0.3); ctx.stroke(); } }
  } else if (nome === "sino") {
    ctx.beginPath(); ctx.moveTo(-r * 0.7, r * 0.5); ctx.quadraticCurveTo(-r * 0.6, -r * 0.8, 0, -r * 0.8); ctx.quadraticCurveTo(r * 0.6, -r * 0.8, r * 0.7, r * 0.5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, r * 0.62, r * 0.18, 0, 7); ctx.fill(); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(0, -r * 0.88, r * 0.14, 0, 7); ctx.stroke();
  } else if (nome === "taca") {
    ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(-r * 0.42, -r); ctx.lineTo(r * 0.42, -r); ctx.lineTo(r * 0.3, -r * 0.05); ctx.quadraticCurveTo(0, r * 0.18, -r * 0.3, -r * 0.05); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, r * 0.1); ctx.lineTo(0, r * 0.85); ctx.moveTo(-r * 0.35, r * 0.9); ctx.lineTo(r * 0.35, r * 0.9); ctx.stroke();
  } else if (nome === "fogos") {
    ctx.lineWidth = lw * 0.8;
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, 0, r * 0.1, 0, 7); ctx.fill();
  } else if (nome === "coracao") {
    ctx.beginPath(); ctx.moveTo(0, r * 0.8); ctx.bezierCurveTo(-r * 1.2, -r * 0.1, -r * 0.5, -r * 1, 0, -r * 0.4); ctx.bezierCurveTo(r * 0.5, -r * 1, r * 1.2, -r * 0.1, 0, r * 0.8); ctx.fill();
  }
  ctx.restore();
}

/* ---------------- cores: contraste automático ---------------- */
const rgb = h => { h = String(h || "#000").replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lumi = h => { const [r, g, b] = rgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contraste = (a, b) => { const [x, y] = [lumi(a), lumi(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
export const escuro = h => lumi(h) < 0.33;
const legivel = (fundo, ...opcoes) => opcoes.find(c => c && contraste(c, fundo) >= 4.5) || (escuro(fundo) ? "#FFF8F0" : "#1A1416");
const misturar = (a, b, t) => { const x = rgb(a), y = rgb(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join(""); };

/* estilo final de uma tela: troca fundo/texto nas telas invertidas e calcula as cores legíveis */
export function estiloDaTela(s, tela) {
  const base = { ...s };
  if (tela && tela.inv) { base.fundo = s.texto; base.texto = s.fundo; }
  base.papel = base.papel || "#FFFFFF";
  if (contraste(base.papel, base.fundo) < 1.15) base.papel = escuro(base.fundo) ? misturar(base.fundo, "#FFFFFF", 0.9) : misturar(base.fundo, "#FFFFFF", 0.7);
  base.tinta = legivel(base.fundo, base.texto);                       // texto sobre o fundo
  base.tintaPapel = legivel(base.papel, s.texto, s.fundo, "#1A1416"); // texto sobre papel
  base.realce = contraste(base.destaque, base.fundo) >= 2.4 ? base.destaque : base.tinta; // ênfase sobre o fundo
  base.realcePapel = contraste(base.destaque, base.papel) >= 2.4 ? base.destaque : base.tintaPapel;
  base.sobreDestaque = legivel(base.destaque, "#FFFFFF", "#1A1416");
  base.suave = misturar(base.tinta, base.fundo, 0.32);
  base.suavePapel = misturar(base.tintaPapel, base.papel, 0.3);
  base.P = PARES[base.par] || PARES.editorial;
  return base;
}

/* ---------------- texto ---------------- */
const MARCA_VAZIA = "Nome da loja aqui";
export const preencherMarca = (txt, o) => String(txt ?? "").replaceAll("{marca}", (o.marca || "").trim() || MARCA_VAZIA);
/* separa *ênfase* em pedaços {t, en} por palavra */
function tokens(txt) {
  const out = []; let en = false;
  for (const parte of String(txt).split(/(\*)/)) {
    if (parte === "*") { en = !en; continue; }
    parte.split(/(\s+|\n)/).forEach(w => { if (w === "\n") out.push({ br: true }); else if (w && !/^\s+$/.test(w)) out.push({ t: w, en }); else if (w) out.push({ sp: true }); });
  }
  // une pedaços sem espaço entre eles (ex.: "dela" + "." ) numa palavra
  const pal = []; let cur = null;
  for (const k of out) { if (k.sp || k.br) { if (cur) pal.push(cur); cur = null; if (k.br) pal.push({ br: true }); continue; } if (!cur) cur = { partes: [] }; cur.partes.push(k); }
  if (cur) pal.push(cur);
  return pal;
}
/**
 * Texto com ajuste automático: tenta os tamanhos do maior para o menor até caber em `linhas`
 * linhas de `maxW`; no menor tamanho, a última linha termina em "…" (nada some em silêncio).
 * Palavras entre *asteriscos* saem em itálico (quando a fonte tem) e na cor de realce.
 */
function texto(ctx, s, o, txt, { x, y, maxW, linhas = 2, tam, fam = "t", peso, cor, realce, alinhar = "left", entre = 1.06, caixaAlta = false, espaco = 0, base = "topo", swash = false, campo = "" }) {
  txt = preencherMarca(txt, o).trim(); if (!txt) return 0;
  if (caixaAlta) txt = txt.toUpperCase();
  const P = s.P, k = fam === "t" ? P.k : 1;
  const tamanhos = tam.map(v => Math.round(v * k));
  const fonte = (size, en) => fam === "t" ? `${en && P.ti ? "italic " + P.ti : peso || P.tp} ${size}px ${P.t}` : `${peso || 600} ${size}px ${P.x}`;
  const pals = tokens(txt);
  ctx.letterSpacing = espaco ? `${espaco}px` : "0px";
  const medirPal = (p, size) => p.partes.reduce((w, q) => { ctx.font = fonte(size, q.en); return w + ctx.measureText(q.t).width; }, 0);
  const quebrar = size => {
    ctx.font = fonte(size, false); const sp = ctx.measureText(" ").width;
    const ls = []; let l = [], lw = 0;
    for (const p of pals) {
      if (p.br) { ls.push({ pals: l, w: lw }); l = []; lw = 0; continue; }
      const w = medirPal(p, size), nw = l.length ? lw + sp + w : w;
      if (nw <= maxW || !l.length) { l.push(p); lw = nw; } else { ls.push({ pals: l, w: lw }); l = [p]; lw = w; }
    }
    ls.push({ pals: l, w: lw });
    return { ls, sp };
  };
  let size = tamanhos[tamanhos.length - 1], r = null;
  for (const t of tamanhos) { const q = quebrar(t); if (q.ls.length <= linhas && q.ls.every(l => l.w <= maxW + 0.5)) { size = t; r = q; break; } }
  let cortou = false;
  if (!r) {
    r = quebrar(size);
    if (r.ls.length > linhas) {
      cortou = true;
      const resto = r.ls.slice(linhas - 1).flatMap(l => l.pals);
      let ult = resto; const largura = ps => ps.reduce((w, p, i) => w + medirPal(p, size) + (i ? r.sp : 0), 0);
      const reticencias = ps => { const u = ps.map(p => ({ partes: p.partes.map(q => ({ ...q })) })); const z = u[u.length - 1].partes; z[z.length - 1].t += "…"; return u; };
      while (ult.length > 1 && largura(reticencias(ult)) > maxW) ult = ult.slice(0, -1);
      ult = reticencias(ult);
      r.ls = [...r.ls.slice(0, linhas - 1), { pals: ult, w: largura(ult) }];
    }
  }
  const lh = size * entre, n = r.ls.length;
  const alt = size * 0.82 + (n - 1) * lh + size * 0.26;
  let y0 = base === "topo" ? y : base === "baixo" ? y - alt : y - alt / 2;
  ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  let enBox = null;
  r.ls.forEach((l, i) => {
    const lw = Math.min(l.w, maxW), sx = alinhar === "center" ? x + (maxW - lw) / 2 : alinhar === "right" ? x + maxW - lw : x;
    let cx = sx; const by = y0 + size * 0.82 + i * lh;
    const esc = l.w > maxW ? maxW / l.w : 1;
    l.pals.forEach((p, j) => {
      if (j) cx += r.sp * esc;
      for (const q of p.partes) {
        ctx.font = fonte(size, q.en); ctx.fillStyle = q.en ? (realce || cor) : cor;
        const w = ctx.measureText(q.t).width * esc;
        ctx.save(); if (esc < 1) { ctx.translate(cx, by); ctx.scale(esc, 1); ctx.fillText(q.t, 0, 0); } else ctx.fillText(q.t, cx, by); ctx.restore();
        if (q.en) { enBox = enBox && enBox.y === by ? { ...enBox, x2: cx + w } : (enBox || { x1: cx, x2: cx + w, y: by }); }
        cx += w;
      }
    });
  });
  ctx.letterSpacing = "0px";
  if (swash && enBox) { // traço desenhado à mão em volta da palavra em destaque
    const cxe = (enBox.x1 + enBox.x2) / 2, cye = enBox.y - size * 0.3, rx = (enBox.x2 - enBox.x1) / 2 + size * 0.28, ry = size * 0.62;
    ctx.save(); ctx.strokeStyle = realce || cor; ctx.lineWidth = Math.max(3, size * 0.035); ctx.lineCap = "round";
    ctx.beginPath(); ctx.ellipse(cxe, cye, rx, ry, -0.06, Math.PI * 0.92, Math.PI * 2.78); ctx.stroke(); ctx.restore();
  }
  if (o.caixas) o.caixas.push({ campo, txt, x, y: y0, w: Math.min(maxW, Math.max(...r.ls.map(l => l.w))), h: alt, maxW, size, linhas: n, cortou });
  return alt;
}
const rotulo = (ctx, s, o, txt, opts) => texto(ctx, s, o, txt, { fam: "x", peso: 700, caixaAlta: true, espaco: 4, linhas: 1, ...opts });
const corpo = (ctx, s, o, txt, opts) => texto(ctx, s, o, txt, { fam: "x", peso: 500, entre: 1.3, ...opts });

/* ---------------- fundo e textura ---------------- */
function rnd(seed) { let x = seed || 7; return () => (x = (x * 16807) % 2147483647) / 2147483647; }
function fundo(ctx, s, cor = s.fundo) {
  ctx.fillStyle = cor; ctx.fillRect(0, 0, W, H);
  const r = rnd(11), tx = s.textura;
  ctx.save();
  if (tx === "grao") { ctx.fillStyle = escuro(cor) ? "rgba(255,255,255,.05)" : "rgba(60,30,20,.06)"; for (let i = 0; i < 2600; i++) ctx.fillRect(r() * W, r() * H, 2, 2); }
  else if (tx === "pontos") { ctx.fillStyle = escuro(cor) ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)"; for (let y = 30; y < H; y += 44) for (let x = (y / 44 & 1) * 22 + 20; x < W; x += 44) { ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); } }
  else if (tx === "listras") { ctx.strokeStyle = escuro(cor) ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"; ctx.lineWidth = 18; for (let k = -H; k < W; k += 70) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + H, H); ctx.stroke(); } }
  else if (tx === "linhas") { ctx.strokeStyle = escuro(cor) ? "rgba(255,255,255,.07)" : "rgba(30,40,30,.07)"; ctx.lineWidth = 2; for (let y = 60; y < H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
  else if (tx === "brilho") { for (let i = 0; i < 26; i++) icone(ctx, "estrela", r() * W, r() * H, 4 + r() * 9, escuro(cor) ? "rgba(241,227,200,.22)" : "rgba(120,90,40,.16)"); }
  else if (tx === "confete") { for (let i = 0; i < 70; i++) { ctx.save(); ctx.translate(r() * W, r() * H); ctx.rotate(r() * 3); ctx.fillStyle = [s.destaque, misturar(s.destaque, cor, 0.5), escuro(cor) ? "#FFFFFF" : "#1A1416"][i % 3]; ctx.globalAlpha = 0.16; ctx.fillRect(-7, -3, 14, 6); ctx.restore(); } }
  ctx.restore();
}

/* ---------------- fotos e molduras ---------------- */
function caminho(ctx, x, y, w, h, forma, r = 0) {
  ctx.beginPath();
  if (forma === "circulo") ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  else if (forma === "oval") ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  else if (forma === "arco") { const rr = w / 2; ctx.moveTo(x, y + h); ctx.lineTo(x, y + rr); ctx.arc(x + rr, y + rr, rr, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); }
  else if (r) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
function vazio(ctx, s, x, y, w, h) {
  ctx.fillStyle = escuro(s.fundo) ? "#3A3430" : "#E6DCCD"; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = escuro(s.fundo) ? "#45403A" : "#DCCFBD"; ctx.lineWidth = 14;
  for (let k = -h; k < w; k += 56) { ctx.beginPath(); ctx.moveTo(x + k, y); ctx.lineTo(x + k + h, y + h); ctx.stroke(); }
  ctx.fillStyle = escuro(s.fundo) ? "#CFC6BA" : "#7A6E62"; ctx.font = `600 ${Math.max(22, Math.min(36, w / 9))}px ${s.P.x}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("Sua foto aqui", x + w / 2, y + h / 2);
}
/* desenha a foto i em "cover" dentro da forma (respeita zoom e posição escolhidos) */
function foto(ctx, s, o, i, x, y, w, h, { forma = "ret", r = 0, fade = false } = {}) {
  const f = o.imgs && o.imgs[i], a = { zoom: 1, fx: 0.5, fy: 0.5, ...((o.ajustes && o.ajustes[i]) || {}) };
  ctx.save(); caminho(ctx, x, y, w, h, forma, r); ctx.clip();
  if (f && f.img) {
    const c = coverRect(f.w, f.h, w, h, a.zoom, a.fx, a.fy); ctx.imageSmoothingQuality = "high";
    if (fade) { // elemento fotográfico: a foto se funde ao fundo pelas bordas (funciona com o fundo original da foto)
      const t = document.createElement("canvas"); t.width = Math.round(w); t.height = Math.round(h);
      const tc = t.getContext("2d"); tc.drawImage(f.img, c.sx, c.sy, c.sw, c.sh, 0, 0, t.width, t.height);
      tc.globalCompositeOperation = "destination-in";
      // máscara elíptica que chega a zero nas bordas: nenhuma aresta do retângulo da foto aparece
      tc.translate(w / 2, h / 2); tc.scale(w / 2, h / 2);
      const g = tc.createRadialGradient(0, 0, 0.45, 0, 0, 1);
      g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.55, "rgba(0,0,0,.85)"); g.addColorStop(1, "rgba(0,0,0,0)");
      tc.fillStyle = g; tc.fillRect(-1, -1, 2, 2); ctx.drawImage(t, x, y);
    } else ctx.drawImage(f.img, c.sx, c.sy, c.sw, c.sh, x, y, w, h);
  } else vazio(ctx, s, x, y, w, h);
  ctx.restore();
}
/* cores de uma faixa (0–1 da altura) da foto i como aparece na tela, em células de 6 × 4; guardadas no objeto da foto */
function coresFoto(o, i, y0, y1) {
  const f = o.imgs && o.imgs[i]; if (!f || !f.img) return null;
  const a = { zoom: 1, fx: 0.5, fy: 0.5, ...((o.ajustes && o.ajustes[i]) || {}) }, k = `${y0}:${y1}:${a.zoom}:${a.fx}:${a.fy}`;
  f._cores = f._cores || {}; if (f._cores[k]) return f._cores[k];
  const t = document.createElement("canvas"); t.width = 6; t.height = 4; const tc = t.getContext("2d", { willReadFrequently: true });
  const c = coverRect(f.w, f.h, W, H, a.zoom, a.fx, a.fy), sy = c.sy + c.sh * y0, sh = c.sh * (y1 - y0);
  tc.imageSmoothingQuality = "high"; tc.drawImage(f.img, c.sx, sy, c.sw, sh, 0, 0, 6, 4);
  const d = tc.getImageData(0, 0, 6, 4).data, out = [];
  for (let q = 0; q < d.length; q += 4) out.push("#" + [d[q], d[q + 1], d[q + 2]].map(v => v.toString(16).padStart(2, "0")).join(""));
  return (f._cores[k] = out);
}
/* véu na cor do fundo atrás do texto sobre foto: quase nada se toda a faixa já é legível, forte se alguma parte não for */
function veu(ctx, s, o, i, y0, y1, cor, deCima = true, minimo = 0.18) {
  const m = coresFoto(o, i, Math.min(y0, y1) / H, Math.max(y0, y1) / H), forte = !m || m.some(x => contraste(cor, x) < 4.5), [r, g, b] = rgb(s.fundo);
  const lo = Math.min(y0, y1), hi = Math.max(y0, y1), gr = ctx.createLinearGradient(0, deCima ? lo : hi, 0, deCima ? hi : lo); // opaco na borda da tela, some em direção ao meio
  gr.addColorStop(0, `rgba(${r},${g},${b},${forte ? 0.9 : minimo})`); gr.addColorStop(0.62, `rgba(${r},${g},${b},${forte ? 0.72 : minimo * 0.45})`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gr; ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
}
const sombra = (ctx, on, k = 1) => { ctx.shadowColor = on ? `rgba(20,10,5,${0.28 * k})` : "transparent"; ctx.shadowBlur = on ? 34 * k : 0; ctx.shadowOffsetY = on ? 14 * k : 0; };
/* foto com o tratamento da coleção (moldura) */
function quadro(ctx, s, o, i, x, y, w, h, { rot = 0, forma, moldura } = {}) {
  const m = moldura || s.moldura || "papel";
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.translate(-w / 2, -h / 2);
  const papelM = escuro(s.fundo) ? s.papel : "#FFFFFF";
  if (forma === "circulo" || forma === "oval" || m === "oval") {
    const f = forma || "oval";
    sombra(ctx, true, 0.8); ctx.fillStyle = papelM; caminho(ctx, -12, -12, w + 24, h + 24, f); ctx.fill(); sombra(ctx, false);
    foto(ctx, s, o, i, 0, 0, w, h, { forma: f });
  } else if (m === "arco") {
    ctx.strokeStyle = s.destaque; ctx.lineWidth = 4; caminho(ctx, -18, -18, w + 36, h + 36, "arco"); ctx.stroke();
    foto(ctx, s, o, i, 0, 0, w, h, { forma: "arco" });
  } else if (m === "polaroide") {
    sombra(ctx, true); ctx.fillStyle = "#FFFDF8"; ctx.fillRect(-24, -24, w + 48, h + 110); sombra(ctx, false);
    foto(ctx, s, o, i, 0, 0, w, h);
  } else if (m === "filme") {
    ctx.fillStyle = "#0B0A09"; ctx.fillRect(-30, -64, w + 60, h + 128);
    ctx.fillStyle = "#2B2723"; for (let k = 0; k < w + 40; k += 52) { ctx.beginPath(); ctx.roundRect(-14 + k, -50, 26, 30, 5); ctx.fill(); ctx.beginPath(); ctx.roundRect(-14 + k, h + 20, 26, 30, 5); ctx.fill(); }
    foto(ctx, s, o, i, 0, 0, w, h);
  } else if (m === "carimbo") {
    sombra(ctx, true); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-20, -20, w + 40, h + 40); sombra(ctx, false);
    foto(ctx, s, o, i, 0, 0, w, h);
  } else if (m === "recorte") {
    sombra(ctx, true, 0.7); ctx.fillStyle = papelM; caminho(ctx, 0, 0, w, h, "ret", 56); ctx.fill(); sombra(ctx, false);
    foto(ctx, s, o, i, 0, 0, w, h, { r: 56 });
  } else if (m === "fina") {
    foto(ctx, s, o, i, 0, 0, w, h);
    ctx.strokeStyle = s.destaque; ctx.lineWidth = 3; ctx.strokeRect(16, 16, w - 32, h - 32);
  } else if (m === "sangria") {
    foto(ctx, s, o, i, 0, 0, w, h);
  } else { // papel
    sombra(ctx, true); ctx.fillStyle = papelM; caminho(ctx, -18, -18, w + 36, h + 36, "ret", 14); ctx.fill(); sombra(ctx, false);
    foto(ctx, s, o, i, 0, 0, w, h, { r: 6 });
  }
  ctx.restore();
}

/* ---------------- peças recorrentes ---------------- */
/* marca da cliente: logo (se houver) ou nome */
function marca(ctx, s, o, { x, y, alinhar = "left", cor, h = 64, maxW = 520, estilo = "rotulo", placa }) {
  if (o.logo && o.logo.img) {
    const k = Math.min(h / o.logo.h, maxW / o.logo.w), w = o.logo.w * k, hh = o.logo.h * k;
    const lx = alinhar === "center" ? x - w / 2 : alinhar === "right" ? x - w : x;
    // logo sobre fundo escuro ou sobre foto: plaquinha clara atrás, para qualquer logo aparecer
    if (placa ?? escuro(s.fundo)) { const pd = Math.max(10, hh * 0.22); sombra(ctx, true, 0.4); ctx.fillStyle = escuro(s.papel) ? "#FFFDF8" : s.papel; ctx.beginPath(); ctx.roundRect(lx - pd * 1.4, y + (h - hh) / 2 - pd, w + pd * 2.8, hh + pd * 2, (hh + pd * 2) / 2); ctx.fill(); sombra(ctx, false); }
    ctx.drawImage(o.logo.img, lx, y + (h - hh) / 2, w, hh);
    if (o.caixas) o.caixas.push({ campo: "logo", x: lx, y, w, h: hh, logo: true });
    return;
  }
  const nome = (o.marca || "").trim() || MARCA_VAZIA;
  const bx = alinhar === "center" ? x - maxW / 2 : alinhar === "right" ? x - maxW : x;
  if (estilo === "assinatura") texto(ctx, s, o, nome, { x: bx, y, maxW, linhas: 1, tam: [56, 50, 44, 38, 32], fam: "t", cor: cor || s.tinta, alinhar, campo: "marca" });
  else rotulo(ctx, s, o, nome, { x: bx, y: y + 14, maxW, tam: [28, 25, 22, 20], cor: cor || s.tinta, alinhar, campo: "marca" });
}
/* etiqueta de presente com o preço */
function etiqueta(ctx, s, o, txt, cx, cy, { rot = -0.06, tam = [76, 66, 58, 50, 44], maxW = 420 } = {}) {
  txt = String(txt || "").trim(); if (!txt) return;
  const fonte = sz => `800 ${sz}px ${s.P.x}`;
  let sz = tam[tam.length - 1]; for (const t of tam) { ctx.font = fonte(t); if (ctx.measureText(txt).width <= maxW) { sz = t; break; } }
  ctx.font = fonte(sz); const tw = Math.min(ctx.measureText(txt).width, maxW), hh = sz * 1.7, w = tw + sz * 1.5, bico = hh * 0.42;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.strokeStyle = s.destaque; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-w / 2 + bico * 0.62, 0); ctx.bezierCurveTo(-w / 2 - 30, -46, -w / 2 - 66, -36, -w / 2 - 100, -84); ctx.stroke();
  sombra(ctx, true, 0.7); ctx.fillStyle = s.papel; ctx.beginPath();
  ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2 + bico, -hh / 2); ctx.lineTo(w / 2 - 14, -hh / 2); ctx.arcTo(w / 2, -hh / 2, w / 2, 0, 14);
  ctx.arcTo(w / 2, hh / 2, 0, hh / 2, 14); ctx.lineTo(-w / 2 + bico, hh / 2); ctx.closePath(); ctx.fill(); sombra(ctx, false);
  ctx.strokeStyle = s.destaque; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath();
  ctx.moveTo(-w / 2 + 14, 0); ctx.lineTo(-w / 2 + bico + 6, -hh / 2 + 12); ctx.lineTo(w / 2 - 12, -hh / 2 + 12); ctx.lineTo(w / 2 - 12, hh / 2 - 12); ctx.lineTo(-w / 2 + bico + 6, hh / 2 - 12); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.arc(-w / 2 + bico * 0.62, 0, 9, 0, 7); ctx.fill();
  ctx.fillStyle = s.tintaPapel; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, bico * 0.42, sz * 0.04, maxW);
  ctx.restore();
  if (o.caixas) o.caixas.push({ campo: "preco", txt, x: cx - w / 2, y: cy - hh / 2, w, h: hh, maxW: w, size: sz, linhas: 1, cortou: false });
}
/* cartão de papel com sombra */
function cartao(ctx, s, x, y, w, h, r = 22) { sombra(ctx, true, 0.6); ctx.fillStyle = s.papel; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); sombra(ctx, false); }
function seta(ctx, s, x, y, cor) { ctx.save(); ctx.strokeStyle = cor || s.tinta; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 46, y); ctx.lineTo(x, y); ctx.moveTo(x - 16, y - 16); ctx.lineTo(x, y); ctx.lineTo(x - 16, y + 16); ctx.stroke(); ctx.restore(); }
function linhaFina(ctx, x1, y, x2, cor, lw = 3) { ctx.strokeStyle = cor; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); }
function circuloTexto(ctx, s, o, txt, cx, cy, r) { // selo redondo
  ctx.save(); sombra(ctx, true, 0.6); ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); sombra(ctx, false);
  ctx.strokeStyle = s.sobreDestaque; ctx.globalAlpha = 0.5; ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.arc(cx, cy, r - 16, 0, 7); ctx.stroke(); ctx.restore();
  texto(ctx, s, o, txt, { x: cx - r + 26, y: cy, maxW: (r - 26) * 2, linhas: 2, tam: [52, 44, 38, 32, 28], fam: "t", cor: s.sobreDestaque, alinhar: "center", base: "meio", campo: "selo" });
}
function marcaDagua(ctx, s) {
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 7);
  ctx.font = `800 62px ${s.P.x}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round"; ctx.lineWidth = 3;
  for (let i = -6; i <= 6; i++) for (let x = -W * 1.3; x <= W * 1.3; x += 430) {
    const px = x + (i & 1) * 215, py = i * 200;
    ctx.strokeStyle = "rgba(0,0,0,.3)"; ctx.strokeText("AMOSTRA", px, py); ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillText("AMOSTRA", px, py);
  }
  ctx.restore();
  ctx.fillStyle = "#A3122A"; ctx.beginPath(); ctx.roundRect(W - M - 230, M - 18, 230, 56, 28); ctx.fill();
  ctx.fillStyle = "#FFFFFF"; ctx.font = `800 26px ${s.P.x}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("AMOSTRA", W - M - 115, M + 11);
}

/* ---------------- composições ----------------
   campos: [chave, rótulo] na ordem do editor. fotos: quantas fotos a composição usa. */
const C = (k, r) => [k, r];
const TIT = C("titulo", "Título"), APO = C("apoio", "Linha de apoio");
export const LAYOUTS = {
  /* ===== capas ===== */
  "capa-numero": { nome: "Capa com valor", fotos: 1, rotFotos: ["Elemento (embalagem ou produto)"], campos: [TIT, C("valor", "Valor"), C("rodape", "Rodapé")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: W / 2, y: 86, alinhar: "center", estilo: "assinatura", cor: s.tinta, maxW: 760 });
      linhaFina(ctx, W / 2 - 60, 178, W / 2 + 60, s.destaque, 3);
      const fh = 560; foto(ctx, s, o, 0, 70, H - fh - 150, W - 140, fh, { fade: true });
      const ht = texto(ctx, s, o, t.c.titulo, { x: M, y: 206, maxW: W - 2 * M, linhas: 2, tam: [104, 92, 80, 70, 62], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      texto(ctx, s, o, t.c.valor, { x: M, y: 206 + ht + 6, maxW: W - 2 * M, linhas: 1, tam: [250, 220, 190, 160, 136, 116], cor: s.tinta, alinhar: "center", campo: "valor" });
      icone(ctx, s.icone, 150, H - 96, 20, s.destaque); icone(ctx, s.icone, W - 150, H - 96, 20, s.destaque);
      rotulo(ctx, s, o, t.c.rodape, { x: 200, y: H - 116, maxW: W - 400, tam: [34, 30, 26, 22], cor: s.tinta, alinhar: "center", espaco: 8, campo: "rodape" });
    } },
  "capa-tipo": { nome: "Capa tipográfica", fotos: 0, campos: [C("titulo", "Título (use *asteriscos* no destaque)"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      icone(ctx, s.icone, W - M - 30, M + 30, 34, s.destaque, 0.2);
      texto(ctx, s, o, t.c.titulo, { x: M + 20, y: H * 0.47, maxW: W - 2 * M - 40, linhas: 4, tam: [210, 180, 156, 134, 116, 100, 86], cor: s.tinta, realce: s.realce, alinhar: "center", base: "meio", entre: 1.02, swash: true, campo: "titulo" });
      linhaFina(ctx, W / 2 - 40, H - 250, W / 2 + 40, s.destaque, 3);
      corpo(ctx, s, o, t.c.apoio, { x: M + 60, y: H - 210, maxW: W - 2 * M - 120, linhas: 2, tam: [38, 34, 30, 27], cor: s.tinta, alinhar: "center", campo: "apoio" });
    } },
  "capa-foto": { nome: "Capa com foto inteira", fotos: 1, campos: [TIT, APO],
    desenhar(ctx, s, t, o) {
      foto(ctx, s, o, 0, 0, 0, W, H);
      const ch = 380, cy = H - ch - 60;
      cartao(ctx, s, 48, cy, W - 96, ch, 30);
      icone(ctx, s.icone, W - 120, cy + 70, 26, s.destaque, 0.3);
      rotulo(ctx, s, o, o.marca ? "{marca}" : MARCA_VAZIA, { x: 100, y: cy + 50, maxW: W - 320, tam: [24, 22, 20], cor: s.realcePapel, campo: "marca" });
      const ht = texto(ctx, s, o, t.c.titulo, { x: 96, y: cy + 100, maxW: W - 192, linhas: 2, tam: [96, 86, 76, 66, 58, 50], cor: s.tintaPapel, realce: s.realcePapel, campo: "titulo" });
      corpo(ctx, s, o, t.c.apoio, { x: 96, y: Math.max(cy + 100 + ht + 14, cy + ch - 100), maxW: W - 280, linhas: 1, tam: [34, 30, 27, 24], cor: s.suavePapel, campo: "apoio" });
      seta(ctx, s, W - 110, cy + ch - 64, s.realcePapel);
      if (o.logo) marca(ctx, s, o, { x: M + 16, y: M, h: 80, cor: "#FFFFFF", placa: true });
    } },
  "capa-dupla": { nome: "Capa com duas fotos", fotos: 2, campos: [TIT, APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 150, maxW: W - 2 * M, linhas: 2, tam: [112, 98, 86, 74, 64], cor: s.tinta, realce: s.realce, campo: "titulo" });
      quadro(ctx, s, o, 0, 90, 450, 470, 560, { rot: -0.05 });
      quadro(ctx, s, o, 1, 520, 640, 470, 560, { rot: 0.04 });
      ctx.save(); sombra(ctx, true, 0.6); ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.arc(565, 692, 64, 0, 7); ctx.fill(); sombra(ctx, false);
      ctx.strokeStyle = s.sobreDestaque; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(565, 662); ctx.lineTo(565, 722); ctx.moveTo(535, 692); ctx.lineTo(595, 692); ctx.stroke(); ctx.restore();
      corpo(ctx, s, o, t.c.apoio, { x: M, y: H - 120, maxW: 400, linhas: 2, tam: [32, 28, 25], cor: s.tinta, campo: "apoio" });
      icone(ctx, s.icone, W - M - 30, H - 100, 30, s.destaque, 0.2);
    } },
  "capa-calendario": { nome: "Capa de calendário", fotos: 0, campos: [TIT, C("dia", "Dia"), C("mes", "Mês"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: W / 2, y: M, alinhar: "center", cor: s.tinta });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 160, maxW: W - 2 * M, linhas: 2, tam: [124, 108, 94, 80, 68], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      const x = 190, y = 470, w = W - 380, h = 640;
      ctx.save(); sombra(ctx, true); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h);
      const r = rnd(5); for (let k = x + w; k > x; k -= 26) ctx.lineTo(k - 13, y + h - 8 - r() * 16); // papel rasgado
      ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); sombra(ctx, false);
      ctx.fillStyle = s.destaque; ctx.fillRect(x, y, w, 150);
      for (const k of [0.22, 0.5, 0.78]) { ctx.fillStyle = misturar(s.fundo, "#000000", 0.25); ctx.beginPath(); ctx.arc(x + w * k, y + 34, 16, 0, 7); ctx.fill();
        ctx.strokeStyle = "#9C9488"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x + w * k, y + 6, 26, Math.PI * 0.95, Math.PI * 2.05); ctx.stroke(); }
      ctx.restore();
      rotulo(ctx, s, o, t.c.mes, { x, y: y + 72, maxW: w, tam: [60, 52, 46], cor: s.sobreDestaque, alinhar: "center", espaco: 14, campo: "mes" });
      texto(ctx, s, o, t.c.dia, { x: x + 20, y: y + 190, maxW: w - 40, linhas: 1, tam: [340, 300, 260, 220, 180], fam: "t", cor: "#1A1416", alinhar: "center", campo: "dia" });
      corpo(ctx, s, o, t.c.apoio, { x: x + 30, y: y + h - 120, maxW: w - 60, linhas: 1, tam: [36, 32, 28, 24], peso: 700, cor: misturar("#1A1416", "#FFFDF8", 0.25), alinhar: "center", campo: "apoio" });
      icone(ctx, s.icone, x - 40, y + h - 10, 30, s.destaque, -0.3); icone(ctx, s.icone, x + w + 50, y + 200, 22, s.destaque, 0.3);
    } },
  "capa-arco": { nome: "Capa com foto em arco", fotos: 1, campos: [TIT, APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: W / 2, y: M - 10, alinhar: "center", cor: s.tinta });
      quadro(ctx, s, o, 0, 250, 170, 580, 700, { moldura: "arco" });
      icone(ctx, s.icone, 190, 330, 30, s.destaque, -0.2); icone(ctx, s.icone, 900, 760, 22, s.destaque, 0.3);
      const ht = texto(ctx, s, o, t.c.titulo, { x: M, y: 920, maxW: W - 2 * M, linhas: 2, tam: [104, 92, 80, 70, 60], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      corpo(ctx, s, o, t.c.apoio, { x: M + 60, y: Math.max(920 + ht + 16, H - 130), maxW: W - 2 * M - 120, linhas: 1, tam: [34, 30, 27, 24], cor: s.suave, alinhar: "center", campo: "apoio" });
    } },
  "capa-polaroides": { nome: "Capa com três fotos", fotos: 3, campos: [TIT, APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      quadro(ctx, s, o, 0, 110, 210, 380, 400, { rot: -0.09, moldura: "polaroide" });
      quadro(ctx, s, o, 1, 590, 170, 380, 400, { rot: 0.07, moldura: "polaroide" });
      quadro(ctx, s, o, 2, 350, 520, 380, 400, { rot: -0.02, moldura: "polaroide" });
      icone(ctx, s.icone, 960, 700, 30, s.destaque, 0.2);
      const ht = texto(ctx, s, o, t.c.titulo, { x: M, y: 1040, maxW: W - 2 * M, linhas: 2, tam: [96, 84, 74, 64, 56], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      corpo(ctx, s, o, t.c.apoio, { x: M + 60, y: 1040 + ht + 14, maxW: W - 2 * M - 120, linhas: 1, tam: [32, 28, 25, 22], cor: s.suave, alinhar: "center", campo: "apoio" });
    } },
  "capa-filme": { nome: "Capa de bastidores (filme)", fotos: 1, campos: [TIT, C("apoio", "Rótulo")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      ctx.fillStyle = "#E0483E"; ctx.beginPath(); ctx.arc(M + 14, M + 22, 13, 0, 7); ctx.fill();
      rotulo(ctx, s, o, "REC", { x: M + 40, y: M + 6, maxW: 120, tam: [26], cor: s.tinta, campo: "rec" });
      marca(ctx, s, o, { x: W - M, y: M - 6, alinhar: "right", cor: s.tinta, maxW: 600 });
      quadro(ctx, s, o, 0, 110, 230, W - 220, 640, { moldura: "filme" });
      rotulo(ctx, s, o, t.c.apoio, { x: M, y: 990, maxW: W - 2 * M, tam: [26, 23, 20], cor: s.realce, espaco: 8, campo: "apoio" });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 1040, maxW: W - 2 * M - 90, linhas: 2, tam: [110, 96, 84, 72, 62], cor: s.tinta, realce: s.realce, campo: "titulo" });
      icone(ctx, s.icone, W - M - 30, 1220, 28, s.destaque);
    } },
  "capa-lista": { nome: "Capa com lista", fotos: 1, campos: [TIT, C("itens", "Itens (separe com ·)"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      quadro(ctx, s, o, 0, W - 420, 120, 340, 340, { forma: "circulo" });
      icone(ctx, s.icone, W - 440, 470, 26, s.destaque);
      texto(ctx, s, o, t.c.titulo, { x: M, y: 520, maxW: W - 2 * M, linhas: 3, tam: [120, 104, 90, 78, 66], cor: s.tinta, realce: s.realce, campo: "titulo" });
      const itens = preencherMarca(t.c.itens, o).split("·").map(v => v.trim()).filter(Boolean).slice(0, 4);
      let x = M, y = 1030; ctx.font = `700 34px ${s.P.x}`;
      itens.forEach(it => { const w = Math.min(ctx.measureText(it).width + 64, W - 2 * M); if (x + w > W - M) { x = M; y += 92; }
        ctx.strokeStyle = s.realce; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, 72, 36); ctx.stroke();
        ctx.fillStyle = s.tinta; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 34px ${s.P.x}`; ctx.fillText(it, x + w / 2, y + 38, w - 40); x += w + 18; });
      if (o.caixas) o.caixas.push({ campo: "itens", txt: itens.join(" · "), x: M, y: 1030, w: W - 2 * M, h: y + 72 - 1030, maxW: W - 2 * M, linhas: 1, cortou: y > 1130 });
      corpo(ctx, s, o, t.c.apoio, { x: M, y: H - 70, maxW: W - 2 * M - 80, linhas: 1, tam: [30, 27, 24], cor: s.suave, base: "baixo", campo: "apoio" });
      seta(ctx, s, W - M, H - 88, s.realce);
    } },
  "capa-ano": { nome: "Capa de retrospectiva", fotos: 3, campos: [TIT, C("ano", "Ano"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      texto(ctx, s, o, t.c.ano, { x: M - 10, y: 130, maxW: W - 2 * M + 20, linhas: 1, tam: [380, 330, 290, 250], cor: s.realce, alinhar: "center", campo: "ano" });
      const fw = 290, gap = 26, x0 = (W - 3 * fw - 2 * gap) / 2;
      [0, 1, 2].forEach(i => quadro(ctx, s, o, i, x0 + i * (fw + gap), 520, fw, 380, { rot: [-0.04, 0.02, 0.05][i], moldura: s.moldura === "filme" ? "papel" : s.moldura }));
      texto(ctx, s, o, t.c.titulo, { x: M, y: 990, maxW: W - 2 * M, linhas: 2, tam: [96, 84, 74, 64, 56], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      corpo(ctx, s, o, t.c.apoio, { x: M + 40, y: H - 70, maxW: W - 2 * M - 80, linhas: 1, tam: [30, 27, 24], cor: s.suave, alinhar: "center", base: "baixo", campo: "apoio" });
      icone(ctx, s.icone, W - 110, 150, 30, s.destaque, 0.2);
    } },
  "capa-etiqueta": { nome: "Capa com etiqueta de preço", fotos: 1, campos: [TIT, C("preco", "Preço"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      quadro(ctx, s, o, 0, 120, 120, W - 240, 800, { rot: 0.02 });
      etiqueta(ctx, s, o, t.c.preco, W - 300, 860, { rot: -0.1 });
      marca(ctx, s, o, { x: M, y: 990, cor: s.tinta });
      const ht = texto(ctx, s, o, t.c.titulo, { x: M, y: 1046, maxW: W - 2 * M, linhas: 2, tam: [96, 84, 74, 64, 56], cor: s.tinta, realce: s.realce, campo: "titulo" });
      corpo(ctx, s, o, t.c.apoio, { x: M, y: 1046 + ht + 12, maxW: W - 2 * M - 80, linhas: 1, tam: [32, 28, 25, 22], cor: s.suave, campo: "apoio" });
      icone(ctx, s.icone, 140, 150, 34, s.destaque, -0.3);
    } },
  "capa-antes": { nome: "Capa antes e depois", fotos: 2, campos: [TIT, C("rot1", "Rótulo da foto 1"), C("rot2", "Rótulo da foto 2")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      const y = 170, h = 760, w = (W - 2 * M - 20) / 2;
      foto(ctx, s, o, 0, M, y, w, h, { r: 18 }); foto(ctx, s, o, 1, M + w + 20, y, w, h, { r: 18 });
      [[t.c.rot1, M + 20, 0], [t.c.rot2, M + w + 40, 1]].forEach(([r, x, k]) => { if (!r) return; ctx.font = `800 28px ${s.P.x}`; const rw = Math.min(ctx.measureText(String(r).toUpperCase()).width + 44, w - 40);
        ctx.fillStyle = k ? s.destaque : s.papel; ctx.beginPath(); ctx.roundRect(x, y + h - 80, rw, 56, 28); ctx.fill();
        rotulo(ctx, s, o, r, { x: x + 22, y: y + h - 66, maxW: rw - 44, tam: [26, 23, 20], espaco: 2, cor: k ? s.sobreDestaque : s.tintaPapel, campo: `rot${k + 1}` }); });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 990, maxW: W - 2 * M - 80, linhas: 3, tam: [96, 84, 74, 64, 56], cor: s.tinta, realce: s.realce, campo: "titulo" });
      icone(ctx, s.icone, W - M - 30, 1010, 28, s.destaque);
    } },
  "capa-citacao": { nome: "Capa com depoimento", fotos: 1, campos: [C("citacao", "Depoimento"), C("autor", "Quem disse")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      ctx.fillStyle = s.realce; ctx.font = `${s.P.tp} 420px ${s.P.t}`; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.fillText("“", M - 20, 520);
      texto(ctx, s, o, t.c.citacao, { x: M, y: 400, maxW: W - 2 * M, linhas: 5, tam: [86, 76, 66, 58, 50, 44], cor: s.tinta, realce: s.realce, entre: 1.12, campo: "citacao" });
      quadro(ctx, s, o, 0, M, 1060, 180, 180, { forma: "circulo" });
      corpo(ctx, s, o, t.c.autor, { x: M + 230, y: 1150, maxW: W - 2 * M - 330, linhas: 2, tam: [34, 30, 27], peso: 700, cor: s.tinta, base: "meio", campo: "autor" });
      icone(ctx, s.icone, W - M - 30, 1150, 30, s.destaque);
    } },
  "capa-selo": { nome: "Capa com selo", fotos: 1, campos: [TIT, C("selo", "Selo"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      quadro(ctx, s, o, 0, M, M, W - 2 * M, 860, { moldura: s.moldura === "polaroide" ? "papel" : s.moldura });
      circuloTexto(ctx, s, o, t.c.selo, W - 230, 860, 150);
      marca(ctx, s, o, { x: M, y: 1000, cor: s.tinta });
      const ht = texto(ctx, s, o, t.c.titulo, { x: M, y: 1056, maxW: W - 2 * M - 40, linhas: 2, tam: [92, 82, 72, 64, 56], cor: s.tinta, realce: s.realce, campo: "titulo" });
      corpo(ctx, s, o, t.c.apoio, { x: M, y: 1056 + ht + 12, maxW: W - 2 * M - 80, linhas: 1, tam: [32, 28, 25, 22], cor: s.suave, campo: "apoio" });
    } },

  /* capa da embalagem: a foto ocupa a capa inteira; título e valor na área clara de cima */
  "capa-embrulho": { nome: "Capa com foto inteira e valor", fotos: 1, rotFotos: ["Foto da embalagem ou do produto (ocupa a capa inteira; deixe espaço livre em cima)"], campos: [TIT, C("valor", "Valor"), C("rodape", "Rodapé")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      foto(ctx, s, o, 0, 0, 0, W, H);
      veu(ctx, s, o, 0, 0, 600, s.tinta, true);
      veu(ctx, s, o, 0, H, H - 330, s.tinta, false, 0.78);
      marca(ctx, s, o, { x: W / 2, y: 74, alinhar: "center", estilo: "assinatura", cor: s.tinta, maxW: 760, placa: false });
      const ht = texto(ctx, s, o, t.c.titulo, { x: M, y: 168, maxW: W - 2 * M, linhas: 2, tam: [124, 112, 100, 88, 76, 66], cor: s.tinta, realce: s.realce, alinhar: "center", entre: 1, campo: "titulo" });
      texto(ctx, s, o, t.c.valor, { x: M, y: 168 + ht - 4, maxW: W - 2 * M, linhas: 1, tam: [250, 224, 196, 170, 146, 124], cor: s.tinta, alinhar: "center", campo: "valor" });
      rotulo(ctx, s, o, t.c.rodape, { x: 160, y: H - 104, maxW: W - 320, tam: [34, 30, 26, 22], peso: 600, cor: s.tinta, alinhar: "center", espaco: 10, campo: "rodape" });
    } },
  /* bilhete do sorteio: papel marfim inclinado sobre o fundo, chamada grande escrita nele */
  "capa-bilhete": { nome: "Capa com bilhete", fotos: 0, campos: [C("tema", "Tema (letra pequena)"), C("titulo", "Chamada do bilhete (use *destaque*)"), APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      const papelN = escuro(s.fundo) ? (escuro(s.texto) ? "#F6EDE0" : s.texto) : s.papel, tintaN = legivel(papelN, s.fundo, s.texto, "#1A1416");
      const realceN = contraste(s.destaque, papelN) >= 3 ? s.destaque : tintaN;
      const papelzinho = (cx, cy, w, h, rot, alfa) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha = alfa; sombra(ctx, true, 0.5); ctx.fillStyle = papelN; ctx.fillRect(-w / 2, -h / 2, w, h); sombra(ctx, false);
        ctx.strokeStyle = "rgba(0,0,0,.12)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke(); ctx.restore(); };
      // outros papeizinhos do sorteio, dobrados, nas bordas
      papelzinho(110, 270, 200, 120, -0.5, 0.5); papelzinho(1000, 1130, 220, 130, 0.42, 0.45); papelzinho(60, 1200, 190, 110, 0.25, 0.35); papelzinho(1020, 250, 170, 100, 0.8, 0.35);
      marca(ctx, s, o, { x: W / 2, y: M - 6, alinhar: "center", cor: s.tinta });
      // o bilhete
      const bw = 880, bh = 760, cx = W / 2, cy = 640, rot = -0.055;
      const antes = o.caixas ? o.caixas.length : 0;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      sombra(ctx, true, 1.1); ctx.fillStyle = papelN; ctx.beginPath(); ctx.moveTo(-bw / 2, -bh / 2);
      const r = rnd(4); for (let k = -bw / 2; k < bw / 2; k += 22) ctx.lineTo(k + 11, -bh / 2 + 4 + r() * 9); // borda de cima rasgada
      ctx.lineTo(bw / 2, -bh / 2); ctx.lineTo(bw / 2, bh / 2); ctx.lineTo(-bw / 2, bh / 2); ctx.closePath(); ctx.fill(); sombra(ctx, false);
      // vinco da dobra e a metade de baixo levemente sombreada
      const g = ctx.createLinearGradient(0, 0, 0, bh / 2); g.addColorStop(0, "rgba(60,30,20,.10)"); g.addColorStop(0.25, "rgba(60,30,20,.03)"); g.addColorStop(1, "rgba(60,30,20,0)");
      ctx.fillStyle = g; ctx.fillRect(-bw / 2, 0, bw, bh / 2);
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-bw / 2, -2); ctx.lineTo(bw / 2, -2); ctx.stroke();
      ctx.strokeStyle = "rgba(60,30,20,.16)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-bw / 2, 1); ctx.lineTo(bw / 2, 1); ctx.stroke();
      rotulo(ctx, s, o, t.c.tema, { x: -bw / 2 + 70, y: -bh / 2 + 70, maxW: bw - 140, tam: [30, 27, 24, 21], cor: realceN, espaco: 7, campo: "tema" });
      linhaFina(ctx, -bw / 2 + 70, -bh / 2 + 128, -bw / 2 + 190, realceN, 3);
      texto(ctx, s, o, t.c.titulo, { x: -bw / 2 + 70, y: 40, maxW: bw - 140, linhas: 3, tam: [168, 150, 134, 118, 104, 92], cor: tintaN, realce: realceN, base: "meio", entre: 1.0, campo: "titulo" });
      icone(ctx, s.icone, bw / 2 - 80, bh / 2 - 80, 30, realceN, 0.2);
      ctx.restore();
      if (o.caixas) o.caixas.slice(antes).forEach(b => { b.x += cx; b.y += cy; }); // caixas em coordenadas da tela
      corpo(ctx, s, o, t.c.apoio, { x: M + 40, y: H - 118, maxW: W - 2 * M - 80, linhas: 2, tam: [38, 34, 30, 27], peso: 600, cor: s.tinta, alinhar: "center", base: "meio", campo: "apoio" });
    } },
  /* frase em destaque assinada pela loja: a loja é quem fez a seleção */
  "capa-assinatura": { nome: "Capa tipográfica assinada", fotos: 0, campos: [C("tema", "Tema (letra pequena)"), C("titulo", "Frase (use *destaque*)"), C("assina", "Antes da assinatura")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      rotulo(ctx, s, o, t.c.tema, { x: M, y: M + 10, maxW: W - 2 * M - 100, tam: [28, 25, 22], cor: s.realce, espaco: 8, campo: "tema" });
      icone(ctx, s.icone, W - M - 30, M + 26, 32, s.destaque, 0.2);
      ctx.fillStyle = s.realce; ctx.font = `${s.P.tp} 440px ${s.P.t}`; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.fillText("“", M - 26, 560);
      texto(ctx, s, o, t.c.titulo, { x: M, y: 700, maxW: W - 2 * M, linhas: 4, tam: [196, 176, 158, 140, 124, 108, 94], cor: s.tinta, realce: s.realce, base: "meio", entre: 1.0, campo: "titulo" });
      // assinatura de quem escolheu
      const ay = H - 250;
      linhaFina(ctx, W - M - 420, ay, W - M, s.destaque, 3);
      corpo(ctx, s, o, t.c.assina, { x: W - M - 520, y: ay + 26, maxW: 520, linhas: 1, tam: [32, 29, 26], cor: s.suave, alinhar: "right", campo: "assina" });
      marca(ctx, s, o, { x: W - M, y: ay + 82, alinhar: "right", estilo: "assinatura", cor: s.tinta, maxW: 720, h: 90 });
    } },
  /* duas fotos grandes lado a lado com um "+" no meio; cada foto troca sozinha */
  "capa-par": { nome: "Capa com duas fotos lado a lado", fotos: 2, rotFotos: ["Peça 1 (esquerda)", "Peça 2 (direita)"], campos: [TIT, APO],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: W / 2, y: M - 8, alinhar: "center", cor: s.tinta });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 150, maxW: W - 2 * M, linhas: 2, tam: [124, 110, 98, 86, 74], cor: s.tinta, realce: s.realce, alinhar: "center", entre: 1.0, campo: "titulo" });
      const gap = 84, fw = (W - 2 * 62 - gap) / 2, fh = 680, fy = 440, mold = ["polaroide", "filme", "arco", "oval"].includes(s.moldura) ? "papel" : s.moldura;
      quadro(ctx, s, o, 0, 62, fy, fw, fh, { moldura: mold });
      quadro(ctx, s, o, 1, 62 + fw + gap, fy, fw, fh, { moldura: mold });
      const px = W / 2, py = fy + fh / 2;
      ctx.save(); sombra(ctx, true, 0.6); ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.arc(px, py, 54, 0, 7); ctx.fill(); sombra(ctx, false);
      ctx.strokeStyle = s.sobreDestaque; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(px, py - 24); ctx.lineTo(px, py + 24); ctx.moveTo(px - 24, py); ctx.lineTo(px + 24, py); ctx.stroke(); ctx.restore();
      corpo(ctx, s, o, t.c.apoio, { x: M + 40, y: H - 108, maxW: W - 2 * M - 80, linhas: 2, tam: [34, 31, 28, 25], cor: s.tinta, alinhar: "center", base: "meio", campo: "apoio" });
    } },

  /* ===== telas internas ===== */
  "int-dois": { nome: "Dois produtos", fotos: 2, campos: [C("titulo", "Rótulo"), C("nome1", "Produto 1"), C("preco1", "Preço 1"), C("nome2", "Produto 2"), C("preco2", "Preço 2")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      rotulo(ctx, s, o, t.c.titulo, { x: M, y: M, maxW: W - 2 * M - 200, tam: [28, 25, 22], cor: s.realce, campo: "titulo" });
      marca(ctx, s, o, { x: W - M, y: M - 14, alinhar: "right", cor: s.suave, maxW: 300, h: 50 });
      const cw = (W - 2 * M - 36) / 2;
      [[0, M], [1, M + cw + 36]].forEach(([i, x]) => {
        cartao(ctx, s, x, 150, cw, 1110, 24);
        foto(ctx, s, o, i, x + 18, 168, cw - 36, 760, { r: 14 });
        texto(ctx, s, o, t.c[`nome${i + 1}`], { x: x + 30, y: 960, maxW: cw - 60, linhas: 2, tam: [58, 50, 44, 38, 34], cor: s.tintaPapel, campo: `nome${i + 1}` });
        texto(ctx, s, o, t.c[`preco${i + 1}`], { x: x + 30, y: 1250, maxW: cw - 60, linhas: 1, tam: [64, 56, 48, 42], fam: "x", peso: 800, cor: s.realcePapel, base: "baixo", campo: `preco${i + 1}` });
      });
      icone(ctx, s.icone, W / 2, 1300, 18, s.destaque);
    } },
  "int-um": { nome: "Um produto em destaque", fotos: 1, campos: [C("nome", "Produto"), C("preco", "Preço"), C("apoio", "Para quem combina"), C("cta", "Chamada")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: 30, cor: s.suave, h: 46, maxW: 600 });
      quadro(ctx, s, o, 0, 110, 120, W - 220, 750, { rot: -0.015 });
      etiqueta(ctx, s, o, t.c.preco, W - 280, 830, { rot: -0.08 });
      texto(ctx, s, o, t.c.nome, { x: M, y: 960, maxW: W - 2 * M, linhas: 2, tam: [92, 80, 70, 60, 52], cor: s.tinta, realce: s.realce, campo: "nome" });
      corpo(ctx, s, o, t.c.apoio, { x: M, y: 1150, maxW: W - 2 * M, linhas: 1, tam: [36, 32, 28, 25], cor: s.suave, campo: "apoio" });
      if (t.c.cta) { ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.roundRect(M, 1210, W - 2 * M, 84, 42); ctx.fill();
        texto(ctx, s, o, t.c.cta, { x: M + 40, y: 1252, maxW: W - 2 * M - 80, linhas: 1, tam: [34, 30, 27, 24], fam: "x", peso: 700, cor: s.sobreDestaque, alinhar: "center", base: "meio", campo: "cta" }); }
    } },
  "int-estilo": { nome: "Produto e estilo de quem ganha", fotos: 1, campos: [C("estilo", "Estilo de quem ganha (use *destaque*)"), C("nome", "Produto"), C("preco", "Preço")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.suave, h: 50 });
      texto(ctx, s, o, t.c.estilo, { x: M, y: 140, maxW: W - 2 * M, linhas: 3, tam: [96, 84, 74, 64, 56], cor: s.tinta, realce: s.realce, campo: "estilo" });
      quadro(ctx, s, o, 0, 180, 480, W - 360, 640, { rot: 0.025 });
      icone(ctx, s.icone, 130, 560, 28, s.destaque, -0.3);
      cartao(ctx, s, M, 1150, W - 2 * M, 140, 70);
      texto(ctx, s, o, t.c.nome, { x: M + 50, y: 1220, maxW: W - 2 * M - 360, linhas: 1, tam: [50, 44, 38, 34, 30], cor: s.tintaPapel, base: "meio", campo: "nome" });
      texto(ctx, s, o, t.c.preco, { x: W - M - 300, y: 1220, maxW: 250, linhas: 1, tam: [56, 50, 44, 38], fam: "x", peso: 800, cor: s.realcePapel, alinhar: "right", base: "meio", campo: "preco" });
    } },
  "int-detalhe": { nome: "Detalhe em close", fotos: 1, campos: [C("titulo", "Rótulo"), C("texto", "Detalhe")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.suave, h: 50 });
      quadro(ctx, s, o, 0, 180, 170, 720, 720, { forma: "circulo" });
      ctx.strokeStyle = s.realce; ctx.lineWidth = 3; ctx.setLineDash([2, 12]); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(830, 820); ctx.quadraticCurveTo(940, 920, 880, 990); ctx.stroke(); ctx.setLineDash([]);
      icone(ctx, s.icone, 930, 230, 30, s.destaque);
      rotulo(ctx, s, o, t.c.titulo, { x: M, y: 990, maxW: W - 2 * M, tam: [30, 26, 22], cor: s.realce, espaco: 8, campo: "titulo" });
      texto(ctx, s, o, t.c.texto, { x: M, y: 1050, maxW: W - 2 * M, linhas: 3, tam: [70, 62, 54, 48, 42], cor: s.tinta, realce: s.realce, entre: 1.1, campo: "texto" });
    } },
  "int-uso": { nome: "Jeitos de usar", fotos: 1, campos: [C("titulo", "Título"), C("passo1", "Item 1"), C("passo2", "Item 2"), C("passo3", "Item 3")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      foto(ctx, s, o, 0, 0, 0, W, 600);
      cartao(ctx, s, 48, 520, W - 96, 780, 30);
      texto(ctx, s, o, t.c.titulo, { x: 100, y: 580, maxW: W - 200, linhas: 1, tam: [80, 70, 62, 54], cor: s.tintaPapel, realce: s.realcePapel, campo: "titulo" });
      marca(ctx, s, o, { x: W / 2, y: 1236, alinhar: "center", cor: s.suavePapel, h: 40, maxW: 600 });
      [1, 2, 3].forEach((n, i) => { const y = 720 + i * 170;
        ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.arc(140, y + 32, 38, 0, 7); ctx.fill();
        ctx.fillStyle = s.sobreDestaque; ctx.font = `800 40px ${s.P.x}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(n), 140, y + 34);
        corpo(ctx, s, o, t.c[`passo${n}`], { x: 210, y, maxW: W - 320, linhas: 2, tam: [40, 36, 32, 28], peso: 600, cor: s.tintaPapel, campo: `passo${n}` }); });
    } },
  "int-info": { nome: "Informações de compra", fotos: 0, campos: [C("titulo", "Título"), C("linha1", "Linha 1"), C("linha2", "Linha 2"), C("linha3", "Linha 3"), C("cta", "Chamada")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: W / 2, y: M, alinhar: "center", cor: s.tinta });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 190, maxW: W - 2 * M, linhas: 2, tam: [110, 96, 84, 72, 62], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      cartao(ctx, s, M, 470, W - 2 * M, 560, 28);
      [1, 2, 3].forEach((n, i) => { const y = 520 + i * 170;
        icone(ctx, s.icone === "nenhum" ? "estrela" : s.icone, M + 70, y + 46, 20, s.destaque);
        corpo(ctx, s, o, t.c[`linha${n}`], { x: M + 120, y: y + 46, maxW: W - 2 * M - 170, linhas: 2, tam: [44, 40, 36, 32, 28], peso: 600, cor: s.tintaPapel, base: "meio", campo: `linha${n}` });
        if (n < 3) linhaFina(ctx, M + 50, y + 130, W - M - 50, misturar(s.tintaPapel, s.papel, 0.85), 2); });
      ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.roundRect(M + 60, 1100, W - 2 * M - 120, 110, 55); ctx.fill();
      texto(ctx, s, o, t.c.cta, { x: M + 100, y: 1155, maxW: W - 2 * M - 200, linhas: 1, tam: [40, 36, 32, 28], fam: "x", peso: 700, cor: s.sobreDestaque, alinhar: "center", base: "meio", campo: "cta" });
    } },
  "int-dupla": { nome: "Dupla de produtos", fotos: 2, campos: [C("nome", "Dupla"), C("porque", "Por que combinam"), C("preco", "Preço")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.suave, h: 50 });
      const w = 440, h = 560;
      quadro(ctx, s, o, 0, M + 10, 150, w, h, { rot: -0.03 }); quadro(ctx, s, o, 1, W - M - 10 - w, 150, w, h, { rot: 0.03 });
      ctx.save(); sombra(ctx, true, 0.6); ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.arc(W / 2, 430, 56, 0, 7); ctx.fill(); sombra(ctx, false);
      ctx.strokeStyle = s.sobreDestaque; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(W / 2, 404); ctx.lineTo(W / 2, 456); ctx.moveTo(W / 2 - 26, 430); ctx.lineTo(W / 2 + 26, 430); ctx.stroke(); ctx.restore();
      texto(ctx, s, o, t.c.nome, { x: M, y: 800, maxW: W - 2 * M, linhas: 2, tam: [84, 74, 64, 56, 48], cor: s.tinta, realce: s.realce, campo: "nome" });
      corpo(ctx, s, o, t.c.porque, { x: M, y: 990, maxW: W - 2 * M, linhas: 3, tam: [40, 36, 32, 29, 26], cor: s.suave, campo: "porque" });
      etiqueta(ctx, s, o, t.c.preco, W - 290, 1240, { rot: -0.05, tam: [64, 56, 48, 42] });
    } },
  "int-prazo": { nome: "Prazos", fotos: 0, campos: [C("titulo", "Título"), C("rot1", "Prazo 1"), C("data1", "Data 1"), C("rot2", "Prazo 2"), C("data2", "Data 2"), C("nota", "Observação")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 160, maxW: W - 2 * M, linhas: 2, tam: [110, 96, 84, 72, 62], cor: s.tinta, realce: s.realce, campo: "titulo" });
      [1, 2].forEach((n, i) => { const y = 480 + i * 330;
        cartao(ctx, s, M, y, W - 2 * M, 280, 26);
        ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.roundRect(M, y, 330, 280, [26, 0, 0, 26]); ctx.fill();
        texto(ctx, s, o, t.c[`data${n}`], { x: M + 20, y: y + 140, maxW: 290, linhas: 1, tam: [110, 96, 84, 72, 60, 50], fam: "t", cor: s.sobreDestaque, alinhar: "center", base: "meio", campo: `data${n}` });
        texto(ctx, s, o, t.c[`rot${n}`], { x: M + 370, y: y + 140, maxW: W - 2 * M - 410, linhas: 3, tam: [48, 42, 37, 32, 28], fam: "x", peso: 700, cor: s.tintaPapel, base: "meio", campo: `rot${n}` }); });
      corpo(ctx, s, o, t.c.nota, { x: M, y: 1170, maxW: W - 2 * M, linhas: 2, tam: [36, 32, 28, 25], cor: s.suave, campo: "nota" });
      icone(ctx, s.icone, W - M - 30, M + 30, 30, s.destaque);
    } },
  "int-opcoes": { nome: "Três opções", fotos: 3, campos: [C("titulo", "Título"), C("op1", "Opção 1"), C("preco1", "Preço 1"), C("op2", "Opção 2"), C("preco2", "Preço 2"), C("op3", "Opção 3"), C("preco3", "Preço 3")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.suave, h: 50 });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 140, maxW: W - 2 * M, linhas: 2, tam: [96, 84, 74, 64, 56], cor: s.tinta, realce: s.realce, campo: "titulo" });
      [0, 1, 2].forEach(i => { const y = 420 + i * 300, n = i + 1;
        cartao(ctx, s, M, y, W - 2 * M, 260, 24);
        foto(ctx, s, o, i, M + 20, y + 20, 220, 220, { r: 16 });
        texto(ctx, s, o, t.c[`op${n}`], { x: M + 280, y: y + 50, maxW: W - 2 * M - 320, linhas: 2, tam: [50, 44, 38, 34, 30], cor: s.tintaPapel, campo: `op${n}` });
        texto(ctx, s, o, t.c[`preco${n}`], { x: M + 280, y: y + 225, maxW: W - 2 * M - 320, linhas: 1, tam: [52, 46, 40, 36], fam: "x", peso: 800, cor: s.realcePapel, base: "baixo", campo: `preco${n}` }); });
    } },
  "int-passo": { nome: "Passo com número", fotos: 1, campos: [C("num", "Número"), C("titulo", "Título"), C("texto", "Texto")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      texto(ctx, s, o, t.c.num, { x: M - 6, y: 40, maxW: 400, linhas: 1, tam: [300, 260, 220], cor: s.realce, campo: "num" });
      marca(ctx, s, o, { x: W - M, y: M, alinhar: "right", cor: s.suave, maxW: 420, h: 50 });
      quadro(ctx, s, o, 0, 300, 220, 700, 620, { rot: 0.02 });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 930, maxW: W - 2 * M, linhas: 2, tam: [84, 74, 64, 56, 48], cor: s.tinta, realce: s.realce, campo: "titulo" });
      corpo(ctx, s, o, t.c.texto, { x: M, y: 1120, maxW: W - 2 * M, linhas: 4, tam: [38, 34, 30, 27, 24], cor: s.suave, campo: "texto" });
    } },
  "int-comparar": { nome: "Comparação", fotos: 2, campos: [C("rot1", "Rótulo 1"), C("rot2", "Rótulo 2"), C("texto", "Texto")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      foto(ctx, s, o, 0, 0, 0, W / 2 - 4, 900); foto(ctx, s, o, 1, W / 2 + 4, 0, W / 2 - 4, 900);
      [[t.c.rot1, M, 0], [t.c.rot2, W / 2 + 40, 1]].forEach(([r, x, k]) => { if (!r) return; ctx.fillStyle = k ? s.destaque : s.papel; ctx.beginPath(); ctx.roundRect(x - 20, 780, W / 2 - 80, 70, 35); ctx.fill();
        rotulo(ctx, s, o, r, { x, y: 798, maxW: W / 2 - 120, tam: [28, 25, 22, 20], espaco: 3, cor: k ? s.sobreDestaque : s.tintaPapel, alinhar: "center", campo: `rot${k + 1}` }); });
      marca(ctx, s, o, { x: M, y: 950, cor: s.suave, h: 50 });
      texto(ctx, s, o, t.c.texto, { x: M, y: 1020, maxW: W - 2 * M, linhas: 3, tam: [64, 56, 50, 44, 38], cor: s.tinta, realce: s.realce, entre: 1.1, campo: "texto" });
    } },
  "int-frase": { nome: "Frase em destaque", fotos: 0, campos: [C("frase", "Frase (use *destaque*)"), C("autor", "Assinatura")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      icone(ctx, s.icone, W / 2, 250, 40, s.destaque);
      texto(ctx, s, o, t.c.frase, { x: M + 20, y: H / 2 + 20, maxW: W - 2 * M - 40, linhas: 5, tam: [110, 96, 84, 72, 62, 54], cor: s.tinta, realce: s.realce, alinhar: "center", base: "meio", entre: 1.08, campo: "frase" });
      rotulo(ctx, s, o, t.c.autor, { x: M, y: H - 200, maxW: W - 2 * M, tam: [28, 25, 22], cor: s.suave, alinhar: "center", espaco: 6, campo: "autor" });
      if (!/\{marca\}/.test(t.c.autor || "") || o.logo) marca(ctx, s, o, { x: W / 2, y: H - 130, alinhar: "center", cor: s.tinta, h: 56 });
    } },
  "int-cta": { nome: "Chamada final", fotos: 1, campos: [C("titulo", "Título"), C("texto", "Texto"), C("contato", "Contato")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      quadro(ctx, s, o, 0, W / 2 - 200, 140, 400, 400, { forma: "circulo" });
      icone(ctx, s.icone, W / 2 + 230, 180, 30, s.destaque, 0.3); icone(ctx, s.icone, W / 2 - 240, 500, 22, s.destaque, -0.2);
      texto(ctx, s, o, t.c.titulo, { x: M, y: 620, maxW: W - 2 * M, linhas: 2, tam: [110, 96, 84, 72, 62], cor: s.tinta, realce: s.realce, alinhar: "center", campo: "titulo" });
      corpo(ctx, s, o, t.c.texto, { x: M + 40, y: 880, maxW: W - 2 * M - 80, linhas: 3, tam: [40, 36, 32, 28], cor: s.suave, alinhar: "center", campo: "texto" });
      ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.roundRect(M + 40, 1090, W - 2 * M - 80, 110, 55); ctx.fill();
      texto(ctx, s, o, t.c.contato, { x: M + 80, y: 1145, maxW: W - 2 * M - 160, linhas: 1, tam: [40, 36, 32, 28, 25], fam: "x", peso: 700, cor: s.sobreDestaque, alinhar: "center", base: "meio", campo: "contato" });
      if (!/\{marca\}/.test(t.c.contato || "") || o.logo) marca(ctx, s, o, { x: W / 2, y: 1240, alinhar: "center", cor: s.suave, h: 50 });
    } },
  "int-resultado": { nome: "Resultado", fotos: 1, campos: [C("titulo", "Rótulo"), C("texto", "Texto")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      quadro(ctx, s, o, 0, M, M, W - 2 * M, 900, {});
      ctx.fillStyle = s.destaque; ctx.beginPath(); ctx.roundRect(M + 30, M + 30, 330, 70, 35); ctx.fill();
      rotulo(ctx, s, o, t.c.titulo, { x: M + 50, y: M + 50, maxW: 290, tam: [28, 25, 22, 20], espaco: 4, cor: s.sobreDestaque, alinhar: "center", campo: "titulo" });
      marca(ctx, s, o, { x: M, y: 1020, cor: s.suave, h: 50 });
      texto(ctx, s, o, t.c.texto, { x: M, y: 1090, maxW: W - 2 * M, linhas: 3, tam: [66, 58, 52, 46, 40], cor: s.tinta, realce: s.realce, entre: 1.1, campo: "texto" });
    } },
  "int-grade": { nome: "Grade de quatro fotos", fotos: 4, campos: [C("titulo", "Título"), C("texto", "Texto")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      const g = 16, w = (W - 2 * M - g) / 2, h = 380;
      [0, 1, 2, 3].forEach(i => foto(ctx, s, o, i, M + (i % 2) * (w + g), 120 + Math.floor(i / 2) * (h + g), w, h, { r: 14 }));
      marca(ctx, s, o, { x: M, y: M - 30, cor: s.suave, h: 44 });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 960, maxW: W - 2 * M - 80, linhas: 2, tam: [84, 74, 64, 56, 48], cor: s.tinta, realce: s.realce, campo: "titulo" });
      corpo(ctx, s, o, t.c.texto, { x: M, y: H - 70, maxW: W - 2 * M, linhas: 2, tam: [36, 32, 28, 25], cor: s.suave, base: "baixo", campo: "texto" });
      icone(ctx, s.icone, W - M - 30, 1000, 28, s.destaque);
    } },
  "int-lista": { nome: "Lista", fotos: 0, campos: [C("titulo", "Título"), C("item1", "Item 1"), C("item2", "Item 2"), C("item3", "Item 3"), C("item4", "Item 4")],
    desenhar(ctx, s, t, o) {
      fundo(ctx, s);
      marca(ctx, s, o, { x: M, y: M, cor: s.tinta });
      texto(ctx, s, o, t.c.titulo, { x: M, y: 170, maxW: W - 2 * M, linhas: 2, tam: [104, 92, 80, 70, 60], cor: s.tinta, realce: s.realce, campo: "titulo" });
      [1, 2, 3, 4].forEach((n, i) => { const y = 470 + i * 200; if (!t.c[`item${n}`]) return;
        ctx.strokeStyle = s.realce; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(M + 6, y + 40); ctx.lineTo(M + 26, y + 62); ctx.lineTo(M + 62, y + 18); ctx.stroke();
        corpo(ctx, s, o, t.c[`item${n}`], { x: M + 100, y: y + 40, maxW: W - 2 * M - 100, linhas: 2, tam: [46, 42, 38, 34, 30], peso: 600, cor: s.tinta, base: "meio", campo: `item${n}` });
        if (n < 4) linhaFina(ctx, M + 100, y + 140, W - M, misturar(s.tinta, s.fundo, 0.82), 2); });
      icone(ctx, s.icone, W - M - 30, H - 110, 32, s.destaque, 0.2);
    } }
};
export const temLayoutEstudio = l => !!LAYOUTS[l];
export const camposDoLayout = l => (LAYOUTS[l] || { campos: [] }).campos;
export const fotosDoLayout = l => (LAYOUTS[l] || { fotos: 0 }).fotos;

/**
 * Desenha uma tela no contexto 1080 × 1350.
 * @param tela   { l, c, inv? }
 * @param estilo estilo resolvido do carrossel (coleção + ajustes da cliente)
 * @param o      { marca, logo?, imgs, ajustes, amostra, caixas? }
 */
export function desenharEstudio(ctx, tela, estilo, o) {
  const lay = LAYOUTS[tela.l]; if (!lay) return;
  const s = estiloDaTela(estilo, tela);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.letterSpacing = "0px";
  lay.desenhar(ctx, s, { ...tela, c: tela.c || {} }, o);
  if (o.amostra) marcaDagua(ctx, s);
  ctx.restore();
}
