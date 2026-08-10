"use client";

import { useEffect, useMemo, useState } from "react";
import { weekDays } from "./constants/weekDays";
import CalendarDay from "./CalendarDay";
import { generateMonthDays, getFirstDayOfMonth } from "./monthHelpers";

interface CalendarGridProps {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  currentMonth: number;
  currentYear: number;
  locationId: string;
}

type AvailabilityState = "ready" | "error";
type AvailabilityResult = { requestKey: string; state: AvailabilityState; dates: Set<string> };

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarGrid({ selectedDate, setSelectedDate, currentMonth, currentYear, locationId }: CalendarGridProps) {
  const days = generateMonthDays(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const from = useMemo(() => toIsoDate(currentYear, currentMonth, 1), [currentMonth, currentYear]);
  const to = useMemo(() => toIsoDate(currentYear, currentMonth, days.length), [currentMonth, currentYear, days.length]);
  const requestKey = `${locationId}:${from}:${to}`;
  const availabilityState = availability?.requestKey === requestKey ? availability.state : "loading";
  const availableDates = availability?.requestKey === requestKey ? availability.dates : new Set<string>();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/availability?locationId=${encodeURIComponent(locationId)}&from=${from}&to=${to}`, { signal: controller.signal })
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (controller.signal.aborted) return;
        if (!response.ok || data.state === "ERROR") {
          setAvailability({ requestKey, state: "error", dates: new Set() });
          return;
        }

        setAvailability({ requestKey, state: "ready", dates: new Set((data.slots ?? []).map((slot: { date: string }) => slot.date)) });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAvailability({ requestKey, state: "error", dates: new Set() });
      });

    return () => controller.abort();
  }, [from, locationId, requestKey, to]);

  return <>
    <div className="grid grid-cols-7 gap-1.5 sm:gap-3">{weekDays.map((day) => <div key={day} className="rounded-xl bg-[#F8F5F0] py-2 text-center text-sm font-semibold text-[#2D4739] sm:py-3 sm:text-base">{day}</div>)}</div>
    <div className="mt-1.5 grid grid-cols-7 gap-1.5 sm:mt-3 sm:gap-3">
      {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
      {days.map((day) => {
        const date = toIsoDate(currentYear, currentMonth, day);
        const available = availabilityState === "ready" && availableDates.has(date);
        return <CalendarDay key={day} day={day} available={available} selected={selectedDate === date} onClick={() => available && setSelectedDate(date)} />;
      })}
    </div>
    {availabilityState === "loading" && <p className="mt-4 text-center text-sm text-gray-500">Sprawdzamy dostępne dni…</p>}
    {availabilityState === "error" && <p role="alert" className="mt-4 rounded-xl bg-[#FFF9EE] p-4 text-center text-sm text-[#7A6540]">Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️</p>}
  </>;
}
