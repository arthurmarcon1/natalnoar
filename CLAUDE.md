# Natal no Ar

Projeto do Arthur. Protótipo publicado em https://natal-no-ar.vercel.app/ (Vercel, deploy pela branch `main`).

Este arquivo substitui a especificação anterior. O modelo antigo (pacotes de R$ 390 a R$ 890, pedido fechado pelo WhatsApp, temas Presente Certo/Última Chamada/Virada de Look, preço de R$ 690) **não vale mais**. Aproveite o código que funciona, mas adapte tudo à oferta abaixo.

---

## 1. A oferta

O site tem **duas seções principais**:

1. **Campanhas prontas** (destaque da página inicial): kits digitais de Natal por **R$ 89,90**. Cada compra dá acesso a **uma campanha à escolha**. A própria cliente adapta o material: coloca as fotos dela, ajusta os textos e publica.
2. **Gestão mensal**: acompanhamento ao longo do ano, com proposta individual. Tem apresentação própria e leva a uma conversa com o Arthur.

Dentro de Campanhas prontas, a pessoa escolhe entre dois públicos: **Tenho uma loja** e **Presto um serviço**.

A vitrine precisa responder rápido a três perguntas:
- **Serve para o meu negócio?**
- **O que vem dentro?**
- **Eu consigo usar?**

---

## 2. Primeira tela (texto exato)

Chamada, com esta quebra de linha e **apenas "vem pronto." em itálico**:

```
Fim de ano corrido?
Seu conteúdo *vem pronto.*
```

Texto de apoio:

> Escolha sua campanha de Natal por R$ 89,90. Os carrosséis, os roteiros de Reels e o calendário já vêm preparados. Você coloca suas fotos, adapta os textos e publica.

- Botão principal: **Escolher minha campanha**
- Link secundário: **Conhecer a gestão mensal** (leva à seção Gestão mensal)
- No celular, priorize a leitura da chamada e o acesso ao botão, que deve aparecer sem rolar.
- Logo depois da chamada, mostre uma **amostra real do que a pessoa pode editar**, de preferência a mesma peça **antes e depois** da edição.

---

## 3. Campanhas prontas (R$ 89,90 cada)

### O que vem em cada campanha
- **5 carrosséis editáveis** de 4 telas cada, com legendas
- **5 roteiros de Reels**, cada um com abertura, cenas, texto na tela, legenda e chamada final, para a cliente gravar. Cada roteiro tem uma **alternativa para quem prefere não aparecer** (só mãos, produto, ambiente ou tela com texto).
- **5 sequências de Stories** de 3 telas
- **3 mensagens de WhatsApp** prontas
- **Calendário de 10 dias**, com uma **versão expressa de 3 dias**
- **Tutorial curto de edição**

Na apresentação, deixe claro que os Reels são roteiros para gravar, não vídeos prontos.

### Caminho "Tenho uma loja"
Temas:
1. **Presentes por orçamento** (campanha completa, ver seção 4)
2. **Looks para celebrar**
3. **Favoritos da loja**
4. **Natal de última hora**
5. **Looks para a virada**

### Caminho "Presto um serviço"
Temas. Em cada um, o site precisa dizer **para qual profissional ele faz sentido**. As sugestões abaixo são ponto de partida e podem ser ajustadas:

1. **Por trás do resultado**: bastidores, escolhas do profissional e trabalhos reais. Exemplos: a fotógrafa mostra a história de um ensaio; a maquiadora mostra como escolheu os tons de uma produção; a cabeleireira mostra o antes e depois de um penteado de festa.
2. **Seu toque nas festas**: como o serviço entra nas comemorações de fim de ano. Para maquiadoras, cabeleireiras, designers de sobrancelha, manicures, confeiteiras e decoradoras.
3. **Um tempo para cuidar**: o serviço como pausa e autocuidado no fim de ano corrido. Para esteticistas, massoterapeutas, manicures e terapeutas.
4. **Memórias de dezembro**: registros e lembranças da época. Para fotógrafas, videomakers, artesãs e quem faz lembranças personalizadas.
5. **Um ano de boas histórias**: retrospectiva com clientes, trabalhos e aprendizados do ano. Serve para qualquer prestador com portfólio.

**Não use "como agendar um serviço" como tema.**

### Status dos temas
Só **Presentes por orçamento** está completa. Os outros **9 temas** aparecem com o selo **Em preparação** até o material deles ficar pronto. O status de cada tema é configurável (seção 8).

---

## 4. Campanha completa: Presentes por orçamento

Implementar **por inteiro**. O conteúdo se organiza em **5 temas**. Em cada tema, um **carrossel**, um **roteiro de Reel** e uma **sequência de Stories** se conectam, para a lojista usar as mesmas fotos e produtos nas três peças.

Os 5 temas:
1. **Presentes por faixa de preço**
2. **Um presente para cada estilo**
3. **O favorito da loja**
4. **Duplas que combinam**
5. **Últimas compras**

### Nível de detalhe esperado (exemplo do tema 1)
- **Carrossel:** a tela 1 abre com "3 presentes até R$ [valor]". As telas 2 a 4 mostram cada produto com preço e para quem combina ("para a mãe que ama sair", "para a amiga do amigo secreto").
- **Reel:** o roteiro orienta a filmar um detalhe de cada item (textura, fecho, caimento), com abertura, cenas, texto na tela, legenda e chamada final. Inclui a alternativa sem aparecer.
- **Stories:** a lojista mostra duas opções e pergunta "Qual você daria de presente?" (enquete). A última tela convida a consultar a disponibilidade.
- **Legenda:** pronta para copiar, com chamada para o WhatsApp ou para o direct.

Escreva os textos dos **5 temas** nesse mesmo nível de detalhe: telas do carrossel, legenda, roteiro do Reel com alternativa, 3 telas de Stories. Além disso:
- **3 mensagens de WhatsApp** (ex.: resposta a quem pergunta preço, sugestão de presente, aviso de prazo).
- **Calendário de 10 dias** que indica cada peça **pelo nome** (ex.: "Dia 1: carrossel *3 presentes até R$ 100*"). Inclui a **versão expressa de 3 dias**.
- **Tutorial curto** de edição.

Use `[valor]`, `[nome da loja]`, `[produto]` etc. como marcadores que a cliente troca.

---

## 5. Demonstração: "Experimentar uma publicação"

A demonstração começa com o botão **Experimentar uma publicação**. Ela abre um carrossel de Presentes por orçamento num editor que funciona no celular.

A visitante precisa conseguir:
- **Trocar a foto** de cada tela por uma imagem do próprio celular (input de arquivo; a câmera é opcional).
- **Alterar a marca** (nome da loja), **o texto** e **o preço**.
- **Conferir as 4 telas** em tamanho legível no celular.
- **Baixar os PNGs em ordem** (`01-...png` a `04-...png`), em formato do Instagram, 1080 × 1350 (4:5).
- Se for viável, **baixar as 4 telas juntas** (zip). No iPhone, onde downloads múltiplos falham, ofereça compartilhar as imagens pelo menu do sistema (Web Share com arquivos), se disponível.
- Ver a **legenda ao lado** da prévia, com botão **Copiar legenda**.

Requisitos técnicos:
- As fotos são processadas **só no navegador**. Nada é enviado a servidor.
- Respeite a orientação da foto do celular (EXIF) e enquadre em modo "cover". Permitir ajustar posição ou zoom é um bônus.
- A exportação precisa sair igual à prévia: fontes carregadas antes de desenhar, sem cortes. Prefira desenhar em `<canvas>` a capturar HTML.
- Funciona com **fotos comuns de celular**: claras ou escuras, verticais ou horizontais. Garanta contraste do texto sobre qualquer foto (faixa, degradê ou área sólida).

Depois da demonstração do kit, inclua um **convite discreto** para conhecer a Gestão mensal. A cliente que escolheu o kit precisa conseguir seguir direto para a campanha dela, sem desvio.

---

## 6. Gestão mensal

- Acessível pelo **menu** e pelo link **Conhecer a gestão mensal** da primeira tela.
- Título: **Gestão mensal de conteúdo**
- Texto:
  > Se você quer acompanhamento ao longo do ano, me conte um pouco sobre seu negócio. Vamos conversar sobre o que você precisa para eu preparar uma proposta.
- Botão: **Conversar sobre gestão mensal**. O destino é o contato comercial do Arthur, configurável (seção 8).
- Não mostre preço nem lista fechada de entregas. Tudo isso é definido na proposta individual.

---

## 7. Compra, entrega e revisão

Fluxo final desejado: **escolher uma campanha → pagar R$ 89,90 → receber acesso automático ao kit escolhido**.

Enquanto a plataforma de pagamento e entrega não estiver definida:
- A demonstração continua acessível.
- Os botões de compra mostram que **as compras abrem em breve** (sem link quebrado).
- Cada campanha tem um campo de **link de pagamento**. Quando preenchido, o botão passa a levar ao checkout.
- Reaproveite o carrinho antigo só se ele facilitar esse percurso. Como cada compra é uma campanha, um botão direto por campanha provavelmente é mais simples.
- **Remova o antigo preço de R$ 690** e qualquer resto do modelo de pacotes.

---

## 8. Configuração (tudo num lugar só)

Crie um arquivo único de configuração (ex.: `src/config/site.ts` ou `config.js`, conforme a stack) com:

- `precoCampanha`: `89.90`
- `comprasAbertas`: `false` (enquanto não houver pagamento)
- `contatoGestao`: link ou número do contato comercial (WhatsApp `https://wa.me/55...` ou outro), vazio por padrão
- `publicos`: lojas e prestadores, com nome, chamada e lista de temas
- Para cada tema: `id`, `nome`, `publico`, `descricao`, `paraQuem` (prestadores), `status` (`"disponivel"` | `"em-preparacao"`), `linkPagamento` (vazio por padrão)

O conteúdo das campanhas (textos dos carrosséis, roteiros, Stories, mensagens, calendário, tutorial) fica em arquivos de conteúdo separados por campanha (ex.: `content/presentes-por-orcamento.ts`), fáceis de editar sem mexer em componentes.

---

## 9. Direção visual

- Site com personalidade, que funcione bem com **fotos comuns de celular**.
- A identidade anterior (rosa, cereja, ameixa, Bodoni, celulares ilustrados com SVG) ficou com **cara de imagem gerada por IA**. Pode mudar.
- Prefira **boa tipografia**, **composição editorial**, **espaço para as fotos** e **um detalhe natalino discreto**.
- Dê destaque visual ao **"vem pronto."**.
- O foco é o **material digital**: a melhor imagem de venda é o próprio produto. Mostre a **mesma peça antes e depois da edição** (foto genérica + texto marcador → foto, preço e marca da cliente).
- No celular, as telas do carrossel precisam estar grandes o bastante para ler.
- Mobile first: tudo precisa funcionar bem em ~390 px de largura, sem rolagem lateral.
- Textos curtos, em português do Brasil, falando com a cliente.

---

## 10. Roteiro de anúncio

Prepare `docs/roteiro-anuncio.md`, um roteiro curto (30–45 s) para o Arthur gravar a tela do celular:
1. Abrir o calendário no celular.
2. Escolher a publicação do dia.
3. Trocar a foto e o preço.
4. Mostrar o resultado.
5. Apresentar a campanha por R$ 89,90.

Inclua o texto falado, o texto na tela e a legenda do anúncio.

---

## 11. Como saber que ficou pronto

Antes de encerrar qualquer etapa grande, teste:
- Os **dois caminhos da página inicial**: "Escolher minha campanha" e "Conhecer a gestão mensal".
- A **troca de público** (loja ↔ serviço) mostra os temas certos, com o selo Em preparação onde cabe.
- A **edição com foto**: trocar foto, marca, texto e preço reflete nas 4 telas.
- A **cópia da legenda**.
- A **exportação das 4 telas**: PNGs em ordem, 1080 × 1350, iguais à prévia; e o zip, se existir.
- Botões de compra mostram "em breve" com `comprasAbertas: false` e levam ao link de pagamento quando configurado.
- O layout em ~390 px no celular.
- Não sobrou R$ 690 nem texto do modelo antigo (procure no código).

Ao final, entregue:
- o **link da prévia** (deploy de prévia da Vercel)
- o **caminho para testar a campanha completa** (passo a passo de cliques)
- uma **lista curta do que ainda depende do Arthur** para abrir as vendas

---

## 12. Regras de trabalho

- Antes de mudanças grandes, mostre o plano e espere aprovação.
- Trabalhe em uma branch (ex.: `campanhas-prontas`), com commits pequenos e mensagens claras.
- Não publique em produção (`main` / `vercel --prod`) sem o Arthur pedir. Use deploy de prévia.
- Não invente links, números ou plataformas de pagamento. Deixe os campos vazios e sinalize.
- Ao terminar cada etapa, atualize a seção "Andamento" abaixo.

## Andamento
- [x] Etapa 1: diagnóstico e plano (stack estática mantida: HTML + módulos JS, sem build; editor em canvas, zip próprio sem dependências)
- [x] Etapa 2: estrutura, configuração e página inicial (`config.js`, nova direção visual, menu, chamada exata, amostra antes/depois)
- [x] Etapa 3: Campanhas prontas (dois públicos, 10 temas, 9 com selo Em preparação, "Faz sentido para" nos de serviço)
- [x] Etapa 4: conteúdo completo de Presentes por orçamento (`content/presentes-por-orcamento.js`, página `#campanha/presentes-por-orcamento`)
- [x] Etapa 5: editor "Experimentar uma publicação" e exportação (`#experimentar`: fotos do aparelho com EXIF, zoom/posição, PNG 1080 × 1350, zip, compartilhar no iPhone)
- [x] Etapa 6: Gestão mensal, compra "em breve" e roteiro de anúncio (`docs/roteiro-anuncio.md`)
- [x] Etapa 7: testes (12 de lógica + verificação no navegador da seção 11), deploy de prévia da branch `campanhas-prontas`
- [x] Publicado em produção (Arthur pediu em 20/11/2026): https://natal-no-ar.vercel.app

- [x] Redesenho aprovado e publicado (menos texto, animação da capa, carrossel em destaque, vitrine do kit) (21/11/2026)
- [x] Demonstração interativa (3 produtos × Carrossel/Reel/Stories), "Testar com a minha foto" com marca-d'água AMOSTRA, trechos públicos e área da cliente protegida (20/11/2026)

### Pendências do Arthur para abrir as vendas
- Criar os segredos `ACESSO_SECRET` e `ADMIN_TOKEN` na Vercel (ver "Área da cliente"). Sem eles a área fica fechada.
- Pagamento: pelo WhatsApp. No lançamento, mudar `modoCompra` para `"checkout"` em `config.js`. Para cada venda confirmada, gerar e enviar o link de acesso ("Área da cliente", passo 2).
- Trocar as fotos provisórias de `public/assets/exemplo/` (ilustrações) por fotos reais de produto, mantendo os nomes.
- Confirmar o contato da gestão mensal (`contatoGestao`, hoje o WhatsApp (55) 9940-8766).
- Revisar os textos da campanha em `private/campanhas/presentes-por-orcamento.js`.
- Material dos outros 9 temas (status `em-preparacao` até lá).

## Deploy
- **Produção:** https://natal-no-ar.vercel.app (branch `main`). Só publicar em produção quando o Arthur pedir.
- **Repositório:** https://github.com/arthurmarcon1/natalnoar (público).
- **Vercel:** projeto `natal-no-ar` (time `arthur-marcon-s-projects`), preset "Other", site estático sem build, repositório conectado.
  - Push em `main` → produção. Push em outra branch → deploy de prévia (as URLs de prévia pedem login na Vercel).
  - `vercel` → prévia a partir da pasta local; `vercel --prod` → produção.
- **Testes:** `npm test` (não publique com teste falhando).
- **Fora do site:** só `public/` é servido como arquivo; `private/` só é lido pelas funções. `.vercelignore` impede que `tests/`, `docs/`, `CLAUDE.md` e `.env*` sejam enviados.

## Mapa do código (site estático em `public/` + funções em `api/`, sem build)
- `public/`: **tudo o que é servido como arquivo** (a Vercel publica só esta pasta).
  - `index.html`: casca da página e todo o CSS.
  - `config.js`: **configuração única** (seção 8): preço, compras abertas, contato da gestão, públicos e temas (status e link de pagamento).
  - `amostra/presentes-por-orcamento.js`: demonstração pública: 3 produtos de exemplo, cenas do Reel, enquete e **só trechos** de legenda, roteiro e calendário.
  - `assets/exemplo/`: fotos provisórias (trocar pelas reais mantendo os nomes, ou mudar o campo `foto` na amostra).
  - `js/logic.js`: regras puras (compra, contato, enquadramento, legendas, zip). `js/render.js`: desenho das telas em canvas 1080 × 1350, com marca-d'água "AMOSTRA" quando pedido. `js/demo.js`: demonstração Carrossel/Reel/Stories. `js/editor.js`: amostra (1 tela, com marca) e editor completo (área paga, sem marca). `js/app.js`: rotas.
- `private/`: **conteúdo pago**, nunca servido como arquivo.
  - `campanhas/presentes-por-orcamento.js`: 5 carrosséis, 5 Reels, 5 Stories, 3 mensagens, calendário, tutorial. `campanhas/index.js`: lista de campanhas.
  - `acesso.js`: link de acesso assinado (HMAC-SHA256, com validade).
- `api/`: funções da Vercel.
  - `campanha.js`: `GET` com `Authorization: Bearer <token>` → conteúdo pago da campanha do token (401 sem acesso válido).
  - `liberar.js`: `POST` com `x-admin-token` → gera link de acesso (revisão, cortesia ou venda manual).
  - `pagamento.js`: webhook da plataforma de pagamento. **Ainda não ligado** (responde 503); ver comentário no arquivo.
- Rotas: `#inicio` (âncoras `#campanhas`, `#gestao`), `#campanha/presentes-por-orcamento` (carrossel em destaque, Reel e Stories), `#testar` (teste grátis com a minha foto), `#pedido/<tema>` (revisão do pedido), `#area` (área da cliente). Um link `/#acesso=<token>` salva o acesso no aparelho e abre `#area`.

## Planos de compra única (22/11/2026)
A cliente escolhe o perfil (**Sou lojista** / **Sou prestadora de serviço**), vê a campanha do perfil e compara três planos. Os preços são FINAIS por plano (definidos em `public/config.js`, `SITE.planos`):

| Plano | Preço | Carrosséis | Roteiros | Stories | Calendário | Peças |
|---|---:|---:|---:|---:|---|---:|
| Natal Pronto | R$ 89,90 | 5 | 5 | 5 | 10 dias (+ expressa de 3) | 45 |
| Natal Completo | R$ 139,90 | 8 | 8 | 5 | 15 dias | 60 |
| Natal + Virada | R$ 189,90 | 11 | 11 | 8 | 15 dias + 5 de Réveillon | 85 |

- Campanha de cada perfil: lojistas → **Presentes por orçamento**; prestadoras → **Seu toque nas festas** (exemplo de maquiadora). Conteúdo pago em `private/campanhas/<id>.js`; cada um tem `temas` (5), `extras` (3, Natal Completo) e `reveillon` (3 temas + calendário de 5 dias, Natal + Virada).
- Temas extras: lojistas = Achados para o amigo secreto, Uma peça três jeitos de usar, Escolhas da equipe. Prestadoras = Uma dúvida que sempre me fazem, Como escolho cada detalhe, A história por trás de um trabalho. Réveillon: lojistas = Cores da virada, Looks para a virada, Últimos dias do ano; prestadoras = Produção para a virada, Ritual de fim de ano, Obrigada por este ano.
- Vitrine: "A partir de R$ 89,90". Na página da campanha, os 3 cartões mostram preço, totais e o que cada plano acrescenta; o botão e a revisão do pedido trazem o nome e o preço exatos ("Comprar Natal Completo · R$ 139,90"). A mensagem do WhatsApp leva campanha, plano e preço.
- Área da cliente: o link de acesso guarda o plano; `api/campanha` entrega só o que o plano libera (`conteudoDoPlano` em `public/js/logic.js`). Para liberar: `"plano": "natal-pronto" | "natal-completo" | "natal-virada"` no `curl` de `/api/liberar` (obrigatório).
- Checkout por plano: `linksPagamento: { "natal-completo": "https://..." }` no tema; vazio = WhatsApp.
- Demonstrações públicas por campanha em `public/amostra/` (fotos 01–04 lojistas, 05–08 prestadoras em `public/assets/exemplo/`).

## Regras do redesenho (21/11/2026)
- Página inicial: chamada em duas linhas ("Fim de ano corrido?" / "Seu conteúdo *vem pronto.*", só "vem pronto." em itálico), fundo claro, texto preto, botões principais em vermelho-cereja (`--cereja`). Ao lado (no celular, abaixo) da chamada, uma animação que acontece uma vez: a foto entra na capa do post, o preço aparece e três cartões abrem em leque. "Escolher minha campanha" funciona desde o início. Fotos e preços da animação vêm de `public/amostra/presentes-por-orcamento.js`.
- Página da campanha: o carrossel preenchido ocupa a maior parte da primeira tela, desliza com o dedo e mostra parte do próximo cartão. Ação principal: **Comprar campanha · R$ 89,90** (botão cheio). Secundária: **Testar com a minha foto**.
- Compra (`modoCompra` em `config.js`): `"revisao"` nos testes (abre a revisão do pedido, sem cobrar nem simular aprovação; de lá segue para o checkout) e `"checkout"` no lançamento (vai direto ao checkout: `linkPagamento` do tema ou WhatsApp de vendas). Não existe mais "Compras abrem em breve".
- Marca-d'água: demonstrações com fotos de exemplo são **limpas**. "AMOSTRA" só aparece quando a visitante usa uma foto própria no teste grátis (prévia e PNG); voltar à foto de exemplo tira a marca. No kit comprado tudo sai limpo.
- Textos longos ficam em "Ver tudo que vem no kit": botão de destaque (borda cereja, miniaturas das fotos, "45 peças prontas") que abre uma vitrine com um cartão ilustrado por material (5 carrosséis, 5 Reels, 5 Stories, 3 mensagens, calendário de 10 dias, tutorial), o total "45 peças por R$ 89,90" e o botão de compra. A conta: 20 telas de carrossel + 5 roteiros + 15 telas de Stories + 3 mensagens + calendário + tutorial = 45. Transições curtas; com movimento reduzido, nada anima.
- Testes: `npm test` (lógica, conteúdo, token, API e vazamento de conteúdo pago). Servidor local que imita a Vercel: `ACESSO_SECRET=... ADMIN_TOKEN=... node tests/servidor.mjs`.

## Área da cliente: configurar e liberar acesso
1. Criar os segredos na Vercel (uma vez, para produção e prévia):
   ```bash
   openssl rand -hex 32 | vercel env add ACESSO_SECRET production
   openssl rand -hex 32 | vercel env add ACESSO_SECRET preview
   openssl rand -hex 24 > .env.admin.local   # guarde: é o seu ADMIN_TOKEN (arquivo ignorado pelo git)
   vercel env add ADMIN_TOKEN production < .env.admin.local
   vercel env add ADMIN_TOKEN preview < .env.admin.local
   ```
   Depois, publique de novo (push na `main`) para as funções lerem os segredos.
2. Gerar um link de acesso (ex.: para revisar a área ou para uma venda manual):
   ```bash
   curl -s -X POST https://natal-no-ar.vercel.app/api/liberar \
     -H "x-admin-token: $(cat .env.admin.local)" -H "content-type: application/json" \
     -d '{"campanha":"presentes-por-orcamento","plano":"natal-completo","dias":365,"referencia":"pedido-001"}'
   ```
   A resposta traz `link`: envie para a cliente. Trocar o `ACESSO_SECRET` invalida todos os links já enviados.
3. **Venda pelo WhatsApp (fluxo atual, decidido em 20/11/2026):** o botão "Comprar por R$ 89,90 no WhatsApp" abre o `whatsappVendas` de `config.js` com a mensagem pronta (`mensagemCompra`). O Arthur combina e confirma o pagamento na conversa, gera o link com o comando do passo 2 (use o número do pedido ou o nome da cliente em `referencia`) e envia o link pelo WhatsApp. `api/pagamento.js` (webhook automático) não é usado.

---

# Prompts para usar no Claude Code

Cole um de cada vez, na ordem, e só passe para o próximo depois de revisar o resultado.

### Prompt 1: diagnóstico e plano
```
Leia o CLAUDE.md inteiro e o código atual do repositório. Não altere nada ainda.
Me diga: qual é a stack atual, o que dá para aproveitar e o que precisa sair (modelo antigo de pacotes, R$ 690, pedido pelo WhatsApp).
Depois proponha: estrutura de pastas e rotas, onde fica o arquivo de configuração, onde fica o conteúdo das campanhas, como vai funcionar a exportação dos PNGs e do zip, e as bibliotecas que pretende usar.
Se o projeto ainda for um index.html estático, recomende se vale migrar para Next.js + TypeScript para o editor.
Termine com o plano dividido nas etapas da seção "Andamento" e espere minha aprovação.
```

### Prompt 2: estrutura, configuração e página inicial
```
Plano aprovado. Crie a branch campanhas-prontas.
Faça a Etapa 2 do CLAUDE.md: arquivo de configuração (seção 8), nova direção visual (seção 9), menu com Campanhas prontas e Gestão mensal, e a primeira tela com o texto exato da seção 2 (só "vem pronto." em itálico, com a quebra de linha).
Logo abaixo da chamada, deixe o espaço da amostra antes e depois (pode usar conteúdo provisório por enquanto).
Remova o modelo antigo. Confira em 390 px de largura e me mostre o resultado.
```

### Prompt 3: Campanhas prontas
```
Faça a Etapa 3: seção Campanhas prontas com o preço de R$ 89,90, o que vem em cada campanha (seção 3, deixando claro como são os roteiros de Reels e a alternativa para quem não quer aparecer) e a escolha entre "Tenho uma loja" e "Presto um serviço".
Mostre os temas de cada público. Nos de serviço, diga para qual profissional cada tema faz sentido.
Presentes por orçamento como disponível; os outros 9 com o selo Em preparação, vindos da configuração.
A vitrine precisa responder rápido: serve para o meu negócio, o que vem dentro, eu consigo usar.
```

### Prompt 4: conteúdo de Presentes por orçamento
```
Faça a Etapa 4: escreva o conteúdo completo de Presentes por orçamento no arquivo de conteúdo da campanha, seguindo a seção 4.
Para os 5 temas: 4 telas de carrossel + legenda, roteiro de Reel (abertura, cenas, texto na tela, legenda, chamada final e alternativa sem aparecer) e 3 telas de Stories, todos usando os mesmos produtos.
Inclua as 3 mensagens de WhatsApp, o calendário de 10 dias citando cada peça pelo nome, a versão expressa de 3 dias e o tutorial curto.
Crie uma página da campanha onde dá para navegar por tudo isso. Me mostre os textos para eu revisar antes de seguir.
```

### Prompt 5: editor e exportação
```
Faça a Etapa 5: o editor "Experimentar uma publicação" da seção 5.
Precisa funcionar no celular: trocar a foto de cada tela por uma do aparelho, editar marca, texto e preço, ver as 4 telas grandes, legenda ao lado com Copiar legenda, baixar os 4 PNGs em ordem (1080x1350) e, se viável, as 4 juntas em zip. No iPhone, ofereça compartilhar as imagens pelo menu do sistema.
Fotos só no navegador. Respeite a orientação da foto e garanta contraste do texto sobre qualquer foto.
Use esse editor também para a amostra antes e depois da primeira tela.
Teste com uma foto vertical e uma horizontal e me diga o que testou.
```

### Prompt 6: Gestão mensal, compra e anúncio
```
Faça a Etapa 6:
- Seção Gestão mensal de conteúdo (seção 6), com o botão apontando para contatoGestao da configuração. Se estiver vazio, mostre um aviso claro em vez de link quebrado.
- Convite discreto para a gestão mensal depois da demonstração, sem atrapalhar quem quer seguir para a campanha.
- Botões de compra por campanha seguindo a seção 7: "compras abrem em breve" quando comprasAbertas for false e checkout pelo linkPagamento quando configurado.
- O roteiro de anúncio em docs/roteiro-anuncio.md (seção 10).
```

### Prompt 7: testes, prévia e entrega
```
Faça a Etapa 7: rode todos os testes da seção 11 e corrija o que falhar. Procure no código por "690" e restos do modelo antigo.
Faça commit, envie a branch e publique um deploy de prévia na Vercel (não em produção).
Atualize a seção Andamento do CLAUDE.md.
Me entregue: o link da prévia, o passo a passo para testar a campanha completa e a lista curta do que ainda depende de mim para abrir as vendas.
```

### Prompt 8: publicar em produção (só quando aprovar a prévia)
```
Aprovei a prévia. Faça o merge da branch campanhas-prontas na main e publique em produção na Vercel. Confira se https://natal-no-ar.vercel.app/ abriu a versão nova e me confirme.
```
