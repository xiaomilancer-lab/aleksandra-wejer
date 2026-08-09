export const patientMemoryCategories = ["Rodzina", "Szkoła", "Praca", "Hobby", "Zdrowie", "Relacje", "Cele", "Inne"] as const;
export type PatientMemoryCategory = (typeof patientMemoryCategories)[number];

export interface PatientMemory { id: string; patient_id: string; category: PatientMemoryCategory; title: string; content: string; is_pinned: boolean; created_at: string; updated_at: string; }
export interface PatientMemoryInput { patientId: string; category: PatientMemoryCategory; title: string; content: string; isPinned: boolean; }
