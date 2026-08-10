"use client";

import { useEffect, useState } from "react";
import StepLocation from "./StepLocation";
import StepSummary from "./StepSummary";
import StepDate from "./StepDate";
import StepTime from "./StepTime";
import { locations } from "./location";
import StepForm from "./StepForm";
import type { BookingSource } from "@/app/booking/bookingContext";

interface BookingWizardProps {
  source?: BookingSource;
  fixedLocationId?: string;
}

export default function BookingWizard({ source = "main-site", fixedLocationId }: BookingWizardProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(fixedLocationId ?? null); const [selectedDate, setSelectedDate] = useState<string | null>(null); const [selectedTime, setSelectedTime] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedDate) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("step-time")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedDate]);
  useEffect(() => {
    if (!selectedTime) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("step-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedTime]);
  const location = locations.find((item) => item.id === selectedLocation);
  return <section id="booking-wizard" className="space-y-10">{!fixedLocationId && <StepLocation selectedLocation={selectedLocation} setSelectedLocation={(value) => { setSelectedLocation(value); setSelectedDate(null); setSelectedTime(null); }} />}{selectedLocation && location && <>{!fixedLocationId && <StepSummary locationName={location.name} />}<StepDate locationId={selectedLocation} selectedDate={selectedDate} setSelectedDate={(value) => { setSelectedDate(value); setSelectedTime(null); }} />{selectedDate && <StepTime key={selectedDate} selectedLocation={selectedLocation} selectedDate={selectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />}{selectedTime && <StepForm selectedLocation={location.name} locationId={selectedLocation} selectedDate={selectedDate!} selectedTime={selectedTime} source={source} />}</>}</section>;
}
