import { supabaseAdmin } from "@/lib/supabase-admin";
import type {
  Patient,
  PatientNote,
  PatientNoteInput,
  PatientTask,
  PatientTaskInput,
  PatientTimelineEvent,
  PatientTimelineEventInput,
  Visit,
} from "../domain";

export interface PatientIdentity {
  name: string;
  phone?: string | null;
  email?: string | null;
}

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLocaleLowerCase("en-US") || null;
}

function normalizePhone(phone: string | null | undefined) {
  const digits = phone?.replace(/\D/g, "") || "";
  return digits || null;
}

function isPatientsTableMissing(errorCode: string | undefined) {
  return errorCode === "42P01";
}

export async function recordTimelineEvent(input: PatientTimelineEventInput) {
  try {
    await createTimelineEvent(input);
  } catch (error) {
    console.error("Unable to create patient timeline event", error);
  }
}

export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabaseAdmin
    .from("patients")
    .select("id, name, phone, email, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    // TODO: Run the patients migration before enabling this module in an environment.
    if (isPatientsTableMissing(error.code)) {
      return [];
    }

    throw error;
  }

  return (data ?? []) as Patient[];
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const { data, error } = await supabaseAdmin
    .from("patients")
    .select("id, name, phone, email, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // TODO: Run the patients migration before enabling this module in an environment.
    if (isPatientsTableMissing(error.code)) {
      return null;
    }

    throw error;
  }

  return data as Patient | null;
}

export async function getPatientVisits(patientId: string): Promise<Visit[]> {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id, patient_id, name, email, phone, location, visit_date, visit_time, status, message")
    .eq("patient_id", patientId)
    .order("visit_date", { ascending: false })
    .order("visit_time", { ascending: false });

  if (error) {
    // TODO: Run the bookings.patient_id migration before showing visit history.
    if (error.code === "42703") {
      return [];
    }

    throw error;
  }

  return (data ?? []) as Visit[];
}

export async function findOrCreatePatient(
  identity: PatientIdentity
): Promise<Patient | null> {
  const normalizedEmail = normalizeEmail(identity.email);
  const normalizedPhone = normalizePhone(identity.phone);

  const { data: patients, error: patientsError } = await supabaseAdmin
    .from("patients")
    .select("id, name, phone, email, created_at, updated_at");

  if (patientsError) {
    // TODO: Run the patients migration; keep existing booking creation working until then.
    if (isPatientsTableMissing(patientsError.code)) {
      return null;
    }

    throw patientsError;
  }

  const existingPatient = ((patients ?? []) as Patient[]).find((patient) => {
    if (normalizedEmail) {
      return normalizeEmail(patient.email) === normalizedEmail;
    }

    return normalizedPhone !== null && normalizePhone(patient.phone) === normalizedPhone;
  });

  if (existingPatient) {
    return existingPatient;
  }

  const { data, error } = await supabaseAdmin
    .from("patients")
    .insert({
      name: identity.name.trim(),
      phone: identity.phone?.trim() || null,
      email: normalizedEmail,
    })
    .select("id, name, phone, email, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  const patient = data as Patient;
  await recordTimelineEvent({
    patientId: patient.id,
    eventType: "patient_created",
    title: "Utworzono kartę pacjenta",
    description: "Pacjent został dodany do bazy.",
  });

  return patient;
}

// Creates a new patient through the API.
export async function createPatient() {
  throw new Error("Not implemented");
}

// Updates an existing patient through the API.
export async function updatePatient() {
  throw new Error("Not implemented");
}

// Deletes a patient through the API.
export async function deletePatient() {
  throw new Error("Not implemented");
}

export async function getPatientNotes(patientId: string): Promise<PatientNote[]> {
  const { data, error } = await supabaseAdmin
    .from("patient_notes")
    .select("id, patient_id, visit_id, title, content, created_at, updated_at")
    .eq("patient_id", patientId)
    .order("updated_at", { ascending: false });

  if (error) {
    // TODO: Run the patient_notes migration before enabling notes in an environment.
    if (error.code === "42P01") {
      return [];
    }

    throw error;
  }

  return (data ?? []) as PatientNote[];
}

export async function createPatientNote(
  input: PatientNoteInput
): Promise<PatientNote> {
  const { data, error } = await supabaseAdmin
    .from("patient_notes")
    .insert({
      patient_id: input.patientId,
      visit_id: input.visitId ?? null,
      title: input.title.trim(),
      content: input.content.trim(),
    })
    .select("id, patient_id, visit_id, title, content, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data as PatientNote;
}

export async function updatePatientNote(
  noteId: string,
  input: Pick<PatientNoteInput, "title" | "content" | "visitId">
): Promise<PatientNote> {
  const { data, error } = await supabaseAdmin
    .from("patient_notes")
    .update({
      visit_id: input.visitId ?? null,
      title: input.title.trim(),
      content: input.content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select("id, patient_id, visit_id, title, content, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data as PatientNote;
}

export async function deletePatientNote(noteId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("patient_notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    throw error;
  }
}

// Fetches documents assigned to a patient.
export async function getPatientDocuments() {
  throw new Error("Not implemented");
}

// Fetches statistics assigned to a patient.
export async function getPatientStatistics() {
  throw new Error("Not implemented");
}

export async function getPatientTasks(patientId: string): Promise<PatientTask[]> {
  const { data, error } = await supabaseAdmin
    .from("patient_tasks")
    .select("id, patient_id, visit_id, title, description, status, due_date, completed_at, created_at, updated_at")
    .eq("patient_id", patientId)
    .order("updated_at", { ascending: false });

  if (error) {
    // TODO: Run the patient_tasks migration before enabling tasks in an environment.
    if (error.code === "42P01") {
      return [];
    }

    throw error;
  }

  return (data ?? []) as PatientTask[];
}

export async function createPatientTask(
  input: PatientTaskInput
): Promise<PatientTask> {
  const isCompleted = input.status === "completed";
  const { data, error } = await supabaseAdmin
    .from("patient_tasks")
    .insert({
      patient_id: input.patientId,
      visit_id: input.visitId ?? null,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      due_date: input.dueDate || null,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .select("id, patient_id, visit_id, title, description, status, due_date, completed_at, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data as PatientTask;
}

export async function updatePatientTask(
  taskId: string,
  input: Pick<PatientTaskInput, "visitId" | "title" | "description" | "status" | "dueDate">
): Promise<PatientTask> {
  const isCompleted = input.status === "completed";
  const { data, error } = await supabaseAdmin
    .from("patient_tasks")
    .update({
      visit_id: input.visitId ?? null,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      due_date: input.dueDate || null,
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select("id, patient_id, visit_id, title, description, status, due_date, completed_at, created_at, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return data as PatientTask;
}

export async function deletePatientTask(taskId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("patient_tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw error;
  }
}

export async function getPatientTimeline(
  patientId: string
): Promise<PatientTimelineEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("patient_timeline")
    .select("id, patient_id, visit_id, event_type, title, description, metadata, created_at")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    // TODO: Run the patient_timeline migration before enabling event history.
    if (error.code === "42P01") {
      return [];
    }

    throw error;
  }

  return (data ?? []) as PatientTimelineEvent[];
}

export async function createTimelineEvent(
  input: PatientTimelineEventInput
): Promise<PatientTimelineEvent | null> {
  const { data, error } = await supabaseAdmin
    .from("patient_timeline")
    .insert({
      patient_id: input.patientId,
      visit_id: input.visitId ?? null,
      event_type: input.eventType,
      title: input.title,
      description: input.description ?? "",
      metadata: input.metadata ?? null,
    })
    .select("id, patient_id, visit_id, event_type, title, description, metadata, created_at")
    .single();

  if (error) {
    // TODO: Run the patient_timeline migration before automatic event creation.
    if (error.code === "42P01") {
      return null;
    }

    throw error;
  }

  return data as PatientTimelineEvent;
}
