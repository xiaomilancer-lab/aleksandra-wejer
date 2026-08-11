import "server-only";

import { isSitePulseEventType, isSitePulsePageKey, isSitePulseSectionKey, type SitePulseAttribution } from "./domain";
import { verifySitePulseSessionToken } from "./sessionToken";

export const SITE_PULSE_BODY_LIMIT = 2048;

export function validatePublicPulseRequest(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin && request.headers.get("content-type")?.toLowerCase().startsWith("application/json"));
}

export function bodyIsTooLarge(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(length) && length > SITE_PULSE_BODY_LIMIT;
}

export function readSession(body: Record<string, unknown>) {
  return typeof body.token === "string" ? verifySitePulseSessionToken(body.token) : null;
}

export function readEventInput(body: Record<string, unknown>) {
  if (!hasOnlyKeys(body, ["token", "eventId", "eventType", "pageKey", "sectionKey", "sourceKey", "utmSource", "utmMedium", "utmCampaign"])) return null;
  if (!isUuid(body.eventId) || !isSitePulseEventType(body.eventType) || !isSitePulsePageKey(body.pageKey)) return null;
  const sectionKey = body.sectionKey == null ? null : isSitePulseSectionKey(body.sectionKey) ? body.sectionKey : undefined;
  if (sectionKey === undefined) return null;
  if (body.eventType === "page_view" && sectionKey !== null) return null;
  if (body.eventType === "section_view" && sectionKey === null) return null;
  if (["booking_opened", "booking_form_started", "booking_completed"].includes(body.eventType) && sectionKey !== "booking") return null;
  return {
    eventId: body.eventId,
    eventType: body.eventType,
    pageKey: body.pageKey,
    sectionKey,
    attribution: readAttribution(body),
  };
}

export function readPresenceInput(body: Record<string, unknown>) {
  if (!hasOnlyKeys(body, ["token", "pageKey", "sectionKey", "sourceKey", "utmSource", "utmMedium", "utmCampaign"])) return null;
  if (!isSitePulsePageKey(body.pageKey)) return null;
  const sectionKey = body.sectionKey == null ? null : isSitePulseSectionKey(body.sectionKey) ? body.sectionKey : undefined;
  return sectionKey === undefined ? null : { pageKey: body.pageKey, sectionKey, attribution: readAttribution(body) };
}

function readAttribution(body: Record<string, unknown>): SitePulseAttribution {
  return {
    sourceKey: safeToken(body.sourceKey) ?? "direct",
    utmSource: safeToken(body.utmSource),
    utmMedium: safeToken(body.utmMedium),
    utmCampaign: safeToken(body.utmCampaign),
  };
}

function safeToken(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized && normalized.length <= 64 && /^[a-z0-9._-]+$/.test(normalized) ? normalized : null;
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hasOnlyKeys(body: Record<string, unknown>, allowed: string[]) {
  const keys = new Set(allowed);
  return Object.keys(body).every((key) => keys.has(key));
}

export function tableMissing(code: string | undefined) {
  return code === "42P01" || code === "PGRST205";
}
