# Pagamento com InfinitePay e liberação automática

Como funciona, o que configurar em privado e como fazer a primeira compra real de teste.

## O percurso da cliente
1. Escolhe a coleção e o plano → **Revisão do pedido** (`#pedido/<coleção>/<plano>`): coleção, plano, total, e-mail e confirmação do e-mail.
2. **Continuar para o pagamento** → o servidor (`/api/pedido`) monta o pedido com o preço dele (R$ 89,90, R$ 139,90 ou R$ 189,90) e pede o link à InfinitePay.
3. Paga na página da InfinitePay (Pix ou cartão; a InfinitePay não permite desligar o cartão).
4. A InfinitePay avisa o servidor (`/api/infinitepay`, webhook). O servidor **confere na InfinitePay** (`payment_check`) se está pago, se é o mesmo pedido e se o valor bate, e envia o e-mail com o link de acesso. Funciona mesmo se a cliente fechar a aba.
5. Se a cliente volta ao site (`/retorno.html` → `#retorno`), o servidor confere de novo e mostra **Abrir minha campanha**. Voltar sem pagar não libera nada.
6. Aviso repetido = o mesmo link de acesso (nunca um segundo). E-mail não chegou: **reenvie o e-mail** na página de retorno (sem nova cobrança), ou o Arthur gera o link em `/api/liberar`.

## Contas e configurações (em privado)
Cadastre como variáveis de ambiente na hospedagem (na Vercel: projeto → Settings → Environment Variables, marcar **Sensitive**; ou `vercel env add NOME production`). Nunca no código nem no chat.

| Variável | O que é | Onde pegar |
|---|---|---|
| `ACESSO_SECRET` | Assina os links de acesso e os pedidos (64 caracteres aleatórios) | `openssl rand -hex 32` |
| `ADMIN_TOKEN` | Senha do Arthur para `/api/liberar` e para o pedido de teste de R$ 1,00 | `openssl rand -hex 24` |
| `INFINITEPAY_HANDLE` | Sua InfiniteTag, sem o `$` | App ou Conta Web da InfinitePay |
| `INFINITEPAY_API_KEY` | Opcional (começa com `inchk_`): faz o link aceitar um pagamento só e expirar em 2 dias | Configurações do Checkout → criar chave (aparece uma vez só) |
| `SITE_URL` | Endereço do site, sem barra no fim | ex.: `https://natal-no-ar.vercel.app` |
| `RESEND_API_KEY` | Envio do e-mail com o acesso | resend.com → API Keys |
| `EMAIL_REMETENTE` | Remetente, ex.: `Natal no Ar <acesso@seudominio.com.br>` | domínio verificado no Resend |
| `PRECO_TESTE_CENTAVOS` | Opcional: `100` = pedido de teste de R$ 1,00 (só com o `ADMIN_TOKEN`) | — |

Na InfinitePay, ative **Habilitar Checkout Integrado**: App → Vendas → Checkout → Configurações (ou https://app.infinitepay.io/external-checkout#configuracoes). Não há aprovação: vale na hora.

Depois de cadastrar, publique de novo para as funções lerem as variáveis.

## Primeira compra real (a InfinitePay não tem ambiente de testes)
1. Com tudo cadastrado e publicado, gere um pedido de **R$ 1,00** (o valor mínimo da InfinitePay):
   ```bash
   curl -s -X POST https://natal-no-ar.vercel.app/api/pedido \
     -H "x-admin-token: SEU_ADMIN_TOKEN" -H "content-type: application/json" \
     -d '{"campanha":"presentes-por-orcamento","plano":"natal-pronto","email":"seu@email.com","confirmacao":"seu@email.com","teste":true}'
   ```
   A resposta traz `url`: abra no celular e pague com **Pix**.
2. Confira: a página volta ao site com **Pagamento confirmado!**; o e-mail chega; o link do e-mail abre **Presentes por orçamento** no plano **Natal Pronto** com os 5 carrosséis.
3. Repita com **cartão** (pode ser outro pedido de R$ 1,00).
4. Estorne os dois pagamentos no App ou na Conta Web da InfinitePay (não há estorno pela API).
5. Faça também um pedido normal pelo site até a tela de pagamento da InfinitePay (sem pagar) para conferir o valor de R$ 89,90.

O que só a compra real confirma (a documentação não detalha): o nome do campo do link na resposta da InfinitePay (o código aceita `url`, `checkout_url`, `link` e `payment_url`), o tamanho aceito do `order_nsu` (o nosso tem cerca de 120 caracteres), a chegada do webhook e os parâmetros da volta (`order_nsu`, `slug`, `transaction_nsu`). Se algo falhar, os registros das funções na hospedagem mostram o motivo.

## Testes locais (sem dinheiro)
- `npm test`: inclui `tests/pagamento.test.mjs` (pedido, preço, adulteração, pendente, aprovado, repetido, valor menor, falha temporária, e-mail não configurado, reenvio).
- Simulador da InfinitePay: `tests/infinitepay-falso.mjs` + `tests/navegador/compra.mjs` (percurso completo no celular, Pix, cartão aprovado e recusado, aba fechada, link do e-mail abrindo o kit).
