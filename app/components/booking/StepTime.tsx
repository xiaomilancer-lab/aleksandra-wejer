"use client";

import { useState } from "react";
import { availableTimes } from "./data/availableTimes";

export default function StepTime() {
  const [selectedTime, setSelectedTime] =
    useState<string | null>(null);

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

        {availableTimes.map((time) => (

          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`rounded-xl border px-5 py-3 font-semibold transition ${
              selectedTime === time
                ? "border-green-600 bg-green-600 text-white"
                : "border-gray-200 bg-white text-[#2D4739] hover:border-[#6D7A62] hover:bg-[#F8F5F0]"
            }`}
          >
            {time}
          </button>

        ))}

      </div>

    </div>
  );
}