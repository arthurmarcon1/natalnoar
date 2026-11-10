# Natal no Ar

Loja digital de conteúdo pronto de fim de ano para lojas de moda (roupas, calçados, acessórios), inicialmente de outras cidades. O lojista monta um pedido com pacotes e peças, vê o total e envia a solicitação pelo WhatsApp. O pedido é fechado manualmente no WhatsApp: **não há pagamento nem checkout no site**.

## O que se vende
- Peças: carrossel, vídeo curto editado, pacote de legendas, guia de Stories, calendário de publicações.
- Pacotes: combinações de peças com preço menor que o avulso (Essencial, Natal Completo, Natal + Réveillon).
- Promoções: desconto percentual com data limite e "leve X, pague Y" em peças extras.
- Temas de campanha: no protótipo atual são Presente Certo, Última Chamada e Virada de Look. Serão substituídos pelos temas por público descritos em "Próxima tarefa".

## Fluxo do cliente
Vitrine → detalhes do pacote com exemplos (carrossel, vídeo, Stories, legendas, calendário) → pedido (pacote ou só avulsos, peças extras com quantidade, temas) → dados (nome, loja, WhatsApp obrigatórios; Instagram opcional) → resumo → botão **Enviar solicitação**, que abre o WhatsApp com o resumo preenchido para o próprio cliente enviar. Sem número configurado: modo demonstração, o botão copia o resumo.

## Estado atual
- Protótipo em `index.html` (HTML/CSS/JS puro, sem build).
- Todo o catálogo fica no objeto `CONFIG`, no topo do `<script>`: itens, pacotes, temas, promoções, número do WhatsApp, prazos.
- A lógica pura (cálculo, limites, promoções, validação, resumo) fica entre `// @logic-start` e `// @logic-end`.

## Regras que não podem quebrar
- O total, os descontos e o resumo do WhatsApp precisam bater exatamente com o carrinho.
- `max` de cada peça é o total por pedido (pacote + extras). Trocar de pacote reajusta os extras.
- Economia do pacote = soma das peças avulsas − preço do pacote, calculada, nunca digitada.
- Preços marcados como "valores de demonstração" enquanto não forem os reais.
- Catálogo editável em um só lugar, sem mexer na interface.
- Mobile first: tudo precisa funcionar bem em ~400px de largura.

## Identidade visual
Estética editorial de moda: fundo claro rosado, cereja (cor de ação) e ameixa, títulos em Bodoni Moda (itálico nos destaques), texto em Instrument Sans. Textos curtos em português do Brasil, falando com o lojista.

## Próxima tarefa: duas seções por público

O Natal no Ar passa a ter duas seções: **Para lojistas** e **Para prestadores de serviço**. Cada uma mostra os planos e os temas pensados para aquele público.

### Escolha de perfil
- Logo na entrada, a pessoa escolhe o perfil: lojista ou prestador de serviço.
- Depois de escolher, ela vê só os planos, temas e exemplos da seção dela. Deve dar para trocar de perfil a qualquer momento.
- Ao trocar de perfil, o carrinho remove planos e temas que não pertencem ao novo perfil. As peças avulsas compartilhadas continuam.
- O resumo do WhatsApp informa o perfil escolhido.

### Formatos
Os formatos são os mesmos nas duas seções: carrosséis, guia de Stories e calendário de publicações, além das demais peças que já existem no catálogo. O catálogo de peças continua único. Mudam por seção os planos, os temas e os exemplos.

### Para lojistas
Temas (substituem Presente Certo, Última Chamada e Virada de Look):
- **Guia de presentes**
- **Achados para as festas**
- **Últimas compras de Natal**

Exemplo de prévia: um carrossel de presentes por faixa de preço, com Stories que mostram os produtos em detalhe e convidam a consultar a disponibilidade.

### Para prestadores de serviço
Os temas devem mostrar o valor do trabalho:
- **Especial de fim de ano**: ideias para aproveitar o serviço na época das festas.
- **Por trás do resultado**: bastidores, escolhas do profissional e exemplos de trabalhos reais.

Exemplo de prévia, para uma maquiadora: um carrossel com três estilos de maquiagem para confraternizações e uma sequência de Stories mostrando como ela cria um deles.

### Planos
Cada seção tem seus próprios planos, com temas e exemplos próprios. Os nomes dos planos de prestadores ainda não foram definidos: use nomes provisórios e deixe claro no código que são editáveis.

### Onde editar
Nomes das seções, planos, temas e exemplos ficam no catálogo, num lugar só, sem precisar mexer na interface. Formato sugerido:

```ts
publicos: [
  {
    id: "lojistas",
    nome: "Para lojistas",
    chamada: "...",
    planos: [/* pacotes com itens e preço, como hoje */],
    temas: [{ id, nome, descricao, exemplo: { carrossel: [...cards], stories: [...frames] } }]
  },
  { id: "prestadores", nome: "Para prestadores de serviço", /* ... */ }
]
```

### Como saber que ficou pronto
- Escolher um perfil mostra só os planos, temas e exemplos daquela seção.
- Trocar de perfil não deixa no carrinho plano ou tema do outro perfil.
- As prévias de carrossel e Stories mudam conforme o perfil e o tema.
- Total, descontos e resumo continuam batendo com o carrinho, e o resumo inclui o perfil.
- Os testes da lógica cobrem a troca de perfil.

## Ao mudar algo
Depois de mexer no cálculo, promoções ou resumo, rodar os testes da lógica e conferir: adicionar/remover peças atualiza o total, campos obrigatórios são validados, e o resumo corresponde ao carrinho.
