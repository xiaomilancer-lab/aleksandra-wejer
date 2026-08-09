export type ParentHubRole = "psychologist" | "parent";

export type ParentSharedItemType = "material" | "homework" | "appointment_info" | "parent_message";

export interface ParentSharedItem {
  id: string;
  patient_id: string;
  type: ParentSharedItemType;
  title: string;
  content: string;
  created_at: string;
  is_visible: boolean;
}
