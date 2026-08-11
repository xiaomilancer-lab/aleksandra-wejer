export const SITE_PULSE_PAGE_KEYS = ["home", "arthro", "zielinscy"] as const;
export const SITE_PULSE_SECTION_KEYS = ["hero", "about", "services", "booking", "contact"] as const;
export const SITE_PULSE_EVENT_TYPES = ["page_view", "section_view", "booking_opened", "booking_form_started", "booking_completed"] as const;

export type SitePulsePageKey = (typeof SITE_PULSE_PAGE_KEYS)[number];
export type SitePulseSectionKey = (typeof SITE_PULSE_SECTION_KEYS)[number];
export type SitePulseEventType = (typeof SITE_PULSE_EVENT_TYPES)[number];

export type SitePulseAttribution = {
  sourceKey: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export type SitePulseDashboardData = {
  available: boolean;
  activeNow: number;
  visitorsToday: number;
  visitorsSevenDays: number;
  bookingOpened: number;
  bookingFormStarted: number;
  bookingCompleted: number;
  sources: Array<{ label: string; count: number }>;
  sections: Array<{ label: string; count: number }>;
  latestActivity: { message: string; occurredAt: string } | null;
};

export function isSitePulsePageKey(value: unknown): value is SitePulsePageKey {
  return typeof value === "string" && SITE_PULSE_PAGE_KEYS.includes(value as SitePulsePageKey);
}

export function isSitePulseSectionKey(value: unknown): value is SitePulseSectionKey {
  return typeof value === "string" && SITE_PULSE_SECTION_KEYS.includes(value as SitePulseSectionKey);
}

export function isSitePulseEventType(value: unknown): value is SitePulseEventType {
  return typeof value === "string" && SITE_PULSE_EVENT_TYPES.includes(value as SitePulseEventType);
}

export function pageKeyFromPathname(pathname: string): SitePulsePageKey | null {
  if (pathname === "/") return "home";
  if (pathname === "/arthro") return "arthro";
  if (pathname === "/zielinscy") return "zielinscy";
  return null;
}

export const emptySitePulseDashboardData: SitePulseDashboardData = {
  available: false,
  activeNow: 0,
  visitorsToday: 0,
  visitorsSevenDays: 0,
  bookingOpened: 0,
  bookingFormStarted: 0,
  bookingCompleted: 0,
  sources: [],
  sections: [],
  latestActivity: null,
};
