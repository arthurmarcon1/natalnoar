import { SITE } from "../config.js";
import demo from "../amostra/presentes-por-orcamento.js";
import { fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato, modeloDoTema, legendaDoTema } from "./logic.js";
import { montarAmostra, montarEditorCompleto } from "./editor.js";
import { montarCarrossel, montarFormatos } from "./demo.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const marc = s => esc(s).replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>");
const multi = s => marc(s).replace(/\n/g, "<br>");
const preco = fmtBRL(SITE.precoCampanha);
const guardado = {
  get(k, f) { try { return localStorage.getItem(k) ?? f; } catch { return f; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} }
};
const estado = { publico: publicoPorId(SITE, guardado.get("nna-publico", "loja")) ? guardado.get("nna-publico", "loja") : "loja", tema: 0, cal: "dez", area: null };
const TEMA_DEMO = temaPorId(SITE, "presentes-por-orcamento");
let montados = [], animou = false;

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }

/* ---------- blocos ---------- */
function botaoComprar(tema, extra = "") {
  const c = estadoCompra(tema, SITE);
  if (c.tipo === "em-preparacao") return "";
  const fora = c.tipo === "checkout" ? ` target="_blank" rel="noopener"` : "";
  return `<a class="btn grande ${extra}" href="${esc(c.href)}"${fora} data-compra="${c.tipo}">${esc(c.rotulo)}</a>`;
}
const ENTREGAS = [
  ["5 carrosséis editáveis", "4 telas cada, com legenda. Você baixa os PNGs numerados, sem marca-d'água."],
  ["5 roteiros de Reels", "Abertura, cenas, texto na tela, legenda e chamada final. São roteiros para você gravar, não vídeos prontos, com uma versão para quem prefere não aparecer."],
  ["5 sequências de Stories", "3 telas cada, com enquetes e chamadas."],
  ["3 mensagens de WhatsApp", "Para responder preço, sugerir presentes e avisar prazos."],
  ["Calendário de 10 dias", "Com versão expressa de 3 dias."],
  ["Tutorial curto", "Como fotografar, editar, baixar e publicar."]
];
function verTudo(comTrechos) {
  const t = demo.trechos;
  return `<details class="kit">
    <summary>Ver tudo que vem no kit</summary>
    <div class="kit-corpo">
      <ul class="dentro">${ENTREGAS.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join("")}</ul>
      <ol class="passos"><li><b>Compre a campanha</b><span>${preco}, uma campanha por compra.</span></li><li><b>Receba o link de acesso</b><span>A campanha completa fica na sua área.</span></li><li><b>Troque fotos, preços e a marca</b><span>No celular, direto no site.</span></li><li><b>Baixe e publique</b><span>Seguindo o calendário.</span></li></ol>
      ${comTrechos ? `<h3 class="trechos-t">Um pedaço do conteúdo</h3><div class="trechos">
        <article class="trecho"><span class="eyebrow">Legenda</span><p>${multi(t.legenda)}</p></article>
        <article class="trecho"><span class="eyebrow">Roteiro de Reel</span><p><b>Abertura:</b> ${marc(t.roteiro.abertura)}</p><p><b>Cena 1:</b> ${marc(t.roteiro.cena)}</p><p class="hint">${esc(t.roteiro.resto)}</p></article>
        <article class="trecho"><span class="eyebrow">Calendário</span><ul>${t.calendario.map(d => `<li><b>Dia ${d.dia}</b> ${marc(d.peca)}</li>`).join("")}</ul><p class="hint">${esc(t.calendarioResto)}</p></article>
      </div>` : ""}
    </div></details>`;
}
const conviteGestao = () => `<p class="convite">Quer alguém cuidando do seu Instagram o ano todo? <a href="#gestao">Gestão mensal</a></p>`;

/* ---------- início ---------- */
function palco() {
  const [p1, p2, p3] = demo.produtos;
  const card = (p, k) => `<figure class="lq lq${k}"><img src="${esc(p.foto)}" alt=""><figcaption>${esc(p.preco)}</figcaption></figure>`;
  return `<div class="palco ${animou ? "pronto" : ""}" aria-hidden="true">
    <div class="leque">${card(p1, 1)}${card(p2, 2)}${card(p3, 3)}</div>
    <div class="post">
      <div class="post-top"><span class="post-av">${esc(demo.marca.charAt(0))}</span>${esc(demo.marca.toLowerCase().replace(/\s+/g, ""))}</div>
      <div class="post-capa"><img class="post-foto" src="${esc(demo.capaFoto)}" alt=""><div class="post-txt"><span class="post-tit">3 presentes até</span><span class="post-preco">${esc(demo.faixa)}</span></div></div>
    </div>
  </div>`;
}
function viewInicio() {
  const pub = publicoPorId(SITE, estado.publico);
  const temas = temasDoPublico(SITE, estado.publico);
  const prontos = temas.filter(t => t.status === "disponivel"), prep = temas.filter(t => t.status !== "disponivel");
  return `
  <section class="hero wrap">
    <div class="hero-txt">
      <h1><span class="l">Fim de ano corrido?</span><span class="l">Seu conteúdo <em>vem pronto.</em></span></h1>
      <p class="lede">Campanhas de Natal para Instagram por ${preco}. Você coloca suas fotos e publica.</p>
      <div class="ctas"><a class="btn grande" href="#campanhas">Escolher minha campanha</a></div>
    </div>
    ${palco()}
  </section>

  <section class="bloco wrap" id="campanhas" aria-labelledby="camp-t">
    <div class="sec-cab"><h2 id="camp-t">Campanhas prontas</h2><span class="preco-tag">${preco} cada</span></div>
    <div class="publicos" role="tablist" aria-label="Seu negócio">
      ${SITE.publicos.map(p => `<button type="button" role="tab" data-publico="${p.id}" aria-selected="${p.id === estado.publico}">${esc(p.nome)}</button>`).join("")}
    </div>
    <p class="pub-chamada">${esc(pub.chamada)}</p>
    ${prontos.map(t => `<a class="destaque-camp" href="#campanha/${t.id}">
        <img src="${esc(demo.capaFoto)}" alt="">
        <span class="dc-txt"><span class="selo ok">Disponível</span><b>${esc(t.nome)}</b><span>${esc(t.descricao)}</span><span class="dc-ir">Ver campanha →</span></span>
      </a>`).join("")}
    <ul class="lista-prep">${prep.map(t => `<li><div><b>${esc(t.nome)}</b>${t.paraQuem ? `<span>Para: ${esc(t.paraQuem)}</span>` : `<span>${esc(t.descricao)}</span>`}</div><span class="selo prep">Em preparação</span></li>`).join("")}</ul>
    ${verTudo(false)}
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
  const tema = temaPorId(SITE, id);
  if (!tema || tema.status !== "disponivel") return `<section class="wrap topo-pag"><h1>Em preparação</h1><p class="lede">Este tema ainda não está pronto.</p><a class="btn" href="#campanhas">Ver campanhas</a></section>`;
  return `
  <section class="wrap camp-top">
    <p class="eyebrow">${esc(publicoPorId(SITE, tema.publico).nome)} · ${preco}</p>
    <h1>${esc(tema.nome)}</h1>
    <div id="carrossel"></div>
    <div class="acoes">${botaoComprar(tema)}<a class="btn grande ghost" href="#testar">Testar com a minha foto</a></div>
  </section>
  <section class="wrap bloco formatos" aria-labelledby="fmt-t">
    <h2 id="fmt-t" class="sub-t">Também em Reel e Stories</h2>
    <div id="formatos" class="demo"></div>
  </section>
  <section class="wrap bloco">${verTudo(true)}${conviteGestao()}</section>`;
}

/* ---------- revisão do pedido (modo de testes) ---------- */
function viewPedido(id) {
  const tema = temaPorId(SITE, id), c = tema && estadoCompra(tema, SITE);
  if (!tema || c.tipo === "em-preparacao") return `<section class="wrap topo-pag"><h1>Campanha indisponível</h1><a class="btn" href="#campanhas">Ver campanhas</a></section>`;
  const checkout = c.checkout || c.href;
  return `
  <section class="wrap topo-pag pedido">
    <a class="link voltar" href="#campanha/${tema.id}">← ${esc(tema.nome)}</a>
    <p class="eyebrow">Revisão do pedido</p>
    <h1>Confira antes de pagar</h1>
    <div class="recibo">
      <div class="rc-linha"><span><b>${esc(tema.nome)}</b><small>Campanha pronta · ${esc(publicoPorId(SITE, tema.publico).nome)}</small></span><b class="num">${preco}</b></div>
      <ul class="rc-itens">${ENTREGAS.map(([a]) => `<li>${a}</li>`).join("")}</ul>
      <div class="rc-total"><span>Total</span><b class="num">${preco}</b></div>
    </div>
    <p class="aviso-pedido" role="note"><b>Nenhum pagamento foi feito.</b> Esta tela só mostra o pedido. O pagamento acontece no próximo passo e o acesso é liberado depois da confirmação.</p>
    ${checkout ? `<a class="btn grande block" href="${esc(checkout)}" target="_blank" rel="noopener" data-checkout>Continuar para o pagamento</a>` : `<p class="aviso">O checkout ainda não foi configurado.</p>`}
  </section>`;
}

/* ---------- teste grátis ---------- */
function viewTestar() {
  return `
  <section class="wrap topo-pag">
    <a class="link voltar" href="#campanha/presentes-por-orcamento">← Presentes por orçamento</a>
    <h1>Teste com a sua foto</h1>
    <p class="lede">Troque a foto, o produto e o preço. A foto fica só no seu celular.</p>
  </section>
  <section class="wrap" id="amostra-editor"></section>
  <section class="wrap bloco">
    <div class="acoes">${botaoComprar(TEMA_DEMO)}</div>
    <p class="hint">Na campanha comprada você edita os 5 carrosséis inteiros e baixa tudo sem marca-d'água.</p>
  </section>`;
}

/* ---------- área da cliente ---------- */
const TOKEN_K = "nna-acesso";
function viewArea() {
  const a = estado.area;
  if (!guardado.get(TOKEN_K, "")) return `
    <section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Sua campanha fica aqui</h1>
      <p class="lede">Depois da confirmação do pagamento, você recebe um link de acesso. Abra o link neste aparelho.</p>
      <div class="acoes"><a class="btn grande ghost" href="#campanha/presentes-por-orcamento">Ver a campanha</a></div></section>`;
  if (!a || a.carregando) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Abrindo sua campanha…</h1></section>`;
  if (a.erro) return `<section class="wrap topo-pag"><p class="eyebrow">Área da cliente</p><h1>Não foi possível abrir</h1><p class="lede">${esc(a.erro)}</p>
      <button type="button" class="btn ghost" data-sair>Remover acesso deste aparelho</button></section>`;
  const c = a.campanha, t = c.temas[estado.tema] || c.temas[0];
  return `
  <section class="wrap topo-pag">
    <p class="eyebrow">Área da cliente · acesso até ${new Date(a.acesso.expira).toLocaleDateString("pt-BR")}</p>
    <h1>${esc(c.nome)}</h1>
  </section>
  <section class="wrap bloco" aria-labelledby="car-t">
    <h2 id="car-t" class="sub-t">5 carrosséis</h2>
    <div class="chips" role="tablist" aria-label="Carrossel">${c.temas.map((x, i) => `<button type="button" role="tab" class="chip ${i === estado.tema ? "on" : ""}" data-ctema="${i}" aria-selected="${i === estado.tema}">${i + 1}. ${esc(x.nome)}</button>`).join("")}</div>
    <p class="ideia"><b>${esc(t.nome)}.</b> ${esc(t.ideia)} <span class="hint">Fotografe: ${esc(t.fotografar)}</span></p>
    <div id="editor-completo"></div>
  </section>
  <section class="wrap bloco">
    <details class="kit" open><summary>Roteiro de Reel · ${marc(t.reel.nome)}</summary><div class="kit-corpo">
      <p class="aviso-reel">Roteiro para você gravar (${esc(t.reel.duracao)}). Não é um vídeo pronto.</p>
      <dl class="roteiro">
        <dt>Abertura</dt><dd>${marc(t.reel.abertura)}</dd>
        <dt>Cenas</dt><dd><ol>${t.reel.cenas.map(s => `<li>${marc(s.filmar)}<br><span class="tt">Texto na tela: “${marc(s.texto)}”</span></li>`).join("")}</ol></dd>
        <dt>Legenda</dt><dd>${marc(t.reel.legenda)}</dd><dt>Chamada final</dt><dd>${marc(t.reel.chamadaFinal)}</dd><dt>Sem aparecer</dt><dd>${marc(t.reel.semAparecer)}</dd>
      </dl></div></details>
    <details class="kit"><summary>Stories · ${marc(t.stories.nome)}</summary><div class="kit-corpo">
      <ol class="stories-txt">${t.stories.telas.map((s, i) => `<li><span class="n">Tela ${i + 1}</span><b>${marc(s.texto)}</b><span>Mostre: ${marc(s.mostrar)}</span><small>${marc(s.recurso)}</small></li>`).join("")}</ol></div></details>
    <details class="kit"><summary>3 mensagens de WhatsApp</summary><div class="kit-corpo">
      <div class="msgs">${c.whatsapp.map((m, i) => `<article class="msg"><b>${esc(m.titulo)}</b><span class="hint">${esc(m.quando)}</span><p id="wa${i}">${marc(m.texto)}</p><button type="button" class="btn ghost sm" data-copiar="wa${i}">Copiar mensagem</button></article>`).join("")}</div></div></details>
    <details class="kit"><summary>Calendário</summary><div class="kit-corpo">
      <div class="chips" role="tablist" aria-label="Versão do calendário">
        <button type="button" role="tab" class="chip ${estado.cal === "dez" ? "on" : ""}" data-cal="dez" aria-selected="${estado.cal === "dez"}">10 dias</button>
        <button type="button" role="tab" class="chip ${estado.cal === "expressa" ? "on" : ""}" data-cal="expressa" aria-selected="${estado.cal === "expressa"}">Expressa: 3 dias</button>
      </div>
      ${["dez", "expressa"].map(v => `<ol class="cal" data-calv="${v}" ${v === estado.cal ? "" : "hidden"}>${c.calendario[v].map(d => `<li><span class="dia">Dia ${d.dia}</span><ul>${d.pecas.map(p => { const [tipo, ...nome] = p.split(": "); return `<li><span class="tipo">${esc(tipo)}</span> ${marc(nome.join(": "))}</li>`; }).join("")}</ul></li>`).join("")}</ol>`).join("")}
      <p class="hint">${esc(c.calendario.dica)}</p></div></details>
    <details class="kit"><summary>Tutorial</summary><div class="kit-corpo">
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
    estado.area = r.ok ? { acesso: d.acesso, campanha: d.campanha } : { erro: d.erro || "Acesso inválido ou expirado." };
  } catch { estado.area = { erro: "Sem conexão. Tente de novo em instantes." }; }
  if (rota().tela === "area") render(false);
}
function montarEditorDaArea() {
  const c = estado.area.campanha, i = estado.tema, t = c.temas[i];
  montarEditorCompleto($("#editor-completo"), modeloDoTema(t), { nome: t.carrossel.nome.replace(/\[|\]/g, ""), numero: i + 1, exemplo: i === 0 && c.editor ? c.editor.exemplo : null, legenda: st => legendaDoTema(c, i, st), toast });
}

/* ---------- rotas ---------- */
function rota() {
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.startsWith("acesso=")) return { tela: "acesso", token: h.slice(7) };
  if (h.startsWith("campanha/")) return { tela: "campanha", id: h.slice(9) };
  if (h.startsWith("pedido/")) return { tela: "pedido", id: h.slice(7) };
  if (h === "testar" || h === "experimentar") return { tela: "testar" };
  if (h === "area") return { tela: "area" };
  if (h === "demo") return { tela: "campanha", id: "presentes-por-orcamento" };
  if (["campanhas", "gestao", "dentro"].includes(h)) return { tela: "inicio", ancora: h };
  return { tela: "inicio" };
}
let telaAtual = null;
function render(rolar = true) {
  const r = rota(), app = $("#app");
  if (r.tela === "acesso") { guardado.set(TOKEN_K, r.token); estado.area = null; history.replaceState(null, "", "#area"); return render(); }
  if (r.tela === "area" && !estado.area && guardado.get(TOKEN_K, "")) carregarArea();
  const chave = r.tela + (r.id || ""), mesma = telaAtual === chave;
  if (!mesma || !rolar) {
    montados.forEach(m => m && m.destruir && m.destruir()); montados = [];
    app.innerHTML = r.tela === "campanha" ? viewCampanha(r.id) : r.tela === "pedido" ? viewPedido(r.id) : r.tela === "testar" ? viewTestar() : r.tela === "area" ? viewArea() : viewInicio();
    if (r.tela === "inicio") animou = true; // a animação da capa acontece uma vez por visita
    if (r.tela === "campanha" && $("#carrossel")) {
      let fmts = null;
      const car = montarCarrossel($("#carrossel"), demo, { aoMudar: i => fmts && fmts.escolher(i) });
      fmts = montarFormatos($("#formatos"), demo, { aoMudar: i => car.irParaProduto(i) });
      montados.push(car, fmts);
    }
    if (r.tela === "testar") montarAmostra($("#amostra-editor"), demo, { toast });
    if (r.tela === "area" && estado.area && estado.area.campanha) montarEditorDaArea();
  }
  telaAtual = chave;
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", (a.getAttribute("href") === "#campanhas" && (r.ancora === "campanhas" || r.tela === "campanha")) || (a.getAttribute("href") === "#gestao" && r.ancora === "gestao")));
  if (!rolar) return;
  if (r.ancora) requestAnimationFrame(() => document.getElementById(r.ancora)?.scrollIntoView({ behavior: mesma && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto" }));
  else scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const manter = fn => { const y = scrollY; fn(); render(false); scrollTo(0, y); };
  const pb = e.target.closest("[data-publico]");
  if (pb) { manter(() => { estado.publico = pb.dataset.publico; guardado.set("nna-publico", estado.publico); }); return; }
  const ct = e.target.closest("[data-ctema]");
  if (ct) { manter(() => { estado.tema = +ct.dataset.ctema; }); return; }
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
addEventListener("hashchange", () => render());
render();
