"use client";

import { useEffect, useState } from "react";
import StepLocation from "./StepLocation";
import StepSummary from "./StepSummary";
import StepDate from "./StepDate";
import StepTime from "./StepTime";
import { locations } from "./location";
import StepForm from "./StepForm";

export default function BookingWizard() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null); const [selectedDate, setSelectedDate] = useState<string | null>(null); const [selectedTime, setSelectedTime] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedDate) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("step-time")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedDate]);
  const location = locations.find((item) => item.id === selectedLocation);
  return <section className="space-y-10"><StepLocation selectedLocation={selectedLocation} setSelectedLocation={(value) => { setSelectedLocation(value); setSelectedDate(null); setSelectedTime(null); }} />{selectedLocation && location && <><StepSummary locationName={location.name} /><StepDate selectedDate={selectedDate} setSelectedDate={(value) => { setSelectedDate(value); setSelectedTime(null); }} />{selectedDate && <StepTime key={selectedDate} selectedLocation={selectedLocation} selectedDate={selectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />}{selectedTime && <StepForm selectedLocation={location.name} locationId={selectedLocation} selectedDate={selectedDate!} selectedTime={selectedTime} />}</>}</section>;
}
