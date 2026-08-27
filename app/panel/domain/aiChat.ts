export const aiChatIntents = [
  "Wyjaśnij temat",
  "Zaproponuj pytania otwierające",
  "Podaj ćwiczenie psychoedukacyjne",
  "Ułóż krótki plan pracy",
  "Wskaż ograniczenia i sygnały ostrożności",
] as const;

export type AiChatIntent = (typeof aiChatIntents)[number];
