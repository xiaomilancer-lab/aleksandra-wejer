import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { AssistantTemplate, Patient, PatientNote, PatientTask, ReflectionCard, Visit, VisitPlan } from "../domain";
import { getTemplates } from "./assistantService";
import { getPinnedReflectionCards } from "./clinicalReflectionService";
import { getPatientById, getPatientNotes, getPatientTasks } from "./patientService";
import { getVisitPlan } from "./visitPlanService";
import { getVisitBrief, type VisitBriefData } from "./visitBriefService";

export interface VisitSessionData { visit: Visit; patient: Patient | null; brief: VisitBriefData | null; plan: VisitPlan | null; notes: PatientNote[]; tasks: PatientTask[]; pinnedReflections: ReflectionCard[]; assistantTemplates: AssistantTemplate[]; }

export async function getVisitSessionData(visitId: number): Promise<VisitSessionData | null> {
  const { data, error } = await supabaseAdmin.from("bookings").select("id, patient_id, name, email, phone, location, visit_date, visit_time, status, message").eq("id", visitId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const visit = data as Visit;
  if (!visit.patient_id) return { visit, patient: null, brief: null, plan: null, notes: [], tasks: [], pinnedReflections: [], assistantTemplates: await getTemplates() };
  const [patient, brief, plan, notes, tasks, pinnedReflections, assistantTemplates] = await Promise.all([getPatientById(visit.patient_id), getVisitBrief(visit.patient_id, visit.id), getVisitPlan(visit.id), getPatientNotes(visit.patient_id), getPatientTasks(visit.patient_id), getPinnedReflectionCards(visit.patient_id), getTemplates()]);
  return { visit, patient, brief, plan, notes, tasks, pinnedReflections, assistantTemplates };
}
