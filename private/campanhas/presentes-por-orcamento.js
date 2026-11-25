/* =====================================================================
   KIT PAGO: Presentes por orçamento (lojistas)
   Só sai pela função api/campanha.js, filtrado pelo plano comprado.

   Tudo se liga aos 11 carrosséis do catálogo (public/catalogo/presentes-por-orcamento.js)
   pelo campo `carrossel`. nivel 1 = Natal Pronto, 2 = entra no Natal Completo,
   3 = Réveillon (Natal + Virada). Os planos são cumulativos.

   Reels: o que é para GRAVAR (abertura.filmar, cenas[].filmar, final.filmar, semAparecer, preparar)
          fica separado do que é para COPIAR (abertura.fala, cenas[].texto, final.texto, legenda).
   Stories: 3 telas editáveis (1080 × 1920) na identidade da coleção. Cada tela tem `nota`:
          onde entra a foto e, quando houver, o adesivo que a cliente põe no Instagram.
   Calendário: { f: formato, ref: id da peça, preparar }. O título da peça vem da própria peça,
          então o calendário nunca cita um nome diferente do material.
   Marcadores entre colchetes, como [valor], são os poucos campos para a cliente trocar.
   ===================================================================== */
import { T, FOTOS as P, close } from "../../public/catalogo/_base.js";
const EMBRULHO = "assets/elementos/embrulho-capa.jpg";

/* ---------------- Reels ---------------- */
const reels = [
  { id: "r-ate-100", carrossel: "ate-100", nivel: 1, nome: "Tenho R$ 100. O que eu dou?", duracao: "15 segundos",
    ideia: "A caixa abre e os presentes vão saindo, um por um. Cada um ganha um “cabe” na tela.",
    preparar: "Os 5 presentes do carrossel, uma caixa ou sacola da loja e uma bancada perto da janela.",
    abertura: { filmar: "Caixa de presente fechada no meio da bancada, câmera parada de cima.", fala: "Tenho R$ [valor]. O que eu dou?" },
    cenas: [
      { filmar: "Sua mão abre a caixa e tira o primeiro presente. Segure 2 segundos perto da câmera.", texto: "Esse cabe ✔" },
      { filmar: "Corte rápido: o segundo e o terceiro presentes, um em cada mão.", texto: "Esses também ✔" },
      { filmar: "Os dois últimos lado a lado. Aproxime o celular devagar.", texto: "E ainda sobra troco 😉" }
    ],
    final: { filmar: "Os 5 presentes em fila. Você fecha a caixa e puxa o laço.", texto: "5 presentes até R$ [valor] · embrulho na hora" },
    semAparecer: "Grave tudo de cima: só as mãos entram no quadro. Se preferir nem as mãos, filme cada presente parado sobre a bancada, 2 segundos cada.",
    legenda: "Tenho R$ [valor]. O que eu dou? 🎁\n\nSeparamos 5 presentes que cabem nesse valor, e todos saem daqui embrulhados. Viu algum com a cara de quem você vai presentear?\n\nMe manda o número do presente no direct ou no WhatsApp que eu separo pra você.\n\n#presentedenatal #natal #presentes" },

  { id: "r-cara-dela", carrossel: "cara-dela", nivel: 1, nome: "Me diz como ela é", duracao: "15 a 20 segundos",
    ideia: "Três jeitos de ser, três presentes. Quem assiste se lembra de alguém em cada um.",
    preparar: "Os 3 presentes do carrossel (clutch, lenço e brincos, ou os seus) e um fundo liso.",
    abertura: { filmar: "Você olhando para a câmera, com os 3 presentes escondidos atrás das costas.", fala: "Me diz como ela é que eu te digo o presente." },
    cenas: [
      { filmar: "Mostre o primeiro presente de perto e gire devagar.", texto: "Não perde uma festa? [presente 1]" },
      { filmar: "Troque pelo segundo, mostrando o toque do material.", texto: "Ama um clássico? [presente 2]" },
      { filmar: "Terceiro presente perto da luz, para brilhar.", texto: "Vive de brilho? [presente 3]" }
    ],
    final: { filmar: "Os 3 presentes juntos na bancada. Você aponta para a câmera.", texto: "Marca aqui quem é cada uma 👇" },
    semAparecer: "Troque a abertura por uma tela só com o texto “Me diz como ela é”. Nas cenas, filme os presentes em cima da bancada, com a sua mão girando cada um.",
    legenda: "Presente bom é aquele que parece ter sido escolhido só pra ela ✨\n\nA que não perde uma festa, a que ama um clássico, a que vive de brilho. Qual delas você vai presentear?\n\nMarca aqui quem é cada uma 👇 e me chama no direct pra reservar.\n\n#presentedenatal #éacaradela" },

  { id: "r-escolha", carrossel: "escolha", nivel: 1, nome: "Se eu fosse presentear…", duracao: "15 segundos",
    ideia: "A dona da loja escolhe um único presente e conta por quê. Opinião de quem entende vende.",
    preparar: "A peça escolhida (no exemplo, o relógio), a caixa de presente da loja e uma prateleira bonita.",
    abertura: { filmar: "Plano da prateleira da loja. Sua mão entra e pega a peça.", fala: "Se eu fosse presentear alguém hoje, seria isso aqui." },
    cenas: [
      { filmar: "Close no detalhe que você mais gosta: fecho, costura, brilho.", texto: "O detalhe que me ganhou" },
      { filmar: "A peça em uso: no pulso, no ombro ou no pescoço, em frente ao espelho.", texto: "Vai do dia a dia à ceia" },
      { filmar: "Você coloca a peça na caixa de presente da loja.", texto: "R$ [preço] · já vai na caixa" }
    ],
    final: { filmar: "Caixa fechada, com a sua mão em cima.", texto: "Quer que eu separe um pra você?" },
    semAparecer: "Só as mãos aparecem: pegando a peça, mostrando o detalhe e fechando a caixa. A frase de abertura vai como texto na tela.",
    legenda: "Se fosse pra escolher um presente só, seria este 🤍\n\n[peça] por R$ [preço], e já sai na caixa de presente da loja. Vai do dia a dia à ceia.\n\nQuer que eu separe um pra você? Me chama no WhatsApp.\n\n#presentedenatal #escolhadaloja" },

  { id: "r-duplas", carrossel: "duplas", nivel: 1, nome: "Uma peça + outra = presente completo", duracao: "15 segundos",
    ideia: "Duas peças entram em cena, uma de cada lado, e se encontram no meio. A dupla vira um presente só.",
    preparar: "Duas peças que combinam (no exemplo, clutch e brincos dourados) e um fundo liso.",
    abertura: { filmar: "Bancada vazia, câmera parada. Uma mão coloca a primeira peça à esquerda.", fala: "Um presente é bom…" },
    cenas: [
      { filmar: "A outra mão coloca a segunda peça à direita.", texto: "…dois que combinam é melhor" },
      { filmar: "Aproxime as duas peças até se tocarem. Close no detalhe que conversa (o dourado, a cor).", texto: "O dourado do fecho conversa com o brilho dos brincos" },
      { filmar: "As duas peças entrando juntas na mesma embalagem.", texto: "R$ [preço] a dupla" }
    ],
    final: { filmar: "Embalagem fechada com laço.", texto: "Escolhe a sua dupla e me chama" },
    semAparecer: "Este roteiro já é feito só com as mãos. Se preferir, filme sem mãos: as peças paradas, uma tela para cada, e a embalagem no fim.",
    legenda: "Um presente é bom. Dois que combinam é presente de quem pensou em tudo 💝\n\n[peça 1] + [peça 2] por R$ [preço] a dupla. A gente embrulha as duas juntas.\n\nQual dupla você daria? Me chama no direct ou no WhatsApp.\n\n#presentedenatal #duplas" },

  { id: "r-ainda-da-tempo", carrossel: "ainda-da-tempo", nivel: 1, nome: "Corre que ainda dá tempo", duracao: "10 a 15 segundos",
    ideia: "Ritmo rápido, cara de último minuto. Mostra o que ainda tem e os prazos reais.",
    preparar: "3 presentes de pronta entrega, uma sacola da loja e as datas de entrega e retirada confirmadas.",
    abertura: { filmar: "Você entrando rápido no quadro, com a sacola na mão, meio esbaforida.", fala: "Esqueceu alguém da lista?" },
    cenas: [
      { filmar: "Cortes rápidos: um presente de pronta entrega em cada corte, 1 segundo cada.", texto: "Ainda tem pronta entrega" },
      { filmar: "Close no calendário do celular ou num papel com a data.", texto: "Entrega até [data] · retirada até [data]" },
      { filmar: "Você embrulhando um presente em segundos.", texto: "Embrulho na hora" }
    ],
    final: { filmar: "Sacola fechada estendida para a câmera.", texto: "Manda o presente e o horário que eu separo" },
    semAparecer: "Abra com a sacola entrando no quadro (só a mão). Nas cenas, só os presentes e o papel com as datas.",
    legenda: "Ainda dá tempo, sim ⏰\n\nEntrega na cidade para pedidos até [data]. Retirada na loja até [data].\n\nMe manda no WhatsApp o nome do presente e o horário que você passa aqui: fica embrulhado esperando você.\n\n#ultimascompras #natal" },

  { id: "r-amigo-secreto", carrossel: "amigo-secreto", nivel: 2, nome: "Tirou alguém que tu conhece pouco?", duracao: "15 segundos",
    ideia: "O drama do sorteio em 2 segundos e a solução: duas opções que agradam qualquer pessoa.",
    preparar: "O papelzinho do sorteio (escreva um nome qualquer) e 2 presentes de valor parecido.",
    abertura: { filmar: "Close no papelzinho dobrado sendo aberto pelas suas mãos.", fala: "Tirou alguém que tu conhece pouco?" },
    cenas: [
      { filmar: "Você faz cara de dúvida para a câmera (ou o papel cai na bancada).", texto: "Calma. Tem presente que agrada todo mundo" },
      { filmar: "Primeira opção na mão, de perto.", texto: "Opção 1: [presente] · R$ [preço]" },
      { filmar: "Segunda opção na outra mão.", texto: "Opção 2: [presente] · R$ [preço]" }
    ],
    final: { filmar: "As duas opções lado a lado, com o papelzinho entre elas.", texto: "Me fala o valor do teu amigo secreto 👇" },
    semAparecer: "Grave só as mãos abrindo o papelzinho e segurando as opções. A cara de dúvida vira um texto na tela: “E agora?”.",
    legenda: "Tirou alguém que tu conhece pouco no amigo secreto? Calma 😅\n\nSeparamos achados que agradam qualquer pessoa, até R$ 30, R$ 50 e R$ 70. Todos saem embrulhados.\n\nMe fala o valor combinado que eu te mando as opções no WhatsApp.\n\n#amigosecreto #presentedenatal" },

  { id: "r-tres-jeitos", carrossel: "tres-jeitos", nivel: 2, nome: "Uma peça, três jeitos", duracao: "15 a 20 segundos",
    ideia: "Transição a cada jeito de usar. Mostra que o presente rende e vale o preço.",
    preparar: "A peça (no exemplo, o lenço de seda), uma camisa clara e uma bolsa.",
    abertura: { filmar: "A peça dobrada na sua mão, de perto.", fala: "Uma peça, três jeitos de usar." },
    cenas: [
      { filmar: "A peça no pescoço, com nó lateral, em frente ao espelho.", texto: "1 · no pescoço" },
      { filmar: "Estale os dedos e corte para a peça no cabelo.", texto: "2 · no cabelo" },
      { filmar: "Corte para a peça amarrada na alça da bolsa.", texto: "3 · na bolsa" }
    ],
    final: { filmar: "A peça dobrada de novo, entrando no papel de presente.", texto: "R$ [preço] · presente que rende" },
    semAparecer: "Use um manequim ou uma cabeça de isopor para o pescoço e o cabelo. A bolsa pode ficar pendurada num cabide.",
    legenda: "Presente bom é o que sai da caixa e vai direto pro look 🧣\n\n[peça] por R$ [preço]: no pescoço, no cabelo ou na alça da bolsa. Quem ganha usa na ceia, no almoço do dia 25 e nas férias.\n\nQuer ver as cores? Me chama no direct.\n\n#presentecoringa #natal" },

  { id: "r-equipe", carrossel: "equipe", nivel: 2, nome: "O que a equipe daria de presente", duracao: "20 segundos",
    ideia: "Cada pessoa da equipe aponta a sua escolha e diz uma frase. Gente de verdade aproxima.",
    preparar: "Três pessoas da equipe (ou você e duas amigas da loja), cada uma com a sua peça escolhida.",
    abertura: { filmar: "As três pessoas lado a lado, cada uma escondendo a peça atrás das costas.", fala: "Perguntei pra equipe: qual presente vocês dariam?" },
    cenas: [
      { filmar: "A primeira mostra a peça e diz a frase dela.", texto: "[nome]: “[frase curta]”" },
      { filmar: "A segunda mostra a peça e diz a frase dela.", texto: "[nome]: “[frase curta]”" },
      { filmar: "A terceira mostra a peça e diz a frase dela.", texto: "[nome]: “[frase curta]”" }
    ],
    final: { filmar: "As três peças juntas na bancada.", texto: "E você, escolheria qual?" },
    semAparecer: "Cada pessoa aparece só com as mãos segurando a peça. As frases entram como texto na tela, com o nome de quem escolheu.",
    legenda: "Perguntamos pra equipe: se fossem dar um presente daqui, qual seria? 💬\n\nTrês pessoas, três escolhas. Qual você escolheria?\n\nConta nos comentários ou chama no WhatsApp pra reservar.\n\n#escolhasdaequipe #natal" },

  { id: "r-cores-virada", carrossel: "cores-virada", nivel: 3, nome: "A cor da sua virada", duracao: "15 segundos",
    ideia: "Uma cor por corte, cada uma com o seu desejo para o ano novo.",
    preparar: "3 peças em cores diferentes (branco, dourado e rosa, ou as suas) e um fundo liso.",
    abertura: { filmar: "As 3 peças penduradas ou lado a lado, câmera parada.", fala: "Qual cor vai te acompanhar no ano novo?" },
    cenas: [
      { filmar: "Close na peça branca, mexendo no tecido.", texto: "Branco · paz" },
      { filmar: "Close na peça dourada, perto da luz.", texto: "Dourado · prosperidade" },
      { filmar: "Close na peça rosa.", texto: "Rosa · amor" }
    ],
    final: { filmar: "As 3 peças juntas de novo.", texto: "Comenta a tua cor 👇" },
    semAparecer: "Este roteiro já é feito só com as peças. Se quiser, uma mão mexe no tecido de cada uma.",
    legenda: "Tu é do time que escolhe a cor da virada? 🎆\n\nBranco para paz, dourado para prosperidade, rosa para o amor. Tem peça de cada cor aqui na loja.\n\nComenta qual vai ser a tua e chama no direct pra separar.\n\n#reveillon #coresdavirada" },

  { id: "r-looks-virada", carrossel: "looks-virada", nivel: 3, nome: "Praia, casa ou festa?", duracao: "15 a 20 segundos",
    ideia: "Três transições de look. Quem assiste escolhe o seu cenário de virada.",
    preparar: "Três looks prontos nos cabides (praia, casa e festa) e um espelho.",
    abertura: { filmar: "Você em frente ao espelho, com roupa do dia a dia.", fala: "Onde vai ser a tua virada?" },
    cenas: [
      { filmar: "Pule ou estale os dedos e corte para o look de praia.", texto: "Na praia" },
      { filmar: "Mesmo gesto, corte para o look de casa.", texto: "Em casa" },
      { filmar: "Mesmo gesto, corte para o look de festa.", texto: "Na festa" }
    ],
    final: { filmar: "Os três looks nos cabides, lado a lado.", texto: "Me manda o teu tamanho que eu separo" },
    semAparecer: "Filme cada look no cabide, com a mão trocando o cabide a cada corte. O texto na tela faz o resto.",
    legenda: "Onde vai ser a tua virada? 🥂\n\nNa praia, em casa ou na festa: tem look pra cada uma aqui na loja.\n\nMe chama no WhatsApp com o teu tamanho que eu separo o look inteiro pra tu provar.\n\n#reveillon #lookdavirada" },

  { id: "r-ultimos-dias", carrossel: "ultimos-dias", nivel: 3, nome: "Últimos dias do ano na loja", duracao: "15 segundos",
    ideia: "Um passeio rápido pela loja com os horários de fim de ano e um obrigada sincero.",
    preparar: "A loja arrumada, as taças do brinde (se tiver) e os horários de 30 e 31/12 confirmados.",
    abertura: { filmar: "A porta da loja (ou a vitrine) com a luz acesa.", fala: "Últimos dias do ano por aqui ✨" },
    cenas: [
      { filmar: "Passeio lento pelas prateleiras.", texto: "30/12: aberto até as [hora]" },
      { filmar: "Close nas peças de brinde e de festa.", texto: "31/12: aberto até as [hora]" },
      { filmar: "Você (ou a equipe) acenando no balcão.", texto: "Obrigada por este ano" }
    ],
    final: { filmar: "A luz da vitrine apagando.", texto: "A gente volta dia [data]!" },
    semAparecer: "Troque o aceno por duas taças brindando em cima do balcão.",
    legenda: "Os últimos dias do ano chegaram ✨\n\nA loja fica aberta até as [hora] em 30/12 e até as [hora] em 31/12. Ainda dá tempo de garantir as taças do brinde, o brinco da virada ou a bolsa da festa.\n\nObrigada por cada visita este ano. Chama no WhatsApp que a gente separa.\n\n#reveillon #ultimosdias" }
];

/* ---------------- Stories ---------------- */
const enquete = (pergunta, a, b) => ({ tipo: "Enquete", pergunta, respostas: [a, b] });
const link = texto => ({ tipo: "Link", texto });
const caixinha = pergunta => ({ tipo: "Caixa de perguntas", pergunta });
const N = (foto, adesivo) => ({ foto, ...(adesivo ? { adesivo } : {}) });

const stories = [
  { id: "s-ate-100", carrossel: "ate-100", nivel: 1, nome: "Quanto você quer gastar?", ideia: "Começa com uma enquete de valor, mostra um dos presentes e leva para o WhatsApp.",
    telas: [
      { ...T("st-enquete", { pergunta: "Quanto você quer gastar no *presente*?", op1: "Até R$ 100", op2: "Mais que isso", dica: "Vota na enquete ↓" }, [EMBRULHO, P.relogio]),
        nota: N("Esquerda: a embalagem da loja. Direita: um presente mais caro.", enquete("Quanto você quer gastar?", "Até R$ 100", "Mais que isso")) },
      { ...T("st-foto", { titulo: "Até R$ 100 tem *muita coisa boa*", texto: "Esse é um dos 5 que separei. Já sai embrulhado.", preco: "R$ 89" }, [P.clutch]),
        nota: N("Um dos 5 presentes do carrossel, de perto, com luz de janela.") },
      { ...T("st-acao", { titulo: "Quer ver *os 5*?", texto: "Tá no post de hoje. Ou me chama que eu mando as fotos.", botao: "Chama no WhatsApp", dica: "Toque no link ↓" }, [EMBRULHO], { aj: [close(1.6, 0.5, 0.62)] }),
        nota: N("A embalagem ou o laço, bem de perto.", link("Adesivo Link com o seu WhatsApp (wa.me/55…). Se preferir, compartilhe o post do dia nesta tela.")) }
    ] },
  { id: "s-cara-dela", carrossel: "cara-dela", nivel: 1, nome: "Ela é mais…", ideia: "Uma pergunta para pensar em alguém, uma enquete de estilo e a caixinha para indicar o presente.",
    telas: [
      { ...T("st-texto", { titulo: "Pensa em quem você vai *presentear*.", apoio: "Pensou? Agora vota na próxima tela →" }, [], { inv: true }),
        nota: N("Esta tela não usa foto.") },
      { ...T("st-enquete", { pergunta: "Ela é mais…", op1: "De festa", op2: "Clássica", dica: "Vota na enquete ↓" }, [P.clutch, P.lenco]),
        nota: N("Esquerda: peça de festa (clutch). Direita: peça clássica (lenço).", enquete("Ela é mais…", "De festa", "Clássica")) },
      { ...T("st-caixa", { titulo: "Me conta quem é *ela*", apoio: "Eu digo qual presente tem a cara dela.", dica: "Escreve aqui ↓" }, [P.brincos]),
        nota: N("Uma terceira peça, de perto.", caixinha("Pra quem é o presente?")) }
    ] },
  { id: "s-escolha", carrossel: "escolha", nivel: 1, nome: "Se eu fosse presentear…", ideia: "A frase, a peça escolhida com preço e o convite para reservar.",
    telas: [
      { ...T("st-texto", { titulo: "Se eu fosse presentear *alguém hoje*…", apoio: "…eu escolheria isso aqui →" }),
        nota: N("Esta tela não usa foto.") },
      { ...T("st-foto", { titulo: "Relógio *Clássico*", texto: "Caixa dourada e pulseira de couro macia. Vai do dia a dia à ceia.", preco: "R$ 189" }, [P.relogio]),
        nota: N("A peça escolhida na prateleira, com a luz da loja.") },
      { ...T("st-acao", { titulo: "Separo *um pra você*?", texto: "Vai na caixa de presente da loja.", botao: "Reservar no WhatsApp", dica: "Toque no link ↓" }, [P.relogio], { aj: [close(2, 0.5, 0.48)] }),
        nota: N("O detalhe da peça, bem de perto.", link("Adesivo Link com o seu WhatsApp (wa.me/55…).")) }
    ] },
  { id: "s-duplas", carrossel: "duplas", nivel: 1, nome: "Qual dupla você daria?", ideia: "Anuncia o tema, pede o voto entre duas duplas e fecha com a embalagem das duas juntas.",
    telas: [
      { ...T("st-texto", { titulo: "Hoje é dia de *dupla*", apoio: "Duas peças que ficam melhores juntas" }, [], { inv: true }),
        nota: N("Esta tela não usa foto.") },
      { ...T("st-enquete", { pergunta: "Qual *dupla* você daria?", op1: "Clutch + brincos", op2: "Lenço + óculos", dica: "Vota na enquete ↓" }, [P.clutch, P.lenco]),
        nota: N("Uma foto de cada dupla (ou da peça principal de cada uma).", enquete("Qual dupla você daria?", "Clutch + brincos", "Lenço + óculos")) },
      { ...T("st-acao", { titulo: "A gente embrulha *as duas juntas*", texto: "Escolhe a sua dupla e me chama.", botao: "Quero a minha dupla", dica: "Toque no link ↓" }, [P.brincos]),
        nota: N("A dupla vencedora junta, ou a embalagem pronta.", link("Adesivo Link com o seu WhatsApp (wa.me/55…).")) }
    ] },
  { id: "s-ainda-da-tempo", carrossel: "ainda-da-tempo", nivel: 1, nome: "Ainda dá tempo", ideia: "Contagem regressiva, prazos reais e o pedido de separar o presente.",
    telas: [
      { ...T("st-texto", { titulo: "Faltam *[X] dias* pro Natal", apoio: "E ainda dá tempo, sim." }, [], { inv: true }),
        nota: N("Esta tela não usa foto. Troque [X] pelo número de dias.", { tipo: "Contagem regressiva (opcional)", texto: "Adesivo Contagem regressiva para 24/12, se quiser lembrar as seguidoras." }) },
      { ...T("st-lista", { titulo: "Prazos *reais*", item1: "Entrega na cidade: pedidos até 22/12", item2: "Retirada na loja até 14h de 24/12", item3: "Embrulho na hora, sem custo", apoio: "Depois disso, só no balcão." }),
        nota: N("Esta tela não usa foto. Confira as suas datas.") },
      { ...T("st-acao", { titulo: "A gente *separa* pra você", texto: "Me fala qual presente e a hora que você passa aqui.", botao: "Separar meu presente", dica: "Toque no link ↓" }, [P.sacola]),
        nota: N("A sacola ou a vitrine da loja.", link("Adesivo Link com o seu WhatsApp (wa.me/55…).")) }
    ] },
  { id: "s-cores-virada", carrossel: "cores-virada", nivel: 3, nome: "Qual cor vai te acompanhar?", ideia: "Enquete de cor, a peça de cada desejo e o convite para separar.",
    telas: [
      { ...T("st-enquete", { pergunta: "Qual cor vai te acompanhar em *2027*?", op1: "Branco", op2: "Dourado", dica: "Vota na enquete ↓" }, [P.vestidoBranco, P.colar]),
        nota: N("Uma peça branca e uma dourada.", enquete("Qual cor vai te acompanhar?", "Branco", "Dourado")) },
      { ...T("st-foto", { titulo: "Branco para *paz*", texto: "Vestido Brisa: leve para a praia e para a ceia.", preco: "R$ 189" }, [P.vestidoBranco]),
        nota: N("A peça branca inteira, no cabide ou vestida.") },
      { ...T("st-caixa", { titulo: "Qual é a *sua cor*?", apoio: "Me conta que eu separo a peça pra você.", dica: "Responde aqui ↓" }, [P.colar]),
        nota: N("A peça dourada, de perto.", caixinha("Qual vai ser a sua cor?")) }
    ] },
  { id: "s-looks-virada", carrossel: "looks-virada", nivel: 3, nome: "Onde vai ser a sua virada?", ideia: "Enquete de lugar, o look pronto e a caixinha do tamanho.",
    telas: [
      { ...T("st-enquete", { pergunta: "Onde vai ser a sua *virada*?", op1: "Na praia", op2: "Em casa", dica: "Vota na enquete ↓" }, [P.vestidoBranco, P.camisa]),
        nota: N("Um look de praia e um de casa.", enquete("Onde vai ser a sua virada?", "Na praia", "Em casa")) },
      { ...T("st-foto", { titulo: "Pra quem vai *pra festa*", texto: "Vestido Noite com a Clutch Noite.", preco: "R$ 229" }, [P.vestido]),
        nota: N("O look de festa inteiro.") },
      { ...T("st-caixa", { titulo: "Me manda *o seu tamanho*", apoio: "Eu separo o look inteiro pra você provar.", dica: "Responde aqui ↓" }, [P.salto]),
        nota: N("Um acessório do look, de perto.", caixinha("Qual é o seu tamanho?")) }
    ] },
  { id: "s-ultimos-dias", carrossel: "ultimos-dias", nivel: 3, nome: "Últimos dias do ano", ideia: "Aviso, horários de fim de ano e um obrigada.",
    telas: [
      { ...T("st-texto", { titulo: "Últimos dias de *2026*", apoio: "Anota os horários da loja →" }),
        nota: N("Esta tela não usa foto.") },
      { ...T("st-lista", { titulo: "Horários de *fim de ano*", item1: "30/12: aberto até as 18h", item2: "31/12: aberto até as 13h", item3: "1º/1: a loja descansa", apoio: "Voltamos dia 2!" }),
        nota: N("Esta tela não usa foto. Confira os seus horários.") },
      { ...T("st-acao", { titulo: "Obrigada por *este ano*", texto: "Cada visita deixou a nossa loja mais bonita.", botao: "Feliz 2027!", dica: "" }, [P.tacas]),
        nota: N("As taças do brinde, ou a equipe da loja.", { tipo: "Música (opcional)", texto: "Adesivo Música com uma trilha de festa." }) }
    ] }
];

/* ---------------- calendários ---------------- */
const C = (ref, preparar) => ({ f: "carrossel", ref, preparar });
const R = (ref, preparar) => ({ f: "reel", ref, preparar });
const S = (ref, preparar) => ({ f: "stories", ref, preparar });
const W = (ref, preparar) => ({ f: "whatsapp", ref, preparar });
const d = (dia, ...itens) => ({ dia, itens });

const calendario = {
  dica: "Publique o feed entre 11h e 13h ou entre 18h e 20h. Stories podem sair ao longo do dia. A mensagem “Resposta a quem pergunta o preço” serve para qualquer dia.",
  dez: [
    d(1, C("ate-100", "Fotos dos 5 presentes até R$ [valor], cada um sozinho."), S("s-ate-100", "Uma foto da embalagem e uma de um presente mais caro para a enquete.")),
    d(2, R("r-ate-100", "Os 5 presentes e uma caixa. Grave em 10 minutos, perto da janela.")),
    d(3, C("cara-dela", "Fotos de 3 presentes com estilos diferentes."), S("s-cara-dela", "As mesmas fotos de ontem servem.")),
    d(4, R("r-cara-dela", "Os 3 presentes de ontem escondidos atrás das costas."), W("w-sugestao", "Envie para 10 clientes que já compraram com você.")),
    d(5, C("escolha", "A peça que você escolheria, fotografada na prateleira e de perto.")),
    d(6, R("r-escolha", "A mesma peça e a caixa de presente da loja."), S("s-escolha", "Use as fotos do carrossel de ontem.")),
    d(7, C("duplas", "Duas duplas de peças que combinam, cada peça fotografada sozinha."), S("s-duplas", "As fotos das duplas.")),
    d(8, R("r-duplas", "Uma das duplas e uma embalagem.")),
    d(9, C("ainda-da-tempo", "Suas datas reais de entrega e retirada e 3 presentes de pronta entrega."), S("s-ainda-da-tempo", "Troque o número de dias e confira os prazos."), W("w-prazo", "Envie para quem perguntou e não fechou.")),
    d(10, R("r-ainda-da-tempo", "Sacola da loja e um papel com as datas."))
  ],
  expressa: [
    d(1, C("ate-100", "Fotos dos 5 presentes até R$ [valor]."), S("s-ate-100", "Embalagem e um presente para a enquete.")),
    d(2, R("r-ate-100", "Os 5 presentes e uma caixa."), W("w-sugestao", "Envie para clientes que já compraram.")),
    d(3, C("ainda-da-tempo", "Datas reais de entrega e retirada."), S("s-ainda-da-tempo", "Troque o número de dias."), W("w-prazo", "Envie para quem perguntou e não fechou."))
  ],
  quinze: [
    d(1, C("ate-100", "Fotos dos 5 presentes até R$ [valor], cada um sozinho."), S("s-ate-100", "Uma foto da embalagem e uma de um presente mais caro.")),
    d(2, R("r-ate-100", "Os 5 presentes e uma caixa.")),
    d(3, C("cara-dela", "Fotos de 3 presentes com estilos diferentes."), S("s-cara-dela", "As mesmas fotos do carrossel.")),
    d(4, R("r-cara-dela", "Os 3 presentes escondidos atrás das costas."), W("w-sugestao", "Envie para 10 clientes que já compraram com você.")),
    d(5, C("amigo-secreto", "9 achados em três faixas de preço (até R$ 30, R$ 50 e R$ 70).")),
    d(6, R("r-amigo-secreto", "Um papelzinho com um nome e 2 achados de valor parecido.")),
    d(7, C("escolha", "A peça que você escolheria, na prateleira e de perto."), S("s-escolha", "Use as fotos do carrossel.")),
    d(8, R("r-escolha", "A mesma peça e a caixa de presente da loja.")),
    d(9, C("tres-jeitos", "Uma peça versátil fotografada de 3 jeitos.")),
    d(10, R("r-tres-jeitos", "A peça, uma camisa clara e uma bolsa.")),
    d(11, C("duplas", "Duas duplas de peças que combinam."), S("s-duplas", "As fotos das duplas.")),
    d(12, R("r-duplas", "Uma das duplas e uma embalagem.")),
    d(13, C("equipe", "Três pessoas da equipe, cada uma com a peça que escolheu."), R("r-equipe", "As mesmas três pessoas. Publique à noite.")),
    d(14, C("ainda-da-tempo", "Suas datas reais de entrega e retirada."), S("s-ainda-da-tempo", "Troque o número de dias e confira os prazos."), W("w-prazo", "Envie para quem perguntou e não fechou.")),
    d(15, R("r-ainda-da-tempo", "Sacola da loja e um papel com as datas."))
  ],
  reveillon: [
    d(1, C("cores-virada", "3 peças em cores diferentes, cada uma sozinha."), S("s-cores-virada", "Uma peça branca e uma dourada.")),
    d(2, R("r-cores-virada", "As 3 peças coloridas e um fundo liso.")),
    d(3, C("looks-virada", "3 looks prontos: praia, casa e festa."), S("s-looks-virada", "Fotos dos looks."), R("r-looks-virada", "Os 3 looks nos cabides. Publique à noite.")),
    d(4, C("ultimos-dias", "Horários de 30 e 31/12 e as peças do brinde."), S("s-ultimos-dias", "Confira os horários.")),
    d(5, R("r-ultimos-dias", "A loja arrumada e as taças."))
  ]
};

export default {
  id: "presentes-por-orcamento",
  nome: "Presentes por orçamento",
  resumo: "Ajude a cliente a escolher presentes pelo preço, pelo estilo de quem vai ganhar e pelo prazo, e leve a conversa para o WhatsApp ou o direct.",
  reels, stories, calendario,
  whatsapp: [
    { id: "w-preco", titulo: "Resposta a quem pergunta o preço", quando: "Quando alguém pergunta “quanto custa?” no WhatsApp ou no direct.",
      texto: "Oi, [nome]! Tudo bem? 😊 O [produto] sai por R$ [preço] e já vai embrulhado pra presente. Quer que eu separe um pra você? Dá pra retirar aqui na loja ou receber em casa." },
    { id: "w-sugestao", titulo: "Sugestão de presente", quando: "Para clientes que já compraram com você. Envie uma por uma, não em grupo.",
      texto: "Oi, [nome]! Aqui é a [seu nome], da [nome da loja] 🎁 Separei umas ideias de presente até R$ [valor] e lembrei de você. Quer que eu te mande as fotos? É só responder aqui." },
    { id: "w-prazo", titulo: "Aviso de prazo", quando: "Nos últimos dias antes do Natal.",
      texto: "Oi, [nome]! Passando pra avisar: pedidos para entrega até [data] e retirada na loja até [data] 🎄 Se ainda falta algum presente, me chama que eu separo e embrulho pra você." }
  ],
  tutorial: [
    { titulo: "Siga o calendário", texto: "Abra o Calendário, veja o dia e toque em “Abrir”: o material certo abre na hora. Em “Preparar” está o que você precisa ter em mãos." },
    { titulo: "Fotografe com luz de janela", texto: "Produto no centro, fundo liso, celular na vertical, sem flash. Uma foto por tela." },
    { titulo: "Troque foto, texto e preço", texto: "No editor, toque na tela, troque a foto pela sua e ajuste o zoom e a posição. Na aba Textos, mude preços e nomes. Na aba Marca, coloque o nome ou o logo da loja: vale para tudo." },
    { titulo: "Baixe e publique", texto: "Carrosséis saem em 4 imagens de 1080 × 1350 e Stories em 3 imagens de 1080 × 1920, já numeradas. No iPhone, use “Compartilhar imagens” e “Salvar imagens”. No carrossel, cole a legenda com “Copiar legenda”." },
    { titulo: "Stories com adesivo", texto: "Quando a tela pede enquete, link ou caixinha, a pergunta e as respostas estão ao lado, prontas para copiar. Coloque o adesivo no Instagram, no espaço livre com a seta." },
    { titulo: "Grave o Reel pelo roteiro", texto: "“Para gravar” diz o que filmar em cada cena. “Para copiar” traz os textos da tela e a legenda. Não quer aparecer? Siga “Sem aparecer”: só mãos, produto ou texto na tela." }
  ]
};
