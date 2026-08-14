"use server";

import { revalidatePath } from "next/cache";
import { VISIT_RECORD_KINDS, type VisitRecordKind } from "../domain/booking";
import { requirePsychologist } from "../server/requirePsychologist";
import { updateVisitRecordKind } from "../services/visitOrganizerService";
import { createHistoricalVisit } from "../services/visitOrganizerService";

export interface HistoricalVisitInput {
  patientId: string | null;
  name: string;
  phone: string;
  email: string;
  visitDate: string;
  visitTime: string;
  locationId: "arthro-cure-clinic" | "nowa-wies-rzeczna";
  description: string;
}

export async function classifyVisitAction(id: number, recordKind: VisitRecordKind) {
  await requirePsychologist();
  if (!Number.isInteger(id) || id < 1 || !VISIT_RECORD_KINDS.includes(recordKind)) throw new Error("Nieprawidłowe dane wizyty.");
  await updateVisitRecordKind(id, recordKind);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
}

export async function createHistoricalVisitAction(input: HistoricalVisitInput) {
  await requirePsychologist();
  if (!input.patientId && !input.name.trim()) throw new Error("Wpisz imię i nazwisko pacjenta.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate)) throw new Error("Wybierz prawidłową datę.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.visitTime)) throw new Error("Wybierz prawidłową godzinę.");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
  if (input.visitDate > today) throw new Error("Wizyta historyczna nie może mieć przyszłej daty.");
  await createHistoricalVisit(input);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
}
