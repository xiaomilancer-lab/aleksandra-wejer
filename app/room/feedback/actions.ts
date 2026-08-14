"use server";

import { getMemberAuthorization } from "@/app/room/server/requireMember";
import { getLatestCompletedBooking, getMemberPatientAccess } from "@/app/room/server/memberContext";
import { savePrivateFeedback } from "@/app/panel/services/reviewCareService";

export type RoomFeedbackState = { kind: "idle" | "success" | "error"; message: string };

export async function submitRoomFeedbackAction(_previous: RoomFeedbackState, formData: FormData): Promise<RoomFeedbackState> {
  const authorization = await getMemberAuthorization();
  if (authorization.kind !== "authorized") return { kind: "error", message: "Sesja wygasła. Zaloguj się ponownie." };

  const feedback = String(formData.get("feedback") ?? "").trim();
  if (feedback.length < 3) return { kind: "error", message: "Napisz proszę kilka słów przed wysłaniem." };
  if (feedback.length > 1200) return { kind: "error", message: "Wiadomość może mieć maksymalnie 1200 znaków." };

  const accessRows = await getMemberPatientAccess(authorization.identity.userId);
  const patientIds = [...new Set(accessRows.map((row) => row.patient_id))];
  if (patientIds.length === 0) return { kind: "error", message: "Gabinet musi najpierw połączyć konto z właściwą kartą pacjenta." };

  const latestBooking = await getLatestCompletedBooking(patientIds);
  const patientId = latestBooking?.patient_id ?? patientIds[0];
  await savePrivateFeedback(patientId, feedback);
  return { kind: "success", message: "Dziękujemy. Wiadomość trafiła prywatnie do Aleksandry." };
}
