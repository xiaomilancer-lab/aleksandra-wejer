"use client";

import { pageKeyFromPathname, type SitePulseAttribution, type SitePulseEventType, type SitePulseSectionKey } from "./domain";

const SESSION_STORAGE_KEY = "site-pulse:session";
const ATTRIBUTION_STORAGE_KEY = "site-pulse:attribution";
const sentKeys = new Set<string>();
let sessionRequest: Promise<string | null> | null = null;
let disabledUntil = 0;
let activeSection: SitePulseSectionKey | null = null;

export function setSitePulseActiveSection(section: SitePulseSectionKey | null) {
  activeSection = section;
}

export async function trackSitePulseEvent(eventType: SitePulseEventType, sectionKey: SitePulseSectionKey | null = null) {
  if (typeof window === "undefined") return;
  const pageKey = pageKeyFromPathname(window.location.pathname);
  if (!pageKey) return;
  const dedupeKey = `${pageKey}:${eventType}:${sectionKey ?? "none"}`;
  if (sentKeys.has(dedupeKey) || wasSent(dedupeKey)) return;
  sentKeys.add(dedupeKey);

  const token = await ensureSession();
  if (!token) { sentKeys.delete(dedupeKey); return; }
  const response = await send("/api/site-pulse/event", { token, eventId: crypto.randomUUID(), eventType, pageKey, sectionKey, ...getAttribution() });
  if (response?.accepted) markSent(dedupeKey);
  else sentKeys.delete(dedupeKey);
}

export async function sendSitePulseHeartbeat() {
  if (typeof window === "undefined" || document.visibilityState !== "visible") return;
  const pageKey = pageKeyFromPathname(window.location.pathname);
  if (!pageKey) return;
  const token = await ensureSession();
  if (!token) return;
  await send("/api/site-pulse/heartbeat", { token, pageKey, sectionKey: activeSection, ...getAttribution() });
}

async function ensureSession() {
  if (Date.now() < disabledUntil) return null;
  const stored = readStoredSession();
  if (stored) return stored;
  if (!sessionRequest) sessionRequest = fetch("/api/site-pulse/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}", credentials: "same-origin" })
    .then(async (response) => {
      if (!response.ok) { disabledUntil = Date.now() + 5 * 60_000; return null; }
      const data = await response.json() as { token?: string; expiresAt?: number };
      if (!data.token || !data.expiresAt) return null;
      try { sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data)); } catch { /* A private browser may deny storage. */ }
      return data.token;
    })
    .catch(() => { disabledUntil = Date.now() + 5 * 60_000; return null; })
    .finally(() => { sessionRequest = null; });
  return sessionRequest;
}

function readStoredSession() {
  try {
    const data = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) ?? "null") as { token?: string; expiresAt?: number } | null;
    if (data?.token && data.expiresAt && data.expiresAt > Math.floor(Date.now() / 1000) + 30) return data.token;
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch { sessionStorage.removeItem(SESSION_STORAGE_KEY); }
  return null;
}

function getAttribution(): SitePulseAttribution {
  try {
    const stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "null") as SitePulseAttribution | null;
    if (stored?.sourceKey) return stored;
  } catch { sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY); }
  const params = new URLSearchParams(window.location.search);
  const utmSource = clean(params.get("utm_source"));
  const source = clean(params.get("source"));
  const attribution: SitePulseAttribution = {
    sourceKey: utmSource ?? source ?? cleanReferrer() ?? "direct",
    utmSource,
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
  };
  try { sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution)); } catch { /* Attribution remains in this request only. */ }
  return attribution;
}

function cleanReferrer() {
  try { return document.referrer ? clean(new URL(document.referrer).hostname.replace(/^www\./, "")) : null; } catch { return null; }
}

function clean(value: string | null) {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
  return normalized || null;
}

async function send(path: string, body: object) {
  try {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin", keepalive: true });
    if (response.status === 401) sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return await response.json() as { accepted?: boolean };
  } catch { return null; }
}

function wasSent(key: string) {
  try { return Boolean(sessionStorage.getItem(`site-pulse:sent:${key}`)); } catch { return false; }
}

function markSent(key: string) {
  try { sessionStorage.setItem(`site-pulse:sent:${key}`, "1"); } catch { /* In-memory deduplication still applies. */ }
}
