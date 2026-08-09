import type { PsycholkaAnimationAsset, PsycholkaAction, PsycholkaContext } from "./psycholkaTypes";

// Final assets will use the approved PsychOLKA character reference:
// adult woman, dark-blonde/light-brown hair, pink blazer, black top, jeans,
// warm playful expression.
export const psycholkaAssets: PsycholkaAnimationAsset[] = [
  { id: "idle-default-v1", action: "idle", src: "/psycholka/idle/idle-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2600, contextAllowlist: ["welcome", "today", "before_visit", "session", "after_visit", "empty_state", "homework"] },
  { id: "wave-default-v1", action: "wave", src: "/psycholka/wave/wave-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 1800, contextAllowlist: ["welcome", "dashboard", "today", "after_visit", "success"] },
  { id: "coffee-default-v1", action: "coffee", src: "/psycholka/coffee/coffee-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["dashboard", "day_closing"] },
  { id: "greeting-default-v1", action: "greeting", src: "/psycholka/greeting/greeting-default-v1.webp", format: "webp", width: 320, height: 400, loop: false, durationMs: 2500, contextAllowlist: ["welcome"] },
  { id: "open-arms-default-v1", action: "open_arms", src: "/psycholka/open-arms/open-arms-default-v1.webp", format: "webp", width: 320, height: 400, loop: false, durationMs: 1000, contextAllowlist: ["welcome"] },
  { id: "point-booking-default-v1", action: "point_booking", src: "/psycholka/point-booking/point-booking-default-v1.webp", format: "webp", width: 320, height: 400, loop: false, durationMs: null, contextAllowlist: ["welcome"] },
  // Planned context assets. Until the WebP files are delivered, PsycholkaWidget
  // safely switches to the explicit fallback passed by the calling section.
  { id: "search-default-v1", action: "search", src: "/psycholka/search/search-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["dashboard"] },
  { id: "sad-default-v1", action: "sad", src: "/psycholka/sad/sad-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["today"] },
  { id: "happy-default-v1", action: "happy", src: "/psycholka/happy/happy-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["today"] },
  { id: "meet-aleksandra-default-v1", action: "meet_aleksandra", src: "/psycholka/meet-aleksandra/meet-aleksandra-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "help-path-default-v1", action: "help_path", src: "/psycholka/help-path/help-path-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "locations-default-v1", action: "locations", src: "/psycholka/locations/locations-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "reviews-default-v1", action: "reviews", src: "/psycholka/reviews/reviews-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "account-whisper-default-v1", action: "account_whisper", src: "/psycholka/account-whisper/account-whisper-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "booking-choice-default-v1", action: "booking_choice", src: "/psycholka/booking-choice/booking-choice-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
  { id: "goodbye-default-v1", action: "goodbye", src: "/psycholka/goodbye/goodbye-default-v1.webp", format: "webp", width: 320, height: 400, loop: true, durationMs: 2400, contextAllowlist: ["welcome"] },
];

export const publicJourneyAssets = [
  { place: "Hero", action: "greeting", path: "/psycholka/greeting/greeting-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Booking", action: "point_booking", path: "/psycholka/point-booking/point-booking-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Aleksandra", action: "meet_aleksandra", path: "/psycholka/meet-aleksandra/meet-aleksandra-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Zakres pomocy", action: "help_path", path: "/psycholka/help-path/help-path-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Gabinety", action: "locations", path: "/psycholka/locations/locations-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Opinie", action: "reviews", path: "/psycholka/reviews/reviews-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Konto", action: "account_whisper", path: "/psycholka/account-whisper/account-whisper-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Wybór wizyty", action: "booking_choice", path: "/psycholka/booking-choice/booking-choice-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
  { place: "Pożegnanie", action: "goodbye", path: "/psycholka/goodbye/goodbye-default-v1.webp", fallback: "greeting → idle → neutralny widok" },
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
