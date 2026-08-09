import type { AvailabilityResponse } from "../../components/booking/SmartBookingFlow";

/** Presentation rules for a partner channel; the central generator stays unchanged. */
export function applyPartnerAvailabilityRules(partnerId: string, availability: AvailabilityResponse): AvailabilityResponse {
  if (partnerId !== "zielinscy" || availability.state !== "AVAILABLE") return availability;

  const slots = availability.slots.filter((slot) => new Date(`${slot.date}T12:00:00`).getDay() !== 2);
  return { ...availability, state: slots.length ? "AVAILABLE" : "NO_SLOTS", slots };
}
