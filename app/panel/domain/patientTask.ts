export type PatientTaskStatus = "todo" | "in_progress" | "completed";

export interface PatientTask {
  id: string;
  patient_id: string;
  visit_id: number | null;
  title: string;
  description: string;
  status: PatientTaskStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientTaskInput {
  patientId: string;
  visitId?: number | null;
  title: string;
  description: string;
  status: PatientTaskStatus;
  dueDate?: string | null;
}
