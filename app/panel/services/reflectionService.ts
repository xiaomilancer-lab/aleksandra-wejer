import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { VisitReflection, VisitReflectionInput } from "../domain";

const reflectionFields = "id, visit_id, patient_id, mood_level, energy_level, engagement_level, reflection, created_at, updated_at";

function isReflectionsTableMissing(errorCode: string | undefined) {
  return errorCode === "42P01";
}

export async function getReflection(visitId: number): Promise<VisitReflection | null> {
  const { data, error } = await supabaseAdmin.from("visit_reflections").select(reflectionFields).eq("visit_id", visitId).maybeSingle();
  if (error) {
    // TODO: Run create_visit_reflection.sql before enabling Emotion Journey.
    if (isReflectionsTableMissing(error.code)) return null;
    throw error;
  }
  return data as VisitReflection | null;
}

export async function getPatientReflections(patientId: string): Promise<VisitReflection[]> {
  const { data, error } = await supabaseAdmin.from("visit_reflections").select(reflectionFields).eq("patient_id", patientId).order("created_at", { ascending: false });
  if (error) {
    // TODO: Run create_visit_reflection.sql before enabling Emotion Journey.
    if (isReflectionsTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as VisitReflection[];
}

export async function saveReflection(input: VisitReflectionInput): Promise<VisitReflection> {
  const { data, error } = await supabaseAdmin.from("visit_reflections").insert(toRecord(input)).select(reflectionFields).single();
  if (error) throw error;
  return data as VisitReflection;
}

export async function updateReflection(reflectionId: string, input: VisitReflectionInput): Promise<VisitReflection> {
  const { data, error } = await supabaseAdmin.from("visit_reflections").update({ ...toRecord(input), updated_at: new Date().toISOString() }).eq("id", reflectionId).select(reflectionFields).single();
  if (error) throw error;
  return data as VisitReflection;
}

function toRecord(input: VisitReflectionInput) {
  validateLevel(input.moodLevel, "Nastrój");
  validateLevel(input.energyLevel, "Energia");
  validateLevel(input.engagementLevel, "Zaangażowanie");
  return { visit_id: input.visitId, patient_id: input.patientId, mood_level: input.moodLevel, energy_level: input.energyLevel, engagement_level: input.engagementLevel, reflection: input.reflection.trim() };
}

function validateLevel(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error(`${label} musi mieć wartość od 1 do 5.`);
}
