export interface VisitPlan {
  id: string;
  visit_id: number;
  patient_id: string;
  main_goal: string;
  secondary_goal: string;
  topics_to_discuss: string;
  homework_to_review: string;
  materials_to_prepare: string;
  own_notes: string;
  created_at: string;
  updated_at: string;
}

export interface VisitPlanInput {
  visitId: number;
  patientId: string;
  mainGoal: string;
  secondaryGoal: string;
  topicsToDiscuss: string;
  homeworkToReview: string;
  materialsToPrepare: string;
  ownNotes: string;
}
