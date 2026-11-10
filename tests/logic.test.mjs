// Testes da lógica pura do index.html (bloco entre // @logic-start e // @logic-end).
// Rodar: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const m = html.match(/\/\/ @logic-start([\s\S]*?)\/\/ @logic-end/);
assert.ok(m, "bloco @logic não encontrado no index.html");

const ctx = vm.createContext({ Intl, Math, Number, String, Object, Date, Set, encodeURIComponent });
vm.runInContext(m[1] + "\n;globalThis.L = { CONFIG, calc, sanitizeCart, setPerfil, getPublico, setPacote, addExtra, toggleTema, economiaPacote, valorAvulso, maxExtra, validateCustomer, buildSummary, waLink, fmt };", ctx);
const L = ctx.L;

const ANTES = new Date(2026, 10, 1);   // promo antecipada vigente (até 2026-11-20)
const DEPOIS = new Date(2026, 11, 1);  // promo antecipada encerrada
const vazio = (perfil = "lojistas") => ({ perfil, pacote: null, extras: {}, temas: [] });
const cliente = { nome: "Ana Souza", loja: "Loja Teste", whatsapp: "55999998888", instagram: "lojateste" };

test("carrinho vazio tem total zero", () => {
  const r = L.calc(vazio(), DEPOIS);
  assert.equal(r.total, 0);
  assert.equal(r.vazio, true);
});

test("adicionar e remover peças muda o total", () => {
  let c = L.addExtra(vazio(), "video", 1);
  assert.equal(L.calc(c, DEPOIS).total, 150);
  c = L.addExtra(c, "video", 1);
  assert.equal(L.calc(c, DEPOIS).total, 300);
  c = L.addExtra(c, "video", -2);
  assert.equal(L.calc(c, DEPOIS).total, 0);
  assert.deepEqual({ ...c.extras }, {});
});

test("economia do pacote é calculada (avulso − preço)", () => {
  for (const p of L.CONFIG.publicos.flatMap(pb => pb.planos)) assert.equal(L.economiaPacote(p), Math.max(0, L.valorAvulso(p) - p.preco));
  const ess = L.getPublico("lojistas").planos.find(p => p.id === "essencial");
  assert.equal(L.valorAvulso(ess), 80 + 3 * 120 + 90);
});

test("promoção percentual vale só até a data limite", () => {
  const c = L.setPacote(vazio(), "natal-completo");
  assert.equal(L.calc(c, ANTES).total, 621);   // 690 − 10%
  assert.equal(L.calc(c, DEPOIS).total, 690);
});

test("leve 3 pague 2 em carrossel extra", () => {
  let c = L.addExtra(vazio(), "carrossel", 3);
  assert.equal(L.calc(c, DEPOIS).total, 240);
  c = L.addExtra(c, "carrossel", 3);
  assert.equal(L.calc(c, DEPOIS).total, 480);
});

test("max é o total por pedido: trocar de pacote reajusta extras", () => {
  let c = L.addExtra(vazio(), "carrossel", 12);
  assert.equal(c.extras.carrossel, 12);
  c = L.addExtra(c, "carrossel", 5);
  assert.equal(c.extras.carrossel, 12);
  c = L.setPacote(c, "natal-reveillon");    // inclui 6 carrosséis
  assert.equal(c.extras.carrossel, 6);
  c = L.addExtra(L.setPacote(vazio(), "essencial"), "legendas", 1); // já incluso, max 1
  assert.equal(c.extras.legendas, undefined);
});

test("temas inválidos são removidos e toggle funciona", () => {
  let c = L.sanitizeCart({ perfil: "lojistas", pacote: null, extras: {}, temas: ["guia-de-presentes", "nao-existe"] });
  assert.deepEqual([...c.temas], ["guia-de-presentes"]);
  c = L.toggleTema(c, "guia-de-presentes");
  assert.deepEqual([...c.temas], []);
});

test("validação bloqueia nome, loja e WhatsApp vazios", () => {
  const e = L.validateCustomer({ nome: "", loja: "  ", whatsapp: "", instagram: "" });
  assert.ok(e.nome && e.loja && e.whatsapp);
  assert.ok(L.validateCustomer({ ...cliente, whatsapp: "123" }).whatsapp);
  assert.deepEqual({ ...L.validateCustomer(cliente) }, {});
});

test("resumo do WhatsApp bate com o carrinho", () => {
  let c = L.setPacote(vazio(), "natal-completo");
  c = L.addExtra(c, "carrossel", 3);
  c = L.toggleTema(c, "achados-para-as-festas");
  const r = L.calc(c, ANTES);
  const s = L.buildSummary(c, cliente, ANTES);
  assert.match(s, /\*Perfil\*\nPara lojistas/);
  assert.match(s, /Natal Completo/);
  assert.match(s, /3× Carrossel/);
  assert.match(s, /Achados para as festas/);
  assert.match(s, /Loja: Loja Teste/);
  assert.ok(s.includes(`*Total: ${L.fmt(r.total)}*`));
  assert.equal(r.total, 690 + 360 - 69 - 120);
  assert.match(s, /\(55\) 99999-8888/);
  assert.match(s, /Instagram: @lojateste/);
});

test("sem número configurado não gera link (modo demonstração)", () => {
  assert.equal(L.CONFIG.whatsapp, "");
  assert.equal(L.waLink("oi"), null);
});

test("catálogo: ids de planos e temas únicos entre perfis, exemplos completos", () => {
  const planos = L.CONFIG.publicos.flatMap(pb => pb.planos.map(p => p.id));
  const temas = L.CONFIG.publicos.flatMap(pb => pb.temas.map(t => t.id));
  assert.equal(new Set(planos).size, planos.length);
  assert.equal(new Set(temas).size, temas.length);
  for (const pb of L.CONFIG.publicos) for (const t of pb.temas) {
    assert.ok(t.exemplo.carrossel.length >= 3 && t.exemplo.stories.length >= 2, t.id);
  }
  assert.deepEqual([...L.getPublico("lojistas").temas.map(t => t.nome)], ["Guia de presentes", "Achados para as festas", "Últimas compras de Natal"]);
  assert.deepEqual([...L.getPublico("prestadores").temas.map(t => t.nome)], ["Especial de fim de ano", "Por trás do resultado"]);
});

test("sem perfil não há plano nem tema no carrinho", () => {
  const c = L.sanitizeCart({ perfil: null, pacote: "essencial", extras: { video: 1 }, temas: ["guia-de-presentes"] });
  assert.equal(c.pacote, null);
  assert.deepEqual([...c.temas], []);
  assert.equal(c.extras.video, 1);
});

test("plano e tema de outro perfil não entram no carrinho", () => {
  let c = L.setPacote(vazio("prestadores"), "natal-completo");
  assert.equal(c.pacote, null);
  c = L.toggleTema(c, "guia-de-presentes");
  assert.deepEqual([...c.temas], []);
  c = L.toggleTema(L.setPacote(c, "agenda-cheia"), "por-tras-do-resultado");
  assert.equal(c.pacote, "agenda-cheia");
  assert.deepEqual([...c.temas], ["por-tras-do-resultado"]);
});

test("trocar de perfil remove plano e temas e mantém peças avulsas", () => {
  let c = L.setPacote(vazio("lojistas"), "natal-reveillon");   // 6 carrosséis no plano
  c = L.addExtra(c, "carrossel", 6);
  c = L.addExtra(c, "video", 1);
  c = L.toggleTema(c, "guia-de-presentes");
  c = L.setPerfil(c, "prestadores");
  assert.equal(c.perfil, "prestadores");
  assert.equal(c.pacote, null);
  assert.deepEqual([...c.temas], []);
  assert.deepEqual({ ...c.extras }, { carrossel: 6, video: 1 });
  assert.equal(L.calc(c, DEPOIS).total, 4 * 120 + 150);         // 6 carrosséis: leve 3 pague 2
  c = L.setPerfil(c, "nao-existe");
  assert.equal(c.perfil, null);
});

test("resumo de prestador informa perfil, plano e negócio", () => {
  let c = L.setPacote(vazio("prestadores"), "agenda-cheia");
  c = L.toggleTema(c, "especial-de-fim-de-ano");
  const s = L.buildSummary(c, { ...cliente, loja: "Bia Make" }, DEPOIS);
  assert.match(s, /\*Perfil\*\nPara prestadores de serviço/);
  assert.match(s, /Agenda Cheia — /);
  assert.match(s, /Especial de fim de ano/);
  assert.match(s, /Negócio: Bia Make/);
  assert.ok(s.includes(`*Total: ${L.fmt(L.calc(c, DEPOIS).total)}*`));
  assert.equal(L.validateCustomer({ ...cliente, loja: "" }, L.getPublico("prestadores")).loja, "Informe o nome do negócio.");
});
