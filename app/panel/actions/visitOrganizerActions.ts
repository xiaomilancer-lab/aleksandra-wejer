"use server";

import { revalidatePath } from "next/cache";
import { VISIT_RECORD_KINDS, type VisitRecordKind } from "../domain/booking";
import { requirePsychologist } from "../server/requirePsychologist";
import { updateVisitRecordKind } from "../services/visitOrganizerService";

export async function classifyVisitAction(id: number, recordKind: VisitRecordKind) {
  await requirePsychologist();
  if (!Number.isInteger(id) || id < 1 || !VISIT_RECORD_KINDS.includes(recordKind)) throw new Error("Nieprawidłowe dane wizyty.");
  await updateVisitRecordKind(id, recordKind);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
}
