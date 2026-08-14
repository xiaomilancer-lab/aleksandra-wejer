export type MemberRole = "patient" | "parent";

export type MemberAccessStatus = "pending" | "active" | "revoked";

export type MemberRoomItemType =
  | "message"
  | "notification"
  | "material"
  | "appointment_info"
  | "discount"
  | "contest"
  | "reward";

export type MemberBulletinType =
  | "announcement"
  | "discount"
  | "contest"
  | "attraction"
  | "event";

export type AppointmentChangeRequestType = "reschedule" | "cancel";

export type AppointmentChangeRequestStatus =
  | "pending"
  | "approved"
  | "declined"
  | "withdrawn";

export type FamilyContentCategory =
  | "attraction"
  | "event"
  | "restaurant"
  | "hotel"
  | "cinema"
  | "netflix";

export interface MemberRoomItem {
  id: string;
  patient_id: string;
  item_type: MemberRoomItemType;
  title: string;
  content: string;
  action_label: string | null;
  action_url: string | null;
  visible_from: string;
  expires_at: string | null;
}

export interface MemberBulletin {
  id: string;
  audience: "all" | MemberRole;
  bulletin_type: MemberBulletinType;
  title: string;
  content: string;
  action_label: string | null;
  action_url: string | null;
  visible_from: string;
  expires_at: string | null;
}
