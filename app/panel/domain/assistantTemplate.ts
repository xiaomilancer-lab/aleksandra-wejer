export interface AssistantTemplate {
  id: string;
  title: string;
  category: string;
  age_group: string;
  problem_keywords: string[];
  description: string;
  interview_checklist: string;
  observation_points: string;
  recommended_materials: string;
  homework_examples: string;
  notes: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssistantTemplateInput {
  title: string;
  category: string;
  ageGroup: string;
  problemKeywords: string[];
  description: string;
  interviewChecklist: string;
  observationPoints: string;
  recommendedMaterials: string;
  homeworkExamples: string;
  notes: string;
  isFavorite?: boolean;
}

export interface AssistantTemplateSearch {
  category?: string;
  ageGroup?: string;
  keywords?: string[];
}
