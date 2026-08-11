import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { PatientNote, PatientTask, Visit } from "../domain";
import { getFollowupSuggestions } from "./followupService";
import { getVisitKnowledgeMaterials } from "./knowledgeLibraryService";
import { getPinnedPatientMemory } from "./patientMemoryService";
import { getPatientNotes, getPatientTasks } from "./patientService";
import { getVisitPlan } from "./visitPlanService";

export type DashboardVisit = Pick<
  Visit,
  "id" | "name" | "location" | "location_id" | "visit_date" | "visit_time" | "status" | "source"
>;

export interface DashboardRequest extends DashboardVisit {
  patient_id: string | null;
  message: string | null;
}

export interface DashboardAttentionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "unlinked" | "missing_note";
}

export interface DashboardDayData {
  todayVisits: DashboardVisit[];
  nextVisit: DashboardVisit | null;
  attentionVisits: DashboardVisit[];
  newPatientsToday: number | null;
}

export interface DashboardWeekDay {
  date: string;
  visits: DashboardVisit[];
}

export interface DashboardWeekData {
  days: DashboardWeekDay[];
  totalVisits: number;
  isAvailable: boolean;
}

export interface TodayQueueItem extends DashboardVisit {
  patient_id: string | null;
  message: string | null;
  previousVisitsCount: number;
  latestNote: PatientNote | null;
  activeTask: PatientTask | null;
  hasVisitPlan: boolean;
  pinnedMemoryCount: number;
  pinnedMaterialsCount: number;
  requiresFollowup: boolean;
  requiresClosure: boolean;
}

export interface DayClosingItem {
  id: string;
  patientName: string;
  visitTime: string | null;
  missing: string;
  href: string;
}

export interface DayClosingSummary {
  date: string;
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  newPatients: number | null;
  visitsRequiringClosure: number;
  unsavedOrIncompleteNotes: number | null;
  notesAdded: number | null;
  activeFollowups: number | null;
  tasksCreated: number | null;
  careAfterVisitPending: number | null;
  closureItems: DayClosingItem[];
  tomorrow: { visitsCount: number; firstVisitTime: string | null; hasNewPatients: boolean | null };
}

export type DailyFlowKind = "visit_active" | "visit_preparation" | "visit_closure" | "followup_attention" | "day_closing" | "today_queue";
export interface DailyFlowState { kind: DailyFlowKind; title: string; description: string; href: string; visitTime: string | null; }

export function getWarsawDateParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  };
}

export async function getDashboardDayData(
  now: Date = new Date()
): Promise<DashboardDayData> {
  const { date: today, time: currentTime } = getWarsawDateParts(now);
  const fields = "id, name, location, location_id, visit_date, visit_time, status, source";

  const [todayResult, attentionResult, patientsResult] = await Promise.all([
    supabaseAdmin
      .from("bookings")
      .select(fields)
      .eq("visit_date", today)
      .order("visit_time", { ascending: true }),
    supabaseAdmin
      .from("bookings")
      .select(fields)
      .eq("status", "Nowe")
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true })
      .limit(5),
    supabaseAdmin.from("patients").select("created_at"),
  ]);

  if (todayResult.error) {
    throw todayResult.error;
  }

  if (attentionResult.error) {
    throw attentionResult.error;
  }

  const todayVisits = (todayResult.data ?? []) as DashboardVisit[];

  return {
    todayVisits,
    nextVisit:
      todayVisits.find((visit) => visit.visit_time >= currentTime) ?? null,
    attentionVisits: (attentionResult.data ?? []) as DashboardVisit[],
    newPatientsToday: patientsResult.error ? null : (patientsResult.data ?? []).filter((patient) => isInWarsawDay(patient.created_at, today)).length,
  };
}

export async function getDashboardWeekData(now: Date = new Date()): Promise<DashboardWeekData> {
  const { date: today } = getWarsawDateParts(now);
  const endDate = nextCalendarDate(today, 6);
  const fields = "id, name, location, location_id, visit_date, visit_time, status, source";
  const result = await supabaseAdmin
    .from("bookings")
    .select(fields)
    .gte("visit_date", today)
    .lte("visit_date", endDate)
    .neq("status", "Odwołane")
    .order("visit_date", { ascending: true })
    .order("visit_time", { ascending: true });

  const dates = Array.from({ length: 7 }, (_, index) => nextCalendarDate(today, index));
  if (result.error) {
    return { days: dates.map((date) => ({ date, visits: [] })), totalVisits: 0, isAvailable: false };
  }

  const visits = (result.data ?? []) as DashboardVisit[];
  const days = dates.map((date) => ({ date, visits: visits.filter((visit) => visit.visit_date === date) }));
  return { days, totalVisits: visits.length, isAvailable: true };
}

export async function getTodayQueue(now: Date = new Date()): Promise<TodayQueueItem[]> {
  const { date: today } = getWarsawDateParts(now);
  const fields = "id, patient_id, name, location, location_id, visit_date, visit_time, status, message, source";
  const { data, error } = await supabaseAdmin.from("bookings").select(fields).eq("visit_date", today).order("visit_time", { ascending: true });
  if (error) throw error;
  const visits = (data ?? []) as Array<DashboardVisit & Pick<Visit, "patient_id" | "message">>;
  const patientIds = [...new Set(visits.flatMap((visit) => visit.patient_id ? [visit.patient_id] : []))];
  const [allVisitsResult, followupSuggestions] = await Promise.all([
    patientIds.length ? supabaseAdmin.from("bookings").select("id, patient_id, visit_date, visit_time, status").in("patient_id", patientIds) : Promise.resolve({ data: [], error: null }),
    getFollowupSuggestions(now).catch(() => []),
  ]);
  if (allVisitsResult.error) throw allVisitsResult.error;
  const allVisits = (allVisitsResult.data ?? []) as Array<Pick<Visit, "id" | "patient_id" | "visit_date" | "visit_time" | "status">>;
  const followupPatientIds = new Set(followupSuggestions.map((suggestion) => suggestion.patientId));

  return Promise.all(visits.map(async (visit) => {
    const previousVisits = visit.patient_id ? allVisits.filter((item) => item.patient_id === visit.patient_id && item.id !== visit.id && item.visit_date < visit.visit_date) : [];
    const [notes, tasks, plan, memory, materials] = await Promise.all([
      visit.patient_id ? getPatientNotes(visit.patient_id).catch(() => []) : Promise.resolve([]),
      visit.patient_id ? getPatientTasks(visit.patient_id).catch(() => []) : Promise.resolve([]),
      getVisitPlan(visit.id).catch(() => null),
      visit.patient_id ? getPinnedPatientMemory(visit.patient_id).catch(() => []) : Promise.resolve([]),
      getVisitKnowledgeMaterials(visit.id).catch(() => []),
    ]);
    const activeTask = tasks.find((task) => task.status !== "completed") ?? null;
    const requiresFollowup = visit.patient_id ? followupPatientIds.has(visit.patient_id) : false;
    return { ...visit, previousVisitsCount: previousVisits.length, latestNote: notes[0] ?? null, activeTask, hasVisitPlan: Boolean(plan), pinnedMemoryCount: memory.length, pinnedMaterialsCount: materials.length, requiresFollowup, requiresClosure: visit.status === "Zrealizowane" && Boolean(activeTask || requiresFollowup) };
  }));
}

export async function getNextUpcomingVisit(now: Date = new Date()): Promise<TodayQueueItem | null> {
  const { date: today, time } = getWarsawDateParts(now);
  const fields = "id, patient_id, name, location, location_id, visit_date, visit_time, status, message, source";
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(fields)
    .gte("visit_date", today)
    .neq("status", "Odwołane")
    .order("visit_date", { ascending: true })
    .order("visit_time", { ascending: true })
    .limit(20);
  if (error) throw error;
  const visits = (data ?? []) as Array<DashboardVisit & Pick<Visit, "patient_id" | "message">>;
  const next = visits.find((visit) => visit.visit_date > today || visit.visit_time >= time);
  if (!next) return null;
  return (await enrichQueueVisits([next]))[0] ?? null;
}

export async function getNewBookingRequests(now: Date = new Date()): Promise<DashboardRequest[]> {
  const { date: today } = getWarsawDateParts(now);
  const fields = "id, patient_id, name, location, location_id, visit_date, visit_time, status, message, source";
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(fields)
    .gte("visit_date", today)
    .eq("status", "Nowe")
    .order("visit_date", { ascending: true })
    .order("visit_time", { ascending: true })
    .limit(8);
  if (error) throw error;
  return (data ?? []) as DashboardRequest[];
}

export async function getDashboardAttentionItems(now: Date = new Date()): Promise<DashboardAttentionItem[]> {
  const { date: today } = getWarsawDateParts(now);
  const [unlinkedResult, completedResult, notesResult] = await Promise.all([
    supabaseAdmin
      .from("bookings")
      .select("id, name, visit_date, visit_time")
      .gte("visit_date", today)
      .neq("status", "Odwołane")
      .is("patient_id", null)
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true })
      .limit(8),
    supabaseAdmin
      .from("bookings")
      .select("id, patient_id, name, visit_date, visit_time")
      .eq("status", "Zrealizowane")
      .not("patient_id", "is", null)
      .order("visit_date", { ascending: false })
      .limit(20),
    supabaseAdmin.from("patient_notes").select("visit_id").not("visit_id", "is", null),
  ]);
  if (unlinkedResult.error) throw unlinkedResult.error;
  if (completedResult.error) throw completedResult.error;

  const unlinked: DashboardAttentionItem[] = (unlinkedResult.data ?? []).map((visit) => ({
    id: `unlinked-${visit.id}`,
    kind: "unlinked",
    title: `${visit.name} — brak przypisanej karty pacjenta`,
    description: `${visit.visit_date} · ${visit.visit_time}`,
    href: `/panel/visits/${visit.id}/brief`,
  }));

  if (notesResult.error && !isTableMissing(notesResult.error.code)) throw notesResult.error;
  const missingNotes: DashboardAttentionItem[] = notesResult.error ? [] : (() => {
    const visitsWithNotes = new Set((notesResult.data ?? []).map((note) => note.visit_id));
    return (completedResult.data ?? [])
      .filter((visit) => !visitsWithNotes.has(visit.id))
      .map((visit) => ({
        id: `missing-note-${visit.id}`,
        kind: "missing_note" as const,
        title: `${visit.name} — brak notatki po zrealizowanej wizycie`,
        description: `${visit.visit_date} · ${visit.visit_time}`,
        href: `/panel/visits/${visit.id}/session`,
      }));
  })();

  return [...unlinked, ...missingNotes].slice(0, 10);
}

async function enrichQueueVisits(visits: Array<DashboardVisit & Pick<Visit, "patient_id" | "message">>): Promise<TodayQueueItem[]> {
  const patientIds = [...new Set(visits.flatMap((visit) => visit.patient_id ? [visit.patient_id] : []))];
  const [allVisitsResult, followupSuggestions] = await Promise.all([
    patientIds.length ? supabaseAdmin.from("bookings").select("id, patient_id, visit_date, visit_time, status").in("patient_id", patientIds) : Promise.resolve({ data: [], error: null }),
    getFollowupSuggestions().catch(() => []),
  ]);
  if (allVisitsResult.error) throw allVisitsResult.error;
  const allVisits = (allVisitsResult.data ?? []) as Array<Pick<Visit, "id" | "patient_id" | "visit_date" | "visit_time" | "status">>;
  const followupPatientIds = new Set(followupSuggestions.map((suggestion) => suggestion.patientId));

  return Promise.all(visits.map(async (visit) => {
    const previousVisits = visit.patient_id ? allVisits.filter((item) => item.patient_id === visit.patient_id && item.id !== visit.id && item.visit_date < visit.visit_date) : [];
    const [notes, tasks, plan, memory, materials] = await Promise.all([
      visit.patient_id ? getPatientNotes(visit.patient_id).catch(() => []) : Promise.resolve([]),
      visit.patient_id ? getPatientTasks(visit.patient_id).catch(() => []) : Promise.resolve([]),
      getVisitPlan(visit.id).catch(() => null),
      visit.patient_id ? getPinnedPatientMemory(visit.patient_id).catch(() => []) : Promise.resolve([]),
      getVisitKnowledgeMaterials(visit.id).catch(() => []),
    ]);
    const activeTask = tasks.find((task) => task.status !== "completed") ?? null;
    const requiresFollowup = visit.patient_id ? followupPatientIds.has(visit.patient_id) : false;
    return { ...visit, previousVisitsCount: previousVisits.length, latestNote: notes[0] ?? null, activeTask, hasVisitPlan: Boolean(plan), pinnedMemoryCount: memory.length, pinnedMaterialsCount: materials.length, requiresFollowup, requiresClosure: visit.status === "Zrealizowane" && Boolean(activeTask || requiresFollowup) };
  }));
}

function isTableMissing(errorCode: string | undefined) {
  return errorCode === "42P01" || errorCode === "42703";
}

function isInWarsawDay(value: string | null | undefined, date: string) {
  if (!value) return false;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}` === date;
}

function nextCalendarDate(date: string, daysToAdd = 1) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + daysToAdd);
  return next.toISOString().slice(0, 10);
}

export async function getDayClosingSummary(now: Date = new Date()): Promise<DayClosingSummary> {
  const { date } = getWarsawDateParts(now);
  const tomorrowDate = nextCalendarDate(date);
  const bookingsResult = await supabaseAdmin.from("bookings").select("id, patient_id, name, visit_date, visit_time, status").eq("visit_date", date).order("visit_time", { ascending: true });
  if (bookingsResult.error) throw bookingsResult.error;
  const visits = (bookingsResult.data ?? []) as Array<Pick<Visit, "id" | "patient_id" | "name" | "visit_date" | "visit_time" | "status">>;
  const patientIds = [...new Set(visits.flatMap((visit) => visit.patient_id ? [visit.patient_id] : []))];
  const [notesResult, tasksResult, followupsResult, patientsResult, tomorrowResult] = await Promise.all([
    supabaseAdmin.from("patient_notes").select("id, visit_id, created_at"),
    supabaseAdmin.from("patient_tasks").select("id, created_at"),
    supabaseAdmin.from("followup_reminders").select("id, patient_id, title, status").eq("status", "open"),
    supabaseAdmin.from("patients").select("id, name, created_at, review_request_sent, review_request_scheduled_at"),
    supabaseAdmin.from("bookings").select("id, patient_id, visit_time, status").eq("visit_date", tomorrowDate).neq("status", "Odwołane").order("visit_time", { ascending: true }),
  ]);
  for (const result of [notesResult, tasksResult, followupsResult, patientsResult]) {
    if (result.error && !isTableMissing(result.error.code)) throw result.error;
  }
  if (tomorrowResult.error) throw tomorrowResult.error;

  const notes = notesResult.error ? [] : (notesResult.data ?? []) as Array<{ id: string; visit_id: number | null; created_at: string }>;
  const tasks = tasksResult.error ? [] : (tasksResult.data ?? []) as Array<{ id: string; created_at: string }>;
  const followups = followupsResult.error ? [] : (followupsResult.data ?? []) as Array<{ id: string; patient_id: string; title: string; status: "open" }>;
  const patients = patientsResult.error ? [] : (patientsResult.data ?? []) as Array<{ id: string; name: string; created_at: string; review_request_sent: boolean; review_request_scheduled_at: string | null }>;
  const completed = visits.filter((visit) => visit.status === "Zrealizowane");
  const cancelled = visits.filter((visit) => visit.status === "Odwołane");
  const notesByVisit = new Set(notes.map((note) => note.visit_id).filter((id): id is number => id !== null));
  const incompleteVisits = visits.filter((visit) => visit.status !== "Zrealizowane" && visit.status !== "Odwołane");
  const completedWithoutNote = notesResult.error ? [] : completed.filter((visit) => !notesByVisit.has(visit.id));
  const carePendingPatients = patientsResult.error ? [] : patients.filter((patient) => !patient.review_request_sent && isInWarsawDay(patient.review_request_scheduled_at, date));
  const followupsForToday = followupsResult.error ? [] : followups.filter((reminder) => patientIds.includes(reminder.patient_id));
  const closureVisits = new Set([...incompleteVisits, ...completedWithoutNote].map((visit) => visit.id));
  const visitByPatient = new Map(visits.filter((visit) => visit.patient_id).map((visit) => [visit.patient_id!, visit]));
  const closureItems: DayClosingItem[] = [
    ...completedWithoutNote.map((visit) => ({ id: `note-${visit.id}`, patientName: visit.name, visitTime: visit.visit_time, missing: "Brak notatki", href: `/panel/visits/${visit.id}/session` })),
    ...incompleteVisits.map((visit) => ({ id: `visit-${visit.id}`, patientName: visit.name, visitTime: visit.visit_time, missing: "Nie zakończono workflow wizyty", href: `/panel/visits/${visit.id}/brief` })),
    ...followupsForToday.flatMap((reminder) => { const visit = visitByPatient.get(reminder.patient_id); return visit ? [{ id: `followup-${reminder.id}`, patientName: visit.name, visitTime: visit.visit_time, missing: `Otwarte Follow-up: ${reminder.title}`, href: `/panel/visits/${visit.id}/brief` }] : []; }),
    ...carePendingPatients.flatMap((patient) => { const visit = visitByPatient.get(patient.id); return visit ? [{ id: `care-${patient.id}`, patientName: patient.name, visitTime: visit.visit_time, missing: "Care After Visit oczekuje na zaplanowaną wysyłkę", href: "/panel/reviews" }] : []; }),
  ].slice(0, 5);

  return {
    date,
    totalVisits: visits.length,
    completedVisits: completed.length,
    cancelledVisits: cancelled.length,
    newPatients: patientsResult.error ? null : patients.filter((patient) => isInWarsawDay(patient.created_at, date)).length,
    visitsRequiringClosure: closureVisits.size,
    unsavedOrIncompleteNotes: null,
    notesAdded: notesResult.error ? null : notes.filter((note) => isInWarsawDay(note.created_at, date)).length,
    activeFollowups: followupsResult.error ? null : followups.length,
    tasksCreated: tasksResult.error ? null : tasks.filter((task) => isInWarsawDay(task.created_at, date)).length,
    careAfterVisitPending: patientsResult.error ? null : carePendingPatients.length,
    closureItems,
    tomorrow: { visitsCount: (tomorrowResult.data ?? []).length, firstVisitTime: tomorrowResult.data?.[0]?.visit_time ?? null, hasNewPatients: null },
  };
}

export async function getDailyFlowState(now: Date = new Date()): Promise<DailyFlowState> {
  const { time } = getWarsawDateParts(now);
  const [dashboard, closing] = await Promise.all([getDashboardDayData(now), getDayClosingSummary(now)]);
  const actionableVisits = dashboard.todayVisits.filter((visit) => visit.status !== "Odwołane" && visit.status !== "Zrealizowane");
  const [nowHour, nowMinute] = time.split(":").map(Number); const current = nowHour * 60 + nowMinute;
  const activeVisit = actionableVisits.find((visit) => { const [hour, minute] = visit.visit_time.split(":").map(Number); const start = hour * 60 + minute; return current >= start && current < start + 50; });
  if (activeVisit) return { kind: "visit_active", title: `Trwa wizyta: ${activeVisit.name}`, description: "Wróć do trybu sesji i kontynuuj spotkanie.", href: `/panel/visits/${activeVisit.id}/session`, visitTime: activeVisit.visit_time };
  const nextVisit = actionableVisits.find((visit) => visit.visit_time >= time);
  if (nextVisit) { const [hour, minute] = nextVisit.visit_time.split(":").map(Number); if (hour * 60 + minute - current <= 15) return { kind: "visit_preparation", title: `Za chwilę: ${nextVisit.name}`, description: "Warto zerknąć na ostatnią notatkę i zadanie przed spotkaniem.", href: `/panel/visits/${nextVisit.id}/brief`, visitTime: nextVisit.visit_time }; }
  const closure = closing.closureItems[0];
  if (closure) return { kind: "visit_closure", title: `Domknij: ${closure.patientName}`, description: closure.missing, href: closure.href, visitTime: closure.visitTime };
  if (nextVisit) return { kind: "visit_preparation", title: `Za chwilę: ${nextVisit.name}`, description: "Warto zerknąć na ostatnią notatkę i zadanie przed spotkaniem.", href: `/panel/visits/${nextVisit.id}/brief`, visitTime: nextVisit.visit_time };
  if (closing.activeFollowups && closing.activeFollowups > 0) return { kind: "followup_attention", title: "Follow-up wymagają uwagi", description: "Sprawdź otwarte przypomnienia przed zakończeniem dnia.", href: "/panel/day-closing", visitTime: null };
  if (dashboard.todayVisits.length > 0) return { kind: "day_closing", title: "Zakończ dzień", description: "Sprawdź spokojnie, czy wszystkie sprawy są domknięte.", href: "/panel/day-closing", visitTime: null };
  return { kind: "today_queue", title: "Zobacz dzisiejszą kolejkę", description: "Nie ma teraz pilnych działań.", href: "/panel", visitTime: null };
}
