// Testes da configuração, do conteúdo e das regras puras.
// Rodar: node --test tests/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { emitirToken, verificarToken, segredoConfere } from "../private/acesso.js";
import { SITE } from "../public/config.js";
import campanha from "../private/campanhas/presentes-por-orcamento.js";
import servico from "../private/campanhas/seu-toque-nas-festas.js";
import demoServico from "../public/amostra/seu-toque-nas-festas.js";
import demo from "../public/amostra/presentes-por-orcamento.js";
import * as L from "../public/js/logic.js";

const raiz = new URL("../", import.meta.url);
const clone = o => JSON.parse(JSON.stringify(o));
const arquivosPublicos = (dir = fileURLToPath(new URL("public/", raiz))) =>
  readdirSync(dir).flatMap(f => { const p = join(dir, f); return statSync(p).isDirectory() ? arquivosPublicos(p) : [p]; });

test("configuração: preço, modo de compra e públicos", () => {
  assert.equal(SITE.precoCampanha, 89.90);
  assert.equal(L.fmtBRL(SITE.precoCampanha), "R$ 89,90");
  assert.ok(["revisao", "checkout"].includes(SITE.modoCompra));
  assert.match(SITE.whatsappVendas, /^\d{12,13}$/);
  assert.deepEqual(SITE.publicos.map(p => p.nome), ["Tenho uma loja", "Presto um serviço"]);
  assert.deepEqual(L.temasDoPublico(SITE, "loja").map(t => t.nome),
    ["Presentes por orçamento", "Looks para celebrar", "Favoritos da loja", "Natal de última hora", "Looks para a virada"]);
  assert.deepEqual(L.temasDoPublico(SITE, "servico").map(t => t.nome),
    ["Por trás do resultado", "Seu toque nas festas", "Um tempo para cuidar", "Memórias de dezembro", "Um ano de boas histórias"]);
});

test("temas: campos obrigatórios, ids únicos, status e paraQuem", () => {
  const temas = L.todosTemas(SITE);
  assert.equal(new Set(temas.map(t => t.id)).size, temas.length);
  for (const t of temas) {
    for (const k of ["id", "nome", "publico", "descricao", "status", "linksPagamento"]) assert.ok(k in t, `${t.id} sem ${k}`);
    assert.ok(["disponivel", "em-preparacao"].includes(t.status));
    assert.deepEqual({ ...t.linksPagamento }, {}, "links de pagamento ficam vazios até o Arthur definir");
    if (t.publico === "servico") assert.ok(t.paraQuem && t.paraQuem.length > 10, `${t.id} sem paraQuem`);
    assert.ok(!/agendar/i.test(t.nome), "não usar 'como agendar' como tema");
  }
  const disponiveis = temas.filter(t => t.status === "disponivel").map(t => t.id);
  assert.deepEqual(disponiveis, ["presentes-por-orcamento", "seu-toque-nas-festas"], "uma campanha pronta por perfil");
  assert.equal(temas.filter(t => t.status === "em-preparacao").length, 8);
});

test("planos: três compras únicas com preço final, totais e o que acrescentam", () => {
  const [a, b, c] = SITE.planos;
  assert.deepEqual(SITE.planos.map(p => [p.nome, p.preco, p.carrosseis, p.roteiros]),
    [["Natal Pronto", 89.90, 5, 5], ["Natal Completo", 139.90, 8, 8], ["Natal + Virada", 189.90, 11, 11]]);
  assert.deepEqual(SITE.planos.map(p => p.stories), [5, 5, 8]);
  assert.deepEqual(SITE.planos.map(p => L.pecasDoPlano(p)), [45, 60, 85]);
  assert.equal(a.calendario, "10 dias"); assert.equal(b.calendario, "15 dias"); assert.match(c.calendario, /15 dias \+ 5 de Réveillon/);
  assert.ok(b.acrescenta.some(x => /3 carrosséis/.test(x)) && b.acrescenta.some(x => /15 dias/.test(x)));
  assert.ok(c.acrescenta.some(x => /Réveillon/.test(x)) && c.acrescenta.some(x => /5 dias/.test(x)));
  assert.equal(SITE.precoCampanha, Math.min(...SITE.planos.map(p => p.preco)), "\"a partir de\" usa o menor preço");
  assert.deepEqual(L.entregasDoPlano(b).slice(0, 2), ["8 carrosséis editáveis com legendas", "8 roteiros de Reels"]);
  assert.ok(L.entregasDoPlano(a).includes("Peças sem marca-d'água") && L.entregasDoPlano(c).includes("Peças sem marca-d'água"));
});

test("compra: nome e preço exatos do plano na revisão e no checkout, nunca \"em breve\"", () => {
  const teste = { ...SITE, modoCompra: "revisao" }, lancamento = { ...SITE, modoCompra: "checkout" };
  for (const id of ["presentes-por-orcamento", "seu-toque-nas-festas"]) {
    const tema = clone(L.temaPorId(SITE, id));
    for (const p of SITE.planos) {
      const preco = L.fmtBRL(p.preco);
      const r = L.estadoCompra(tema, p, teste);
      assert.equal(r.tipo, "revisao"); assert.equal(r.rotulo, `Comprar ${p.nome} · ${preco}`); assert.equal(r.href, `#pedido/${id}/${p.id}`);
      const c = L.estadoCompra(tema, p, lancamento);
      assert.equal(c.tipo, "checkout"); assert.equal(c.rotulo, `Comprar ${p.nome} · ${preco}`);
      const msg = decodeURIComponent(c.href.split("?text=")[1]);
      assert.ok(msg.includes(`campanha ${tema.nome} no plano ${p.nome}, por ${preco}`), msg);
    }
    tema.linksPagamento = { "natal-completo": " https://pagamento.exemplo/completo " };
    assert.equal(L.estadoCompra(tema, L.planoPorId(SITE, "natal-completo"), lancamento).href, "https://pagamento.exemplo/completo", "link do plano tem prioridade");
    assert.ok(L.estadoCompra(tema, L.planoPorId(SITE, "natal-pronto"), lancamento).href.startsWith("https://wa.me/"), "plano sem link usa o WhatsApp");
    tema.linksPagamento = { "natal-pronto": "javascript:alert(1)" };
    assert.ok(L.estadoCompra(tema, L.planoPorId(SITE, "natal-pronto"), lancamento).href.startsWith("https://wa.me/"), "link inválido é ignorado");
  }
  const tema = L.temaPorId(SITE, "presentes-por-orcamento");
  assert.equal(L.estadoCompra(tema, SITE.planos[1], { ...lancamento, whatsappVendas: "" }).tipo, "revisao", "sem checkout configurado, cai na revisão");
  assert.equal(L.estadoCompra(L.temaPorId(SITE, "looks-para-celebrar"), SITE.planos[0], lancamento).tipo, "em-preparacao");
});

test("contato da gestão: número, link, vazio", () => {
  assert.equal(L.linkContato("", "oi"), null);
  assert.equal(L.linkContato("123", "oi"), null);
  assert.equal(L.linkContato("55 55 9940-8766", "Olá"), "https://wa.me/555599408766?text=Ol%C3%A1");
  assert.equal(L.linkContato("https://wa.me/5555999999999", "Oi"), "https://wa.me/5555999999999?text=Oi");
  assert.equal(L.linkContato("https://calendly.com/arthur", "Oi"), "https://calendly.com/arthur");
  assert.ok(L.linkContato(SITE.contatoGestao, SITE.mensagemGestao).startsWith("https://wa.me/"));
});

test("kit: 11 roteiros e 8 sequências por coleção, ligados aos carrosséis do catálogo", async () => {
  const { CATALOGO } = await import("../public/catalogo/index.js");
  const { LAYOUTS } = await import("../public/js/estudio.js");
  for (const c of [campanha, servico]) {
    const cat = CATALOGO[c.id].carrosseis;
    assert.equal(c.reels.length, 11, c.id); assert.equal(c.stories.length, 8, c.id);
    assert.deepEqual(c.reels.map(r => r.carrossel), cat.map(x => x.id), `${c.id}: um roteiro por carrossel, na mesma ordem`);
    assert.deepEqual(c.reels.map(r => r.nivel), cat.map(x => x.nivel), `${c.id}: roteiro no nível do carrossel`);
    assert.deepEqual(c.stories.map(x => x.nivel), [1, 1, 1, 1, 1, 3, 3, 3], `${c.id}: 5 de Natal e 3 de Réveillon`);
    const ids = new Set();
    for (const r of c.reels) {
      assert.ok(!ids.has(r.id)); ids.add(r.id);
      for (const k of ["nome", "duracao", "ideia", "preparar", "semAparecer", "legenda"]) assert.ok(String(r[k] || "").length > 5, `${r.id}: ${k}`);
      assert.ok(r.abertura.filmar && r.abertura.fala && r.final.filmar && r.final.texto, `${r.id}: abertura e final`);
      assert.ok(r.cenas.length >= 3 && r.cenas.every(x => x.filmar && x.texto), `${r.id}: cenas com o que filmar e o texto na tela`);
      assert.ok(/WhatsApp|direct|coment/i.test(r.legenda), `${r.id}: legenda com chamada`);
      assert.ok((JSON.stringify(r).match(/\[[^\]]+\]/g) || []).length <= 8, `${r.id}: poucos campos para preencher`);
    }
    for (const st of c.stories) {
      assert.ok(cat.some(x => x.id === st.carrossel && x.nivel === st.nivel), `${st.id}: ligado a um carrossel do mesmo nível`);
      assert.equal(st.telas.length, 3, `${st.id}: 3 telas`);
      for (const t of st.telas) {
        const lay = LAYOUTS[t.l]; assert.ok(lay && lay.story, `${st.id}: composição de Stories ${t.l}`);
        assert.equal((t.f || []).length, lay.fotos, `${st.id}/${t.l}: fotos`);
        for (const f of t.f || []) assert.ok(existsSync(new URL(`public/${f}`, raiz)), f);
        assert.ok(t.nota && t.nota.foto, `${st.id}: diz onde entra a foto`);
        const a = t.nota.adesivo; if (a && a.tipo === "Enquete") assert.ok(a.pergunta && a.respostas.length === 2, `${st.id}: enquete com pergunta e 2 respostas`);
      }
      assert.ok(st.telas.some(t => t.l === "st-acao" || t.l === "st-caixa" || t.l === "st-lista"), `${st.id}: termina com uma ação`);
    }
    assert.equal(c.whatsapp.length, 3); assert.ok(c.tutorial.length >= 5);
    const k = c.calendario; assert.equal(k.dez.length, 10); assert.equal(k.expressa.length, 3); assert.equal(k.quinze.length, 15); assert.equal(k.reveillon.length, 5);
  }
});

test("planos: 5/8/11 roteiros, 5/5/8 Stories e calendários só com o que o plano libera", async () => {
  const { carrosseisDoNivel } = await import("../public/catalogo/index.js");
  for (const c of [campanha, servico]) for (const p of SITE.planos) {
    const lib = L.conteudoDoPlano(c, p), carrs = carrosseisDoNivel(c.id, p.nivel);
    assert.equal(carrs.length, p.carrosseis); assert.equal(lib.reels.length, p.roteiros, `${c.id} ${p.id}: roteiros`); assert.equal(lib.stories.length, p.stories, `${c.id} ${p.id}: Stories`);
    const cals = Object.fromEntries(L.calendariosDoConteudo(lib).map(([k, , d]) => [k, d.length]));
    assert.deepEqual(cals, p.nivel === 1 ? { dez: 10, expressa: 3 } : p.nivel === 2 ? { quinze: 15, expressa: 3 } : { quinze: 15, reveillon: 5, expressa: 3 }, `${c.id} ${p.id}: calendários`);
    assert.deepEqual(L.conferirCalendario(lib, carrs), [], `${c.id} ${p.id}: calendário só cita material do plano`);
    // todo material do plano aparece no calendário principal (Natal + Réveillon)
    const usados = new Set(L.calendariosDoConteudo(lib).filter(([k]) => k !== "expressa").flatMap(([, , d]) => d.flatMap(x => x.itens.map(it => `${it.f}:${it.ref}`))));
    for (const x of carrs) assert.ok(usados.has(`carrossel:${x.id}`), `${c.id} ${p.id}: calendário usa ${x.id}`);
    for (const x of lib.reels) assert.ok(usados.has(`reel:${x.id}`), `${c.id} ${p.id}: calendário usa ${x.id}`);
    for (const x of lib.stories) assert.ok(usados.has(`stories:${x.id}`), `${c.id} ${p.id}: calendário usa ${x.id}`);
  }
  assert.equal(campanha.reels.length, 11, "o original não é alterado");
});

test("enquadramento cover: cobre a caixa, sem distorcer, respeitando zoom e foco", () => {
  const box = [1080, 1350];
  for (const [iw, ih] of [[3024, 4032], [4032, 3024], [1080, 1350], [800, 800]]) {
    const r = L.coverRect(iw, ih, ...box);
    assert.ok(Math.abs(r.sw / r.sh - 1080 / 1350) < 1e-9, "mesma proporção da tela");
    assert.ok(r.sx >= 0 && r.sy >= 0 && r.sx + r.sw <= iw + 1e-9 && r.sy + r.sh <= ih + 1e-9, "dentro da foto");
    assert.ok(Math.abs(r.sw - iw) < 1e-6 || Math.abs(r.sh - ih) < 1e-6, "usa a dimensão limitante inteira");
  }
  const z = L.coverRect(4032, 3024, ...box, 2);
  assert.ok(z.sh < 3024 / 1.99);
  const esq = L.coverRect(4032, 3024, ...box, 1, 0, 0.5);
  assert.equal(esq.sx, 0);
});

test("quebra de texto respeita a largura e diminui a fonte", () => {
  const m = (s, size = 10) => s.length * size;
  assert.deepEqual(L.quebrarLinhas("um dois tres quatro", 90, s => m(s)), ["um dois", "tres", "quatro"]);
  const r = L.ajustarTexto("Presentes até cem reais", 160, 2, [10, 8, 6], m);
  assert.ok(r.linhas.length <= 2 && r.linhas.every(l => m(l, r.size) <= 160));
});

test("zip store: estrutura válida e CRC correto", () => {
  assert.equal(L.crc32(new TextEncoder().encode("123456789")), 0xCBF43926);
  const a = new Uint8Array([1, 2, 3]), b = new TextEncoder().encode("olá");
  const z = L.zipStore([{ name: "01-a.png", data: a }, { name: "02-b.png", data: b }]);
  const dv = new DataView(z.buffer);
  assert.equal(dv.getUint32(0, true), 0x04034b50);
  const fim = z.length - 22;
  assert.equal(dv.getUint32(fim, true), 0x06054b50);
  assert.equal(dv.getUint16(fim + 10, true), 2);
});

test("sem restos do modelo antigo no site público", () => {
  const todo = arquivosPublicos().filter(f => /\.(html|js)$/.test(f)).map(f => readFileSync(f, "utf8")).join("\n");
  for (const proibido of [/690/, /em breve/i, /Presente Certo/, /Última Chamada/, /Virada de Look/, /pacotes?\b/i, /Enviar solicitação/, /carrinho/i, /Essencial/])
    assert.ok(!proibido.test(todo), `sobrou: ${proibido}`);
});

test("área paga: nenhum texto pago aparece nos arquivos públicos (só os trechos da vitrine)", async () => {
  const { CATALOGO } = await import("../public/catalogo/index.js");
  const doCatalogo = new Set(Object.values(CATALOGO).flatMap(c => c.carrosseis.flatMap(x => x.telas.flatMap(t => Object.values(t.c)))));
  const publico = arquivosPublicos().filter(f => /\.(html|js|json|md|txt)$/.test(f)).map(f => readFileSync(f, "utf8")).join("\n");
  for (const [c, d] of [[campanha, demo], [servico, demoServico]]) {
    const pagos = [
      ...c.reels.flatMap(r => [r.legenda, r.semAparecer, r.preparar, r.final.filmar, ...r.cenas.slice(1).map(x => x.filmar)]),
      ...c.stories.flatMap(st => st.telas.map(t => t.nota.foto)),
      ...c.stories.filter(st => st.id !== d.trechos.story.id).flatMap(st => st.telas.filter(t => t.c.texto && !doCatalogo.has(t.c.texto)).map(t => t.c.texto)), // texto que já está no carrossel público não é segredo
      ...c.whatsapp.map(m => m.texto),
      ...c.tutorial.map(p => p.texto),
      ...L.calendariosDoConteudo(c).flatMap(([, , dias]) => dias.flatMap(x => x.itens.map(it => it.preparar))).filter(t => t !== d.abertura.primeiroDia.instrucao) // a instrução do dia 1 é mostrada na página inicial
    ];
    for (const t of new Set(pagos)) assert.ok(!publico.includes(t), `${c.id}: texto pago no público: ${t.slice(0, 50)}…`);
  }
  assert.ok(!existsSync(new URL("public/content", raiz)) && !existsSync(new URL("content", raiz)), "conteúdo pago fora de public/");
});

test("vitrine: trechos reais tirados do kit, sem o “3 presentes” antigo", async () => {
  const { CATALOGO } = await import("../public/catalogo/index.js");
  for (const [c, d] of [[campanha, demo], [servico, demoServico]]) {
    assert.equal(d.produtos.length, 3);
    for (const p of d.produtos) { assert.ok(p.nome && p.preco && p.paraQuem && p.estilo); assert.ok(existsSync(new URL(`public/${p.foto}`, raiz)), p.foto); }
    assert.ok(existsSync(new URL(`public/${d.capaFoto}`, raiz)));
    assert.ok(d.reel.length >= 3 && d.reel.every(x => x.texto && x.gravar));
    assert.deepEqual(d.extras, CATALOGO[c.id].carrosseis.filter(x => x.nivel === 2).map(x => x.nome));
    assert.deepEqual(d.reveillon, CATALOGO[c.id].carrosseis.filter(x => x.nivel === 3).map(x => x.nome));
    const t = d.trechos, r = c.reels.find(x => x.id === t.reel.id);
    assert.ok(r, t.reel.id); assert.equal(t.reel.nome, r.nome); assert.equal(t.reel.duracao, r.duracao);
    assert.deepEqual(t.reel.abertura, r.abertura); assert.deepEqual(t.reel.cena, r.cenas[0]);
    assert.ok(r.legenda.startsWith(t.legenda.replace(/…$/, "")), `${c.id}: legenda é o começo da legenda do kit`);
    const st = c.stories.find(x => x.id === t.story.id), tela = st.telas[t.story.tela - 1];
    assert.equal(t.story.nome, st.nome); assert.equal(t.story.l, tela.l); assert.deepEqual(t.story.c, tela.c); assert.deepEqual(t.story.f, tela.f);
    const nome = it => it.f === "carrossel" ? CATALOGO[c.id].carrosseis.find(x => x.id === it.ref).nome : (it.f === "reel" ? c.reels : it.f === "stories" ? c.stories : c.whatsapp).find(x => x.id === it.ref)[it.f === "whatsapp" ? "titulo" : "nome"];
    const rot = { carrossel: "Carrossel", reel: "Reel", stories: "Stories", whatsapp: "WhatsApp" };
    assert.deepEqual(t.calendario, c.calendario.dez.slice(0, 3).map(x => ({ dia: x.dia, pecas: x.itens.map(it => `${rot[it.f]} · ${nome(it)}`) })), `${c.id}: calendário igual ao kit`);
  }
  const tudo = arquivosPublicos().filter(f => /\.(html|js)$/.test(f)).map(f => readFileSync(f, "utf8")).join("\n");
  assert.ok(!/3 presentes até/.test(tudo), "nada de “3 presentes até” no site");
});

test("página inicial: carrossel do dia 1 e instrução iguais ao calendário do kit", async () => {
  const { CATALOGO } = await import("../public/catalogo/index.js");
  for (const [c, d] of [[campanha, demo], [servico, demoServico]]) {
    const a = d.abertura, dia1 = c.calendario.dez[0].itens.find(it => it.f === "carrossel");
    assert.equal(a.primeiroDia.carrossel, dia1.ref, `${c.id}: "Seu primeiro dia" mostra o post do dia 1 do calendário real`);
    assert.equal(a.primeiroDia.instrucao, dia1.preparar, `${c.id}: instrução igual ao "Preparar" do kit`);
    for (const id of [a.carrossel]) assert.ok(CATALOGO[c.id].carrosseis.some(x => x.id === id && x.nivel === 1), `${c.id}: ${id}`);
    assert.ok(a.convite && a.marcaVazia && a.publico);
  }
  assert.equal(demo.abertura.carrossel, "ate-100"); assert.equal(demoServico.abertura.carrossel, "tres-estilos", "serviços: a prévia destaca 3 estilos para as festas");
  const tres = CATALOGO["seu-toque-nas-festas"].carrosseis.find(x => x.id === "tres-estilos");
  assert.ok(tres.telas[0].l === "capa-numeral" && tres.telas[0].inv && tres.telas[0].c.numero === "3" && /\*as festas\*/.test(tres.telas[0].c.titulo), "capa nova: 3 em destaque, ameixa, “as festas” em itálico");
  assert.deepEqual(tres.telas.slice(1).map(t => t.c.nome), ["Make leve", "Glow dourado", "Penteado de festa"], "as telas seguintes mostram os três estilos"); assert.equal(demo.abertura.convite, "Quer ver com o nome da sua loja?"); assert.equal(demoServico.abertura.convite, "Quer ver com o nome da sua marca?");
});

test("acesso: token assinado, válido, adulterado, expirado e sem segredo", () => {
  const S = "s".repeat(40), agora = Date.UTC(2026, 10, 20);
  const tk = emitirToken({ campanha: "presentes-por-orcamento", plano: "natal-virada", dias: 30, referencia: "pedido-1" }, S, agora);
  const tkPronto = emitirToken({ campanha: "presentes-por-orcamento", plano: "natal-pronto", dias: 30 }, S, agora);
  const v = verificarToken(tk, S, agora + 1000);
  assert.equal(v.campanha, "presentes-por-orcamento"); assert.equal(v.plano, "natal-virada"); assert.equal(v.referencia, "pedido-1");
  const [dd, ss] = tkPronto.split(".");  // cliente do Natal Pronto tentando virar Natal Completo
  const promovido = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(dd, "base64url")), p: "natal-completo" })).toString("base64url");
  assert.equal(verificarToken(`${promovido}.${ss}`, S, agora), null, "trocar o plano dentro do token invalida a assinatura");
  assert.equal(verificarToken(tk, "x".repeat(40), agora), null, "outro segredo");
  const [d, sig] = tk.split(".");
  const outra = Buffer.from(JSON.stringify({ c: "outra", e: 9e9, r: "x" })).toString("base64url");
  assert.equal(verificarToken(`${outra}.${sig}`, S, agora), null, "payload trocado");
  assert.equal(verificarToken(`${d}.${sig.slice(0, -2)}AA`, S, agora), null, "assinatura alterada");
  assert.equal(verificarToken(tk, S, agora + 31 * 86400e3), null, "expirado");
  for (const lixo of ["", "a.b.c", "abc", null, "x".repeat(3000)]) assert.equal(verificarToken(lixo, S, agora), null);
  assert.throws(() => emitirToken({ campanha: "x" }, "curto"));
  assert.ok(segredoConfere("abc", "abc") && !segredoConfere("abc", "abd") && !segredoConfere("", ""));
});

/* funções da API com req/res simulados */
function chamar(handler, { method = "GET", headers = {}, body } = {}) {
  return new Promise(ok => {
    const res = { statusCode: 200, h: {}, setHeader(k, v) { this.h[k.toLowerCase()] = v; }, end(b) { ok({ status: this.statusCode, headers: this.h, json: b ? JSON.parse(b) : null }); } };
    Promise.resolve(handler({ method, headers, body }, res));
  });
}
test("API: campanha só com token válido e filtrada pelo plano; liberar exige admin e plano", async () => {
  const { default: campanhaApi } = await import("../api/campanha.js");
  const { default: liberar } = await import("../api/liberar.js");
  const { default: pagamento } = await import("../api/pagamento.js");
  const antes = { ...process.env };
  const ADM = { "x-admin-token": "a".repeat(40), host: "exemplo.test" };
  try {
    delete process.env.ACESSO_SECRET; delete process.env.ADMIN_TOKEN;
    assert.equal((await chamar(campanhaApi)).status, 503);
    process.env.ACESSO_SECRET = "k".repeat(48); process.env.ADMIN_TOKEN = "a".repeat(40);
    assert.equal((await chamar(campanhaApi)).status, 401);
    assert.equal((await chamar(campanhaApi, { headers: { authorization: "Bearer lixo" } })).status, 401);
    assert.equal((await chamar(liberar, { method: "POST", headers: { "x-admin-token": "errado" }, body: { campanha: "presentes-por-orcamento", plano: "natal-pronto" } })).status, 401);
    assert.equal((await chamar(liberar, { method: "POST", headers: ADM, body: { campanha: "nao-existe", plano: "natal-pronto" } })).status, 400);
    assert.equal((await chamar(liberar, { method: "POST", headers: ADM, body: { campanha: "presentes-por-orcamento" } })).status, 400, "plano obrigatório");
    for (const camp of ["presentes-por-orcamento", "seu-toque-nas-festas"]) for (const p of SITE.planos) {
      const lib = await chamar(liberar, { method: "POST", headers: ADM, body: { campanha: camp, plano: p.id, dias: 7 } });
      assert.equal(lib.status, 200); assert.match(lib.json.link, /^https:\/\/exemplo\.test\/#acesso=/); assert.equal(lib.json.plano, p.nome);
      const ok = await chamar(campanhaApi, { headers: { authorization: `Bearer ${lib.json.link.split("#acesso=")[1]}` } });
      assert.equal(ok.status, 200); assert.equal(ok.headers["cache-control"], "no-store");
      assert.equal(ok.json.plano.id, p.id); assert.equal(ok.json.campanha.id, camp);
      assert.equal(ok.json.campanha.reels.length, p.roteiros, `${camp} ${p.id}`); assert.equal(ok.json.campanha.stories.length, p.stories);
      assert.equal(!!ok.json.campanha.calendario.reveillon, p.nivel >= 3);
    }
    assert.equal((await chamar(pagamento, { method: "POST", body: { status: "approved" } })).status, 503, "webhook não libera nada sem plataforma");
  } finally { process.env = antes; }
});

test("catálogo: 10 campanhas × 11 carrosséis (5 + 3 + 3), 4 telas e legenda própria em cada", async () => {
  const { CATALOGO, carrosseisDoNivel, legendaPreenchida, COLECOES, estiloOriginal } = await import("../public/catalogo/index.js");
  const { LAYOUTS, PARES, ICONES } = await import("../public/js/estudio.js");
  const temas = SITE.publicos.flatMap(p => p.temas);
  assert.deepEqual(Object.keys(CATALOGO).sort(), temas.map(t => t.id).sort(), "uma coleção por tema da configuração");
  let carrosseis = 0, telas = 0; const legendas = new Set(), identidades = new Set();
  for (const [id, c] of Object.entries(CATALOGO)) {
    assert.deepEqual([1, 2, 3].map(n => carrosseisDoNivel(id, n).length), [5, 8, 11], `${id}: 5 / 8 / 11 por plano`);
    assert.equal(new Set(c.carrosseis.map(x => x.id)).size, 11, `${id}: ids únicos`);
    assert.equal(new Set(c.carrosseis.map(x => x.telas[0].l)).size, 11, `${id}: as 11 capas têm composições diferentes`);
    assert.ok(c.carrosseis.some(x => x.id === c.previa), `${id}: carrossel da prévia existe`);
    const col = COLECOES[id]; assert.ok(col && PARES[col.base.par] && ICONES[col.base.icone] && col.cores.length >= 4, `${id}: identidade completa`);
    identidades.add(JSON.stringify([col.base.fundo, col.base.par, col.base.moldura]));
    for (const x of c.carrosseis) {
      carrosseis++;
      assert.ok(x.nome && x.ideia && [1, 2, 3].includes(x.nivel), `${id}/${x.id}: nome, ideia e nível`);
      assert.equal(x.telas.length, 4, `${id}/${x.id}: 4 telas`);
      assert.ok(x.telas[0].l.startsWith("capa-") && x.telas.slice(1).every(t => t.l.startsWith("int-")), `${id}/${x.id}: capa + 3 telas internas`);
      for (const t of x.telas) {
        telas++;
        const lay = LAYOUTS[t.l]; assert.ok(lay, `${id}/${x.id}: composição ${t.l}`);
        const chaves = lay.campos.map(([k]) => k);
        for (const k of Object.keys(t.c)) assert.ok(chaves.includes(k), `${id}/${x.id}/${t.l}: campo ${k}`);
        assert.equal((t.f || []).length, lay.fotos, `${id}/${x.id}/${t.l}: ${lay.fotos} foto(s)`);
        for (const f of t.f || []) assert.ok(existsSync(new URL(`public/${f}`, raiz)), f);
      }
      assert.ok(x.legenda.length > 120 && /WhatsApp|direct|comentários/.test(x.legenda), `${id}/${x.id}: legenda com chamada`);
      legendas.add(x.legenda);
      const leg = legendaPreenchida(x, x.telas, "Minha Loja", c.marca);
      assert.ok(!/\{[^}]*\}/.test(leg) && !/undefined/.test(leg), `${id}/${x.id}: legenda sem marcador sobrando`);
      for (const [, n, k] of x.legenda.matchAll(/\{(\d)\.([a-z0-9]+)/gi)) assert.ok(x.telas[n - 1] && x.telas[n - 1].c[k] != null, `${id}/${x.id}: legenda cita {${n}.${k}}`);
      if (x.nivel === 3) assert.notEqual(estiloOriginal(id, x).fundo, col.base.fundo, `${id}/${x.id}: Réveillon com variação própria`);
    }
  }
  assert.equal(carrosseis, 110); assert.equal(telas, 440); assert.equal(legendas.size, 110, "110 legendas diferentes");
  assert.equal(identidades.size, 10, "10 identidades visuais diferentes");
  // legenda acompanha a edição
  const x = CATALOGO["presentes-por-orcamento"].carrosseis[0], ed = x.telas.map(t => ({ c: { ...t.c } })); ed[0].c.valor = "R$ 150";
  const leg = legendaPreenchida(x, ed, "Loja da Bia", "Ateliê Aurora");
  assert.ok(leg.includes("5 presentes até R$ 150") && leg.includes("Loja da Bia") && !leg.includes("Ateliê Aurora"));
  // Presentes por orçamento segue as decisões combinadas
  const [p1, p2, p3, p4, p5] = CATALOGO["presentes-por-orcamento"].carrosseis;
  assert.deepEqual([p1.telas[0].c.titulo, p1.telas[0].c.valor, p1.telas[0].c.rodape], ["5 presentes *até*", "R$ 100", "Seleção de Natal"]);
  assert.ok(p1.telas[0].l === "capa-embrulho" && p1.telas[0].f[0].includes("elementos/embrulho-capa"), "embalagem fotografada ocupando a capa inteira");
  assert.equal(CATALOGO["presentes-por-orcamento"].marca, "Nome da loja aqui");
  assert.deepEqual(p1.telas.slice(1).map(t => t.l), ["int-dois", "int-dois", "int-um"], "5 produtos em 2 + 2 + 1");
  assert.equal(p2.telas[0].c.titulo, "É a cara *dela.*"); assert.ok(p2.telas[0].inv && p2.telas[0].l === "capa-tipo");
  assert.ok(p3.telas[0].l === "capa-assinatura" && p3.telas[0].c.titulo === "Se eu fosse *presentear…*" && !(p3.telas[0].f || []).length, "escolha: capa tipográfica assinada pela loja");
  assert.ok(p4.telas[0].l === "capa-par" && p4.telas.every(t => (t.f || []).length === 2), "duplas: duas fotos lado a lado e independentes em todas as telas");
  const amigo = CATALOGO["presentes-por-orcamento"].carrosseis.find(y => y.id === "amigo-secreto").telas[0];
  assert.ok(amigo.l === "capa-bilhete" && amigo.inv && amigo.c.titulo.startsWith("Tirei teu nome.") && amigo.c.tema === "Amigo secreto", "amigo secreto: bilhete do sorteio sobre o vinho");
  assert.ok(p5.telas[0].l === "capa-calendario" && p5.telas.some(t => t.l === "int-prazo"));
  // prévia da campanha: telas 2 a 4 = os 3 produtos da demonstração
  for (const [cid, d] of [["presentes-por-orcamento", demo], ["seu-toque-nas-festas", demoServico]]) {
    const c = CATALOGO[cid], pv = c.carrosseis.find(y => y.id === c.previa);
    assert.deepEqual(pv.telas.slice(1).map(t => t.c.nome), d.produtos.map(p => p.nome), `${cid}: prévia alinhada aos produtos`);
    assert.deepEqual(carrosseisDoNivel(cid, 2).slice(5).map(y => y.nome), d.extras, `${cid}: temas extras com os mesmos nomes do kit`);
    assert.deepEqual(carrosseisDoNivel(cid, 3).slice(8).map(y => y.nome), d.reveillon, `${cid}: Réveillon com os mesmos nomes do kit`);
  }
});

test("cartões dos planos: quantidades e frases exatas, sem contagem de peças", () => {
  assert.deepEqual(SITE.planos.map(p => p.qtd), ["5 carrosséis editáveis + 5 roteiros de Reels", "8 carrosséis + 8 roteiros de Reels", "11 carrosséis + 11 roteiros de Reels"]);
  assert.deepEqual(SITE.planos.map(p => p.itens), [
    ["5 sequências de Stories (15 telas)", "Calendário de 10 dias"],
    ["5 sequências de Stories (15 telas)", "Calendário de 15 dias"],
    ["8 sequências de Stories (24 telas)", "Calendário de 15 dias de Natal + 5 de Réveillon"]]);
  assert.equal(SITE.planos[1].destaque, "Por R$ 50 a mais, leve 3 novos temas, cada um com carrossel e roteiro de Reel.");
  assert.equal(SITE.planos[2].destaque, "Por mais R$ 50 em relação ao Completo, seu conteúdo de Réveillon também vem pronto.");
  assert.equal(SITE.incluemTodos, "Todos os planos incluem legendas, 3 mensagens de WhatsApp, calendário e tutorial.");
  assert.equal(Math.round((SITE.planos[1].preco - SITE.planos[0].preco) * 100), 5000);
  assert.equal(Math.round((SITE.planos[2].preco - SITE.planos[1].preco) * 100), 5000);
  const app = readFileSync(new URL("public/js/app.js", raiz), "utf8");
  assert.ok(!/peças prontas/.test(app), "sem \"N peças prontas\"");
});
