"use server";

import { revalidatePath } from "next/cache";
import type { ReflectionCardInput } from "../domain";
import { createReflectionCard, updateReflectionCard } from "../services/clinicalReflectionService";
import { requirePatientVaultAccess } from "../server/patientVault";

export async function saveReflectionCardAction(input: ReflectionCardInput, cardId?: string) {
  await requirePatientVaultAccess();
  if (!input.title.trim()) throw new Error("Uzupełnij tytuł refleksji.");
  const card = cardId ? await updateReflectionCard(cardId, input) : await createReflectionCard(input);
  revalidatePath(`/panel/patients/${input.patientId}`);
  return card;
}
