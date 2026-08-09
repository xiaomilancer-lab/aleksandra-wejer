"use server";

import { revalidatePath } from "next/cache";
import type { PatientMemoryInput } from "../domain";
import { createPatientMemory, deletePatientMemory, updatePatientMemory } from "../services/patientMemoryService";
import { requirePsychologist } from "../server/requirePsychologist";

export async function savePatientMemoryAction(input: PatientMemoryInput, memoryId?: string) {
  await requirePsychologist();
  if (!input.title.trim()) throw new Error("Uzupełnij tytuł pamięci.");
  const memory = memoryId ? await updatePatientMemory(memoryId, input) : await createPatientMemory(input);
  revalidatePath(`/panel/patients/${input.patientId}`);
  return memory;
}

export async function deletePatientMemoryAction(memoryId: string, patientId: string) {
  await requirePsychologist();
  await deletePatientMemory(memoryId);
  revalidatePath(`/panel/patients/${patientId}`);
}
