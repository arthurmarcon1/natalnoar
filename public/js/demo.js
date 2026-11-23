/* Demonstração pública de Presentes por orçamento. Fotos de exemplo LIMPAS (sem marca-d'água).
   - montarCarrossel: carrossel preenchido, desliza com o dedo e mostra parte do próximo cartão.
   - montarFormatos: Reel (cenas do roteiro) e Stories (enquete → produto escolhido). */
import { desenharExemplo, W, H } from "./render.js";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const calmo = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const preencher = (s, p) => s.replaceAll("{produto}", p.nome).replaceAll("{preco}", p.preco).replaceAll("{paraQuem}", p.paraQuem);

export const telasDaDemo = demo => [
  { tipo: "capa", texto: demo.capa.texto, preco: demo.capa.preco, apoio: demo.capa.apoio, foto: demo.capaFoto },
  ...demo.produtos.map(p => ({ tipo: "produto", texto: p.nome, preco: p.preco, apoio: p.paraQuem, foto: p.foto }))
];

/* ---------------- carrossel ---------------- */
export function montarCarrossel(raiz, demo, { aoMudar, telas: telasModelo, marca } = {}) {
  const telas = telasModelo || telasDaDemo(demo), nomeMarca = marca || demo.marca;
  raiz.innerHTML = `
    <div class="carrossel" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Carrossel de exemplo: ${telas.length} telas">
      ${telas.map((t, i) => `<figure class="car-item" data-i="${i}"><canvas width="${W}" height="${H}" role="img" aria-label="Tela ${i + 1} de ${telas.length}: ${esc(t.texto)} ${esc(t.preco)}"></canvas></figure>`).join("")}
    </div>
    <div class="car-rodape">
      <div class="car-pontos" aria-hidden="true">${telas.map((_, i) => `<span data-p="${i}"></span>`).join("")}</div>
      <span class="car-cont" aria-live="polite">1 / ${telas.length}</span>
      <div class="car-setas"><button type="button" data-car="-1" aria-label="Tela anterior">‹</button><button type="button" data-car="1" aria-label="Próxima tela">›</button></div>
    </div>`;
  const trilho = raiz.querySelector(".carrossel"), itens = [...raiz.querySelectorAll(".car-item")];
  let atual = 0;
  const marcar = i => {
    if (i === atual && raiz.dataset.pronto) return;
    atual = i; raiz.dataset.pronto = "1";
    raiz.querySelectorAll("[data-p]").forEach((p, k) => p.classList.toggle("on", k === i));
    raiz.querySelector(".car-cont").textContent = `${i + 1} / ${telas.length}`;
    raiz.querySelector('[data-car="-1"]').disabled = i === 0; raiz.querySelector('[data-car="1"]').disabled = i === telas.length - 1;
    if (aoMudar && i > 0) aoMudar(i - 1);
  };
  const ir = i => { const el = itens[Math.max(0, Math.min(itens.length - 1, i))]; trilho.scrollTo({ left: el.offsetLeft - trilho.offsetLeft, behavior: calmo() ? "auto" : "smooth" }); };
  // a tela mais visível é a atual
  const obs = new IntersectionObserver(es => {
    const vis = es.filter(e => e.isIntersecting && e.intersectionRatio >= 0.6).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (vis) marcar(+vis.target.dataset.i);
  }, { root: trilho, threshold: [0.6, 0.8, 1] });
  itens.forEach(el => obs.observe(el));
  raiz.addEventListener("click", e => { const b = e.target.closest("[data-car]"); if (b) ir(atual + +b.dataset.car); });
  trilho.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); ir(atual + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); ir(atual - 1); } });
  telas.forEach((t, i) => desenharExemplo(itens[i].querySelector("canvas"), t, { marca: nomeMarca, indice: i, total: telas.length, amostra: false }));
  marcar(0);
  return { irParaProduto: i => ir(i + 1), destruir: () => obs.disconnect() };
}

/* ---------------- Reel e Stories ---------------- */
export function montarFormatos(raiz, demo, { aoMudar, semControles = false } = {}) {
  const prods = demo.produtos;
  let prod = 0, fmt = "reel", timers = [];
  const limpar = () => { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; };
  raiz.innerHTML = `
    ${semControles ? "" : `<div class="demo-abas" role="tablist" aria-label="Formato">
      <button type="button" role="tab" data-fmt="reel" aria-selected="true">Reel</button>
      <button type="button" role="tab" data-fmt="stories" aria-selected="false">Stories</button>
    </div>
    <div class="demo-produtos" role="radiogroup" aria-label="Produto">
      ${prods.map((p, i) => `<button type="button" role="radio" class="dp" data-prod="${i}" aria-checked="${i === 0}"><img src="${esc(p.foto)}" alt="" width="44" height="55" loading="lazy"><span>${esc(p.nome)}</span></button>`).join("")}
    </div>`}
    <div class="demo-palco">
      <section class="fmt" data-painel="reel" aria-label="Cenas do Reel">
        <div class="tel9">
          <div class="reel-barras">${demo.reel.map((_, i) => `<button type="button" data-cena="${i}" aria-label="Cena ${i + 1}"><i></i></button>`).join("")}</div>
          ${demo.reel.map((_, i) => `<div class="cena" data-c="${i}"><img alt=""><p class="cena-txt"></p></div>`).join("")}
          <span class="tel9-rotulo">Reels · roteiro para gravar</span>
        </div>
        <p class="cena-gravar" aria-live="polite"></p>
      </section>
      <section class="fmt" data-painel="stories" hidden aria-label="Stories com enquete">
        <div class="tel9 st">
          <div class="st-barras">${[0, 1, 2].map(() => `<span></span>`).join("")}</div>
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
        <button type="button" class="link st-reset" data-st-reset>Votar de novo</button>
      </section>
    </div>
    <p class="demo-nota" aria-live="polite"></p>`;
  const $ = s => raiz.querySelector(s), $$ = s => [...raiz.querySelectorAll(s)];
  const nota = $(".demo-nota");

  // Reel
  let cena = 0;
  const pintarReel = () => $$(".cena").forEach((el, i) => {
    const c = demo.reel[i], img = el.querySelector("img"), src = c.foto === "capa" ? demo.capaFoto : prods[prod].foto;
    if (img.getAttribute("src") !== src) img.src = src;
    el.querySelector(".cena-txt").textContent = preencher(c.texto, prods[prod]);
  });
  const irCena = i => {
    cena = (i + demo.reel.length) % demo.reel.length;
    $$(".cena").forEach((el, k) => el.classList.toggle("on", k === cena));
    $$(".reel-barras button").forEach((b, k) => b.className = k < cena ? "feito" : k === cena ? "agora" : "");
    $(".cena-gravar").innerHTML = `<b>Cena ${cena + 1} de ${demo.reel.length}.</b> ${esc(preencher(demo.reel[cena].gravar, prods[prod]))}`;
  };
  const tocarReel = () => { limpar(); irCena(cena); if (!calmo()) timers.push(setInterval(() => irCena(cena + 1), 2800)); };

  // Stories
  let frame = 0, votou = false;
  const pintarStories = () => {
    const p = prods[prod];
    $$('.st-f[data-f="1"] img, .st-f[data-f="2"] img').forEach(i => i.src = p.foto);
    $(".st-nome").textContent = `${p.nome} · ${p.preco}`;
    $(".st-det").textContent = preencher(demo.stories.detalhe, p);
  };
  const irFrame = i => {
    frame = Math.max(0, Math.min(2, i));
    $$(".st-f").forEach((el, k) => el.classList.toggle("on", k === frame));
    $$(".st-barras span").forEach((b, k) => b.className = k < frame ? "feito" : k === frame ? "agora" : "");
    if (fmt === "stories") nota.textContent = frame === 0 ? (votou ? "Enquete respondida." : "Toque numa opção para votar.") : frame === 1 ? `Escolhido: ${prods[prod].nome}.` : "A última tela convida a consultar a disponibilidade.";
  };
  const votar = i => {
    votou = true; escolher(i, true);
    const pct = prods.map((_, k) => k === i ? 56 : k === (i + 1) % 3 ? 26 : 18);
    $$(".opc").forEach((b, k) => { b.classList.add("votado"); b.classList.toggle("escolha", k === i); b.querySelector(".opc-bar").style.width = pct[k] + "%"; b.querySelector(".opc-pct").textContent = pct[k] + "%"; b.setAttribute("aria-pressed", String(k === i)); });
    irFrame(0); limpar(); timers.push(setTimeout(() => irFrame(1), calmo() ? 300 : 1300));
  };
  const resetStories = () => {
    votou = false; limpar();
    $$(".opc").forEach(b => { b.classList.remove("votado", "escolha"); b.querySelector(".opc-bar").style.width = "0"; b.querySelector(".opc-pct").textContent = ""; b.removeAttribute("aria-pressed"); });
    irFrame(0);
  };

  function escolher(i, avisar) {
    prod = i;
    $$(".dp").forEach((b, k) => b.setAttribute("aria-checked", String(k === i)));
    raiz.querySelector(".demo-palco").classList.remove("troca"); void raiz.offsetWidth; raiz.querySelector(".demo-palco").classList.add("troca");
    pintarReel(); pintarStories();
    if (fmt === "reel") irCena(cena);
    if (avisar && aoMudar) aoMudar(i);
  }
  function mostrar(f) {
    fmt = f; limpar();
    $$(".demo-abas button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.fmt === f)));
    $$(".fmt").forEach(p => { const on = p.dataset.painel === f; p.hidden = !on; p.classList.remove("entra"); if (on) { void p.offsetWidth; p.classList.add("entra"); } });
    if (f === "reel") { cena = 0; tocarReel(); nota.textContent = "Cada cena do roteiro diz o que gravar e o texto que vai na tela."; }
    else if (votou) irFrame(frame); else resetStories();
  }
  raiz.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || !raiz.contains(b)) return;
    if (b.dataset.prod) escolher(+b.dataset.prod, true);
    else if (b.dataset.fmt) mostrar(b.dataset.fmt);
    else if (b.dataset.cena) { cena = +b.dataset.cena; tocarReel(); }
    else if (b.dataset.voto) { if (!votou) votar(+b.dataset.voto); }
    else if (b.dataset.st) { limpar(); if (frame === 0 && !votou && +b.dataset.st > 0) { nota.textContent = "Vote na enquete para continuar."; return; } irFrame(frame + +b.dataset.st); }
    else if ("stReset" in b.dataset) resetStories();
  });
  pintarReel(); pintarStories(); irCena(0); irFrame(0); if (!semControles) mostrar("reel");
  return { destruir: limpar, escolher: i => { if (i !== prod) escolher(i, false); }, mostrar, produto: () => prod };
}
