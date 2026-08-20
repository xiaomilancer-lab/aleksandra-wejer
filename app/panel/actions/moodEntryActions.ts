"use server";

import { revalidatePath } from "next/cache";
import type { MoodEntryInput } from "../domain";
import { getMoodEntries, saveMoodEntry } from "../services/moodEntryService";
import { requirePatientVaultAccess } from "../server/patientVault";

export async function getMoodEntriesAction(patientId: string, days: number) {
  await requirePatientVaultAccess();
  return getMoodEntries(patientId, days);
}

export async function saveMoodEntryAction(input: MoodEntryInput) {
  await requirePatientVaultAccess();
  const entry = await saveMoodEntry(input);
  revalidatePath(`/panel/patients/${input.patientId}`);
  revalidatePath("/panel");
  return entry;
}
