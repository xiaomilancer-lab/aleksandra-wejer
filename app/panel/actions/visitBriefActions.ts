"use server";

import { getVisitBrief } from "../services/visitBriefService";
import { requirePsychologist } from "../server/requirePsychologist";

export async function getVisitBriefAction(patientId: string, visitId: number) {
  await requirePsychologist();
  return getVisitBrief(patientId, visitId);
}
