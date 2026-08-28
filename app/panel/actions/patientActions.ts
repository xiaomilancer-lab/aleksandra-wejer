"use server";

import { revalidatePath } from "next/cache";
import { requirePatientVaultAccess } from "../server/patientVault";
import { createPatient, updatePatient, type PatientIdentity } from "../services/patientService";
import { assignVisitToPatient, createOrMatchPatientFromVisit } from "../services/visitOrganizerService";
import { createPatientMemory } from "../services/patientMemoryService";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface CreatePatientCardInput extends PatientIdentity {
  supportInfo?: string;
}

export async function createPatientAction(input: CreatePatientCardInput) {
  await requirePatientVaultAccess();
  const name = input.name.trim();
  const phone = input.phone?.trim() || null;
  const email = input.email?.trim().toLocaleLowerCase("en-US") || null;
  const supportInfo = input.supportInfo?.trim() || "";
  if (name.length < 2 || name.length > 120) throw new Error("Wpisz prawidłowe imię i nazwisko.");
  if (phone && phone.length > 30) throw new Error("Numer telefonu jest zbyt długi.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Wpisz prawidłowy adres e-mail.");
  if (supportInfo.length > 2000) throw new Error("Informacje pomocne mogą mieć maksymalnie 2000 znaków.");

  const patient = await createPatient({ name, phone, email });
  let supportInfoSaved = false;
  if (supportInfo) {
    try {
      await createPatientMemory({
        patientId: patient.id,
        category: "Inne",
        title: "Wskazówki do materiałów i spotkań",
        content: supportInfo,
        isPinned: true,
      });
      supportInfoSaved = true;
    } catch (error) {
      console.error("Unable to save initial patient memory", error);
    }
  }

  revalidatePath("/panel");
  revalidatePath("/panel/patients");
  revalidatePath("/panel/visits");
  revalidatePath("/panel/schedule");
  revalidatePath(`/panel/patients/${patient.id}`);
  return { patient, supportInfoSaved, supportInfoRequested: Boolean(supportInfo) };
}

export async function updatePatientAction(patientId: string, identity: PatientIdentity) {
  await requirePatientVaultAccess();
  if (!uuidPattern.test(patientId)) throw new Error("Nieprawidłowa karta pacjenta.");
  const name = identity.name.trim();
  const phone = identity.phone?.trim() || null;
  const email = identity.email?.trim().toLocaleLowerCase("en-US") || null;
  if (name.length < 2 || name.length > 120) throw new Error("Wpisz prawidłowe imię i nazwisko.");
  if (phone && phone.length > 30) throw new Error("Numer telefonu jest zbyt długi.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Wpisz prawidłowy adres e-mail.");

  const patient = await updatePatient(patientId, { name, phone, email });
  revalidatePath("/panel");
  revalidatePath("/panel/patients");
  revalidatePath("/panel/visits");
  revalidatePath("/panel/schedule");
  revalidatePath(`/panel/patients/${patientId}`);
  return patient;
}

export async function assignVisitToPatientAction(visitId: number, patientId: string) {
  await requirePatientVaultAccess();
  if (!Number.isInteger(visitId) || visitId < 1 || !uuidPattern.test(patientId)) throw new Error("Nieprawidłowe dane wizyty lub karty.");
  const patient = await assignVisitToPatient(visitId, patientId);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
  revalidatePath("/panel/schedule");
  revalidatePath(`/panel/patients/${patient.id}`);
  return patient;
}

export async function createPatientCardFromVisitAction(visitId: number) {
  await requirePatientVaultAccess();
  if (!Number.isInteger(visitId) || visitId < 1) throw new Error("Nieprawidłowa wizyta.");
  const patient = await createOrMatchPatientFromVisit(visitId);
  revalidatePath("/panel");
  revalidatePath("/panel/visits");
  revalidatePath("/panel/schedule");
  revalidatePath("/panel/patients");
  revalidatePath(`/panel/patients/${patient.id}`);
  return patient;
}
