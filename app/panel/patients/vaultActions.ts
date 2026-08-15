"use server";

import { redirect } from "next/navigation";
import { requirePsychologist } from "@/app/panel/server/requirePsychologist";
import { closePatientVaultSession, configurePatientVault, getPatientVaultState, verifyAccountPassword, verifyPatientVaultPin } from "@/app/panel/server/patientVault";

export type VaultActionState = { error: string };

export async function setupPatientVaultAction(_: VaultActionState, formData: FormData): Promise<VaultActionState> {
  const identity = await requirePsychologist();
  const pin = String(formData.get("pin") ?? "");
  const confirmation = String(formData.get("pinConfirmation") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!/^\d{6,10}$/.test(pin)) return { error: "PIN musi mieć od 6 do 10 cyfr." };
  if (pin !== confirmation) return { error: "Wpisane kody PIN nie są takie same." };
  const state = await getPatientVaultState(identity.userId);
  if (state.configured) return { error: "PIN został już ustawiony. Odśwież stronę." };
  if (!await verifyAccountPassword(identity.email, password)) return { error: "Hasło do konta gabinetu jest nieprawidłowe." };
  await configurePatientVault(identity.userId, pin);
  redirect("/panel/patients");
}

export async function unlockPatientVaultAction(_: VaultActionState, formData: FormData): Promise<VaultActionState> {
  const identity = await requirePsychologist();
  const pin = String(formData.get("pin") ?? "");
  if (!/^\d{6,10}$/.test(pin)) return { error: "Wpisz poprawny PIN." };
  const result = await verifyPatientVaultPin(identity.userId, pin);
  if (!result.ok) {
    if (result.lockedUntil) {
      const time = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }).format(new Date(result.lockedUntil));
      return { error: `Po kilku błędnych próbach sejf jest zablokowany do ${time}.` };
    }
    await new Promise((resolve) => setTimeout(resolve, 650));
    return { error: "Nieprawidłowy PIN." };
  }
  redirect("/panel/patients");
}

export async function lockPatientVaultAction() {
  await requirePsychologist();
  await closePatientVaultSession();
  redirect("/panel/patients");
}
