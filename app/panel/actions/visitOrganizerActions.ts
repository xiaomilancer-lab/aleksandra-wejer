"use server";

import { revalidatePath } from "next/cache";
import { VISIT_RECORD_KINDS, type VisitRecordKind } from "../domain/booking";
import { isVisitStatus, type VisitStatus } from "../domain/status";
import { requirePatientVaultAccess } from "../server/patientVault";
import { updateVisitRecordKind } from "../services/visitOrganizerService";
import { createHistoricalVisit, createManualVisit } from "../services/visitOrganizerService";

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

export interface ManualVisitInput extends HistoricalVisitInput {
  status: VisitStatus;
}

function validateVisitInput(input: HistoricalVisitInput) {
  if (!input.patientId && !input.name.trim()) throw new Error("Wpisz imię i nazwisko pacjenta.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate)) throw new Error("Wybierz prawidłową datę.");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.visitTime)) throw new Error("Wybierz prawidłową godzinę.");

  const [year, month, day] = input.visitDate.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error("Wybierz prawidłową datę.");
  }
}

export async function classifyVisitAction(id: number, recordKind: VisitRecordKind) {
  await requirePatientVaultAccess();
  if (!Number.isInteger(id) || id < 1 || !VISIT_RECORD_KINDS.includes(recordKind)) throw new Error("Nieprawidłowe dane wizyty.");
  await updateVisitRecordKind(id, recordKind);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
}

export async function createHistoricalVisitAction(input: HistoricalVisitInput) {
  await requirePatientVaultAccess();
  validateVisitInput(input);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
  if (input.visitDate > today) throw new Error("Wizyta historyczna nie może mieć przyszłej daty.");
  await createHistoricalVisit(input);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
}

export async function createManualVisitAction(input: ManualVisitInput) {
  await requirePatientVaultAccess();
  validateVisitInput(input);
  if (!isVisitStatus(input.status)) throw new Error("Wybierz prawidłowy status wizyty.");
  await createManualVisit(input);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
}
