/* Looks para celebrar (lojistas de moda). Exemplo preenchido com a loja fictícia Lis Moda. */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "looks-para-celebrar", marca: "Lis Moda", previa: "agenda-festas",
  carrosseis: [
    { id: "look-ceia", nivel: 1, nome: "O look da ceia", ideia: "Foto inteira na capa com cartão de título. Depois: o tecido de perto, o que completa o look e como comprar.",
      telas: [
        T("capa-foto", { titulo: "O look da *ceia* chegou", apoio: "Vestido Noite, a peça da temporada" }, [P.vestido]),
        T("int-detalhe", { titulo: "O tecido", texto: "Crepe com caimento fluido que *não amassa* no caminho até a ceia." }, [P.vestido], { aj: [close(2.2, 0.5, 0.6)] }),
        T("int-dois", { titulo: "Para completar", nome1: "Sandália Dourada", preco1: "R$ 159", nome2: "Brincos dourados", preco2: "R$ 79" }, [P.salto, P.brincos]),
        T("int-info", { titulo: "Vestido Noite", linha1: "R$ 229 ou 4x de R$ 57,25", linha2: "Do P ao GG, ajuste na loja", linha3: "Provador com horário marcado", cta: "Reserve o seu pelo WhatsApp" })
      ],
      legenda: "O look da ceia chegou na {marca} 🍷\n\nO {4.titulo} é de crepe, cai bem e não amassa no caminho. Para completar: {3.nome1} ({3.preco1}) e {3.nome2} ({3.preco2}).\n\n{4.linha1}. Quer provar com horário marcado? Me chama no WhatsApp.\n\n#lookdeceia #natal #modafeminina" },
    { id: "agenda-festas", nivel: 1, nome: "Um look para cada festa", ideia: "Capa com as festas de dezembro em etiquetas. Cada tela resolve uma festa com um look e o preço.",
      telas: [
        T("capa-lista", { titulo: "Um look para cada *festa*", itens: "Confra · Amigo secreto · Ceia", apoio: "Dezembro inteiro resolvido" }, [P.vestido]),
        T("int-estilo", { estilo: "Na *confra* do trabalho", nome: "Camisa de cetim", preco: "R$ 139" }, [P.camisa]),
        T("int-estilo", { estilo: "No *amigo secreto*", nome: "Clutch Noite", preco: "R$ 89" }, [P.clutch]),
        T("int-estilo", { estilo: "Na *ceia* em família", nome: "Vestido Noite", preco: "R$ 229" }, [P.vestido])
      ],
      legenda: "Dezembro tem festa toda semana. E o look? 👗\n\nConfra do trabalho: {2.nome} ({2.preco}).\nAmigo secreto: {3.nome} ({3.preco}) para levantar o jeans.\nCeia em família: {4.nome} ({4.preco}).\n\nQual festa é a próxima na sua agenda? Me conta no direct que a {marca} monta o look com você.\n\n#lookdefesta #dezembro" },
    { id: "brilho", nivel: 1, nome: "Brilho na medida", ideia: "Capa tipográfica clara com a frase de efeito. As telas ensinam, em passos numerados, como usar brilho sem exagero.",
      telas: [
        T("capa-tipo", { titulo: "Brilho, *sim*. Exagero, não.", apoio: "Como usar um ponto de luz no look de festa" }, [], { inv: true }),
        T("int-passo", { num: "1", titulo: "Escolha um ponto só", texto: "Se o brinco brilha, o resto fica neutro. Assim o look parece pensado." }, [P.brincos]),
        T("int-passo", { num: "2", titulo: "Metal combinando", texto: "Dourado com dourado: brinco, fecho da bolsa e sandália na mesma cor." }, [P.clutch]),
        T("int-passo", { num: "3", titulo: "Brilho no pé", texto: "Para quem não quer brilho perto do rosto, a sandália faz o trabalho." }, [P.salto])
      ],
      legenda: "Brilho no fim de ano é tradição. O segredo é a medida ✨\n\n1. {2.titulo}\n2. {3.titulo}\n3. {4.titulo}\n\nSalva para usar na próxima festa e passa na {marca} para escolher o seu ponto de luz. Dúvidas? Chama no direct.\n\n#brilho #lookdefesta" },
    { id: "achado", nivel: 1, nome: "O achado da semana", ideia: "Foto com etiqueta de preço pendurada. Depois: o conforto em close, com o que combina e as informações.",
      telas: [
        T("capa-etiqueta", { titulo: "O achado da *semana*", preco: "R$ 159", apoio: "Sandália Dourada, salto bloco confortável" }, [P.salto]),
        T("int-detalhe", { titulo: "Conforto", texto: "Salto bloco de 7 cm e palmilha macia: *dá para dançar* a noite toda." }, [P.salto], { aj: [close(2, 0.55, 0.55)] }),
        T("int-uso", { titulo: "Combina com", passo1: "Vestido longo da ceia", passo2: "Jeans reto e camisa branca", passo3: "Saia midi no almoço de domingo" }, [P.salto]),
        T("int-info", { titulo: "Sandália Dourada", linha1: "R$ 159 ou 3x de R$ 53", linha2: "Numeração do 34 ao 40", linha3: "Troca garantida até 10/01", cta: "Peça o seu número no direct" })
      ],
      legenda: "Achado da semana na {marca}: a {4.titulo} 👡\n\nSalto bloco de 7 cm, palmilha macia e dourado que combina com tudo. Vai do vestido da ceia ao jeans do dia 26.\n\n{4.linha1}. {4.linha2}. Me chama no direct com o seu número.\n\n#achadodasemana #sandalia" },
    { id: "combinacao", nivel: 1, nome: "Combinação pronta", ideia: "Duas fotos e um “+” na capa. Cada tela explica por que as duas peças funcionam juntas, com o preço do look.",
      telas: [
        T("capa-dupla", { titulo: "Combinação *pronta*", apoio: "Duas peças, um look de festa" }, [P.vestido, P.salto]),
        T("int-dupla", { nome: "Vestido Noite + Sandália Dourada", porque: "O vinho do vestido ganha luz com o dourado da sandália.", preco: "R$ 388 o look" }, [P.vestido, P.salto]),
        T("int-dupla", { nome: "Camisa de cetim + brincos", porque: "Camisa fechada até o pescoço pede brinco grande. Elegante sem esforço.", preco: "R$ 218 o look" }, [P.camisa, P.brincos]),
        T("int-dupla", { nome: "Clutch + colar Lua", porque: "Mesmo dourado, mesma delicadeza: a dupla que vai com qualquer vestido.", preco: "R$ 188 a dupla" }, [P.clutch, P.colar])
      ],
      legenda: "Sem tempo de pensar no look? A {marca} já combinou para você 💫\n\n• {2.nome}: {2.preco}\n• {3.nome}: {3.preco}\n• {4.nome}: {4.preco}\n\nEscolhe a sua combinação e me chama no WhatsApp para separar o tamanho.\n\n#combinacao #lookpronto" },
    { id: "mais-pedido", nivel: 2, nome: "O mais pedido de dezembro", ideia: "Capa com selo de mais vendido. Depois: o que dizem, a mesma peça de dois jeitos e as últimas unidades.",
      telas: [
        T("capa-selo", { titulo: "O mais pedido de *dezembro*", selo: "Mais vendido", apoio: "Vestido Noite" }, [P.vestido]),
        T("int-frase", { frase: "“Recebi elogio a *noite inteira*.”", autor: "Cliente da {marca}" }, [], { inv: true }),
        T("int-comparar", { rot1: "Com sandália", rot2: "Com tênis", texto: "Do jantar ao almoço do dia 25, *a mesma peça*." }, [P.vestido, P.vestido], { aj: [close(1, 0.5, 0.5), close(1.5, 0.5, 0.7)] }),
        T("int-info", { titulo: "Últimas peças", linha1: "Tamanhos P, M e G disponíveis", linha2: "R$ 229 ou 4x sem juros", linha3: "Reserva por 24h pelo WhatsApp", cta: "Garanta o seu" })
      ],
      legenda: "Ele é o mais pedido de dezembro na {marca} 🏆\n\nO Vestido Noite vai do jantar com sandália ao almoço do dia 25 com tênis. E as clientes contam: elogio a noite inteira.\n\n{4.linha1}. {4.linha3}. Garanta o seu no WhatsApp.\n\n#maisvendido #vestido" },
    { id: "dia-noite", nivel: 2, nome: "Do trabalho para a festa", ideia: "Capa antes e depois (dia e noite). As telas mostram as três trocas rápidas que mudam o look.",
      telas: [
        T("capa-antes", { titulo: "Do trabalho para a *festa* em 5 minutos", rot1: "Dia", rot2: "Noite" }, [P.camisa, P.vestido]),
        T("int-passo", { num: "1", titulo: "Troque o sapato", texto: "Saia do tênis para a sandália dourada que cabe na bolsa." }, [P.salto]),
        T("int-passo", { num: "2", titulo: "Acenda o rosto", texto: "Brinco grande e batom: o look muda inteiro." }, [P.brincos]),
        T("int-passo", { num: "3", titulo: "Bolsa de festa", texto: "A clutch entra no lugar da bolsa grande. Pronto." }, [P.clutch])
      ],
      legenda: "Confra depois do expediente? Dá para sair do trabalho direto para a festa 🕔\n\n1. {2.titulo}\n2. {3.titulo}\n3. {4.titulo}\n\nTudo isso tem aqui na {marca}. Me chama no direct que eu monto o seu kit dia e noite.\n\n#confra #lookdetrabalho" },
    { id: "monte-look", nivel: 2, nome: "Monte seu look com a gente", ideia: "Foto em arco na capa. Depois: como funciona a consultoria pelo WhatsApp, exemplos com preço e a chamada.",
      telas: [
        T("capa-arco", { titulo: "Monte seu *look*", apoio: "A gente ajuda pelo WhatsApp" }, [P.camisa]),
        T("int-lista", { titulo: "Como *funciona*", item1: "Você conta a festa e o seu estilo", item2: "A gente sugere 3 combinações com foto", item3: "Você prova na loja ou recebe em casa", item4: "Pequenos ajustes inclusos" }),
        T("int-opcoes", { titulo: "Exemplos de *combinação*", op1: "Vestido + sandália", preco1: "R$ 388", op2: "Camisa + brincos", preco2: "R$ 218", op3: "Clutch + colar", preco3: "R$ 188" }, [P.vestido, P.camisa, P.clutch]),
        T("int-cta", { titulo: "Me conta sua *festa*", texto: "Responda com a data, o lugar e o estilo que você gosta.", contato: "Chama no WhatsApp" }, [P.vestido])
      ],
      legenda: "Não sabe o que usar? Deixa com a gente 💬\n\nVocê conta a festa e o seu estilo, a {marca} sugere três combinações com foto e você prova na loja ou recebe em casa.\n\nManda no WhatsApp: data, lugar e o que você gosta de usar.\n\n#consultoria #lookdefesta" },
    { id: "branco-brilha", nivel: 3, nome: "Branco que brilha", ideia: "Três fotos na capa. Depois: a peça principal, os acessórios dourados e uma frase para o ano novo.",
      telas: [
        T("capa-polaroides", { titulo: "Branco que *brilha*", apoio: "Looks claros para a virada" }, [P.vestidoBranco, P.brincos, P.salto]),
        T("int-um", { nome: "Vestido Brisa", preco: "R$ 189", apoio: "Linho leve para a virada na praia" }, [P.vestidoBranco]),
        T("int-dois", { titulo: "Acessórios dourados", nome1: "Colar Lua", preco1: "R$ 99", nome2: "Sandália Dourada", preco2: "R$ 159" }, [P.colar, P.salto]),
        T("int-frase", { frase: "Entre em *2027* do jeito que você quer viver o ano.", autor: "{marca}" }, [], { inv: true })
      ],
      legenda: "Branco na virada, sim. Mas com brilho ✨\n\n{2.nome} ({2.preco}) com {3.nome1} ({3.preco1}) e {3.nome2} ({3.preco2}).\n\nEntre em 2027 do jeito que você quer viver o ano. Separa o seu look pelo WhatsApp da {marca}.\n\n#reveillon #lookbranco" },
    { id: "contagem", nivel: 3, nome: "Contagem para a virada", ideia: "Calendário no dia 31. Depois: os prazos de ajuste e retirada, o que está pronto para levar e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "Contagem para a *virada*", dia: "31", mes: "DEZ", apoio: "Seu look pronto até lá" }),
        T("int-prazo", { titulo: "Para chegar *a tempo*", rot1: "Ajustes de barra até", data1: "27/12", rot2: "Retirada na loja até", data2: "30/12", nota: "Quer receber em casa? Pedidos de entrega até 29/12." }),
        T("int-opcoes", { titulo: "Prontos para *levar*", op1: "Vestido Brisa", preco1: "R$ 189", op2: "Camisa de linho", preco2: "R$ 139", op3: "Sandália Dourada", preco3: "R$ 159" }, [P.vestidoBranco, P.camisa, P.salto]),
        T("int-cta", { titulo: "Separa o *meu*?", texto: "Manda o tamanho e a peça. A gente reserva por 24 horas.", contato: "Chama no WhatsApp" }, [P.estrelinha])
      ],
      legenda: "A contagem para a virada começou 🎆\n\nAjustes de barra até {2.data1}. Retirada na loja até {2.data2}.\n\nProntos para levar: {3.op1}, {3.op2} e {3.op3}. Manda o tamanho no WhatsApp que a {marca} reserva por 24 horas.\n\n#reveillon #contagemregressiva" },
    { id: "ate-300", nivel: 3, nome: "Look da virada até R$ 300", ideia: "Valor em destaque com as taças como elemento. Dois looks completos e a peça que vai com os dois.",
      telas: [
        T("capa-numero", { titulo: "Look da virada até", valor: "R$ 300", rodape: "Réveillon" }, [P.tacas]),
        T("int-dois", { titulo: "Look 1", nome1: "Vestido Brisa", preco1: "R$ 189", nome2: "Brincos dourados", preco2: "R$ 79" }, [P.vestidoBranco, P.brincos]),
        T("int-dois", { titulo: "Look 2", nome1: "Camisa de linho", preco1: "R$ 139", nome2: "Sandália Dourada", preco2: "R$ 159" }, [P.camisa, P.salto]),
        T("int-um", { nome: "Clutch Noite", preco: "R$ 89", apoio: "Combina com os dois looks", cta: "Escolha o seu look no WhatsApp" }, [P.clutch])
      ],
      legenda: "Look da virada completo até {1.valor} 🥂\n\nLook 1: {2.nome1} + {2.nome2}.\nLook 2: {3.nome1} + {3.nome2}.\nE a {4.nome} ({4.preco}) vai com os dois.\n\nQual é o seu? Me chama no WhatsApp da {marca}.\n\n#reveillon #lookdavirada" }
  ]
};
