"use client";

import { useEffect, useState } from "react";
import { availableTimes } from "./data/availableTimes";

interface StepTimeProps {
  selectedDay: number;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}


export default function StepTime({
  selectedDay,
  selectedTime,
  setSelectedTime,
}: StepTimeProps) {

  
const [bookedTimes, setBookedTimes] = useState<string[]>([]);

useEffect(() => {
  async function loadBookedTimes() {
    const month = "08";
    const day = String(selectedDay).padStart(2, "0");

    const response = await fetch(
      `/api/booked-times?date=2026-${month}-${day}`
    );

    const data = await response.json();

    setBookedTimes(data);
  }

  loadBookedTimes();
}, [selectedDay]);

  return (
    <div
      id="step-time"
      className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-[#2D4739]">
        🕒 Wybierz godzinę wizyty
      </h2>

      <p className="mt-2 text-gray-600">
        Kliknij godzinę, która najbardziej Ci odpowiada.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {availableTimes.map((time) => {

  const booked = bookedTimes.includes(time);

  return (

    <button
      key={time}
      disabled={booked}
      onClick={() => setSelectedTime(time)}
      className={`rounded-xl border px-5 py-3 font-semibold transition

      ${
        booked
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : selectedTime === time
          ? "border-green-600 bg-green-600 text-white"
          : "border-gray-200 bg-white text-[#2D4739] hover:border-[#6D7A62] hover:bg-[#F8F5F0]"
      }`}
    >
      {booked ? `${time} 🔒` : time}
    </button>

  );
})}
      </div>
    </div>
  );
}