import { SITE } from "../config.js";
import { DEMOS } from "../amostra/index.js";
import {
  fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato,
  planoPorId, planoPadrao, pecasDoPlano, entregasDoPlano, calendariosDoConteudo
} from "./logic.js";
import { montarEstudio } from "./estudio-editor.js";
import { montarCarrossel, montarFormatos } from "./demo.js";
import { CATALOGO, GRUPOS, COLECOES, carrosseisDoNivel, estiloOriginal, marcaExemplo } from "../catalogo/index.js";
import { miniatura, desenharExemplo } from "./render.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const marc = s => esc(s).replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>");
const multi = s => marc(s).replace(/\n/g, "<br>");
/* preço nunca quebra no meio ("R$" de um lado, número do outro) */
const semQuebra = h => h.replace(/R\$ [\d.]+,\d{2}/g, m => `<span class="nw">${m}</span>`);
const menorPreco = fmtBRL(Math.min(...SITE.planos.map(p => p.preco)));
const aPartir = `A partir de ${menorPreco}`, aPartirMin = `a partir de ${menorPreco}`;
const guardado = {
  get(k, f, area = localStorage) { try { return area.getItem(k) ?? f; } catch { return f; } },
  set(k, v, area = localStorage) { try { v == null ? area.removeItem(k) : area.setItem(k, v); } catch {} }
};
const ses = (() => { try { return sessionStorage; } catch { return null; } })();
const estado = {
  publico: publicoPorId(SITE, guardado.get("nna-publico", "loja")) ? guardado.get("nna-publico", "loja") : "loja",
  plano: planoPorId(SITE, ses && guardado.get("nna-plano", "", ses)) ? guardado.get("nna-plano", "", ses) : planoPadrao(SITE).id,
  carrArea: null, cal: null, area: null, rolarPlanos: false
};
const DEMO_HERO = DEMOS["presentes-por-orcamento"];
let montados = [], animou = false;

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
const planoAtual = () => planoPorId(SITE, estado.plano) || planoPadrao(SITE);
const campanhaDoPublico = id => temasDoPublico(SITE, id).find(t => t.status === "disponivel") || null;

/* ---------- compra ---------- */
function botaoComprar(tema, plano, extra = "") {
  const c = estadoCompra(tema, plano, SITE);
  if (c.tipo === "em-preparacao") return "";
  const fora = c.tipo === "checkout" ? ` target="_blank" rel="noopener"` : "";
  return `<a class="btn grande ${extra}" href="${esc(c.href)}"${fora} data-compra="${c.tipo}" data-plano-compra="${plano.id}"><span>${semQuebra(esc(c.rotulo))}</span></a>`;
}

/* ---------- planos ---------- */
/* capas reais do catálogo (desenhadas pelo próprio motor do editor) */
const telaCat = (campId, x, i = 0) => ({ ...x.telas[i], estilo: estiloOriginal(campId, x) });
function capaCat(campId, carrId, largura) {
  const c = CATALOGO[campId], x = c && (c.carrosseis.find(y => y.id === carrId) || c.carrosseis[0]);
  return x ? miniatura(telaCat(campId, x), { marca: marcaExemplo(campId, x) }, largura).catch(() => "") : Promise.resolve("");
}
function planoCard(p) {
  const on = p.id === estado.plano;
  return `<div class="plano ${on ? "on" : ""}" role="radio" tabindex="${on ? 0 : -1}" aria-checked="${on}" data-plano="${p.id}">
    <div class="pl-topo"><b class="pl-nome">${esc(p.nome)}</b><span class="pl-preco num">${fmtBRL(p.preco)}</span><span class="pl-check" aria-hidden="true"></span></div>
    <div class="pl-capas" data-capas="${p.nivel}" aria-hidden="true"></div>
    <p class="pl-qtd">${esc(p.qtd)}</p>
    <ul class="pl-itens">${p.itens.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
    ${p.destaque ? `<p class="pl-destaque">${esc(p.destaque)}</p>` : ""}
  </div>`;
}
async function preencherCapas(tema) {
  const c = tema && CATALOGO[tema.id]; if (!c) return;
  const [base, extras, virada] = await Promise.all([1, 2, 3].map(n => Promise.all(c.carrosseis.filter(x => x.nivel === n).map(async x => ({ x, u: await capaCat(c.id, x.id, 220) })))));
  const imgs = (lista, cls = "") => lista.filter(v => v.u).map(({ x, u }) => `<a href="#editar/${c.id}/${x.id}" data-capa-link title="Abrir no editor: ${esc(x.nome)}"><img class="${cls}" src="${u}" alt="${esc(x.nome)}"></a>`).join("");
  document.querySelectorAll("[data-capas]").forEach(box => {
    const n = +box.dataset.capas;
    box.innerHTML = n === 1 ? imgs(base)
      : n === 2 ? `<span class="pl-rot">Tudo do Pronto +</span>${imgs(extras, "nova")}`
      : `<span class="pl-rot">Tudo do Completo +</span>${imgs(virada, "nova virada")}`;
  });
}
function resumoPlano(tema, p) {
  return `<p class="pl-escolhido" id="pl-escolhido" aria-live="polite"><span>${esc(tema.nome)} ·</span> <b>${esc(p.nome)}</b> <span class="num">${fmtBRL(p.preco)}</span></p>`;
}
function secaoPlanos(tema) {
  const p = planoAtual();
  return `<section class="wrap bloco planos-sec" id="planos" aria-labelledby="planos-t">
    <h2 id="planos-t" class="sub-t">Escolha seu plano</h2>
    <p class="hint">Compra única. O preço é o valor total do plano.</p>
    <div class="planos" role="radiogroup" aria-label="Planos">${SITE.planos.map(planoCard).join("")}</div>
    <p class="pl-todos">${esc(SITE.incluemTodos)}</p>
    <div class="pl-acao">${resumoPlano(tema, p)}<div id="pl-botao">${botaoComprar(tema, p, "block")}</div></div>
  </section>`;
}

/* ---------- "Ver o que vem no kit" (acompanha o plano) ---------- */
function verTudo(demo, plano, { trechos = false, tema = null } = {}) {
  const t = demo.trechos, [p1, p2, p3] = demo.produtos, f = [demo.capaFoto, p1.foto, p2.foto, p3.foto].map(esc);
  const item = (num, titulo, sub, desc, visual, cls = "") => `<li class="kit-item ${cls}"><div class="kv" aria-hidden="true">${visual}</div>
    <div class="kt"><span class="kn">${num}</span><b>${titulo}</b><span class="ks">${sub}</span><p>${desc}</p></div></li>`;
  const v = {
    carrossel: `<div class="v-car"><img src="${f[1]}" alt=""><img src="${f[0]}" alt=""><img src="${f[3]}" alt=""></div>`,
    reel: `<div class="v-tel"><img src="${f[2]}" alt=""><span class="v-play">▶</span><span class="v-cap">Cena 1 · abertura</span></div>`,
    stories: `<div class="v-tel v-st"><img src="${f[0]}" alt=""><span class="v-barras"><i></i><i></i><i></i></span><span class="v-poll"><i style="--p:56%">${esc(p1.nome)}</i><i style="--p:26%">${esc(p3.nome)}</i></span></div>`,
    whatsapp: `<div class="v-wa"><span class="b in">Quanto custa? 😍</span><span class="b out">${esc(p1.nome)} sai por ${esc(p1.preco)} 🎁</span><span class="b in">Quero!</span></div>`,
    calendario: n => `<div class="v-cal">${Array.from({ length: 10 }, (_, i) => `<span class="${i < 3 ? "x" : ""}">${i + 1}</span>`).join("")}${n > 10 ? `<span class="mais">+${n - 10}</span>` : ""}</div>`,
    tutorial: `<div class="v-tut"><span>✓ Fotografe com luz de janela</span><span>✓ Troque os [marcadores]</span><span>✓ Baixe e publique</span></div>`,
    lista: (nomes, cor) => `<div class="v-lista ${cor}">${nomes.map(n => `<span>${esc(n)}</span>`).join("")}</div>`
  };
  const diasNatal = plano.nivel >= 2 ? 15 : 10;
  const itens = [
    item(plano.carrosseis, "Carrosséis editáveis", `${plano.carrosseis * 4} telas · com legenda`, "Você troca foto, preço e marca no celular e baixa os PNGs prontos, sem marca-d'água.", v.carrossel, "largo"),
    item(plano.roteiros, "Roteiros de Reels", "cena por cena", "Abertura, texto na tela, legenda e chamada final. Com versão para quem não quer aparecer.", v.reel),
    item(plano.stories, "Sequências de Stories", `${plano.stories * 3} telas · com enquetes`, "Perguntas, enquetes e chamadas que fazem a cliente responder.", v.stories),
    item(plano.mensagens, "Mensagens de WhatsApp", "é só copiar", "Para responder preço, sugerir presentes e avisar prazos.", v.whatsapp),
    item(diasNatal, "Dias de calendário", plano.nivel >= 3 ? "+ 5 dias de Réveillon" : "+ versão expressa de 3 dias", "O que postar em cada dia, peça por peça. Sem pensar no que publicar.", v.calendario(diasNatal)),
    item(1, "Tutorial rápido", "do celular ao post", "Como fotografar, editar, baixar e publicar em poucos minutos.", v.tutorial),
    plano.nivel >= 2 ? item(3, "Temas extras", "carrossel + roteiro em cada", "Três ideias novas para variar o feed.", v.lista(demo.extras, "extra")) : "",
    plano.nivel >= 3 ? item(1, "Minicampanha de Réveillon", "3 carrosséis · 3 Reels · 3 Stories", "Conteúdo próprio para fechar o ano e começar o próximo vendendo.", v.lista(demo.reveillon, "virada")) : ""
  ].join("");
  return `<details class="kit" id="kit">
    <summary>
      <span class="kit-fotos" aria-hidden="true"><img src="${f[1]}" alt=""><img src="${f[2]}" alt=""><img src="${f[3]}" alt=""></span>
      <span class="kit-chamada"><b>Ver o que vem no kit</b><span>Carrosséis, Reels, Stories e calendário</span></span>
      <span class="kit-seta" aria-hidden="true">↓</span>
    </summary>
    <div class="kit-corpo">
      <p class="kit-intro">${tema ? `${esc(plano.nome)}: tudo pensado para o seu Natal, ` : "Tudo pensado para o seu Natal, "}<em>pronto para usar.</em></p>
      <ul class="kit-grade">${itens}</ul>
      <div class="kit-total">
        <div><span class="kt-num">${plano.carrosseis}</span><span>carrosséis + ${plano.roteiros} roteiros de Reels no ${esc(plano.nome)}</span></div>
        <b>${tema ? `por ${fmtBRL(plano.preco)}` : aPartirMin}</b>
      </div>
      ${trechos ? `<h3 class="trechos-t">Tirado do kit</h3><div class="trechos">
        <article class="trecho"><span class="eyebrow">Roteiro de Reel · ${esc(t.reel.duracao)}</span><b class="tr-nome">${marc(t.reel.nome)}</b>
          <p><b>Abertura.</b> Grave: ${marc(t.reel.abertura.filmar)}<br><span class="tr-fala">Fale: “${marc(t.reel.abertura.fala)}”</span></p>
          <p><b>Cena 1.</b> Grave: ${marc(t.reel.cena.filmar)}<br><span class="tr-fala">Texto na tela: “${marc(t.reel.cena.texto)}”</span></p><p class="hint">${esc(t.reel.resto)}</p></article>
        <article class="trecho tr-story"><span class="eyebrow">Stories · tela ${t.story.tela} de 3</span><b class="tr-nome">${marc(t.story.nome)}</b>
          <canvas data-trecho-story width="1080" height="1920" role="img" aria-label="Tela de Stories do kit: ${esc(t.story.c.pergunta.replace(/\*/g, ""))}"></canvas><p class="hint">${esc(t.story.adesivo)}. Você coloca o adesivo no Instagram.</p></article>
        <article class="trecho"><span class="eyebrow">Calendário · primeiros dias</span><ul>${t.calendario.map(d => `<li><b>Dia ${d.dia}</b> ${d.pecas.map(marc).join("<br>")}</li>`).join("")}</ul><p class="hint">${esc(t.calendarioResto)}</p>
          <span class="eyebrow">Legenda</span><p>${multi(t.legenda)}</p></article>
      </div>` : ""}
      <ol class="passos"><li><b>Escolha o plano</b><span>Compra única, ${aPartirMin}.</span></li><li><b>Receba o link de acesso</b><span>A campanha fica na sua área.</span></li><li><b>Troque fotos, preços e a marca</b><span>No celular, direto no site.</span></li><li><b>Baixe e publique</b><span>Seguindo o calendário.</span></li></ol>
      ${tema ? botaoComprar(tema, plano, "block kit-comprar") : `<a class="btn grande block kit-comprar" href="#campanhas">Escolher minha campanha</a>`}
    </div></details>`;
}
/* desenha a tela de Stories tirada do kit (vitrine da campanha) */
function desenharTrechoStory(campId) {
  const cv = document.querySelector("[data-trecho-story]"), demo = DEMOS[campId]; if (!cv || !demo) return;
  const st = demo.trechos.story;
  desenharExemplo(cv, { ...st, estilo: estiloOriginal(campId, { nivel: 1 }) }, { marca: marcaExemplo(campId, null) });
}
const conviteGestao = () => `<p class="convite">Quer alguém cuidando do seu Instagram o ano todo? <a href="#gestao">Gestão mensal</a></p>`;

/* ---------- início ---------- */
/* estrela desenhada (gira ao toque) e traço de fita entre seções */
const estrela = (cls = "", estilo = "") => `<svg class="estrela-d ${cls}" style="${estilo}" viewBox="0 0 40 40" aria-hidden="true" data-estrela><path d="M20.4 2.6c.9 9.6 3.2 14.1 16.8 17.1-13.1 2.4-15.4 6.6-16.6 17.7-1.3-11-4.1-15.4-17.4-17.6 12.9-2.6 16-7.7 17.2-17.2z"/></svg>`;
const fita = (cls = "") => `<svg class="fita-d desenha ${cls}" viewBox="0 0 400 38" preserveAspectRatio="none" aria-hidden="true"><path class="f2" d="M-5 24 C 40 8, 80 34, 130 20 S 220 4, 270 18 S 360 34, 405 14"/><path class="f1" d="M-5 18 C 50 4, 95 30, 150 16 S 245 2, 300 16 S 370 30, 405 10"/></svg>`;

/* vitrine pop: a foto vira post, entram duas telas atrás (leque) e a pilha passa a deslizar */
function vitrinePop() {
  const d = DEMO_HERO, p = d.produtos[0];
  return `<div class="vp ${animou ? "" : "abre"}" id="vitrine-pop" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Exemplo: sua foto vira post. Deslize para ver outras telas.">
    <div class="vp-pilha">
      <figure class="vp-card vp-post" data-pos="0" data-i="0">
        <div class="vp-top"><span class="vp-av">${esc(d.marca.charAt(0))}</span>${esc(d.marca.toLowerCase().replace(/\s+/g, ""))}<span class="vp-mais">•••</span></div>
        <div class="vp-foto"><img src="${esc(p.foto)}" alt="Foto de produto: ${esc(p.nome)}"><figcaption class="vp-cap"><b>${esc(p.nome)}</b><span class="vp-preco">${esc(p.preco)}</span></figcaption></div>
        <div class="vp-rodape">♡ ◯ ➤</div>
      </figure>
      <figure class="vp-card" data-pos="1" data-i="1"><img data-vp-mini="cara-dela" alt="Capa de carrossel: É a cara dela."></figure>
      <figure class="vp-card" data-pos="2" data-i="2"><img data-vp-mini="ate-100" alt="Capa de carrossel: 5 presentes até R$ 100"></figure>
    </div>
    <span class="selo-pronto">pronto pra postar</span>
    ${estrela("", "left:2%;top:8%;--t2:30px")}${estrela("rosa", "right:6%;bottom:22%;--t2:22px")}${estrela("", "left:10%;bottom:16%;--t2:16px")}
    <div class="vp-pontos">${[0, 1, 2].map(i => `<button type="button" data-vp="${i}" aria-label="Mostrar tela ${i + 1}" class="${i === 0 ? "on" : ""}"></button>`).join("")}<span class="vp-dica" aria-hidden="true">deslize ↔</span></div>
  </div>`;
}
function montarVitrinePop() {
  const vp = $("#vitrine-pop"); if (!vp) return null;
  const cartoes = [...vp.querySelectorAll(".vp-card")];
  vp.querySelectorAll("[data-vp-mini]").forEach(img => capaCat("presentes-por-orcamento", img.dataset.vpMini, 420).then(u => { img.src = u; }));
  let ordem = [0, 1, 2];
  const aplicar = () => { ordem.forEach((c, pos) => cartoes[c].dataset.pos = pos); vp.querySelectorAll("[data-vp]").forEach(b => b.classList.toggle("on", +b.dataset.vp === ordem[0])); };
  const girar = dir => { ordem = dir > 0 ? [ordem[2], ordem[0], ordem[1]] : [ordem[1], ordem[2], ordem[0]]; aplicar(); };
  const ir = i => { let n = 0; while (ordem[0] !== i && n++ < 3) girar(1); };
  // arrastar: a tela da frente acompanha o dedo
  let x0 = null, dx = 0, frente = null;
  vp.addEventListener("pointerdown", e => { if (e.target.closest("button,[data-estrela]")) return; frente = cartoes[ordem[0]]; x0 = e.clientX; dx = 0; frente.classList.add("arrasta"); vp.setPointerCapture(e.pointerId); });
  vp.addEventListener("pointermove", e => { if (x0 == null) return; dx = e.clientX - x0; frente.style.transform = `translate(${dx}px,0) rotate(${-2 + dx / 18}deg)`; });
  const soltar = () => { if (x0 == null) return; frente.classList.remove("arrasta"); frente.style.transform = ""; if (Math.abs(dx) > 50) girar(dx < 0 ? 1 : -1); x0 = null; };
  vp.addEventListener("pointerup", soltar); vp.addEventListener("pointercancel", soltar);
  vp.addEventListener("keydown", e => { if (e.key === "ArrowRight") girar(1); if (e.key === "ArrowLeft") girar(-1); });
  vp.addEventListener("click", e => { const b = e.target.closest("[data-vp]"); if (b) ir(+b.dataset.vp); });
  // a abertura acontece uma vez; depois a pilha fica só como carrossel
  if (vp.classList.contains("abre")) setTimeout(() => vp.classList.remove("abre"), calmo() ? 0 : 2900);
  return { destruir: () => {} };
}
const calmo = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* fitas se desenham quando entram na tela */
function vidaNosDetalhes() {
  const fitas = document.querySelectorAll(".fita-d.desenha:not(.viva)");
  if (calmo() || !("IntersectionObserver" in window)) { fitas.forEach(f => f.classList.add("viva")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("viva"); io.unobserve(e.target); } }), { threshold: 0.4 });
  fitas.forEach(f => io.observe(f));
}

function capaCampanhaHTML(t) {
  return `<a class="camp-card" href="#campanha/${t.id}">
    <span class="camp-capa"><img data-capa-camp="${t.id}" alt="Capa da campanha ${esc(t.nome)}"><span class="selo-pronto">pronto pra postar</span></span>
    <span class="camp-txt"><b>${esc(t.nome)}</b><span>${esc(t.descricao)}</span><span class="camp-rodape"><span class="camp-preco">${aPartir}</span><span class="camp-ir">Ver campanha →</span></span></span>
  </a>`;
}
function viewInicio() {
  const pub = publicoPorId(SITE, estado.publico), temas = temasDoPublico(SITE, estado.publico);
  const prontos = temas.filter(t => t.status === "disponivel"), prep = temas.filter(t => t.status !== "disponivel");
  const demoPub = DEMOS[(prontos[0] || {}).id] || DEMO_HERO;
  return `
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-txt">
        <h1><span class="l">Fim de ano corrido?</span><span class="l">Seu conteúdo</span><em>vem pronto.</em></h1>
      </div>
      ${vitrinePop()}
      <div class="hero-cta">
        <div class="ctas"><a class="btn grande" href="#campanhas">Escolher minha campanha</a></div>
        <p class="lede">Campanhas de Natal para Instagram, ${aPartirMin}. Você troca a foto e publica.</p>
      </div>
    </div>
    ${fita()}
  </section>

  <section class="bloco wrap" id="campanhas" aria-labelledby="camp-t">
    <div class="sec-cab"><h2 id="camp-t">Campanhas prontas ${estrela("", "position:relative;display:inline-block;vertical-align:.1em;--t2:.7em")}</h2><span class="preco-tag">${aPartir}</span></div>
    <div class="publicos" role="tablist" aria-label="Seu negócio">
      ${SITE.publicos.map(p => `<button type="button" role="tab" data-publico="${p.id}" aria-selected="${p.id === estado.publico}">${p.id === "loja" ? "Sou lojista" : "Sou prestadora de serviço"}</button>`).join("")}
    </div>
    <p class="pub-chamada">${esc(pub.chamada)}</p>
    <div class="camp-grade">${prontos.map(capaCampanhaHTML).join("")}</div>
    <p class="prep-t">Em preparação</p>
    <ul class="lista-prep">${prep.map(t => `<li><div><b>${esc(t.nome)}</b>${t.paraQuem ? `<span>Para: ${esc(t.paraQuem)}</span>` : `<span>${esc(t.descricao)}</span>`}${CATALOGO[t.id] ? `<a class="link-modelos" href="#galeria/${t.id}">Ver os ${CATALOGO[t.id].carrosseis.length} carrosséis →</a>` : ""}</div></li>`).join("")}</ul>
    <p class="ver-galeria"><a href="#galeria">Ver a galeria com todos os modelos →</a></p>
    ${verTudo(demoPub, planoPadrao(SITE))}
  </section>
  ${fita("inverte")}
  <section class="gestao" id="gestao" aria-labelledby="gestao-t">
    <div class="wrap">
      <h2 id="gestao-t">Gestão mensal de conteúdo</h2>
      <p class="gestao-txt">Acompanhamento o ano todo, com proposta personalizada para o seu negócio.</p>
      ${(() => { const l = linkContato(SITE.contatoGestao, SITE.mensagemGestao);
        return l ? `<a class="btn grande claro" href="${esc(l)}" target="_blank" rel="noopener" id="btn-gestao">Conversar sobre uma proposta</a>`
                 : `<p class="aviso" id="btn-gestao">O contato para a gestão mensal ainda não foi configurado.</p>`; })()}
    </div>
  </section>`;
}
function montarCapasCampanhas() {
  document.querySelectorAll("[data-capa-camp]").forEach(img => capaCat(img.dataset.capaCamp, null, 540).then(u => { img.src = u; }));
}

/* ---------- campanha ---------- */
function viewCampanha(id) {
  const tema = temaPorId(SITE, id), demo = DEMOS[id];
  if (!tema || tema.status !== "disponivel" || !demo) return `<section class="wrap topo-pag"><h1>Em preparação</h1><p class="lede">Este tema ainda não está pronto.</p><a class="btn" href="#campanhas">Ver campanhas</a></section>`;
  return `
  <section class="wrap camp-top">
    <p class="eyebrow">${tema.publico === "loja" ? "Para lojistas" : "Para prestadoras de serviço"} · ${aPartir}</p>
    <h1>${esc(tema.nome)}</h1>
    <div class="previa" id="previa">
      <div class="prod-mini" role="radiogroup" aria-label="Escolha um produto">${demo.produtos.map((p, i) => `<button type="button" role="radio" class="pm" data-pm="${i}" aria-checked="${i === 0}"><img src="${esc(p.foto)}" alt=""><span><b>${esc(p.nome)}</b><small>${esc(p.preco)}</small></span></button>`).join("")}</div>
      <div class="prev-abas" role="tablist" aria-label="Formato">${[["carrossel", "Carrossel"], ["stories", "Stories"], ["reel", "Reel"]].map(([k, n], i) => `<button type="button" role="tab" data-aba-prev="${k}" aria-selected="${i === 0}">${n}</button>`).join("")}</div>
      <div id="carrossel" data-painel-prev="carrossel"></div>
      <div id="formatos" class="demo" data-painel-prev="formatos" hidden></div>
    </div>
    ${CATALOGO[tema.id] ? `<p class="ver-galeria"><a href="#galeria/${tema.id}">Ver os ${CATALOGO[tema.id].carrosseis.length} carrosséis desta campanha →</a></p>` : ""}
    <div class="acoes"><button type="button" class="btn grande" data-ir-planos><span>Ver planos · ${semQuebra(aPartirMin)}</span></button><a class="btn grande ghost" href="#editar/${tema.id}/${CATALOGO[tema.id] ? CATALOGO[tema.id].previa : ""}">Testar com a minha foto</a></div>
  </section>
  ${fita()}
  ${secaoPlanos(tema)}
  <section class="wrap bloco" id="kit-sec">${verTudo(demo, planoAtual(), { trechos: true, tema })}${conviteGestao()}</section>`;
}
/* troca de plano sem redesenhar a página (mantém carrossel, Reel e Stories onde estão) */
function aplicarPlano(id, foco) {
  const tema = temaPorId(SITE, rota().id), demo = DEMOS[tema.id], p = planoPorId(SITE, id);
  if (!p) return;
  estado.plano = p.id; if (ses) guardado.set("nna-plano", p.id, ses);
  document.querySelectorAll("[data-plano]").forEach(el => { const on = el.dataset.plano === p.id; el.classList.toggle("on", on); el.setAttribute("aria-checked", String(on)); el.tabIndex = on ? 0 : -1; if (on && foco) el.focus(); });
  $("#pl-escolhido").outerHTML = resumoPlano(tema, p);
  $("#pl-botao").innerHTML = botaoComprar(tema, p, "block");
  const kit = $("#kit"), aberto = kit && kit.open;
  if (kit) { kit.outerHTML = verTudo(demo, p, { trechos: true, tema }); if (aberto) $("#kit").open = true; }
  desenharTrechoStory(tema && tema.id);
}

/* ---------- revisão do pedido (modo de testes) ---------- */
function viewPedido(id, planoId) {
  const tema = temaPorId(SITE, id), plano = planoPorId(SITE, planoId), demo = DEMOS[id];
  if (!tema || !plano || !demo || tema.status !== "disponivel") return `<section class="wrap topo-pag"><h1>Pedido indisponível</h1><a class="btn" href="#campanhas">Ver campanhas</a></section>`;
  const c = estadoCompra(tema, plano, SITE), checkout = c.checkout || c.href;
  const extras = plano.nivel >= 2 ? [`Temas extras: ${demo.extras.join(", ")}`] : [];
  const virada = plano.nivel >= 3 ? [`Réveillon: ${demo.reveillon.join(", ")}`] : [];
  return `
  <section class="wrap topo-pag pedido">
    <a class="link voltar" href="#campanha/${tema.id}" data-voltar-planos>← Trocar de plano</a>
    <p class="eyebrow">Revisão do pedido</p>
    <h1>Confira antes de pagar</h1>
    <div class="recibo" data-pedido="${tema.id}/${plano.id}">
      <div class="rc-linha"><span><small>Campanha</small><b>${esc(tema.nome)}</b><small>${tema.publico === "loja" ? "Para lojistas" : "Para prestadoras de serviço"}</small></span></div>
      <div class="rc-linha rc-plano"><span><small>Plano</small><b>${esc(plano.nome)}</b></span><b class="num">${fmtBRL(plano.preco)}</b></div>
      <ul class="rc-itens">${[...entregasDoPlano(plano), ...extras, ...virada].map(a => `<li>${esc(a)}</li>`).join("")}</ul>
      <div class="rc-total"><span>Total</span><b class="num">${fmtBRL(plano.preco)}</b></div>
    </div>
    <p class="aviso-pedido" role="note"><b>Nenhum pagamento foi feito.</b> Esta tela só mostra o pedido. O pagamento acontece no próximo passo e o acesso é liberado depois da confirmação.</p>
    ${checkout ? `<a class="btn grande block" href="${esc(checkout)}" target="_blank" rel="noopener" data-checkout><span>Continuar para o pagamento · <span class="nw">${fmtBRL(plano.preco)}</span></span></a>` : `<p class="aviso">O checkout ainda não foi configurado.</p>`}
  </section>`;
}

/* ---------- editor (teste grátis): abre exatamente a composição escolhida ---------- */
function viewEditar(campId, carrId) {
  const c = CATALOGO[campId], tema = temaPorId(SITE, campId);
  if (!c) return `<section class="wrap topo-pag"><h1>Modelo não encontrado</h1><a class="btn" href="#galeria">Ver a galeria</a></section>`;
  const x = c.carrosseis.find(y => y.id === carrId) || c.carrosseis[0], pronta = tema && tema.status === "disponivel";
  return `
  <section class="wrap topo-pag">
    <a class="link voltar" href="#galeria/${c.id}">← ${esc(COLECOES[c.id].nome)}: todos os carrosséis</a>
    <h1>Teste com a sua foto</h1>
    <p class="lede">Troque fotos, marca ou logo, textos, preços, cores e fontes. Tudo fica salvo neste aparelho.</p>
  </section>
  <section class="wrap" id="estudio" data-camp="${c.id}" data-carr="${x.id}"></section>
  <section class="wrap bloco">
    <div class="acoes">${pronta ? `<a class="btn grande" href="#campanha/${c.id}" data-voltar-planos><span>Ver planos · ${semQuebra(aPartirMin)}</span></a>` : `<p class="aviso">Esta campanha está em preparação: dá para testar os carrosséis, mas a compra abre quando o kit completo (Reels, Stories e calendário) estiver pronto.</p>`}</div>
    <p class="hint">Com fotos de exemplo, as telas saem limpas. Com a sua foto, o teste grátis leva a marca AMOSTRA. No plano comprado, tudo sai sem marca-d'água.</p>
  </section>`;
}

/* ---------- galeria: as capas reais dos 110 carrosséis ---------- */
function viewGaleria(id) {
  const pubs = SITE.publicos.map(p => ({ p, camps: p.temas.map(t => ({ t, c: CATALOGO[t.id] })).filter(x => x.c) }));
  const total = Object.values(CATALOGO).reduce((s, c) => s + c.carrosseis.length, 0);
  return `
  <section class="wrap topo-pag galeria-top">
    <p class="eyebrow">Galeria de modelos</p>
    <h1>${total} carrosséis, <em>10 coleções</em></h1>
    <p class="lede">Cada carrossel tem 4 telas editáveis e legenda própria. Toque numa capa para abrir aquela composição no editor.</p>
    <nav class="gal-nav" aria-label="Campanhas">${pubs.map(({ p, camps }) => `<p class="grupo-t">${p.id === "loja" ? "Lojistas" : "Prestadoras de serviço"}</p><div class="chips">${camps.map(({ t }) => `<a class="chip ${t.id === id ? "on" : ""}" href="#galeria/${t.id}">${esc(t.nome)}</a>`).join("")}</div>`).join("")}</nav>
  </section>
  ${pubs.map(({ camps }) => camps.map(({ t, c }) => {
    const col = COLECOES[c.id], cores = [col.base.fundo, col.base.texto, col.base.destaque, col.base.papel];
    return `<section class="wrap bloco gal-camp" id="gal-${c.id}" aria-labelledby="gt-${c.id}">
      <div class="gal-cab"><div><h2 id="gt-${c.id}" class="sub-t">${esc(t.nome)}</h2>
        <p class="hint">${t.publico === "loja" ? "Para lojistas" : `Para: ${esc(t.paraQuem || "prestadoras de serviço")}`} · ${t.status === "disponivel" ? `<span class="selo ok">À venda</span>` : `<span class="selo prep">Em preparação</span>`}</p></div>
        <span class="ident-cores" aria-hidden="true">${cores.map(h => `<span style="background:${h}"></span>`).join("")}</span></div>
      <p class="gal-ident">${esc(col.identidade)}</p>
      ${GRUPOS.map(([n, g, plano]) => `<p class="grupo-t">${esc(g)} <span class="hint">· ${n === 1 ? plano : `entra no ${plano}`}</span></p>
        <div class="gal-capas">${c.carrosseis.filter(x => x.nivel === n).map(x => `<a class="gal-capa" href="#editar/${c.id}/${x.id}" title="${esc(x.ideia)}"><img data-gal="${c.id}/${x.id}" alt="Capa: ${esc(x.nome)}" width="270" height="338"><span>${esc(x.nome)}</span></a>`).join("")}</div>`).join("")}
    </section>`;
  }).join("")).join("")}`;
}
function montarGaleria(id) {
  const imgs = [...document.querySelectorAll("[data-gal]")];
  const carregar = img => { const [c, x] = img.dataset.gal.split("/"); capaCat(c, x, 360).then(u => { img.src = u; }); };
  if (!("IntersectionObserver" in window)) { imgs.forEach(carregar); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); carregar(e.target); } }), { rootMargin: "400px 0px" });
  imgs.forEach(i => io.observe(i));
  montados.push({ destruir: () => io.disconnect() });
}

/* ---------- área da cliente ----------
   Rotas: #area (calendário), #area/carrosseis[/<id>], #area/reels[/<id>], #area/stories[/<id>],
          #area/calendario, #area/mensagens[/<id>]. O calendário abre cada material pelo atalho. */
const TOKEN_K = "nna-acesso";
const ABAS_AREA = [["calendario", "Calendário"], ["carrosseis", "Carrosséis"], ["reels", "Reels"], ["stories", "Stories"]];
const FMT = { carrossel: ["Carrossel", "carrosseis"], reel: ["Reel", "reels"], stories: ["Stories", "stories"], whatsapp: ["WhatsApp", "mensagens"] };
const grupoDoNivel = n => (GRUPOS.find(([k]) => k === n) || [, ""])[1];
/* nome exato de uma peça do kit (o calendário nunca guarda o nome, só a referência) */
function pecaDoKit(c, f, ref) {
  if (f === "carrossel") { const x = CATALOGO[c.id] && CATALOGO[c.id].carrosseis.find(y => y.id === ref); return x && { nome: x.nome, nivel: x.nivel }; }
  const lista = f === "reel" ? c.reels : f === "stories" ? c.stories : c.whatsapp;
  const x = lista.find(y => y.id === ref); return x && { nome: x.nome || x.titulo, nivel: x.nivel || 1 };
}
const atalho = (f, ref) => `#area/${FMT[f][1]}/${ref}`;
/* o Reel e os Stories que acompanham um carrossel */
function pecasDoTema(c, carrId) {
  const r = c.reels.find(x => x.carrossel === carrId), st = c.stories.find(x => x.carrossel === carrId);
  return [r && `<a class="chip" href="${atalho("reel", r.id)}">Reel · ${esc(r.nome)}</a>`, st && `<a class="chip" href="${atalho("stories", st.id)}">Stories · ${esc(st.nome)}</a>`].filter(Boolean).join("");
}
const copiar = (id, txt, rot = "Copiar", ok = "Texto copiado.") => `<div class="copiavel ${String(txt).length > 90 ? "longo" : ""}"><p id="${id}">${marc(txt).replace(/\n/g, "<br>")}</p><button type="button" class="btn ghost sm" data-copiar="${id}" data-ok="${esc(ok)}">${esc(rot)}</button></div>`;

function viewReel(c, r) {
  const carr = CATALOGO[c.id].carrosseis.find(x => x.id === r.carrossel);
  return `<article class="reel" data-reel="${r.id}">
    <header class="reel-cab"><p class="eyebrow">${esc(grupoDoNivel(r.nivel))} · ${esc(r.duracao)}</p><h2>${marc(r.nome)}</h2><p class="lede">${marc(r.ideia)}</p>
      <p class="aviso-reel">Roteiro para você gravar no celular. Não é um vídeo pronto.</p></header>
    <div class="reel-grade">
      <section class="reel-sec gravar" aria-label="Para gravar"><h3>Para gravar</h3>
        <p class="prep"><b>Separe antes:</b> ${marc(r.preparar)}</p>
        <ol class="cenas">
          <li><span class="n">Abertura</span>${marc(r.abertura.filmar)}</li>
          ${r.cenas.map((x, i) => `<li><span class="n">Cena ${i + 1}</span>${marc(x.filmar)}</li>`).join("")}
          <li><span class="n">Final</span>${marc(r.final.filmar)}</li>
        </ol>
        <div class="sem-aparecer"><b>Sem aparecer</b><p>${marc(r.semAparecer)}</p></div>
      </section>
      <section class="reel-sec copiar" aria-label="Para copiar"><h3>Para copiar</h3>
        <p class="hint">Frase de abertura (fale ou escreva na tela):</p>${copiar(`${r.id}-ab`, r.abertura.fala)}
        <p class="hint">Texto na tela, cena por cena:</p>
        <ol class="textos">${r.cenas.map((x, i) => `<li>${copiar(`${r.id}-t${i}`, x.texto)}</li>`).join("")}</ol>
        <p class="hint">Chamada final:</p>${copiar(`${r.id}-fim`, r.final.texto)}
        <p class="hint">Legenda:</p>${copiar(`${r.id}-leg`, r.legenda, "Copiar legenda", "Legenda copiada.")}
      </section>
    </div>
    ${carr ? `<p class="hint">Use as mesmas fotos e produtos do carrossel <a href="${atalho("carrossel", carr.id)}">${esc(carr.nome)}</a>.</p>` : ""}
  </article>`;
}
function listaSelect(rot, attr, itens, atual) {
  const grupos = [...new Set(itens.map(x => x.nivel))];
  return `<label class="campo es-sel"><span>${esc(rot)}</span><select ${attr}>${grupos.map(n => `<optgroup label="${esc(grupoDoNivel(n))}">${itens.filter(x => x.nivel === n).map(x => `<option value="${x.id}" ${x.id === atual ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}</optgroup>`).join("")}</select></label>`;
}
/* coluna ao lado das telas de Stories: onde entra a foto e o adesivo de cada tela */
function notasStories(seq) {
  return `<h3>Como publicar</h3><ol class="st-notas">${seq.telas.map((t, i) => {
    const a = t.nota && t.nota.adesivo, id = `${seq.id}-n${i}`;
    return `<li><span class="n">Tela ${i + 1}</span><p><b>Foto:</b> ${marc(t.nota ? t.nota.foto : "")}</p>${a ? `<div class="adesivo"><b>Adesivo: ${esc(a.tipo)}</b> <span class="hint">coloque no Instagram, no espaço com a seta</span>
      ${a.pergunta ? copiar(`${id}-p`, a.pergunta, "Copiar pergunta") : ""}${a.respostas ? `<div class="resp">${a.respostas.map((x, k) => copiar(`${id}-r${k}`, x, `Copiar resposta ${k + 1}`)).join("")}</div>` : ""}${a.texto ? `<p class="hint">${marc(a.texto)}</p>` : ""}</div>` : ""}</li>`; }).join("")}</ol>
    <p class="hint">Baixe as 3 telas, publique na ordem e acrescente os adesivos no próprio Instagram.</p>`;
}
function viewCalendario(c) {
  const cals = calendariosDoConteudo(c);
  if (!cals.some(([k]) => k === estado.cal)) estado.cal = cals[0][0];
  return `<div class="chips" role="tablist" aria-label="Calendário">${cals.map(([k, nn]) => `<button type="button" role="tab" class="chip ${k === estado.cal ? "on" : ""}" data-cal="${k}" aria-selected="${k === estado.cal}">${nn}</button>`).join("")}</div>
    ${cals.map(([k, , dias]) => `<ol class="cal" data-calv="${k}" ${k === estado.cal ? "" : "hidden"}>${dias.map(d => `<li><span class="dia">Dia ${d.dia}</span><ul>${d.itens.map(it => {
      const p = pecaDoKit(c, it.f, it.ref) || { nome: it.ref };
      return `<li class="cal-item"><span class="tipo t-${it.f}">${FMT[it.f][0]}</span><b class="cal-nome">${marc(p.nome)}</b><span class="prep">Preparar: ${marc(it.preparar)}</span><a class="btn sm ghost cal-abrir" href="${atalho(it.f, it.ref)}" data-atalho="${it.f}:${it.ref}">Abrir</a></li>`; }).join("")}</ul></li>`).join("")}</ol>`).join("")}
    <p class="hint">${esc(c.calendario.dica)}</p>`;
}
function viewMensagens(c, alvo) {
  return `<h2 class="sec-t">Mensagens de WhatsApp</h2><div class="msgs">${c.whatsapp.map(m => `<article class="msg ${m.id === alvo ? "alvo" : ""}" id="msg-${m.id}"><b>${esc(m.titulo)}</b><span class="hint">${esc(m.quando)}</span>${copiar(`wa-${m.id}`, m.texto, "Copiar mensagem", "Mensagem copiada.")}</article>`).join("")}</div>
    <h2 class="sec-t">Tutorial</h2><ol class="passos">${c.tutorial.map(p => `<li><b>${esc(p.titulo)}</b><span>${marc(p.texto)}</span></li>`).join("")}</ol>`;
}
function viewArea(aba, item) {
  const a = estado.area;
  if (!guardado.get(TOKEN_K, "")) return `
    <section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Sua campanha fica aqui</h1>
      <p class="lede">Depois da confirmação do pagamento, você recebe um link de acesso. Abra o link neste aparelho.</p>
      <div class="acoes"><a class="btn grande ghost" href="#campanhas">Ver as campanhas</a></div></section>`;
  if (!a || a.carregando) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Abrindo sua campanha…</h1></section>`;
  if (a.erro) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Não foi possível abrir</h1><p class="lede">${esc(a.erro)}</p>
      <button type="button" class="btn ghost" data-sair>Remover acesso deste aparelho</button></section>`;
  const c = a.campanha, plano = a.plano, carrs = carrosseisDoNivel(c.id, plano.nivel);
  const k = ABAS_AREA.some(([x]) => x === aba) || aba === "mensagens" ? aba : "calendario";
  let corpo = "";
  if (k === "calendario") corpo = viewCalendario(c);
  else if (k === "carrosseis") corpo = `<div id="estudio-kit"></div><div class="do-tema" id="do-tema"></div>`;
  else if (k === "reels") { const r = c.reels.find(x => x.id === item) || c.reels[0]; corpo = `${listaSelect("Roteiro de Reel", "data-ir-reel", c.reels, r.id)}${viewReel(c, r)}`; }
  else if (k === "stories") corpo = `<div id="estudio-stories"></div><div class="do-tema" id="do-tema"></div>`;
  else corpo = viewMensagens(c, item);
  const cals = calendariosDoConteudo(c).filter(([x]) => x !== "expressa").map(([, , d]) => d.length);
  return `
  <section class="wrap topo-pag area-topo">
    <p class="eyebrow">Área da cliente · ${esc(plano.nome)} · acesso até ${new Date(a.acesso.expira).toLocaleDateString("pt-BR")}</p>
    <h1>${esc(c.nome)}</h1>
    <p class="hint" data-totais>${carrs.length} carrosséis · ${c.reels.length} roteiros de Reels · ${c.stories.length} sequências de Stories · calendário de ${cals.join(" + ")} dias (e a versão expressa de 3). Tudo sai sem marca-d'água.</p>
    <nav class="area-abas" aria-label="Materiais do kit">${ABAS_AREA.map(([x, n]) => `<a href="#area/${x}" class="${x === k ? "on" : ""}" ${x === k ? 'aria-current="page"' : ""}>${n}</a>`).join("")}<a href="#area/mensagens" class="mais ${k === "mensagens" ? "on" : ""}">Mensagens e tutorial</a></nav>
  </section>
  <section class="wrap bloco area-corpo" data-aba="${k}">${corpo}</section>
  <section class="wrap bloco"><p><button type="button" class="link" data-sair>Remover acesso deste aparelho</button></p></section>`;
}
async function carregarArea() {
  const token = guardado.get(TOKEN_K, "");
  if (!token) return;
  estado.area = { carregando: true };
  try {
    const r = await fetch("/api/campanha", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    estado.area = r.ok ? { acesso: d.acesso, plano: d.plano, campanha: d.campanha } : { erro: d.erro || "Acesso inválido ou expirado." };
  } catch { estado.area = { erro: "Sem conexão. Tente de novo em instantes." }; }
  if (rota().tela === "area") render(false);
}
/* troca o item na URL sem remontar a tela (o editor já trocou sozinho) */
function marcarItemArea(aba, id) { const h = `#area/${aba}/${id}`; if (location.hash !== h) { history.replaceState(null, "", h); telaAtual = "area" + aba + id; } }
function montarArea(aba, item) {
  const c = estado.area.campanha, plano = estado.area.plano;
  if (!CATALOGO[c.id]) return;
  const tema = $("#do-tema");
  if (aba === "carrosseis") {
    const ini = carrosseisDoNivel(c.id, plano.nivel).some(x => x.id === item) ? item : estado.carrArea;
    montados.push(montarEstudio($("#estudio-kit"), { campanha: c.id, carrossel: ini, modo: "kit", nivel: plano.nivel, toast,
      aoTrocar: id => { estado.carrArea = id; marcarItemArea("carrosseis", id); const h = pecasDoTema(c, id); tema.innerHTML = h ? `<p class="hint">Do mesmo tema:</p><div class="chips">${h}</div>` : ""; } }));
  }
  if (aba === "stories") {
    montados.push(montarEstudio($("#estudio-stories"), { campanha: c.id, carrossel: item, modo: "kit", nivel: plano.nivel, toast, tipo: "stories", pecas: c.stories, lateral: notasStories,
      aoTrocar: id => { marcarItemArea("stories", id); const st = c.stories.find(x => x.id === id), carr = st && CATALOGO[c.id].carrosseis.find(x => x.id === st.carrossel), r = st && c.reels.find(x => x.carrossel === st.carrossel);
        tema.innerHTML = `<p class="hint">Do mesmo tema:</p><div class="chips">${carr ? `<a class="chip" href="${atalho("carrossel", carr.id)}">Carrossel · ${esc(carr.nome)}</a>` : ""}${r ? `<a class="chip" href="${atalho("reel", r.id)}">Reel · ${esc(r.nome)}</a>` : ""}</div>`; } }));
  }
  if (aba === "mensagens" && item) requestAnimationFrame(() => document.getElementById(`msg-${item}`)?.scrollIntoView({ block: "center" }));
}

/* ---------- rotas ---------- */
function rota() {
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.startsWith("acesso=")) return { tela: "acesso", token: h.slice(7) };
  if (h.startsWith("campanha/")) return { tela: "campanha", id: h.slice(9) };
  if (h.startsWith("pedido/")) { const [id, plano] = h.slice(7).split("/"); return { tela: "pedido", id, plano: plano || planoPadrao(SITE).id }; }
  if (h.startsWith("editar/")) { const [, id, carr] = h.split("/"); return { tela: "editar", id, carr: carr || "" }; }
  if (h.startsWith("testar") || h === "experimentar") { const id = h.split("/")[1] || (campanhaDoPublico(estado.publico) || {}).id || "presentes-por-orcamento"; const c = CATALOGO[id]; return { tela: "editar", id: c ? id : "presentes-por-orcamento", carr: c ? c.previa : "" }; }
  if (h === "area" || h.startsWith("area/")) { const [, aba = "", item = ""] = h.split("/"); return { tela: "area", id: aba, carr: item }; }
  if (h === "galeria" || h.startsWith("galeria/")) return { tela: "galeria", id: h.split("/")[1] || "" };
  if (h === "demo") return { tela: "campanha", id: "presentes-por-orcamento" };
  if (["campanhas", "gestao", "dentro"].includes(h)) return { tela: "inicio", ancora: h };
  return { tela: "inicio" };
}
let telaAtual = null;
function render(rolar = true) {
  const r = rota(), app = $("#app");
  if (r.tela === "acesso") { guardado.set(TOKEN_K, r.token); estado.area = null; estado.carrArea = null; history.replaceState(null, "", "#area"); return render(); }
  if (r.tela === "area" && !estado.area && guardado.get(TOKEN_K, "")) carregarArea();
  if (r.tela === "pedido" && planoPorId(SITE, r.plano)) { estado.plano = r.plano; if (ses) guardado.set("nna-plano", r.plano, ses); }
  const chave = r.tela + (r.id || "") + (r.plano || "") + (r.carr || ""), mesma = telaAtual === chave;
  if (!mesma || !rolar) {
    montados.forEach(m => m && m.destruir && m.destruir()); montados = [];
    app.innerHTML = r.tela === "campanha" ? viewCampanha(r.id) : r.tela === "pedido" ? viewPedido(r.id, r.plano) : r.tela === "editar" ? viewEditar(r.id, r.carr) : r.tela === "area" ? viewArea(r.id, r.carr) : r.tela === "galeria" ? viewGaleria(r.id) : viewInicio();
    if (r.tela === "galeria") montarGaleria(r.id);
    if (r.tela === "inicio") { montados.push(montarVitrinePop()); montarCapasCampanhas(); animou = true; } // a abertura acontece uma vez por visita
    vidaNosDetalhes();
    if (r.tela === "campanha" && $("#carrossel")) {
      const demo = DEMOS[r.id], cat = CATALOGO[r.id], pv = cat && (cat.carrosseis.find(x => x.id === cat.previa) || cat.carrosseis[0]); let fmts = null;
      const marcarPm = i => document.querySelectorAll("[data-pm]").forEach(b => { const on = +b.dataset.pm === i; b.setAttribute("aria-checked", String(on)); b.classList.toggle("on", on); });
      const car = montarCarrossel($("#carrossel"), demo, { aoMudar: i => { marcarPm(i); fmts && fmts.escolher(i); }, telas: pv ? pv.telas.map((t, i) => telaCat(r.id, pv, i)) : undefined, marca: pv ? marcaExemplo(r.id, pv) : undefined });
      fmts = montarFormatos($("#formatos"), demo, { semControles: true, aoMudar: i => { marcarPm(i); car.irParaProduto(i); } });
      estado.previa = { car, fmts, marcarPm };
      montados.push(car, fmts);
      preencherCapas(temaPorId(SITE, r.id));
      desenharTrechoStory(r.id);
    }
    if (r.tela === "editar" && $("#estudio")) {
      const box = $("#estudio");
      montados.push(montarEstudio(box, { campanha: box.dataset.camp, carrossel: box.dataset.carr, modo: "teste", nivel: 3, toast,
        aoTrocar: id => { const h = `#editar/${box.dataset.camp}/${id}`; if (location.hash !== h) { history.replaceState(null, "", h); telaAtual = "editar" + box.dataset.camp + id; } } }));
    }
    if (r.tela === "area" && estado.area && estado.area.campanha) montarArea(r.id || "calendario", r.carr);
  }
  telaAtual = chave;
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", (a.getAttribute("href") === "#campanhas" && (r.ancora === "campanhas" || r.tela === "campanha")) || (a.getAttribute("href") === "#gestao" && r.ancora === "gestao") || (a.getAttribute("href") === "#galeria" && (r.tela === "galeria" || r.tela === "editar"))));
  if (!rolar) return;
  const suave = mesma && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";
  if (r.tela === "galeria" && r.id && document.getElementById(`gal-${r.id}`)) { requestAnimationFrame(() => document.getElementById(`gal-${r.id}`).scrollIntoView({ behavior: "auto" })); return; }
  if (r.tela === "campanha" && estado.rolarPlanos) { estado.rolarPlanos = false; requestAnimationFrame(() => $("#planos")?.scrollIntoView({ behavior: "auto" })); }
  else if (r.ancora) requestAnimationFrame(() => document.getElementById(r.ancora)?.scrollIntoView({ behavior: suave }));
  else scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const manter = fn => { const y = scrollY; fn(); render(false); scrollTo(0, y); };
  const est = e.target.closest("[data-estrela]");
  if (est) { est.classList.remove("gira"); void est.getBoundingClientRect(); est.classList.add("gira"); setTimeout(() => est.classList.remove("gira"), 600); return; }
  const pm = e.target.closest("[data-pm]");
  if (pm && estado.previa) {
    const i = +pm.dataset.pm, pv = estado.previa;
    pv.marcarPm(i); pv.fmts.escolher(i); pv.car.irParaProduto(i);
    const tela = document.querySelectorAll("#carrossel .car-item")[i + 1]; if (tela && !calmo()) { tela.classList.remove("pulso"); void tela.offsetWidth; tela.classList.add("pulso"); }
    return;
  }
  const ab = e.target.closest("[data-aba-prev]");
  if (ab && estado.previa) {
    const f = ab.dataset.abaPrev;
    document.querySelectorAll("[data-aba-prev]").forEach(b => b.setAttribute("aria-selected", String(b === ab)));
    $("#carrossel").hidden = f !== "carrossel"; $("#formatos").hidden = f === "carrossel";
    if (f === "carrossel") estado.previa.fmts.destruir(); else estado.previa.fmts.mostrar(f);
    return;
  }
  if (e.target.closest("[data-capa-link]")) return; // capa do plano abre a composição no editor
  const pl = e.target.closest("[data-plano]");
  if (pl) { aplicarPlano(pl.dataset.plano); return; }
  if (e.target.closest("[data-ir-planos]")) { $("#planos")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); return; }
  if (e.target.closest("[data-voltar-planos]")) estado.rolarPlanos = true;
  const pb = e.target.closest("[data-publico]");
  if (pb) { manter(() => { estado.publico = pb.dataset.publico; guardado.set("nna-publico", estado.publico); }); return; }
  const cl = e.target.closest("[data-cal]");
  if (cl) {
    estado.cal = cl.dataset.cal;
    document.querySelectorAll("[data-cal]").forEach(b => { const on = b.dataset.cal === estado.cal; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); });
    document.querySelectorAll("[data-calv]").forEach(l => l.hidden = l.dataset.calv !== estado.cal);
    return;
  }
  const cp = e.target.closest("[data-copiar]");
  if (cp) { navigator.clipboard.writeText(document.getElementById(cp.dataset.copiar).innerText).then(() => toast(cp.dataset.ok || "Texto copiado."), () => toast("Selecione o texto e copie.")); return; }
  if (e.target.closest("[data-sair]")) { guardado.set(TOKEN_K, null); estado.area = null; render(false); toast("Acesso removido deste aparelho."); return; }
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute("href") === location.hash) { e.preventDefault(); render(); }
});
/* planos: teclado (setas e espaço/enter), como um grupo de opções */
document.addEventListener("keydown", e => {
  const pl = e.target.closest && e.target.closest("[data-plano]");
  if (!pl) return;
  const ids = SITE.planos.map(p => p.id), i = ids.indexOf(pl.dataset.plano);
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); aplicarPlano(pl.dataset.plano, true); }
  if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); const d = /Right|Down/.test(e.key) ? 1 : -1; aplicarPlano(ids[(i + d + ids.length) % ids.length], true); }
});
addEventListener("hashchange", () => render());
if (document.fonts) document.fonts.ready.then(() => document.documentElement.classList.add("fontes-ok"));
render();
/* área: escolher outro roteiro de Reel */
document.addEventListener("change", e => {
  const s = e.target.closest && e.target.closest("[data-ir-reel]");
  if (s) location.hash = `#area/reels/${s.value}`;
});
