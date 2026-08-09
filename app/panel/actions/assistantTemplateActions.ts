"use server";

import { revalidatePath } from "next/cache";
import { getTemplateById, updateTemplate } from "../services/assistantService";
import { requirePsychologist } from "../server/requirePsychologist";

export async function toggleAssistantTemplateFavoriteAction(templateId: string) {
  await requirePsychologist();
  const template = await getTemplateById(templateId);
  if (!template) throw new Error("Nie znaleziono szablonu.");
  await updateTemplate(templateId, { title: template.title, category: template.category, ageGroup: template.age_group, problemKeywords: template.problem_keywords, description: template.description, interviewChecklist: template.interview_checklist, observationPoints: template.observation_points, recommendedMaterials: template.recommended_materials, homeworkExamples: template.homework_examples, notes: template.notes, isFavorite: !template.is_favorite });
  revalidatePath("/panel");
}
