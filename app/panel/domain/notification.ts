export type NotificationType =
  | "visit-reminder"
  | "review-request"
  | "homework"
  | "appointment-changed"
  | "custom";

export interface Notification {
  id: number;
  patientId: number;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  sent: boolean;
}
