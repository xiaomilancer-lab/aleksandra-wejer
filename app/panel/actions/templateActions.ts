"use server";

import { revalidatePath } from "next/cache";
import type { VisitTemplateInput } from "../domain";
import { createTemplate, deleteTemplate, updateTemplate } from "../services/templateService";
import { requirePsychologist } from "../server/requirePsychologist";

function validateTemplate(input: VisitTemplateInput) {
  if (!input.title.trim() || !input.category.trim()) {
    throw new Error("Uzupełnij nazwę i kategorię szablonu.");
  }
}

export async function createTemplateAction(input: VisitTemplateInput) {
  await requirePsychologist();
  validateTemplate(input);
  const template = await createTemplate(input);
  revalidatePath("/panel/templates");
  return template;
}

export async function updateTemplateAction(templateId: string, input: VisitTemplateInput) {
  await requirePsychologist();
  validateTemplate(input);
  const template = await updateTemplate(templateId, input);
  revalidatePath("/panel/templates");
  return template;
}

export async function deleteTemplateAction(templateId: string) {
  await requirePsychologist();
  await deleteTemplate(templateId);
  revalidatePath("/panel/templates");
}
