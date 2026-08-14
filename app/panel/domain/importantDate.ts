export type ImportantDateOccasion = "birthday" | "anniversary" | "holiday" | "celebration" | "other";

export interface ImportantDate {
  id: string;
  title: string;
  person_name: string;
  occasion: ImportantDateOccasion;
  event_date: string;
  recurs_yearly: boolean;
  reminder_days: number[];
  gift_notes: string;
  notes: string;
  last_completed_occurrence: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImportantDateInput {
  title: string;
  personName?: string;
  occasion: ImportantDateOccasion;
  eventDate: string;
  recursYearly: boolean;
  reminderDays: number[];
  giftNotes?: string;
  notes?: string;
}

export interface ImportantDateOccurrence {
  item: ImportantDate;
  occurrenceDate: string;
  daysUntil: number;
  isCompleted: boolean;
}
