"use server";

import { recordGoogleReviewClick, savePrivateFeedback } from "@/app/panel/services/reviewCareService";
import { verifyReviewToken } from "@/app/review/reviewToken";

function requireReviewToken(token: string) {
  const payload = verifyReviewToken(token);
  if (!payload) throw new Error("Ten link do opinii jest nieprawidłowy lub wygasł.");
  return payload;
}

export async function submitGoogleReviewAction(token: string) {
  const { patientId } = requireReviewToken(token);
  await recordGoogleReviewClick(patientId);
}

export async function submitPrivateFeedbackAction(token: string, feedback: string) {
  if (!feedback.trim()) throw new Error("Napisz proszę swoją uwagę przed wysłaniem.");
  if (feedback.trim().length > 1200) throw new Error("Wiadomość może mieć maksymalnie 1200 znaków.");
  const { patientId } = requireReviewToken(token);
  await savePrivateFeedback(patientId, feedback);
}
