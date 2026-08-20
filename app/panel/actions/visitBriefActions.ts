"use server";

import { getVisitBrief } from "../services/visitBriefService";
import { requirePatientVaultAccess } from "../server/patientVault";

export async function getVisitBriefAction(patientId: string, visitId: number) {
  await requirePatientVaultAccess();
  return getVisitBrief(patientId, visitId);
}
