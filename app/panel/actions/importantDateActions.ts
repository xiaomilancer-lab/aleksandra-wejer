"use server";

import { revalidatePath } from "next/cache";
import type { ImportantDateInput, ImportantDateOccasion } from "../domain";
import { createImportantDate, deleteImportantDate, setImportantDateCompletion, updateImportantDate } from "../services/importantDateService";
import { requirePsychologist } from "../server/requirePsychologist";

const occasions: ImportantDateOccasion[] = ["birthday", "anniversary", "holiday", "celebration", "other"];
const allowedReminderDays = [30, 14, 7, 1, 0];

export async function saveImportantDateAction(id: string | null, input: ImportantDateInput) {
  await requirePsychologist();
  validate(input);
  const item = id ? await updateImportantDate(id, input) : await createImportantDate(input);
  revalidateImportantDates();
  return item;
}

export async function deleteImportantDateAction(id: string) {
  await requirePsychologist();
  if (!id) throw new Error("Brak daty do usunięcia.");
  await deleteImportantDate(id);
  revalidateImportantDates();
}

export async function completeImportantDateAction(id: string, occurrenceDate: string, completed: boolean) {
  await requirePsychologist();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurrenceDate)) throw new Error("Nieprawidłowa data okazji.");
  const item = await setImportantDateCompletion(id, completed ? occurrenceDate : null);
  revalidateImportantDates();
  return item;
}

function validate(input: ImportantDateInput) {
  if (!input.title.trim()) throw new Error("Wpisz nazwę ważnej daty.");
  if (input.title.trim().length > 120) throw new Error("Nazwa może mieć maksymalnie 120 znaków.");
  if (!occasions.includes(input.occasion)) throw new Error("Wybierz prawidłowy rodzaj okazji.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.eventDate) || Number.isNaN(Date.parse(`${input.eventDate}T00:00:00Z`))) throw new Error("Wybierz prawidłową datę.");
  if (input.reminderDays.some((day) => !allowedReminderDays.includes(day))) throw new Error("Wybrano nieprawidłowy termin przypomnienia.");
}

function revalidateImportantDates() {
  revalidatePath("/panel");
  revalidatePath("/panel/important-dates");
}
