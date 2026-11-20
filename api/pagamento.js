/* POST /api/pagamento: webhook para uma plataforma de pagamento automática.

   NÃO USADO: o pagamento é combinado pelo WhatsApp (decisão do Arthur, 20/11/2026).
   Depois de confirmar o pagamento na conversa, o Arthur gera o link de acesso em
   /api/liberar e envia para a cliente (passo a passo no CLAUDE.md, "Área da cliente").
   Se um dia houver uma plataforma automática, este arquivo deve:
     1. Conferir a autenticidade do aviso (assinatura do webhook ou consulta à API da plataforma
        com a credencial do vendedor). Nunca confiar só no corpo recebido.
     2. Confirmar que o pagamento está aprovado e qual campanha foi comprada.
     3. Emitir o acesso com emitirToken({ campanha, referencia: <id do pedido> }, ACESSO_SECRET)
        e entregar o link https://natal-no-ar.vercel.app/#acesso=<token> à cliente
        (e-mail da plataforma, página de obrigado ou mensagem).
   Enquanto isso, responde 503 e nada é liberado. */
import { json } from "./_http.js";

export default function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  return json(res, 503, { erro: "Pagamento automático não configurado (as vendas são pelo WhatsApp). Nenhum acesso foi liberado." });
}
