/* Natal de última hora (lojistas). Exemplo preenchido com a loja fictícia Boutique Cora. */
import { T, FOTOS as P, close } from "./_base.js";

export default {
  id: "natal-de-ultima-hora", marca: "Boutique Cora", previa: "faltam-3",
  carrosseis: [
    { id: "faltam-3", nivel: 1, nome: "Faltam 3 dias", ideia: "Calendário com a data editável. Depois: o que tem pronta entrega, os prazos reais e a chamada.",
      telas: [
        T("capa-calendario", { titulo: "Faltam *3 dias*", dia: "22", mes: "DEZ", apoio: "Ainda dá para comprar sem correria" }),
        T("int-opcoes", { titulo: "Pronta *entrega*", op1: "Perfume Flor de Laranjeira", preco1: "R$ 95", op2: "Óculos Riviera", preco2: "R$ 149", op3: "Relógio Clássico", preco3: "R$ 189" }, [P.perfume, P.oculos, P.relogio]),
        T("int-prazo", { titulo: "Prazos *reais*", rot1: "Entrega no mesmo dia: pedidos até 12h de", data1: "23/12", rot2: "Retirada na loja até", data2: "24/12", nota: "No dia 24 a loja fecha às 14h." }),
        T("int-cta", { titulo: "Resolve *hoje*", texto: "Manda o presente e o horário que a gente deixa embrulhado no balcão.", contato: "Chama no WhatsApp" }, [P.sacola])
      ],
      legenda: "Faltam 3 dias para o Natal e ainda dá tempo, sem correria 🔔\n\nPronta entrega: {2.op1}, {2.op2} e {2.op3}.\nEntrega no mesmo dia para pedidos até 12h de {3.data1}. Retirada na loja até {3.data2}.\n\nManda o presente e o horário no WhatsApp da {marca} que fica embrulhado no balcão.\n\n#ultimahora #natal" },
    { id: "10-minutos", nivel: 1, nome: "Presente pronto em 10 minutos", ideia: "Foto com etiqueta de preço. Três passos numerados mostram como a compra é rápida.",
      telas: [
        T("capa-etiqueta", { titulo: "Presente pronto em *10 minutos*", preco: "R$ 95", apoio: "Você escolhe, a gente embrulha" }, [P.perfume]),
        T("int-passo", { num: "1", titulo: "Escolha pelo direct", texto: "Diga para quem é e quanto quer gastar. A gente responde com 3 opções." }, [P.presentes]),
        T("int-passo", { num: "2", titulo: "Pague na hora", texto: "Pix ou cartão pelo link, sem fila no caixa." }, [P.sacola]),
        T("int-passo", { num: "3", titulo: "Retire embrulhado", texto: "Passe na loja e leve o presente pronto, com cartão escrito." }, [P.presentes], { aj: [close(1.6, 0.5, 0.5)] })
      ],
      legenda: "Presente pronto em 10 minutos? Dá, sim ⏱️\n\n1. {2.titulo}\n2. {3.titulo}\n3. {4.titulo}\n\nManda no direct da {marca} para quem é e quanto quer gastar. A gente responde com três opções.\n\n#ultimahora #presentedenatal" },
    { id: "ate-150", nivel: 1, nome: "4 presentes até R$ 150", ideia: "Valor gigante com a sacola como elemento. Dois presentes por tela e a confirmação de estoque no fim.",
      telas: [
        T("capa-numero", { titulo: "4 presentes até", valor: "R$ 150", rodape: "Última hora" }, [P.sacola]),
        T("int-dois", { titulo: "Para ela", nome1: "Perfume Flor de Laranjeira", preco1: "R$ 95", nome2: "Brincos dourados", preco2: "R$ 79" }, [P.perfume, P.brincos]),
        T("int-dois", { titulo: "Para todo mundo", nome1: "Óculos Riviera", preco1: "R$ 149", nome2: "Lenço de seda", preco2: "R$ 59" }, [P.oculos, P.lenco]),
        T("int-cta", { titulo: "Todos *em estoque*", texto: "Saem embrulhados na hora. Pode passar hoje.", contato: "Chama no WhatsApp" }, [P.presentes])
      ],
      legenda: "4 presentes até {1.valor}, todos em estoque 🎁\n\n• {2.nome1}: {2.preco1}\n• {2.nome2}: {2.preco2}\n• {3.nome1}: {3.preco1}\n• {3.nome2}: {3.preco2}\n\nSaem embrulhados na hora. Passa na {marca} hoje ou chama no WhatsApp.\n\n#ultimahora #presentes" },
    { id: "checklist", nivel: 1, nome: "Checklist do último minuto", ideia: "Capa com os nomes da lista em etiquetas. Depois: uma ideia por pessoa, os mais pedidos e como comprar.",
      telas: [
        T("capa-lista", { titulo: "Checklist do *último minuto*", itens: "Mãe · Sogra · Amigo secreto · Chefe", apoio: "Uma ideia para cada nome da lista" }, [P.presentes]),
        T("int-lista", { titulo: "Ideias *rápidas*", item1: "Mãe: perfume Flor de Laranjeira (R$ 95)", item2: "Sogra: lenço de seda (R$ 59)", item3: "Amigo secreto: brincos dourados (R$ 79)", item4: "Chefe: óculos Riviera (R$ 149)" }),
        T("int-dois", { titulo: "Os mais pedidos", nome1: "Perfume", preco1: "R$ 95", nome2: "Lenço de seda", preco2: "R$ 59" }, [P.perfume, P.lenco]),
        T("int-info", { titulo: "Como *comprar*", linha1: "Escolha pelo WhatsApp ou na loja", linha2: "Pix, cartão ou dinheiro", linha3: "Embrulho e cartão grátis", cta: "Fale com a gente agora" })
      ],
      legenda: "Ainda tem nome sem presente na sua lista? Salva este checklist 📝\n\n{2.item1}\n{2.item2}\n{2.item3}\n{2.item4}\n\nNa {marca}: {4.linha2}, {4.linha3}. Fala com a gente agora pelo WhatsApp.\n\n#checklist #ultimahora" },
    { id: "deixou-depois", nivel: 1, nome: "Deixou para depois?", ideia: "Capa só tipográfica, em tom de conversa. Depois: uma frase leve, o vale-presente e a chamada.",
      telas: [
        T("capa-tipo", { titulo: "Deixou para *depois*?", apoio: "Calma. A gente ajuda a resolver hoje." }),
        T("int-frase", { frase: "Sem julgamento: *muita gente* também deixou.", autor: "{marca}" }, [], { inv: true }),
        T("int-um", { nome: "Vale-presente", preco: "a partir de R$ 50", apoio: "Chega por WhatsApp em 5 minutos" }, [P.presentes]),
        T("int-cta", { titulo: "Chama que a gente *resolve*", texto: "Diga para quem é e quanto quer gastar.", contato: "Chama no WhatsApp" }, [P.sacola])
      ],
      legenda: "Deixou o presente para depois? Sem julgamento 😅\n\nA {marca} resolve hoje: escolha pelo WhatsApp, retire embrulhado ou mande um vale-presente {3.preco}, que chega em 5 minutos.\n\nDiga para quem é e quanto quer gastar.\n\n#ultimahora #valepresente" },
    { id: "vale", nivel: 2, nome: "O presente que nunca erra", ideia: "Foto inteira na capa. Depois: como funciona o vale, os dois jeitos de entregar e a chamada.",
      telas: [
        T("capa-foto", { titulo: "O presente que *nunca erra*", apoio: "Vale-presente da loja" }, [P.presentes]),
        T("int-lista", { titulo: "Como *funciona*", item1: "Você escolhe o valor, a partir de R$ 50", item2: "Recebe o vale por WhatsApp ou impresso", item3: "Quem ganha escolhe na loja até março", item4: "Vale para qualquer peça" }),
        T("int-comparar", { rot1: "Impresso", rot2: "No celular", texto: "Em envelope bonito ou *direto no WhatsApp*." }, [P.presentes, P.sacola]),
        T("int-cta", { titulo: "Quer *um vale*?", texto: "Manda o valor e o nome de quem vai ganhar.", contato: "Chama no WhatsApp" }, [P.presentes])
      ],
      legenda: "Não sabe o tamanho, a cor ou o gosto? Vale-presente nunca erra 💌\n\n{2.item1}. {2.item2}. {2.item3}.\n\nManda no WhatsApp da {marca} o valor e o nome de quem vai ganhar.\n\n#valepresente #ultimahora" },
    { id: "embrulho", nivel: 2, nome: "Embrulho grátis", ideia: "Capa com selo “Grátis”. Depois: o embrulho de perto, o presente pronto e as condições.",
      telas: [
        T("capa-selo", { titulo: "Embrulho *grátis* até o dia 24", selo: "Grátis", apoio: "Em qualquer compra" }, [P.presentes]),
        T("int-detalhe", { titulo: "O embrulho", texto: "Papel kraft, fita vermelha e *cartão escrito à mão*." }, [P.presentes], { aj: [close(2, 0.5, 0.45)] }),
        T("int-resultado", { titulo: "Pronto", texto: "Do balcão para a árvore, *sem você embrulhar nada*." }, [P.presentes]),
        T("int-info", { titulo: "Vale para", linha1: "Qualquer compra, de qualquer valor", linha2: "Até 24/12", linha3: "Cartão com a sua mensagem", cta: "Escolha o seu presente" })
      ],
      legenda: "Embrulho grátis em qualquer compra até o dia 24 🎀\n\n{2.texto}\n\nVocê escolhe, a {marca} embrulha e escreve o cartão com a sua mensagem. Chama no WhatsApp.\n\n#embrulho #presentedenatal" },
    { id: "combos", nivel: 2, nome: "Combos de última hora", ideia: "Duas fotos e um “+”. Cada tela é um combo pronto para presentear, com o preço.",
      telas: [
        T("capa-dupla", { titulo: "Combos de *última hora*", apoio: "Duas peças, um presente completo" }, [P.perfume, P.lenco]),
        T("int-dupla", { nome: "Perfume + lenço", porque: "Para a mãe ou para a sogra: elegante e certeiro.", preco: "R$ 139 o combo" }, [P.perfume, P.lenco]),
        T("int-dupla", { nome: "Óculos + brincos", porque: "Para a amiga das férias: sol, praia e brilho.", preco: "R$ 209 o combo" }, [P.oculos, P.brincos]),
        T("int-dupla", { nome: "Relógio + clutch", porque: "Um presente maior, para dividir entre irmãos.", preco: "R$ 259 o combo" }, [P.relogio, P.clutch])
      ],
      legenda: "Combos prontos para quem não tem mais tempo de pensar 🛍️\n\n• {2.nome}: {2.preco}\n• {3.nome}: {3.preco}\n• {4.nome}: {4.preco}\n\nSai tudo embrulhado junto. Pede o seu no WhatsApp da {marca}.\n\n#combo #ultimahora" },
    { id: "virada-pressas", nivel: 3, nome: "Virada às pressas", ideia: "Três fotos na capa. Depois: a peça pronta, o que completa e até quando dá.",
      telas: [
        T("capa-polaroides", { titulo: "Virada *às pressas*", apoio: "Looks prontos para levar hoje" }, [P.vestidoBranco, P.salto, P.brincos]),
        T("int-um", { nome: "Vestido Brisa", preco: "R$ 189", apoio: "Pronto para usar, sem ajuste" }, [P.vestidoBranco]),
        T("int-dois", { titulo: "Para completar", nome1: "Sandália Dourada", preco1: "R$ 159", nome2: "Brincos dourados", preco2: "R$ 79" }, [P.salto, P.brincos]),
        T("int-prazo", { titulo: "Até quando *dá*", rot1: "Entrega na cidade até", data1: "30/12", rot2: "Retirada na loja até 13h de", data2: "31/12", nota: "No dia 31 a loja abre só pela manhã." })
      ],
      legenda: "Lembrou da roupa da virada agora? Ainda dá 🎆\n\n{2.nome} ({2.preco}), pronto para usar. Para completar: {3.nome1} e {3.nome2}.\n\nEntrega na cidade até {4.data1}. Retirada na {marca} até 13h de {4.data2}. Separa o seu pelo WhatsApp.\n\n#reveillon #ultimahora" },
    { id: "regressiva", nivel: 3, nome: "Contagem regressiva", ideia: "Ano novo em destaque com três fotos. Depois: lista do que não esquecer, o que tem em estoque e a chamada.",
      telas: [
        T("capa-ano", { titulo: "Contagem *regressiva*", ano: "2027", apoio: "Os últimos dias para comprar com a gente" }, [P.tacas, P.estrelinha, P.sacola]),
        T("int-lista", { titulo: "Para não *esquecer*", item1: "Roupa branca para a virada", item2: "Taças para o brinde", item3: "Presente para quem vai receber você", item4: "Sandália que aguenta a festa" }),
        T("int-opcoes", { titulo: "Tudo *em estoque*", op1: "Par de taças", preco1: "R$ 119", op2: "Vestido Brisa", preco2: "R$ 189", op3: "Sandália Dourada", preco3: "R$ 159" }, [P.tacas, P.vestidoBranco, P.salto]),
        T("int-cta", { titulo: "Ainda *dá tempo*", texto: "Fala com a gente e saia com tudo pronto.", contato: "Chama no WhatsApp" }, [P.estrelinha])
      ],
      legenda: "Contagem regressiva para {1.ano} ⏳\n\nPara não esquecer: {2.item1}, {2.item2}, {2.item3} e {2.item4}.\n\nTudo em estoque na {marca}. Fala com a gente no WhatsApp e saia com tudo pronto.\n\n#reveillon #contagemregressiva" },
    { id: "anfitriao", nivel: 3, nome: "Presente para quem recebe", ideia: "Foto em arco na capa. Cada tela liga um presente ao jeito de quem vai receber a virada.",
      telas: [
        T("capa-arco", { titulo: "Vai passar a virada *na casa de alguém*?", apoio: "Não chegue de mãos vazias" }, [P.tacas]),
        T("int-estilo", { estilo: "Para quem *recebe bem*", nome: "Par de taças", preco: "R$ 119" }, [P.tacas]),
        T("int-estilo", { estilo: "Para quem ama *cheiro de casa*", nome: "Perfume de ambiente", preco: "R$ 79" }, [P.perfume]),
        T("int-estilo", { estilo: "Para quem decora *tudo*", nome: "Fio de luzinhas", preco: "R$ 49" }, [P.luzes])
      ],
      legenda: "Vai passar a virada na casa de alguém? Não chega de mãos vazias 🥂\n\n{2.nome} ({2.preco}), {3.nome} ({3.preco}) ou {4.nome} ({4.preco}).\n\nA {marca} embrulha na hora. Chama no WhatsApp.\n\n#reveillon #presenteanfitriao" }
  ]
};
