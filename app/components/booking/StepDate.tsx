"use client";

import type { Dispatch, SetStateAction } from "react";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";
import { useState } from "react";

interface StepDateProps {
  selectedLocation: string;
  selectedDay: number | null;
  setSelectedDay: Dispatch<SetStateAction<number | null>>;
}
export default function StepDate({
  selectedLocation,
  selectedDay,
  setSelectedDay,
}: StepDateProps) {

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const nextMonth = () => {
  if (currentMonth === 11) {
    setCurrentMonth(0);
    setCurrentYear((year) => year + 1);
  } else {
    setCurrentMonth((month) => month + 1);
  }
};

const previousMonth = () => {
  const isCurrentMonth =
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  if (isCurrentMonth) return;

  if (currentMonth === 0) {
    setCurrentMonth(11);
    setCurrentYear((year) => year - 1);
  } else {
    setCurrentMonth((month) => month - 1);
  }
};

const canGoPrevious =
  currentMonth !== today.getMonth() ||
  currentYear !== today.getFullYear();

  return (
    <div
      id="step-date"
      className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[#2D4739]">
        📅 Wybierz termin wizyty
      </h2>

      <p className="mt-2 text-gray-600">
        Kliknij wybrany dzień, aby zobaczyć dostępne godziny wizyt.
      </p>

      <div className="mt-8">
        <CalendarHeader
  month={currentMonth}
  year={currentYear}
  onPrevious={previousMonth}
  onNext={nextMonth}
  canGoPrevious={canGoPrevious}
/>

        <CalendarGrid
  selectedLocation={selectedLocation}
  selectedDay={selectedDay}
  setSelectedDay={setSelectedDay}
  currentMonth={currentMonth}
  currentYear={currentYear}
/>
      </div>
    </div>
  );
}