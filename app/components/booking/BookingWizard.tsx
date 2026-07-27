"use client";

import { useEffect, useState } from "react";
import StepLocation from "./StepLocation";
import StepSummary from "./StepSummary";
import StepDate from "./StepDate";
import StepTime from "./StepTime";

export default function BookingWizard() {

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
const [selectedDay, setSelectedDay] =
  useState<number | null>(null);
useEffect(() => {
  if (!selectedDay) return;

  const timer = setTimeout(() => {
    document
      .getElementById("step-time")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 350);

  return () => clearTimeout(timer);
}, [selectedDay]);
  return (
    <section className="space-y-10">

      <StepLocation
  selectedLocation={selectedLocation}
  setSelectedLocation={setSelectedLocation}
/>
{selectedLocation && (
  <>
  <StepSummary
    locationName={
      selectedLocation === "zielinscy-premium"
        ? "Centrum Medyczno-Estetyczne Zielińscy Premium"
        : "Nowa lokalizacja"
    }
  />

  <StepDate
    selectedDay={selectedDay}
    setSelectedDay={setSelectedDay}
  />

  {selectedDay && <StepTime />}
</>
)}

    </section>
  );
}