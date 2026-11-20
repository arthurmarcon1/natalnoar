/* Regras puras do site (sem DOM). Testadas em tests/logic.test.mjs. */

/* ---------- preço ---------- */
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const fmtBRL = v => BRL.format(v).replace(/\s/g, " ");

/* ---------- públicos e temas ---------- */
export const publicoPorId = (site, id) => site.publicos.find(p => p.id === id) || null;
export const todosTemas = site => site.publicos.flatMap(p => p.temas);
export const temaPorId = (site, id) => todosTemas(site).find(t => t.id === id) || null;
export const temasDoPublico = (site, id) => (publicoPorId(site, id) || { temas: [] }).temas;

/* ---------- compra ----------
   checkoutDoTema: link do checkout (linkPagamento https do tema, senão WhatsApp de vendas
                   com a mensagem pronta). null se nada estiver configurado.
   estadoCompra:   em-preparacao (tema sem material) | revisao (modo de testes, ou sem
                   checkout configurado: abre a revisão do pedido) | checkout (lançamento). */
const linkValido = s => /^https?:\/\/\S+$/i.test(String(s || "").trim());
export function checkoutDoTema(tema, site) {
  if (linkValido(tema.linkPagamento)) return tema.linkPagamento.trim();
  if (!site.whatsappVendas) return null;
  const msg = String(site.mensagemCompra || "Quero comprar a campanha {campanha}.").replaceAll("{campanha}", tema.nome).replaceAll("{preco}", fmtBRL(site.precoCampanha));
  return linkContato(site.whatsappVendas, msg);
}
export function estadoCompra(tema, site) {
  if (!tema || tema.status !== "disponivel") return { tipo: "em-preparacao", rotulo: "Em preparação" };
  const rotulo = `Comprar campanha · ${fmtBRL(site.precoCampanha)}`;
  const checkout = checkoutDoTema(tema, site);
  if (site.modoCompra === "checkout" && checkout) return { tipo: "checkout", rotulo, href: checkout };
  return { tipo: "revisao", rotulo, href: `#pedido/${tema.id}`, checkout };
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

/* ---------- legenda do editor ---------- */
const minuscula = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
export function legendaEditor(modelo, estado) {
  const [capa, ...prods] = estado.telas;
  let t = modelo.replaceAll("[nome da loja]", estado.marca.trim() || "[nome da loja]")
                .replaceAll("[valor]", (capa.preco || "").trim() || "R$ [valor]");
  prods.forEach((p, i) => {
    const item = [p.texto.trim(), p.preco.trim() && `(${p.preco.trim()})`].filter(Boolean).join(" ");
    t = t.replaceAll(`[tela ${i + 2}]`, [item, minuscula(p.apoio.trim())].filter(Boolean).join(", "));
  });
  return t;
}

/* ---------- nomes dos arquivos ---------- */
export const slug = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/\[|\]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export function nomeArquivo(i, tela) {
  const base = slug(tela.tipo === "capa" ? "capa" : tela.texto) || `tela-${i + 1}`;
  return `${String(i + 1).padStart(2, "0")}-${base.slice(0, 40)}.png`;
}

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

/* ---------- editor completo: modelo e legenda de cada carrossel ---------- */
/* Converte as telas do conteúdo pago no formato do editor. A capa "… R$ [valor]" vira texto + preço. */
export function modeloDoTema(tema) {
  return {
    marca: "[nome da loja]",
    telas: tema.carrossel.telas.map((t, i) => {
      if (i === 0) { const m = String(t.titulo).match(/^(.*?)\s*(R\$ \[valor\])$/); return { tipo: "capa", texto: m ? m[1] : t.titulo, preco: m ? m[2] : "", apoio: t.apoio || "" }; }
      return { tipo: "produto", texto: t.titulo, preco: t.preco || "", apoio: t.apoio || "" };
    })
  };
}
export function legendaDoTema(campanha, indice, estado) {
  if (indice === 0 && campanha.editor) return legendaEditor(campanha.editor.legenda, estado);
  const marca = (estado.marca || "").trim();
  return campanha.temas[indice].carrossel.legenda.replaceAll("[nome da loja]", marca && marca !== "[nome da loja]" ? marca : "[nome da loja]");
}
