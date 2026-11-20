/* POST /api/pagamento: webhook da plataforma de pagamento.

   AINDA NÃO LIGADO: a plataforma de pagamento não foi escolhida.
   Quando for, este arquivo deve:
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
  return json(res, 503, { erro: "Plataforma de pagamento ainda não configurada. Nenhum acesso foi liberado." });
}
