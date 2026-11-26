# Pagamento com o IPG do Sicredi (gateway + antifraude)

O Natal no Ar usa o **IPG** (Internet Payment Gateway da Fiserv, oferecido pelo Sicredi) no modo **Connect**: a cliente paga na **página segura do IPG**. Os dados do cartão nunca passam pelo nosso site; o antifraude e o 3-D Secure rodam no IPG. Implementação conforme o *Connect Integration Guide* oficial da Fiserv.

## O percurso
1. A cliente escolhe coleção e plano → **Revisão do pedido**: total, e-mail e confirmação do e-mail.
2. **Continuar para o pagamento** → o servidor (`/api/pedido`) monta o pedido com o preço dele (R$ 89,90, R$ 139,90 ou R$ 189,90) e devolve o formulário assinado (`hashExtended`, HMAC-SHA256 com a *shared secret*). O navegador envia esse formulário para a página segura do IPG.
3. A cliente paga no IPG.
4. O IPG avisa o servidor (`/api/ipg`, *transactionNotificationURL*). O servidor confere o `notification_hash`, o valor, a moeda e a data do pedido, e só então envia o e-mail com o link de acesso. Funciona mesmo se a cliente fechar a aba.
5. O IPG devolve a cliente (`/api/ipg-retorno`, *responseSuccessURL/responseFailURL*). O servidor confere o `response_hash` e mostra **Abrir minha campanha** (aprovado), **Pagamento não aprovado** (recusado, com "Tentar de novo") ou **Aguardando** (pagamento ainda em confirmação; o acesso chega por e-mail).
6. Aviso repetido = o mesmo link de acesso. "Reenvie o e-mail" na página de retorno, sem nova cobrança.

## O que pedir ao Sicredi (gerente / suporte do IPG)
1. Uma **loja de testes (homologação)** no IPG: **Store Name** e **Shared Secret** de teste.
2. Depois da homologação: **Store Name**, **Shared Secret** e o **endereço de produção** da página do IPG (Connect).
3. Confirmar que a loja está habilitada para o **Connect (página hospedada, `checkoutoption=combinedpage`)**, em reais (código 986), com **notificação servidor a servidor** (`transactionNotificationURL` enviada em cada transação).
4. Quais **meios de pagamento** ficam na página: cartão de crédito (bandeiras), **Pix** (se o IPG do Sicredi oferece), débito.
5. **Antifraude** e **3-D Secure** configurados na loja. Se o 3-D Secure estiver liberado, cadastramos `IPG_3DS=true`.
6. **MDR** de cada modalidade para produto digital e o prazo de recebimento.

## Configurações (em privado)
Na Vercel: projeto `natal-no-ar` → **Settings → Environment Variables** → marcar **Sensitive** (ou `vercel env add NOME production`). Nunca no código nem no chat.

| Variável | Valor |
|---|---|
| `PAGAMENTO_PROVEDOR` | `ipg` |
| `IPG_STORENAME` | Store Name enviado pelo Sicredi |
| `IPG_SHARED_SECRET` | Shared Secret enviado pelo Sicredi |
| `IPG_URL` | Em produção: o endereço informado pelo Sicredi. Sem ela, o site usa o **ambiente de testes** da Fiserv (`https://test.ipg-online.com/connect/gateway/processing`). |
| `IPG_3DS` | `true` se o 3-D Secure estiver habilitado na loja (opcional) |
| `ACESSO_SECRET` | `openssl rand -hex 32` (assina pedidos e links de acesso) |
| `ADMIN_TOKEN` | `openssl rand -hex 24` (senha do Arthur para `/api/liberar` e pedidos de teste) |
| `SITE_URL` | `https://natal-no-ar.vercel.app` (ou o domínio próprio) |
| `RESEND_API_KEY`, `EMAIL_REMETENTE` | envio do e-mail com o acesso (precisa de domínio próprio verificado no Resend) |

Depois de cadastrar, publique de novo (push na `main`). Enquanto `IPG_STORENAME` e `IPG_SHARED_SECRET` não existirem, o site mostra a compra pelo WhatsApp.

## Homologação (com a loja de testes, sem dinheiro de verdade)
1. Cadastre as variáveis com os dados da **loja de testes** e **sem** `IPG_URL`.
2. Faça um pedido pelo site (Natal Pronto, R$ 89,90) e pague com um **cartão de teste** informado pelo Sicredi/Fiserv. O guia recomenda **valores pares** no ambiente de testes: valores como 13,01 podem simular recusa.
3. Confira: volta com **Pagamento confirmado!**; o e-mail chega; o link abre **Presentes por orçamento** com os 5 carrosséis no celular.
4. Teste também um cartão **recusado** (deve mostrar "Pagamento não aprovado" e não liberar nada) e, se houver Pix, um Pix pago depois de fechar a aba (o acesso chega por e-mail).
5. Aprovado na homologação: troque para os dados de **produção** e cadastre `IPG_URL`.

## Testes locais (simulador)
- `npm test` inclui `tests/ipg.test.mjs`: o hash do pedido é igual ao exemplo oficial do guia; formulário, volta, aviso, recusado, aguardando, hash falso, valor diferente, pedido trocado e aviso repetido.
- `tests/ipg-falso.mjs` + `tests/navegador/compra-ipg.mjs`: percurso completo no celular (aprovado, recusado, aguardando e confirmado depois, aviso repetido, link do e-mail abrindo o kit).

## Resposta pronta sobre segurança e antifraude (para o Sicredi)
O Natal no Ar vende produtos digitais (kits de conteúdo de R$ 89,90 a R$ 189,90) e vai usar o IPG do Sicredi no modo Connect (página de pagamento hospedada). Os dados do cartão são digitados só na página segura do IPG: o site não recebe, não processa e não armazena dados de cartão. O antifraude e o 3-D Secure são os do próprio IPG. O pedido é assinado com o hash HMAC-SHA256 da shared secret, e o acesso ao produto só é liberado depois que o servidor confere o hash da notificação do IPG, o valor e o pedido. O site usa HTTPS, e as credenciais ficam em variáveis privadas da hospedagem.
