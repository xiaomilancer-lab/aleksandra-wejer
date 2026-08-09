"use server";

import { revalidatePath } from "next/cache";
import type { MoodEntryInput } from "../domain";
import { getMoodEntries, saveMoodEntry } from "../services/moodEntryService";
import { requirePsychologist } from "../server/requirePsychologist";

export async function getMoodEntriesAction(patientId: string, days: number) {
  await requirePsychologist();
  return getMoodEntries(patientId, days);
}

export async function saveMoodEntryAction(input: MoodEntryInput) {
  await requirePsychologist();
  const entry = await saveMoodEntry(input);
  revalidatePath(`/panel/patients/${input.patientId}`);
  revalidatePath("/panel");
  return entry;
}
