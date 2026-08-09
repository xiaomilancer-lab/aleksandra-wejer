export const knowledgeCategories = ["ADHD", "Spektrum autyzmu", "Mutyzm", "Lęki", "Depresja", "Relacje", "Pary", "Rodzina", "Dzieci", "Nastolatki", "Dorośli", "Uzależnienia", "Rozwój", "Inne"] as const;

export type KnowledgeCategory = (typeof knowledgeCategories)[number];

export interface KnowledgeMaterial {
  id: string;
  title: string;
  category: KnowledgeCategory;
  description: string;
  tags: string[];
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeMaterialInput {
  title: string;
  category: KnowledgeCategory;
  description: string;
  tags: string[];
  content: string;
  isPinned: boolean;
}
