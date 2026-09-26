/**
 * Biblioteca de orações do BEPACE — usada no painel inicial e na tela de Oração.
 */
export const PRAYER_CATEGORIES = [
  "Gratidão",
  "Família",
  "Saúde",
  "Trabalho",
  "Finanças",
  "Propósitos",
  "Proteção",
] as const;

export const PRAYER_LIBRARY = [
  {
    label: "Gratidão pela manhã",
    values: {
      title: "Gratidão pela manhã",
      category: "Gratidão",
      body: "Obrigado por mais um dia. Que eu use cada hora com propósito.",
      minutes: 5,
    },
  },
  {
    label: "Proteção da família",
    values: {
      title: "Proteção da família",
      category: "Família",
      body: "Guarde os meus, no corpo, na mente e no caminho.",
      minutes: 5,
    },
  },
  {
    label: "Sabedoria no trabalho",
    values: {
      title: "Sabedoria no trabalho",
      category: "Trabalho",
      body: "Dá-me discernimento nas decisões e paciência com as pessoas.",
      minutes: 5,
    },
  },
  {
    label: "Saúde e disciplina",
    values: {
      title: "Saúde e disciplina",
      category: "Saúde",
      body: "Que eu cuide do corpo que me foi confiado.",
      minutes: 5,
    },
  },
  {
    label: "Provisão e finanças",
    values: {
      title: "Provisão e finanças",
      category: "Finanças",
      body: "Que eu administre bem o pouco e o muito.",
      minutes: 5,
    },
  },
  {
    label: "Encerrando o dia",
    values: {
      title: "Encerrando o dia",
      category: "Gratidão",
      body: "Obrigado pelo que deu certo. Entrego o que não controlei e durmo em paz.",
      minutes: 5,
    },
  },
] as const;
