import type { KnowledgeMaterial } from "../domain";

const SEARCH_ALIASES: Record<string, string[]> = {
  adhd: ["koncentracja", "uwaga", "impulsywnosc", "funkcje wykonawcze", "organizacja"],
  autyzm: ["spektrum", "asd", "sensoryka", "komunikacja"],
  asperger: ["spektrum", "autyzm", "asd", "relacje spoleczne"],
  mutyzm: ["mowienie", "komunikacja", "lek", "cisza"],
  zaloba: ["strata", "smierc", "wspomnienia", "rodzina"],
  rozwod: ["rozstanie rodzicow", "rodzina", "dziecko", "zmiana"],
  lek: ["niepokoj", "zmartwienia", "napiecie", "uziemienie"],
  depresja: ["nastroj", "smutek", "energia", "bezpieczenstwo"],
  para: ["zwiazek", "malzenstwo", "konflikt", "komunikacja"],
  nastolatek: ["mlodziez", "rowiesnicy", "tozsamosc", "13 18 lat"],
  dziecko: ["dzieci", "zabawa", "obrazkowe", "6 12 lat"],
  dorosly: ["dorosli", "stres", "granice", "relacje"],
  emocje: ["uczucia", "samoregulacja", "cialo", "potrzeby"],
};

export function normalizeKnowledgeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pl-PL")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function queryTerms(query: string) {
  const normalized = normalizeKnowledgeSearch(query);
  if (!normalized) return [];

  const directTerms = normalized.split(/\s+/).filter((term) => term.length > 1);
  const expanded = directTerms.flatMap((term) => [term, ...(SEARCH_ALIASES[term] ?? [])]);
  return [...new Set(expanded.map(normalizeKnowledgeSearch).filter(Boolean))];
}

function fieldScore(field: string, terms: string[], weight: number) {
  const normalized = normalizeKnowledgeSearch(field);
  return terms.reduce((score, term) => score + (normalized.includes(term) ? weight : 0), 0);
}

export function knowledgeSearchScore(material: KnowledgeMaterial, query: string) {
  const terms = queryTerms(query);
  if (terms.length === 0) return 1;

  const direct = normalizeKnowledgeSearch(query);
  const title = normalizeKnowledgeSearch(material.title);
  let score = title.includes(direct) ? 40 : 0;
  score += fieldScore(material.title, terms, 12);
  score += fieldScore(material.category, terms, 9);
  score += fieldScore(material.tags.join(" "), terms, 7);
  score += fieldScore(material.description, terms, 4);
  score += fieldScore(material.content, terms, 1);
  return score;
}

export function searchKnowledgeMaterials(materials: KnowledgeMaterial[], query: string) {
  if (!query.trim()) return materials;
  return materials
    .map((material, index) => ({ material, index, score: knowledgeSearchScore(material, query) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((entry) => entry.material);
}
