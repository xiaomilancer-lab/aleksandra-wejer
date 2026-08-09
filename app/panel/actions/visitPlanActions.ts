"use server";

import { revalidatePath } from "next/cache";
import type { VisitPlanInput } from "../domain";
import { getTemplates } from "../services/templateService";
import { getVisitPlan, saveVisitPlan, updateVisitPlan } from "../services/visitPlanService";
import { requirePsychologist } from "../server/requirePsychologist";

export async function getVisitPlanAction(visitId: number) { await requirePsychologist(); return getVisitPlan(visitId); }
export async function getVisitPlanTemplatesAction() { await requirePsychologist(); return getTemplates(); }
export async function saveVisitPlanAction(input: VisitPlanInput, planId?: string) { await requirePsychologist(); const plan = planId ? await updateVisitPlan(planId, input) : await saveVisitPlan(input); revalidatePath("/panel"); revalidatePath(`/panel/patients/${input.patientId}`); return plan; }
