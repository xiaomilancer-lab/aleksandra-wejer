"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import PsycholkaWidget from "../../panel/components/PsychOLKAWidget";

interface StepTimeProps {
  selectedLocation: string;
  selectedDate: string;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

export default function StepTime({ selectedLocation, selectedDate, selectedTime, setSelectedTime }: StepTimeProps) {
  const [state, setState] = useState<"loading" | "ready" | "empty" | "no-schedule" | "error">("loading");
  const [times, setTimes] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setHighlighted(false), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(() => setState("loading"));

    fetch(`/api/availability?locationId=${encodeURIComponent(selectedLocation)}&from=${selectedDate}&to=${selectedDate}`)
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!active) return;
        if (!response.ok || data.state === "ERROR") {
          setState("error");
          return;
        }

        if (data.state === "NO_SCHEDULE") {
          setTimes([]);
          setState("no-schedule");
          return;
        }

        const nextTimes = (data.slots ?? []).map((slot: { time: string }) => slot.time);
        setTimes(nextTimes);
        setState(nextTimes.length ? "ready" : "empty");
      })
      .catch(() => active && setState("error"));

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [selectedDate, selectedLocation]);

  return (
    <section
      id="step-time"
      className={`mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-500 sm:p-8 ${highlighted ? "ring-4 ring-[#DDEEDB] shadow-[0_0_32px_rgba(109,122,98,0.16)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2D4739]">Wybierz godzinę wizyty</h2>
          <p className="mt-2 text-gray-600">Kliknij godzinę, która najbardziej Ci odpowiada.</p>
        </div>
        <PsycholkaWidget context="welcome" action="point_booking" fallbackAction="greeting" className="booking-time-psycholka hidden w-20 shrink-0 sm:block" />
      </div>

      {state === "loading" && <p className="mt-6 text-sm text-gray-600">Sprawdzamy terminy…</p>}
      {state === "error" && <p role="alert" className="mt-6 rounded-xl bg-[#FFF9EE] p-4 text-sm text-[#7A6540]">Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️</p>}
      {state === "no-schedule" && <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#F8F5F0] p-5 text-[#55624D]"><span className="rounded-xl bg-white p-2 text-[#6D7A62]"><CalendarDays size={19} aria-hidden="true" /></span><div><p className="font-semibold text-[#2D4739]">Aktualnie nie ma dostępnych terminów.</p><p className="mt-1 text-sm">Wybierz inny dzień lub spróbuj ponownie później.</p></div></div>}
      {state === "empty" && <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#F8F5F0] p-5 text-[#55624D]"><span className="rounded-xl bg-white p-2 text-[#6D7A62]"><CalendarDays size={19} aria-hidden="true" /></span><div><p className="font-semibold text-[#2D4739]">Ten dzień jest już pełny.</p><p className="mt-1 text-sm">Wybierz inny dzień.</p></div></div>}
      {state === "ready" && <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{times.map((time) => <button type="button" key={time} onClick={() => setSelectedTime(time)} className={`rounded-xl border px-5 py-3 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.98] ${selectedTime === time ? "border-green-600 bg-green-600 text-white" : "border-gray-200 bg-white text-[#2D4739] hover:border-[#6D7A62] hover:bg-[#F8F5F0]"}`}>{time}</button>)}</div>}
    </section>
  );
}
