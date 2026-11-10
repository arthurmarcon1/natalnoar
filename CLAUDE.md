# Natal no Ar

Loja digital de conteúdo pronto de fim de ano com duas seções: **Para lojistas** (lojas de moda: roupas, calçados, acessórios) e **Para prestadores de serviço** (maquiadoras, cabeleireiras, fotógrafos etc.). A pessoa escolhe o perfil, monta um pedido com planos e peças, vê o total e envia a solicitação pelo WhatsApp. O pedido é fechado manualmente no WhatsApp: **não há pagamento nem checkout no site**.

## O que se vende
- Peças (as mesmas para os dois perfis): carrossel, vídeo curto editado, pacote de legendas, guia de Stories, calendário de publicações.
- Planos (pacotes) por perfil, com preço menor que o avulso:
  - Lojistas: Essencial, Natal Completo, Natal + Réveillon.
  - Prestadores: Presença, Agenda Cheia, Fim de Ano Completo (**nomes e preços provisórios**).
- Temas por perfil:
  - Lojistas: Guia de presentes, Achados para as festas, Últimas compras de Natal.
  - Prestadores: Especial de fim de ano, Por trás do resultado (exemplos de uma maquiadora).
- Promoções: desconto percentual com data limite e "leve X, pague Y" em peças extras.

## Fluxo do cliente
Escolha de perfil → vitrine do perfil (planos, temas, prévias por tema) → detalhes do plano → pedido (plano ou só avulsos, peças extras com quantidade, temas do perfil) → dados (nome, loja/negócio, WhatsApp obrigatórios; Instagram opcional) → resumo (inclui o perfil) → botão **Enviar solicitação**, que abre o WhatsApp com o resumo preenchido. Sem número configurado: modo demonstração, o botão copia o resumo.

Trocar de perfil (seletor "Você está em" na vitrine e no pedido) remove do carrinho o plano e os temas do outro perfil e mantém as peças avulsas.

## Estado atual
- Site em `index.html` (HTML/CSS/JS puro, sem build), publicado na Vercel (ver "Deploy").
- Todo o catálogo fica no objeto `CONFIG`, no topo do `<script>`: itens, `publicos` (seções com planos, temas e exemplos), promoções, número do WhatsApp, prazos.
- A lógica pura (perfil, cálculo, limites, promoções, validação, resumo) fica entre `// @logic-start` e `// @logic-end`.
- Testes da lógica em `tests/logic.test.mjs` (`node --test tests/*.test.mjs`), incluindo troca de perfil.

## Onde editar (tudo em `CONFIG.publicos`)
Cada público tem: `nome`, `curto`, `chamada`, `negocio`/`negocioCampo` (rótulos "Loja"/"Negócio"), `exemploNegocio` (nome usado nas prévias), `capa` (textos do topo), `faz`, `planos`, `temas`, `reel`, `reelLegenda`, `legendas` e `calendario`.
- Tema: `{ id, nome, descricao, exemplo: { legenda, carrossel: [cards], stories: [frames] } }`.
- Cards do carrossel: `{ capa, eyebrow, sub }` (abre), `{ arte, titulo, linha, nota }` (meio), `{ fim, sub }` (fecha). `arte`: bolsa, lenco, sandalia, pincel, batom, brilho.
- Frames dos Stories: `{ titulo }` mais opcionais `texto`, `enquete: [...]`, `escala: [min, max]`, `pecas: [[arte, rótulo]]`, `link`.
- Ids de planos e temas precisam ser únicos entre os públicos (o teste confere).

## Regras que não podem quebrar
- O total, os descontos e o resumo do WhatsApp precisam bater exatamente com o carrinho.
- `max` de cada peça é o total por pedido (plano + extras). Trocar de plano reajusta os extras.
- Economia do plano = soma das peças avulsas − preço do plano, calculada, nunca digitada.
- O carrinho nunca tem plano ou tema de outro perfil.
- Preços marcados como "valores de demonstração" enquanto não forem os reais.
- Catálogo editável em um só lugar, sem mexer na interface.
- Mobile first: tudo precisa funcionar bem em ~400px de largura.

## Identidade visual
Fundo claro rosado, cereja (cor de ação) e ameixa. Fonte única **Plus Jakarta Sans** (Google Fonts), simples e legível: títulos em peso 800, destaque em cereja (sem itálico), texto base 17px. Textos curtos em português do Brasil, falando com quem compra.

## Ao mudar algo
Depois de mexer no cálculo, promoções ou resumo, rodar os testes da lógica e conferir: adicionar/remover peças atualiza o total, campos obrigatórios são validados, e o resumo corresponde ao carrinho.

## Deploy
- **Produção:** https://natal-no-ar.vercel.app (URL .vercel.app, sem domínio próprio).
- **Repositório:** https://github.com/arthurmarcon1/natalnoar (público).
- **Vercel:** projeto `natal-no-ar` no time `arthur-marcon-s-projects`, preset "Other", site estático sem build. Repositório conectado.
- **Publicar nova versão:** rode os testes e dê push na `main`; a Vercel publica sozinha em ~10 s.
  ```bash
  node --test tests/*.test.mjs   # não publique com teste falhando
  git push                       # deploy automático de produção
  vercel --prod                  # alternativa: deploy direto da pasta local
  ```
  Push em outra branch gera uma prévia (as URLs de prévia pedem login da Vercel).
- **Fora do site:** `.vercelignore` impede que `tests/`, `CLAUDE.md` e `.env*` sejam publicados.
- **Trocar número do WhatsApp:** `CONFIG.whatsapp` no topo do `<script>` do `index.html`, só dígitos com DDI e DDD (ex.: `"5555999998888"`). Vazio = modo demonstração (o botão copia o resumo).
- **Trocar preços:** `preco` em `CONFIG.itens` (peças) e em `planos` de cada item de `CONFIG.publicos`; a economia é recalculada sozinha. Promoções em `CONFIG.promocoes`. Com preços reais, mude `valoresDemonstracao` para `false`.
