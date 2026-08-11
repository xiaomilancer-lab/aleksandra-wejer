import type { BookingContext } from "../../booking/bookingContext";

export const bookingContexts: Record<string, BookingContext> = {
  "main-site": { id: "main-site", source: "main-site", partnerId: null, locationId: "main", location: "", allowedWeekdays: [1, 2, 3, 4, 5], allowedTimeRanges: [], showWhatsApp: true, showPhone: true, showWrittenForm: true, showZnanyLekarz: true, theme: "main", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę" },
  "partner-zielinscy": { id: "partner-zielinscy", source: "partner-zielinscy", partnerId: "zielinscy", locationId: "nowa-wies-rzeczna", location: "Nowa Wieś Rzeczna", allowedWeekdays: [], allowedTimeRanges: [], showWhatsApp: true, showPhone: true, showWrittenForm: true, showZnanyLekarz: false, theme: "zielinscy", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę w Nowej Wsi Rzecznej" },
  "partner-arthro": { id: "partner-arthro", source: "partner-arthro", partnerId: "arthro", locationId: "arthro-cure-clinic", location: "Arthro Cure Clinic", allowedWeekdays: [], allowedTimeRanges: [], showWhatsApp: false, showPhone: false, showWrittenForm: true, showZnanyLekarz: false, theme: "arthro", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę w Arthro Cure Clinic" },
  "partner-zielinscy-embed": { id: "partner-zielinscy-embed", source: "partner-zielinscy-embed", partnerId: "zielinscy", locationId: "nowa-wies-rzeczna", location: "Nowa Wieś Rzeczna", allowedWeekdays: [], allowedTimeRanges: [], showWhatsApp: true, showPhone: true, showWrittenForm: true, showZnanyLekarz: false, theme: "zielinscy", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę w Nowej Wsi Rzecznej" },
  "instagram-zielinscy": { id: "instagram-zielinscy", source: "instagram-zielinscy", partnerId: "zielinscy", locationId: "nowa-wies-rzeczna", location: "Nowa Wieś Rzeczna", allowedWeekdays: [], allowedTimeRanges: [], showWhatsApp: true, showPhone: true, showWrittenForm: true, showZnanyLekarz: false, theme: "zielinscy", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę w Nowej Wsi Rzecznej" },
  "facebook-zielinscy": { id: "facebook-zielinscy", source: "facebook-zielinscy", partnerId: "zielinscy", locationId: "nowa-wies-rzeczna", location: "Nowa Wieś Rzeczna", allowedWeekdays: [], allowedTimeRanges: [], showWhatsApp: true, showPhone: true, showWrittenForm: true, showZnanyLekarz: false, theme: "zielinscy", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę w Nowej Wsi Rzecznej" },
  "qr-zielinscy": { id: "qr-zielinscy", source: "qr-zielinscy", partnerId: "zielinscy", locationId: "nowa-wies-rzeczna", location: "Nowa Wieś Rzeczna", allowedWeekdays: [], allowedTimeRanges: [], showWhatsApp: true, showPhone: true, showWrittenForm: true, showZnanyLekarz: false, theme: "zielinscy", introMessage: "Cześć ❤️\nPomogę Ci znaleźć dogodny termin.", successMessage: "Aleksandra otrzymała zgłoszenie.", cta: "Umów wizytę w Nowej Wsi Rzecznej" },
  "future-mobile-app": { id: "future-mobile-app", source: "future-mobile-app", partnerId: null, locationId: "main", location: "", allowedWeekdays: [1, 2, 3, 4, 5], allowedTimeRanges: [], showWhatsApp: false, showPhone: false, showWrittenForm: true, showZnanyLekarz: false, theme: "mobile", introMessage: "Cześć ❤️", successMessage: "Zgłoszenie zapisane.", cta: "Umów wizytę" },
};

export const partnerConfig = {
  zielinscy: bookingContexts["partner-zielinscy"],
  arthro: bookingContexts["partner-arthro"],
} as const;

export type PartnerId = keyof typeof partnerConfig;

export function getPartnerConfig(partner: string) {
  return partnerConfig[partner as PartnerId] ?? null;
}

export function getBookingContext(id: string) {
  return bookingContexts[id] ?? null;
}
