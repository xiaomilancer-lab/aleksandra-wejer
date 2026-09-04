import "server-only";

import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

const KEY_VERSION = 1;
const MAX_PAYLOAD_BYTES = 120_000;

export type JournalPatient = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  journalAlias: string | null;
  createdAt: string;
};

export type JournalNotePayload = {
  title: string;
  sessionSummary: string;
  keyTopics: string;
  observations: string;
  nextSteps: string;
};

export type JournalNote = JournalNotePayload & {
  id: string;
  patientId: string;
  visitId: number | null;
  occurredOn: string;
  createdAt: string;
  updatedAt: string;
};

type SecureNoteRow = {
  id: string;
  patient_id: string;
  visit_id: number | null;
  psychologist_id: string;
  occurred_on: string;
  ciphertext: string;
  iv: string;
  auth_tag: string;
  key_version: number;
  created_at: string;
  updated_at: string;
};

function encryptionKey(version: number) {
  const value = process.env[`WIZYTOWNIK_ENCRYPTION_KEY_V${version}`];
  if (!value) throw new Error("Wizytownik czeka na bezpieczny klucz szyfrowania.");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("Klucz Wizytownika ma nieprawidłowy format.");
  return key;
}

function additionalData(noteId: string, patientId: string, version: number) {
  return Buffer.from(`wizytownik:${version}:${noteId}:${patientId}`, "utf8");
}

function encryptPayload(noteId: string, patientId: string, payload: JournalNotePayload) {
  const serialized = Buffer.from(JSON.stringify(payload), "utf8");
  if (serialized.length > MAX_PAYLOAD_BYTES) throw new Error("Notatka jest zbyt długa.");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(KEY_VERSION), iv);
  cipher.setAAD(additionalData(noteId, patientId, KEY_VERSION));
  const ciphertext = Buffer.concat([cipher.update(serialized), cipher.final()]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    keyVersion: KEY_VERSION,
  };
}

function decryptPayload(row: SecureNoteRow): JournalNotePayload {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(row.key_version),
    Buffer.from(row.iv, "base64"),
  );
  decipher.setAAD(additionalData(row.id, row.patient_id, row.key_version));
  decipher.setAuthTag(Buffer.from(row.auth_tag, "base64"));
  const cleartext = Buffer.concat([
    decipher.update(Buffer.from(row.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  const payload = JSON.parse(cleartext) as Partial<JournalNotePayload>;
  return {
    title: typeof payload.title === "string" ? payload.title : "Notatka z wizyty",
    sessionSummary: typeof payload.sessionSummary === "string" ? payload.sessionSummary : "",
    keyTopics: typeof payload.keyTopics === "string" ? payload.keyTopics : "",
    observations: typeof payload.observations === "string" ? payload.observations : "",
    nextSteps: typeof payload.nextSteps === "string" ? payload.nextSteps : "",
  };
}

function toNote(row: SecureNoteRow): JournalNote {
  return {
    id: row.id,
    patientId: row.patient_id,
    visitId: row.visit_id,
    occurredOn: row.occurred_on,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...decryptPayload(row),
  };
}

function missingJournalSchema(code: string | undefined) {
  return code === "42P01" || code === "42703" || code === "PGRST204" || code === "PGRST205";
}

export async function getJournalPatients(): Promise<JournalPatient[]> {
  const { data, error } = await supabaseAdmin
    .from("patients")
    .select("id, name, phone, email, journal_alias, created_at")
    .order("name", { ascending: true });
  if (error) {
    if (missingJournalSchema(error.code)) throw new Error("Wizytownik wymaga jednorazowej aktualizacji bazy.");
    throw error;
  }
  return (data ?? [])
    .filter((patient) => {
      const name = String(patient.name ?? "").trim().toLocaleLowerCase("pl-PL");
      const email = String(patient.email ?? "").trim().toLocaleLowerCase("pl-PL");
      return name !== "krystyna ahjujewicz" && !(name === "jan kowalski" && email === "jan.kowalski@test.pl");
    })
    .map((patient) => ({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      journalAlias: patient.journal_alias,
      createdAt: patient.created_at,
    }));
}

export async function getJournalPatient(patientId: string): Promise<JournalPatient | null> {
  const { data, error } = await supabaseAdmin
    .from("patients")
    .select("id, name, phone, email, journal_alias, created_at")
    .eq("id", patientId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    journalAlias: data.journal_alias,
    createdAt: data.created_at,
  };
}

export async function setJournalAlias(patientId: string, alias: string | null) {
  const { error } = await supabaseAdmin
    .from("patients")
    .update({ journal_alias: alias, updated_at: new Date().toISOString() })
    .eq("id", patientId);
  if (error) throw error;
}

export async function getJournalNotes(patientId: string, psychologistId: string): Promise<JournalNote[]> {
  encryptionKey(KEY_VERSION);
  const { data, error } = await supabaseAdmin
    .from("secure_visit_notes")
    .select("id, patient_id, visit_id, psychologist_id, occurred_on, ciphertext, iv, auth_tag, key_version, created_at, updated_at")
    .eq("patient_id", patientId)
    .eq("psychologist_id", psychologistId)
    .order("occurred_on", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) {
    if (missingJournalSchema(error.code)) throw new Error("Wizytownik wymaga jednorazowej aktualizacji bazy.");
    throw error;
  }
  return ((data ?? []) as SecureNoteRow[]).map(toNote);
}

export async function getJournalNote(noteId: string, patientId: string, psychologistId: string): Promise<JournalNote | null> {
  const { data, error } = await supabaseAdmin
    .from("secure_visit_notes")
    .select("id, patient_id, visit_id, psychologist_id, occurred_on, ciphertext, iv, auth_tag, key_version, created_at, updated_at")
    .eq("id", noteId)
    .eq("patient_id", patientId)
    .eq("psychologist_id", psychologistId)
    .maybeSingle();
  if (error) throw error;
  return data ? toNote(data as SecureNoteRow) : null;
}

export async function createJournalNote(input: {
  patientId: string;
  psychologistId: string;
  visitId?: number | null;
  occurredOn: string;
  payload: JournalNotePayload;
}) {
  const id = randomUUID();
  const encrypted = encryptPayload(id, input.patientId, input.payload);
  const { data, error } = await supabaseAdmin
    .from("secure_visit_notes")
    .insert({
      id,
      patient_id: input.patientId,
      visit_id: input.visitId ?? null,
      psychologist_id: input.psychologistId,
      occurred_on: input.occurredOn,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      auth_tag: encrypted.authTag,
      key_version: encrypted.keyVersion,
    })
    .select("id, patient_id, visit_id, psychologist_id, occurred_on, ciphertext, iv, auth_tag, key_version, created_at, updated_at")
    .single();
  if (error) throw error;
  await recordJournalAudit(input.psychologistId, "note_created", input.patientId, id);
  return toNote(data as SecureNoteRow);
}

export async function updateJournalNote(input: {
  noteId: string;
  patientId: string;
  psychologistId: string;
  occurredOn: string;
  payload: JournalNotePayload;
}) {
  const encrypted = encryptPayload(input.noteId, input.patientId, input.payload);
  const { data, error } = await supabaseAdmin
    .from("secure_visit_notes")
    .update({
      occurred_on: input.occurredOn,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      auth_tag: encrypted.authTag,
      key_version: encrypted.keyVersion,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.noteId)
    .eq("patient_id", input.patientId)
    .eq("psychologist_id", input.psychologistId)
    .select("id, patient_id, visit_id, psychologist_id, occurred_on, ciphertext, iv, auth_tag, key_version, created_at, updated_at")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Notatka nie istnieje albo nie masz do niej dostępu.");
  await recordJournalAudit(input.psychologistId, "note_updated", input.patientId, input.noteId);
  return toNote(data as SecureNoteRow);
}

export async function deleteJournalNote(noteId: string, patientId: string, psychologistId: string) {
  const { data, error } = await supabaseAdmin
    .from("secure_visit_notes")
    .delete()
    .eq("id", noteId)
    .eq("patient_id", patientId)
    .eq("psychologist_id", psychologistId)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Notatka nie istnieje albo nie masz do niej dostępu.");
  await recordJournalAudit(psychologistId, "note_deleted", patientId, noteId);
}

export async function recordJournalAudit(
  psychologistId: string,
  action: "note_created" | "note_updated" | "note_deleted" | "history_viewed" | "history_exported" | "patient_created",
  patientId?: string | null,
  noteId?: string | null,
) {
  const { error } = await supabaseAdmin.from("secure_journal_audit").insert({
    psychologist_id: psychologistId,
    patient_id: patientId ?? null,
    note_id: noteId ?? null,
    action,
  });
  if (error && process.env.NODE_ENV !== "production") {
    console.error("Wizytownik audit event could not be recorded", error.code);
  }
}
