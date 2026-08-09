export interface VisitTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  note_template: string;
  homework_template: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisitTemplateInput {
  title: string;
  category: string;
  description: string;
  noteTemplate: string;
  homeworkTemplate: string;
  isFavorite: boolean;
}
