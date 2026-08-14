import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type {
  FollowupReminder,
  FollowupReminderAssignment,
  FollowupReminderInput,
  FollowupReminderStatus,
} from "../domain";

const fields = "id, patient_id, visit_id, title, description, status, created_at, completed_at";
const isTableMissing = (code: string | undefined) => code === "42P01";

export async function getPatientFollowupReminders(patientId: string): Promise<FollowupReminder[]> {
  const { data, error } = await supabaseAdmin
    .from("followup_reminders")
    .select(fields)
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    if (isTableMissing(error.code)) return [];
    throw error;
  }

  return (data ?? []) as FollowupReminder[];
}

export async function getOpenFollowupRemindersForVisit(
  patientId: string,
  visitId: number
): Promise<FollowupReminder[]> {
  const { data, error } = await supabaseAdmin
    .from("followup_reminders")
    .select(fields)
    .eq("patient_id", patientId)
    .eq("status", "open")
    .neq("visit_id", visitId)
    .order("created_at", { ascending: false });

  if (error) {
    if (isTableMissing(error.code)) return [];
    throw error;
  }

  return (data ?? []) as FollowupReminder[];
}

export async function createFollowupReminder(input: FollowupReminderInput): Promise<FollowupReminder> {
  const { data, error } = await supabaseAdmin
    .from("followup_reminders")
    .insert({
      patient_id: input.patientId,
      visit_id: input.visitId ?? null,
      title: input.title.trim(),
      description: input.description?.trim() ?? "",
    })
    .select(fields)
    .single();

  if (error) throw error;
  return data as FollowupReminder;
}

export async function updateFollowupReminderStatus(
  reminderId: string,
  status: Exclude<FollowupReminderStatus, "open">
): Promise<FollowupReminder> {
  const { data, error } = await supabaseAdmin
    .from("followup_reminders")
    .update({ status, completed_at: new Date().toISOString() })
    .eq("id", reminderId)
    .select(fields)
    .single();

  if (error) throw error;
  return data as FollowupReminder;
}

export async function getOpenFollowupRemindersForNearestVisits(
  today: string
): Promise<FollowupReminderAssignment[]> {
  const [remindersResult, visitsResult] = await Promise.all([
    supabaseAdmin.from("followup_reminders").select(fields).eq("status", "open").order("created_at", { ascending: false }),
    supabaseAdmin
      .from("bookings")
      .select("id, patient_id, name, visit_date, visit_time, status")
      .gte("visit_date", today)
      .neq("record_kind", "test")
      .neq("status", "Odwołane")
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true }),
  ]);

  if (remindersResult.error) {
    if (isTableMissing(remindersResult.error.code)) return [];
    throw remindersResult.error;
  }
  if (visitsResult.error) throw visitsResult.error;

  const nearestByPatient = new Map<string, { id: number; name: string; visit_date: string; visit_time: string }>();
  for (const visit of visitsResult.data ?? []) {
    if (visit.patient_id && !nearestByPatient.has(visit.patient_id)) {
      nearestByPatient.set(visit.patient_id, visit);
    }
  }

  return (remindersResult.data ?? []).flatMap((reminder) => {
    const nextVisit = nearestByPatient.get(reminder.patient_id);
    if (!nextVisit) return [];
    return [{
      reminder: reminder as FollowupReminder,
      patientName: nextVisit.name,
      nextVisitId: nextVisit.id,
      nextVisitDate: nextVisit.visit_date,
      nextVisitTime: nextVisit.visit_time,
    }];
  });
}
