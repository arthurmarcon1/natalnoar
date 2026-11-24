/* Memórias de dezembro (fotógrafas, videomakers, artesãs, lembranças personalizadas).
   Exemplo principal: Ana Luz Fotografia. Outros: Ateliê Fio (artesã) e Marcos Filma (videomaker). */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "memorias-de-dezembro", marca: "Ana Luz Fotografia", previa: "nasce-ensaio",
  carrosseis: [
    { id: "nasce-ensaio", nivel: 1, nome: "Como nasce um ensaio de Natal", paraQuem: "Fotógrafas", ideia: "Três fotos em polaroide na capa. Depois: a ideia, a escolha de composição e o resultado.",
      telas: [
        T("capa-polaroides", { titulo: "Como nasce *um ensaio* de Natal", apoio: "Da ideia à foto" }, [P.polaroides, P.luzes, P.camera]),
        T("int-passo", { num: "1", titulo: "A ideia", texto: "Fotografar a família montando a árvore, em vez de posando na frente dela." }, [P.luzes]),
        T("int-detalhe", { titulo: "A composição", texto: "Enquadrei pelas luzinhas, *desfocadas na frente*, como quem espia a cena." }, [P.luzes], { aj: [close(2, 0.5, 0.42)] }),
        T("int-resultado", { titulo: "O resultado", texto: "Uma foto que *parece memória*, não ensaio." }, [P.polaroides])
      ],
      legenda: "Como nasce um ensaio de Natal 🎄\n\n{2.titulo}: {2.texto}\n{3.titulo}: enquadrei pelas luzinhas desfocadas, como quem espia a cena.\n\n{4.titulo}: uma foto que parece memória, não ensaio. Me chama no WhatsApp para o seu. {marca}\n\n#ensaiodenatal #fotografia" },
    { id: "mini-ensaio", nivel: 1, nome: "Mini ensaio de Natal", paraQuem: "Fotógrafas", ideia: "Foto inteira na capa. Depois: o que inclui, os formatos com preço e as datas.",
      telas: [
        T("capa-foto", { titulo: "Mini ensaio de *Natal*", apoio: "20 minutos, 15 fotos, uma lembrança" }, [P.polaroides]),
        T("int-lista", { titulo: "Inclui", item1: "20 minutos de ensaio no estúdio", item2: "Cenário de Natal montado", item3: "15 fotos editadas", item4: "Galeria online em 7 dias" }),
        T("int-opcoes", { titulo: "*Formatos*", op1: "Família", preco1: "R$ 290", op2: "Casal", preco2: "R$ 250", op3: "Pet com tutor", preco3: "R$ 220" }, [P.polaroides, P.luzes, P.camera]),
        T("int-prazo", { titulo: "Datas", rot1: "Ensaios aos sábados até", data1: "20/12", rot2: "Fotos antes do Natal para quem fotografar até", data2: "14/12", nota: "Vagas limitadas por dia." })
      ],
      legenda: "Mini ensaio de Natal: {1.apoio.lower} 📸\n\n{3.op1}: {3.preco1}\n{3.op2}: {3.preco2}\n{3.op3}: {3.preco3}\n\nEnsaios aos sábados até {4.data1}. Vagas limitadas: me chama no WhatsApp. {marca}\n\n#miniensaio #natal" },
    { id: "edicao", nivel: 1, nome: "O que a edição faz", paraQuem: "Fotógrafas", ideia: "Capa antes e depois. Depois: a cor, a limpeza do fundo e a chamada.",
      telas: [
        T("capa-antes", { titulo: "O que a *edição* faz por uma foto", rot1: "Original", rot2: "Editada" }, [P.polaroides, P.polaroides], { aj: [close(1.2, 0.4, 0.5), close(1.2, 0.4, 0.5)] }),
        T("int-detalhe", { titulo: "A cor", texto: "Esquento a luz das velas e *mantenho a pele natural*." }, [P.luzes]),
        T("int-comparar", { rot1: "Antes", rot2: "Depois", texto: "Tiro distrações do fundo e *deixo o olhar no que importa*." }, [P.camera, P.polaroides]),
        T("int-cta", { titulo: "Quer fotos *assim*?", texto: "Mini ensaios de Natal até o dia 20.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "O que a edição faz por uma foto ✨\n\n{2.titulo}: {2.texto}\nO fundo: tiro distrações e deixo o olhar no que importa.\n\nQuer fotos assim? Mini ensaios de Natal até o dia 20, pelo WhatsApp. {marca}\n\n#edicao #fotografia" },
    { id: "feita-a-mao", nivel: 1, nome: "Lembrança feita à mão", marca: "Ateliê Fio", paraQuem: "Artesãs e lembranças personalizadas", ideia: "Foto em arco na capa. Depois: o pedido, o bordado e as informações.",
      telas: [
        T("capa-arco", { titulo: "Lembrança *feita à mão*", apoio: "Enfeites bordados com o nome da família" }, [P.flores]),
        T("int-passo", { num: "1", titulo: "O pedido", texto: "Você manda os nomes da família e as cores da sua árvore." }, [P.caderno]),
        T("int-passo", { num: "2", titulo: "O bordado", texto: "Cada enfeite leva duas horas de bordado à mão." }, [P.flores], { aj: [close(1.8)] }),
        T("int-info", { titulo: "Enfeite bordado", linha1: "R$ 45 cada · R$ 160 o kit com 4", linha2: "Pedidos até 15/12", linha3: "Envio para todo o Brasil", cta: "Encomende pelo direct" })
      ],
      legenda: "Um enfeite com o nome de cada pessoa da família 🧵\n\n{2.texto} {3.texto}\n\n{4.linha1}. {4.linha2}. {4.linha3}. Encomende pelo direct. {marca}\n\n#feitoamao #enfeitedenatal" },
    { id: "guardar", nivel: 1, nome: "O que guardar de dezembro", paraQuem: "Fotógrafas, artesãs e álbuns", ideia: "Capa com as memórias em etiquetas. Depois: ideias simples, a dica da caixa e a chamada.",
      telas: [
        T("capa-lista", { titulo: "O que guardar de *dezembro*", itens: "Fotos · Cartas · Receitas · Vídeos", apoio: "Ideias para não perder as memórias" }, [P.caderno]),
        T("int-lista", { titulo: "Ideias *simples*", item1: "Imprima 10 fotos do ano", item2: "Peça para cada um escrever um bilhete", item3: "Anote a receita da ceia com a letra da avó", item4: "Grave um vídeo curto da mesa posta" }),
        T("int-detalhe", { titulo: "Dica", texto: "Uma *caixa de memórias* por ano, com etiqueta e data." }, [P.presentes]),
        T("int-cta", { titulo: "Quer ajuda para *guardar*?", texto: "Monto álbuns e caixas personalizadas.", contato: "Chama no WhatsApp" }, [P.polaroides])
      ],
      legenda: "O que guardar deste dezembro? 📦\n\n• {2.item1}\n• {2.item2}\n• {2.item3}\n• {2.item4}\n\nDica: {3.texto.plain}\n\nQuer ajuda? Monto álbuns e caixas personalizadas. Chama no WhatsApp. {marca}\n\n#memorias #dezembro" },
    { id: "imprimir", nivel: 2, nome: "Vale a pena imprimir?", paraQuem: "Fotógrafas", ideia: "Capa em quadro de filme. Depois: a resposta em frase, celular contra impressa e os formatos.",
      telas: [
        T("capa-filme", { titulo: "Vale a pena *imprimir* as fotos?", apoio: "A dúvida que mais escuto" }, [P.polaroides]),
        T("int-frase", { frase: "Foto no celular *se perde*. Foto impressa *se mostra*.", autor: "{marca}" }, [], { inv: true }),
        T("int-comparar", { rot1: "No celular", rot2: "Impressa", texto: "Uma vira arquivo; a outra vira *conversa na sala*." }, [P.camera, P.polaroides]),
        T("int-opcoes", { titulo: "Formatos de *impressão*", op1: "10 fotos 15 × 21", preco1: "R$ 60", op2: "Álbum de 20 páginas", preco2: "R$ 220", op3: "Quadro 40 × 60", preco3: "R$ 180" }, [P.polaroides, P.caderno, P.luzes])
      ],
      legenda: "Vale a pena imprimir as fotos? Vale 🖼️\n\nFoto no celular se perde. Foto impressa se mostra e vira conversa na sala.\n\n{4.op1}: {4.preco1}\n{4.op2}: {4.preco2}\n{4.op3}: {4.preco3}\n\nPeça pelo WhatsApp. {marca}\n\n#fotoimpressa #memorias" },
    { id: "percebeu", nivel: 2, nome: "Como escolho cada detalhe", paraQuem: "Fotógrafas", ideia: "Capa com depoimento. Depois: o lugar, o momento e o convite.",
      telas: [
        T("capa-citacao", { citacao: "“Ela percebeu o que *nem eu tinha percebido* na minha família.”", autor: "Cliente do ensaio de Natal" }, [P.polaroides]),
        T("int-detalhe", { titulo: "O lugar", texto: "Prefiro a casa da família: *os objetos contam a história*." }, [P.luzes]),
        T("int-detalhe", { titulo: "O momento", texto: "Fotografo os intervalos, quando ninguém está *posando*." }, [P.polaroides], { aj: [close(1.7)] }),
        T("int-cta", { titulo: "Vamos *conversar*?", texto: "Conte a sua ideia e eu monto o ensaio.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "{1.citacao}\n\nComo eu escolho cada detalhe:\n{2.titulo}: prefiro a casa da família, os objetos contam a história.\n{3.titulo}: fotografo os intervalos, quando ninguém está posando.\n\nVamos conversar? Me chama no WhatsApp. {marca}\n\n#fotografia #bastidores" },
    { id: "um-minuto", nivel: 2, nome: "Um Natal em 60 segundos", marca: "Marcos Filma", paraQuem: "Videomakers", ideia: "Número grande na capa com a câmera como elemento. Depois: o roteiro, a captação e o filme.",
      telas: [
        T("capa-numero", { titulo: "Um Natal em", valor: "60 s", rodape: "Vídeo de família" }, [P.camera]),
        T("int-passo", { num: "1", titulo: "O roteiro", texto: "Combinamos as cenas: a chegada, a mesa, o abraço da meia-noite." }, [P.camera]),
        T("int-passo", { num: "2", titulo: "A captação", texto: "Duas horas de filmagem sem interromper a festa." }, [P.luzes]),
        T("int-resultado", { titulo: "O filme", texto: "Um minuto que a família *assiste todo ano*." }, [P.polaroides])
      ],
      legenda: "Um Natal inteiro em {1.valor} 🎬\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\n{4.titulo}: um minuto que a família assiste todo ano. Datas de dezembro no WhatsApp. {marca}\n\n#videodefamilia #natal" },
    { id: "memorias-ano", nivel: 3, nome: "Memórias do ano", paraQuem: "Fotógrafas e videomakers", ideia: "Ano em destaque com três fotos. Depois: grade de momentos, uma frase e a agenda.",
      telas: [
        T("capa-ano", { titulo: "Memórias de *2026*", ano: "2026", apoio: "Os ensaios que mais me marcaram" }, [P.polaroides, P.luzes, P.flores]),
        T("int-grade", { titulo: "Alguns *momentos*", texto: "Natal, aniversários, casamentos e um pedido de noivado surpresa." }, [P.polaroides, P.luzes, P.flores, P.bolo]),
        T("int-frase", { frase: "Obrigada por me deixar *guardar* as suas histórias.", autor: "{marca}" }),
        T("int-cta", { titulo: "Agenda de *2027*", texto: "Ensaios de verão a partir de janeiro.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "Memórias de {1.ano} 🎞️\n\n{2.texto}\n\nObrigada por me deixar guardar as suas histórias. Ensaios de verão a partir de janeiro, pelo WhatsApp. {marca}\n\n#retrospectiva #fotografia" },
    { id: "primeira-foto", nivel: 3, nome: "A primeira foto do ano", paraQuem: "Fotógrafas", ideia: "Calendário em 1º de janeiro. Depois: ideias de foto, datas e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "A primeira foto *do ano*", dia: "01", mes: "JAN", apoio: "Ensaios de Ano-Novo" }),
        T("int-lista", { titulo: "Ideias para *1º de janeiro*", item1: "Família de branco no café da manhã", item2: "Casal na praia ao nascer do sol", item3: "Crianças com a lista de desejos", item4: "Pet de laço no primeiro passeio" }),
        T("int-prazo", { titulo: "Datas", rot1: "Reservas até", data1: "28/12", rot2: "Ensaios a partir de", data2: "02/01", nota: "Ensaio externo no horário de luz suave." }),
        T("int-cta", { titulo: "Reserve a *sua*", texto: "Poucas vagas para a primeira semana do ano.", contato: "Chama no WhatsApp" }, [P.camera])
      ],
      legenda: "Qual vai ser a primeira foto do seu ano? 📷\n\n• {2.item1}\n• {2.item2}\n• {2.item3}\n• {2.item4}\n\nReservas até {3.data1}, ensaios a partir de {3.data2}. Chama no WhatsApp. {marca}\n\n#anonovo #ensaio" },
    { id: "moldura", nivel: 3, nome: "Memórias que merecem moldura", paraQuem: "Fotógrafas e artesãs", ideia: "Capa tipográfica escura. Depois: a favorita do ano, um desejo e o até logo.",
      telas: [
        T("capa-tipo", { titulo: "Algumas memórias *merecem* moldura.", apoio: "Obrigada por 2026" }),
        T("int-resultado", { titulo: "Favorita do ano", texto: "Esta foto quase não aconteceu: *a chuva parou* por cinco minutos." }, [P.polaroides]),
        T("int-frase", { frase: "Que 2027 tenha *muita coisa* para lembrar.", autor: "{marca}" }, [], { inv: true }),
        T("int-cta", { titulo: "Até *logo*", texto: "Volto das férias dia 5 de janeiro.", contato: "Siga {marca}" }, [P.camera])
      ],
      legenda: "Algumas memórias merecem moldura 🖼️\n\nMinha favorita do ano quase não aconteceu: a chuva parou por cinco minutos.\n\nQue 2027 tenha muita coisa para lembrar. Volto das férias dia 5. Para garantir data em janeiro, me chama no WhatsApp. {marca}\n\n#gratidao #fotografia" }
  ]
};
