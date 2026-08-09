export type PatientTimelineEventType =
  | "visit_created"
  | "visit_completed"
  | "status_changed"
  | "note_created"
  | "note_updated"
  | "task_created"
  | "task_completed"
  | "document_added"
  | "review_sent"
  | "review_received"
  | "email_sent"
  | "patient_created";

export type PatientTimelineMetadata = Record<
  string,
  string | number | boolean | null
>;

export interface PatientTimelineEvent {
  id: string;
  patient_id: string;
  visit_id: number | null;
  event_type: PatientTimelineEventType;
  title: string;
  description: string;
  metadata: PatientTimelineMetadata | null;
  created_at: string;
}

export interface PatientTimelineEventInput {
  patientId: string;
  visitId?: number | null;
  eventType: PatientTimelineEventType;
  title: string;
  description?: string;
  metadata?: PatientTimelineMetadata | null;
}
