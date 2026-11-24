/* Um tempo para cuidar (esteticistas, massoterapeutas, manicures, terapeutas). Exemplo: Espaço Lume. */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "um-tempo-para-cuidar", marca: "Espaço Lume", previa: "pausa",
  carrosseis: [
    { id: "pausa", nivel: 1, nome: "Uma pausa no meio de dezembro", paraQuem: "Massoterapeutas", ideia: "Foto em arco na capa. Depois: como é a sessão, para quem é e as informações.",
      telas: [
        T("capa-arco", { titulo: "Uma *pausa* no meio de dezembro", apoio: "Massagem relaxante de 60 minutos" }, [P.spa]),
        T("int-detalhe", { titulo: "Como é", texto: "Pedras quentes nas costas e óleo de lavanda: *o corpo desacelera*." }, [P.spa], { aj: [close(2, 0.45, 0.45)] }),
        T("int-lista", { titulo: "Para quem é", item1: "Quem está com os ombros na orelha", item2: "Quem dorme mal no fim de ano", item3: "Quem trabalhou o ano inteiro sem parar", item4: "Quem merece um presente para si" }),
        T("int-info", { titulo: "Massagem relaxante", linha1: "R$ 150 · 60 minutos", linha2: "Horários de segunda a sábado", linha3: "Vale-presente disponível", cta: "Agende pelo WhatsApp" })
      ],
      legenda: "Dezembro corre. Você pode parar uma hora 🌿\n\n{2.texto}\n\nÉ para {3.item1.lower}, {3.item2.lower} e {3.item4.lower}.\n\n{4.titulo}: {4.linha1}. Agende pelo WhatsApp. {marca}\n\n#massagem #autocuidado" },
    { id: "para-voce", nivel: 1, nome: "Dezembro também é para você", paraQuem: "Terapeutas e esteticistas", ideia: "Capa tipográfica em verde. Depois: a frase que toca no ponto, três minutos de pausa e o convite.",
      telas: [
        T("capa-tipo", { titulo: "Dezembro também é *para você*.", apoio: "Um lembrete de quem cuida" }, [], { inv: true }),
        T("int-frase", { frase: "Você organizou a ceia, os presentes e a agenda de todo mundo. *E a sua?*", autor: "{marca}" }),
        T("int-uso", { titulo: "Três minutos de pausa", passo1: "Solte os ombros e respire fundo três vezes", passo2: "Beba um copo de água antes do café", passo3: "Alongue o pescoço para os dois lados" }, [P.vela]),
        T("int-cta", { titulo: "Quer uma pausa *de verdade*?", texto: "Reserve uma hora só sua antes das festas.", contato: "Chama no WhatsApp" }, [P.spa])
      ],
      legenda: "Dezembro também é para você 🤍\n\n{2.frase.plain}\n\nTrês minutos de pausa agora:\n1. {3.passo1}\n2. {3.passo2}\n3. {3.passo3}\n\nQuer uma pausa de verdade? Reserve uma hora só sua pelo WhatsApp. {marca}\n\n#autocuidado #pausa" },
    { id: "pele-fotos", nivel: 1, nome: "Pele pronta para as fotos", paraQuem: "Esteticistas", ideia: "Foto inteira na capa. Depois: avaliação, limpeza e o resultado.",
      telas: [
        T("capa-foto", { titulo: "Pele pronta para *as fotos* de fim de ano", apoio: "Limpeza de pele profunda" }, [P.spa]),
        T("int-passo", { num: "1", titulo: "Avaliação", texto: "Olho a sua pele e escolho os produtos para o seu tipo." }, [P.spa], { aj: [close(1.5)] }),
        T("int-passo", { num: "2", titulo: "Limpeza", texto: "Esfoliação, extração e máscara calmante. Sem vermelhidão no dia seguinte." }, [P.vela]),
        T("int-resultado", { titulo: "O resultado", texto: "Pele uniforme e *maquiagem que assenta melhor*." }, [P.flores])
      ],
      legenda: "As fotos de fim de ano começam na pele 📸\n\n1. {2.titulo}: {2.texto}\n2. {3.titulo}: {3.texto}\n\n{4.titulo}: pele uniforme e maquiagem que assenta melhor. Agende pelo WhatsApp. {marca}\n\n#limpezadepele #estetica" },
    { id: "ritual", nivel: 1, nome: "Seu ritual de autocuidado", paraQuem: "Espaços de bem-estar", ideia: "Capa com os serviços em etiquetas. Depois: as opções com preço, sozinha ou em dupla e a chamada.",
      telas: [
        T("capa-lista", { titulo: "Seu ritual de *autocuidado*", itens: "Massagem · Pés · Pele · Silêncio", apoio: "Escolha por onde começar" }, [P.vela]),
        T("int-opcoes", { titulo: "Escolha *o seu*", op1: "Massagem relaxante 60 min", preco1: "R$ 150", op2: "Spa dos pés", preco2: "R$ 90", op3: "Limpeza de pele", preco3: "R$ 180" }, [P.spa, P.esmaltes, P.vela]),
        T("int-comparar", { rot1: "Sozinha", rot2: "Com a amiga", texto: "Venha sozinha ou traga alguém: *sessão em dupla* na mesma sala." }, [P.spa, P.flores]),
        T("int-cta", { titulo: "Reserve o *seu*", texto: "Horários de dezembro até o dia 23.", contato: "Chama no WhatsApp" }, [P.vela])
      ],
      legenda: "Por onde começar o seu ritual de autocuidado? 🕯️\n\n{2.op1}: {2.preco1}\n{2.op2}: {2.preco2}\n{2.op3}: {2.preco3}\n\nVenha sozinha ou traga alguém. Horários de dezembro até o dia 23, pelo WhatsApp. {marca}\n\n#autocuidado #bemestar" },
    { id: "dizem", nivel: 1, nome: "O que dizem", paraQuem: "Qualquer profissional de cuidado", ideia: "Capa com depoimento. Depois: uma frase sobre o seu jeito de cuidar, o que a cliente encontra e o convite.",
      telas: [
        T("capa-citacao", { citacao: "“Saí de lá *leve como não me sentia* desde janeiro.”", autor: "Renata, cliente" }, [P.spa]),
        T("int-frase", { frase: "Cuidar é *ouvir* antes de tocar.", autor: "{marca}" }, [], { inv: true }),
        T("int-lista", { titulo: "O que você *encontra*", item1: "Sala aquecida e silenciosa", item2: "Chá depois da sessão", item3: "Produtos naturais", item4: "Sem pressa: 15 minutos entre clientes" }),
        T("int-cta", { titulo: "Venha *conhecer*", texto: "Primeira sessão com avaliação gratuita.", contato: "Chama no WhatsApp" }, [P.vela])
      ],
      legenda: "{1.citacao}\n({1.autor})\n\nAqui você encontra {3.item1.lower}, {3.item2.lower} e tempo de sobra. Cuidar é ouvir antes de tocar.\n\nPrimeira sessão com avaliação gratuita. Chama no WhatsApp. {marca}\n\n#depoimento #massagem" },
    { id: "vale", nivel: 2, nome: "Dê de presente um tempo", paraQuem: "Massoterapeutas e esteticistas", ideia: "Foto com etiqueta de preço. Depois: como funciona o vale, o cartão de perto e a chamada.",
      telas: [
        T("capa-etiqueta", { titulo: "Dê de presente *um tempo*", preco: "R$ 150", apoio: "Vale-massagem de 60 minutos" }, [P.spa]),
        T("int-lista", { titulo: "Como *funciona*", item1: "Escolha o serviço e o valor", item2: "Receba o vale por WhatsApp", item3: "Quem ganha agenda quando quiser", item4: "Validade de 6 meses" }),
        T("int-detalhe", { titulo: "O vale", texto: "Cartão impresso com *envelope de linho* para entregar na ceia." }, [P.flores]),
        T("int-cta", { titulo: "Quer *presentear*?", texto: "Manda o nome de quem vai ganhar.", contato: "Chama no WhatsApp" }, [P.vela])
      ],
      legenda: "Presente que não ocupa espaço e fica na memória: tempo 🎁\n\nVale-massagem de 60 minutos por {1.preco}. {2.item2}. {2.item3}. {2.item4}.\n\nManda no WhatsApp o nome de quem vai ganhar. {marca}\n\n#valepresente #massagem" },
    { id: "em-dobro", nivel: 2, nome: "Cuidado em dobro", paraQuem: "Espaços de bem-estar", ideia: "Duas fotos e um “+”. Cada tela combina dois cuidados e explica a escolha.",
      telas: [
        T("capa-dupla", { titulo: "Cuidado *em dobro*", apoio: "Dois serviços, uma tarde só sua" }, [P.spa, P.esmaltes]),
        T("int-dupla", { nome: "Massagem + spa dos pés", porque: "Começa relaxando o corpo e termina com os pés prontos para a sandália.", preco: "R$ 220 os dois" }, [P.spa, P.esmaltes]),
        T("int-dupla", { nome: "Limpeza de pele + máscara", porque: "Pele limpa e hidratada para as fotos de Natal.", preco: "R$ 210 os dois" }, [P.vela, P.flores]),
        T("int-dupla", { nome: "Massagem a dois", porque: "Para dar de presente ao casal ou à melhor amiga.", preco: "R$ 280 a sessão" }, [P.spa, P.vela])
      ],
      legenda: "Uma tarde só sua, com cuidado em dobro 🌿\n\n• {2.nome}: {2.preco}\n• {3.nome}: {3.preco}\n• {4.nome}: {4.preco}\n\nEscolha a sua combinação e agende pelo WhatsApp. {marca}\n\n#autocuidado #spa" },
    { id: "lavanda", nivel: 2, nome: "Por que eu uso lavanda", paraQuem: "Massoterapeutas e terapeutas", ideia: "Capa com selo. Depois: o aroma de perto, um cuidado do processo e a frase.",
      telas: [
        T("capa-selo", { titulo: "Por que eu uso *óleo de lavanda*", selo: "Escolha da terapeuta", apoio: "Uma escolha do meu trabalho" }, [P.vela]),
        T("int-detalhe", { titulo: "O aroma", texto: "Lavanda ajuda a *desacelerar* e a dormir melhor depois da sessão." }, [P.flores]),
        T("int-passo", { num: "", titulo: "Óleo aquecido", texto: "Aqueço o óleo antes de começar: o corpo relaxa mais rápido." }, [P.vela]),
        T("int-frase", { frase: "Cada detalhe é pensado para você *sair mais leve*.", autor: "{marca}" }, [], { inv: true })
      ],
      legenda: "Uma escolha do meu trabalho: óleo de lavanda 💜\n\n{2.texto}\n\n{3.titulo}: {3.texto}\n\nCada detalhe é pensado para você sair mais leve. Agende pelo WhatsApp. {marca}\n\n#massagem #bastidores" },
    { id: "comece-descansada", nivel: 3, nome: "Comece o ano descansada", paraQuem: "Qualquer prestadora de cuidado", ideia: "Calendário em 2 de janeiro. Depois: a agenda do recesso, os serviços de janeiro e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "Comece o ano *descansada*", dia: "02", mes: "JAN", apoio: "Agenda aberta" }),
        T("int-prazo", { titulo: "Agenda do *recesso*", rot1: "Último atendimento em", data1: "23/12", rot2: "Voltamos em", data2: "02/01", nota: "Reservas para janeiro já estão abertas." }),
        T("int-opcoes", { titulo: "Para *janeiro*", op1: "Massagem relaxante", preco1: "R$ 150", op2: "Drenagem", preco2: "R$ 170", op3: "Limpeza de pele", preco3: "R$ 180" }, [P.spa, P.vela, P.flores]),
        T("int-cta", { titulo: "Já *reserve*", texto: "Escolha seu horário de janeiro.", contato: "Chama no WhatsApp" }, [P.spa])
      ],
      legenda: "Comece 2027 descansada 🌿\n\nÚltimo atendimento em {2.data1}. Voltamos em {2.data2} e as reservas para janeiro já estão abertas.\n\nEscolha seu horário pelo WhatsApp. {marca}\n\n#anonovo #autocuidado" },
    { id: "ritual-fim", nivel: 3, nome: "Ritual de fim de ano", paraQuem: "Terapeutas", ideia: "Três fotos na capa. Três passos numerados para fechar o ano com calma.",
      telas: [
        T("capa-polaroides", { titulo: "Ritual de *fim de ano*", apoio: "Para fechar 2026 com calma" }, [P.vela, P.flores, P.caderno]),
        T("int-passo", { num: "1", titulo: "Escreva", texto: "Anote três coisas boas do ano. Guarde para ler em dezembro que vem." }, [P.caderno]),
        T("int-passo", { num: "2", titulo: "Acenda", texto: "Uma vela, cinco minutos de silêncio, celular longe." }, [P.vela]),
        T("int-passo", { num: "3", titulo: "Agradeça", texto: "Mande mensagem para alguém que cuidou de você este ano." }, [P.flores])
      ],
      legenda: "Um ritual simples para fechar o ano com calma 🕯️\n\n1. {2.titulo}: {2.texto}\n2. {3.titulo}: {3.texto}\n3. {4.titulo}: {4.texto}\n\nSalva para fazer na última semana do ano e me conta nos comentários qual passo você mais precisa. {marca}\n\n#ritual #fimdeano" },
    { id: "ano-cuidado", nivel: 3, nome: "Um ano de cuidado", paraQuem: "Qualquer prestadora de cuidado", ideia: "Ano em destaque com três fotos. Depois: uma frase, o espaço em grade e o até janeiro.",
      telas: [
        T("capa-ano", { titulo: "Um ano de *cuidado*", ano: "2026", apoio: "Obrigada por confiar o seu tempo" }, [P.spa, P.vela, P.flores]),
        T("int-frase", { frase: "Foi uma alegria *cuidar de você* este ano.", autor: "{marca}" }, [], { inv: true }),
        T("int-grade", { titulo: "Nosso *espaço*", texto: "Fica aqui, esperando você em 2027." }, [P.spa, P.vela, P.flores, P.caderno]),
        T("int-cta", { titulo: "Até *janeiro*", texto: "Voltamos dia 2. A agenda já está aberta.", contato: "Chama no WhatsApp" }, [P.spa])
      ],
      legenda: "Um ano de cuidado 🤍\n\nFoi uma alegria cuidar de você em {1.ano}. Obrigada por confiar o seu tempo a nós.\n\nVoltamos dia 2 e a agenda de janeiro já está aberta no WhatsApp. {marca}\n\n#gratidao #autocuidado" }
  ]
};
