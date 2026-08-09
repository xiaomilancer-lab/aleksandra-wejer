import type { PsycholkaAnimationAsset, PsycholkaAction, PsycholkaContext } from "./psycholkaTypes";
import { PsycholkaAssets } from "@/public/psycholka";

// The registry is the single mapping between a semantic PsychOLKA action and
// the current renderer asset. A future renderer can add Rive, Lottie or Live2D
// without changing consumers of PsycholkaWidget.
export const psycholkaAssets: PsycholkaAnimationAsset[] = [
  { id: "work-idle", action: "idle", src: PsycholkaAssets.work, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome", "today", "before_visit", "session", "after_visit", "empty_state", "homework"] },
  { id: "greeting-wave", action: "wave", src: PsycholkaAssets.greeting, format: "png", width: 320, height: 400, loop: false, durationMs: null, contextAllowlist: ["welcome", "dashboard", "today", "after_visit", "success"] },
  { id: "coffee-break", action: "coffee", src: PsycholkaAssets.lifestyle.coffee, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["dashboard", "day_closing"] },
  { id: "greeting", action: "greeting", src: PsycholkaAssets.greeting, format: "png", width: 320, height: 400, loop: false, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "greeting-open-arms", action: "open_arms", src: PsycholkaAssets.greeting, format: "png", width: 320, height: 400, loop: false, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "booking-calendar", action: "point_booking", src: PsycholkaAssets.booking.calendar, format: "png", width: 320, height: 400, loop: false, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "search-help", action: "search", src: PsycholkaAssets.booking.search, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["dashboard"] },
  { id: "waiting-sad", action: "sad", src: PsycholkaAssets.waiting, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["today", "welcome"] },
  { id: "success-happy", action: "happy", src: PsycholkaAssets.emotions.success, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["today", "welcome"] },
  { id: "work-meet", action: "meet_aleksandra", src: PsycholkaAssets.work, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "search-help-path", action: "help_path", src: PsycholkaAssets.booking.search, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "booking-locations", action: "locations", src: PsycholkaAssets.booking.calendar, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "success-reviews", action: "reviews", src: PsycholkaAssets.emotions.success, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "work-account", action: "account_whisper", src: PsycholkaAssets.work, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "booking-choice", action: "booking_choice", src: PsycholkaAssets.booking.calendar, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
  { id: "goodnight", action: "goodbye", src: PsycholkaAssets.emotions.goodnight, format: "png", width: 320, height: 400, loop: true, durationMs: null, contextAllowlist: ["welcome"] },
];

export const publicJourneyAssets = [
  { place: "Hero", action: "greeting", path: PsycholkaAssets.greeting, fallback: "greeting → neutralny widok" },
  { place: "Booking", action: "point_booking", path: PsycholkaAssets.booking.calendar, fallback: "greeting → neutralny widok" },
  { place: "Aleksandra", action: "meet_aleksandra", path: PsycholkaAssets.work, fallback: "greeting → neutralny widok" },
  { place: "Zakres pomocy", action: "help_path", path: PsycholkaAssets.booking.search, fallback: "greeting → neutralny widok" },
  { place: "Gabinety", action: "locations", path: PsycholkaAssets.booking.calendar, fallback: "greeting → neutralny widok" },
  { place: "Opinie", action: "reviews", path: PsycholkaAssets.emotions.success, fallback: "greeting → neutralny widok" },
  { place: "Konto", action: "account_whisper", path: PsycholkaAssets.work, fallback: "greeting → neutralny widok" },
  { place: "Wybór wizyty", action: "booking_choice", path: PsycholkaAssets.booking.calendar, fallback: "greeting → neutralny widok" },
  { place: "Pożegnanie", action: "goodbye", path: PsycholkaAssets.emotions.goodnight, fallback: "greeting → neutralny widok" },
] as const;

export function getPsycholkaAsset(action: PsycholkaAction, context: PsycholkaContext) {
  return psycholkaAssets.find((asset) => asset.action === action && asset.contextAllowlist.includes(context)) ?? null;
}

export function getPsycholkaGreetingFallback() {
  return psycholkaAssets.find((asset) => asset.action === "greeting") ?? null;
}

export function getPsycholkaIdleFallback(context: PsycholkaContext) {
  return getPsycholkaAsset("idle", context);
}
