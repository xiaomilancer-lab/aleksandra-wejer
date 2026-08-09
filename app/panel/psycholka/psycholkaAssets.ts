import type { PsycholkaAnimationAsset, PsycholkaAction, PsycholkaContext } from "./psycholkaTypes";
import { PsycholkaAssets } from "@/public/psycholka";

// Final assets will use the approved PsychOLKA character reference:
// adult woman, dark-blonde/light-brown hair, pink blazer, black top, jeans,
// warm playful expression.
export const psycholkaAssets: PsycholkaAnimationAsset[] = [
  { id: "idle-default-v1", action: "idle", src: PsycholkaAssets.legacy.idleDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2600, contextAllowlist: ["welcome", "today", "before_visit", "session", "after_visit", "empty_state", "homework"] },
  { id: "wave-default-v1", action: "wave", src: PsycholkaAssets.legacy.waveDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 1800, contextAllowlist: ["welcome", "dashboard", "today", "after_visit", "success"] },
  { id: "coffee-default-v1", action: "coffee", src: PsycholkaAssets.legacy.coffeeDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["dashboard", "day_closing"] },
  { id: "greeting-default-v1", action: "greeting", src: PsycholkaAssets.legacy.greetingDefault, format: "webp", width: 320, height: 400, loop: false, durationMs: 2500, contextAllowlist: ["welcome"] },
  { id: "open-arms-default-v1", action: "open_arms", src: PsycholkaAssets.legacy.openArmsDefault, format: "webp", width: 320, height: 400, loop: false, durationMs: 1000, contextAllowlist: ["welcome"] },
  { id: "point-booking-default-v1", action: "point_booking", src: PsycholkaAssets.legacy.pointBookingDefault, format: "webp", width: 320, height: 400, loop: false, durationMs: null, contextAllowlist: ["welcome"] },
  // Planned context assets. Until the WebP files are delivered, PsycholkaWidget
  // safely switches to the explicit fallback passed by the calling section.
  { id: "search-default-v1", action: "search", src: PsycholkaAssets.legacy.searchDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["dashboard"] },
  { id: "sad-default-v1", action: "sad", src: PsycholkaAssets.legacy.sadDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["today"] },
  { id: "happy-default-v1", action: "happy", src: PsycholkaAssets.legacy.happyDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["today"] },
  { id: "meet-aleksandra-default-v1", action: "meet_aleksandra", src: PsycholkaAssets.legacy.meetAleksandraDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "help-path-default-v1", action: "help_path", src: PsycholkaAssets.legacy.helpPathDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "locations-default-v1", action: "locations", src: PsycholkaAssets.legacy.locationsDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "reviews-default-v1", action: "reviews", src: PsycholkaAssets.legacy.reviewsDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "account-whisper-default-v1", action: "account_whisper", src: PsycholkaAssets.legacy.accountWhisperDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "booking-choice-default-v1", action: "booking_choice", src: PsycholkaAssets.legacy.bookingChoiceDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "goodbye-default-v1", action: "goodbye", src: PsycholkaAssets.legacy.goodbyeDefault, format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
];

export const publicJourneyAssets = [
  { place: "Hero", action: "greeting", path: PsycholkaAssets.legacy.greetingDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Booking", action: "point_booking", path: PsycholkaAssets.legacy.pointBookingDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Aleksandra", action: "meet_aleksandra", path: PsycholkaAssets.legacy.meetAleksandraDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Zakres pomocy", action: "help_path", path: PsycholkaAssets.legacy.helpPathDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Gabinety", action: "locations", path: PsycholkaAssets.legacy.locationsDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Opinie", action: "reviews", path: PsycholkaAssets.legacy.reviewsDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Konto", action: "account_whisper", path: PsycholkaAssets.legacy.accountWhisperDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Wybór wizyty", action: "booking_choice", path: PsycholkaAssets.legacy.bookingChoiceDefault, fallback: "greeting → idle → neutralny widok" },
  { place: "Pożegnanie", action: "goodbye", path: PsycholkaAssets.legacy.goodbyeDefault, fallback: "greeting → idle → neutralny widok" },
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
