/* Presentes por orçamento (lojistas). Exemplo preenchido com "Nome da loja aqui", que a cliente troca pela marca dela. */
import { T, FOTOS as P, close } from "./_base.js";
const EMBRULHO = "assets/elementos/embrulho-capa.jpg";

export default {
  id: "presentes-por-orcamento", marca: "Nome da loja aqui", previa: "cara-dela",
  carrosseis: [
    { id: "ate-100", nivel: 1, nome: "5 presentes até R$ 100", ideia: "A foto da embalagem ocupa a capa inteira, com o valor em destaque na área clara de cima. Depois, cinco produtos em 2 + 2 + 1.",
      telas: [
        T("capa-embrulho", { titulo: "5 presentes *até*", valor: "R$ 100", rodape: "Seleção de Natal" }, [EMBRULHO]),
        T("int-dois", { titulo: "Presentes 1 e 2", nome1: "Clutch Noite", preco1: "R$ 89", nome2: "Lenço de seda", preco2: "R$ 59" }, [P.clutch, P.lenco]),
        T("int-dois", { titulo: "Presentes 3 e 4", nome1: "Brincos dourados", preco1: "R$ 79", nome2: "Colar Lua", preco2: "R$ 99" }, [P.brincos, P.colar]),
        T("int-um", { nome: "Perfume Flor de Laranjeira", preco: "R$ 95", apoio: "Para quem merece um mimo perfumado", cta: "Chama no WhatsApp que a gente embrulha" }, [P.perfume])
      ],
      legenda: "Natal com orçamento definido? A gente resolve 🎁\n\nSeparamos 5 presentes até {1.valor} aqui na {marca}:\n• {2.nome1}: {2.preco1}\n• {2.nome2}: {2.preco2}\n• {3.nome1}: {3.preco1}\n• {3.nome2}: {3.preco2}\n• {4.nome}: {4.preco}\n\nTodos saem embrulhados para presente. Qual tem a cara de quem você vai presentear? Me chama no WhatsApp ou no direct que eu separo o seu.\n\n#presentedenatal #natal #presentes" },
    { id: "cara-dela", nivel: 1, nome: "É a cara dela.", ideia: "Capa só tipográfica, vinho com marfim e o “dela.” em destaque. Cada tela liga um produto ao jeito de quem vai ganhar.",
      telas: [
        T("capa-tipo", { titulo: "É a cara *dela.*", apoio: "Presentes escolhidos pelo jeito de quem vai ganhar" }, [], { inv: true }),
        T("int-estilo", { estilo: "Pra quem não perde *uma festa*", nome: "Clutch Noite", preco: "R$ 89" }, [P.clutch]),
        T("int-estilo", { estilo: "Pra quem ama um *clássico*", nome: "Lenço de seda", preco: "R$ 59" }, [P.lenco]),
        T("int-estilo", { estilo: "Pra quem vive de *brilho*", nome: "Brincos dourados", preco: "R$ 79" }, [P.brincos])
      ],
      legenda: "Presente bom é aquele que parece ter sido escolhido só para ela ✨\n\nA que não perde uma festa: {2.nome} ({2.preco}).\nA que ama um clássico: {3.nome} ({3.preco}).\nA que vive de brilho: {4.nome} ({4.preco}).\n\nMarca aqui quem é cada uma 👇 e chama a {marca} no direct para reservar o presente.\n\n#presentedenatal #éacaradela" },
    { id: "escolha", nivel: 1, nome: "A escolha da loja", ideia: "Capa tipográfica: a frase “Se eu fosse presentear…” assinada pela loja. Depois: o detalhe da peça escolhida, jeitos de usar e as informações de compra.",
      telas: [
        T("capa-assinatura", { tema: "A escolha da loja", titulo: "Se eu fosse *presentear…*", assina: "Seleção de" }),
        T("int-detalhe", { titulo: "O detalhe", texto: "Caixa com banho dourado e pulseira de couro que *não marca o pulso*." }, [P.relogio], { aj: [close(2.2, 0.5, 0.48)] }),
        T("int-uso", { titulo: "Como usar", passo1: "No dia a dia, com camisa e jeans", passo2: "Na ceia, junto de uma pulseira fina", passo3: "Em viagem: resiste a respingos" }, [P.relogio], { aj: [close(1.3, 0.5, 0.5)] }),
        T("int-info", { titulo: "Relógio Clássico", linha1: "R$ 189 ou 3x de R$ 63", linha2: "Vem na caixa de presente da loja", linha3: "Retirada na loja ou entrega na cidade", cta: "Reserve pelo WhatsApp" })
      ],
      legenda: "Se fosse para escolher um presente só, seria este ⌚\n\nO {4.titulo} tem caixa com banho dourado e pulseira de couro macia. Vai do dia a dia à ceia e já sai na caixa de presente da {marca}.\n\n{4.linha1}. Quer reservar? Me chama no WhatsApp.\n\n#presentedenatal #escolhadaloja" },
    { id: "duplas", nivel: 1, nome: "Duplas que funcionam", ideia: "Duas fotos grandes lado a lado e um “+” no meio, cada uma trocada separadamente. As telas explicam por que as peças funcionam juntas.",
      telas: [
        T("capa-par", { titulo: "Duplas que *funcionam*", apoio: "Clutch + brincos dourados: o look da ceia resolvido" }, [P.clutch, P.brincos]),
        T("int-dupla", { nome: "Clutch + brincos dourados", porque: "O dourado do fecho conversa com o brilho dos brincos. Look de ceia resolvido.", preco: "R$ 159 a dupla" }, [P.clutch, P.brincos]),
        T("int-dupla", { nome: "Lenço + óculos de sol", porque: "Para a amiga que vai viajar nas férias: protege do sol e do vento na estrada.", preco: "R$ 199 a dupla" }, [P.lenco, P.oculos]),
        T("int-dupla", { nome: "Perfume + colar Lua", porque: "Um para o dia a dia e outro para guardar: presente de quem conhece bem.", preco: "R$ 179 a dupla" }, [P.perfume, P.colar])
      ],
      legenda: "Um presente é bom. Dois que combinam é presente de quem pensou em tudo 💝\n\n• {2.nome}: {2.preco}\n• {3.nome}: {3.preco}\n• {4.nome}: {4.preco}\n\nA gente embrulha as duas peças juntas. Escolhe a sua dupla e me chama no direct ou no WhatsApp da {marca}.\n\n#presentedenatal #duplas" },
    { id: "ainda-da-tempo", nivel: 1, nome: "Ainda dá tempo?", ideia: "Capa de calendário com a data editável. Depois: o que ainda tem, os prazos reais de entrega e retirada e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "Ainda dá *tempo?*", dia: "23", mes: "DEZ", apoio: "Últimas compras de Natal" }),
        T("int-opcoes", { titulo: "Ainda temos *pronta entrega*", op1: "Clutch Noite", preco1: "R$ 89", op2: "Colar Lua", preco2: "R$ 99", op3: "Perfume Flor de Laranjeira", preco3: "R$ 95" }, [P.clutch, P.colar, P.perfume]),
        T("int-prazo", { titulo: "Prazos *reais*", rot1: "Entrega na cidade: pedidos até", data1: "22/12", rot2: "Retirada na loja até 14h de", data2: "24/12", nota: "Depois disso, só no balcão, enquanto durar o estoque." }),
        T("int-cta", { titulo: "A gente *separa* pra você", texto: "Manda o nome do presente e o horário que você passa aqui. Fica embrulhado esperando.", contato: "Chama no WhatsApp" }, [P.sacola])
      ],
      legenda: "Ainda dá tempo, sim ⏰\n\nEntrega na cidade para pedidos até {3.data1}. Retirada na loja até {3.data2}.\n\nTemos pronta entrega de {2.op1}, {2.op2} e {2.op3}. Me manda o presente e o horário que a {marca} deixa tudo embrulhado esperando você. Chama no WhatsApp!\n\n#ultimascompras #natal" },
    { id: "amigo-secreto", nivel: 2, nome: "Achados para o amigo secreto", ideia: "A ideia do sorteio: um bilhete marfim sobre o vinho com “Tirei teu nome. E agora?”. Cada tela traz três achados de uma faixa de preço.",
      telas: [
        T("capa-bilhete", { tema: "Amigo secreto", titulo: "Tirei teu nome. *E agora?*", apoio: "Achados até R$ 30, R$ 50 e R$ 70" }, [], { inv: true }),
        T("int-opcoes", { titulo: "Até *R$ 30*", op1: "Necessaire de cetim", preco1: "R$ 29", op2: "Prendedor de pérola", preco2: "R$ 24", op3: "Vela aromática mini", preco3: "R$ 27" }, [P.sacola, P.brincos, P.vela]),
        T("int-opcoes", { titulo: "Até *R$ 50*", op1: "Lenço estampado", preco1: "R$ 49", op2: "Brinco argola", preco2: "R$ 45", op3: "Porta-joias", preco3: "R$ 48" }, [P.lenco, P.brincos, P.colar]),
        T("int-opcoes", { titulo: "Até *R$ 70*", op1: "Lenço de seda", preco1: "R$ 59", op2: "Perfume de bolsa", preco2: "R$ 65", op3: "Colar delicado", preco3: "R$ 69" }, [P.lenco, P.perfume, P.colar])
      ],
      legenda: "Tirou alguém que você mal conhece no amigo secreto? Calma 😅\n\nSeparamos achados que agradam qualquer pessoa, em três faixas: {2.titulo.lower}, {3.titulo.lower} e {4.titulo.lower}.\n\nTodos saem embrulhados da {marca}. Me fala o valor combinado no seu amigo secreto e eu te mando as opções no WhatsApp.\n\n#amigosecreto #presentedenatal" },
    { id: "tres-jeitos", nivel: 2, nome: "Uma peça, três jeitos de usar", ideia: "Foto com etiqueta de preço na capa. Cada tela é um jeito de usar, numerado.",
      telas: [
        T("capa-etiqueta", { titulo: "Uma peça, *três jeitos*", preco: "R$ 59", apoio: "O lenço de seda que vira presente coringa" }, [P.lenco]),
        T("int-passo", { num: "1", titulo: "No pescoço", texto: "Dobrado em faixa e com nó lateral: deixa a camisa branca pronta para a ceia." }, [P.lenco], { aj: [close(1.4, 0.4, 0.5)] }),
        T("int-passo", { num: "2", titulo: "No cabelo", texto: "Como faixa ou amarrado no rabo de cavalo para o almoço de família." }, [P.lenco], { aj: [close(1.8, 0.6, 0.45)] }),
        T("int-passo", { num: "3", titulo: "Na bolsa", texto: "Amarrado na alça, muda a cara da bolsa de sempre. Presente que rende." }, [P.clutch])
      ],
      legenda: "Presente bom é o que sai da caixa e vai direto para o look 🧣\n\nO lenço de seda da {marca} ({1.preco}) vira três: no pescoço, no cabelo ou na alça da bolsa. Quem ganha usa na ceia, no almoço do dia 25 e nas férias.\n\nQuer ver as estampas? Me chama no direct.\n\n#presentecoringa #natal" },
    { id: "equipe", nivel: 2, nome: "Escolhas da equipe", ideia: "Capa com selo redondo. Cada tela mostra a escolha de uma pessoa da equipe, com a frase dela.",
      telas: [
        T("capa-selo", { titulo: "O que a *equipe* daria de presente", selo: "Escolha da equipe", apoio: "Três pessoas, três escolhas" }, [P.colar]),
        T("int-um", { nome: "Colar Lua", preco: "R$ 99", apoio: "Escolha da Ju: “combina com tudo e não pesa”" }, [P.colar]),
        T("int-um", { nome: "Óculos Riviera", preco: "R$ 149", apoio: "Escolha da Carol: “o presente das férias”" }, [P.oculos]),
        T("int-um", { nome: "Perfume Flor de Laranjeira", preco: "R$ 95", apoio: "Escolha da Bia: “cheiro de casa de vó, no bom sentido”", cta: "Qual seria a sua escolha? Conta no direct" }, [P.perfume])
      ],
      legenda: "Perguntamos para a equipe da {marca}: se vocês fossem dar um presente daqui, qual seria? 💬\n\n{2.nome} ({2.preco}), {3.nome} ({3.preco}) e {4.nome} ({4.preco}).\n\nE você, escolheria qual? Conta nos comentários ou chama no WhatsApp para reservar.\n\n#escolhasdaequipe #natal" },
    { id: "cores-virada", nivel: 3, nome: "Cores da virada", ideia: "Foto em arco na capa. Cada tela liga uma cor da virada a uma peça da loja.",
      telas: [
        T("capa-arco", { titulo: "Qual cor vai te *acompanhar*?", apoio: "Branco, dourado ou rosa para a virada" }, [P.vestidoBranco]),
        T("int-estilo", { estilo: "*Branco* para paz", nome: "Vestido Brisa", preco: "R$ 189" }, [P.vestidoBranco]),
        T("int-estilo", { estilo: "*Dourado* para prosperidade", nome: "Colar Lua", preco: "R$ 99" }, [P.colar]),
        T("int-estilo", { estilo: "*Rosa* para o amor", nome: "Perfume Flor de Laranjeira", preco: "R$ 95" }, [P.perfume])
      ],
      legenda: "Você é do time que escolhe a cor da virada? 🎆\n\nBranco para paz: {2.nome} ({2.preco}).\nDourado para prosperidade: {3.nome} ({3.preco}).\nRosa para o amor: {4.nome} ({4.preco}).\n\nConta aqui qual vai ser a sua e chama a {marca} no direct para separar.\n\n#reveillon #coresdavirada" },
    { id: "looks-virada", nivel: 3, nome: "Looks para a virada", ideia: "Três fotos espalhadas na capa, uma por look. Cada tela mostra o look pronto e onde ele funciona.",
      telas: [
        T("capa-polaroides", { titulo: "Três looks para a *virada*", apoio: "Praia, casa ou festa" }, [P.vestidoBranco, P.camisa, P.vestido]),
        T("int-resultado", { titulo: "Na praia", texto: "Vestido Brisa (R$ 189) com rasteirinha dourada: *leve para a areia*." }, [P.vestidoBranco]),
        T("int-resultado", { titulo: "Em casa", texto: "Camisa de linho (R$ 139) com o lenço de seda *no cabelo*." }, [P.camisa]),
        T("int-resultado", { titulo: "Na festa", texto: "Vestido Noite (R$ 229) com a *Clutch Noite* (R$ 89)." }, [P.vestido])
      ],
      legenda: "Onde vai ser a sua virada? 🥂\n\nNa praia: {2.texto}\nEm casa: {3.texto}\nNa festa: {4.texto}\n\nA {marca} separa o look inteiro para você provar. Me chama no WhatsApp com o seu tamanho.\n\n#reveillon #lookdavirada" },
    { id: "ultimos-dias", nivel: 3, nome: "Últimos dias do ano", ideia: "Ano em destaque com três fotos. Depois: horários de fim de ano, o que ainda tem para o brinde e um agradecimento.",
      telas: [
        T("capa-ano", { titulo: "Últimos dias do *ano*", ano: "2026", apoio: "O que ainda dá tempo de garantir" }, [P.sacola, P.brincos, P.tacas]),
        T("int-prazo", { titulo: "Horários de *fim de ano*", rot1: "Aberto até as 18h em", data1: "30/12", rot2: "Aberto até as 13h em", data2: "31/12", nota: "Em 1º de janeiro a loja descansa. Voltamos dia 2!" }),
        T("int-opcoes", { titulo: "Para brindar *bonito*", op1: "Taças de cristal (par)", preco1: "R$ 119", op2: "Brincos dourados", preco2: "R$ 79", op3: "Clutch Noite", preco3: "R$ 89" }, [P.tacas, P.brincos, P.clutch]),
        T("int-frase", { frase: "Obrigada por fazer o nosso *ano* mais bonito.", autor: "Equipe {marca}" }, [], { inv: true })
      ],
      legenda: "Os últimos dias de {1.ano} chegaram ✨\n\nA {marca} fica aberta até as 18h em {2.data1} e até as 13h em {2.data2}. Ainda dá tempo de garantir as taças do brinde, o brinco da virada ou a clutch da festa.\n\nObrigada por cada visita este ano. Chama no WhatsApp que a gente separa.\n\n#reveillon #ultimosdias" }
  ]
};
