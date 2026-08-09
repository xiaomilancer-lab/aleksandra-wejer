export interface VisitReflection {
  id: string;
  visit_id: number;
  patient_id: string;
  mood_level: number;
  energy_level: number;
  engagement_level: number;
  reflection: string;
  created_at: string;
  updated_at: string;
}

export interface VisitReflectionInput {
  visitId: number;
  patientId: string;
  moodLevel: number;
  energyLevel: number;
  engagementLevel: number;
  reflection: string;
}
