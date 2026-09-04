"use server";

import { revalidatePath } from "next/cache";
import { createPatient } from "@/app/panel/services/patientService";
import { requirePsychologist } from "@/app/panel/server/requirePsychologist";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  createJournalNote,
  deleteJournalNote,
  recordJournalAudit,
  setJournalAlias,
  updateJournalNote,
  type JournalNotePayload,
} from "./server/secureJournal";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function shortText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function patientId(value: unknown) {
  const id = shortText(value, 64);
  if (!UUID.test(id)) throw new Error("Nieprawidłowa karta pacjenta.");
  return id;
}

function notePayload(value: Partial<JournalNotePayload>): JournalNotePayload {
  const payload = {
    title: shortText(value.title, 160),
    sessionSummary: shortText(value.sessionSummary, 30_000),
    keyTopics: shortText(value.keyTopics, 12_000),
    observations: shortText(value.observations, 12_000),
    nextSteps: shortText(value.nextSteps, 12_000),
  };
  if (!payload.title || !payload.sessionSummary) {
    throw new Error("Uzupełnij tytuł oraz krótki przebieg wizyty.");
  }
  return payload;
}

function occurredOn(value: unknown) {
  const date = shortText(value, 10);
  if (!DATE.test(date) || Number.isNaN(new Date(`${date}T12:00:00Z`).getTime())) {
    throw new Error("Wybierz prawidłową datę wizyty.");
  }
  return date;
}

export async function createJournalPatientAction(input: {
  name: string;
  alias?: string;
  phone?: string;
  email?: string;
}) {
  const identity = await requirePsychologist();
  const name = shortText(input.name, 120);
  if (name.length < 2) throw new Error("Wpisz imię, nazwisko albo bezpieczne oznaczenie pacjenta.");
  const patient = await createPatient({
    name,
    phone: shortText(input.phone, 30) || null,
    email: shortText(input.email, 200) || null,
  });
  const alias = shortText(input.alias, 80);
  if (alias) await setJournalAlias(patient.id, alias);
  await recordJournalAudit(identity.userId, "patient_created", patient.id);
  revalidatePath("/wizytownik");
  revalidatePath("/panel/patients");
  return { ...patient, journalAlias: alias || null, createdAt: patient.created_at };
}

export async function createJournalNoteAction(input: {
  patientId: string;
  occurredOn: string;
  payload: Partial<JournalNotePayload>;
}) {
  const identity = await requirePsychologist();
  const id = patientId(input.patientId);
  const date = occurredOn(input.occurredOn);
  const { data: matchingVisit } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("patient_id", id)
    .eq("visit_date", date)
    .neq("record_kind", "test")
    .order("visit_time", { ascending: true })
    .limit(1)
    .maybeSingle();
  const note = await createJournalNote({
    patientId: id,
    psychologistId: identity.userId,
    visitId: matchingVisit?.id ?? null,
    occurredOn: date,
    payload: notePayload(input.payload),
  });
  revalidatePath("/wizytownik");
  return note;
}

export async function updateJournalNoteAction(input: {
  noteId: string;
  patientId: string;
  occurredOn: string;
  payload: Partial<JournalNotePayload>;
}) {
  const identity = await requirePsychologist();
  const id = patientId(input.patientId);
  if (!UUID.test(input.noteId)) throw new Error("Nieprawidłowa notatka.");
  const note = await updateJournalNote({
    noteId: input.noteId,
    patientId: id,
    psychologistId: identity.userId,
    occurredOn: occurredOn(input.occurredOn),
    payload: notePayload(input.payload),
  });
  revalidatePath("/wizytownik");
  return note;
}

export async function deleteJournalNoteAction(noteId: string, rawPatientId: string) {
  const identity = await requirePsychologist();
  const id = patientId(rawPatientId);
  if (!UUID.test(noteId)) throw new Error("Nieprawidłowa notatka.");
  await deleteJournalNote(noteId, id, identity.userId);
  revalidatePath("/wizytownik");
}
