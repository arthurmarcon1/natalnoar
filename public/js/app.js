import { SITE } from "../config.js";
import demo from "../amostra/presentes-por-orcamento.js";
import { fmtBRL, temasDoPublico, publicoPorId, temaPorId, estadoCompra, linkContato, modeloDoTema, legendaDoTema } from "./logic.js";
import { montarAmostra, montarEditorCompleto } from "./editor.js";
import { montarDemo } from "./demo.js";

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
let demoAtual = null;

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }

/* ---------- compra ---------- */
const TEMA_DEMO = temaPorId(SITE, "presentes-por-orcamento");
function compraHTML(tema, { destaque = false } = {}) {
  const c = estadoCompra(tema, SITE);
  if (c.tipo === "checkout") return `<a class="btn ${destaque ? "grande" : ""}" href="${esc(c.href)}" target="_blank" rel="noopener" data-compra="${tema.id}">${esc(c.rotulo)}</a>`;
  if (c.tipo === "em-breve") return `<p class="em-breve" data-compra="${tema.id}"><span aria-hidden="true">✦</span> ${esc(c.rotulo)}. A demonstração já está liberada.</p>`;
  return "";
}
const conviteGestao = () => `<p class="convite">Prefere alguém cuidando do seu Instagram o ano todo? <a href="#gestao">Conheça a gestão mensal</a></p>`;

function temaCard(t) {
  const pronto = t.status === "disponivel";
  return `<article class="tema ${pronto ? "pronto" : "prep"}">
    <div class="tema-topo"><h3>${esc(t.nome)}</h3><span class="selo ${pronto ? "ok" : "prep"}">${pronto ? "Disponível" : "Em preparação"}</span></div>
    <p>${esc(t.descricao)}</p>
    ${t.paraQuem ? `<p class="para"><b>Faz sentido para:</b> ${esc(t.paraQuem)}</p>` : ""}
    ${pronto ? `<div class="tema-acoes"><a class="btn" href="#testar">Testar com a minha foto</a><a class="btn ghost" href="#demo">Ver a demonstração</a></div>${compraHTML(t)}`
             : `<p class="hint">O material deste tema está sendo preparado.</p>`}
  </article>`;
}
const DENTRO = [
  ["5 carrosséis editáveis", "4 telas cada, com legenda. Você baixa os PNGs numerados, sem marca-d'água."],
  ["5 roteiros de Reels", "Abertura, cenas, texto na tela, legenda e chamada final. <b>São roteiros para você gravar, não vídeos prontos.</b> Cada um tem uma versão para quem prefere não aparecer."],
  ["5 sequências de Stories", "3 telas cada, com enquetes e chamadas."],
  ["3 mensagens de WhatsApp", "Para responder preço, sugerir presentes e avisar prazos."],
  ["Calendário de 10 dias", "Com versão expressa de 3 dias."],
  ["Tutorial curto", "Como fotografar, editar, baixar e publicar."]
];

/* ---------- página inicial ---------- */
function viewInicio() {
  const pub = publicoPorId(SITE, estado.publico), t = demo.trechos;
  return `
  <section class="hero wrap">
    <p class="eyebrow"><span class="estrela" aria-hidden="true">✦</span> Campanhas de Natal para Instagram</p>
    <h1><span class="l">Fim de ano corrido?</span><span class="l">Seu conteúdo <em>vem pronto.</em></span></h1>
    <p class="lede">Escolha sua campanha de Natal por ${preco}. Os carrosséis, os roteiros de Reels e o calendário já vêm preparados. Você coloca suas fotos, adapta os textos e publica.</p>
    <div class="ctas"><a class="btn grande" href="#campanhas">Escolher minha campanha</a><a class="link" href="#gestao">Conhecer a gestão mensal</a></div>
  </section>

  <section class="amostra" id="demo" aria-labelledby="demo-t">
    <div class="wrap">
      <p class="eyebrow">Campanha pronta · Presentes por orçamento</p>
      <div class="sec-cab"><h2 id="demo-t">Veja um produto em três formatos</h2><p>Escolha um dos produtos de exemplo e explore o carrossel, o Reel e os Stories.</p></div>
      <div id="demo-widget" class="demo"></div>
      <div class="testar-cta">
        <a class="btn grande destaque" href="#testar">Testar com a minha foto</a>
        <span class="hint">Troque a foto, o produto e o preço numa tela de amostra. A foto não sai do seu celular.</span>
      </div>
    </div>
  </section>

  <section class="bloco wrap" id="campanhas" aria-labelledby="camp-t">
    <p class="eyebrow">Campanhas prontas</p>
    <div class="sec-cab"><h2 id="camp-t">Uma campanha completa por <span class="preco">${preco}</span></h2><p>Cada compra dá acesso a uma campanha à sua escolha. Você adapta com as suas fotos e publica.</p></div>
    <div class="publicos" role="tablist" aria-label="Seu tipo de negócio">
      ${SITE.publicos.map(p => `<button type="button" role="tab" data-publico="${p.id}" aria-selected="${p.id === estado.publico}">${esc(p.nome)}</button>`).join("")}
    </div>
    <p class="pub-chamada">${esc(pub.chamada)}</p>
    <div class="temas">${temasDoPublico(SITE, estado.publico).map(temaCard).join("")}</div>
  </section>

  <section class="bloco wrap" id="dentro" aria-labelledby="dentro-t">
    <h2 id="dentro-t" class="sub-t">O que vem em cada campanha</h2>
    <ul class="dentro">${DENTRO.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join("")}</ul>

    <h3 class="trechos-t">Um pedaço de Presentes por orçamento</h3>
    <div class="trechos">
      <article class="trecho"><span class="eyebrow">Legenda</span><p>${multi(t.legenda)}</p></article>
      <article class="trecho"><span class="eyebrow">Roteiro de Reel</span><p><b>${marc(t.roteiro.nome)}</b></p><p><b>Abertura:</b> ${marc(t.roteiro.abertura)}</p><p><b>Cena 1:</b> ${marc(t.roteiro.cena)}</p><p class="hint">${esc(t.roteiro.resto)}</p></article>
      <article class="trecho"><span class="eyebrow">Calendário</span><ul>${t.calendario.map(d => `<li><b>Dia ${d.dia}</b> ${marc(d.peca)}</li>`).join("")}</ul><p class="hint">${esc(t.calendarioResto)}</p></article>
    </div>
    <p class="trava"><span aria-hidden="true">🔒</span> O conteúdo completo fica na área da cliente, liberada depois da confirmação do pagamento.</p>
    ${compraHTML(TEMA_DEMO, { destaque: true })}
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

function viewTestar() {
  return `
  <section class="wrap camp-cab">
    <a class="link voltar" href="#demo">← Demonstração</a>
    <p class="eyebrow">Testar com a minha foto</p>
    <h1>Veja o seu produto no carrossel</h1>
    <p class="lede">Troque a foto, o nome do produto e o preço. O resultado aparece na hora, e a foto não é enviada para lugar nenhum.</p>
  </section>
  <section class="wrap" id="amostra-editor"></section>
  <section class="wrap bloco depois-demo">
    <h2 class="sub-t">Na campanha completa, você edita tudo</h2>
    <p>As 4 telas de cada um dos 5 carrosséis, com a marca da sua loja, e baixa os PNGs numerados sem marca-d'água. Junto vêm os roteiros de Reels, os Stories, as mensagens, o calendário e o tutorial, por ${preco}.</p>
    <div class="ctas"><a class="btn" href="#campanhas">Escolher minha campanha</a></div>
    ${compraHTML(TEMA_DEMO)}
    ${conviteGestao()}
  </section>`;
}

/* ---------- área da cliente ---------- */
const TOKEN_K = "nna-acesso";
function viewArea() {
  const a = estado.area;
  if (!guardado.get(TOKEN_K, "")) return `
    <section class="wrap camp-cab"><p class="eyebrow">Área da cliente</p><h1>Sua campanha fica aqui</h1>
      <p class="lede">O acesso chega depois da confirmação do pagamento, por um link. Abra esse link neste aparelho para ver e editar a sua campanha.</p>
      ${compraHTML(TEMA_DEMO)}<div class="ctas"><a class="btn ghost" href="#demo">Ver a demonstração</a></div></section>`;
  if (!a || a.carregando) return `<section class="wrap camp-cab"><p class="eyebrow">Área da cliente</p><h1>Abrindo sua campanha…</h1></section>`;
  if (a.erro) return `<section class="wrap camp-cab"><p class="eyebrow">Área da cliente</p><h1>Não foi possível abrir</h1><p class="lede">${esc(a.erro)}</p>
      <div class="ctas"><button type="button" class="btn ghost" data-sair>Remover acesso deste aparelho</button></div></section>`;
  const c = a.campanha, t = c.temas[estado.tema] || c.temas[0];
  return `
  <section class="wrap camp-cab">
    <p class="eyebrow">Área da cliente · acesso válido até ${new Date(a.acesso.expira).toLocaleDateString("pt-BR")}</p>
    <h1>${esc(c.nome)}</h1>
    <p class="lede">${esc(c.resumo)} Troque o que está entre colchetes, como <mark>[preço]</mark>.</p>
  </section>
  <section class="wrap bloco" aria-labelledby="car-t">
    <h2 id="car-t" class="sub-t">5 carrosséis</h2>
    <div class="chips" role="tablist" aria-label="Carrossel">${c.temas.map((x, i) => `<button type="button" role="tab" class="chip ${i === estado.tema ? "on" : ""}" data-ctema="${i}" aria-selected="${i === estado.tema}">${i + 1}. ${esc(x.nome)}</button>`).join("")}</div>
    <p class="ideia"><b>${esc(t.nome)}.</b> ${esc(t.ideia)}</p>
    <p class="hint"><b>Fotografe uma vez:</b> ${esc(t.fotografar)}</p>
    <div id="editor-completo"></div>
  </section>
  <section class="wrap bloco">
    <h2 class="sub-t">Roteiro de Reel · ${marc(t.reel.nome)}</h2>
    <p class="aviso-reel">Roteiro para você gravar (${esc(t.reel.duracao)}). Não é um vídeo pronto.</p>
    <dl class="roteiro">
      <dt>Abertura</dt><dd>${marc(t.reel.abertura)}</dd>
      <dt>Cenas</dt><dd><ol>${t.reel.cenas.map(s => `<li>${marc(s.filmar)}<br><span class="tt">Texto na tela: “${marc(s.texto)}”</span></li>`).join("")}</ol></dd>
      <dt>Legenda</dt><dd>${marc(t.reel.legenda)}</dd>
      <dt>Chamada final</dt><dd>${marc(t.reel.chamadaFinal)}</dd>
      <dt>Sem aparecer</dt><dd>${marc(t.reel.semAparecer)}</dd>
    </dl>
    <h2 class="sub-t" style="margin-top:28px">Stories · ${marc(t.stories.nome)}</h2>
    <ol class="stories-txt">${t.stories.telas.map((s, i) => `<li><span class="n">Tela ${i + 1}</span><b>${marc(s.texto)}</b><span>Mostre: ${marc(s.mostrar)}</span><small>${marc(s.recurso)}</small></li>`).join("")}</ol>
  </section>
  <section class="wrap bloco">
    <h2 class="sub-t">3 mensagens de WhatsApp</h2>
    <div class="msgs">${c.whatsapp.map((m, i) => `<article class="msg"><b>${esc(m.titulo)}</b><span class="hint">${esc(m.quando)}</span><p id="wa${i}">${marc(m.texto)}</p><button type="button" class="btn ghost sm" data-copiar="wa${i}">Copiar mensagem</button></article>`).join("")}</div>
  </section>
  <section class="wrap bloco">
    <h2 class="sub-t">Calendário</h2>
    <div class="chips" role="tablist" aria-label="Versão do calendário">
      <button type="button" role="tab" class="chip ${estado.cal === "dez" ? "on" : ""}" data-cal="dez" aria-selected="${estado.cal === "dez"}">10 dias</button>
      <button type="button" role="tab" class="chip ${estado.cal === "expressa" ? "on" : ""}" data-cal="expressa" aria-selected="${estado.cal === "expressa"}">Expressa: 3 dias</button>
    </div>
    ${["dez", "expressa"].map(v => `<ol class="cal" data-calv="${v}" ${v === estado.cal ? "" : "hidden"}>${c.calendario[v].map(d => `<li><span class="dia">Dia ${d.dia}</span><ul>${d.pecas.map(p => { const [tipo, ...nome] = p.split(": "); return `<li><span class="tipo">${esc(tipo)}</span> ${marc(nome.join(": "))}</li>`; }).join("")}</ul></li>`).join("")}</ol>`).join("")}
    <p class="hint">${esc(c.calendario.dica)}</p>
  </section>
  <section class="wrap bloco">
    <h2 class="sub-t">Tutorial</h2>
    <ol class="passos">${c.tutorial.map(p => `<li><b>${esc(p.titulo)}</b><span>${marc(p.texto)}</span></li>`).join("")}</ol>
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
  const exemplo = i === 0 && c.editor ? c.editor.exemplo : null;
  montarEditorCompleto($("#editor-completo"), modeloDoTema(t), { nome: t.carrossel.nome.replace(/\[|\]/g, ""), numero: i + 1, exemplo, legenda: st => legendaDoTema(c, i, st), toast });
}

/* ---------- rotas ---------- */
function rota() {
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.startsWith("acesso=")) return { tela: "acesso", token: h.slice(7) };
  if (h === "testar" || h === "experimentar") return { tela: "testar" };
  if (h === "area" || h.startsWith("campanha/")) return { tela: "area" };
  if (["campanhas", "gestao", "demo", "dentro"].includes(h)) return { tela: "inicio", ancora: h };
  return { tela: "inicio" };
}
let telaAtual = null;
function render(rolar = true) {
  const r = rota(), app = $("#app");
  if (r.tela === "acesso") { guardado.set(TOKEN_K, r.token); estado.area = null; history.replaceState(null, "", "#area"); return render(); }
  if (r.tela === "area" && !estado.area && guardado.get(TOKEN_K, "")) carregarArea();
  const mesma = telaAtual === r.tela;
  if (!mesma || !rolar) {
    if (demoAtual) { demoAtual.destruir(); demoAtual = null; }
    app.innerHTML = r.tela === "testar" ? viewTestar() : r.tela === "area" ? viewArea() : viewInicio();
    if (r.tela === "inicio") demoAtual = montarDemo($("#demo-widget"), demo);
    if (r.tela === "testar") montarAmostra($("#amostra-editor"), demo, { toast });
    if (r.tela === "area" && estado.area && estado.area.campanha) montarEditorDaArea();
  }
  telaAtual = r.tela;
  document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === `#${r.ancora || r.tela}`));
  if (!rolar) return;
  if (r.ancora) requestAnimationFrame(() => document.getElementById(r.ancora)?.scrollIntoView({ behavior: mesma ? "smooth" : "auto" }));
  else scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const manter = fn => { const y = scrollY; fn(); render(false); scrollTo(0, y); };
  const pb = e.target.closest("[data-publico]");
  if (pb) { manter(() => { estado.publico = pb.dataset.publico; guardado.set("nna-publico", estado.publico); }); return; }
  const ct = e.target.closest("[data-ctema]");
  if (ct) { manter(() => { estado.tema = +ct.dataset.ctema; }); return; }
  const cl = e.target.closest("[data-cal]");
  if (cl) { // só troca a lista visível: não redesenha a área (preserva o que foi editado no carrossel)
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
