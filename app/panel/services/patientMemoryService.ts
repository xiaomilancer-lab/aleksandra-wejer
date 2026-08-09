import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { PatientMemory, PatientMemoryInput } from "../domain";

const fields = "id, patient_id, category, title, content, is_pinned, created_at, updated_at";
const isTableMissing = (code: string | undefined) => code === "42P01";
export async function getPatientMemory(patientId: string): Promise<PatientMemory[]> { const { data, error } = await supabaseAdmin.from("patient_memory").select(fields).eq("patient_id", patientId).order("is_pinned", { ascending: false }).order("updated_at", { ascending: false }); if (error) { if (isTableMissing(error.code)) return []; throw error; } return (data ?? []) as PatientMemory[]; }
export async function getPinnedPatientMemory(patientId: string): Promise<PatientMemory[]> { const { data, error } = await supabaseAdmin.from("patient_memory").select(fields).eq("patient_id", patientId).eq("is_pinned", true).order("updated_at", { ascending: false }); if (error) { if (isTableMissing(error.code)) return []; throw error; } return (data ?? []) as PatientMemory[]; }
export async function createPatientMemory(input: PatientMemoryInput): Promise<PatientMemory> { const { data, error } = await supabaseAdmin.from("patient_memory").insert(toRecord(input)).select(fields).single(); if (error) throw error; return data as PatientMemory; }
export async function updatePatientMemory(memoryId: string, input: PatientMemoryInput): Promise<PatientMemory> { const { data, error } = await supabaseAdmin.from("patient_memory").update({ ...toRecord(input), updated_at: new Date().toISOString() }).eq("id", memoryId).select(fields).single(); if (error) throw error; return data as PatientMemory; }
export async function deletePatientMemory(memoryId: string): Promise<void> { const { error } = await supabaseAdmin.from("patient_memory").delete().eq("id", memoryId); if (error) throw error; }
function toRecord(input: PatientMemoryInput) { return { patient_id: input.patientId, category: input.category, title: input.title.trim(), content: input.content.trim(), is_pinned: input.isPinned }; }
