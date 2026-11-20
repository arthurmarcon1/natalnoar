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
import demo from "../public/amostra/presentes-por-orcamento.js";
import * as L from "../public/js/logic.js";

const raiz = new URL("../", import.meta.url);
const clone = o => JSON.parse(JSON.stringify(o));
const arquivosPublicos = (dir = fileURLToPath(new URL("public/", raiz))) =>
  readdirSync(dir).flatMap(f => { const p = join(dir, f); return statSync(p).isDirectory() ? arquivosPublicos(p) : [p]; });

test("configuração: preço, compras fechadas e públicos", () => {
  assert.equal(SITE.precoCampanha, 89.90);
  assert.equal(L.fmtBRL(SITE.precoCampanha), "R$ 89,90");
  assert.equal(SITE.comprasAbertas, false);
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
    for (const k of ["id", "nome", "publico", "descricao", "status", "linkPagamento"]) assert.ok(k in t, `${t.id} sem ${k}`);
    assert.ok(["disponivel", "em-preparacao"].includes(t.status));
    assert.equal(t.linkPagamento, "", "links de pagamento ficam vazios até o Arthur definir");
    if (t.publico === "servico") assert.ok(t.paraQuem && t.paraQuem.length > 10, `${t.id} sem paraQuem`);
    assert.ok(!/agendar/i.test(t.nome), "não usar 'como agendar' como tema");
  }
  const disponiveis = temas.filter(t => t.status === "disponivel").map(t => t.id);
  assert.deepEqual(disponiveis, ["presentes-por-orcamento"]);
  assert.equal(temas.filter(t => t.status === "em-preparacao").length, 9);
});

test("botão de compra: em breve, checkout e em preparação", () => {
  const tema = clone(L.temaPorId(SITE, "presentes-por-orcamento"));
  assert.deepEqual(L.estadoCompra(tema, SITE), { tipo: "em-breve", rotulo: "Compras abrem em breve" });
  const aberto = { ...SITE, comprasAbertas: true };
  assert.equal(L.estadoCompra(tema, aberto).tipo, "em-breve", "sem link continua em breve");
  tema.linkPagamento = "javascript:alert(1)";
  assert.equal(L.estadoCompra(tema, aberto).tipo, "em-breve", "link inválido não vira botão");
  tema.linkPagamento = " https://pagamento.exemplo/checkout/123 ";
  assert.deepEqual(L.estadoCompra(tema, aberto), { tipo: "checkout", rotulo: "Comprar por R$ 89,90", href: "https://pagamento.exemplo/checkout/123" });
  assert.equal(L.estadoCompra(tema, SITE).tipo, "em-breve", "com compras fechadas o link não aparece");
  const prep = L.temaPorId(SITE, "looks-para-celebrar");
  assert.equal(L.estadoCompra({ ...prep, linkPagamento: "https://x.y" }, aberto).tipo, "em-preparacao");
});

test("contato da gestão: número, link, vazio", () => {
  assert.equal(L.linkContato("", "oi"), null);
  assert.equal(L.linkContato("123", "oi"), null);
  assert.equal(L.linkContato("55 55 9940-8766", "Olá"), "https://wa.me/555599408766?text=Ol%C3%A1");
  assert.equal(L.linkContato("https://wa.me/5555999999999", "Oi"), "https://wa.me/5555999999999?text=Oi");
  assert.equal(L.linkContato("https://calendly.com/arthur", "Oi"), "https://calendly.com/arthur");
  assert.ok(L.linkContato(SITE.contatoGestao, SITE.mensagemGestao).startsWith("https://wa.me/"));
});

test("conteúdo: 5 temas completos no nível pedido", () => {
  assert.equal(campanha.temas.length, 5);
  assert.deepEqual(campanha.temas.map(t => t.nome),
    ["Presentes por faixa de preço", "Um presente para cada estilo", "O favorito da loja", "Duplas que combinam", "Últimas compras"]);
  for (const t of campanha.temas) {
    assert.equal(t.carrossel.telas.length, 4, t.id);
    assert.ok(t.carrossel.legenda.length > 80 && /WhatsApp|direct/i.test(t.carrossel.legenda), `${t.id}: legenda com chamada`);
    for (const k of ["abertura", "legenda", "chamadaFinal", "semAparecer"]) assert.ok(t.reel[k], `${t.id}: reel.${k}`);
    assert.ok(t.reel.cenas.length >= 3 && t.reel.cenas.every(c => c.filmar && c.texto), `${t.id}: cenas`);
    assert.equal(t.stories.telas.length, 3, `${t.id}: 3 telas de Stories`);
  }
  const t1 = campanha.temas[0];
  assert.match(t1.carrossel.telas[0].titulo, /3 presentes até R\$ \[valor\]/);
  assert.match(t1.carrossel.telas[1].apoio, /mãe que ama sair/);
  assert.match(t1.stories.telas[0].texto, /Qual você daria de presente\?/);
  assert.match(t1.stories.telas[2].recurso, /disponibilidade/);
  assert.equal(campanha.whatsapp.length, 3);
  assert.equal(campanha.calendario.dez.length, 10);
  assert.equal(campanha.calendario.expressa.length, 3);
  assert.ok(campanha.tutorial.length >= 4);
});

test("calendário cita cada peça pelo nome", () => {
  const nomes = campanha.temas.flatMap(t => [`Carrossel: ${t.carrossel.nome}`, `Reel: ${t.reel.nome}`, `Stories: ${t.stories.nome}`]);
  const citadas = campanha.calendario.dez.flatMap(d => d.pecas);
  for (const n of nomes) assert.ok(citadas.includes(n), `calendário sem "${n}"`);
  for (const p of [...citadas, ...campanha.calendario.expressa.flatMap(d => d.pecas)])
    assert.ok(nomes.includes(p) || campanha.whatsapp.some(m => p === `WhatsApp: ${m.titulo}`), `peça desconhecida: ${p}`);
});

test("editor: fotos do exemplo existem e legenda reflete marca, textos e preços", () => {
  for (const t of campanha.editor.exemplo.telas) assert.ok(existsSync(new URL(`public/${t.foto}`, raiz)), t.foto);
  const st = clone(campanha.editor.exemplo);
  st.marca = "Loja da Bia";
  st.telas[0].preco = "R$ 150";
  st.telas[1].texto = "Bolsa Lua"; st.telas[1].preco = "R$ 129";
  const leg = L.legendaEditor(campanha.editor.legenda, st);
  assert.match(leg, /3 presentes até R\$ 150 aqui na Loja da Bia/);
  assert.match(leg, /• Bolsa Lua \(R\$ 129\), para a mãe que ama sair/);
  assert.ok(!/\[tela \d\]/.test(leg));
  const antes = L.legendaEditor(campanha.editor.legenda, campanha.editor.antes);
  assert.match(antes, /\[nome da loja\]/);
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

test("nomes dos arquivos em ordem", () => {
  const ts = campanha.editor.exemplo.telas;
  assert.deepEqual(ts.map((t, i) => L.nomeArquivo(i, t)), ["01-capa.png", "02-clutch-noite.png", "03-lenco-de-seda.png", "04-brincos-dourados.png"]);
  assert.equal(L.nomeArquivo(1, campanha.editor.antes.telas[1]), "02-produto.png");
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
  for (const proibido of [/690/, /Presente Certo/, /Última Chamada/, /Virada de Look/, /Natal Completo/, /pacotes?\b/i, /Enviar solicitação/, /carrinho/i, /Essencial/])
    assert.ok(!proibido.test(todo), `sobrou: ${proibido}`);
});

test("área paga: nenhum texto pago aparece nos arquivos públicos", () => {
  const publico = arquivosPublicos().filter(f => /\.(html|js|json|md|txt)$/.test(f)).map(f => readFileSync(f, "utf8")).join("\n");
  const pagos = [
    ...campanha.temas.slice(1).map(t => t.carrossel.legenda),
    ...campanha.temas.flatMap(t => [t.reel.semAparecer, t.reel.chamadaFinal, ...t.stories.telas.map(x => x.mostrar)]),
    ...campanha.whatsapp.map(m => m.texto),
    ...campanha.tutorial.map(p => p.texto),
    campanha.temas[0].carrossel.legenda
  ];
  for (const t of pagos) assert.ok(!publico.includes(t), `texto pago no público: ${t.slice(0, 50)}…`);
  assert.ok(!existsSync(new URL("public/content", raiz)) && !existsSync(new URL("content", raiz)), "conteúdo pago fora de public/");
});

test("demonstração pública: 3 produtos com foto, cenas e enquete", () => {
  assert.equal(demo.produtos.length, 3);
  for (const p of demo.produtos) { assert.ok(p.nome && p.preco && p.paraQuem); assert.ok(existsSync(new URL(`public/${p.foto}`, raiz)), p.foto); }
  assert.ok(existsSync(new URL(`public/${demo.capaFoto}`, raiz)));
  assert.ok(demo.reel.length >= 3 && demo.reel.every(c => c.texto && c.gravar));
  assert.match(demo.stories.pergunta, /Qual você daria de presente\?/);
  assert.ok(demo.trechos.calendario.length <= 3, "só trecho do calendário");
});

test("acesso: token assinado, válido, adulterado, expirado e sem segredo", () => {
  const S = "s".repeat(40), agora = Date.UTC(2026, 10, 20);
  const tk = emitirToken({ campanha: "presentes-por-orcamento", dias: 30, referencia: "pedido-1" }, S, agora);
  const v = verificarToken(tk, S, agora + 1000);
  assert.equal(v.campanha, "presentes-por-orcamento"); assert.equal(v.referencia, "pedido-1");
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
test("API: campanha só com token válido; liberar só com token de admin; pagamento não liga sozinho", async () => {
  const { default: campanhaApi } = await import("../api/campanha.js");
  const { default: liberar } = await import("../api/liberar.js");
  const { default: pagamento } = await import("../api/pagamento.js");
  const antes = { ...process.env };
  try {
    delete process.env.ACESSO_SECRET; delete process.env.ADMIN_TOKEN;
    assert.equal((await chamar(campanhaApi)).status, 503);
    process.env.ACESSO_SECRET = "k".repeat(48); process.env.ADMIN_TOKEN = "a".repeat(40);
    assert.equal((await chamar(campanhaApi)).status, 401);
    assert.equal((await chamar(campanhaApi, { headers: { authorization: "Bearer lixo" } })).status, 401);
    assert.equal((await chamar(liberar, { method: "POST", headers: { "x-admin-token": "errado" }, body: { campanha: "presentes-por-orcamento" } })).status, 401);
    assert.equal((await chamar(liberar, { method: "POST", headers: { "x-admin-token": "a".repeat(40) }, body: { campanha: "nao-existe" } })).status, 400);
    const lib = await chamar(liberar, { method: "POST", headers: { "x-admin-token": "a".repeat(40), host: "exemplo.test" }, body: { campanha: "presentes-por-orcamento", dias: 7 } });
    assert.equal(lib.status, 200); assert.match(lib.json.link, /^https:\/\/exemplo\.test\/#acesso=/);
    const token = lib.json.link.split("#acesso=")[1];
    const ok = await chamar(campanhaApi, { headers: { authorization: `Bearer ${token}` } });
    assert.equal(ok.status, 200); assert.equal(ok.headers["cache-control"], "no-store");
    assert.equal(ok.json.campanha.temas.length, 5); assert.equal(ok.json.campanha.whatsapp.length, 3);
    assert.equal((await chamar(pagamento, { method: "POST", body: { status: "approved" } })).status, 503, "webhook não libera nada sem plataforma");
  } finally { process.env = antes; }
});

test("editor completo: modelo de cada um dos 5 carrosséis", () => {
  for (const [i, t] of campanha.temas.entries()) {
    const m = L.modeloDoTema(t);
    assert.equal(m.telas.length, 4); assert.equal(m.telas[0].tipo, "capa");
    const leg = L.legendaDoTema(campanha, i, { ...m, marca: "Loja X" });
    assert.ok(leg.length > 50);
    if (t.carrossel.legenda.includes("[nome da loja]")) assert.match(leg, /Loja X/);
  }
  assert.deepEqual(L.modeloDoTema(campanha.temas[0]).telas[0], { tipo: "capa", texto: "3 presentes até", preco: "R$ [valor]", apoio: "Arrasta pro lado →" });
});
