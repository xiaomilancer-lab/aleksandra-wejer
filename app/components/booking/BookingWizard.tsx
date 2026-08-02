"use client";

import { useEffect, useState } from "react";
import StepLocation from "./StepLocation";
import StepSummary from "./StepSummary";
import StepDate from "./StepDate";
import StepTime from "./StepTime";
import { locations } from "./location";
import StepForm from "./StepForm";
import ZnanyLekarzWidget from "./ZnanyLekarzWidget";

export default function BookingWizard() {

  const [selectedLocation, setSelectedLocation] =
  useState<string | null>(null);

const [selectedDay, setSelectedDay] =
  useState<number | null>(null);

const [selectedTime, setSelectedTime] =
  useState<string | null>(null);

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

useEffect(() => {
  if (selectedLocation !== "arthrocure") return;

  const timer = setTimeout(() => {
    document
      .getElementById("znanylekarz-widget")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 300);

  return () => clearTimeout(timer);
}, [selectedLocation]);

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
    locations.find((l) => l.id === selectedLocation)?.name ?? ""
  }
/>

  {selectedLocation === "arthrocure" ? (
  <ZnanyLekarzWidget />
) : (
  <>
    <StepDate
      selectedLocation={selectedLocation}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
    />

    {selectedDay && (
     <StepTime
  selectedDay={selectedDay}
  selectedTime={selectedTime}
  setSelectedTime={setSelectedTime}
/>
    )}

    {selectedTime && (
      <StepForm
        selectedLocation={
          locations.find((l) => l.id === selectedLocation)?.name ?? ""
        }
        selectedDay={selectedDay!}
        selectedTime={selectedTime}
      />
    )}
  </>
)}
</>
)}

    </section>
  );
}