"use server";

import { revalidatePath } from "next/cache";
import type { KnowledgeMaterialInput } from "../domain";
import { STARTER_KNOWLEDGE_MATERIALS } from "../data/starterKnowledgeMaterials";
import { createKnowledgeMaterial, deleteKnowledgeMaterial, getKnowledgeMaterialById, getKnowledgeMaterials, getVisitKnowledgeMaterials, pinKnowledgeMaterialToVisit, unpinKnowledgeMaterialFromVisit, updateKnowledgeMaterial } from "../services/knowledgeLibraryService";
import { requirePsychologist } from "../server/requirePsychologist";
import { requirePatientVaultAccess } from "../server/patientVault";

function validate(input: KnowledgeMaterialInput) { if (!input.title.trim()) throw new Error("Uzupełnij tytuł materiału."); }
export async function getKnowledgeMaterialsAction() { await requirePsychologist(); return getKnowledgeMaterials(); }
export async function getVisitKnowledgeMaterialsAction(visitId: number) { await requirePatientVaultAccess(); return getVisitKnowledgeMaterials(visitId); }
export async function createKnowledgeMaterialAction(input: KnowledgeMaterialInput) { await requirePsychologist(); validate(input); const material = await createKnowledgeMaterial(input); revalidatePath("/panel/library"); return material; }
export async function updateKnowledgeMaterialAction(id: string, input: KnowledgeMaterialInput) { await requirePsychologist(); validate(input); const material = await updateKnowledgeMaterial(id, input); revalidatePath("/panel/library"); return material; }
export async function deleteKnowledgeMaterialAction(id: string) { await requirePsychologist(); await deleteKnowledgeMaterial(id); revalidatePath("/panel/library"); }
export async function pinKnowledgeMaterialToVisitAction(visitId: number, materialId: string) { await requirePatientVaultAccess(); await pinKnowledgeMaterialToVisit(visitId, materialId); revalidatePath("/panel"); }
export async function unpinKnowledgeMaterialFromVisitAction(visitId: number, materialId: string) { await requirePatientVaultAccess(); await unpinKnowledgeMaterialFromVisit(visitId, materialId); revalidatePath("/panel"); }

export async function assignKnowledgeMaterialToVisitAction(visitId: number, materialId: string) {
  await requirePatientVaultAccess();
  if (!Number.isInteger(visitId) || visitId < 1) throw new Error("Nieprawidłowa wizyta.");

  let material = await getKnowledgeMaterialById(materialId);
  if (!material && materialId.startsWith("starter-")) {
    const starter = STARTER_KNOWLEDGE_MATERIALS.find((item) => item.id === materialId);
    if (!starter) throw new Error("Nie znaleziono materiału.");
    const existingCopy = (await getKnowledgeMaterials()).find((item) => item.title === starter.title && item.content === starter.content);
    material = existingCopy ?? await createKnowledgeMaterial({
        title: starter.title,
        category: starter.category,
        description: starter.description,
        tags: [...new Set([...starter.tags, "z pakietu PsychOLKI"])],
        content: starter.content,
        isPinned: false,
      });
  }
  if (!material) throw new Error("Nie znaleziono materiału.");
  await pinKnowledgeMaterialToVisit(visitId, material.id);
  revalidatePath(`/panel/visits/${visitId}/session`);
  revalidatePath("/panel/library");
  return material;
}

export async function saveGeneratedMaterialForVisitAction(visitId: number, input: KnowledgeMaterialInput) {
  await requirePatientVaultAccess();
  if (!Number.isInteger(visitId) || visitId < 1) throw new Error("Nieprawidłowa wizyta.");
  validate(input);
  const material = await createKnowledgeMaterial({ ...input, isPinned: false });
  await pinKnowledgeMaterialToVisit(visitId, material.id);
  revalidatePath(`/panel/visits/${visitId}/session`);
  revalidatePath("/panel/library");
  return material;
}
