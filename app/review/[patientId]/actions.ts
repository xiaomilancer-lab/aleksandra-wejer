"use server";

import { recordGoogleReviewClick, savePrivateFeedback } from "@/app/panel/services/reviewCareService";

export async function submitGoogleReviewAction(patientId: string) {
  await recordGoogleReviewClick(patientId);
}

export async function submitPrivateFeedbackAction(patientId: string, feedback: string) {
  if (!feedback.trim()) throw new Error("Napisz proszę swoją uwagę przed wysłaniem.");
  await savePrivateFeedback(patientId, feedback);
}
