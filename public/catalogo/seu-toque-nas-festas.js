/* Seu toque nas festas (maquiadoras, cabeleireiras, manicures, confeiteiras, decoradoras).
   Exemplo principal: Bia Make. Outros carrosséis usam Nina Nails, Doce Clara e Casa Lumi. */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "seu-toque-nas-festas", marca: "Bia Make", previa: "tres-estilos",
  carrosseis: [
    { id: "pronta-ceia", nivel: 1, nome: "Pronta para a ceia", paraQuem: "Maquiadoras", ideia: "Foto em oval na capa. Depois: o detalhe da pele, o que inclui e como reservar.",
      telas: [
        T("capa-arco", { titulo: "Pronta para a *ceia*", apoio: "Make para o Natal em família" }, [P.glow]),
        T("int-detalhe", { titulo: "A pele", texto: "Preparação com hidratação e *pó só onde precisa*: dura até a sobremesa." }, [P.glow], { aj: [close(2, 0.5, 0.45)] }),
        T("int-uso", { titulo: "Inclui", passo1: "Preparação de pele e make completa", passo2: "Cílios em tufos, se você quiser", passo3: "Batom de retoque para levar na bolsa" }, [P.makeLeve]),
        T("int-info", { titulo: "Make de ceia", linha1: "R$ 160 · cerca de 1 hora", linha2: "No estúdio ou na sua casa (com taxa)", linha3: "Dias 23 e 24/12 com horário marcado", cta: "Reserve pelo WhatsApp" })
      ],
      legenda: "Pronta para a ceia, sem correr no dia 24 ✨\n\n{2.texto}\n\n{4.titulo}: {4.linha1}. {4.linha3}. Reserve o seu horário pelo WhatsApp. {marca}\n\n#makedenatal #maquiagem" },
    { id: "tres-estilos", nivel: 1, nome: "3 estilos para as festas", paraQuem: "Maquiadoras e cabeleireiras", ideia: "Capa tipográfica em ameixa: o 3 gigante, “estilos para as festas” e a sua assinatura. Cada tela liga um serviço a uma festa.",
      telas: [
        T("capa-numeral", { numero: "3", titulo: "estilos\npara\n*as festas*", itens: "Make leve · Glow dourado · Penteado", assina: "por" }, [], { inv: true }),
        T("int-estilo", { estilo: "Para o *almoço* da firma", nome: "Make leve", preco: "R$ 120" }, [P.makeLeve]),
        T("int-estilo", { estilo: "Para o *jantar* de Natal", nome: "Glow dourado", preco: "R$ 160" }, [P.glow]),
        T("int-estilo", { estilo: "Para a *confra*", nome: "Penteado de festa", preco: "R$ 140" }, [P.penteado])
      ],
      legenda: "Cada festa pede um toque diferente 💫\n\nAlmoço da firma: {2.nome} ({2.preco}).\nJantar de Natal: {3.nome} ({3.preco}).\nConfra: {4.nome} ({4.preco}).\n\nQual combina com a sua? Me chama no WhatsApp para reservar. {marca}\n\n#maquiagem #festas" },
    { id: "unhas", nivel: 1, nome: "Unhas de festa", marca: "Nina Nails", paraQuem: "Manicures e nail designers", ideia: "Capa antes e depois. Depois: cores da temporada, durabilidade e a chamada.",
      telas: [
        T("capa-antes", { titulo: "Da unha do dia a dia à unha *de festa*", rot1: "Antes", rot2: "Depois" }, [P.esmaltes, P.esmaltes], { aj: [close(1.2, 0.3, 0.6), close(1.4, 0.7, 0.6)] }),
        T("int-opcoes", { titulo: "Cores da *temporada*", op1: "Vermelho clássico", preco1: "R$ 45", op2: "Nude com glitter", preco2: "R$ 55", op3: "Francesinha dourada", preco3: "R$ 60" }, [P.esmaltes, P.esmaltes, P.esmaltes], { aj: [close(2, 0.33, 0.6), close(2, 0.5, 0.6), close(2, 0.67, 0.6)] }),
        T("int-detalhe", { titulo: "Durabilidade", texto: "Esmaltação em gel que *aguenta a ceia, a louça e a virada*." }, [P.esmaltes], { aj: [close(2.4, 0.33, 0.6)] }),
        T("int-cta", { titulo: "Garanta seu *horário*", texto: "Dezembro lota rápido. Escolha o dia e eu confirmo.", contato: "Chama no WhatsApp" }, [P.esmaltes])
      ],
      legenda: "Unha de festa que dura até o Ano-Novo 💅\n\n{2.op1}: {2.preco1}\n{2.op2}: {2.preco2}\n{2.op3}: {2.preco3}\n\n{3.texto} Dezembro lota rápido: escolha o seu dia pelo WhatsApp. {marca}\n\n#unhasdefesta #manicure" },
    { id: "doce-ceia", nivel: 1, nome: "O doce que fecha a ceia", marca: "Doce Clara", paraQuem: "Confeiteiras", ideia: "Foto inteira na capa. Depois: o recheio de perto, os tamanhos e os prazos de encomenda.",
      telas: [
        T("capa-foto", { titulo: "O doce que *fecha a ceia*", apoio: "Encomendas de Natal abertas" }, [P.bolo]),
        T("int-detalhe", { titulo: "O recheio", texto: "Massa de nozes, brigadeiro branco e *frutas vermelhas* frescas." }, [P.bolo], { aj: [close(2, 0.5, 0.45)] }),
        T("int-opcoes", { titulo: "*Tamanhos*", op1: "Mini · serve 6", preco1: "R$ 95", op2: "Médio · serve 12", preco2: "R$ 160", op3: "Grande · serve 20", preco3: "R$ 240" }, [P.bolo, P.bolo, P.bolo], { aj: [close(2.2), close(1.5), close(1)] }),
        T("int-prazo", { titulo: "Encomendas", rot1: "Pedidos até", data1: "20/12", rot2: "Retirada em", data2: "23 e 24/12", nota: "Entrega no bairro com taxa combinada." })
      ],
      legenda: "O doce que fecha a ceia já tem encomendas abertas 🎂\n\n{2.texto}\n\n{3.op1}: {3.preco1}\n{3.op2}: {3.preco2}\n{3.op3}: {3.preco3}\n\nPedidos até {4.data1}. Me chama no WhatsApp. {marca}\n\n#bolodenatal #confeitaria" },
    { id: "mesa-posta", nivel: 1, nome: "Mesa com o seu toque", marca: "Casa Lumi", paraQuem: "Decoradoras", ideia: "Duas fotos e um “+” na capa. Depois: a base, o centro da mesa e o serviço.",
      telas: [
        T("capa-dupla", { titulo: "Mesa de Natal com *o seu toque*", apoio: "Decoração para receber em casa" }, [P.flores, P.luzes]),
        T("int-passo", { num: "1", titulo: "A base", texto: "Toalha clara e um caminho de mesa em linho." }, [P.flores]),
        T("int-passo", { num: "2", titulo: "O centro", texto: "Arranjo baixo com flores e velas, para ninguém perder a conversa." }, [P.luzes]),
        T("int-info", { titulo: "Decoração da ceia", linha1: "A partir de R$ 350 para 8 pessoas", linha2: "Montagem no dia, retirada no dia seguinte", linha3: "Peças de aluguel inclusas", cta: "Peça seu orçamento" })
      ],
      legenda: "Sua mesa de Natal com cara de revista, sem você correr 🕯️\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\n{4.linha1}. {4.linha2}. Peça seu orçamento no WhatsApp. {marca}\n\n#mesaposta #decoracao" },
    { id: "dura", nivel: 2, nome: "Uma dúvida que sempre me fazem", paraQuem: "Maquiadoras", ideia: "Capa tipográfica com a pergunta. Depois: dois motivos numerados e a resposta curta.",
      telas: [
        T("capa-tipo", { titulo: "Make *dura* a noite toda?", apoio: "A dúvida que mais recebo em dezembro" }, [], { inv: true }),
        T("int-passo", { num: "1", titulo: "Pele preparada", texto: "Hidratação e primer certos para o seu tipo de pele seguram tudo." }, [P.makeLeve]),
        T("int-passo", { num: "2", titulo: "Camadas finas", texto: "Pouco produto em várias camadas dura mais que uma camada grossa." }, [P.glow]),
        T("int-frase", { frase: "Resposta curta: *dura, sim*. Com a preparação certa.", autor: "{marca}" })
      ],
      legenda: "{1.titulo.plain}\n\nEssa é a dúvida que mais recebo em dezembro. Dura, sim, com dois cuidados:\n1. {2.titulo}\n2. {3.titulo}\n\nQuer a sua make de festa? Me chama no WhatsApp. {marca}\n\n#maquiagem #duvidas" },
    { id: "detalhe", nivel: 2, nome: "Como escolho cada detalhe", paraQuem: "Maquiadoras", ideia: "Capa com depoimento. Depois: o vestido, a luz da festa e o pedido da foto do look.",
      telas: [
        T("capa-citacao", { citacao: "“Ela olhou meu vestido e *escolheu a make em dois minutos*.”", autor: "Carla, cliente de dezembro" }, [P.glow]),
        T("int-detalhe", { titulo: "O vestido", texto: "A cor e o decote dizem *onde ir de batom* e onde ir de olho." }, [P.servico]),
        T("int-detalhe", { titulo: "A luz da festa", texto: "Festa à noite pede *mais iluminador*; almoço pede pele fresca." }, [P.glow], { aj: [close(1.8)] }),
        T("int-cta", { titulo: "Me manda a *foto do look*", texto: "Com ela eu já sugiro a make antes do dia.", contato: "Chama no WhatsApp" }, [P.makeLeve])
      ],
      legenda: "Como eu escolho a sua make? Olhando o que você vai usar 👗\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\nMe manda a foto do look no WhatsApp que eu já sugiro a make antes do dia. {marca}\n\n#maquiagem #bastidores" },
    { id: "imprevisto", nivel: 2, nome: "A história por trás de um trabalho", paraQuem: "Cabeleireiras e maquiadoras", ideia: "Três fotos na capa. Depois: o imprevisto, a solução e o resultado.",
      telas: [
        T("capa-polaroides", { titulo: "A história de *uma produção*", apoio: "Formatura, Natal e um imprevisto" }, [P.penteado, P.glow, P.makeLeve]),
        T("int-passo", { num: "1", titulo: "O imprevisto", texto: "A cliente chegou com o cabelo molhado da chuva, 40 minutos antes da festa." }, [P.penteado]),
        T("int-passo", { num: "2", titulo: "A solução", texto: "Trocamos o cabelo solto por um coque baixo, mais rápido e firme." }, [P.pente]),
        T("int-resultado", { titulo: "O resultado", texto: "Ela chegou *no horário* e ninguém soube da chuva." }, [P.penteado])
      ],
      legenda: "Uma produção, uma chuva e 40 minutos ⏱️\n\n{2.texto}\n{3.texto}\n\n{4.texto}\n\nÉ para isso que existe profissional. Agenda de festas no WhatsApp. {marca}\n\n#bastidores #penteado" },
    { id: "producao-virada", nivel: 3, nome: "Produção para a virada", paraQuem: "Maquiadoras e cabeleireiras", ideia: "Foto com etiqueta de preço. Depois: o que inclui, como dura a noite e a agenda do dia 31.",
      telas: [
        T("capa-etiqueta", { titulo: "Produção completa para a *virada*", preco: "R$ 260", apoio: "Make e penteado no mesmo horário" }, [P.glow]),
        T("int-dois", { titulo: "Inclui", nome1: "Make glow", preco1: "R$ 160", nome2: "Penteado", preco2: "R$ 140" }, [P.glow, P.penteado]),
        T("int-uso", { titulo: "Para a noite toda", passo1: "Fixação reforçada para calor e praia", passo2: "Kit retoque com batom e lenço", passo3: "Foto do resultado para você postar" }, [P.glow]),
        T("int-cta", { titulo: "Agenda do *dia 31*", texto: "Atendo das 9h às 18h. Restam poucos horários.", contato: "Chama no WhatsApp" }, [P.penteado])
      ],
      legenda: "Produção completa para a virada: {1.preco} 🎆\n\n{2.nome1} + {2.nome2} no mesmo horário, com {3.passo1.lower}.\n\nAtendo no dia 31 das 9h às 18h e restam poucos horários. Me chama no WhatsApp. {marca}\n\n#reveillon #maquiagem" },
    { id: "ritual", nivel: 3, nome: "Ritual de fim de ano", paraQuem: "Salões e estúdios de beleza", ideia: "Calendário no dia 31. Depois: o ritual dia a dia, os prazos e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "Ritual de *fim de ano*", dia: "31", mes: "DEZ", apoio: "Prepare-se com calma" }),
        T("int-lista", { titulo: "Seu *ritual*", item1: "Dia 29: unhas e sobrancelha", item2: "Dia 30: hidratação no cabelo", item3: "Dia 31: make e penteado", item4: "Meia-noite: só brindar" }),
        T("int-prazo", { titulo: "Agende *antes*", rot1: "Últimos horários de unha em", data1: "30/12", rot2: "Make e penteado até 18h de", data2: "31/12", nota: "Em 1º de janeiro o estúdio descansa." }),
        T("int-cta", { titulo: "Monte o *seu ritual*", texto: "Me fala o que você quer e eu organizo os horários.", contato: "Chama no WhatsApp" }, [P.makeLeve])
      ],
      legenda: "Seu ritual de fim de ano, sem correria 🥂\n\n{2.item1}\n{2.item2}\n{2.item3}\n{2.item4}\n\nMe fala o que você quer no WhatsApp que eu organizo os horários. {marca}\n\n#reveillon #ritual" },
    { id: "obrigada-ano", nivel: 3, nome: "Obrigada por este ano", paraQuem: "Qualquer prestadora", ideia: "Ano em destaque com três fotos. Depois: grade de trabalhos, uma frase e a agenda nova.",
      telas: [
        T("capa-ano", { titulo: "Obrigada por *este ano*", ano: "2026", apoio: "Cada cliente, uma festa" }, [P.glow, P.penteado, P.makeLeve]),
        T("int-grade", { titulo: "Produções de *2026*", texto: "Noivas, formandas, aniversariantes e muita festa de família." }, [P.glow, P.penteado, P.makeLeve, P.servico]),
        T("int-frase", { frase: "Obrigada por me deixar fazer parte *dos seus dias especiais*.", autor: "{marca}" }, [], { inv: true }),
        T("int-cta", { titulo: "Agenda de *2027*", texto: "Já estou marcando noivas e formaturas.", contato: "Chama no WhatsApp" }, [P.servico])
      ],
      legenda: "Obrigada por {1.ano} 💛\n\n{2.texto} Obrigada por me deixar fazer parte dos seus dias especiais.\n\nJá estou marcando noivas e formaturas de 2027 pelo WhatsApp. {marca}\n\n#gratidao #maquiagem" }
  ]
};
