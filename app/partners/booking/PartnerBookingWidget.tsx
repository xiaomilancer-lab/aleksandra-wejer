"use client";

import { useCallback } from "react";
import SmartBookingFlow, { type AvailabilityResponse, type BookingContact } from "../../components/booking/SmartBookingFlow";
import { bookingContexts, partnerConfig, type PartnerId } from "./partnerConfig";
import { applyPartnerAvailabilityRules } from "./partnerAvailabilityRules";

type SourceVariant = "instagram" | "qr" | "embed" | "facebook-zielinscy";

export default function PartnerBookingWidget({ partnerId, source }: { partnerId: PartnerId; source?: SourceVariant }) {
  const config = partnerId === "zielinscy" && source ? source === "instagram" ? bookingContexts["instagram-zielinscy"] : source === "qr" ? bookingContexts["qr-zielinscy"] : source === "facebook-zielinscy" ? bookingContexts["facebook-zielinscy"] : bookingContexts["partner-zielinscy-embed"] : partnerConfig[partnerId];
  const loadAvailability = useCallback(async (): Promise<AvailabilityResponse> => {
    const from = new Date().toISOString().slice(0, 10); const toDate = new Date(); toDate.setDate(toDate.getDate() + 60); const to = toDate.toISOString().slice(0, 10);
    const response = await fetch(`/api/availability?locationId=${encodeURIComponent(config.locationId)}&from=${from}&to=${to}`);
    const data = await response.json();
    return response.ok ? applyPartnerAvailabilityRules(partnerId, data) : { state: "ERROR", slots: [], message: data.message };
  }, [config.locationId, partnerId]);
  return <SmartBookingFlow location={config.location} cta={config.cta} showPhone={config.showPhone} showWhatsApp={config.showWhatsApp} loadAvailability={loadAvailability} submitBooking={async (date, time, contact: BookingContact) => {
    const response = await fetch("/api/partner-bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ partner: partnerId, source: config.source, date, time, ...contact }) });
    return response.json();
  }} />;
}
