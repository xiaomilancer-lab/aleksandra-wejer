"use server";

import { revalidatePath } from "next/cache";
import type { PatientTaskInput } from "../domain";
import {
  createPatientTask,
  deletePatientTask,
  recordTimelineEvent,
  updatePatientTask,
} from "../services/patientService";
import { requirePatientVaultAccess } from "../server/patientVault";

function validateTask(title: string) {
  if (!title.trim()) {
    throw new Error("Uzupełnij tytuł zadania.");
  }
}

export async function createPatientTaskAction(input: PatientTaskInput) {
  await requirePatientVaultAccess();
  validateTask(input.title);
  const task = await createPatientTask(input);
  await recordTimelineEvent({
    patientId: input.patientId,
    visitId: input.visitId,
    eventType: "task_created",
    title: "Dodano zadanie domowe",
    description: task.title,
    metadata: { taskId: task.id },
  });
  revalidatePath(`/panel/patients/${input.patientId}`);
  return task;
}

export async function updatePatientTaskAction(
  taskId: string,
  patientId: string,
  input: Pick<PatientTaskInput, "visitId" | "title" | "description" | "status" | "dueDate">
) {
  await requirePatientVaultAccess();
  validateTask(input.title);
  const task = await updatePatientTask(taskId, input);
  revalidatePath(`/panel/patients/${patientId}`);
  return task;
}

export async function deletePatientTaskAction(taskId: string, patientId: string) {
  await requirePatientVaultAccess();
  await deletePatientTask(taskId);
  revalidatePath(`/panel/patients/${patientId}`);
}
