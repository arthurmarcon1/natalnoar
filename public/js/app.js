import { SITE } from "../config.js";
import { DEMOS } from "../amostra/index.js";
import {
  fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato,
  planoPorId, planoPadrao, pecasDoPlano, entregasDoPlano, calendariosDoConteudo
} from "./logic.js";
import { montarEstudio } from "./estudio-editor.js";
import { montarCarrossel, montarFormatos } from "./demo.js";
import { CATALOGO, GRUPOS, COLECOES, carrosseisDoNivel, estiloOriginal, marcaExemplo, legendaPreenchida } from "../catalogo/index.js";
import { miniatura, desenharExemplo, fotoDeArquivo, carregarFontes } from "./render.js";
import { desenharEstudio, carregarPar } from "./estudio.js";

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
let montados = [];

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

const calmo = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/* fitas se desenham quando entram na tela */
function vidaNosDetalhes() {
  const fitas = document.querySelectorAll(".fita-d.desenha:not(.viva)");
  if (calmo() || !("IntersectionObserver" in window)) { fitas.forEach(f => f.classList.add("viva")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("viva"); io.unobserve(e.target); } }), { threshold: 0.4 });
  fitas.forEach(f => io.observe(f));
}

/* ---------- página inicial ----------
   A visitante escolhe o segmento, vê o carrossel do dia 1 da coleção num celular (desenhado pelo
   mesmo motor do editor), folheia com o dedo e digita o nome da marca, que entra na arte na hora.
   Nada é enviado: o nome fica só nesta aba (sessionStorage). */
const NOME_K = "nna-nome-teste";
const segCampanha = seg => campanhaDoPublico(seg) || campanhaDoPublico("loja");
const ab = seg => DEMOS[segCampanha(seg).id].abertura;
const carrDoCat = (campId, id) => CATALOGO[campId].carrosseis.find(x => x.id === id);
function viewInicio() {
  const seg = estado.publico, a = ab(seg), nome = guardado.get(NOME_K, "", ses || undefined);
  const vendas = SITE.publicos.map(p => campanhaDoPublico(p.id)).filter(Boolean);
  const outras = Object.keys(CATALOGO).filter(id => !vendas.some(t => t.id === id));
  return `
  <section class="ab" data-seg="${seg}">
    ${[["6%", "14%", "16px"], ["46%", "7%", "11px"], ["93%", "12%", "20px"], ["88%", "78%", "13px"], ["4%", "70%", "12px"], ["52%", "92%", "15px"]].map(([l, t, e]) => `<span class="ab-estrela" aria-hidden="true" style="left:${l};top:${t};--e:${e}">✦</span>`).join("")}
    <div class="wrap ab-in">
      <div class="ab-txt">
        <h1 class="ab-h1"><span class="ab-pre">Fim de ano corrido?</span><span class="ab-big">Seu conteúdo <span class="ab-vp"><em>vem pronto.</em><svg class="ab-volta" aria-hidden="true"><path class="ab-traco"/><circle class="ab-ponto" r="6"/></svg></span></span></h1>
        <div class="seg" role="radiogroup" aria-label="Seu negócio">
          ${SITE.publicos.map(p => `<button type="button" role="radio" data-seg="${p.id}" aria-checked="${p.id === seg}">${p.id === "loja" ? "Tenho uma loja" : "Presto serviços"}</button>`).join("")}
        </div>
      </div>
      <div class="ab-deck">
        <div class="ab-pilha" id="ab-pilha" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Capas da coleção. Deslize para folhear.">
          ${[0, 1, 2].map(i => `<figure class="ab-capa" data-i="${i}" data-pos="${i}"><canvas width="1080" height="1350" role="img"></canvas></figure>`).join("")}
        </div>
        <div class="ab-pe">
          <button type="button" class="ab-seta" data-ab-ir="-1" aria-label="Capa anterior">‹</button>
          <span class="ab-pontos" aria-hidden="true">${[0, 1, 2].map(i => `<i data-ab-p="${i}"></i>`).join("")}</span>
          <button type="button" class="ab-seta" data-ab-ir="1" aria-label="Próxima capa">›</button>
        </div>
      </div>
      <div class="ab-acoes">
        <label for="nome-marca">Nome da sua marca</label>
        <input id="nome-marca" data-nome-marca maxlength="40" autocomplete="organization" placeholder="Opcional" value="${esc(nome)}">
        <a class="btn grande ab-escolher" href="#campanha/${segCampanha(seg).id}" data-escolher><span>Escolher minha campanha</span></a>
      </div>
    </div>
  </section>

  <section class="wrap bloco ab-video" id="como-editar" aria-labelledby="video-t">${videoHTML(seg)}</section>

  <section class="wrap dia1" id="dia1" aria-labelledby="dia1-t">${dia1HTML(seg)}</section>

  <section class="wrap bloco" id="campanhas" aria-labelledby="camp-t">
    <h2 id="camp-t" class="h2-sec">Campanhas à venda</h2>
    <div class="vendas">${vendas.map(t => { const d = DEMOS[t.id]; return `<a class="venda" href="#campanha/${t.id}">
      <span class="venda-capa"><img data-capa-camp="${t.id}" alt="Capa da campanha ${esc(t.nome)}"></span>
      <span class="venda-txt"><small>${esc(d.abertura.publico)}</small><b>${esc(t.nome)}</b><span class="venda-preco">${aPartir}</span><span class="venda-ir">Ver campanha →</span></span></a>`; }).join("")}</div>
  </section>

  <section class="bloco galeria-home" aria-labelledby="gal-t">
    <div class="wrap"><h2 id="gal-t" class="h2-sec">Explorar a galeria</h2><p class="hint">${Object.keys(CATALOGO).length * 11} carrosséis em ${Object.keys(CATALOGO).length} coleções. Toque para abrir e testar.</p></div>
    <div class="gal-faixa">${outras.map(id => `<a href="#galeria/${id}" class="gh-capa"><img data-capa-camp="${id}" alt="${esc(COLECOES[id].nome)}" loading="lazy"><span>${esc(COLECOES[id].nome)}</span></a>`).join("")}</div>
    <div class="wrap"><a class="btn ghost" href="#galeria">Explorar a galeria</a></div>
  </section>

  <section class="wrap gestao-sec" id="gestao" aria-labelledby="gestao-t">
    <div><h2 id="gestao-t">Gestão mensal de conteúdo</h2><p>Quer alguém cuidando do seu Instagram o ano todo? Proposta personalizada.</p></div>
    ${(() => { const l = linkContato(SITE.contatoGestao, SITE.mensagemGestao);
      return l ? `<a class="btn ghost" href="${esc(l)}" target="_blank" rel="noopener" id="btn-gestao">Conversar sobre gestão mensal</a>`
               : `<p class="aviso" id="btn-gestao">O contato para a gestão mensal ainda não foi configurado.</p>`; })()}
  </section>`;
}
/* "Veja como editar sua campanha": vídeo do editor (config videoTutorial) ou, até ele existir, uma prévia do editor */
function videoHTML(seg) {
  const t = segCampanha(seg), carr = ab(seg).carrossel, v = SITE.videoTutorial || {};
  const tela = v.src
    ? `<div class="abv-tela tem-video"><video data-video ${v.poster ? `poster="${esc(v.poster)}"` : ""} preload="metadata" playsinline aria-label="Vídeo: como editar sua campanha"><source src="${esc(v.src)}" type="video/mp4">${v.webm ? `<source src="${esc(v.webm)}" type="video/webm">` : ""}</video><button type="button" class="abv-play" data-play aria-label="Assistir ao vídeo">▶</button></div>`
    : `<div class="abv-tela"><div class="abv-mock" aria-hidden="true">
        <div class="abv-abas"><span class="on">Textos</span><span>Fotos</span><span>Estilo</span><span>Marca</span></div>
        <canvas width="1080" height="1350" data-abv-arte></canvas>
        <div class="abv-campo"><small>Produto 1</small><b data-abv-campo>Clutch Noite</b></div>
      </div><p class="abv-aviso">O vídeo com narração vai aparecer aqui</p></div>`;
  return `<div class="abv-txt"><h2 id="video-t" class="h2-sec">Veja como editar sua campanha</h2><p>Troque a foto, o nome e o preço direto no celular. Baixe e publique.</p>
    <a class="btn grande" href="#editar/${t.id}/${carr}" data-testar>Testar o editor</a></div>${tela}`;
}
function dia1HTML(seg) {
  const t = segCampanha(seg), d = DEMOS[t.id].abertura.primeiroDia, x = carrDoCat(t.id, d.carrossel);
  return `<div class="dia1-card">
    <canvas class="dia1-arte" width="1080" height="1350" data-dia1-arte role="img" aria-label="Capa do carrossel ${esc(x.nome)}"></canvas>
    <div class="dia1-txt">
      <p class="eyebrow" id="dia1-t">Seu primeiro dia de campanha</p>
      <p class="dia1-dia"><span>Dia 1</span> Carrossel</p>
      <h3>${esc(x.nome)}</h3>
      <p>${esc(d.instrucao)}</p>
    </div>
    <div class="dia1-acao"><a class="btn grande" href="#campanha/${t.id}" data-voltar-planos data-quero="${t.id}"><span>Quero essa campanha · ${semQuebra(aPartirMin)}</span></a></div></div>`;
}
function montarCapasCampanhas() {
  document.querySelectorAll("[data-capa-camp]").forEach(img => capaCat(img.dataset.capaCamp, null, 540).then(u => { img.src = u; }));
}
/* abertura: a volta à mão em "vem pronto.", o leque de 3 capas da coleção, o nome da marca nas capas */
function montarAbertura() {
  const raiz = $(".ab"); if (!raiz) return null;
  const pilha = $("#ab-pilha"), cartoes = [...pilha.querySelectorAll(".ab-capa")], input = $("[data-nome-marca]");
  let seg = estado.publico, dados = null, versao = 0, ordem = [0, 1, 2], raf = 0, vivo = true;
  const ac = new AbortController();
  const marcaAgora = () => (input.value || "").trim() || ab(seg).marcaVazia;
  async function pecas(campId, carrId) {
    const x = carrDoCat(campId, carrId), estilo = estiloOriginal(campId, x);
    const [imgs] = await Promise.all([Promise.all(x.telas.map(tl => Promise.all((tl.f || []).map(fotoDeArquivo)))), carregarPar(estilo.par)]);
    return { x, estilo, imgs };
  }
  async function carregar(s) {
    const t = segCampanha(s), a = ab(s);
    const [capas, dia1] = await Promise.all([Promise.all(a.capas.map(id => pecas(t.id, id))), pecas(t.id, a.primeiroDia.carrossel), carregarFontes()]);
    return { t, a, capas, dia1 };
  }
  const desenhar = (ctx, p, i, marca) => desenharEstudio(ctx, p.x.telas[i], p.estilo, { marca, imgs: p.imgs[i], ajustes: p.x.telas[i].aj || [] });
  function pintar() {
    raf = 0; if (!dados || !vivo) return;
    const marca = marcaAgora();
    cartoes.forEach((c, i) => { desenhar(c.querySelector("canvas").getContext("2d"), dados.capas[i], 0, marca); c.querySelector("canvas").setAttribute("aria-label", `Capa: ${dados.capas[i].x.nome}`); });
    const d1 = $("[data-dia1-arte]"); if (d1) desenhar(d1.getContext("2d"), dados.dia1, 0, marca);
    const mv = $("[data-abv-arte]"); if (mv) desenhar(mv.getContext("2d"), dados.capas[0], 1, marca);
    const cv = $("[data-abv-campo]"); if (cv) { const c = dados.capas[0].x.telas[1].c; cv.textContent = c.nome1 || c.nome || c.estilo?.replace(/\*/g, "") || ""; }
    raiz.dataset.marca = marca; raiz.dataset.carrossel = dados.capas[ordem[0]].x.id; raiz.dataset.pronto = "1";
  }
  const agendar = () => { if (!raf) raf = requestAnimationFrame(pintar); };
  // leque: pos 0 na frente (inteira), 1 e 2 atrás, abertas para os lados
  const aplicar = () => { ordem.forEach((c, pos) => { cartoes[c].dataset.pos = pos; });
    raiz.querySelectorAll("[data-ab-p]").forEach((p, k) => p.classList.toggle("on", k === ordem[0]));
    if (dados) raiz.dataset.carrossel = dados.capas[ordem[0]].x.id; };
  const girar = d => { ordem = d > 0 ? [ordem[1], ordem[2], ordem[0]] : [ordem[2], ordem[0], ordem[1]]; aplicar(); };
  const ir = i => { let n = 0; while (ordem[0] !== i && n++ < 3) girar(1); };
  // folhear com o dedo (ou o mouse): a capa da frente acompanha
  let x0 = null, dx = 0, frente = null;
  pilha.addEventListener("pointerdown", e => { frente = cartoes[ordem[0]]; x0 = e.clientX; dx = 0; frente.classList.add("arrasta"); pilha.setPointerCapture(e.pointerId); });
  pilha.addEventListener("pointermove", e => { if (x0 == null) return; dx = e.clientX - x0; frente.style.transform = `translateX(${dx}px) rotate(${dx / 24}deg)`; });
  let alvo = null;
  pilha.addEventListener("pointerdown", e => { alvo = e.target.closest(".ab-capa"); }, { capture: true });
  const soltar = () => { if (x0 == null) return; frente.classList.remove("arrasta"); frente.style.transform = "";
    if (Math.abs(dx) > 45) girar(dx < 0 ? 1 : -1);
    else if (alvo && alvo.dataset.pos !== "0") ir(+alvo.dataset.i); // tocar numa capa de trás traz ela para a frente
    x0 = null; };
  pilha.addEventListener("pointerup", soltar); pilha.addEventListener("pointercancel", soltar);
  pilha.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); girar(1); } if (e.key === "ArrowLeft") { e.preventDefault(); girar(-1); } });
  raiz.addEventListener("click", e => { const b = e.target.closest("[data-ab-ir]"); if (b) girar(+b.dataset.abIr); });
  input.addEventListener("input", () => { if (ses) guardado.set(NOME_K, input.value, ses); agendar(); });
  // entrada das capas: chegam pela lateral e se abrem em leque
  const entrar = (lado = 1) => { if (calmo()) return Promise.resolve();
    return Promise.all(cartoes.map((c, k) => c.animate([{ transform: `translateX(${lado * 115}%) rotate(${lado * 10}deg)`, opacity: 0 }, { opacity: 1, offset: .35 }, { transform: getComputedStyle(c).transform, opacity: 1 }],
      { duration: 620, delay: (2 - +c.dataset.pos) * 70, easing: "cubic-bezier(.2,.8,.25,1)", fill: "backwards" }).finished.catch(() => {}))); };
  const sair = (lado = -1) => calmo() ? Promise.resolve() : Promise.all(cartoes.map((c, k) => c.animate([{ opacity: 1 }, { transform: `translateX(${lado * 115}%) rotate(${lado * 10}deg)`, opacity: 0 }],
      { duration: 240, delay: +c.dataset.pos * 40, easing: "ease-in", fill: "forwards" }).finished.catch(() => {})));
  async function trocar(novo) {
    if (novo === seg) return;
    const lado = SITE.publicos.findIndex(p => p.id === novo) > SITE.publicos.findIndex(p => p.id === seg) ? -1 : 1;
    seg = novo; estado.publico = novo; guardado.set("nna-publico", novo);
    raiz.dataset.seg = novo; raiz.querySelectorAll(".seg [data-seg]").forEach(b => b.setAttribute("aria-checked", String(b.dataset.seg === novo)));
    const t = segCampanha(novo); $("[data-escolher]").setAttribute("href", `#campanha/${t.id}`);
    const v = ++versao, prox = carregar(novo);
    await sair(lado);
    const d = await prox; if (v !== versao) return;
    dados = d; ordem = [0, 1, 2]; aplicar(); cartoes.forEach(c => c.getAnimations().forEach(a => a.cancel()));
    $("#como-editar").innerHTML = videoHTML(novo); $("#dia1").innerHTML = dia1HTML(novo); pintar();
    await entrar(-lado);
  }
  raiz.addEventListener("click", e => { const b = e.target.closest(".seg [data-seg]"); if (b) trocar(b.dataset.seg); });
  raiz.addEventListener("keydown", e => { const b = e.target.closest(".seg [data-seg]"); if (!b || !/Arrow(Left|Right|Up|Down)/.test(e.key)) return; e.preventDefault();
    const ids = SITE.publicos.map(p => p.id), n = ids[(ids.indexOf(seg) + 1) % ids.length]; trocar(n); raiz.querySelector(`.seg [data-seg="${n}"]`).focus(); });
  // a volta à mão ao redor de "vem pronto." (uma vez; com movimento reduzido, já aparece pronta)
  const volta = montarVolta(raiz.querySelector(".ab-vp"), ac.signal);
  (async () => { const v = ++versao; const d = await carregar(seg); if (v !== versao) return; dados = d; aplicar(); pintar(); entrar(1); })();
  // play do vídeo, quando houver
  document.addEventListener("click", e => { const b = e.target.closest("[data-play]"); if (!b) return; const vd = b.parentElement.querySelector("video"); vd.controls = true; b.hidden = true;
    Promise.resolve(vd.play()).catch(() => { b.hidden = false; vd.controls = false; toast("Não foi possível tocar o vídeo neste navegador."); }); }, { signal: ac.signal });
  return { destruir: () => { vivo = false; ac.abort(); volta.parar(); } };
}
/* desenha um laço à mão por fora da palavra, com um ponto cereja na ponta do traço */
function montarVolta(caixa, sinal) {
  const svg = caixa.querySelector("svg"), traco = svg.querySelector(".ab-traco"), ponto = svg.querySelector(".ab-ponto"), em = caixa.querySelector("em");
  let raf = 0, feito = false;
  function caminho() {
    // laço mais largo que alto: passa por fora do "v", do "p" e do "t", e cruza só os cantos vazios
    const r = em.getBoundingClientRect(), c = caixa.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    const folga = Math.max(4, Math.min(r.height * .5, r.left - 3, vw - r.right - 3));
    const rx = r.width / 2 + folga, ry = r.height * .8, m = 12;
    svg.setAttribute("width", 2 * rx + 2 * m); svg.setAttribute("height", 2 * ry + 2 * m);
    svg.style.left = `${r.left - c.left + r.width / 2 - rx - m}px`; svg.style.top = `${r.top - c.top + r.height / 2 - ry - m}px`;
    const cx = rx + m, cy = ry + m, a0 = Math.PI * 1.1, volta = Math.PI * 2 * 1.06, pts = [];
    for (let k = 0; k <= 96; k++) { const f = k / 96, a = a0 + volta * f, w = 1 + .02 * Math.sin(3 * a + .6), sobe = 1 + .05 * f;
      pts.push([cx + rx * w * Math.cos(a) * (1 + .015 * f), cy + ry * w * sobe * Math.sin(a) - 3 * f]); }
    traco.setAttribute("d", "M" + pts.map(p => p.map(v => v.toFixed(1)).join(" ")).join(" L"));
    return traco.getTotalLength();
  }
  function desenhar(anim) {
    cancelAnimationFrame(raf);
    const L = caminho(); traco.style.strokeDasharray = `${L}`;
    const pos = k => { const q = traco.getPointAtLength(L * k); ponto.setAttribute("cx", q.x); ponto.setAttribute("cy", q.y); traco.style.strokeDashoffset = `${L * (1 - k)}`; };
    if (!anim) { pos(1); return; }
    const t0 = performance.now(), dur = 1000, io = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const passo = agora => { const k = Math.min(1, (agora - t0) / dur); pos(io(k)); if (k < 1) raf = requestAnimationFrame(passo); else { feito = true; caixa.dataset.volta = "1"; } };
    raf = requestAnimationFrame(passo);
  }
  const iniciar = () => { if (calmo()) { desenhar(false); feito = true; caixa.dataset.volta = "1"; } else desenhar(true); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(iniciar, 250));
  addEventListener("resize", () => { if (feito || calmo()) desenhar(false); }, { signal: sinal });
  return { parar: () => cancelAnimationFrame(raf) };
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
    ${SITE.pagamento === "infinitepay" ? formPagamento(tema, plano) : `
    <p class="aviso-pedido" role="note"><b>Nenhum pagamento foi feito.</b> Esta tela só mostra o pedido. O pagamento acontece no próximo passo e o acesso é liberado depois da confirmação.</p>
    ${checkout ? `<a class="btn grande block" href="${esc(checkout)}" target="_blank" rel="noopener" data-checkout><span>Continuar para o pagamento · <span class="nw">${fmtBRL(plano.preco)}</span></span></a>` : `<p class="aviso">O checkout ainda não foi configurado.</p>`}`}
  </section>`;
}

/* ---------- pagamento (InfinitePay): e-mail do acesso → link de pagamento gerado no servidor ---------- */
const ajudaWhatsApp = msg => linkContato(SITE.whatsappVendas, msg) || "";
function formPagamento(tema, plano) {
  const ajuda = ajudaWhatsApp(`Olá! Tenho uma dúvida sobre a compra de ${tema.nome} (${plano.nome}).`);
  return `<form class="pg-form" hidden data-pagar data-camp="${tema.id}" data-plano-pedido="${plano.id}" novalidate>
    <label class="campo"><span>E-mail que vai receber o acesso</span><input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="120" placeholder="voce@email.com"></label>
    <label class="campo"><span>Confirme o e-mail</span><input type="email" name="confirmacao" autocomplete="off" inputmode="email" required maxlength="120" placeholder="digite de novo"></label>
    <p class="pg-erro" role="alert" hidden></p>
    <button class="btn grande block" type="submit"><span>Continuar para o pagamento · <span class="nw">${fmtBRL(plano.preco)}</span></span></button>
    <p class="pg-metodos" data-pg-metodos>Você paga na página segura do provedor de pagamento e volta para cá.</p>
    <p class="aviso-pedido" role="note">Compra única, sem mensalidade. Assim que o pagamento for confirmado, o botão <b>Abrir minha campanha</b> aparece na tela e o link de acesso chega no seu e-mail, mesmo se você fechar esta página.</p>
    ${ajuda ? `<p class="hint">Dúvidas? <a href="${esc(ajuda)}" target="_blank" rel="noopener">Fale com a gente no WhatsApp</a>.</p>` : ""}
  </form>`;
}
/* o pagamento online só aparece se o servidor estiver configurado; senão, a compra segue pelo WhatsApp */
async function prepararPagamento() {
  const f = $(".pg-form"); if (!f) return;
  let ativo = false;
  let provedor = null;
  try { const r = await fetch("/api/pedido", { cache: "no-store" }); const d = r.ok ? await r.json() : {}; ativo = d.ativo === true; provedor = d.provedor; } catch {}
  if (ativo) {
    const m = f.querySelector("[data-pg-metodos]");
    if (m) m.innerHTML = provedor === "ipg" ? "Você paga na <b>página segura do Sicredi</b> e volta para cá. Os dados do cartão não passam pelo nosso site." : "<b>Pix</b> na hora, ou cartão de crédito. Você paga na página segura da InfinitePay e volta para cá.";
    f.hidden = false; return;
  }
  const tema = temaPorId(SITE, f.dataset.camp), plano = planoPorId(SITE, f.dataset.planoPedido);
  const w = ajudaWhatsApp(String(SITE.mensagemCompra || "").replaceAll("{campanha}", tema.nome).replaceAll("{plano}", plano.nome).replaceAll("{preco}", fmtBRL(plano.preco)));
  f.outerHTML = `<p class="aviso-pedido" role="note"><b>Nenhum pagamento foi feito.</b> O pedido é finalizado pelo WhatsApp: a gente confirma o pagamento e envia o seu link de acesso.</p>
    ${w ? `<a class="btn grande block" href="${esc(w)}" target="_blank" rel="noopener" data-checkout><span>Continuar pelo WhatsApp · <span class="nw">${fmtBRL(plano.preco)}</span></span></a>` : `<p class="aviso">O checkout ainda não foi configurado.</p>`}`;
}
async function enviarPedido(form) {
  const erro = form.querySelector(".pg-erro"), btn = form.querySelector("button[type=submit]"), f = new FormData(form);
  const email = String(f.get("email") || "").trim(), confirmacao = String(f.get("confirmacao") || "").trim();
  const falha = m => { erro.innerHTML = m; erro.hidden = false; btn.disabled = false; btn.classList.remove("carregando"); };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return falha("Confira o e-mail: é por ele que o acesso chega.");
  if (email.toLowerCase() !== confirmacao.toLowerCase()) return falha("Os dois e-mails não são iguais.");
  erro.hidden = true; btn.disabled = true; btn.classList.add("carregando");
  try {
    const r = await fetch("/api/pedido", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ campanha: form.dataset.camp, plano: form.dataset.planoPedido, email, confirmacao }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || (!d.url && !d.formulario)) {
      const tema = temaPorId(SITE, form.dataset.camp), plano = planoPorId(SITE, form.dataset.planoPedido), w = ajudaWhatsApp(`Olá! Quero comprar ${tema.nome} no plano ${plano.nome}, por ${fmtBRL(plano.preco)}.`);
      return falha(`${esc(d.erro || "Não foi possível iniciar o pagamento.")}${r.status >= 500 && w ? ` <a href="${esc(w)}" target="_blank" rel="noopener">Fale com a gente no WhatsApp</a> para comprar agora.` : ""}`);
    }
    guardado.set("nna-pedido", JSON.stringify({ pedido: d.pedido, campanha: form.dataset.camp, plano: form.dataset.planoPedido }));
    if (d.formulario) { // IPG do Sicredi: envia o formulário assinado pelo servidor para a página segura de pagamento
      const ipg = document.createElement("form"); ipg.method = "post"; ipg.action = d.formulario.acao; ipg.hidden = true;
      for (const [k, v] of Object.entries(d.formulario.campos)) { const i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = v; ipg.appendChild(i); }
      document.body.appendChild(ipg); ipg.submit(); return;
    }
    location.href = d.url;
  } catch { falha("Sem conexão. Tente de novo em instantes."); }
}

/* ---------- volta da InfinitePay: confere no servidor e libera ---------- */
function viewRetorno() {
  return `<section class="wrap topo-pag retorno" id="retorno" aria-live="polite">
    <p class="eyebrow">Pagamento</p><h1 data-rt-titulo>Confirmando seu pagamento…</h1>
    <div data-rt-corpo><p class="lede">Isso leva só alguns segundos.</p></div></section>`;
}
function montarRetorno() {
  const q = new URLSearchParams((location.hash.split("?")[1]) || ""), guardadoP = (() => { try { return JSON.parse(guardado.get("nna-pedido", "null")); } catch { return null; } })();
  const dados = { pedido: q.get("order_nsu") || q.get("pedido") || (guardadoP && guardadoP.pedido) || "", transacao: q.get("transaction_nsu") || "", slug: q.get("slug") || "", comprovante: q.get("comprovante") || "" };
  const ipgEstado = q.get("recusado") ? "recusado" : q.get("espera") ? "espera" : q.get("erro") ? "erro" : "";
  const titulo = $("[data-rt-titulo]"), corpo = $("[data-rt-corpo]"); let tentativas = 0, timer = 0, vivo = true;
  const ajuda = ajudaWhatsApp("Olá! Paguei o Natal no Ar e preciso de ajuda com o acesso.");
  const ajudaHTML = ajuda ? `<p class="hint">Precisa de ajuda? <a href="${esc(ajuda)}" target="_blank" rel="noopener">Fale com a gente no WhatsApp</a>.</p>` : "";
  const resumoHTML = r => r ? `<div class="recibo"><div class="rc-linha"><span><small>Coleção</small><b>${esc(r.campanha)}</b></span></div><div class="rc-linha rc-plano"><span><small>Plano</small><b>${esc(r.plano)}</b></span><b class="num">${esc(r.valorTexto)}</b></div></div>` : "";
  async function verificar(reenviar = false) {
    const voltarPedido = guardadoP ? `#pedido/${guardadoP.campanha}/${guardadoP.plano}` : "#campanhas";
    if (ipgEstado === "recusado" && !reenviar) { document.body.dataset.retorno = "recusado"; titulo.textContent = "Pagamento não aprovado";
      corpo.innerHTML = `<p class="lede">O pagamento foi recusado e nada foi cobrado. Confira os dados do cartão ou tente outro cartão.</p><a class="btn grande" href="${voltarPedido}">Tentar de novo</a>${ajudaHTML}`; return; }
    if (ipgEstado === "espera" && !reenviar) { document.body.dataset.retorno = "pendente"; titulo.textContent = "Aguardando a confirmação do pagamento";
      corpo.innerHTML = `<p class="lede">Assim que o banco confirmar, o link de acesso chega no seu e-mail. Pode fechar esta página.</p><div class="pg-dica"><b>O pagamento expirou ou não foi concluído?</b> Nada foi cobrado. <a href="${voltarPedido}">Gere um novo pagamento</a>.</div>${ajudaHTML}`; return; }
    if (ipgEstado === "erro" && !reenviar) { document.body.dataset.retorno = "erro"; titulo.textContent = "Não conseguimos confirmar o pagamento";
      corpo.innerHTML = `<p class="lede">Se o pagamento foi aprovado, o link de acesso chega no seu e-mail. Se não chegar em alguns minutos, fale com a gente.</p>${ajudaHTML}`; return; }
    if (!dados.pedido) { titulo.textContent = "Não encontramos o pedido"; corpo.innerHTML = `<p class="lede">Abra o link do e-mail de acesso ou faça o pedido de novo.</p><a class="btn" href="#campanhas">Ver campanhas</a>${ajudaHTML}`; return; }
    let d = {};
    try { const r = await fetch("/api/retorno", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...dados, reenviar }) }); d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.erro || ""); }
    catch (e) { if (!vivo) return; titulo.textContent = "Não foi possível confirmar agora"; corpo.innerHTML = `<p class="lede">${esc(e.message || "Sem conexão.")} Se o pagamento foi feito, o acesso chega no seu e-mail.</p><button type="button" class="btn" data-rt-verificar>Verificar de novo</button>${ajudaHTML}`; return; }
    if (!vivo) return;
    document.body.dataset.retorno = d.status;
    if (d.status === "pago") {
      guardado.set("nna-pedido", null);
      titulo.textContent = "Pagamento confirmado!";
      corpo.innerHTML = `${resumoHTML(d.resumo)}
        <a class="btn grande block" href="#acesso=${esc(d.token)}" data-abrir-campanha>Abrir minha campanha</a>
        <p class="pg-email">O link de acesso também vai para <b>${esc(d.resumo.email)}</b>. Guarde o e-mail: ele é o seu acesso.</p>
        ${d.email ? `<p class="${d.email === "enviado" ? "pg-ok" : "pg-erro"}" role="status">${d.email === "enviado" ? "E-mail reenviado." : esc(d.email)}</p>` : ""}
        <p>Não chegou em alguns minutos? Olhe a caixa de spam ou <button type="button" class="link" data-rt-reenviar>reenvie o e-mail</button>. Não há nova cobrança.</p>${ajudaHTML}`;
      return;
    }
    tentativas++;
    titulo.textContent = "Aguardando a confirmação do pagamento";
    const esgotou = tentativas >= 36, voltar = d.resumo ? `#pedido/${d.resumo.campanhaId}/${d.resumo.planoId}` : "#campanhas";
    corpo.innerHTML = `${resumoHTML(d.resumo)}
      <p class="lede">${esgotou ? "Ainda não recebemos a confirmação." : "Assim que a InfinitePay confirmar, o botão para abrir a sua campanha aparece aqui. Pode deixar esta página aberta."}</p>
      ${esgotou ? "" : `<p class="pg-espera"><span class="pg-ponto"></span> Verificando…</p>`}
      <button type="button" class="btn ${esgotou ? "" : "ghost"}" data-rt-verificar>Já paguei, verificar agora</button>
      <div class="pg-dica"><b>O Pix expirou ou o cartão foi recusado?</b> Nada foi cobrado. <a href="${voltar}">Gere um novo pagamento</a>. Se o Pix foi pago, a confirmação chega por e-mail mesmo que você feche esta página.</div>${ajudaHTML}`;
    if (!esgotou) timer = setTimeout(() => verificar(), 5000);
  }
  const clique = e => { if (e.target.closest("[data-rt-verificar]")) { clearTimeout(timer); tentativas = 0; verificar(); } if (e.target.closest("[data-rt-reenviar]")) { clearTimeout(timer); verificar(true); } };
  corpo.addEventListener("click", clique);
  verificar();
  return { destruir: () => { vivo = false; clearTimeout(timer); } };
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
  if (h === "retorno" || h.startsWith("retorno?")) return { tela: "retorno" };
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
    app.innerHTML = r.tela === "campanha" ? viewCampanha(r.id) : r.tela === "pedido" ? viewPedido(r.id, r.plano) : r.tela === "editar" ? viewEditar(r.id, r.carr) : r.tela === "area" ? viewArea(r.id, r.carr) : r.tela === "galeria" ? viewGaleria(r.id) : r.tela === "retorno" ? viewRetorno() : viewInicio();
    if (r.tela === "galeria") montarGaleria(r.id);
    if (r.tela === "inicio") { montados.push(montarAbertura()); montarCapasCampanhas(); }
    if (r.tela === "retorno") montados.push(montarRetorno());
    if (r.tela === "pedido") prepararPagamento();
    document.body.dataset.tela = r.tela;
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
/* revisão do pedido: continuar para o pagamento */
document.addEventListener("submit", e => { const f = e.target.closest("[data-pagar]"); if (!f) return; e.preventDefault(); enviarPedido(f); });
/* área: escolher outro roteiro de Reel */
document.addEventListener("change", e => {
  const s = e.target.closest && e.target.closest("[data-ir-reel]");
  if (s) location.hash = `#area/reels/${s.value}`;
});
