/* Looks para a virada (lojistas de moda). Exemplo preenchido com a loja fictícia Atelier Brisa. */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "looks-para-a-virada", marca: "Atelier Brisa", previa: "cor-2027",
  carrosseis: [
    { id: "tres-jeitos", nivel: 1, nome: "Branco de três jeitos", ideia: "Três fotos espalhadas na capa. Cada tela mostra um look branco pronto e onde ele funciona.",
      telas: [
        T("capa-polaroides", { titulo: "Branco de *três jeitos*", apoio: "Para a virada na praia, em casa ou na festa" }, [P.vestidoBranco, P.camisa, P.lenco]),
        T("int-resultado", { titulo: "Na praia", texto: "Vestido Brisa com rasteira e *óculos grandes*." }, [P.vestidoBranco]),
        T("int-resultado", { titulo: "Em casa", texto: "Camisa de linho aberta sobre regata, com *colar dourado*." }, [P.camisa]),
        T("int-resultado", { titulo: "Na festa", texto: "Branco com sandália dourada e *clutch*: elegante até o último minuto." }, [P.salto])
      ],
      legenda: "Branco na virada, de três jeitos 🤍\n\nNa praia: {2.texto}\nEm casa: {3.texto}\nNa festa: {4.texto}\n\nQual é o seu? Me chama no WhatsApp da {marca} que eu separo o look.\n\n#reveillon #lookbranco" },
    { id: "cor-2027", nivel: 1, nome: "A cor do seu 2027", ideia: "Foto em arco na capa. Cada tela liga uma cor da virada a uma peça.",
      telas: [
        T("capa-arco", { titulo: "Qual a cor do seu *2027*?", apoio: "Escolha a energia do ano novo" }, [P.vestidoBranco]),
        T("int-estilo", { estilo: "*Branco*: paz e recomeço", nome: "Vestido Brisa", preco: "R$ 189" }, [P.vestidoBranco]),
        T("int-estilo", { estilo: "*Dourado*: prosperidade", nome: "Colar Lua", preco: "R$ 99" }, [P.colar]),
        T("int-estilo", { estilo: "*Rosa*: amor", nome: "Lenço de seda rosé", preco: "R$ 59" }, [P.lenco])
      ],
      legenda: "Qual vai ser a cor do seu 2027? 🎨\n\nBranco, paz e recomeço: {2.nome} ({2.preco}).\nDourado, prosperidade: {3.nome} ({3.preco}).\nRosa, amor: {4.nome} ({4.preco}).\n\nConta aqui a sua e chama a {marca} no direct.\n\n#reveillon #coresdavirada" },
    { id: "leve", nivel: 1, nome: "Leve, fresco e bonito", ideia: "Capa tipográfica escura. Depois: o tecido de perto, linho contra viscose e os cuidados com a peça.",
      telas: [
        T("capa-tipo", { titulo: "Leve, *fresco* e bonito.", apoio: "Tecidos para atravessar a noite de verão" }, [], { inv: true }),
        T("int-detalhe", { titulo: "O linho", texto: "Respira no calor e *amassa do jeito certo*. Charme de praia." }, [P.camisa], { aj: [close(2.2, 0.5, 0.5)] }),
        T("int-comparar", { rot1: "Linho", rot2: "Viscose", texto: "Linho para a praia, viscose para a festa: *os dois* em branco." }, [P.camisa, P.vestidoBranco]),
        T("int-info", { titulo: "Cuidados", linha1: "Lave à mão ou no ciclo delicado", linha2: "Seque à sombra para não amarelar", linha3: "Passe do avesso, em temperatura média", cta: "Dúvidas? Chama no direct" })
      ],
      legenda: "Virada no verão pede tecido que respira ☀️\n\n{2.texto}\n{3.texto}\n\nE para durar até a próxima virada: {4.linha1}, {4.linha2}. Dúvidas? Chama a {marca} no direct.\n\n#linho #reveillon" },
    { id: "par-perfeito", nivel: 1, nome: "O par perfeito da virada", ideia: "Duas fotos e um “+”. Cada tela forma um look em dupla e explica a escolha.",
      telas: [
        T("capa-dupla", { titulo: "O par *perfeito* da virada", apoio: "Duas peças que salvam a noite" }, [P.vestidoBranco, P.salto]),
        T("int-dupla", { nome: "Vestido Brisa + Sandália Dourada", porque: "Branco com dourado é a combinação mais pedida da virada.", preco: "R$ 348 o look" }, [P.vestidoBranco, P.salto]),
        T("int-dupla", { nome: "Camisa de linho + colar", porque: "Leve para a praia, arrumada para o jantar.", preco: "R$ 238 o look" }, [P.camisa, P.colar]),
        T("int-dupla", { nome: "Óculos + lenço", porque: "Para o primeiro dia do ano, na estrada ou na areia.", preco: "R$ 208 a dupla" }, [P.oculos, P.lenco])
      ],
      legenda: "Duas peças que salvam a sua virada 💫\n\n• {2.nome}: {2.preco}\n• {3.nome}: {3.preco}\n• {4.nome}: {4.preco}\n\nEscolha o seu par e me chama no WhatsApp da {marca} com o seu tamanho.\n\n#reveillon #lookpronto" },
    { id: "duas-viradas", nivel: 1, nome: "Mesmo vestido, duas viradas", ideia: "Capa antes e depois com a mesma peça. Os passos mostram como mudar o clima do look.",
      telas: [
        T("capa-antes", { titulo: "Mesmo vestido, *duas viradas*", rot1: "Praia", rot2: "Festa" }, [P.vestidoBranco, P.vestidoBranco], { aj: [close(1, 0.5, 0.5), close(1.4, 0.5, 0.35)] }),
        T("int-passo", { num: "1", titulo: "Base branca", texto: "Comece pelo Vestido Brisa: ele vai do pé na areia ao salão." }, [P.vestidoBranco]),
        T("int-passo", { num: "2", titulo: "Para a praia", texto: "Rasteira, chapéu e óculos. Cabelo solto e pouca joia." }, [P.oculos]),
        T("int-passo", { num: "3", titulo: "Para a festa", texto: "Sandália dourada, brinco grande e clutch. Mesmo vestido, outro clima." }, [P.salto])
      ],
      legenda: "Um vestido, duas viradas 🌊✨\n\n{2.texto}\nPraia: {3.texto}\nFesta: {4.texto}\n\nPasse na {marca} para provar ou peça pelo WhatsApp.\n\n#reveillon #umapecadoisjeitos" },
    { id: "mala", nivel: 2, nome: "A mala da virada", ideia: "Capa com os itens da mala em etiquetas. Depois: checklist, o que cabe na mala e a chamada.",
      telas: [
        T("capa-lista", { titulo: "A mala da *virada*", itens: "Look branco · Sandália · Óculos · Bolsa", apoio: "Para quem vai viajar" }, [P.sacola]),
        T("int-lista", { titulo: "Não *esqueça*", item1: "Um look branco para a meia-noite", item2: "Sandália confortável para a areia", item3: "Óculos de sol para o dia 1º", item4: "Uma bolsa pequena para a festa" }),
        T("int-dois", { titulo: "Cabem na mala", nome1: "Vestido Brisa", preco1: "R$ 189", nome2: "Óculos Riviera", preco2: "R$ 149" }, [P.vestidoBranco, P.oculos]),
        T("int-cta", { titulo: "Monte a sua *mala*", texto: "Diga o destino e a gente sugere o look.", contato: "Chama no WhatsApp" }, [P.sacola])
      ],
      legenda: "Vai viajar na virada? Salva esta lista da mala 🧳\n\n{2.item1}\n{2.item2}\n{2.item3}\n{2.item4}\n\nDiga o destino no WhatsApp da {marca} que a gente sugere o look.\n\n#reveillon #mala" },
    { id: "peca-temporada", nivel: 2, nome: "A peça da temporada", ideia: "Foto com etiqueta de preço. Depois: o detalhe, com o que usar e as informações.",
      telas: [
        T("capa-etiqueta", { titulo: "A peça da *temporada*", preco: "R$ 189", apoio: "Vestido Brisa, em linho branco" }, [P.vestidoBranco]),
        T("int-detalhe", { titulo: "Detalhe", texto: "Alças reguláveis e *bolso escondido* na lateral para o celular." }, [P.vestidoBranco], { aj: [close(2.1, 0.5, 0.3)] }),
        T("int-uso", { titulo: "Use com", passo1: "Rasteira e chapéu para a praia", passo2: "Sandália dourada para a festa", passo3: "Jaqueta jeans para a estrada" }, [P.vestidoBranco]),
        T("int-info", { titulo: "Vestido Brisa", linha1: "R$ 189 ou 3x de R$ 63", linha2: "Do PP ao GG", linha3: "Pronta entrega até 30/12", cta: "Reserve o seu" })
      ],
      legenda: "A peça da temporada na {marca}: {4.titulo} 🤍\n\n{2.texto}\n\n{4.linha1}. {4.linha2}. {4.linha3}. Reserve o seu pelo WhatsApp.\n\n#pecadatemporada #reveillon" },
    { id: "primeiro-dia", nivel: 2, nome: "O look do primeiro dia", ideia: "Foto inteira na capa. Depois: a peça, os acessórios e uma frase para começar o ano.",
      telas: [
        T("capa-foto", { titulo: "O look do *primeiro dia* do ano", apoio: "Para o almoço de 1º de janeiro" }, [P.camisa]),
        T("int-um", { nome: "Camisa de linho", preco: "R$ 139", apoio: "Fresca para o almoço de família" }, [P.camisa]),
        T("int-dois", { titulo: "Acessórios", nome1: "Óculos Riviera", preco1: "R$ 149", nome2: "Lenço de seda", preco2: "R$ 59" }, [P.oculos, P.lenco]),
        T("int-frase", { frase: "Comece *2027* confortável.", autor: "{marca}" }, [], { inv: true })
      ],
      legenda: "E o look do dia 1º? Também merece cuidado ☀️\n\n{2.nome} ({2.preco}) com {3.nome1} e {3.nome2}. Fresco para o almoço de família.\n\nComece 2027 confortável. Chama a {marca} no WhatsApp.\n\n#anonovo #lookdodia" },
    { id: "brinde", nivel: 3, nome: "Looks para o brinde", ideia: "Valor em destaque com as taças como elemento. Dois looks e a bolsa que vai com os dois.",
      telas: [
        T("capa-numero", { titulo: "Looks para o brinde até", valor: "R$ 350", rodape: "Réveillon" }, [P.tacas]),
        T("int-dois", { titulo: "Look 1", nome1: "Vestido Brisa", preco1: "R$ 189", nome2: "Brincos dourados", preco2: "R$ 79" }, [P.vestidoBranco, P.brincos]),
        T("int-dois", { titulo: "Look 2", nome1: "Camisa de linho", preco1: "R$ 139", nome2: "Sandália Dourada", preco2: "R$ 159" }, [P.camisa, P.salto]),
        T("int-um", { nome: "Clutch Noite", preco: "R$ 89", apoio: "Vai com os dois looks", cta: "Escolha o seu pelo WhatsApp" }, [P.clutch])
      ],
      legenda: "Looks para o brinde até {1.valor} 🥂\n\nLook 1: {2.nome1} + {2.nome2}.\nLook 2: {3.nome1} + {3.nome2}.\nE a {4.nome} vai com os dois.\n\nEscolha o seu pelo WhatsApp da {marca}.\n\n#reveillon #brinde" },
    { id: "chega-a-tempo", nivel: 3, nome: "Seu look chega a tempo", ideia: "Calendário no dia 30. Depois: os prazos, o que tem pronta entrega e a reserva.",
      telas: [
        T("capa-calendario", { titulo: "Seu look *chega a tempo*", dia: "30", mes: "DEZ", apoio: "Último dia de entregas" }),
        T("int-prazo", { titulo: "Prazos da *virada*", rot1: "Entregas na cidade até", data1: "30/12", rot2: "Retirada na loja até 12h de", data2: "31/12", nota: "Ajustes de barra só até 28/12." }),
        T("int-opcoes", { titulo: "Pronta *entrega*", op1: "Vestido Brisa", preco1: "R$ 189", op2: "Camisa de linho", preco2: "R$ 139", op3: "Sandália Dourada", preco3: "R$ 159" }, [P.vestidoBranco, P.camisa, P.salto]),
        T("int-cta", { titulo: "Reserve o *seu*", texto: "Mande o tamanho e a peça. A gente separa por 24 horas.", contato: "Chama no WhatsApp" }, [P.estrelinha])
      ],
      legenda: "Seu look da virada chega a tempo 📦\n\nEntregas na cidade até {2.data1}. Retirada na loja até 12h de {2.data2}. {2.nota}\n\nMande o tamanho no WhatsApp da {marca} que a gente separa por 24 horas.\n\n#reveillon #prontaentrega" },
    { id: "obrigada", nivel: 3, nome: "Obrigada por vestir o nosso ano", ideia: "Capa com depoimento. Depois: grade de clientes na virada, uma frase e o até logo.",
      telas: [
        T("capa-citacao", { citacao: "“Passei a virada com o vestido de vocês e *recebi elogio até de desconhecido*.”", autor: "Paula, cliente" }, [P.vestidoBranco]),
        T("int-grade", { titulo: "Clientes na *virada*", texto: "Mande a sua foto com a hashtag da loja que ela aparece aqui." }, [P.vestidoBranco, P.camisa, P.estrelinha, P.tacas]),
        T("int-frase", { frase: "Obrigada por *vestir* o nosso ano.", autor: "Equipe {marca}" }),
        T("int-cta", { titulo: "Até *2027*", texto: "Voltamos no dia 2 com novidades de verão.", contato: "Siga {marca}" }, [P.luzes])
      ],
      legenda: "Obrigada por vestir o nosso ano 🤍\n\n{1.citacao} ({1.autor})\n\nPassou a virada com uma peça da {marca}? Mande a sua foto que ela aparece aqui. Voltamos no dia 2 com novidades de verão. Conta nos comentários como foi a sua virada!\n\n#obrigada #reveillon" }
  ]
};
