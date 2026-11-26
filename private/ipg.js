/* =====================================================================
   IPG do Sicredi (Fiserv IPG "Connect": página de pagamento hospedada).
   Segue o "Connect Integration Guide" oficial da Fiserv (versão 2022-3/2023-2).

   - A cliente paga na página segura do IPG (cartão e os meios que o Sicredi habilitar na loja).
     Os dados do cartão nunca passam pelo nosso site. O antifraude e o 3-D Secure rodam no IPG.
   - O pedido é o mesmo da InfinitePay (private/pagamento.js): assinado, com o preço do servidor.
     Ele vai nos endereços de volta e de aviso (?p=...). Esses endereços entram no hashExtended,
     então ninguém consegue trocá-los sem a senha compartilhada (shared secret).
   - Volta (responseSuccessURL/responseFailURL) e aviso (transactionNotificationURL) só valem com o hash
     do IPG conferido: response_hash = HMAC(approval_code|chargetotal|currency|txndatetime|storename)
     e notification_hash = HMAC(chargetotal|currency|txndatetime|storename|approval_code), em Base64,
     com a shared secret como chave. A data e hora vêm do pedido (sempre a mesma para o mesmo pedido).

   Variáveis de ambiente (em privado):
     PAGAMENTO_PROVEDOR   "ipg" para usar o IPG (senão, a InfinitePay)
     IPG_STORENAME        Store Name (ID da loja) enviado pelo Sicredi/Fiserv
     IPG_SHARED_SECRET    Shared secret enviado pelo Sicredi/Fiserv
     IPG_URL              endereço da página de pagamento; padrão: o de TESTES da Fiserv.
                          Em produção, use o endereço que o Sicredi/Fiserv informar.
     IPG_3DS              "true" envia authenticateTransaction=true (3-D Secure), se a loja estiver habilitada
   ===================================================================== */
import { createHmac, timingSafeEqual } from "node:crypto";

export const IPG_URL_TESTE = "https://test.ipg-online.com/connect/gateway/processing";
const BRL = "986";
const hmacB64 = (texto, segredo) => createHmac("sha256", segredo).update(texto, "utf8").digest("base64");
const igual = (a, b) => { const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || "")); return x.length === y.length && timingSafeEqual(x, y); };

export const ipgConfigurado = () => !!(process.env.IPG_STORENAME && process.env.IPG_SHARED_SECRET);
export const provedorAtivo = () => {
  const p = (process.env.PAGAMENTO_PROVEDOR || "").toLowerCase();
  if (p === "ipg" || (!p && ipgConfigurado())) return ipgConfigurado() ? "ipg" : null;
  return process.env.INFINITEPAY_HANDLE ? "infinitepay" : null;
};

/* hashExtended: valores não vazios em ordem crescente do NOME do parâmetro (maiúsculas antes),
   separados por "|", HMAC-SHA256 com a shared secret, em Base64 (Appendix I do guia) */
export function hashExtended(campos, segredo) {
  const nomes = Object.keys(campos).filter(k => k !== "hashExtended" && campos[k] !== "" && campos[k] != null).sort();
  return hmacB64(nomes.map(k => String(campos[k])).join("|"), segredo);
}
/* data e hora do pedido no formato do IPG (YYYY:MM:DD-hh:mm:ss, fuso de São Paulo) */
export function dataHoraIPG(ms) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ms)).map(x => [x.type, x.value]));
  return `${p.year}:${p.month}:${p.day}-${p.hour}:${p.minute}:${p.second}`;
}
/* oid: só A-Z, a-z, 0-9 e "-" (até 32 caracteres); derivado do pedido, sempre o mesmo */
export const oidDoPedido = (pedido, segredo) => `NNA-${Math.floor(pedido.criado / 1000).toString(36)}-${createHmac("sha256", segredo).update(`oid:${pedido.nsu}`).digest("hex").slice(0, 16)}`;
export const valorIPG = centavos => (centavos / 100).toFixed(2);

/* formulário que o navegador envia (POST) para a página de pagamento do IPG */
export function formularioIPG(pedido, { base, segredo, tokenAviso }) {
  const { IPG_STORENAME, IPG_SHARED_SECRET, IPG_URL, IPG_3DS } = process.env;
  if (!IPG_STORENAME || !IPG_SHARED_SECRET) throw Object.assign(new Error("Pagamento ainda não configurado (IPG)."), { status: 503 });
  const p = encodeURIComponent(pedido.nsu);
  const campos = {
    txntype: "sale", timezone: "America/Sao_Paulo", txndatetime: dataHoraIPG(pedido.criado), hash_algorithm: "HMACSHA256",
    storename: IPG_STORENAME, chargetotal: valorIPG(pedido.valor), currency: BRL, checkoutoption: "combinedpage", language: "pt_BR",
    oid: oidDoPedido(pedido, segredo),
    responseSuccessURL: `${base}/api/ipg-retorno?p=${p}`, responseFailURL: `${base}/api/ipg-retorno?p=${p}`,
    transactionNotificationURL: `${base}/api/ipg?k=${tokenAviso}&p=${p}`,
    ...(IPG_3DS === "true" ? { authenticateTransaction: "true" } : {})
  };
  campos.hashExtended = hashExtended(campos, IPG_SHARED_SECRET);
  return { acao: IPG_URL || IPG_URL_TESTE, campos };
}

/* confere a volta (response) ou o aviso (notification) do IPG para ESTE pedido */
export function conferirIPG(pedido, d, { tipo = "resposta", segredo }) {
  const { IPG_STORENAME, IPG_SHARED_SECRET } = process.env;
  if (!IPG_SHARED_SECRET) return { valido: false, motivo: "sem-config" };
  const txndatetime = dataHoraIPG(pedido.criado), storename = IPG_STORENAME;
  if (d.txndatetime && d.txndatetime !== txndatetime) return { valido: false, motivo: "data-diferente" };
  if (d.oid && d.oid !== oidDoPedido(pedido, segredo)) return { valido: false, motivo: "pedido-diferente" };
  const ac = String(d.approval_code || ""), ct = String(d.chargetotal || ""), cur = String(d.currency || "");
  let ok = false;
  if (tipo === "aviso") ok = igual(d.notification_hash, hmacB64([ct, cur, txndatetime, storename, ac].join("|"), IPG_SHARED_SECRET));
  else {
    ok = igual(d.response_hash, hmacB64([ac, ct, cur, txndatetime, storename].join("|"), IPG_SHARED_SECRET));
    if (!ok && d.extended_response_hash) { // se a loja tiver o hash estendido ligado
      const nomes = Object.keys(d).filter(k => k !== "extended_response_hash" && d[k] !== "" && d[k] != null).sort();
      ok = igual(d.extended_response_hash, hmacB64(nomes.map(k => String(d[k])).join("|"), IPG_SHARED_SECRET));
    }
  }
  if (!ok) return { valido: false, motivo: "hash-invalido" };
  if (cur !== BRL || Math.round(Number(ct.replace(",", ".")) * 100) !== pedido.valor) return { valido: true, pago: false, motivo: "valor-diferente" };
  const status = String(d.status || "").toUpperCase();
  if (status === "APPROVED" && ac.startsWith("Y")) return { valido: true, pago: true, status, transacao: d.ipgTransactionId || "" };
  if (status === "WAITING" || ac.startsWith("?")) return { valido: true, pago: false, status: "WAITING", motivo: "aguardando" };
  return { valido: true, pago: false, status: status || "DECLINED", motivo: "recusado", falha: String(d.fail_reason || "").slice(0, 120) };
}
/* comprovante curto que o nosso servidor dá para a página de retorno depois de conferir o IPG */
export const comprovante = (pedido, segredo) => createHmac("sha256", segredo).update(`pago:${pedido.nsu}`).digest("base64url").slice(0, 32);
export const comprovanteConfere = (pedido, c, segredo) => igual(c, comprovante(pedido, segredo));
export const lerFormulario = texto => Object.fromEntries(new URLSearchParams(String(texto || "")));
