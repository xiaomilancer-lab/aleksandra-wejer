export const moodValues = ["happy", "good", "neutral", "sad", "angry", "anxious"] as const;
export type Mood = (typeof moodValues)[number];

export interface MoodEntry {
  id: string;
  patient_id: string;
  date: string;
  mood: Mood;
  note: string | null;
  created_at: string;
}

export interface MoodEntryInput {
  patientId: string;
  date: string;
  mood: Mood;
  note?: string;
}
