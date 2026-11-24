/* Favoritos da loja (lojistas de casa e presentes). Exemplo preenchido com a loja fictícia Empório Alecrim. */
import { T, CAIXA, FOTOS as P, close } from "./_base.js";

export default {
  id: "favoritos-da-loja", marca: "Empório Alecrim", previa: "mais-vendidos",
  carrosseis: [
    { id: "favorito-casa", nivel: 1, nome: "O favorito da casa", ideia: "Capa com selo redondo sobre a foto. Depois: o detalhe que faz ser favorito, onde usar e como comprar.",
      telas: [
        T("capa-selo", { titulo: "O favorito da *casa*", selo: "Favorito", apoio: "Vela Alecrim e Laranja" }, [P.vela]),
        T("int-detalhe", { titulo: "O cheiro", texto: "Alecrim, casca de laranja e um fundo de baunilha: *cheiro de casa arrumada*." }, [P.vela], { aj: [close(2, 0.5, 0.4)] }),
        T("int-uso", { titulo: "Onde acender", passo1: "Na mesa da ceia, longe das flores", passo2: "No lavabo, antes das visitas chegarem", passo3: "No quarto, para desacelerar depois da festa" }, [P.vela]),
        T("int-info", { titulo: "Vela Alecrim", linha1: "R$ 69 · 40 horas de queima", linha2: "Pote de vidro reaproveitável", linha3: "Vem com cartão para presente", cta: "Peça a sua no WhatsApp" })
      ],
      legenda: "Se a {marca} tivesse um cheiro, seria este 🕯️\n\nA {4.titulo} mistura alecrim, laranja e baunilha. Fica linda na mesa da ceia, no lavabo e no quarto.\n\n{4.linha1}. {4.linha3}. Peça a sua pelo WhatsApp.\n\n#favoritodacasa #vela #presentedenatal" },
    { id: "mais-vendidos", nivel: 1, nome: "Os 3 mais vendidos", ideia: "Capa com os itens em etiquetas e foto redonda. Uma tela por produto, na ordem do ranking.",
      telas: [
        T("capa-lista", { titulo: "Os 3 mais *vendidos* de dezembro", itens: "Vela · Taças · Caderno", apoio: "Escolhidos pelas nossas clientes" }, [P.tacas]),
        T("int-estilo", { estilo: "*1º* A vela que esgotou duas vezes", nome: "Vela Alecrim", preco: "R$ 69" }, [P.vela]),
        T("int-estilo", { estilo: "*2º* Para brindar a ceia e a virada", nome: "Par de taças", preco: "R$ 119" }, [P.tacas]),
        T("int-estilo", { estilo: "*3º* Para quem já pensa em *2027*", nome: "Caderno Planejar", preco: "R$ 54" }, [P.caderno])
      ],
      legenda: "Os 3 mais vendidos de dezembro na {marca}, escolhidos por vocês 🏅\n\n1º {2.nome} ({2.preco})\n2º {3.nome} ({3.preco})\n3º {4.nome} ({4.preco})\n\nQual entra na sua lista de presentes? Me chama no WhatsApp que a gente embrulha.\n\n#maisvendidos #presentes" },
    { id: "mimos-80", nivel: 1, nome: "Mimos até R$ 80", ideia: "Valor em destaque com a embalagem como elemento. Quatro mimos em duas telas e o embrulho no fim.",
      telas: [
        T("capa-numero", { titulo: "Mimos até", valor: "R$ 80", rodape: "Favoritos da loja" }, [CAIXA]),
        T("int-dois", { titulo: "Para a casa", nome1: "Vela Alecrim", preco1: "R$ 69", nome2: "Buquê seco", preco2: "R$ 75" }, [P.vela, P.flores]),
        T("int-dois", { titulo: "Para quem organiza tudo", nome1: "Caderno Planejar", preco1: "R$ 54", nome2: "Sacola de algodão", preco2: "R$ 39" }, [P.caderno, P.sacola]),
        T("int-um", { nome: "Cartão + embrulho", preco: "R$ 12", apoio: "Qualquer mimo sai pronto para entregar", cta: "Monte o seu no WhatsApp" }, [P.presentes])
      ],
      legenda: "Mimos até {1.valor} para não passar o Natal sem lembrar de ninguém 🎀\n\n• {2.nome1}: {2.preco1}\n• {2.nome2}: {2.preco2}\n• {3.nome1}: {3.preco1}\n• {3.nome2}: {3.preco2}\n\nCom cartão e embrulho da {marca}, sai pronto para entregar. Monte o seu no WhatsApp.\n\n#mimos #presentedenatal" },
    { id: "preco-amigo", nivel: 1, nome: "Favorito com preço de amigo", ideia: "Foto com etiqueta de preço. Depois: o detalhe do cristal, a mesma peça em duas festas e as informações.",
      telas: [
        T("capa-etiqueta", { titulo: "Favorito com preço *de amigo*", preco: "R$ 119", apoio: "Par de taças de cristal" }, [P.tacas]),
        T("int-detalhe", { titulo: "O cristal", texto: "Borda fina e som de *tim-tim* de verdade. Pode ir à lava-louças." }, [P.tacas], { aj: [close(2.1, 0.4, 0.35)] }),
        T("int-comparar", { rot1: "Na ceia", rot2: "Na virada", texto: "Um presente que aparece em *duas festas* seguidas." }, [P.tacas, P.estrelinha]),
        T("int-info", { titulo: "Par de taças", linha1: "R$ 119 ou 2x sem juros", linha2: "Caixa rígida de presente inclusa", linha3: "Entrega cuidadosa na cidade", cta: "Reserve pelo direct" })
      ],
      legenda: "Presente que aparece em duas festas seguidas: na ceia e na virada 🥂\n\nO par de taças de cristal da {marca} tem borda fina, som de tim-tim de verdade e vai à lava-louças.\n\n{4.linha1}, com {4.linha2}. Reserve pelo direct.\n\n#tacas #presentedenatal" },
    { id: "por-que-amamos", nivel: 1, nome: "Por que a gente ama", ideia: "Capa com foto inteira e o fundo original. Três motivos numerados, cada um com a sua foto.",
      telas: [
        T("capa-foto", { titulo: "Por que a gente *ama* este buquê", apoio: "Flores secas que duram o ano inteiro" }, [P.flores]),
        T("int-passo", { num: "1", titulo: "Dura meses", texto: "Montado com flores secas: nada de murchar antes do Ano-Novo." }, [P.flores]),
        T("int-passo", { num: "2", titulo: "Feito aqui", texto: "Cada buquê é montado na loja, com fita e cartão escritos à mão." }, [P.flores], { aj: [close(1.7, 0.4, 0.4)] }),
        T("int-passo", { num: "3", titulo: "Cabe em qualquer canto", texto: "Mesa, estante ou criado-mudo: decora sem precisar de vaso." }, [P.flores], { aj: [close(1.4, 0.6, 0.6)] })
      ],
      legenda: "Três motivos para a gente amar este buquê 💐\n\n1. {2.titulo}: {2.texto}\n2. {3.titulo}: {3.texto}\n3. {4.titulo}: {4.texto}\n\nEncomende o seu na {marca} pelo WhatsApp.\n\n#flores #presentedenatal" },
    { id: "dizem", nivel: 2, nome: "O que as clientes dizem", ideia: "Capa com depoimento em aspas grandes. Depois: o favorito em foto, uma frase da loja e o convite.",
      telas: [
        T("capa-citacao", { citacao: "“Comprei a vela para dar de presente e *voltei para levar uma para mim*.”", autor: "Marina, cliente" }, [P.vela]),
        T("int-resultado", { titulo: "A favorita", texto: "A Vela Alecrim é a que *mais volta* para a casa das clientes." }, [P.vela]),
        T("int-frase", { frase: "Presente bom é o que vira *hábito*.", autor: "{marca}" }),
        T("int-cta", { titulo: "Quer *experimentar*?", texto: "Passe na loja para sentir o cheiro ou peça pelo WhatsApp.", contato: "Chama no WhatsApp" }, [P.vela])
      ],
      legenda: "A gente ama quando a cliente volta 💛\n\n{1.citacao}\n({1.autor})\n\nPassa na {marca} para sentir o cheiro da Vela Alecrim ou peça pelo WhatsApp.\n\n#depoimento #favorito" },
    { id: "ja-tem-tudo", nivel: 2, nome: "Para quem já tem tudo", ideia: "Capa tipográfica em pinho. Cada tela liga um favorito ao jeito de quem vai ganhar.",
      telas: [
        T("capa-tipo", { titulo: "Para quem *já tem tudo*", apoio: "Favoritos que sempre surpreendem" }, [], { inv: true }),
        T("int-estilo", { estilo: "A que adora *receber*", nome: "Par de taças", preco: "R$ 119" }, [P.tacas]),
        T("int-estilo", { estilo: "A que vive de *listas*", nome: "Caderno Planejar", preco: "R$ 54" }, [P.caderno]),
        T("int-estilo", { estilo: "A que precisa de *pausa*", nome: "Vela Alecrim", preco: "R$ 69" }, [P.vela])
      ],
      legenda: "Tem sempre aquela pessoa que já tem tudo, né? 🤔\n\nA que adora receber: {2.nome} ({2.preco}).\nA que vive de listas: {3.nome} ({3.preco}).\nA que precisa de pausa: {4.nome} ({4.preco}).\n\nMarca ela aqui e chama a {marca} no direct.\n\n#presentedenatal #quemjatemtudo" },
    { id: "combinam", nivel: 2, nome: "Favoritos que combinam", ideia: "Duas fotos e um “+”. Cada tela forma uma dupla de presentes e explica a escolha.",
      telas: [
        T("capa-dupla", { titulo: "Favoritos que *combinam*", apoio: "Duplas montadas pela equipe" }, [P.vela, P.flores]),
        T("int-dupla", { nome: "Vela + buquê seco", porque: "Perfume e cor na mesma mesa: presente que decora a casa.", preco: "R$ 139 a dupla" }, [P.vela, P.flores]),
        T("int-dupla", { nome: "Caderno + sacola", porque: "Para a amiga organizada que leva tudo na bolsa.", preco: "R$ 89 a dupla" }, [P.caderno, P.sacola]),
        T("int-dupla", { nome: "Taças + luzinhas", porque: "Ceia na varanda com cara de restaurante.", preco: "R$ 168 a dupla" }, [P.tacas, P.luzes])
      ],
      legenda: "A equipe da {marca} montou duplas que combinam 🎁\n\n• {2.nome}: {2.preco}\n• {3.nome}: {3.preco}\n• {4.nome}: {4.preco}\n\nSai tudo junto, no mesmo embrulho. Peça a sua pelo WhatsApp.\n\n#duplas #presentedenatal" },
    { id: "mesa-virada", nivel: 3, nome: "A mesa da virada", ideia: "Foto em arco na capa. Depois: o que pôr na mesa, como montar e a chamada.",
      telas: [
        T("capa-arco", { titulo: "A mesa da *virada*", apoio: "Favoritos para receber em casa" }, [P.tacas]),
        T("int-opcoes", { titulo: "Para pôr na *mesa*", op1: "Par de taças", preco1: "R$ 119", op2: "Fio de luzinhas", preco2: "R$ 49", op3: "Vela Alecrim", preco3: "R$ 69" }, [P.tacas, P.luzes, P.vela]),
        T("int-uso", { titulo: "Monte assim", passo1: "Luzinhas no centro, dentro de um vidro", passo2: "Velas baixas para não atrapalhar a conversa", passo3: "Taças servidas antes da meia-noite" }, [P.luzes]),
        T("int-cta", { titulo: "Monte sua *mesa*", texto: "Mande uma foto da sua mesa que a gente sugere o que combina.", contato: "Chama no WhatsApp" }, [P.tacas])
      ],
      legenda: "Vai receber a virada em casa? A mesa pode ser a mais bonita do ano 🥂\n\n{2.op1} ({2.preco1}), {2.op2} ({2.preco2}) e {2.op3} ({2.preco3}).\n\nMande uma foto da sua mesa no WhatsApp da {marca} que a gente sugere o que combina.\n\n#reveillon #mesaposta" },
    { id: "favoritos-ano", nivel: 3, nome: "Os favoritos do ano", ideia: "Ano em destaque com três fotos. Depois: grade com os campeões, uma frase e a pergunta para as clientes.",
      telas: [
        T("capa-ano", { titulo: "Os favoritos do *ano*", ano: "2026", apoio: "O que mais saiu daqui este ano" }, [P.vela, P.tacas, P.flores]),
        T("int-grade", { titulo: "Os campeões de *2026*", texto: "Vela Alecrim, par de taças, buquê seco e caderno Planejar." }, [P.vela, P.tacas, P.flores, P.caderno]),
        T("int-frase", { frase: "Cada favorito tem uma *cliente* por trás.", autor: "Equipe {marca}" }, [], { inv: true }),
        T("int-cta", { titulo: "Qual foi o *seu*?", texto: "Conta nos comentários qual favorito foi para a sua casa.", contato: "Responda nos comentários" }, [P.luzes])
      ],
      legenda: "Os favoritos de {1.ano} na {marca} ✨\n\n{2.texto}\n\nCada um deles tem uma cliente por trás. Conta nos comentários: qual foi para a sua casa este ano?\n\n#retrospectiva #favoritos" },
    { id: "ultimo-dia", nivel: 3, nome: "Último dia de favoritos", ideia: "Calendário no dia 30. Depois: horários da virada, o que ainda tem e um desejo para o ano novo.",
      telas: [
        T("capa-calendario", { titulo: "Último dia para os *favoritos*", dia: "30", mes: "DEZ", apoio: "Loja aberta até as 18h" }),
        T("int-prazo", { titulo: "Horários da *virada*", rot1: "Loja aberta até as 18h em", data1: "30/12", rot2: "Meio período em", data2: "31/12", nota: "Retirada de encomendas até 12h do dia 31." }),
        T("int-opcoes", { titulo: "Ainda *temos*", op1: "Vela Alecrim", preco1: "R$ 69", op2: "Par de taças", preco2: "R$ 119", op3: "Fio de luzinhas", preco3: "R$ 49" }, [P.vela, P.tacas, P.luzes]),
        T("int-frase", { frase: "Que 2027 deixe a sua casa *cheia de luz*.", autor: "Equipe {marca}" })
      ],
      legenda: "Último dia para levar os favoritos da {marca} para a virada 🕯️\n\nAbertos até as 18h em {2.data1} e meio período em {2.data2}. Ainda temos {3.op1}, {3.op2} e {3.op3}.\n\nQue 2027 deixe a sua casa cheia de luz. Chama no WhatsApp para separar.\n\n#reveillon #ultimodia" }
  ]
};
