/* Demonstração pública de Presentes por orçamento: 3 produtos × Carrossel, Reel e Stories. */
import { desenharTela, carregarFontes, W, H } from "./render.js";
import { fotoDeArquivo } from "./editor.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const calmo = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const preencher = (s, p) => s.replaceAll("{produto}", p.nome).replaceAll("{preco}", p.preco).replaceAll("{paraQuem}", p.paraQuem);

export function montarDemo(raiz, demo) {
  const prods = demo.produtos;
  let prod = 0, fmt = "carrossel", timers = [];
  const limpar = () => { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; };

  raiz.innerHTML = `
    <div class="demo-produtos" role="radiogroup" aria-label="Escolha um produto de exemplo">
      ${prods.map((p, i) => `<button type="button" role="radio" class="dp" data-prod="${i}" aria-checked="${i === 0}">
        <img src="${esc(p.foto)}" alt="" width="56" height="70" loading="lazy"><span><b>${esc(p.nome)}</b><small>${esc(p.preco)}</small></span></button>`).join("")}
    </div>
    <div class="demo-abas" role="tablist" aria-label="Formato">
      ${[["carrossel", "Carrossel"], ["reel", "Reel"], ["stories", "Stories"]].map(([k, n]) => `<button type="button" role="tab" data-fmt="${k}" aria-selected="${k === fmt}">${n}</button>`).join("")}
    </div>
    <div class="demo-palco">
      <section class="fmt" data-painel="carrossel" aria-label="Carrossel de demonstração">
        <div class="car" tabindex="0" aria-roledescription="carrossel">
          <div class="car-trilho">${[0, 1, 2, 3].map(i => `<div class="car-tela" aria-label="Tela ${i + 1} de 4"><canvas width="${W}" height="${H}"></canvas></div>`).join("")}</div>
          <button type="button" class="car-seta ant" data-car="-1" aria-label="Tela anterior">‹</button>
          <button type="button" class="car-seta prox" data-car="1" aria-label="Próxima tela">›</button>
        </div>
        <div class="car-pontos">${[0, 1, 2, 3].map(i => `<button type="button" data-ponto="${i}" aria-label="Ir para a tela ${i + 1}"></button>`).join("")}</div>
      </section>
      <section class="fmt" data-painel="reel" hidden aria-label="Prévia das cenas do Reel">
        <div class="tel9">
          <div class="reel-barras">${demo.reel.map((_, i) => `<button type="button" data-cena="${i}" aria-label="Cena ${i + 1}"><i></i></button>`).join("")}</div>
          ${demo.reel.map((c, i) => `<div class="cena" data-c="${i}"><img alt=""><p class="cena-txt"></p></div>`).join("")}
          <span class="tel9-rotulo">Reels · prévia do roteiro</span>
        </div>
        <p class="cena-gravar" aria-live="polite"></p>
      </section>
      <section class="fmt" data-painel="stories" hidden aria-label="Stories com enquete">
        <div class="tel9 st">
          <div class="st-barras">${[0, 1, 2].map(() => `<span><i></i></span>`).join("")}</div>
          <div class="st-quem"><b>${esc(demo.marca)}</b> · agora</div>
          <div class="st-f" data-f="0">
            <img class="st-bg" src="${esc(demo.capaFoto)}" alt="">
            <div class="st-cx">
              <p class="st-perg">${esc(demo.stories.pergunta)}</p>
              <div class="enquete" role="group" aria-label="Enquete">
                ${prods.map((p, i) => `<button type="button" class="opc" data-voto="${i}"><span class="opc-bar"></span><img src="${esc(p.foto)}" alt=""><span class="opc-nome">${esc(p.nome)}</span><span class="opc-pct"></span></button>`).join("")}
              </div>
            </div>
          </div>
          <div class="st-f" data-f="1"><img class="st-bg" alt=""><div class="st-cx fim"><p class="st-nome"></p><p class="st-det"></p></div></div>
          <div class="st-f" data-f="2"><img class="st-bg" alt=""><div class="st-cx fim"><p class="st-perg">${esc(demo.stories.final)}</p><span class="st-link">↗ ${esc(demo.stories.link)}</span></div></div>
          <button type="button" class="st-toque ant" data-st="-1" aria-label="Story anterior"></button>
          <button type="button" class="st-toque prox" data-st="1" aria-label="Próximo story"></button>
        </div>
        <button type="button" class="link st-reset" data-st-reset>Responder de novo</button>
      </section>
    </div>
    <p class="demo-nota" aria-live="polite"></p>`;

  const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];
  const nota = $(".demo-nota");

  /* ---------- carrossel ---------- */
  const canvases = $$(".car-tela canvas"), trilho = $(".car-trilho");
  let tela = 1;
  const telas = () => [
    { tipo: "capa", texto: "3 presentes até", preco: demo.faixa, apoio: "Arrasta pro lado →", foto: demo.capaFoto },
    ...prods.map(p => ({ tipo: "produto", texto: p.nome, preco: p.preco, apoio: p.paraQuem, foto: p.foto }))
  ];
  async function pintarCarrossel() {
    await carregarFontes();
    const ts = telas();
    await Promise.all(ts.map(async (t, i) => {
      const f = await fotoDeArquivo(t.foto);
      desenharTela(canvases[i], t, { marca: demo.marca, foto: f && f.img, fw: f && f.w, fh: f && f.h, indice: i, total: 4, amostra: true });
    }));
  }
  const irTela = (i, deUsuario) => {
    tela = Math.max(0, Math.min(3, i));
    trilho.style.transform = `translateX(${-tela * 100}%)`;
    $$(".car-pontos button").forEach((b, k) => b.setAttribute("aria-current", String(k === tela)));
    $(".car-seta.ant").disabled = tela === 0; $(".car-seta.prox").disabled = tela === 3;
    if (deUsuario && tela > 0 && tela - 1 !== prod) escolher(tela - 1, false);
    if (fmt === "carrossel") nota.textContent = tela === 0 ? "Tela 1: a capa abre com a faixa de preço." : `Tela ${tela + 1}: cada produto com preço e para quem combina.`;
  };
  // deslizar com o dedo
  let x0 = null, dx = 0;
  const car = $(".car");
  car.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; x0 = e.clientX; dx = 0; trilho.style.transition = "none"; car.setPointerCapture(e.pointerId); });
  car.addEventListener("pointermove", e => { if (x0 == null) return; dx = e.clientX - x0; trilho.style.transform = `translateX(calc(${-tela * 100}% + ${dx}px))`; });
  const soltar = () => { if (x0 == null) return; trilho.style.transition = ""; const lim = car.clientWidth * 0.18; irTela(tela + (dx < -lim ? 1 : dx > lim ? -1 : 0), true); x0 = null; };
  car.addEventListener("pointerup", soltar); car.addEventListener("pointercancel", soltar);
  car.addEventListener("keydown", e => { if (e.key === "ArrowRight") irTela(tela + 1, true); if (e.key === "ArrowLeft") irTela(tela - 1, true); });

  /* ---------- reel ---------- */
  let cena = 0;
  const pintarReel = () => {
    const p = prods[prod];
    $$(".cena").forEach((el, i) => {
      const c = demo.reel[i], img = el.querySelector("img"), src = c.foto === "capa" ? demo.capaFoto : p.foto;
      if (img.getAttribute("src") !== src) img.src = src;
      el.querySelector(".cena-txt").textContent = preencher(c.texto, p);
    });
  };
  const irCena = i => {
    cena = (i + demo.reel.length) % demo.reel.length;
    $$(".cena").forEach((el, k) => el.classList.toggle("on", k === cena));
    $$(".reel-barras button").forEach((b, k) => { b.className = k < cena ? "feito" : k === cena ? "agora" : ""; });
    $(".cena-gravar").innerHTML = `<b>Cena ${cena + 1} de ${demo.reel.length}.</b> ${esc(preencher(demo.reel[cena].gravar, prods[prod]))}`;
  };
  const tocarReel = () => { limpar(); irCena(cena); if (!calmo()) timers.push(setInterval(() => irCena(cena + 1), 2800)); };

  /* ---------- stories ---------- */
  let frame = 0, votou = false;
  const pintarStories = () => {
    const p = prods[prod];
    const [f1, f2] = [$('.st-f[data-f="1"]'), $('.st-f[data-f="2"]')];
    f1.querySelector("img").src = p.foto; f2.querySelector("img").src = p.foto;
    f1.querySelector(".st-nome").textContent = `${p.nome} · ${p.preco}`;
    f1.querySelector(".st-det").textContent = preencher(demo.stories.detalhe, p);
  };
  const irFrame = i => {
    frame = Math.max(0, Math.min(2, i));
    $$(".st-f").forEach((el, k) => el.classList.toggle("on", k === frame));
    $$(".st-barras span").forEach((b, k) => b.className = k < frame ? "feito" : k === frame ? "agora" : "");
    if (fmt === "stories") nota.textContent = frame === 0 ? (votou ? "Enquete respondida." : "Toque numa opção para votar.") : frame === 1 ? `O produto escolhido em detalhe: ${prods[prod].nome}.` : "A última tela convida a consultar a disponibilidade.";
  };
  const votar = i => {
    votou = true; escolher(i, false);
    const pcts = prods.map((_, k) => k === i ? 56 : (k === (i + 1) % 3 ? 26 : 18));
    $$(".opc").forEach((b, k) => { b.classList.add("votado"); b.classList.toggle("escolha", k === i); b.querySelector(".opc-bar").style.width = pcts[k] + "%"; b.querySelector(".opc-pct").textContent = pcts[k] + "%"; b.setAttribute("aria-pressed", String(k === i)); });
    irFrame(0);
    limpar(); timers.push(setTimeout(() => irFrame(1), calmo() ? 300 : 1300));
  };
  const resetStories = () => {
    votou = false; limpar();
    $$(".opc").forEach(b => { b.classList.remove("votado", "escolha"); b.querySelector(".opc-bar").style.width = "0"; b.querySelector(".opc-pct").textContent = ""; b.removeAttribute("aria-pressed"); });
    irFrame(0);
  };

  /* ---------- produto e formato ---------- */
  function escolher(i, moverCarrossel = true) {
    prod = i;
    $$(".dp").forEach((b, k) => b.setAttribute("aria-checked", String(k === i)));
    if (moverCarrossel) irTela(i + 1, false);
    pintarReel(); pintarStories();
    if (fmt === "reel") { irCena(cena); }
    raiz.dispatchEvent(new CustomEvent("produto", { detail: prods[i] }));
  }
  function mostrar(f) {
    fmt = f; limpar();
    $$(".demo-abas button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.fmt === f)));
    $$(".fmt").forEach(p => { const on = p.dataset.painel === f; p.hidden = !on; p.classList.remove("entra"); if (on) { void p.offsetWidth; p.classList.add("entra"); } });
    if (f === "carrossel") irTela(tela, false);
    if (f === "reel") { cena = 0; tocarReel(); nota.textContent = "Prévia das cenas do roteiro. Na campanha, cada cena vem com o que gravar e o texto na tela."; }
    if (f === "stories") { if (votou) irFrame(frame); else resetStories(); }
  }

  raiz.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || !raiz.contains(b)) return;
    if (b.dataset.prod) escolher(+b.dataset.prod);
    else if (b.dataset.fmt) mostrar(b.dataset.fmt);
    else if (b.dataset.car) irTela(tela + +b.dataset.car, true);
    else if (b.dataset.ponto) irTela(+b.dataset.ponto, true);
    else if (b.dataset.cena) { cena = +b.dataset.cena; tocarReel(); }
    else if (b.dataset.voto) votar(+b.dataset.voto);
    else if (b.dataset.st) { limpar(); if (frame === 0 && !votou && +b.dataset.st > 0) { nota.textContent = "Responda a enquete para continuar."; return; } irFrame(frame + +b.dataset.st); }
    else if ("stReset" in b.dataset) resetStories();
  });

  pintarCarrossel(); pintarReel(); pintarStories(); irTela(1, false); irCena(0); irFrame(0); mostrar("carrossel");
  return { destruir: limpar, produtoAtual: () => prods[prod] };
}
