export const psycholkaRareMoments = [
  "peek_from_card",
  "adjust_coffee",
  "straighten_book",
  "water_plant",
  "look_for_pencil",
  "look_for_shoes",
  "private_smile",
] as const;

export type PsycholkaRareMoment = (typeof psycholkaRareMoments)[number];

export function getRareMomentDelay() {
  return 900_000 + Math.floor(Math.random() * 900_000);
}

export function getRareMomentDuration() {
  return 2_000 + Math.floor(Math.random() * 2_001);
}

export function pickRareMoment(previous: PsycholkaRareMoment | null): PsycholkaRareMoment {
  const available = psycholkaRareMoments.filter((moment) => moment !== previous);
  return available[Math.floor(Math.random() * available.length)]!;
}

// TODO: Map each rare moment to a dedicated approved PsychOLKA asset before adding richer gestures.
