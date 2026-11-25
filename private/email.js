/* E-mail com o link de acesso, depois do pagamento confirmado.
   - RESEND_API_KEY + EMAIL_REMETENTE ("Natal no Ar <acesso@seudominio.com.br>"): envia pelo Resend (API HTTP).
     O Resend só entrega para qualquer destinatário com um domínio próprio verificado na conta.
   - EMAIL_SAIDA_DIR (só testes locais): grava o e-mail como .json nessa pasta, sem enviar.
   - Sem nada configurado: não envia e avisa ({ enviado: false }); a página de retorno oferece "Reenviar". */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function montarEmail({ para, link, campanha, plano, ajuda }) {
  const assunto = `Seu kit ${campanha} está liberado`;
  const texto = `Oi! O pagamento foi confirmado e o seu kit já está liberado.

Coleção: ${campanha}
Plano: ${plano}

Abra a sua campanha neste link (guarde este e-mail, ele é o seu acesso):
${link}

Dica: abra no celular que você vai usar para postar. As suas edições ficam salvas nesse aparelho.
${ajuda ? `\nPrecisa de ajuda? Fale com a gente no WhatsApp: ${ajuda}\n` : ""}
Natal no Ar`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1A1013;line-height:1.5">
  <p style="font-size:13px;color:#B3122E;font-weight:bold;letter-spacing:.06em">✦ NATAL NO AR</p>
  <h1 style="font-size:24px;margin:0 0 8px">Seu kit está liberado</h1>
  <p>O pagamento foi confirmado. Coleção <b>${esc(campanha)}</b>, plano <b>${esc(plano)}</b>.</p>
  <p style="margin:24px 0"><a href="${esc(link)}" style="background:#B3122E;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;display:inline-block">Abrir minha campanha</a></p>
  <p style="font-size:14px;color:#5E4B50">Guarde este e-mail: ele é o seu acesso. Abra no celular que você vai usar para postar.</p>
  <p style="font-size:12px;color:#5E4B50;word-break:break-all">Se o botão não abrir, copie este link: ${esc(link)}</p>
  ${ajuda ? `<p style="font-size:14px">Precisa de ajuda? <a href="${esc(ajuda)}">Fale com a gente no WhatsApp</a>.</p>` : ""}
</div>`;
  return { para, assunto, texto, html };
}

export async function enviarEmail(msg) {
  const { RESEND_API_KEY, EMAIL_REMETENTE, EMAIL_SAIDA_DIR } = process.env;
  if (EMAIL_SAIDA_DIR) {
    await mkdir(EMAIL_SAIDA_DIR, { recursive: true });
    const arq = join(EMAIL_SAIDA_DIR, `${Date.now()}-${msg.para.replace(/[^a-z0-9]/gi, "_")}.json`);
    await writeFile(arq, JSON.stringify(msg, null, 2));
    return { enviado: true, via: "pasta-local", arquivo: arq };
  }
  if (!RESEND_API_KEY || !EMAIL_REMETENTE) return { enviado: false, motivo: "E-mail ainda não configurado (RESEND_API_KEY e EMAIL_REMETENTE)." };
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: EMAIL_REMETENTE, to: [msg.para], subject: msg.assunto, text: msg.texto, html: msg.html }) });
    if (!r.ok) return { enviado: false, motivo: `O serviço de e-mail recusou o envio (HTTP ${r.status}).` };
    return { enviado: true, via: "resend" };
  } catch { return { enviado: false, motivo: "Falha de conexão com o serviço de e-mail." }; }
}
