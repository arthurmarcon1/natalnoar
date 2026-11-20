import { SITE } from "../config.js";
import { DEMOS } from "../amostra/index.js";
import {
  fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato, modeloDoTema, legendaEditor,
  planoPorId, planoPadrao, pecasDoPlano, entregasDoPlano, carrosseisLiberados
} from "./logic.js";
import { montarAmostra, montarEditorCompleto } from "./editor.js";
import { montarCarrossel, montarFormatos } from "./demo.js";

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
  item: 0, cal: null, area: null, rolarPlanos: false
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
function planoCard(p, tema, demo) {
  const on = p.id === estado.plano;
  const mais = p.nivel === 1 ? p.acrescenta.slice(0, 3)
    : p.nivel === 2 ? [`+ 3 temas: ${demo.extras.join(", ")}`, "Calendário ampliado para 15 dias"]
    : [`+ Minicampanha de Réveillon: ${demo.reveillon.join(", ")}`, "+ 3 sequências de Stories", "Calendário próprio de 5 dias"];
  return `<div class="plano ${on ? "on" : ""}" role="radio" tabindex="${on ? 0 : -1}" aria-checked="${on}" data-plano="${p.id}">
    <div class="pl-topo"><b class="pl-nome">${esc(p.nome)}</b><span class="pl-check" aria-hidden="true"></span></div>
    <div class="pl-preco">${fmtBRL(p.preco)}</div>
    <div class="pl-nums"><span><b>${p.carrosseis}</b> carrosséis</span><span><b>${p.roteiros}</b> roteiros de Reels</span><span><b>${p.stories}</b> Stories</span></div>
    <p class="pl-resumo">${esc(p.resumo)}</p>
    <ul class="pl-mais">${mais.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
  </div>`;
}
function resumoPlano(tema, p) {
  return `<p class="pl-escolhido" id="pl-escolhido" aria-live="polite"><span>${esc(tema.nome)} ·</span> <b>${esc(p.nome)}</b> <span class="num">${fmtBRL(p.preco)}</span> <span class="hint">· ${pecasDoPlano(p)} peças prontas</span></p>`;
}
function secaoPlanos(tema, demo) {
  const p = planoAtual();
  return `<section class="wrap bloco planos-sec" id="planos" aria-labelledby="planos-t">
    <h2 id="planos-t" class="sub-t">Escolha seu plano</h2>
    <p class="hint">Compra única. O preço é o valor total do plano.</p>
    <div class="planos" role="radiogroup" aria-label="Planos">${SITE.planos.map(x => planoCard(x, tema, demo)).join("")}</div>
    <div class="pl-acao">${resumoPlano(tema, p)}<div id="pl-botao">${botaoComprar(tema, p, "block")}</div></div>
  </section>`;
}

/* ---------- "Ver tudo que vem no kit" (acompanha o plano) ---------- */
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
      <span class="kit-chamada"><b>Ver tudo que vem no kit</b><span>${pecasDoPlano(plano)} peças prontas</span></span>
      <span class="kit-seta" aria-hidden="true">↓</span>
    </summary>
    <div class="kit-corpo">
      <p class="kit-intro">${tema ? `${esc(plano.nome)}: tudo pensado para o seu Natal, ` : "Tudo pensado para o seu Natal, "}<em>pronto para usar.</em></p>
      <ul class="kit-grade">${itens}</ul>
      <div class="kit-total">
        <div><span class="kt-num">${pecasDoPlano(plano)}</span><span>peças prontas no ${esc(plano.nome)}</span></div>
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
function palco() {
  const d = DEMO_HERO, [p1, p2, p3] = d.produtos;
  const card = (p, k) => `<figure class="lq lq${k}"><img src="${esc(p.foto)}" alt=""><figcaption>${esc(p.preco)}</figcaption></figure>`;
  return `<div class="palco ${animou ? "pronto" : ""}" aria-hidden="true">
    <div class="leque">${card(p1, 1)}${card(p2, 2)}${card(p3, 3)}</div>
    <div class="post">
      <div class="post-top"><span class="post-av">${esc(d.marca.charAt(0))}</span>${esc(d.marca.toLowerCase().replace(/\s+/g, ""))}</div>
      <div class="post-capa"><img class="post-foto" src="${esc(d.capaFoto)}" alt=""><div class="post-txt"><span class="post-tit">${esc(d.capa.texto)}</span><span class="post-preco">${esc(d.capa.preco)}</span></div></div>
    </div>
  </div>`;
}
function viewInicio() {
  const pub = publicoPorId(SITE, estado.publico), temas = temasDoPublico(SITE, estado.publico);
  const prontos = temas.filter(t => t.status === "disponivel"), prep = temas.filter(t => t.status !== "disponivel");
  const demoPub = DEMOS[(prontos[0] || {}).id] || DEMO_HERO;
  return `
  <section class="hero wrap">
    <div class="hero-txt">
      <h1><span class="l">Fim de ano corrido?</span><span class="l">Seu conteúdo <em>vem pronto.</em></span></h1>
      <p class="lede">Campanhas de Natal para Instagram, ${aPartirMin}. Você coloca suas fotos e publica.</p>
      <div class="ctas"><a class="btn grande" href="#campanhas">Escolher minha campanha</a></div>
    </div>
    ${palco()}
  </section>

  <section class="bloco wrap" id="campanhas" aria-labelledby="camp-t">
    <div class="sec-cab"><h2 id="camp-t">Campanhas prontas</h2><span class="preco-tag">${aPartir}</span></div>
    <p class="pub-pergunta">Qual é o seu negócio?</p>
    <div class="publicos" role="tablist" aria-label="Seu negócio">
      ${SITE.publicos.map(p => `<button type="button" role="tab" data-publico="${p.id}" aria-selected="${p.id === estado.publico}">${p.id === "loja" ? "Sou lojista" : "Sou prestadora de serviço"}</button>`).join("")}
    </div>
    <p class="pub-chamada">${esc(pub.chamada)}</p>
    ${prontos.map(t => { const d = DEMOS[t.id] || DEMO_HERO; return `<a class="destaque-camp" href="#campanha/${t.id}">
        <img src="${esc(d.capaFoto)}" alt="">
        <span class="dc-txt"><span class="selo ok">Disponível</span><b>${esc(t.nome)}</b><span>${esc(t.descricao)}</span><span class="dc-planos">3 planos · ${aPartirMin}</span><span class="dc-ir">Ver campanha e planos →</span></span>
      </a>`; }).join("")}
    <ul class="lista-prep">${prep.map(t => `<li><div><b>${esc(t.nome)}</b>${t.paraQuem ? `<span>Para: ${esc(t.paraQuem)}</span>` : `<span>${esc(t.descricao)}</span>`}</div><span class="selo prep">Em preparação</span></li>`).join("")}</ul>
    ${verTudo(demoPub, planoPadrao(SITE))}
  </section>

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

/* ---------- campanha ---------- */
function viewCampanha(id) {
  const tema = temaPorId(SITE, id), demo = DEMOS[id];
  if (!tema || tema.status !== "disponivel" || !demo) return `<section class="wrap topo-pag"><h1>Em preparação</h1><p class="lede">Este tema ainda não está pronto.</p><a class="btn" href="#campanhas">Ver campanhas</a></section>`;
  return `
  <section class="wrap camp-top">
    <p class="eyebrow">${tema.publico === "loja" ? "Para lojistas" : "Para prestadoras de serviço"} · ${aPartir}</p>
    <h1>${esc(tema.nome)}</h1>
    <div id="carrossel"></div>
    <div class="acoes"><button type="button" class="btn grande" data-ir-planos><span>Ver planos · ${semQuebra(aPartirMin)}</span></button><a class="btn grande ghost" href="#testar/${tema.id}">Testar com a minha foto</a></div>
  </section>
  ${secaoPlanos(tema, demo)}
  <section class="wrap bloco formatos" aria-labelledby="fmt-t">
    <h2 id="fmt-t" class="sub-t">Também em Reel e Stories</h2>
    <div id="formatos" class="demo"></div>
  </section>
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

/* ---------- teste grátis ---------- */
function viewTestar(id) {
  const tema = temaPorId(SITE, id) || campanhaDoPublico(estado.publico);
  return `
  <section class="wrap topo-pag">
    <a class="link voltar" href="#campanha/${tema.id}">← ${esc(tema.nome)}</a>
    <h1>Teste com a sua foto</h1>
    <p class="lede">Troque a foto, o nome e o preço. A foto fica só no seu celular.</p>
  </section>
  <section class="wrap" id="amostra-editor" data-tema="${tema.id}"></section>
  <section class="wrap bloco">
    <div class="acoes"><a class="btn grande" href="#campanha/${tema.id}" data-voltar-planos>Ver planos · ${aPartirMin}</a></div>
    <p class="hint">Em qualquer plano você edita as peças compradas e baixa tudo sem marca-d'água.</p>
  </section>`;
}

/* ---------- área da cliente ---------- */
const TOKEN_K = "nna-acesso";
function viewArea() {
  const a = estado.area;
  if (!guardado.get(TOKEN_K, "")) return `
    <section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Sua campanha fica aqui</h1>
      <p class="lede">Depois da confirmação do pagamento, você recebe um link de acesso. Abra o link neste aparelho.</p>
      <div class="acoes"><a class="btn grande ghost" href="#campanhas">Ver as campanhas</a></div></section>`;
  if (!a || a.carregando) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Abrindo sua campanha…</h1></section>`;
  if (a.erro) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Não foi possível abrir</h1><p class="lede">${esc(a.erro)}</p>
      <button type="button" class="btn ghost" data-sair>Remover acesso deste aparelho</button></section>`;
  const c = a.campanha, plano = a.plano, lista = carrosseisLiberados(c);
  const sel = lista[Math.min(estado.item, lista.length - 1)], t = sel.t;
  const cals = [["dez", "10 dias", c.calendario.dez], ["quinze", "15 dias", c.calendario.quinze], ["expressa", "Expressa: 3 dias", c.calendario.expressa], ["reveillon", "Réveillon: 5 dias", c.reveillon && c.reveillon.calendario]]
    .filter(([k, , v]) => v && !(k === "dez" && c.calendario.quinze));
  if (!cals.some(([k]) => k === estado.cal)) estado.cal = cals[0][0];
  const grupos = [...new Set(lista.map(x => x.grupo))];
  return `
  <section class="wrap topo-pag">
    <p class="eyebrow">Área da cliente · ${esc(plano.nome)} · acesso até ${new Date(a.acesso.expira).toLocaleDateString("pt-BR")}</p>
    <h1>${esc(c.nome)}</h1>
    <p class="hint">${plano.carrosseis} carrosséis, ${plano.roteiros} roteiros de Reels e ${plano.stories} sequências de Stories liberados.</p>
  </section>
  <section class="wrap bloco" aria-labelledby="car-t">
    <h2 id="car-t" class="sub-t">${lista.length} carrosséis</h2>
    ${grupos.map(g => `<p class="grupo-t">${g === "Natal" ? "Natal" : g === "Tema extra" ? "Temas extras" : "Réveillon"}</p>
      <div class="chips" role="tablist" aria-label="${esc(g)}">${lista.map((x, k) => x.grupo !== g ? "" : `<button type="button" role="tab" class="chip ${k === estado.item ? "on" : ""}" data-item="${k}" aria-selected="${k === estado.item}">${k + 1}. ${esc(x.t.nome)}</button>`).join("")}</div>`).join("")}
    <p class="ideia"><b>${esc(t.nome)}.</b> ${esc(t.ideia)} <span class="hint">Fotografe: ${esc(t.fotografar)}</span></p>
    <div id="editor-completo"></div>
  </section>
  <section class="wrap bloco">
    <details class="kit-det" open><summary>Roteiro de Reel · ${marc(t.reel.nome)}</summary><div class="kit-det-corpo">
      <p class="aviso-reel">Roteiro para você gravar (${esc(t.reel.duracao)}). Não é um vídeo pronto.</p>
      <dl class="roteiro">
        <dt>Abertura</dt><dd>${marc(t.reel.abertura)}</dd>
        <dt>Cenas</dt><dd><ol>${t.reel.cenas.map(s => `<li>${marc(s.filmar)}<br><span class="tt">Texto na tela: “${marc(s.texto)}”</span></li>`).join("")}</ol></dd>
        <dt>Legenda</dt><dd>${marc(t.reel.legenda)}</dd><dt>Chamada final</dt><dd>${marc(t.reel.chamadaFinal)}</dd><dt>Sem aparecer</dt><dd>${marc(t.reel.semAparecer)}</dd>
      </dl></div></details>
    ${t.stories ? `<details class="kit-det"><summary>Stories · ${marc(t.stories.nome)}</summary><div class="kit-det-corpo">
      <ol class="stories-txt">${t.stories.telas.map((s, i) => `<li><span class="n">Tela ${i + 1}</span><b>${marc(s.texto)}</b><span>Mostre: ${marc(s.mostrar)}</span><small>${marc(s.recurso)}</small></li>`).join("")}</ol></div></details>` : ""}
    <details class="kit-det"><summary>3 mensagens de WhatsApp</summary><div class="kit-det-corpo">
      <div class="msgs">${c.whatsapp.map((m, i) => `<article class="msg"><b>${esc(m.titulo)}</b><span class="hint">${esc(m.quando)}</span><p id="wa${i}">${marc(m.texto)}</p><button type="button" class="btn ghost sm" data-copiar="wa${i}">Copiar mensagem</button></article>`).join("")}</div></div></details>
    <details class="kit-det"><summary>Calendário</summary><div class="kit-det-corpo">
      <div class="chips" role="tablist" aria-label="Calendário">${cals.map(([k, n]) => `<button type="button" role="tab" class="chip ${k === estado.cal ? "on" : ""}" data-cal="${k}" aria-selected="${k === estado.cal}">${n}</button>`).join("")}</div>
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
function montarEditorDaArea() {
  const c = estado.area.campanha, lista = carrosseisLiberados(c), sel = lista[Math.min(estado.item, lista.length - 1)], k = lista.indexOf(sel);
  const principal = sel.grupo === "Natal" && sel.i === 0 && c.editor;
  const legenda = st => {
    if (principal) return legendaEditor(c.editor.legenda, st);
    const m = (st.marca || "").trim(), marca = m && !/^\[.*\]$/.test(m) ? m : null;
    return marca ? sel.t.carrossel.legenda.replaceAll("[nome da loja]", marca).replaceAll("[nome do negócio]", marca) : sel.t.carrossel.legenda;
  };
  montarEditorCompleto($("#editor-completo"), modeloDoTema(sel.t), { nome: sel.t.carrossel.nome.replace(/\[|\]/g, ""), numero: k + 1, exemplo: principal ? c.editor.exemplo : null, legenda, toast });
}

/* ---------- rotas ---------- */
function rota() {
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.startsWith("acesso=")) return { tela: "acesso", token: h.slice(7) };
  if (h.startsWith("campanha/")) return { tela: "campanha", id: h.slice(9) };
  if (h.startsWith("pedido/")) { const [id, plano] = h.slice(7).split("/"); return { tela: "pedido", id, plano: plano || planoPadrao(SITE).id }; }
  if (h.startsWith("testar")) return { tela: "testar", id: h.split("/")[1] || (campanhaDoPublico(estado.publico) || {}).id };
  if (h === "experimentar") return { tela: "testar", id: "presentes-por-orcamento" };
  if (h === "area") return { tela: "area" };
  if (h === "demo") return { tela: "campanha", id: "presentes-por-orcamento" };
  if (["campanhas", "gestao", "dentro"].includes(h)) return { tela: "inicio", ancora: h };
  return { tela: "inicio" };
}
let telaAtual = null;
function render(rolar = true) {
  const r = rota(), app = $("#app");
  if (r.tela === "acesso") { guardado.set(TOKEN_K, r.token); estado.area = null; estado.item = 0; history.replaceState(null, "", "#area"); return render(); }
  if (r.tela === "area" && !estado.area && guardado.get(TOKEN_K, "")) carregarArea();
  if (r.tela === "pedido" && planoPorId(SITE, r.plano)) { estado.plano = r.plano; if (ses) guardado.set("nna-plano", r.plano, ses); }
  const chave = r.tela + (r.id || "") + (r.plano || ""), mesma = telaAtual === chave;
  if (!mesma || !rolar) {
    montados.forEach(m => m && m.destruir && m.destruir()); montados = [];
    app.innerHTML = r.tela === "campanha" ? viewCampanha(r.id) : r.tela === "pedido" ? viewPedido(r.id, r.plano) : r.tela === "testar" ? viewTestar(r.id) : r.tela === "area" ? viewArea() : viewInicio();
    if (r.tela === "inicio") animou = true; // a animação da capa acontece uma vez por visita
    if (r.tela === "campanha" && $("#carrossel")) {
      const demo = DEMOS[r.id]; let fmts = null;
      const car = montarCarrossel($("#carrossel"), demo, { aoMudar: i => fmts && fmts.escolher(i) });
      fmts = montarFormatos($("#formatos"), demo, { aoMudar: i => car.irParaProduto(i) });
      montados.push(car, fmts);
    }
    if (r.tela === "testar") montarAmostra($("#amostra-editor"), DEMOS[$("#amostra-editor").dataset.tema] || DEMO_HERO, { toast });
    if (r.tela === "area" && estado.area && estado.area.campanha) montarEditorDaArea();
  }
  telaAtual = chave;
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", (a.getAttribute("href") === "#campanhas" && (r.ancora === "campanhas" || r.tela === "campanha")) || (a.getAttribute("href") === "#gestao" && r.ancora === "gestao")));
  if (!rolar) return;
  const suave = mesma && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";
  if (r.tela === "campanha" && estado.rolarPlanos) { estado.rolarPlanos = false; requestAnimationFrame(() => $("#planos")?.scrollIntoView({ behavior: "auto" })); }
  else if (r.ancora) requestAnimationFrame(() => document.getElementById(r.ancora)?.scrollIntoView({ behavior: suave }));
  else scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const manter = fn => { const y = scrollY; fn(); render(false); scrollTo(0, y); };
  const pl = e.target.closest("[data-plano]");
  if (pl) { aplicarPlano(pl.dataset.plano); return; }
  if (e.target.closest("[data-ir-planos]")) { $("#planos")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); return; }
  if (e.target.closest("[data-voltar-planos]")) estado.rolarPlanos = true;
  const pb = e.target.closest("[data-publico]");
  if (pb) { manter(() => { estado.publico = pb.dataset.publico; guardado.set("nna-publico", estado.publico); }); return; }
  const it = e.target.closest("[data-item]");
  if (it) { manter(() => { estado.item = +it.dataset.item; }); return; }
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
render();
