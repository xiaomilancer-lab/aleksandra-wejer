"use client";

import { useState } from "react";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";

export default function StepDate() {
  const [selectedDay, setSelectedDay] =
    useState<number | null>(null);
  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-[#2D4739]">
        📅 Wybierz termin wizyty
      </h2>

      <p className="mt-2 text-gray-600">
  Kliknij wybrany dzień, aby zobaczyć dostępne godziny wizyt.
</p>

      <div className="mt-8">
        <CalendarHeader
          month="Lipiec"
          year={2026}
        />

        <CalendarGrid
  selectedDay={selectedDay}
  setSelectedDay={setSelectedDay}
/>
      </div>
    </div>
  );
}