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
vm.runInContext(m[1] + "\n;globalThis.L = { CONFIG, calc, sanitizeCart, setPacote, addExtra, toggleTema, economiaPacote, valorAvulso, maxExtra, validateCustomer, buildSummary, waLink, fmt };", ctx);
const L = ctx.L;

const ANTES = new Date(2026, 10, 1);   // promo antecipada vigente (até 2026-11-20)
const DEPOIS = new Date(2026, 11, 1);  // promo antecipada encerrada
const vazio = () => ({ pacote: null, extras: {}, temas: [] });
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
  for (const p of L.CONFIG.pacotes) assert.equal(L.economiaPacote(p), Math.max(0, L.valorAvulso(p) - p.preco));
  const ess = L.CONFIG.pacotes.find(p => p.id === "essencial");
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
  let c = L.sanitizeCart({ pacote: null, extras: {}, temas: ["presente-certo", "nao-existe"] });
  assert.deepEqual([...c.temas], ["presente-certo"]);
  c = L.toggleTema(c, "presente-certo");
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
  c = L.toggleTema(c, "virada-de-look");
  const r = L.calc(c, ANTES);
  const s = L.buildSummary(c, cliente, ANTES);
  assert.match(s, /Natal Completo/);
  assert.match(s, /3× Carrossel/);
  assert.match(s, /Virada de Look/);
  assert.ok(s.includes(`*Total: ${L.fmt(r.total)}*`));
  assert.equal(r.total, 690 + 360 - 69 - 120);
  assert.match(s, /\(55\) 99999-8888/);
  assert.match(s, /Instagram: @lojateste/);
});

test("sem número configurado não gera link (modo demonstração)", () => {
  assert.equal(L.CONFIG.whatsapp, "");
  assert.equal(L.waLink("oi"), null);
});
