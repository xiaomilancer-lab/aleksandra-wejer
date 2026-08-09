"use server";

import { revalidatePath } from "next/cache";
import type { PatientNoteInput } from "../domain";
import {
  createPatientNote,
  deletePatientNote,
  recordTimelineEvent,
  updatePatientNote,
} from "../services/patientService";
import { requirePsychologist } from "../server/requirePsychologist";

function validateNote(title: string, content: string) {
  if (!title.trim() || !content.trim()) {
    throw new Error("Uzupełnij tytuł i treść notatki.");
  }
}

export async function createPatientNoteAction(input: PatientNoteInput) {
  await requirePsychologist();
  validateNote(input.title, input.content);
  const note = await createPatientNote(input);
  await recordTimelineEvent({
    patientId: input.patientId,
    visitId: input.visitId,
    eventType: "note_created",
    title: "Dodano notatkę",
    description: note.title,
    metadata: { noteId: note.id },
  });
  revalidatePath(`/panel/patients/${input.patientId}`);
  return note;
}

export async function updatePatientNoteAction(
  noteId: string,
  patientId: string,
  input: Pick<PatientNoteInput, "title" | "content" | "visitId">
) {
  await requirePsychologist();
  validateNote(input.title, input.content);
  const note = await updatePatientNote(noteId, input);
  revalidatePath(`/panel/patients/${patientId}`);
  return note;
}

export async function deletePatientNoteAction(noteId: string, patientId: string) {
  await requirePsychologist();
  await deletePatientNote(noteId);
  revalidatePath(`/panel/patients/${patientId}`);
}
