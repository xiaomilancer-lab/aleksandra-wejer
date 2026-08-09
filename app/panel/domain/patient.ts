export interface Patient {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at?: string;
  review_request_sent?: boolean;
  review_request_sent_at?: string | null;
  review_response?: "google" | "private_feedback" | null;
  google_review_clicked_at?: string | null;
  private_feedback?: string | null;
}
