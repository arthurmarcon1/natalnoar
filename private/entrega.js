/* Entrega do acesso por e-mail (usada pelo webhook e pelo "Reenviar" da página de retorno). */
import { montarEmail, enviarEmail } from "./email.js";
import { SITE } from "../public/config.js";
import { linkContato } from "../public/js/logic.js";

export async function entregar(pedido, acesso) {
  const ajuda = SITE.whatsappVendas ? linkContato(SITE.whatsappVendas, `Olá! Comprei ${pedido.tema.nome} (${pedido.plano.nome}) e preciso de ajuda com o acesso.`) : "";
  return enviarEmail(montarEmail({ para: pedido.email, link: acesso.link, campanha: pedido.tema.nome, plano: pedido.plano.nome, ajuda }));
}
