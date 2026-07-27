"use client";

import { useState } from "react";
import StepLocation from "./StepLocation";

export default function BookingWizard() {

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <section className="space-y-10">

      <StepLocation
  selectedLocation={selectedLocation}
  setSelectedLocation={setSelectedLocation}
/>

    </section>
  );
}