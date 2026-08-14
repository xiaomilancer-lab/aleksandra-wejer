import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { FollowupRule, FollowupSuggestion, Visit } from "../domain";

const ruleFields = "id, title, days_after_visit, message_template, is_enabled, created_at, updated_at";

const defaultRules: Pick<FollowupRule, "id" | "title" | "days_after_visit" | "message_template" | "is_enabled">[] = [
  { id: "default-no-return", title: "Brak kolejnej wizyty", days_after_visit: 14, message_template: "", is_enabled: true },
  { id: "default-month-check", title: "Kontrola po miesiącu", days_after_visit: 30, message_template: "", is_enabled: true },
];

function isRulesTableMissing(errorCode: string | undefined) {
  return errorCode === "42P01";
}

export async function getFollowupRules(): Promise<FollowupRule[]> {
  const { data, error } = await supabaseAdmin.from("followup_rules").select(ruleFields).eq("is_enabled", true).order("days_after_visit", { ascending: true });
  if (error) {
    // TODO: Run create_followup_rules.sql before configuring Follow-up rules in an environment.
    if (isRulesTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as FollowupRule[];
}

export async function getFollowupSuggestions(now: Date = new Date()): Promise<FollowupSuggestion[]> {
  const [rules, bookingsResult] = await Promise.all([
    getFollowupRules(),
    supabaseAdmin.from("bookings").select("id, patient_id, name, visit_date, visit_time, status").not("patient_id", "is", null).neq("record_kind", "test").order("visit_date", { ascending: false }).order("visit_time", { ascending: false }),
  ]);
  if (bookingsResult.error) throw bookingsResult.error;

  const activeRules = rules.length ? rules : defaultRules;
  const today = getWarsawDate(now);
  const visits = (bookingsResult.data ?? []) as Pick<Visit, "id" | "patient_id" | "name" | "visit_date" | "visit_time" | "status">[];
  const visitsByPatient = new Map<string, typeof visits>();
  visits.forEach((visit) => {
    if (!visit.patient_id) return;
    visitsByPatient.set(visit.patient_id, [...(visitsByPatient.get(visit.patient_id) ?? []), visit]);
  });

  return [...visitsByPatient.entries()].flatMap(([patientId, patientVisits]) => {
    const hasUpcomingVisit = patientVisits.some((visit) => visit.visit_date >= today && visit.status !== "Odwołane");
    if (hasUpcomingVisit) return [];
    const lastCompletedVisit = patientVisits.find((visit) => visit.status === "Zrealizowane" && visit.visit_date < today);
    if (!lastCompletedVisit) return [];
    const daysSinceVisit = diffDays(lastCompletedVisit.visit_date, today);
    const matchingRule = [...activeRules].reverse().find((rule) => daysSinceVisit >= rule.days_after_visit);
    if (!matchingRule) return [];
    return [{ id: `${patientId}-${matchingRule.id}`, patientId, patientName: lastCompletedVisit.name, lastVisitDate: lastCompletedVisit.visit_date, daysSinceVisit, reason: matchingRule.title, messageTemplate: matchingRule.message_template }];
  }).sort((first, second) => second.daysSinceVisit - first.daysSinceVisit);
}

function getWarsawDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function diffDays(startDate: string, endDate: string) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.max(0, Math.floor((end - start) / 86_400_000));
}
