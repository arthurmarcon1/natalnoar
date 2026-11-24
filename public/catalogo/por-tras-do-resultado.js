/* Por trás do resultado (prestadoras com trabalho visual). Cada carrossel usa um exemplo de profissão:
   fotógrafa (Ana Luz Fotografia), maquiadora (Bia Make) e cabeleireira (Studio Cris Cabelos). */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "por-tras-do-resultado", marca: "Ana Luz Fotografia", previa: "decisao",
  carrosseis: [
    { id: "historia-ensaio", nivel: 1, nome: "A história de um ensaio", paraQuem: "Fotógrafas", ideia: "Capa em quadro de filme com o ponto REC. Depois: a ideia, a escolha de luz e o resultado.",
      telas: [
        T("capa-filme", { titulo: "A história de *um ensaio*", apoio: "Bastidores · ensaio de família" }, [P.polaroides]),
        T("int-passo", { num: "1", titulo: "A ideia", texto: "A família queria fotos em casa, com a árvore montada e o cachorro junto." }, [P.luzes]),
        T("int-passo", { num: "2", titulo: "A escolha", texto: "Fotografei às 17h, com a luz da janela entrando de lado. Nada de flash." }, [P.camera]),
        T("int-resultado", { titulo: "O resultado", texto: "Fotos que parecem *lembrança*, não pose." }, [P.polaroides])
      ],
      legenda: "Todo ensaio começa bem antes do clique 🎞️\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\n{4.titulo}: fotos que parecem lembrança, não pose.\n\nQuer um ensaio assim no seu Natal? Me chama no WhatsApp. {marca}\n\n#bastidores #ensaiodenatal #fotografia" },
    { id: "tons-make", nivel: 1, nome: "Como escolhi os tons", marca: "Bia Make", paraQuem: "Maquiadoras", ideia: "Capa antes e depois. Depois: o detalhe dos olhos, a comparação de batons e a chamada.",
      telas: [
        T("capa-antes", { titulo: "Como escolhi os *tons* desta make", rot1: "Pele pronta", rot2: "Make final" }, [P.makeLeve, P.glow]),
        T("int-detalhe", { titulo: "Os olhos", texto: "Dourado só no centro da pálpebra para *acender o olhar* nas fotos." }, [P.glow], { aj: [close(2.2, 0.5, 0.35)] }),
        T("int-comparar", { rot1: "Batom nude", rot2: "Batom vinho", texto: "Escolhi o vinho porque o vestido era branco: *contraste na medida*." }, [P.makeLeve, P.glow]),
        T("int-cta", { titulo: "Quer uma make *assim*?", texto: "Me conte a festa e o horário. As datas de dezembro estão acabando.", contato: "Chama no WhatsApp" }, [P.glow])
      ],
      legenda: "Cada tom desta make teve um motivo 💄\n\n{2.titulo}: {2.texto}\n{4.titulo}\n\nNa make, nada é por acaso: eu olho o vestido, a luz da festa e o seu jeito. Me chama no WhatsApp para garantir a sua data. {marca}\n\n#maquiagem #bastidores" },
    { id: "ninguem-ve", nivel: 1, nome: "O que ninguém vê num penteado", marca: "Studio Cris Cabelos", paraQuem: "Cabeleireiras", ideia: "Foto inteira na capa. Depois: preparação, estrutura e o resultado horas depois.",
      telas: [
        T("capa-foto", { titulo: "O que *ninguém vê* num penteado", apoio: "Bastidores de um penteado de festa" }, [P.penteado]),
        T("int-passo", { num: "1", titulo: "Preparação", texto: "Lavagem com produto de fixação leve. O segredo começa no lavatório." }, [P.pente]),
        T("int-passo", { num: "2", titulo: "Estrutura", texto: "Grampos escondidos em cruz sustentam o coque a noite inteira." }, [P.penteado], { aj: [close(1.8, 0.5, 0.4)] }),
        T("int-resultado", { titulo: "Na festa", texto: "Seis horas depois, *o penteado continuava no lugar*." }, [P.penteado])
      ],
      legenda: "Penteado bonito é o que dura a festa inteira 💇‍♀️\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\nResultado: {4.texto}\n\nAgenda de dezembro aberta no WhatsApp da {marca}.\n\n#penteado #bastidores" },
    { id: "depoimento", nivel: 1, nome: "Antes do clique", paraQuem: "Fotógrafas e videomakers", ideia: "Capa com depoimento. Depois: uma frase sobre o método, a preparação em lista e a chamada.",
      telas: [
        T("capa-citacao", { citacao: "“Ela conseguiu fotografar *a minha mãe rindo*, coisa rara.”", autor: "Cliente do ensaio de Natal" }, [P.polaroides]),
        T("int-frase", { frase: "Meu trabalho começa *antes do clique*: na conversa.", autor: "{marca}" }, [], { inv: true }),
        T("int-lista", { titulo: "Como eu *preparo* um ensaio", item1: "Conversa para entender a família", item2: "Visita ao local para ver a luz", item3: "Lista das fotos que não podem faltar", item4: "Entrega em galeria online em 15 dias" }),
        T("int-cta", { titulo: "Vamos contar a *sua história*?", texto: "Ainda tenho duas datas em dezembro.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "{1.citacao}\n\nEsse tipo de foto não acontece por sorte. Meu trabalho começa antes do clique:\n• {3.item1}\n• {3.item2}\n• {3.item3}\n• {3.item4}\n\nAinda tenho duas datas em dezembro. Me chama no WhatsApp. {marca}\n\n#fotografia #ensaiodefamilia" },
    { id: "decisao", nivel: 1, nome: "A decisão que mudou o resultado", paraQuem: "Qualquer profissional com trabalho visual", ideia: "Capa tipográfica. Depois: a comparação das duas opções, o porquê e o resultado.",
      telas: [
        T("capa-tipo", { titulo: "A decisão que *mudou* o resultado", apoio: "Uma escolha profissional, explicada" }),
        T("int-comparar", { rot1: "Com flash", rot2: "Luz natural", texto: "Desliguei o flash e esperei o sol baixar. *A pele ficou outra*." }, [P.camera, P.polaroides]),
        T("int-detalhe", { titulo: "Por quê", texto: "Luz lateral desenha o rosto e *não apaga as luzinhas* da árvore." }, [P.luzes], { aj: [close(1.6, 0.5, 0.5)] }),
        T("int-resultado", { titulo: "O resultado", texto: "Foto com clima de Natal, *sem parecer estúdio*." }, [P.polaroides])
      ],
      legenda: "Uma decisão pequena que mudou o resultado inteiro 💡\n\n{2.texto}\n\n{3.titulo}: {3.texto}\n\nÉ isso que você paga quando contrata uma profissional: as escolhas. Me chama no WhatsApp. {marca}\n\n#bastidores #fotografia" },
    { id: "duvida", nivel: 2, nome: "A dúvida que todo mundo faz", paraQuem: "Fotógrafas", ideia: "Três fotos na capa. Depois: a pergunta em destaque, a resposta e o convite para mandar outras dúvidas.",
      telas: [
        T("capa-polaroides", { titulo: "A dúvida que *todo mundo* me faz", apoio: "E a resposta sincera" }, [P.polaroides, P.camera, P.luzes]),
        T("int-frase", { frase: "“Preciso saber *posar*?”", autor: "Pergunta de quase toda cliente" }, [], { inv: true }),
        T("int-passo", { num: "", titulo: "Não precisa", texto: "Eu guio cada movimento. Você só precisa estar à vontade com quem ama." }, [P.polaroides]),
        T("int-cta", { titulo: "Ficou com *outra dúvida*?", texto: "Mande no direct que eu respondo nos Stories.", contato: "Pergunte no direct" }, [P.camera])
      ],
      legenda: "{2.frase}\n\nResposta sincera: {3.titulo.lower}. {3.texto}\n\nTem outra dúvida sobre ensaios? Manda no direct que eu respondo nos Stories. {marca}\n\n#duvidas #fotografia" },
    { id: "cada-detalhe", nivel: 2, nome: "Como escolho cada detalhe", paraQuem: "Fotógrafas", ideia: "Capa com os detalhes em etiquetas. Depois: a roupa, o horário e o checklist da cliente.",
      telas: [
        T("capa-lista", { titulo: "Como escolho *cada detalhe*", itens: "Luz · Roupa · Lugar · Horário", apoio: "Nada é por acaso" }, [P.camera]),
        T("int-detalhe", { titulo: "A roupa", texto: "Peço tons lisos e próximos: *a família combina* sem ficar uniforme." }, [P.polaroides]),
        T("int-detalhe", { titulo: "O horário", texto: "Fim de tarde, quando a luz fica *dourada* e macia." }, [P.luzes]),
        T("int-lista", { titulo: "Checklist da *cliente*", item1: "Roupas em tons parecidos", item2: "Unhas e cabelo do jeito de sempre", item3: "Um objeto com história", item4: "Chegar 15 minutos antes" })
      ],
      legenda: "{1.itens}: nada num ensaio é por acaso 📷\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\nSalva o checklist para o seu ensaio e me chama no WhatsApp para escolher a data. {marca}\n\n#bastidores #ensaio" },
    { id: "por-tras-foto", nivel: 2, nome: "A história por trás desta foto", paraQuem: "Fotógrafas", ideia: "Foto em arco na capa. Depois: o pedido, o desafio e onde a foto foi parar.",
      telas: [
        T("capa-arco", { titulo: "A história por trás *desta foto*", apoio: "Ensaio de Natal de uma família grande" }, [P.polaroides]),
        T("int-passo", { num: "1", titulo: "O pedido", texto: "A avó completava 90 anos no Natal. A família queria todos juntos." }, [P.luzes]),
        T("int-passo", { num: "2", titulo: "O desafio", texto: "Eram 23 pessoas numa sala pequena. Subi na escada e fotografei de cima." }, [P.camera]),
        T("int-resultado", { titulo: "A foto", texto: "Hoje ela está *na parede da sala*, maior que a TV." }, [P.polaroides])
      ],
      legenda: "Toda foto tem uma história por trás 🎄\n\n{2.texto}\n{3.texto}\n\n{4.texto}\n\nQuer registrar a sua família neste Natal? Me chama no WhatsApp. {marca}\n\n#historia #fotografiadefamilia" },
    { id: "ano-bastidores", nivel: 3, nome: "Meu ano em bastidores", paraQuem: "Qualquer profissional com portfólio", ideia: "Ano em destaque com três fotos. Depois: grade de bastidores, uma frase e a agenda nova.",
      telas: [
        T("capa-ano", { titulo: "Meu ano em *bastidores*", ano: "2026", apoio: "O que você não viu" }, [P.camera, P.polaroides, P.luzes]),
        T("int-grade", { titulo: "Bastidores de *2026*", texto: "Ensaios, casamentos, aniversários e muito café." }, [P.camera, P.polaroides, P.luzes, P.flores]),
        T("int-frase", { frase: "Cada foto teve uma *conversa* antes.", autor: "{marca}" }),
        T("int-cta", { titulo: "Agenda de *2027* aberta", texto: "Garanta a sua data para o primeiro semestre.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "Meu {1.ano} em bastidores 🎞️\n\n{2.texto} Cada foto teve uma conversa antes.\n\nA agenda de 2027 está aberta. Garanta a sua data pelo WhatsApp. {marca}\n\n#retrospectiva #bastidores" },
    { id: "agenda-2027", nivel: 3, nome: "Agenda de 2027 aberta", paraQuem: "Qualquer prestadora com agenda", ideia: "Calendário em 2 de janeiro. Depois: as datas, como reservar e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "Agenda de *2027* aberta", dia: "02", mes: "JAN", apoio: "Primeiras datas do ano" }),
        T("int-prazo", { titulo: "Datas de *janeiro*", rot1: "Ensaios externos a partir de", data1: "05/01", rot2: "Reserva com sinal até", data2: "20/12", nota: "Quem reserva em dezembro garante o valor deste ano." }),
        T("int-lista", { titulo: "Como *reservar*", item1: "Escolha o tipo de ensaio", item2: "Combine data e local comigo", item3: "Pague o sinal para garantir", item4: "Receba o guia de preparação" }),
        T("int-cta", { titulo: "Escolha a *sua data*", texto: "As primeiras datas de janeiro saem rápido.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "A agenda de 2027 já está aberta 🗓️\n\n{2.rot1} {2.data1}. {2.nota}\n\nPara reservar: {3.item1.lower}, {3.item2.lower} e {3.item3.lower}. Me chama no WhatsApp. {marca}\n\n#agenda2027 #ensaio" },
    { id: "obrigada", nivel: 3, nome: "Obrigada por confiar", paraQuem: "Qualquer profissional", ideia: "Capa com selo do ano. Depois: uma frase, a grade de trabalhos e o até logo.",
      telas: [
        T("capa-selo", { titulo: "Obrigada por *confiar* em mim", selo: "2026", apoio: "Um ano de bastidores" }, [P.polaroides]),
        T("int-frase", { frase: "Foram *muitas histórias* contadas em foto.", autor: "{marca}" }, [], { inv: true }),
        T("int-grade", { titulo: "Algumas *delas*", texto: "Cada uma com um bastidor que só a gente sabe." }, [P.polaroides, P.luzes, P.flores, P.bolo]),
        T("int-cta", { titulo: "Até *2027*", texto: "Volto das férias no dia 5 com agenda aberta.", contato: "Siga {marca}" }, [P.camera])
      ],
      legenda: "Obrigada por confiar em mim em {1.selo} 🤍\n\nForam muitas histórias contadas em foto, cada uma com um bastidor que só a gente sabe.\n\nVolto das férias no dia 5 com agenda aberta. Já quer garantir a sua data? Me chama no WhatsApp. {marca}\n\n#gratidao #fotografia" }
  ]
};
