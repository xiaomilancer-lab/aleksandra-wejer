export type ReviewResponse = "google" | "private_feedback";

export interface PatientReviewCare {
  id: string;
  name: string;
  review_request_sent: boolean;
  review_request_sent_at: string | null;
  review_request_scheduled_at: string | null;
  review_response: ReviewResponse | null;
  google_review_clicked_at: string | null;
  private_feedback: string | null;
}
