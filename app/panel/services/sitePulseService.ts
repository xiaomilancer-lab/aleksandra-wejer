import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { emptySitePulseDashboardData, type SitePulseDashboardData, type SitePulseEventType, type SitePulsePageKey, type SitePulseSectionKey } from "@/app/site-pulse/domain";
import { tableMissing } from "@/app/site-pulse/server";

type PulseEvent = {
  journey_id: string;
  event_type: SitePulseEventType;
  page_key: SitePulsePageKey;
  section_key: SitePulseSectionKey | null;
  source_key: string | null;
  occurred_at: string;
};

const PAGE_SIZE = 1000;
const ACTIVE_WINDOW_MS = 150_000;

export async function getSitePulseDashboardData(now = new Date()): Promise<SitePulseDashboardData> {
  const today = warsawDate(now);
  const todayStart = warsawMidnight(today).toISOString();
  const sevenDaysStart = warsawMidnight(addDays(today, -6)).toISOString();
  const activeSince = new Date(now.getTime() - ACTIVE_WINDOW_MS).toISOString();

  const presenceResult = await supabaseAdmin.from("site_analytics_presence").select("journey_id", { count: "exact", head: true }).gte("last_seen_at", activeSince);
  if (presenceResult.error) {
    if (tableMissing(presenceResult.error.code)) return emptySitePulseDashboardData;
    throw presenceResult.error;
  }

  const events = await getEventsSince(sevenDaysStart);
  if (events === null) return emptySitePulseDashboardData;
  const todayEvents = events.filter((event) => event.occurred_at >= todayStart);
  const visitorsToday = uniqueSessions(todayEvents.filter((event) => event.event_type === "page_view")).size;
  const visitorsSevenDays = uniqueSessions(events.filter((event) => event.event_type === "page_view")).size;

  return {
    available: true,
    activeNow: presenceResult.count ?? 0,
    visitorsToday,
    visitorsSevenDays,
    bookingOpened: uniqueSessions(events.filter((event) => event.event_type === "booking_opened")).size,
    bookingFormStarted: uniqueSessions(events.filter((event) => event.event_type === "booking_form_started")).size,
    bookingCompleted: uniqueSessions(events.filter((event) => event.event_type === "booking_completed")).size,
    sources: groupedSessions(events.filter((event) => event.event_type === "page_view"), (event) => event.source_key || "direct").slice(0, 5),
    sections: groupedSessions(events.filter((event) => event.event_type === "section_view" && event.section_key), (event) => sectionLabel(event.section_key!)).slice(0, 5),
    latestActivity: events[0] ? { message: activityMessage(events[0]), occurredAt: events[0].occurred_at } : null,
  };
}

async function getEventsSince(from: string): Promise<PulseEvent[] | null> {
  const rows: PulseEvent[] = [];
  for (let start = 0; ; start += PAGE_SIZE) {
    const result = await supabaseAdmin.from("site_analytics_events").select("journey_id, event_type, page_key, section_key, source_key, occurred_at").gte("occurred_at", from).order("occurred_at", { ascending: false }).range(start, start + PAGE_SIZE - 1);
    if (result.error) {
      if (tableMissing(result.error.code)) return null;
      throw result.error;
    }
    const page = (result.data ?? []) as PulseEvent[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

function uniqueSessions(events: PulseEvent[]) {
  return new Set(events.map((event) => event.journey_id));
}

function groupedSessions(events: PulseEvent[], label: (event: PulseEvent) => string) {
  const groups = new Map<string, Set<string>>();
  for (const event of events) {
    const key = label(event);
    const sessions = groups.get(key) ?? new Set<string>();
    sessions.add(event.journey_id);
    groups.set(key, sessions);
  }
  return [...groups].map(([key, sessions]) => ({ label: sourceLabel(key), count: sessions.size })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "pl"));
}

function activityMessage(event: PulseEvent) {
  const page = pageLabel(event.page_key);
  if (event.event_type === "booking_opened") return `Ktoś przeszedł do rezerwacji na stronie ${page}.`;
  if (event.event_type === "booking_form_started") return `Ktoś rozpoczął formularz rezerwacji na stronie ${page}.`;
  if (event.event_type === "booking_completed") return `Ktoś zakończył rezerwację na stronie ${page}.`;
  if (event.event_type === "section_view" && event.section_key) return `Ktoś oglądał sekcję „${sectionLabel(event.section_key)}” na stronie ${page}.`;
  return `Ktoś odwiedził stronę ${page}.`;
}

function pageLabel(page: SitePulsePageKey) {
  return page === "home" ? "głównej" : page === "arthro" ? "Arthro" : "Zielińscy";
}

function sectionLabel(section: SitePulseSectionKey) {
  return ({ hero: "Start", about: "O mnie", services: "Wsparcie", booking: "Rezerwacja", contact: "Kontakt" } as const)[section];
}

function sourceLabel(source: string) {
  if (source === "direct") return "Wejście bezpośrednie";
  if (source === "arthro") return "Arthro Cure Clinic";
  if (source === "zielinscy") return "Zielińscy Premium";
  return source;
}

function warsawDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function warsawMidnight(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const approximate = Date.UTC(year, month - 1, day);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(approximate));
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
  const displayed = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute);
  return new Date(approximate - (displayed - approximate));
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}
