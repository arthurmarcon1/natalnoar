import { SITE } from "../config.js";
import presentes from "../content/presentes-por-orcamento.js";
import { fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato } from "./logic.js";
import { montarAntesDepois, montarEditor } from "./editor.js";

/* Conteúdo de cada campanha pronta (chave = tema.conteudo em config.js) */
const CONTEUDOS = { "presentes-por-orcamento": presentes };

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const marc = s => esc(s).replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>'); // destaca marcadores
const multi = s => marc(s).replace(/\n/g, "<br>");
const preco = fmtBRL(SITE.precoCampanha);
const guardado = { get(k, f) { try { return localStorage.getItem(k) ?? f; } catch { return f; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
const estado = { publico: publicoPorId(SITE, guardado.get("nna-publico", "loja")) ? guardado.get("nna-publico", "loja") : "loja", tema: 0, cal: "dez" };

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }
async function copiar(txt, ok = "Copiado.") {
  try { await navigator.clipboard.writeText(txt); toast(ok); }
  catch { toast("Não deu para copiar automaticamente. Selecione o texto e copie."); }
}

/* ---------- blocos ---------- */
function botaoCompra(tema, classe = "") {
  const c = estadoCompra(tema, SITE);
  if (c.tipo === "checkout") return `<a class="btn ${classe}" href="${esc(c.href)}" target="_blank" rel="noopener" data-compra="${tema.id}">${esc(c.rotulo)}</a>`;
  if (c.tipo === "em-breve") return `<button type="button" class="btn ${classe} espera" aria-disabled="true" data-compra="${tema.id}" data-embreve>${esc(c.rotulo)}</button>`;
  return `<span class="selo prep">${esc(c.rotulo)}</span>`;
}
function conviteGestao() {
  return `<p class="convite">Prefere alguém cuidando do seu Instagram o ano todo? <a href="#gestao">Conheça a gestão mensal</a></p>`;
}
function temaCard(t) {
  const pronto = t.status === "disponivel";
  return `<article class="tema ${pronto ? "pronto" : "prep"}">
    <div class="tema-topo"><h3>${esc(t.nome)}</h3><span class="selo ${pronto ? "ok" : "prep"}">${pronto ? "Disponível" : "Em preparação"}</span></div>
    <p>${esc(t.descricao)}</p>
    ${t.paraQuem ? `<p class="para"><b>Faz sentido para:</b> ${esc(t.paraQuem)}</p>` : ""}
    ${pronto ? `<div class="tema-acoes"><a class="btn" href="#campanha/${t.id}">Ver o que vem dentro</a>${botaoCompra(t, "ghost")}</div>
               <a class="link" href="#experimentar">Experimentar uma publicação</a>`
             : `<p class="hint">O material deste tema está sendo preparado.</p>`}
  </article>`;
}
const DENTRO = [
  ["5 carrosséis editáveis", "4 telas cada, com legendas prontas."],
  ["5 roteiros de Reels", "Abertura, cenas, texto na tela, legenda e chamada final. <b>São roteiros para você gravar, não vídeos prontos.</b> Cada um tem uma alternativa para quem prefere não aparecer: só mãos, produto, ambiente ou tela com texto."],
  ["5 sequências de Stories", "3 telas cada, com enquetes e chamadas."],
  ["3 mensagens de WhatsApp", "Prontas para responder, sugerir presentes e avisar prazos."],
  ["Calendário de 10 dias", "Com uma versão expressa de 3 dias para quem começa em cima da hora."],
  ["Tutorial curto de edição", "Como fotografar, trocar os textos, baixar e publicar."]
];

/* ---------- telas ---------- */
function viewInicio() {
  const pub = publicoPorId(SITE, estado.publico);
  return `
  <section class="hero wrap">
    <p class="eyebrow"><span class="estrela" aria-hidden="true">✦</span> Campanhas de Natal para Instagram</p>
    <h1><span class="l">Fim de ano corrido?</span><span class="l">Seu conteúdo <em>vem pronto.</em></span></h1>
    <p class="lede">Escolha sua campanha de Natal por ${preco}. Os carrosséis, os roteiros de Reels e o calendário já vêm preparados. Você coloca suas fotos, adapta os textos e publica.</p>
    <div class="ctas"><a class="btn grande" href="#campanhas">Escolher minha campanha</a><a class="link" href="#gestao">Conhecer a gestão mensal</a></div>
  </section>

  <section class="amostra" aria-labelledby="amostra-t">
    <div class="wrap">
      <div class="sec-cab"><h2 id="amostra-t">A mesma publicação, antes e depois</h2><p>É isso que você edita: troca a foto, o preço e o nome da loja.</p></div>
      <div class="ad" id="antes-depois"></div>
      <div class="amostra-acao"><a class="btn" href="#experimentar">Experimentar uma publicação</a><span class="hint">Grátis, no seu celular. As fotos não saem do aparelho.</span></div>
    </div>
  </section>

  <section class="bloco wrap" id="campanhas" aria-labelledby="camp-t">
    <p class="eyebrow">Campanhas prontas</p>
    <div class="sec-cab"><h2 id="camp-t">Uma campanha completa por <span class="preco">${preco}</span></h2><p>Cada compra dá acesso a uma campanha à sua escolha. Você adapta com as suas fotos e publica.</p></div>
    <div class="respostas">
      <a href="#serve" class="resposta"><b>Serve para o meu negócio?</b><span>Sim, se você tem uma loja ou presta um serviço. Escolha o seu caminho.</span></a>
      <a href="#dentro" class="resposta"><b>O que vem dentro?</b><span>Carrosséis, roteiros de Reels, Stories, mensagens, calendário e tutorial.</span></a>
      <a href="#usar" class="resposta"><b>Eu consigo usar?</b><span>Sim. Você troca fotos e textos pelo celular. Teste agora, sem cadastro.</span></a>
    </div>

    <div id="serve" class="sub-bloco">
      <h3 class="sub-t">Serve para o meu negócio?</h3>
      <div class="publicos" role="tablist" aria-label="Seu tipo de negócio">
        ${SITE.publicos.map(p => `<button type="button" role="tab" data-publico="${p.id}" aria-selected="${p.id === estado.publico}">${esc(p.nome)}</button>`).join("")}
      </div>
      <p class="pub-chamada">${esc(pub.chamada)}</p>
      <div class="temas">${temasDoPublico(SITE, estado.publico).map(temaCard).join("")}</div>
    </div>

    <div id="dentro" class="sub-bloco">
      <h3 class="sub-t">O que vem em cada campanha</h3>
      <ul class="dentro">${DENTRO.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join("")}</ul>
    </div>

    <div id="usar" class="sub-bloco">
      <h3 class="sub-t">Eu consigo usar?</h3>
      <ol class="passos">
        <li><b>Escolha a campanha</b><span>Uma por compra, do jeito do seu negócio.</span></li>
        <li><b>Troque o que está entre colchetes</b><span>Foto, preço e nome da loja. O resto já vem escrito.</span></li>
        <li><b>Baixe as imagens</b><span>No tamanho do Instagram, numeradas na ordem.</span></li>
        <li><b>Publique pelo calendário</b><span>10 dias de conteúdo, ou 3 na versão expressa.</span></li>
      </ol>
      <a class="btn ghost" href="#experimentar">Experimentar uma publicação</a>
    </div>
    ${conviteGestao()}
  </section>

  <section class="gestao" id="gestao" aria-labelledby="gestao-t">
    <div class="wrap">
      <p class="eyebrow">Gestão mensal</p>
      <h2 id="gestao-t">Gestão mensal de conteúdo</h2>
      <p class="gestao-txt">Se você quer acompanhamento ao longo do ano, me conte um pouco sobre seu negócio. Vamos conversar sobre o que você precisa para eu preparar uma proposta.</p>
      ${(() => { const l = linkContato(SITE.contatoGestao, SITE.mensagemGestao);
        return l ? `<a class="btn claro" href="${esc(l)}" target="_blank" rel="noopener" id="btn-gestao">Conversar sobre gestão mensal</a>`
                 : `<p class="aviso" id="btn-gestao">O contato para a gestão mensal ainda não foi configurado.</p>`; })()}
    </div>
  </section>`;
}

function viewCampanha(id) {
  const tema = temaPorId(SITE, id), c = tema && CONTEUDOS[tema.conteudo];
  if (!tema || !c || tema.status !== "disponivel") return `<section class="wrap bloco"><h1>Campanha em preparação</h1><p>Este material ainda não está pronto.</p><p><a class="link" href="#campanhas">← Voltar às campanhas</a></p></section>`;
  const pub = publicoPorId(SITE, tema.publico);
  const t = c.temas[estado.tema] || c.temas[0];
  return `
  <section class="wrap camp-cab">
    <a class="link voltar" href="#campanhas">← Campanhas prontas</a>
    <p class="eyebrow">Campanha pronta · ${esc(pub.nome)}</p>
    <h1>${esc(c.nome)}</h1>
    <p class="lede">${esc(c.resumo)}</p>
    <div class="ctas">${botaoCompra(tema)}<a class="btn ghost" href="#experimentar">Experimentar uma publicação</a></div>
    <p class="hint">${preco} · acesso a esta campanha. Marcadores como <mark>[preço]</mark> são as partes que você troca.</p>
  </section>

  <section class="wrap bloco" aria-labelledby="temas-t">
    <h2 id="temas-t" class="sub-t">5 temas: carrossel, Reel e Stories conectados</h2>
    <div class="chips" role="tablist" aria-label="Temas da campanha">${c.temas.map((x, i) => `<button type="button" role="tab" class="chip ${i === estado.tema ? "on" : ""}" data-ctema="${i}" aria-selected="${i === estado.tema}">${i + 1}. ${esc(x.nome)}</button>`).join("")}</div>
    <div class="tema-det">
      <p class="ideia"><b>${esc(t.nome)}.</b> ${esc(t.ideia)}</p>
      <p class="hint"><b>Fotografe uma vez:</b> ${esc(t.fotografar)}</p>

      <h3>Carrossel · ${marc(t.carrossel.nome)}</h3>
      <ol class="telas-txt">${t.carrossel.telas.map((s, i) => `<li><span class="n">Tela ${i + 1}</span><b>${marc(s.titulo)}</b>${s.preco ? `<span class="pr">${marc(s.preco)}</span>` : ""}<span>${marc(s.apoio)}</span><small>Foto: ${esc(s.foto)}</small></li>`).join("")}</ol>
      <div class="legenda-box"><div class="lb-cab"><b>Legenda</b><button type="button" class="btn ghost sm" data-copiar="leg">Copiar legenda</button></div><p id="leg">${multi(t.carrossel.legenda)}</p></div>

      <h3>Roteiro de Reel · ${marc(t.reel.nome)}</h3>
      <p class="aviso-reel">Roteiro para você gravar (${esc(t.reel.duracao)}). Não é um vídeo pronto.</p>
      <dl class="roteiro">
        <dt>Abertura</dt><dd>${marc(t.reel.abertura)}</dd>
        <dt>Cenas</dt><dd><ol>${t.reel.cenas.map(s => `<li>${marc(s.filmar)}<br><span class="tt">Texto na tela: “${marc(s.texto)}”</span></li>`).join("")}</ol></dd>
        <dt>Legenda</dt><dd>${marc(t.reel.legenda)}</dd>
        <dt>Chamada final</dt><dd>${marc(t.reel.chamadaFinal)}</dd>
        <dt>Sem aparecer</dt><dd>${marc(t.reel.semAparecer)}</dd>
      </dl>

      <h3>Stories · ${marc(t.stories.nome)}</h3>
      <ol class="stories-txt">${t.stories.telas.map((s, i) => `<li><span class="n">Tela ${i + 1}</span><b>${marc(s.texto)}</b><span>Mostre: ${marc(s.mostrar)}</span><small>${marc(s.recurso)}</small></li>`).join("")}</ol>
    </div>
  </section>

  <section class="wrap bloco" aria-labelledby="wa-t">
    <h2 id="wa-t" class="sub-t">3 mensagens de WhatsApp</h2>
    <div class="msgs">${c.whatsapp.map((m, i) => `<article class="msg"><b>${esc(m.titulo)}</b><span class="hint">${esc(m.quando)}</span><p id="wa${i}">${marc(m.texto)}</p><button type="button" class="btn ghost sm" data-copiar="wa${i}">Copiar mensagem</button></article>`).join("")}</div>
  </section>

  <section class="wrap bloco" aria-labelledby="cal-t">
    <h2 id="cal-t" class="sub-t">Calendário</h2>
    <div class="chips" role="tablist" aria-label="Versão do calendário">
      <button type="button" role="tab" class="chip ${estado.cal === "dez" ? "on" : ""}" data-cal="dez" aria-selected="${estado.cal === "dez"}">10 dias</button>
      <button type="button" role="tab" class="chip ${estado.cal === "expressa" ? "on" : ""}" data-cal="expressa" aria-selected="${estado.cal === "expressa"}">Expressa: 3 dias</button>
    </div>
    <ol class="cal">${c.calendario[estado.cal].map(d => `<li><span class="dia">Dia ${d.dia}</span><ul>${d.pecas.map(p => { const [tipo, ...nome] = p.split(": "); return `<li><span class="tipo">${esc(tipo)}</span> ${marc(nome.join(": "))}</li>`; }).join("")}</ul></li>`).join("")}</ol>
    <p class="hint">${esc(c.calendario.dica)}</p>
  </section>

  <section class="wrap bloco" aria-labelledby="tut-t">
    <h2 id="tut-t" class="sub-t">Tutorial de edição</h2>
    <ol class="passos">${c.tutorial.map(p => `<li><b>${esc(p.titulo)}</b><span>${marc(p.texto)}</span></li>`).join("")}</ol>
    <div class="ctas">${botaoCompra(tema)}<a class="btn ghost" href="#experimentar">Experimentar uma publicação</a></div>
    ${conviteGestao()}
  </section>`;
}

function viewExperimentar() {
  const tema = temaPorId(SITE, "presentes-por-orcamento");
  return `
  <section class="wrap camp-cab">
    <a class="link voltar" href="#campanhas">← Campanhas prontas</a>
    <p class="eyebrow">Experimentar uma publicação · Presentes por orçamento</p>
    <h1>Monte o carrossel com a cara da sua loja</h1>
    <p class="lede">Troque as fotos, o nome da loja, os textos e os preços. Tudo acontece no seu aparelho: as fotos não são enviadas para lugar nenhum.</p>
  </section>
  <section class="wrap" id="editor"></section>
  <section class="wrap bloco depois-demo">
    <h2 class="sub-t">Gostou? A campanha completa tem 5 carrosséis como este</h2>
    <p>Além de 5 roteiros de Reels, 5 sequências de Stories, 3 mensagens de WhatsApp, calendário e tutorial, por ${preco}.</p>
    <div class="ctas"><a class="btn" href="#campanha/presentes-por-orcamento">Ver a campanha completa</a>${botaoCompra(tema, "ghost")}</div>
    ${conviteGestao()}
  </section>`;
}

/* ---------- rotas ---------- */
function rota() {
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.startsWith("campanha/")) return { tela: "campanha", id: h.slice(9) };
  if (h === "experimentar") return { tela: "experimentar" };
  if (["campanhas", "gestao", "serve", "dentro", "usar"].includes(h)) return { tela: "inicio", ancora: h };
  return { tela: "inicio" };
}
let telaAtual = null;
function render(rolar = true) {
  const r = rota(), app = $("#app");
  const mesmaTela = telaAtual === r.tela + (r.id || "");
  if (!mesmaTela || !rolar) {
    app.innerHTML = r.tela === "campanha" ? viewCampanha(r.id) : r.tela === "experimentar" ? viewExperimentar() : viewInicio();
    if (r.tela === "inicio") montarAntesDepois($("#antes-depois"), presentes);
    if (r.tela === "experimentar") montarEditor($("#editor"), presentes, { toast });
  }
  telaAtual = r.tela + (r.id || "");
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", (a.getAttribute("href") === "#campanhas" && (r.ancora === "campanhas" || r.tela === "campanha")) || (a.getAttribute("href") === "#gestao" && r.ancora === "gestao")));
  if (!rolar) return;
  if (r.ancora) requestAnimationFrame(() => document.getElementById(r.ancora)?.scrollIntoView({ behavior: mesmaTela ? "smooth" : "auto" }));
  else scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const pb = e.target.closest("[data-publico]");
  if (pb) { estado.publico = pb.dataset.publico; guardado.set("nna-publico", estado.publico); const y = scrollY; render(false); scrollTo(0, y); return; }
  const ct = e.target.closest("[data-ctema]");
  if (ct) { estado.tema = +ct.dataset.ctema; const y = scrollY; render(false); scrollTo(0, y); return; }
  const cl = e.target.closest("[data-cal]");
  if (cl) { estado.cal = cl.dataset.cal; const y = scrollY; render(false); scrollTo(0, y); return; }
  const cp = e.target.closest("[data-copiar]");
  if (cp) { const el = document.getElementById(cp.dataset.copiar); copiar(el.innerText, "Texto copiado."); return; }
  const eb = e.target.closest("[data-embreve]");
  if (eb) { toast(`As compras abrem em breve. Enquanto isso, experimente uma publicação.`); return; }
  // mesmo hash: rola até a âncora de novo
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute("href") === location.hash) { e.preventDefault(); render(); }
});
addEventListener("hashchange", () => render());
render();
