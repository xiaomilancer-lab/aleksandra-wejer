import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { KnowledgeMaterial, KnowledgeMaterialInput } from "../domain";

const materialFields = "id, title, category, description, tags, content, is_pinned, created_at, updated_at";

function isLibraryMissing(errorCode: string | undefined) { return errorCode === "42P01" || errorCode === "42703"; }
function toRecord(input: KnowledgeMaterialInput) { return { title: input.title.trim(), category: input.category, description: input.description.trim(), tags: input.tags.map((tag) => tag.trim()).filter(Boolean), content: input.content.trim(), is_pinned: input.isPinned }; }

export async function getKnowledgeMaterials(): Promise<KnowledgeMaterial[]> {
  const { data, error } = await supabaseAdmin.from("knowledge_library").select(materialFields).order("updated_at", { ascending: false });
  if (error) { if (isLibraryMissing(error.code)) return []; throw error; }
  return (data ?? []) as KnowledgeMaterial[];
}

export async function createKnowledgeMaterial(input: KnowledgeMaterialInput): Promise<KnowledgeMaterial> {
  const { data, error } = await supabaseAdmin.from("knowledge_library").insert(toRecord(input)).select(materialFields).single();
  if (error) throw error;
  return data as KnowledgeMaterial;
}

export async function updateKnowledgeMaterial(id: string, input: KnowledgeMaterialInput): Promise<KnowledgeMaterial> {
  const { data, error } = await supabaseAdmin.from("knowledge_library").update({ ...toRecord(input), updated_at: new Date().toISOString() }).eq("id", id).select(materialFields).single();
  if (error) throw error;
  return data as KnowledgeMaterial;
}

export async function deleteKnowledgeMaterial(id: string) {
  const { error } = await supabaseAdmin.from("knowledge_library").delete().eq("id", id);
  if (error) throw error;
}

export async function getVisitKnowledgeMaterials(visitId: number): Promise<KnowledgeMaterial[]> {
  const { data, error } = await supabaseAdmin.from("visit_knowledge_materials").select("knowledge_library(" + materialFields + ")").eq("visit_id", visitId).order("created_at", { ascending: false });
  if (error) { if (isLibraryMissing(error.code)) return []; throw error; }
  const rows = (data ?? []) as unknown as Array<{ knowledge_library: KnowledgeMaterial | null }>;
  return rows.flatMap((item) => item.knowledge_library ? [item.knowledge_library] : []);
}

export async function getKnowledgeMaterialsForVisits(visitIds: number[]): Promise<KnowledgeMaterial[]> {
  if (!visitIds.length) return [];
  const { data, error } = await supabaseAdmin.from("visit_knowledge_materials").select("knowledge_library(" + materialFields + ")").in("visit_id", visitIds).order("created_at", { ascending: false });
  if (error) { if (isLibraryMissing(error.code)) return []; throw error; }
  const rows = (data ?? []) as unknown as Array<{ knowledge_library: KnowledgeMaterial | null }>;
  return [...new Map(rows.flatMap((item) => item.knowledge_library ? [[item.knowledge_library.id, item.knowledge_library] as const] : []).map(([id, material]) => [id, material])).values()];
}

export async function pinKnowledgeMaterialToVisit(visitId: number, materialId: string) {
  const { error } = await supabaseAdmin.from("visit_knowledge_materials").upsert({ visit_id: visitId, knowledge_id: materialId }, { onConflict: "visit_id,knowledge_id", ignoreDuplicates: true });
  if (error) throw error;
}

export async function unpinKnowledgeMaterialFromVisit(visitId: number, materialId: string) {
  const { error } = await supabaseAdmin.from("visit_knowledge_materials").delete().eq("visit_id", visitId).eq("knowledge_id", materialId);
  if (error) throw error;
}
