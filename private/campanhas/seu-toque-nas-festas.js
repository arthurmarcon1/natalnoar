/* =====================================================================
   KIT PAGO: Seu toque nas festas (prestadoras de serviço)
   Só sai pela função api/campanha.js, filtrado pelo plano comprado.
   Mesma estrutura de presentes-por-orcamento.js (ver o comentário de lá).
   Cada peça se liga a um carrossel do catálogo (public/catalogo/seu-toque-nas-festas.js).
   ===================================================================== */
import { T, FOTOS as P, close } from "../../public/catalogo/_base.js";

/* ---------------- Reels ---------------- */
const reels = [
  { id: "r-pronta-ceia", carrossel: "pronta-ceia", nivel: 1, nome: "Do rosto lavado à ceia", duracao: "20 segundos",
    ideia: "Acompanha um detalhe do atendimento (a pele) e revela o resultado no final.",
    preparar: "Uma cliente (ou você mesma) com autorização para filmar, luz de janela e o celular num tripé ou apoiado.",
    abertura: { filmar: "Close no rosto sem make, com a cliente de olhos fechados.", fala: "Ela tinha ceia às 20h. Começamos às 18h." },
    cenas: [
      { filmar: "Close na pele recebendo hidratante, com os dedos ou o pincel.", texto: "Primeiro, a pele" },
      { filmar: "Pó sendo aplicado só na testa e no nariz.", texto: "Pó só onde precisa" },
      { filmar: "Os olhos de perto, com o último toque de iluminador no canto.", texto: "O detalhe que aparece na foto" }
    ],
    final: { filmar: "Ela abre os olhos e sorri para a câmera. Corte para ela pronta, de corpo inteiro.", texto: "Pronta para a ceia ✨ · horários em 23 e 24/12" },
    semAparecer: "Você não precisa aparecer: só as suas mãos trabalham. Se a cliente não quiser mostrar o rosto, filme só os olhos e a boca, e no fim ela de costas, com o cabelo pronto.",
    legenda: "Ela tinha ceia às 20h. Começamos às 18h ✨\n\nPele preparada, pó só onde precisa e o iluminador no ponto certo: dura até a sobremesa.\n\nAinda tenho horários em 23 e 24/12, no estúdio ou na sua casa. Me chama no WhatsApp.\n\n#makedenatal #maquiagem" },

  { id: "r-tres-estilos", carrossel: "tres-estilos", nivel: 1, nome: "Qual combina com a sua festa?", duracao: "15 segundos",
    ideia: "Três festas, três produções. Quem assiste se reconhece numa delas.",
    preparar: "Fotos ou vídeos curtos de 3 trabalhos seus: um leve, um com brilho e um penteado.",
    abertura: { filmar: "Você olhando para a câmera, com os pincéis na mão.", fala: "Qual estilo combina com a sua festa?" },
    cenas: [
      { filmar: "Trabalho 1 pronto, a cliente virando o rosto devagar para a luz.", texto: "Almoço da firma: make leve" },
      { filmar: "Trabalho 2 pronto, de perto, para mostrar o brilho.", texto: "Jantar de Natal: glow dourado" },
      { filmar: "Trabalho 3: o penteado de costas, girando devagar.", texto: "Confra: penteado de festa" }
    ],
    final: { filmar: "Você de novo, apontando para baixo.", texto: "Comenta a sua festa 👇" },
    semAparecer: "Abra com uma tela de texto (“Qual combina com a sua festa?”) e mostre só os trabalhos prontos. Pode usar fotos, 2 segundos cada.",
    legenda: "Cada festa pede um toque diferente ✨\n\nAlmoço da firma: make leve. Jantar de Natal: glow dourado. Confra: penteado de festa.\n\nQual combina com a sua? Comenta aqui ou me chama no WhatsApp que eu passo os horários.\n\n#makedefesta #penteado" },

  { id: "r-unhas", carrossel: "unhas", nivel: 1, nome: "Da unha do dia a dia à unha de festa", duracao: "15 segundos",
    ideia: "Antes e depois com uma virada de mão. Simples de gravar e muito assistido.",
    preparar: "As mãos da cliente antes de começar e depois de pronta. Luz de janela e fundo liso.",
    abertura: { filmar: "Mãos da cliente com as unhas do dia a dia, paradas sobre a toalha.", fala: "Unha do dia a dia…" },
    cenas: [
      { filmar: "As mãos viram para baixo. Corte e elas viram de volta prontas.", texto: "…unha de festa" },
      { filmar: "Close numa unha, girando devagar para pegar a luz.", texto: "Esmaltação em gel" },
      { filmar: "As mãos segurando uma taça ou um talher.", texto: "Aguenta a ceia, a louça e a virada" }
    ],
    final: { filmar: "Os vidros de esmalte enfileirados.", texto: "Dezembro lota rápido · garanta seu horário" },
    semAparecer: "Este roteiro já mostra só as mãos da cliente. Você não aparece em nenhum momento.",
    legenda: "Da unha do dia a dia à unha de festa 💅\n\nEsmaltação em gel que aguenta a ceia, a louça e a virada. Vermelho clássico, nude com glitter ou francesinha dourada.\n\nDezembro lota rápido: escolhe o dia e me chama no WhatsApp que eu confirmo.\n\n#unhasdefesta #manicure" },

  { id: "r-doce-ceia", carrossel: "doce-ceia", nivel: 1, nome: "O corte que fecha a ceia", duracao: "15 segundos",
    ideia: "O primeiro corte do bolo, em câmera lenta. O recheio aparecendo é o que segura quem assiste.",
    preparar: "Um bolo pronto, uma faca bonita e luz de janela. Ative a câmera lenta do celular.",
    abertura: { filmar: "O bolo inteiro na mesa, câmera parada.", fala: "Quem vai levar a sobremesa da ceia?" },
    cenas: [
      { filmar: "A faca entra no bolo, em câmera lenta.", texto: "O primeiro corte…" },
      { filmar: "A fatia saindo, com o recheio de perto.", texto: "[recheio]" },
      { filmar: "A fatia no prato, com um garfo pegando um pedaço.", texto: "Serve 6, 12 ou 20 pessoas" }
    ],
    final: { filmar: "O bolo embalado na caixa, com laço.", texto: "Encomendas até [data]" },
    semAparecer: "Este roteiro já é feito só com o bolo e as mãos. Se preferir, deixe a faca e o prato parados e filme só o bolo girando num prato giratório.",
    legenda: "Quem vai levar a sobremesa da ceia? 🎂\n\n[recheio]. Mini (serve 6), médio (serve 12) ou grande (serve 20).\n\nEncomendas até [data], com retirada em 23 e 24/12. Me chama no WhatsApp pra garantir o seu.\n\n#bolodenatal #confeitaria" },

  { id: "r-mesa-posta", carrossel: "mesa-posta", nivel: 1, nome: "Monta comigo a mesa de Natal", duracao: "20 segundos",
    ideia: "A mesa vazia vira mesa posta em três camadas. Timelapse rápido e satisfatório.",
    preparar: "A mesa vazia, toalha, caminho de mesa, flores, velas e louça. Celular apoiado no alto.",
    abertura: { filmar: "A mesa vazia, câmera do alto, parada.", fala: "Monta comigo a mesa de Natal?" },
    cenas: [
      { filmar: "Timelapse: a toalha e o caminho de mesa entrando.", texto: "1 · a base" },
      { filmar: "Timelapse: o arranjo baixo de flores e velas no centro.", texto: "2 · o centro baixo" },
      { filmar: "Timelapse: pratos, taças e guardanapos.", texto: "3 · a louça" }
    ],
    final: { filmar: "Velas acesas, a câmera passeando devagar pela mesa.", texto: "Quer a sua pronta no dia 24?" },
    semAparecer: "O timelapse já mostra só a mesa. Suas mãos podem aparecer arrumando, ou nem isso: grave a mesa a cada etapa e junte as partes.",
    legenda: "Monta comigo a mesa de Natal? 🕯️\n\nBase clara, centro baixo pra ninguém perder a conversa e a louça no lugar. Simples e com cara de festa.\n\nQuer a sua pronta no dia 24? Monto no dia e retiro no dia seguinte. Me chama no WhatsApp pra um orçamento.\n\n#mesaposta #decoracaodenatal" },

  { id: "r-dura", carrossel: "dura", nivel: 2, nome: "Make dura a noite toda?", duracao: "15 segundos",
    ideia: "Responde à dúvida mais comum com uma prova: o mesmo rosto às 19h e à 1h.",
    preparar: "Uma foto ou vídeo da cliente pronta no começo da festa e outro no fim (peça para ela gravar).",
    abertura: { filmar: "Você olhando para a câmera, séria, segurando um pincel.", fala: "“Make dura a noite toda?” Essa é a pergunta que eu mais ouço." },
    cenas: [
      { filmar: "Close na pele sendo preparada com hidratante e primer.", texto: "Segredo 1: pele preparada" },
      { filmar: "O pincel aplicando camadas finas.", texto: "Segredo 2: camadas finas" },
      { filmar: "A cliente às 19h e a mesma cliente à 1h, lado a lado.", texto: "19h · 1h" }
    ],
    final: { filmar: "Você de novo, sorrindo.", texto: "Resposta curta: dura, sim" },
    semAparecer: "Troque a abertura por uma tela de texto com a pergunta. Nas cenas, só as mãos e a pele da cliente.",
    legenda: "“Make dura a noite toda?” Essa é a pergunta que eu mais ouço em dezembro 💬\n\nDura, sim. O segredo é a pele bem preparada e o produto em camadas finas.\n\nTem festa chegando? Me chama no WhatsApp que eu vejo o seu horário.\n\n#maquiagem #makedefesta" },

  { id: "r-detalhe", carrossel: "detalhe", nivel: 2, nome: "Me manda a foto do look", duracao: "15 segundos",
    ideia: "Mostra como a foto do vestido decide a make. A cliente entende o valor de mandar o look antes.",
    preparar: "Um print (com autorização) de uma cliente mandando a foto do vestido e o resultado da make.",
    abertura: { filmar: "A tela do celular com a foto do vestido chegando no WhatsApp.", fala: "Ela me mandou o vestido. Eu escolhi a make em dois minutos." },
    cenas: [
      { filmar: "Close no decote e na cor do vestido.", texto: "A cor e o decote decidem" },
      { filmar: "Paleta e batons separados sobre a bancada.", texto: "Batom ou olho? Aqui foi o olho" },
      { filmar: "O resultado: a cliente pronta, com o vestido.", texto: "Pronta para a festa" }
    ],
    final: { filmar: "Você digitando no celular.", texto: "Me manda a foto do seu look 📲" },
    semAparecer: "Todo o roteiro pode ser feito com a tela do celular, as mãos separando os produtos e o resultado na cliente.",
    legenda: "Ela me mandou a foto do vestido e eu escolhi a make em dois minutos 👗\n\nA cor e o decote dizem onde ir de batom e onde ir de olho. A luz da festa diz quanto iluminador usar.\n\nMe manda a foto do seu look no WhatsApp que eu já sugiro a make antes do dia.\n\n#maquiagem #makedefesta" },

  { id: "r-imprevisto", carrossel: "imprevisto", nivel: 2, nome: "40 minutos antes da festa", duracao: "20 segundos",
    ideia: "Uma história curta com problema, solução e final feliz. Mostra calma e experiência.",
    preparar: "Fotos ou vídeos do antes e do depois de um atendimento com imprevisto (com autorização).",
    abertura: { filmar: "Close no relógio do celular marcando a hora.", fala: "Ela chegou com o cabelo molhado da chuva. 40 minutos antes da festa." },
    cenas: [
      { filmar: "O cabelo molhado, de costas.", texto: "O imprevisto" },
      { filmar: "Suas mãos prendendo o coque, rápido.", texto: "A solução: coque baixo, firme e rápido" },
      { filmar: "Ela pronta, de perfil, saindo pela porta.", texto: "Chegou no horário" }
    ],
    final: { filmar: "Você guardando os grampos, aliviada.", texto: "E ninguém soube da chuva 😉" },
    semAparecer: "Conte a história só com textos na tela e as imagens do cabelo e das mãos.",
    legenda: "Ela chegou com o cabelo molhado da chuva, 40 minutos antes da festa 😱\n\nTrocamos o cabelo solto por um coque baixo, mais rápido e firme. Ela chegou no horário e ninguém soube da chuva.\n\nTem festa chegando? Me chama no WhatsApp.\n\n#penteado #bastidores" },

  { id: "r-producao-virada", carrossel: "producao-virada", nivel: 3, nome: "Produção completa da virada", duracao: "15 segundos",
    ideia: "Make e penteado no mesmo horário, com o brilho da virada.",
    preparar: "Um trabalho com brilho (make e penteado prontos) e confete ou glitter para a abertura.",
    abertura: { filmar: "Confete ou glitter caindo na frente da câmera.", fala: "Vai virar o ano como?" },
    cenas: [
      { filmar: "Close na make glow, a cliente virando o rosto para a luz.", texto: "Make glow" },
      { filmar: "O penteado de costas, girando devagar.", texto: "+ penteado" },
      { filmar: "O kit de retoque entrando na bolsinha.", texto: "Fixação para calor e praia" }
    ],
    final: { filmar: "A cliente pronta, brindando com uma taça.", texto: "R$ [preço] · agenda do dia 31" },
    semAparecer: "Abra com o confete e mostre só os trabalhos e as mãos. O brinde pode ser só das taças.",
    legenda: "Vai virar o ano como? ✨\n\nProdução completa: make glow e penteado no mesmo horário, com fixação para calor e praia e kit de retoque.\n\nAtendo no dia 31 das 9h às 18h. Restam poucos horários: me chama no WhatsApp.\n\n#reveillon #makedefesta" },

  { id: "r-ritual", carrossel: "ritual", nivel: 3, nome: "Meu ritual de fim de ano", duracao: "15 segundos",
    ideia: "Três dias, três cuidados. A cliente se organiza e já reserva os horários.",
    preparar: "Imagens rápidas de unha, cabelo e make (do estúdio ou de clientes).",
    abertura: { filmar: "Um calendário de papel ou do celular, com o dedo no dia 29.", fala: "Teu ritual de fim de ano, sem correria:" },
    cenas: [
      { filmar: "Unhas sendo feitas.", texto: "Dia 29: unhas e sobrancelha" },
      { filmar: "Hidratação no cabelo, com as mãos.", texto: "Dia 30: hidratação" },
      { filmar: "Make e penteado prontos.", texto: "Dia 31: make e penteado" }
    ],
    final: { filmar: "Duas taças brindando.", texto: "Meia-noite: só brindar 🥂" },
    semAparecer: "Este roteiro já é feito com mãos e detalhes. Ninguém precisa aparecer de rosto.",
    legenda: "Teu ritual de fim de ano, sem correria 🥂\n\nDia 29: unhas e sobrancelha. Dia 30: hidratação no cabelo. Dia 31: make e penteado. Meia-noite: só brindar.\n\nMe conta o que você quer que eu organizo os horários. Chama no WhatsApp.\n\n#reveillon #ritual" },

  { id: "r-obrigada-ano", carrossel: "obrigada-ano", nivel: 3, nome: "Obrigada por este ano", duracao: "15 a 20 segundos",
    ideia: "Uma retrospectiva rápida dos trabalhos do ano, com agradecimento e agenda nova.",
    preparar: "8 a 12 fotos ou vídeos curtos de trabalhos do ano (com autorização das clientes).",
    abertura: { filmar: "Você (ou suas mãos) segurando um cartão escrito “2026”.", fala: "Obrigada por este ano." },
    cenas: [
      { filmar: "Sequência rápida de trabalhos, meio segundo cada.", texto: "Noivas" },
      { filmar: "Mais trabalhos, no mesmo ritmo.", texto: "Formandas" },
      { filmar: "Mais trabalhos, no mesmo ritmo.", texto: "Muita festa de família" }
    ],
    final: { filmar: "O cartão virando: do outro lado está escrito “2027”.", texto: "Agenda de 2027 aberta" },
    semAparecer: "Abra com o cartão na mão (só a mão aparece) e siga só com os trabalhos.",
    legenda: "Obrigada por me deixar fazer parte dos seus dias especiais 🤍\n\nNoivas, formandas, aniversariantes e muita festa de família em 2026.\n\nA agenda de 2027 já está aberta. Me chama no WhatsApp pra garantir a sua data.\n\n#obrigada #retrospectiva" }
];

/* ---------------- Stories ---------------- */
const enquete = (pergunta, a, b) => ({ tipo: "Enquete", pergunta, respostas: [a, b] });
const link = texto => ({ tipo: "Link", texto });
const caixinha = pergunta => ({ tipo: "Caixa de perguntas", pergunta });
const N = (foto, adesivo) => ({ foto, ...(adesivo ? { adesivo } : {}) });
const LINK_WA = link("Adesivo Link com o seu WhatsApp (wa.me/55…).");

const stories = [
  { id: "s-pronta-ceia", carrossel: "pronta-ceia", nivel: 1, nome: "Pronta para a ceia?", ideia: "Pergunta, antes e depois de uma cliente e os horários livres.",
    telas: [
      { ...T("st-abre", { titulo: "Pronta para a *ceia*?", apoio: "Sem correr no dia 24." }, [P.glow]), nota: N("Uma cliente pronta, de perto.") },
      { ...T("st-antes", { titulo: "Do rosto lavado à *make de ceia*", rot1: "Antes", rot2: "Depois" }, [P.servico, P.glow]), nota: N("Em cima: a cliente antes. Embaixo: a mesma cliente pronta.") },
      { ...T("st-acao", { titulo: "Ainda tenho *horários*", texto: "Dias 23 e 24/12, no estúdio ou na sua casa.", botao: "Reservar meu horário", dica: "Toque no link ↓" }, [P.makeLeve]), nota: N("Um detalhe do seu trabalho.", LINK_WA) }
    ] },
  { id: "s-tres-estilos", carrossel: "tres-estilos", nivel: 1, nome: "Qual é a sua festa?", ideia: "Enquete de festa, o estilo indicado e a caixinha para a cliente contar a dela.",
    telas: [
      { ...T("st-enquete", { pergunta: "Qual é a *sua* festa?", op1: "Almoço da firma", op2: "Jantar de Natal", dica: "Vota na enquete ↓" }, [P.makeLeve, P.glow]), nota: N("Esquerda: uma make leve. Direita: uma make com brilho.", enquete("Qual é a sua festa?", "Almoço da firma", "Jantar de Natal")) },
      { ...T("st-foto", { titulo: "Jantar pede *glow dourado*", texto: "Pele iluminada que aguenta a noite toda.", preco: "R$ 160" }, [P.glow]), nota: N("A make com brilho, de perto.") },
      { ...T("st-caixa", { titulo: "Me conta *a sua festa*", apoio: "Eu indico o estilo e passo os horários.", dica: "Escreve aqui ↓" }, [P.penteado]), nota: N("Um penteado ou outro trabalho.", caixinha("Qual festa você tem?")) }
    ] },
  { id: "s-unhas", carrossel: "unhas", nivel: 1, nome: "Qual vai ser a unha de festa?", ideia: "Enquete de cor, o gel que dura e o pedido de horário.",
    telas: [
      { ...T("st-enquete", { pergunta: "Qual vai ser a *unha de festa*?", op1: "Vermelho clássico", op2: "Nude com glitter", dica: "Vota na enquete ↓" }, [P.esmaltes, P.esmaltes], { aj: [close(2, 0.33, 0.6), close(2, 0.5, 0.6)] }), nota: N("Uma unha vermelha e uma nude com glitter (ou os vidros).", enquete("Qual vai ser a unha de festa?", "Vermelho clássico", "Nude com glitter")) },
      { ...T("st-foto", { titulo: "Esmaltação em *gel*", texto: "Aguenta a ceia, a louça e a virada.", preco: "R$ 55" }, [P.esmaltes]), nota: N("Mãos prontas, de perto.") },
      { ...T("st-acao", { titulo: "Dezembro *lota* rápido", texto: "Escolhe o dia que eu confirmo.", botao: "Garantir meu horário", dica: "Toque no link ↓" }, [P.esmaltes], { aj: [close(1.6, 0.5, 0.6)] }), nota: N("Os vidros de esmalte ou a sua bancada.", LINK_WA) }
    ] },
  { id: "s-doce-ceia", carrossel: "doce-ceia", nivel: 1, nome: "Quem leva a sobremesa?", ideia: "Pergunta com o bolo, tamanhos e preços, e a encomenda.",
    telas: [
      { ...T("st-abre", { titulo: "Quem vai levar *a sobremesa*?", apoio: "Se for você, eu ajudo." }, [P.bolo]), nota: N("O bolo inteiro, com luz de janela.") },
      { ...T("st-lista", { titulo: "*Tamanhos*", item1: "Mini · serve 6 · R$ 95", item2: "Médio · serve 12 · R$ 160", item3: "Grande · serve 20 · R$ 240", apoio: "Pedidos até 20/12." }), nota: N("Esta tela não usa foto. Confira tamanhos, preços e prazo.") },
      { ...T("st-acao", { titulo: "Garanta o seu *bolo de Natal*", texto: "Retirada em 23 e 24/12.", botao: "Encomendar", dica: "Toque no link ↓" }, [P.bolo], { aj: [close(2, 0.5, 0.45)] }), nota: N("O recheio de perto.", LINK_WA) }
    ] },
  { id: "s-mesa-posta", carrossel: "mesa-posta", nivel: 1, nome: "Sua mesa de Natal é…", ideia: "Enquete de estilo, uma dica de decoração e o orçamento.",
    telas: [
      { ...T("st-enquete", { pergunta: "Sua mesa de Natal é…", op1: "Clássica", op2: "Moderna", dica: "Vota na enquete ↓" }, [P.flores, P.luzes]), nota: N("Duas mesas ou dois arranjos com estilos diferentes.", enquete("Sua mesa de Natal é…", "Clássica", "Moderna")) },
      { ...T("st-foto", { titulo: "O segredo é o *centro baixo*", texto: "Flores e velas na altura certa: ninguém perde a conversa." }, [P.luzes]), nota: N("O centro de uma mesa que você montou.") },
      { ...T("st-acao", { titulo: "Quer a mesa *pronta* no dia 24?", texto: "Monto no dia e retiro no dia seguinte.", botao: "Pedir orçamento", dica: "Toque no link ↓" }, [P.flores]), nota: N("Um detalhe da decoração.", LINK_WA) }
    ] },
  { id: "s-producao-virada", carrossel: "producao-virada", nivel: 3, nome: "Já sabe como vai virar?", ideia: "Pergunta, a produção completa e a agenda do dia 31.",
    telas: [
      { ...T("st-texto", { titulo: "Já sabe *como vai virar*?", apoio: "Make e penteado no mesmo horário →" }), nota: N("Esta tela não usa foto.") },
      { ...T("st-foto", { titulo: "Produção *completa*", texto: "Make glow + penteado, com fixação para calor e praia.", preco: "R$ 260" }, [P.glow]), nota: N("Um trabalho com brilho, de perto.") },
      { ...T("st-acao", { titulo: "Agenda do *dia 31*", texto: "Das 9h às 18h. Restam poucos horários.", botao: "Quero meu horário", dica: "Toque no link ↓" }, [P.penteado]), nota: N("Um penteado de festa.", LINK_WA) }
    ] },
  { id: "s-ritual", carrossel: "ritual", nivel: 3, nome: "Você se arruma com calma?", ideia: "Enquete, o ritual dia a dia e a caixinha para montar o da cliente.",
    telas: [
      { ...T("st-enquete", { pergunta: "Você se arruma pra virada…", op1: "Com calma", op2: "Na correria", dica: "Vota na enquete ↓" }, [P.esmaltes, P.makeLeve]), nota: N("Duas fotos do seu trabalho.", enquete("Você se arruma pra virada…", "Com calma", "Na correria")) },
      { ...T("st-lista", { titulo: "Seu *ritual*", item1: "Dia 29: unhas e sobrancelha", item2: "Dia 30: hidratação no cabelo", item3: "Dia 31: make e penteado", apoio: "Meia-noite: só brindar." }), nota: N("Esta tela não usa foto. Ajuste aos seus serviços.") },
      { ...T("st-caixa", { titulo: "O que *falta* no seu ritual?", apoio: "Me conta que eu organizo os horários.", dica: "Responde aqui ↓" }, [P.makeLeve]), nota: N("Um detalhe do seu trabalho.", caixinha("O que falta no seu ritual?")) }
    ] },
  { id: "s-obrigada-ano", carrossel: "obrigada-ano", nivel: 3, nome: "Obrigada por este ano", ideia: "Agradecimento, os trabalhos do ano e a agenda nova.",
    telas: [
      { ...T("st-abre", { titulo: "Obrigada por *este ano*", apoio: "Cada cliente, uma festa." }, [P.glow]), nota: N("Seu trabalho favorito do ano.") },
      { ...T("st-foto", { titulo: "Produções de *2026*", texto: "Noivas, formandas e muita festa de família." }, [P.penteado]), nota: N("Outro trabalho marcante do ano.") },
      { ...T("st-acao", { titulo: "Agenda de *2027* aberta", texto: "Já estou marcando noivas e formaturas.", botao: "Garantir minha data", dica: "Toque no link ↓" }, [P.servico]), nota: N("Você trabalhando, ou o seu material.", LINK_WA) }
    ] }
];

/* ---------------- calendários ---------------- */
const C = (ref, preparar) => ({ f: "carrossel", ref, preparar });
const R = (ref, preparar) => ({ f: "reel", ref, preparar });
const S = (ref, preparar) => ({ f: "stories", ref, preparar });
const W = (ref, preparar) => ({ f: "whatsapp", ref, preparar });
const d = (dia, ...itens) => ({ dia, itens });

const calendario = {
  dica: "Publique o feed entre 11h e 13h ou entre 18h e 20h. Stories podem sair ao longo do dia. A mensagem “Resposta a quem pergunta o preço” serve para qualquer dia. Use os carrosséis do seu serviço: maquiagem, unhas, doces ou decoração.",
  dez: [
    d(1, C("pronta-ceia", "Separe a foto de uma make de festa pronta e uma da pele de perto, e troque no carrossel."), S("s-pronta-ceia", "Uma foto de antes e uma de depois da mesma cliente.")),
    d(2, R("r-pronta-ceia", "Uma cliente com autorização para filmar e o celular apoiado.")),
    d(3, C("tres-estilos", "Fotos de 3 trabalhos com estilos diferentes."), S("s-tres-estilos", "As mesmas fotos do carrossel.")),
    d(4, R("r-tres-estilos", "Os 3 trabalhos em vídeo curto ou foto."), W("w-vale", "Envie para 10 clientes que já atendeu.")),
    d(5, C("unhas", "Foto das unhas antes e depois e das cores da temporada.")),
    d(6, R("r-unhas", "As mãos da cliente antes e depois."), S("s-unhas", "Fotos das unhas prontas.")),
    d(7, C("doce-ceia", "O bolo inteiro, o recheio de perto e os tamanhos."), S("s-doce-ceia", "Confira tamanhos, preços e prazo.")),
    d(8, R("r-doce-ceia", "Um bolo pronto e a câmera lenta ligada.")),
    d(9, C("mesa-posta", "Fotos de uma mesa montada por você."), S("s-mesa-posta", "Duas mesas ou arranjos diferentes."), W("w-datas", "Envie para quem perguntou e não marcou.")),
    d(10, R("r-mesa-posta", "A mesa vazia e tudo o que vai nela."))
  ],
  expressa: [
    d(1, C("pronta-ceia", "Separe a foto de uma make de festa pronta e uma da pele de perto, e troque no carrossel."), S("s-pronta-ceia", "Antes e depois da mesma cliente.")),
    d(2, R("r-pronta-ceia", "Uma cliente com autorização para filmar."), W("w-vale", "Envie para clientes que já atendeu.")),
    d(3, C("tres-estilos", "Fotos de 3 trabalhos diferentes."), S("s-tres-estilos", "As mesmas fotos."), W("w-datas", "Envie para quem perguntou e não marcou."))
  ],
  quinze: [
    d(1, C("pronta-ceia", "Separe a foto de uma make de festa pronta e uma da pele de perto, e troque no carrossel."), S("s-pronta-ceia", "Antes e depois da mesma cliente.")),
    d(2, R("r-pronta-ceia", "Uma cliente com autorização para filmar.")),
    d(3, C("tres-estilos", "Fotos de 3 trabalhos com estilos diferentes."), S("s-tres-estilos", "As mesmas fotos do carrossel.")),
    d(4, R("r-tres-estilos", "Os 3 trabalhos em vídeo curto ou foto."), W("w-vale", "Envie para 10 clientes que já atendeu.")),
    d(5, C("dura", "Duas fotos que mostrem a pele preparada e a make pronta.")),
    d(6, R("r-dura", "A mesma cliente no começo e no fim da festa.")),
    d(7, C("unhas", "Unhas antes e depois e as cores da temporada."), S("s-unhas", "Fotos das unhas prontas.")),
    d(8, R("r-unhas", "As mãos da cliente antes e depois.")),
    d(9, C("detalhe", "Uma frase de cliente e fotos do vestido e da make.")),
    d(10, R("r-detalhe", "Um print do look (com autorização) e o resultado.")),
    d(11, C("doce-ceia", "O bolo inteiro, o recheio e os tamanhos."), S("s-doce-ceia", "Confira tamanhos, preços e prazo.")),
    d(12, R("r-doce-ceia", "Um bolo pronto e a câmera lenta ligada.")),
    d(13, C("imprevisto", "Fotos de um atendimento com imprevisto: antes, solução e resultado."), R("r-imprevisto", "As mesmas imagens. Publique à noite.")),
    d(14, C("mesa-posta", "Fotos de uma mesa montada por você."), S("s-mesa-posta", "Duas mesas ou arranjos."), W("w-datas", "Envie para quem perguntou e não marcou.")),
    d(15, R("r-mesa-posta", "A mesa vazia e tudo o que vai nela."))
  ],
  reveillon: [
    d(1, C("producao-virada", "Um trabalho com brilho e o preço da produção completa."), S("s-producao-virada", "Fotos de make e penteado de festa.")),
    d(2, R("r-producao-virada", "Um trabalho com brilho e confete para a abertura.")),
    d(3, C("ritual", "Seus horários de 29, 30 e 31/12."), S("s-ritual", "Ajuste o ritual aos seus serviços."), R("r-ritual", "Imagens de unha, cabelo e make. Publique à noite.")),
    d(4, C("obrigada-ano", "3 trabalhos marcantes do ano e mais 4 para a grade."), S("s-obrigada-ano", "Seu trabalho favorito do ano.")),
    d(5, R("r-obrigada-ano", "8 a 12 fotos ou vídeos do ano e um cartão com “2026” e “2027”."))
  ]
};

export default {
  id: "seu-toque-nas-festas",
  nome: "Seu toque nas festas",
  resumo: "Mostre como o seu serviço entra nas comemorações de fim de ano, com trabalhos reais, bastidores e chamadas para o WhatsApp.",
  reels, stories, calendario,
  whatsapp: [
    { id: "w-preco", titulo: "Resposta a quem pergunta o preço", quando: "Quando alguém pergunta “quanto custa?”.",
      texto: "Oi, [nome]! Tudo bem? 😊 O [serviço] sai por R$ [preço] e leva cerca de [duração]. Para as festas de fim de ano, tenho [dias disponíveis]. Quer que eu reserve um horário pra você?" },
    { id: "w-vale", titulo: "Sugestão de vale-presente", quando: "Para clientes que você já atendeu. Envie uma por uma, não em grupo.",
      texto: "Oi, [nome]! Aqui é a [seu nome] 🎁 Este ano estou com vale-presente de Natal: dá pra presentear a mãe, uma amiga ou quem você quiser com [serviço]. Quer que eu te mande os valores?" },
    { id: "w-datas", titulo: "Aviso de últimas datas", quando: "Nos últimos dias antes do Natal.",
      texto: "Oi, [nome]! Passando pra avisar: restam poucas datas antes do Natal ([datas]) 🎄 Se você tem festa chegando, me chama que eu vejo o melhor horário pra você." }
  ],
  tutorial: [
    { titulo: "Siga o calendário", texto: "Abra o Calendário, veja o dia e toque em “Abrir”: o material certo abre na hora. Em “Preparar” está o que você precisa ter em mãos." },
    { titulo: "Fotografe com luz de janela", texto: "Trabalho no centro, fundo limpo, celular na vertical. Peça autorização à cliente antes de mostrar o rosto dela." },
    { titulo: "Troque foto, texto e preço", texto: "No editor, toque na tela, troque a foto pela sua e ajuste o zoom e a posição. Na aba Textos, mude preços e nomes. Na aba Marca, coloque o seu nome ou logo: vale para tudo." },
    { titulo: "Baixe e publique", texto: "Carrosséis saem em 4 imagens de 1080 × 1350 e Stories em 3 imagens de 1080 × 1920, já numeradas. No iPhone, use “Compartilhar imagens” e “Salvar imagens”. No carrossel, cole a legenda com “Copiar legenda”." },
    { titulo: "Stories com adesivo", texto: "Quando a tela pede enquete, link ou caixinha, a pergunta e as respostas estão ao lado, prontas para copiar. Coloque o adesivo no Instagram, no espaço livre com a seta." },
    { titulo: "Grave o Reel pelo roteiro", texto: "“Para gravar” diz o que filmar em cada cena. “Para copiar” traz os textos da tela e a legenda. Não quer aparecer? Siga “Sem aparecer”: só mãos, trabalho ou texto na tela." }
  ]
};
