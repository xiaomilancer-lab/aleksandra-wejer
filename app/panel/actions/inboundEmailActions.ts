"use server";

import { revalidatePath } from "next/cache";
import { requirePatientVaultAccess } from "../server/patientVault";
import { archiveInboundEmail, markInboundEmailRead } from "../services/inboundEmailService";

function validId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function markInboundEmailReadAction(formData: FormData) {
  await requirePatientVaultAccess();
  const id = String(formData.get("id") ?? "");
  const read = String(formData.get("read") ?? "true") === "true";
  if (!validId(id)) throw new Error("Nieprawidłowa wiadomość.");
  await markInboundEmailRead(id, read);
  revalidatePath("/panel/inbox");
}

export async function archiveInboundEmailAction(formData: FormData) {
  await requirePatientVaultAccess();
  const id = String(formData.get("id") ?? "");
  if (!validId(id)) throw new Error("Nieprawidłowa wiadomość.");
  await archiveInboundEmail(id);
  revalidatePath("/panel/inbox");
}
