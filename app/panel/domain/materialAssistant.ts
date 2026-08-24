import type { KnowledgeCategory, KnowledgeMaterialInput } from "./knowledgeLibrary";

export const materialAgeGroups = ["Dziecko 5–8 lat", "Dziecko 9–12 lat", "Nastolatek 13–17 lat", "Dorosły", "Para / rodzina"] as const;
export type MaterialAgeGroup = (typeof materialAgeGroups)[number];

export const materialTopics = [
  "Emocje i samoregulacja",
  "Relacje rówieśnicze",
  "ADHD i funkcje wykonawcze",
  "Spektrum i potrzeby sensoryczne",
  "Komunikacja bez nacisku",
  "Zmiana, strata i żałoba",
  "Lęk i poczucie bezpieczeństwa",
  "Granice i potrzeby",
  "Relacja pary / rodziny",
  "Mocne strony i rozwój",
] as const;
export type MaterialTopic = (typeof materialTopics)[number];

export const materialObjectives = [
  "Nazwanie doświadczeń",
  "Rozpoznanie potrzeb",
  "Ćwiczenie proszenia o wsparcie",
  "Plan małego kroku",
  "Psychoedukacja",
  "Współpraca i komunikacja",
  "Ćwiczenie do domu",
] as const;
export type MaterialObjective = (typeof materialObjectives)[number];

export const materialFormats = [
  "Kolorowe scenki obrazkowe",
  "Gra i karty",
  "Arkusz do wydruku",
  "Plan ćwiczenia podczas wizyty",
] as const;
export type MaterialFormat = (typeof materialFormats)[number];

export type GeneratedMaterialDraft = Omit<KnowledgeMaterialInput, "isPinned"> & {
  kind: "professional" | "home";
  category: KnowledgeCategory;
};

export type GeneratedMaterialPackage = {
  summary: string;
  safetyNote: string;
  professionalMaterial: GeneratedMaterialDraft;
  homeMaterial: GeneratedMaterialDraft;
};
