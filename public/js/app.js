import { SITE } from "../config.js";
import { DEMOS } from "../amostra/index.js";
import {
  fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato,
  planoPorId, planoPadrao, pecasDoPlano, entregasDoPlano
} from "./logic.js";
import { montarEstudio } from "./estudio-editor.js";
import { montarCarrossel, montarFormatos } from "./demo.js";
import { CATALOGO, GRUPOS, COLECOES, carrosseisDoNivel, estiloOriginal, marcaExemplo } from "../catalogo/index.js";
import { miniatura } from "./render.js";

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
      ${trechos ? `<h3 class="trechos-t">Um pedaço do conteúdo</h3><div class="trechos">
        <article class="trecho"><span class="eyebrow">Legenda</span><p>${multi(t.legenda)}</p></article>
        <article class="trecho"><span class="eyebrow">Roteiro de Reel</span><p><b>Abertura:</b> ${marc(t.roteiro.abertura)}</p><p><b>Cena 1:</b> ${marc(t.roteiro.cena)}</p><p class="hint">${esc(t.roteiro.resto)}</p></article>
        <article class="trecho"><span class="eyebrow">Calendário</span><ul>${t.calendario.map(d => `<li><b>Dia ${d.dia}</b> ${marc(d.peca)}</li>`).join("")}</ul><p class="hint">${esc(t.calendarioResto)}</p></article>
      </div>` : ""}
      <ol class="passos"><li><b>Escolha o plano</b><span>Compra única, ${aPartirMin}.</span></li><li><b>Receba o link de acesso</b><span>A campanha fica na sua área.</span></li><li><b>Troque fotos, preços e a marca</b><span>No celular, direto no site.</span></li><li><b>Baixe e publique</b><span>Seguindo o calendário.</span></li></ol>
      ${tema ? botaoComprar(tema, plano, "block kit-comprar") : `<a class="btn grande block kit-comprar" href="#campanhas">Escolher minha campanha</a>`}
    </div></details>`;
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

/* ---------- área da cliente ---------- */
const TOKEN_K = "nna-acesso";
/* conteúdo pago que acompanha o carrossel (Reel e Stories do mesmo tema, pela posição no plano) */
function temaPagoDoCarrossel(c, campId, carrId) {
  const x = CATALOGO[campId] && CATALOGO[campId].carrosseis.find(y => y.id === carrId); if (!x) return null;
  const i = CATALOGO[campId].carrosseis.filter(y => y.nivel === x.nivel).indexOf(x);
  return (x.nivel === 1 ? c.temas : x.nivel === 2 ? c.extras : c.reveillon && c.reveillon.temas || [])[i] || null;
}
function detalhesPagos(t) {
  if (!t) return "";
  return `<details class="kit-det" open><summary>Roteiro de Reel · ${marc(t.reel.nome)}</summary><div class="kit-det-corpo">
      <p class="aviso-reel">Roteiro para você gravar (${esc(t.reel.duracao)}). Não é um vídeo pronto.</p>
      <dl class="roteiro">
        <dt>Abertura</dt><dd>${marc(t.reel.abertura)}</dd>
        <dt>Cenas</dt><dd><ol>${t.reel.cenas.map(s => `<li>${marc(s.filmar)}<br><span class="tt">Texto na tela: “${marc(s.texto)}”</span></li>`).join("")}</ol></dd>
        <dt>Legenda</dt><dd>${marc(t.reel.legenda)}</dd><dt>Chamada final</dt><dd>${marc(t.reel.chamadaFinal)}</dd><dt>Sem aparecer</dt><dd>${marc(t.reel.semAparecer)}</dd>
      </dl></div></details>
    ${t.stories ? `<details class="kit-det"><summary>Stories · ${marc(t.stories.nome)}</summary><div class="kit-det-corpo">
      <ol class="stories-txt">${t.stories.telas.map((s, i) => `<li><span class="n">Tela ${i + 1}</span><b>${marc(s.texto)}</b><span>Mostre: ${marc(s.mostrar)}</span><small>${marc(s.recurso)}</small></li>`).join("")}</ol></div></details>` : ""}`;
}
function viewArea() {
  const a = estado.area;
  if (!guardado.get(TOKEN_K, "")) return `
    <section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Sua campanha fica aqui</h1>
      <p class="lede">Depois da confirmação do pagamento, você recebe um link de acesso. Abra o link neste aparelho.</p>
      <div class="acoes"><a class="btn grande ghost" href="#campanhas">Ver as campanhas</a></div></section>`;
  if (!a || a.carregando) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Abrindo sua campanha…</h1></section>`;
  if (a.erro) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Não foi possível abrir</h1><p class="lede">${esc(a.erro)}</p>
      <button type="button" class="btn ghost" data-sair>Remover acesso deste aparelho</button></section>`;
  const c = a.campanha, plano = a.plano, n = carrosseisDoNivel(c.id, plano.nivel).length;
  const cals = [["dez", "10 dias", c.calendario.dez], ["quinze", "15 dias", c.calendario.quinze], ["expressa", "Expressa: 3 dias", c.calendario.expressa], ["reveillon", "Réveillon: 5 dias", c.reveillon && c.reveillon.calendario]]
    .filter(([k, , v]) => v && !(k === "dez" && c.calendario.quinze));
  if (!cals.some(([k]) => k === estado.cal)) estado.cal = cals[0][0];
  return `
  <section class="wrap topo-pag">
    <p class="eyebrow">Área da cliente · ${esc(plano.nome)} · acesso até ${new Date(a.acesso.expira).toLocaleDateString("pt-BR")}</p>
    <h1>${esc(c.nome)}</h1>
    <p class="hint">${n} carrosséis, ${plano.roteiros} roteiros de Reels e ${plano.stories} sequências de Stories liberados. Tudo sai sem marca-d'água.</p>
  </section>
  <section class="wrap bloco" aria-label="Carrosséis"><div id="estudio-kit"></div></section>
  <section class="wrap bloco">
    <div id="pagos-do-tema">${detalhesPagos(temaPagoDoCarrossel(c, c.id, estado.carrArea))}</div>
    <details class="kit-det"><summary>3 mensagens de WhatsApp</summary><div class="kit-det-corpo">
      <div class="msgs">${c.whatsapp.map((m, i) => `<article class="msg"><b>${esc(m.titulo)}</b><span class="hint">${esc(m.quando)}</span><p id="wa${i}">${marc(m.texto)}</p><button type="button" class="btn ghost sm" data-copiar="wa${i}">Copiar mensagem</button></article>`).join("")}</div></div></details>
    <details class="kit-det"><summary>Calendário</summary><div class="kit-det-corpo">
      <div class="chips" role="tablist" aria-label="Calendário">${cals.map(([k, nn]) => `<button type="button" role="tab" class="chip ${k === estado.cal ? "on" : ""}" data-cal="${k}" aria-selected="${k === estado.cal}">${nn}</button>`).join("")}</div>
      ${cals.map(([k, , dias]) => `<ol class="cal" data-calv="${k}" ${k === estado.cal ? "" : "hidden"}>${dias.map(d => `<li><span class="dia">Dia ${d.dia}</span><ul>${d.pecas.map(p => { const [tipo, ...nome] = p.split(": "); return `<li><span class="tipo">${esc(tipo)}</span> ${marc(nome.join(": "))}</li>`; }).join("")}</ul></li>`).join("")}</ol>`).join("")}
      <p class="hint">${esc(c.calendario.dica)}</p></div></details>
    <details class="kit-det"><summary>Tutorial</summary><div class="kit-det-corpo">
      <ol class="passos">${c.tutorial.map(p => `<li><b>${esc(p.titulo)}</b><span>${marc(p.texto)}</span></li>`).join("")}</ol></div></details>
    <p><button type="button" class="link" data-sair>Remover acesso deste aparelho</button></p>
  </section>`;
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
function montarEstudioDaArea() {
  const c = estado.area.campanha, plano = estado.area.plano;
  if (!CATALOGO[c.id]) return;
  montados.push(montarEstudio($("#estudio-kit"), { campanha: c.id, carrossel: estado.carrArea, modo: "kit", nivel: plano.nivel, toast,
    aoTrocar: id => { estado.carrArea = id; const box = $("#pagos-do-tema"); if (box) box.innerHTML = detalhesPagos(temaPagoDoCarrossel(c, c.id, id)); } }));
}

/* ---------- rotas ---------- */
function rota() {
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.startsWith("acesso=")) return { tela: "acesso", token: h.slice(7) };
  if (h.startsWith("campanha/")) return { tela: "campanha", id: h.slice(9) };
  if (h.startsWith("pedido/")) { const [id, plano] = h.slice(7).split("/"); return { tela: "pedido", id, plano: plano || planoPadrao(SITE).id }; }
  if (h.startsWith("editar/")) { const [, id, carr] = h.split("/"); return { tela: "editar", id, carr: carr || "" }; }
  if (h.startsWith("testar") || h === "experimentar") { const id = h.split("/")[1] || (campanhaDoPublico(estado.publico) || {}).id || "presentes-por-orcamento"; const c = CATALOGO[id]; return { tela: "editar", id: c ? id : "presentes-por-orcamento", carr: c ? c.previa : "" }; }
  if (h === "area") return { tela: "area" };
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
    app.innerHTML = r.tela === "campanha" ? viewCampanha(r.id) : r.tela === "pedido" ? viewPedido(r.id, r.plano) : r.tela === "editar" ? viewEditar(r.id, r.carr) : r.tela === "area" ? viewArea() : r.tela === "galeria" ? viewGaleria(r.id) : viewInicio();
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
    }
    if (r.tela === "editar" && $("#estudio")) {
      const box = $("#estudio");
      montados.push(montarEstudio(box, { campanha: box.dataset.camp, carrossel: box.dataset.carr, modo: "teste", nivel: 3, toast,
        aoTrocar: id => { const h = `#editar/${box.dataset.camp}/${id}`; if (location.hash !== h) { history.replaceState(null, "", h); telaAtual = "editar" + box.dataset.camp + id; } } }));
    }
    if (r.tela === "area" && estado.area && estado.area.campanha) montarEstudioDaArea();
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
  if (cp) { navigator.clipboard.writeText(document.getElementById(cp.dataset.copiar).innerText).then(() => toast("Mensagem copiada."), () => toast("Selecione o texto e copie.")); return; }
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
