/* Um ano de boas histórias (qualquer prestadora com portfólio). Exemplo: Studio Clara (design e fotografia de marcas). */
import { T, FOTOS as P } from "./_base.js";

export default {
  id: "um-ano-de-boas-historias", marca: "Studio Clara", previa: "retrospectiva",
  carrosseis: [
    { id: "em-numeros", nivel: 1, nome: "Meu ano em números", paraQuem: "Qualquer prestadora", ideia: "Número gigante na capa com o caderno como elemento. Depois: os números, a grade de trabalhos e a frase.",
      telas: [
        T("capa-numero", { titulo: "Meu 2026 em", valor: "120", rodape: "Clientes atendidas" }, [P.caderno]),
        T("int-lista", { titulo: "Em *números*", item1: "120 clientes atendidas", item2: "38 trabalhos novos no portfólio", item3: "5 cursos e workshops", item4: "Muitos cafés com cliente" }),
        T("int-grade", { titulo: "Alguns *trabalhos*", texto: "Uma amostra do que passou por aqui este ano." }, [P.caderno, P.flores, P.camera, P.polaroides]),
        T("int-frase", { frase: "Cada número tem *um nome* por trás.", autor: "{marca}" }, [], { inv: true })
      ],
      legenda: "Meu ano em números 📊\n\n• {2.item1}\n• {2.item2}\n• {2.item3}\n• {2.item4}\n\nCada número tem um nome por trás. Obrigada a cada cliente! Conta nos comentários se você fez parte de um desses números. {marca}\n\n#retrospectiva #empreendedora" },
    { id: "depoimentos", nivel: 1, nome: "Depoimentos do ano", paraQuem: "Qualquer prestadora", ideia: "Capa com depoimento em aspas grandes. Depois: outro depoimento, um projeto e o convite.",
      telas: [
        T("capa-citacao", { citacao: "“Foi o melhor investimento que *fiz no meu negócio* este ano.”", autor: "Juliana, cliente" }, [P.caderno]),
        T("int-frase", { frase: "“Atenção em *cada detalhe*, do começo ao fim.”", autor: "Rafael, cliente" }),
        T("int-resultado", { titulo: "Projeto da Juliana", texto: "Identidade nova e *clientes novas* todo mês." }, [P.flores]),
        T("int-cta", { titulo: "Quer ser a *próxima história*?", texto: "Agenda de 2027 aberta.", contato: "Chama no WhatsApp" }, [P.flores])
      ],
      legenda: "O que as clientes disseram este ano 💬\n\n{1.citacao} ({1.autor})\n{2.frase} ({2.autor})\n\nQuer ser a próxima história? Agenda de 2027 aberta no WhatsApp. {marca}\n\n#depoimentos #clientes" },
    { id: "retrospectiva", nivel: 1, nome: "Um ano de boas histórias", paraQuem: "Qualquer prestadora", ideia: "Ano gigante com três fotos. Cada tela é um mês marcante do ano, com o número do mês.",
      telas: [
        T("capa-ano", { titulo: "Um ano de *boas histórias*", ano: "2026", apoio: "Obrigada a cada cliente" }, [P.caderno, P.flores, P.camera]),
        T("int-passo", { num: "01", titulo: "Janeiro", texto: "Comecei o ano com a agenda vazia e uma meta escrita no caderno." }, [P.caderno]),
        T("int-passo", { num: "06", titulo: "Junho", texto: "O primeiro trabalho grande, indicado por uma cliente antiga." }, [P.flores]),
        T("int-passo", { num: "12", titulo: "Dezembro", texto: "Fecho o ano com a agenda de janeiro quase cheia." }, [P.camera])
      ],
      legenda: "{1.ano}, um ano de boas histórias ✨\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n{4.titulo}: {4.texto}\n\nObrigada a cada cliente que fez parte. Quer começar a sua história em 2027? Me chama no WhatsApp. {marca}\n\n#retrospectiva #gratidao" },
    { id: "aprendi", nivel: 1, nome: "O que o ano me ensinou", paraQuem: "Qualquer prestadora", ideia: "Capa tipográfica. Três aprendizados, um por tela, alternando claro e escuro.",
      telas: [
        T("capa-tipo", { titulo: "O que *2026* me ensinou", apoio: "Três aprendizados de um ano de trabalho" }),
        T("int-frase", { frase: "*Dizer não* também é cuidar do cliente.", autor: "Aprendizado 1" }, [], { inv: true }),
        T("int-frase", { frase: "Prazo combinado é *promessa*.", autor: "Aprendizado 2" }),
        T("int-frase", { frase: "Quem indica vale mais que *qualquer anúncio*.", autor: "Aprendizado 3" }, [], { inv: true })
      ],
      legenda: "Três coisas que este ano me ensinou 📝\n\n1. {2.frase.plain}\n2. {3.frase.plain}\n3. {4.frase.plain}\n\nQual foi o seu maior aprendizado? Conta nos comentários. {marca}\n\n#aprendizados #empreendedora" },
    { id: "voltaram", nivel: 1, nome: "Clientes que voltaram", paraQuem: "Qualquer prestadora", ideia: "Capa com etiquetas. Depois: o primeiro trabalho, a volta com indicações e o agradecimento.",
      telas: [
        T("capa-lista", { titulo: "Clientes que *voltaram*", itens: "Indicação · Retorno · Parceria", apoio: "O melhor elogio do ano" }, [P.flores]),
        T("int-resultado", { titulo: "Primeiro trabalho", texto: "A Ana chegou em março para *um projeto pequeno*." }, [P.caderno]),
        T("int-resultado", { titulo: "A volta", texto: "Em outubro, voltou com *duas amigas* indicadas." }, [P.flores]),
        T("int-cta", { titulo: "Obrigada por *indicar*", texto: "Indicações de 2027 ganham um mimo.", contato: "Chama no WhatsApp" }, [P.polaroides])
      ],
      legenda: "O melhor elogio do ano: a cliente que volta 💛\n\n{2.texto.plain}\n{3.texto.plain}\n\nObrigada por cada indicação. Em 2027, quem indica ganha um mimo: é só me chamar no WhatsApp. {marca}\n\n#indicacao #clientes" },
    { id: "prazo", nivel: 2, nome: "Quanto tempo leva um projeto?", paraQuem: "Qualquer prestadora com projetos", ideia: "Capa antes e depois (começo e entrega). Depois: as etapas, a frase e o convite.",
      telas: [
        T("capa-antes", { titulo: "Quanto tempo leva *um projeto*?", rot1: "Começo", rot2: "Entrega" }, [P.caderno, P.flores]),
        T("int-lista", { titulo: "As *etapas*", item1: "Conversa e briefing: 1 semana", item2: "Primeira proposta: 2 semanas", item3: "Ajustes: até 2 rodadas", item4: "Entrega final: 1 semana" }),
        T("int-frase", { frase: "Prazo bom é o que *cabe na sua vida*.", autor: "{marca}" }, [], { inv: true }),
        T("int-cta", { titulo: "Me conta o *seu projeto*", texto: "Eu monto um cronograma para você.", contato: "Chama no WhatsApp" }, [P.caderno])
      ],
      legenda: "Quanto tempo leva um projeto? Depende, mas o caminho é este ⏳\n\n• {2.item1}\n• {2.item2}\n• {2.item3}\n• {2.item4}\n\nMe conta o seu projeto no WhatsApp que eu monto um cronograma. {marca}\n\n#processo #bastidores" },
    { id: "favorito", nivel: 2, nome: "O projeto favorito do ano", paraQuem: "Qualquer prestadora com portfólio", ideia: "Capa com selo. Depois: o detalhe que marcou, antes e depois e o convite.",
      telas: [
        T("capa-selo", { titulo: "O projeto *favorito* do ano", selo: "Favorito", apoio: "E por que ele me marcou" }, [P.flores]),
        T("int-detalhe", { titulo: "O detalhe", texto: "A cliente trouxe *a letra da avó*; virou a assinatura da marca." }, [P.caderno]),
        T("int-comparar", { rot1: "Antes", rot2: "Depois", texto: "Do improviso a uma *identidade com história*." }, [P.caderno, P.flores]),
        T("int-cta", { titulo: "Quer um projeto *assim*?", texto: "Abrindo três vagas para fevereiro.", contato: "Chama no WhatsApp" }, [P.flores])
      ],
      legenda: "O meu projeto favorito do ano 🌷\n\n{2.texto.plain}\n\nDo improviso a uma identidade com história. Abrindo três vagas para fevereiro: me chama no WhatsApp. {marca}\n\n#portfolio #projetofavorito" },
    { id: "por-tras", nivel: 2, nome: "A história por trás deste trabalho", paraQuem: "Qualquer prestadora com portfólio", ideia: "Foto inteira na capa. Depois: o pedido, a virada e onde a cliente está hoje.",
      telas: [
        T("capa-foto", { titulo: "A história por trás *deste trabalho*", apoio: "Um projeto deste ano" }, [P.flores]),
        T("int-passo", { num: "1", titulo: "O pedido", texto: "Uma floricultura de bairro queria parecer tão especial quanto as flores." }, [P.flores]),
        T("int-passo", { num: "2", titulo: "A virada", texto: "Fotografamos as flores na luz da manhã, dentro da própria loja." }, [P.camera]),
        T("int-resultado", { titulo: "Hoje", texto: "A loja tem *fila de encomendas* no Dia das Mães." }, [P.flores])
      ],
      legenda: "A história por trás deste trabalho 🌸\n\n{2.titulo}: {2.texto}\n{3.titulo}: {3.texto}\n\nHoje a loja tem fila de encomendas no Dia das Mães. Me conta a sua história no WhatsApp. {marca}\n\n#portfolio #historia" },
    { id: "metas", nivel: 3, nome: "Metas para 2027", paraQuem: "Qualquer prestadora", ideia: "Calendário em 1º de janeiro. Depois: as metas, o recesso e o convite.",
      telas: [
        T("capa-calendario", { titulo: "Metas para *2027*", dia: "01", mes: "JAN", apoio: "O que vem por aí" }),
        T("int-lista", { titulo: "Em *2027*", item1: "Atender com agenda mais organizada", item2: "Lançar um serviço novo em março", item3: "Contar mais bastidores aqui", item4: "Tirar férias de verdade em julho" }),
        T("int-prazo", { titulo: "Agenda", rot1: "Recesso a partir de", data1: "24/12", rot2: "Voltamos em", data2: "06/01", nota: "Mensagens respondidas na volta, por ordem de chegada." }),
        T("int-cta", { titulo: "Vem com a *gente*", texto: "Reserve a sua vaga para o primeiro trimestre.", contato: "Chama no WhatsApp" }, [P.caderno])
      ],
      legenda: "Metas para 2027 ✍️\n\n• {2.item1}\n• {2.item2}\n• {2.item3}\n• {2.item4}\n\nRecesso a partir de {3.data1}, voltamos em {3.data2}. Reserve sua vaga no WhatsApp. {marca}\n\n#metas #anonovo" },
    { id: "album", nivel: 3, nome: "O álbum do ano", paraQuem: "Qualquer prestadora com portfólio", ideia: "Três fotos espalhadas na capa. Depois: grade, o trabalho preferido e um desejo.",
      telas: [
        T("capa-polaroides", { titulo: "O álbum do *ano*", apoio: "Os trabalhos que mais amei fazer" }, [P.flores, P.camera, P.caderno]),
        T("int-grade", { titulo: "*2026* em fotos", texto: "Projetos, clientes e muitos bastidores." }, [P.flores, P.camera, P.caderno, P.polaroides]),
        T("int-resultado", { titulo: "O preferido", texto: "Este aqui me lembrou *por que* escolhi este trabalho." }, [P.polaroides]),
        T("int-frase", { frase: "Que venham *mais histórias* em 2027.", autor: "{marca}" }, [], { inv: true })
      ],
      legenda: "O álbum do meu ano 📒\n\n{2.texto} E um preferido, que me lembrou por que escolhi este trabalho.\n\nQue venham mais histórias em 2027. Qual trabalho você mais gostou? Conta nos comentários. {marca}\n\n#retrospectiva #portfolio" },
    { id: "obrigada", nivel: 3, nome: "Obrigada por este ano", paraQuem: "Qualquer prestadora", ideia: "Foto em arco na capa. Depois: a frase, a grade de clientes e o feliz ano novo.",
      telas: [
        T("capa-arco", { titulo: "*Obrigada* por este ano", apoio: "Um recado para quem fez parte" }, [P.flores]),
        T("int-frase", { frase: "Cada cliente deixou *um pouco de si* no meu trabalho.", autor: "{marca}" }),
        T("int-grade", { titulo: "Vocês", texto: "Obrigada por cada mensagem, indicação e café." }, [P.flores, P.caderno, P.camera, P.luzes]),
        T("int-cta", { titulo: "Feliz *2027*", texto: "A agenda abre dia 6 de janeiro.", contato: "Chama no WhatsApp" }, [P.luzes])
      ],
      legenda: "Obrigada por este ano 💛\n\nCada cliente deixou um pouco de si no meu trabalho. Obrigada por cada mensagem, indicação e café.\n\nFeliz 2027! A agenda abre dia 6 de janeiro, pelo WhatsApp. {marca}\n\n#gratidao #feliz2027" }
  ]
};
