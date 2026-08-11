export const VISIT_STATUSES = [
  "Nowe",
  "Potwierdzone",
  "Zrealizowane",
  "Odwołane",
  "Nie pojawił się",
] as const;

export type VisitStatus = (typeof VISIT_STATUSES)[number];

export function isVisitStatus(value: unknown): value is VisitStatus {
  return typeof value === "string" && VISIT_STATUSES.includes(value as VisitStatus);
}

export function isCancelledVisitStatus(status: string | null | undefined) {
  return status === "Odwołane";
}
