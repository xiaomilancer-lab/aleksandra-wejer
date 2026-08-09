"use server";

import { revalidatePath } from "next/cache";
import type { FollowupReminderInput } from "../domain";
import {
  createFollowupReminder,
  updateFollowupReminderStatus,
} from "../services/followupReminderService";
import { requirePsychologist } from "../server/requirePsychologist";

function revalidateReminderViews(patientId: string, visitId?: number | null) {
  revalidatePath("/panel");
  revalidatePath(`/panel/patients/${patientId}`);
  if (visitId) revalidatePath(`/panel/visits/${visitId}/brief`);
}

export async function createFollowupReminderAction(input: FollowupReminderInput) {
  await requirePsychologist();
  if (!input.title.trim()) throw new Error("Uzupełnij temat przypomnienia.");
  const reminder = await createFollowupReminder(input);
  revalidateReminderViews(input.patientId, input.visitId);
  return reminder;
}

export async function resolveFollowupReminderAction(
  reminderId: string,
  patientId: string,
  status: "done" | "dismissed",
  visitId?: number | null
) {
  await requirePsychologist();
  const reminder = await updateFollowupReminderStatus(reminderId, status);
  revalidateReminderViews(patientId, visitId);
  return reminder;
}
