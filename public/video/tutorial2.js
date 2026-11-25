/* Vídeo tutorial em motion graphics (1080 × 1920, ~42 s), na identidade da página inicial nova.
   Mostra a troca da foto por uma foto real (vestido de poá) e o nome e o preço: "Vestido Poá", R$ 99.
   Tudo é uma função do tempo: quadro(t) desenha o instante t. Ao vivo, um laço chama quadro(agora);
   na gravação (tests/video/gravar.mjs), quadro(t) é chamado para cada quadro de 1/30 s.
   As artes vêm do motor real do editor (desenharEstudio) e do catálogo. */
import { desenharEstudio, carregarTodosPares } from "../js/estudio.js";
import { fotoDeArquivo } from "../js/render.js";
import { CATALOGO, estiloOriginal } from "../catalogo/index.js";
import { DEMOS } from "../amostra/index.js";

export const DURACAO = 42;
const $ = id => document.getElementById(id);
const CAMP = "presentes-por-orcamento", CARR = CATALOGO[CAMP].carrosseis.find(x => x.id === "ate-100");
const EST = estiloOriginal(CAMP, CARR), VERDE = { ...EST, fundo: "#1E4A35", texto: "#F3E8DC" };
const FOTO_NOVA = "video/vestido-poa.jpg", ROLO = ["assets/exemplo/13-perfume.jpg", FOTO_NOVA, "assets/exemplo/14-oculos.jpg", "assets/exemplo/12-colar.jpg"];
const TELA_FOTO = 3; // tela 4 (um produto em destaque): a foto real entra aqui

/* ---------- curvas ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);              // sai rápido, chega suave
const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const p = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
/* entra em [a, a+d], sai em [b-d, b]: devolve 0..1 (0 fora) */
const janela = (t, a, b, d = .45) => Math.min(ease(p(t, a, a + d)), 1 - ease(p(t, b - d, b)));
function estilo(el, { x = 0, y = 0, s = 1, o = 1, r = 0 } = {}) {
  el.style.opacity = o; el.style.visibility = o <= 0.001 ? "hidden" : "visible";
  el.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
}
const surge = (el, t, a, b, { dy = 60, d = .45 } = {}) => { const v = janela(t, a, b, d); estilo(el, { y: (1 - v) * dy, o: v }); return v; };

/* ---------- roteiro (segundos) ---------- */
const PASSOS = [
  [4.0, 8.0, "1", "Escolha seu perfil", "Loja ou serviço"],
  [8.0, 13.0, "2", "Coloque sua marca", "O nome entra na arte na hora"],
  [13.0, 18.5, "3", "Troque a foto", "A foto do seu produto, do celular"],
  [18.5, 23.0, "4", "Ajuste nome e preço", "Toque no texto e digite"],
  [23.0, 28.0, "5", "Cores da sua marca", "Um toque muda a coleção inteira"],
  [28.0, 32.4, "6", "Baixe e publique", "4 imagens prontas, na ordem"]
];
const MARCA = "Ateliê da Bia";
/* o dedo: [tempo, x, y] (some fora dos intervalos) e os toques */
const DEDO = [[4.9, 900, 1700], [5.6, 300, 1555], [6.4, 300, 1555], null, [8.5, 900, 1700], [8.95, 540, 1540], [9.6, 820, 1640], null,
  [14.6, 900, 1880], [15.2, 437, 1623], [15.6, 437, 1623], null, [18.7, 900, 1700], [19.1, 540, 1540], [19.6, 820, 1640], null,
  [24.0, 900, 1800], [24.75, 431, 1425], [25.3, 431, 1425], null, [28.4, 900, 1900], [28.9, 540, 1790], [29.6, 540, 1790], null];
const TOQUES = [5.8, 8.95, 15.35, 19.1, 24.85, 29.0];

/* ---------- desenho das artes (só quando muda) ---------- */
let imgs = null, fotoNova = null, ultimo = [];
const canv = [0, 1, 2, 3].map(i => $(`c${i}`).querySelector("canvas"));
function arte(i, st) {
  const chave = JSON.stringify(st); if (ultimo[i] === chave) return; ultimo[i] = chave;
  const t = { ...CARR.telas[i], c: { ...CARR.telas[i].c } }, fotos = [...imgs[i]];
  let aj = t.aj || [];
  if (i === TELA_FOTO) { if (st.foto) { fotos[0] = fotoNova; aj = [{ zoom: 1, fx: .5, fy: .4 }]; t.c.apoio = "Para a ceia e para a virada"; } t.c.nome = st.nome; t.c.preco = st.preco; }
  desenharEstudio(canv[i].getContext("2d"), t, st.verde ? VERDE : EST, { marca: st.marca || "Nome da loja aqui", imgs: fotos, ajustes: aj });
}
const digitar = (txt, t, a, b) => txt.slice(0, Math.round(txt.length * p(t, a, b)));

/* ---------- um quadro ---------- */
export function quadro(t) {
  // logo e barra
  estilo($("logo"), { o: 1 - janela(t, 37, 43, .5) });
  $("prog").style.width = `${(t / DURACAO) * 1080}px`;

  // 1. gancho
  const sai = ease(p(t, 3.4, 4.0));
  estilo($("gancho"), { y: -sai * 120, o: 1 - sai });
  [["g1", .15], ["g2", .5]].forEach(([id, a]) => { const v = ease(p(t, a, a + .55)); estilo($(id), { y: (1 - v) * 120, o: v }); });
  { const v = back(p(t, 1.0, 1.55)); estilo($("g3"), { s: lerp(.7, 1, v), o: clamp(p(t, 1.0, 1.25) * 4) }); }
  volta(VOLTAS[0], easeIO(p(t, 1.7, 2.7)), t >= 1.65);

  // passos
  const ps = PASSOS.find(([a, b]) => t >= a && t < b);
  if (ps) { $("passo-n").textContent = ps[2]; $("passo-t").firstChild.textContent = ps[3]; $("passo-s").textContent = ps[4]; const v = janela(t, ps[0], ps[1], .4); estilo($("passo"), { x: (1 - v) * -80, o: v }); }
  else estilo($("passo"), { o: 0 });

  // segmento
  surge($("seg"), t, 4.2, 7.9, { dy: 120 });
  $("seg-loja").className = t >= 5.8 ? "on" : "";

  // estado das artes
  const marca = t < 9.2 ? "" : digitar(MARCA, t, 9.2, 11.4);
  const NOME0 = CARR.telas[TELA_FOTO].c.nome, PRECO0 = CARR.telas[TELA_FOTO].c.preco;
  const nome = t < 19.3 ? NOME0 : t < 19.9 ? digitar(NOME0, 19.9 - t + 19.3, 19.3, 19.9) : digitar("Vestido Poá", t, 19.9, 20.6);
  const preco = t < 20.9 ? PRECO0 : t < 21.15 ? "R$ " : digitar("R$ 99", t, 20.9, 21.7);
  const foto = t >= 16.3;
  [0, 1, 2, 3].forEach(i => arte(i, { marca, foto: i === TELA_FOTO && foto, nome, preco, verde: t >= 25.0 + i * .16 }));

  // cartões: entrada → carrossel (folheia para a tela 2) → grade 2 × 2 → saída
  const idx = 3 * easeIO(p(t, 13.0, 14.4)); // folheia até a tela 4
  const grade = easeIO(p(t, 23.0, 23.9));
  const fora = ease(p(t, 32.2, 32.7));
  const G = [[190, 20], [556, 20], [190, 470], [556, 470]];
  [0, 1, 2, 3].forEach(i => {
    const ent = ease(p(t, 6.0 + (i ? .25 : 0), 6.8 + (i ? .25 : 0)));
    let x = 160 + (i - idx) * 820, y = (1 - ent) * 320, s = 1;
    if (grade > 0) { x = lerp(x, G[i][0], grade); y = lerp(y, G[i][1], grade); s = lerp(1, .44, grade); }
    // pulso quando a cor muda
    const pul = Math.sin(Math.PI * p(t, 25.0 + i * .16, 25.35 + i * .16)) * .05 * grade;
    estilo($(`c${i}`), { x: x - 160, y: y - fora * 60, s: s + pul, o: Math.min(ent, 1 - fora) });
  });

  // campo de texto (marca, depois nome e preço)
  const vc = Math.max(janela(t, 8.3, 13.3), janela(t, 18.6, 23.2));
  estilo($("campo"), { y: (1 - vc) * 80, o: vc });
  if (t < 16) { $("campo-rot").textContent = "Nome da sua marca"; $("campo-txt").textContent = marca; }
  else if (t < 20.7) { $("campo-rot").textContent = "Produto"; $("campo-txt").textContent = nome; }
  else { $("campo-rot").textContent = "Preço"; $("campo-txt").textContent = preco; }
  $("caret").style.opacity = Math.floor(t * 2.4) % 2 ? 0 : 1;

  // rolo de fotos e a foto voando até a tela
  surge($("rolo"), t, 14.2, 18.3, { dy: 160 });
  { const k = p(t, 15.5, 16.3), v = easeIO(k), on = t >= 15.45 && t < 16.35;
    estilo($("voa"), { x: lerp(337, 440, v), y: lerp(1523, 658, v), s: lerp(1, 2.9, v), o: on ? 1 : 0, r: lerp(0, -3, Math.sin(Math.PI * k)) }); }

  // cores
  { const v = janela(t, 23.6, 28.2); estilo($("cores"), { y: (1 - v) * 80, o: v }); $("cor-verde").className = t >= 24.85 ? "on" : ""; }
  surge($("aviso"), t, 25.8, 28.2, { dy: 30 });

  // baixar
  { const v = janela(t, 28.2, 32.4); estilo($("botao"), { y: (1 - v) * 100, o: v }); $("botao").textContent = t >= 30.1 ? "4 imagens salvas ✓" : "Baixar as 4 imagens"; }
  [[150, 1350], [640, 1350], [150, 1470], [640, 1470]].forEach(([x, y], i) => {
    const a = 29.15 + i * .18, v = back(p(t, a, a + .45)), sai2 = ease(p(t, 32.0, 32.4));
    estilo($(`d${i}`), { x, y: y - sai2 * 40, s: lerp(.4, 1, v), o: Math.min(clamp(p(t, a, a + .2) * 3), 1 - sai2) });
  });

  // extras
  surge($("extras-t"), t, 32.6, 37.2, { dy: 80 });
  [60, 390, 720].forEach((x, i) => { const a = 33.0 + i * .22, v = janela(t, a, 37.2, .55); estilo($(`e${i}`), { x, y: 780 + (1 - v) * 260, o: v, r: (1 - v) * (i - 1) * 4 }); });
  [...$("dias").children].forEach((d, i) => { d.className = t >= 34.2 + i * .22 ? "x" : ""; });

  // chamada final
  { const v = janela(t, 37.3, 60, .6); estilo($("cta"), { y: (1 - v) * 90, o: v }); volta(VOLTAS[1], easeIO(p(t, 38.3, 39.3)), t >= 38.25); }

  // dedo e toque
  const seg = segmento(t);
  if (seg) estilo($("dedo"), { x: seg[0], y: seg[1], o: seg[2], s: TOQUES.some(a => t >= a && t < a + .18) ? .82 : 1 }); else estilo($("dedo"), { o: 0 });
  const tq = TOQUES.find(a => t >= a && t < a + .55);
  if (tq != null) { const k = p(t, tq, tq + .55), at = DEDO.find(d => d && d[0] >= tq - .6 && d[0] <= tq + .1); estilo($("onda"), { x: at ? at[1] : 0, y: at ? at[2] : 0, s: lerp(.6, 2.2, ease(k)), o: 1 - k }); }
  else estilo($("onda"), { o: 0 });
}
/* posição do dedo: cada trecho (separado por null) aparece, anda entre os pontos e some */
const TRECHOS = DEDO.reduce((acc, d) => { if (!d) acc.push([]); else acc[acc.length - 1].push(d); return acc; }, [[]]).filter(g => g.length > 1);
function segmento(t) {
  const g = TRECHOS.find(g => t >= g[0][0] && t <= g[g.length - 1][0]); if (!g) return null;
  const i = Math.max(0, g.findIndex(d => d[0] > t) - 1), a = g[i], b = g[i + 1] || a, k = easeIO(p(t, a[0], b[0]));
  const o = Math.min(p(t, g[0][0], g[0][0] + .25), 1 - p(t, g[g.length - 1][0] - .3, g[g.length - 1][0]));
  return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), o];
}

/* ---------- a volta à mão em "vem pronto." (o mesmo laço da página inicial) ---------- */
const VOLTAS = [];
function prepararVolta(vp) {
  const em = vp.querySelector("em"), svg = vp.querySelector("svg"), path = svg.querySelector("path"), dot = svg.querySelector("circle");
  const w = em.offsetWidth, h = em.offsetHeight, folga = h * .42, rx = w / 2 + folga, ry = h * .8, m = 20;
  svg.setAttribute("width", 2 * rx + 2 * m); svg.setAttribute("height", 2 * ry + 2 * m); svg.style.left = `${w / 2 - rx - m}px`; svg.style.top = `${h / 2 - ry - m}px`;
  const cx = rx + m, cy = ry + m, a0 = Math.PI * 1.1, giro = Math.PI * 2 * 1.06, pts = [];
  for (let k = 0; k <= 120; k++) { const f = k / 120, a = a0 + giro * f, wv = 1 + .02 * Math.sin(3 * a + .6), sobe = 1 + .05 * f;
    pts.push([cx + rx * wv * Math.cos(a) * (1 + .015 * f), cy + ry * wv * sobe * Math.sin(a) - 4 * f]); }
  path.setAttribute("d", "M" + pts.map(q => q.map(v => v.toFixed(1)).join(" ")).join(" L"));
  const L = path.getTotalLength(); path.style.strokeDasharray = `${L}`;
  VOLTAS.push({ path, dot, L });
}
function volta(v, k, visivel) {
  if (!v) return; v.path.style.strokeDashoffset = `${v.L * (1 - k)}`;
  const q = v.path.getPointAtLength(v.L * Math.max(k, .001)); v.dot.setAttribute("cx", q.x); v.dot.setAttribute("cy", q.y); v.dot.style.opacity = visivel ? 1 : 0;
}

/* ---------- preparar ---------- */
export async function preparar() {
  $("dias").innerHTML = Array.from({ length: 9 }, (_, i) => `<span>${i + 1}</span>`).join("");
  ROLO.forEach((f, i) => { $(`r${i}`).src = "/" + f; }); $("voa").src = "/" + FOTO_NOVA;
  const [fotos, nova] = await Promise.all([Promise.all(CARR.telas.map(tl => Promise.all((tl.f || []).map(f => fotoDeArquivo("/" + f))))), fotoDeArquivo("/" + FOTO_NOVA), carregarTodosPares(), document.fonts.ready]);
  imgs = fotos; fotoNova = nova;
  await document.fonts.load('600 44px "Fraunces"'); await document.fonts.load('800 40px "Plus Jakarta Sans"');
  await document.fonts.load('800 150px "Bricolage Grotesque"'); await document.fonts.load('600 60px "Bricolage Grotesque"');
  prepararVolta($("vp1")); prepararVolta($("vp2"));
  // Stories do kit (trecho público), desenhado uma vez
  const st = DEMOS[CAMP].trechos.story, imgsSt = await Promise.all(st.f.map(f => fotoDeArquivo("/" + f)));
  desenharEstudio($("story").getContext("2d"), st, estiloOriginal(CAMP, { nivel: 1 }), { marca: MARCA, imgs: imgsSt, ajustes: [] });
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
}

/* ---------- ao vivo ---------- */
function encaixar() { const k = Math.min(innerWidth / 1080, innerHeight / 1920); $("palco").style.transform = `scale(${k})`; $("palco").style.margin = `${(innerHeight - 1920) / 2}px ${(innerWidth - 1080) / 2}px`; }
const q = new URLSearchParams(location.search);
window.quadro = quadro; window.DURACAO = DURACAO;
window.pronto = preparar().then(() => {
  if (q.has("gravar")) { document.body.style.background = "transparent"; $("controle").remove(); quadro(0); return; }
  encaixar(); addEventListener("resize", encaixar);
  let t0 = performance.now() - (+q.get("t") || 0) * 1000, pausa = q.has("parado") ? (+q.get("t") || 0) : null;
  addEventListener("keydown", e => {
    const agora = pausa ?? (performance.now() - t0) / 1000;
    if (e.key === " ") { if (pausa == null) pausa = agora; else { t0 = performance.now() - pausa * 1000; pausa = null; } }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const n = clamp(agora + (e.key === "ArrowRight" ? 1 : -1), 0, DURACAO); if (pausa != null) pausa = n; else t0 = performance.now() - n * 1000; }
    if (e.key === "r" || e.key === "R") { t0 = performance.now(); pausa = null; }
  });
  const laco = () => { const t = pausa ?? (performance.now() - t0) / 1000; quadro(Math.min(t, DURACAO)); requestAnimationFrame(laco); };
  laco();
});
