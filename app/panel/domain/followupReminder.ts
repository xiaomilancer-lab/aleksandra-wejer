export type FollowupReminderStatus = "open" | "done" | "dismissed";

export interface FollowupReminder {
  id: string;
  patient_id: string;
  visit_id: number | null;
  title: string;
  description: string;
  status: FollowupReminderStatus;
  created_at: string;
  completed_at: string | null;
}

export interface FollowupReminderInput {
  patientId: string;
  visitId?: number | null;
  title: string;
  description?: string;
}

export interface FollowupReminderAssignment {
  reminder: FollowupReminder;
  patientName: string;
  nextVisitId: number;
  nextVisitDate: string;
  nextVisitTime: string;
}
