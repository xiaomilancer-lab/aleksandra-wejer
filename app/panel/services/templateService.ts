import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { VisitTemplate, VisitTemplateInput } from "../domain";

const templateFields =
  "id, title, category, description, note_template, homework_template, is_favorite, created_at, updated_at";

function isTemplatesTableMissing(errorCode: string | undefined) {
  return errorCode === "42P01";
}

export async function getTemplates(): Promise<VisitTemplate[]> {
  const { data, error } = await supabaseAdmin
    .from("visit_templates")
    .select(templateFields)
    .order("title", { ascending: true });

  if (error) {
    // TODO: Run create_visit_templates.sql before enabling templates in an environment.
    if (isTemplatesTableMissing(error.code)) return [];
    throw error;
  }

  return (data ?? []) as VisitTemplate[];
}

export async function getFavoriteTemplates(): Promise<VisitTemplate[]> {
  const { data, error } = await supabaseAdmin
    .from("visit_templates")
    .select(templateFields)
    .eq("is_favorite", true)
    .order("title", { ascending: true });

  if (error) {
    // TODO: Run create_visit_templates.sql before enabling templates in an environment.
    if (isTemplatesTableMissing(error.code)) return [];
    throw error;
  }

  return (data ?? []) as VisitTemplate[];
}

export async function createTemplate(input: VisitTemplateInput): Promise<VisitTemplate> {
  const { data, error } = await supabaseAdmin
    .from("visit_templates")
    .insert(toTemplateRecord(input))
    .select(templateFields)
    .single();

  if (error) throw error;
  return data as VisitTemplate;
}

export async function updateTemplate(
  templateId: string,
  input: VisitTemplateInput
): Promise<VisitTemplate> {
  const { data, error } = await supabaseAdmin
    .from("visit_templates")
    .update({ ...toTemplateRecord(input), updated_at: new Date().toISOString() })
    .eq("id", templateId)
    .select(templateFields)
    .single();

  if (error) throw error;
  return data as VisitTemplate;
}

export async function deleteTemplate(templateId: string): Promise<void> {
  const { error } = await supabaseAdmin.from("visit_templates").delete().eq("id", templateId);
  if (error) throw error;
}

function toTemplateRecord(input: VisitTemplateInput) {
  return {
    title: input.title.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    note_template: input.noteTemplate.trim(),
    homework_template: input.homeworkTemplate.trim(),
    is_favorite: input.isFavorite,
  };
}
