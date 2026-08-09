export type ReflectionCardCategory = "observations" | "return_to" | "strengths" | "work_areas" | "next_questions";

export interface ReflectionCard {
  id: string;
  patient_id: string;
  visit_id: number | null;
  title: string;
  content: string;
  category: ReflectionCardCategory;
  is_important: boolean;
  is_pinned_to_next_visit: boolean;
  created_at: string;
}

export interface ReflectionCardInput {
  patientId: string;
  visitId?: number | null;
  title: string;
  content: string;
  category: ReflectionCardCategory;
  isImportant: boolean;
  isPinnedToNextVisit: boolean;
}
