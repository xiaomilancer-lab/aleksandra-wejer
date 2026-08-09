import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { AssistantTemplate, AssistantTemplateInput, AssistantTemplateSearch } from "../domain";

const templateFields = "id, title, category, age_group, problem_keywords, description, interview_checklist, observation_points, recommended_materials, homework_examples, notes, is_favorite, created_at, updated_at";

function isTemplatesTableMissing(errorCode: string | undefined) {
  return errorCode === "42P01";
}

export async function getTemplates(): Promise<AssistantTemplate[]> {
  const { data, error } = await supabaseAdmin.from("assistant_templates").select(templateFields).order("title", { ascending: true });
  if (error) {
    // TODO: Run create_assistant_templates.sql before enabling this module in an environment.
    if (isTemplatesTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as AssistantTemplate[];
}

export async function getTemplateById(templateId: string): Promise<AssistantTemplate | null> {
  const { data, error } = await supabaseAdmin.from("assistant_templates").select(templateFields).eq("id", templateId).maybeSingle();
  if (error) {
    // TODO: Run create_assistant_templates.sql before enabling this module in an environment.
    if (isTemplatesTableMissing(error.code)) return null;
    throw error;
  }
  return data as AssistantTemplate | null;
}

export async function searchTemplates(filters: AssistantTemplateSearch): Promise<AssistantTemplate[]> {
  let query = supabaseAdmin.from("assistant_templates").select(templateFields).order("title", { ascending: true });
  if (filters.category?.trim()) query = query.ilike("category", `%${filters.category.trim()}%`);
  if (filters.ageGroup?.trim()) query = query.ilike("age_group", `%${filters.ageGroup.trim()}%`);
  if (filters.keywords?.length) query = query.overlaps("problem_keywords", filters.keywords.filter(Boolean));
  const { data, error } = await query;
  if (error) {
    // TODO: Run create_assistant_templates.sql before enabling this module in an environment.
    if (isTemplatesTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as AssistantTemplate[];
}

export async function createTemplate(input: AssistantTemplateInput): Promise<AssistantTemplate> {
  const { data, error } = await supabaseAdmin.from("assistant_templates").insert(toRecord(input)).select(templateFields).single();
  if (error) throw error;
  return data as AssistantTemplate;
}

export async function updateTemplate(templateId: string, input: AssistantTemplateInput): Promise<AssistantTemplate> {
  const { data, error } = await supabaseAdmin.from("assistant_templates").update({ ...toRecord(input), updated_at: new Date().toISOString() }).eq("id", templateId).select(templateFields).single();
  if (error) throw error;
  return data as AssistantTemplate;
}

export async function deleteTemplate(templateId: string): Promise<void> {
  const { error } = await supabaseAdmin.from("assistant_templates").delete().eq("id", templateId);
  if (error) throw error;
}

function toRecord(input: AssistantTemplateInput) {
  return { title: input.title.trim(), category: input.category.trim(), age_group: input.ageGroup.trim(), problem_keywords: input.problemKeywords.map((keyword) => keyword.trim()).filter(Boolean), description: input.description.trim(), interview_checklist: input.interviewChecklist.trim(), observation_points: input.observationPoints.trim(), recommended_materials: input.recommendedMaterials.trim(), homework_examples: input.homeworkExamples.trim(), notes: input.notes.trim(), is_favorite: input.isFavorite ?? false };
}
