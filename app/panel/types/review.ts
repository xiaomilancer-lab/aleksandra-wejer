export type ReviewStatus =
  | "pending"
  | "scheduled"
  | "sent"
  | "completed"
  | "private-feedback";

export interface ReviewRequest {
  id: number;
  patientId: number;
  visitId: number;
  status: ReviewStatus;
  createdAt: string;
  sentAt: string | null;
}
