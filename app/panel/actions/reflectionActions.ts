"use server";

import { revalidatePath } from "next/cache";
import type { VisitReflectionInput } from "../domain";
import { getReflection, saveReflection, updateReflection } from "../services/reflectionService";
import { requirePatientVaultAccess } from "../server/patientVault";

export async function getReflectionAction(visitId: number) {
  await requirePatientVaultAccess();
  return getReflection(visitId);
}

export async function saveReflectionAction(input: VisitReflectionInput, reflectionId?: string) {
  await requirePatientVaultAccess();
  const reflection = reflectionId ? await updateReflection(reflectionId, input) : await saveReflection(input);
  revalidatePath("/panel");
  revalidatePath(`/panel/patients/${input.patientId}`);
  return reflection;
}
