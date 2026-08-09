export interface FollowupRule {
  id: string;
  title: string;
  days_after_visit: number;
  message_template: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface FollowupSuggestion {
  id: string;
  patientId: string;
  patientName: string;
  lastVisitDate: string;
  daysSinceVisit: number;
  reason: string;
  messageTemplate: string;
}
