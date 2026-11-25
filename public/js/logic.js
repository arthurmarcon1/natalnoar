/* Regras puras do site (sem DOM). Testadas em tests/logic.test.mjs. */

/* ---------- preço ---------- */
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const fmtBRL = v => BRL.format(v).replace(/\s/g, " ");

/* ---------- públicos e temas ---------- */
export const publicoPorId = (site, id) => site.publicos.find(p => p.id === id) || null;
export const todosTemas = site => site.publicos.flatMap(p => p.temas);
export const temaPorId = (site, id) => todosTemas(site).find(t => t.id === id) || null;
export const temasDoPublico = (site, id) => (publicoPorId(site, id) || { temas: [] }).temas;

const linkValido = s => /^https?:\/\/\S+$/i.test(String(s || "").trim());
/* ---------- planos ---------- */
export const planoPorId = (site, id) => site.planos.find(p => p.id === id) || null;
export const planoPadrao = site => site.planos[0];
/* Peças prontas de um plano: telas de carrossel (4 cada) + roteiros + telas de Stories (3 cada)
   + mensagens + calendários + tutorial. */
export const pecasDoPlano = p => p.carrosseis * 4 + p.roteiros + p.stories * 3 + p.mensagens + (p.nivel >= 3 ? 2 : 1) + 1;
/* O que a cliente recebe, em itens curtos (resumo do pedido e cartões). */
export function entregasDoPlano(p) {
  return [
    `${p.carrosseis} carrosséis editáveis com legendas`,
    `${p.roteiros} roteiros de Reels`,
    `${p.stories} sequências de Stories`,
    `${p.mensagens} mensagens de WhatsApp`,
    p.nivel >= 3 ? "Calendário de 15 dias + 5 dias de Réveillon" : `Calendário de ${p.calendario}`,
    "Tutorial de edição",
    "Peças sem marca-d'água"
  ];
}
/* Conteúdo pago liberado pelo plano (o servidor só entrega isto). */
export function conteudoDoPlano(campanha, plano) {
  const n = plano ? plano.nivel : 1, cal = campanha.calendario;
  return {
    ...campanha,
    reels: campanha.reels.filter(x => x.nivel <= n),
    stories: campanha.stories.filter(x => x.nivel <= n),
    // Natal Pronto: 10 dias + expressa. Completo: 15 dias + expressa. Natal + Virada: 15 dias + expressa + 5 de Réveillon.
    calendario: { dica: cal.dica, ...(n < 2 ? { dez: cal.dez } : { quinze: cal.quinze }), expressa: cal.expressa, ...(n >= 3 ? { reveillon: cal.reveillon } : {}) }
  };
}
/* Calendários de um conteúdo já filtrado, na ordem de uso: [chave, rótulo, dias]. */
export function calendariosDoConteudo(c) {
  const k = c.calendario;
  return [["dez", "Natal · 10 dias", k.dez], ["quinze", "Natal · 15 dias", k.quinze], ["reveillon", "Réveillon · 5 dias", k.reveillon], ["expressa", "Expressa · 3 dias", k.expressa]].filter(([, , d]) => d && d.length);
}
/* Confere se cada item do calendário aponta para um material liberado. Devolve a lista de problemas. */
export function conferirCalendario(c, carrosseis) {
  const ids = { carrossel: new Set(carrosseis.map(x => x.id)), reel: new Set(c.reels.map(x => x.id)), stories: new Set(c.stories.map(x => x.id)), whatsapp: new Set(c.whatsapp.map(x => x.id)) };
  return calendariosDoConteudo(c).flatMap(([k, , dias]) => dias.flatMap(d => d.itens.filter(it => !ids[it.f] || !ids[it.f].has(it.ref)).map(it => `${k} dia ${d.dia}: ${it.f} ${it.ref}`)));
}

/* ---------- compra ----------
   checkoutDoTema: link do checkout do plano (linksPagamento[plano] https do tema, senão
                   WhatsApp de vendas com campanha, plano e preço). null se nada configurado.
   estadoCompra:   em-preparacao (tema sem material) | revisao (modo de testes, ou sem
                   checkout configurado: abre a revisão do pedido) | checkout (lançamento).
                   O rótulo traz o nome e o preço FINAL do plano. */
export function checkoutDoTema(tema, plano, site) {
  const link = tema.linksPagamento && tema.linksPagamento[plano.id];
  if (linkValido(link)) return link.trim();
  if (!site.whatsappVendas) return null;
  const msg = String(site.mensagemCompra || "Quero comprar a campanha {campanha} no plano {plano}.").replaceAll("{campanha}", tema.nome).replaceAll("{plano}", plano.nome).replaceAll("{preco}", fmtBRL(plano.preco));
  return linkContato(site.whatsappVendas, msg);
}
export function estadoCompra(tema, plano, site) {
  if (!tema || tema.status !== "disponivel") return { tipo: "em-preparacao", rotulo: "Em preparação" };
  plano = plano || planoPadrao(site);
  const rotulo = `Comprar ${plano.nome} · ${fmtBRL(plano.preco)}`;
  const checkout = checkoutDoTema(tema, plano, site);
  if (site.modoCompra === "checkout" && checkout) return { tipo: "checkout", rotulo, href: checkout, plano };
  return { tipo: "revisao", rotulo, href: `#pedido/${tema.id}/${plano.id}`, checkout, plano };
}

/* ---------- contato da gestão mensal ----------
   Aceita link (https://...) ou número (só dígitos, com DDI e DDD). Vazio → null. */
export function linkContato(contato, mensagem = "") {
  const c = String(contato || "").trim();
  if (!c) return null;
  if (linkValido(c)) {
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(c) && mensagem && !/[?&]text=/.test(c))
      return `${c}${c.includes("?") ? "&" : "?"}text=${encodeURIComponent(mensagem)}`;
    return c;
  }
  const d = c.replace(/\D/g, "");
  if (d.length >= 12 && d.length <= 13) return `https://wa.me/${d}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ""}`;
  return null;
}

/* ---------- enquadramento "cover" ----------
   Recorte da imagem (sx, sy, sw, sh) que cobre a caixa bw × bh sem distorcer.
   zoom ≥ 1 aproxima; fx/fy (0 a 1) escolhem o ponto de foco. */
export function coverRect(iw, ih, bw, bh, zoom = 1, fx = 0.5, fy = 0.5) {
  const z = Math.max(1, zoom), clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const scale = Math.max(bw / iw, bh / ih) * z;
  const sw = bw / scale, sh = bh / scale;
  const sx = clamp(fx * iw - sw / 2, 0, iw - sw), sy = clamp(fy * ih - sh / 2, 0, ih - sh);
  return { sx, sy, sw, sh };
}

/* ---------- texto no canvas ----------
   quebrarLinhas: quebra por palavras usando measure(texto) → largura.
   ajustarTexto: maior tamanho da lista que cabe em maxLinhas. */
export function quebrarLinhas(texto, maxW, measure) {
  const linhas = [];
  for (const par of String(texto).split("\n")) {
    let atual = "";
    for (const w of par.split(/\s+/).filter(Boolean)) {
      const t = atual ? `${atual} ${w}` : w;
      if (measure(t) <= maxW || !atual) atual = t; else { linhas.push(atual); atual = w; }
    }
    linhas.push(atual);
  }
  return linhas;
}
export function ajustarTexto(texto, maxW, maxLinhas, tamanhos, measureAt) {
  for (const size of tamanhos) {
    const m = s => measureAt(s, size);
    const linhas = quebrarLinhas(texto, maxW, m);
    if (linhas.length <= maxLinhas && linhas.every(l => m(l) <= maxW)) return { size, linhas };
  }
  const size = tamanhos[tamanhos.length - 1];
  return { size, linhas: quebrarLinhas(texto, maxW, s => measureAt(s, size)) };
}

/* ---------- nomes dos arquivos ---------- */
export const slug = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/\[|\]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
/* ---------- zip (modo "store", sem compressão: PNG já é comprimido) ---------- */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
export function crc32(bytes) { let c = 0xFFFFFFFF; for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
export function zipStore(files, data = new Date()) {
  const enc = new TextEncoder();
  const dosTime = (data.getHours() << 11) | (data.getMinutes() << 5) | (data.getSeconds() >> 1);
  const dosDate = ((data.getFullYear() - 1980) << 9) | ((data.getMonth() + 1) << 5) | data.getDate();
  const locais = [], centrais = []; let offset = 0;
  for (const f of files) {
    const nome = enc.encode(f.name), crc = crc32(f.data), n = f.data.length;
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, dosTime, true); h.setUint16(12, dosDate, true); h.setUint32(14, crc, true);
    h.setUint32(18, n, true); h.setUint32(22, n, true); h.setUint16(26, nome.length, true); h.setUint16(28, 0, true);
    locais.push(new Uint8Array(h.buffer), nome, f.data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
    c.setUint16(10, 0, true); c.setUint16(12, dosTime, true); c.setUint16(14, dosDate, true); c.setUint32(16, crc, true);
    c.setUint32(20, n, true); c.setUint32(24, n, true); c.setUint16(28, nome.length, true);
    c.setUint32(42, offset, true);
    centrais.push(new Uint8Array(c.buffer), nome);
    offset += 30 + nome.length + n;
  }
  const tamCentral = centrais.reduce((s, b) => s + b.length, 0);
  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 0x06054b50, true); fim.setUint16(8, files.length, true); fim.setUint16(10, files.length, true);
  fim.setUint32(12, tamCentral, true); fim.setUint32(16, offset, true);
  const partes = [...locais, ...centrais, new Uint8Array(fim.buffer)];
  const out = new Uint8Array(partes.reduce((s, b) => s + b.length, 0));
  let p = 0; for (const b of partes) { out.set(b, p); p += b.length; }
  return out;
}
