export interface PatientNote {
  id: string;
  patient_id: string;
  visit_id: number | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PatientNoteInput {
  patientId: string;
  visitId?: number | null;
  title: string;
  content: string;
}
