import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { VisitPlan, VisitPlanInput } from "../domain";

const planFields = "id, visit_id, patient_id, main_goal, secondary_goal, topics_to_discuss, homework_to_review, materials_to_prepare, own_notes, created_at, updated_at";
const isPlanTableMissing = (code: string | undefined) => code === "42P01";

export async function getVisitPlan(visitId: number): Promise<VisitPlan | null> {
  const { data, error } = await supabaseAdmin.from("visit_plan").select(planFields).eq("visit_id", visitId).maybeSingle();
  if (error) { if (isPlanTableMissing(error.code)) return null; throw error; }
  return data as VisitPlan | null;
}

export async function getLatestPatientVisitPlan(patientId: string): Promise<VisitPlan | null> {
  const { data, error } = await supabaseAdmin.from("visit_plan").select(planFields).eq("patient_id", patientId).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) { if (isPlanTableMissing(error.code)) return null; throw error; }
  return data as VisitPlan | null;
}

export async function getPatientVisitPlans(patientId: string): Promise<VisitPlan[]> {
  const { data, error } = await supabaseAdmin.from("visit_plan").select(planFields).eq("patient_id", patientId).order("updated_at", { ascending: false });
  if (error) { if (isPlanTableMissing(error.code)) return []; throw error; }
  return (data ?? []) as VisitPlan[];
}

export async function saveVisitPlan(input: VisitPlanInput): Promise<VisitPlan> {
  const { data, error } = await supabaseAdmin.from("visit_plan").insert(toRecord(input)).select(planFields).single();
  if (error) throw error;
  return data as VisitPlan;
}

export async function updateVisitPlan(planId: string, input: VisitPlanInput): Promise<VisitPlan> {
  const { data, error } = await supabaseAdmin.from("visit_plan").update({ ...toRecord(input), updated_at: new Date().toISOString() }).eq("id", planId).select(planFields).single();
  if (error) throw error;
  return data as VisitPlan;
}

function toRecord(input: VisitPlanInput) { return { visit_id: input.visitId, patient_id: input.patientId, main_goal: input.mainGoal.trim(), secondary_goal: input.secondaryGoal.trim(), topics_to_discuss: input.topicsToDiscuss.trim(), homework_to_review: input.homeworkToReview.trim(), materials_to_prepare: input.materialsToPrepare.trim(), own_notes: input.ownNotes.trim() }; }
