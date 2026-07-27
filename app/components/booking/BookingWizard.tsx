"use client";

import { useState } from "react";
import StepLocation from "./StepLocation";
import StepSummary from "./StepSummary";

export default function BookingWizard() {

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <section className="space-y-10">

      <StepLocation
  selectedLocation={selectedLocation}
  setSelectedLocation={setSelectedLocation}
/>
{selectedLocation && (
  <StepSummary
    locationName={
      selectedLocation === "zielinscy-premium"
        ? "Centrum Medyczno-Estetyczne Zielińscy Premium"
        : "Nowa lokalizacja"
    }
  />
)}

    </section>
  );
}