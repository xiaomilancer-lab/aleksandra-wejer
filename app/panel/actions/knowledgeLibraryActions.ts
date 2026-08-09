"use server";

import { revalidatePath } from "next/cache";
import type { KnowledgeMaterialInput } from "../domain";
import { createKnowledgeMaterial, deleteKnowledgeMaterial, getKnowledgeMaterials, getVisitKnowledgeMaterials, pinKnowledgeMaterialToVisit, unpinKnowledgeMaterialFromVisit, updateKnowledgeMaterial } from "../services/knowledgeLibraryService";
import { requirePsychologist } from "../server/requirePsychologist";

function validate(input: KnowledgeMaterialInput) { if (!input.title.trim()) throw new Error("Uzupełnij tytuł materiału."); }
export async function getKnowledgeMaterialsAction() { await requirePsychologist(); return getKnowledgeMaterials(); }
export async function getVisitKnowledgeMaterialsAction(visitId: number) { await requirePsychologist(); return getVisitKnowledgeMaterials(visitId); }
export async function createKnowledgeMaterialAction(input: KnowledgeMaterialInput) { await requirePsychologist(); validate(input); const material = await createKnowledgeMaterial(input); revalidatePath("/panel/library"); return material; }
export async function updateKnowledgeMaterialAction(id: string, input: KnowledgeMaterialInput) { await requirePsychologist(); validate(input); const material = await updateKnowledgeMaterial(id, input); revalidatePath("/panel/library"); return material; }
export async function deleteKnowledgeMaterialAction(id: string) { await requirePsychologist(); await deleteKnowledgeMaterial(id); revalidatePath("/panel/library"); }
export async function pinKnowledgeMaterialToVisitAction(visitId: number, materialId: string) { await requirePsychologist(); await pinKnowledgeMaterialToVisit(visitId, materialId); revalidatePath("/panel"); }
export async function unpinKnowledgeMaterialFromVisitAction(visitId: number, materialId: string) { await requirePsychologist(); await unpinKnowledgeMaterialFromVisit(visitId, materialId); revalidatePath("/panel"); }
