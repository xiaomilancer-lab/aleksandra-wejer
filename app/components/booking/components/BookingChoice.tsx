"use client";

import { useState } from "react";

interface BookingChoiceProps {
  onCalendarClick: () => void;
  onContactClick: () => void;
}

export default function BookingChoice({
  onCalendarClick,
  onContactClick,
}: BookingChoiceProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-xl bg-[#6D7A62] px-6 py-3 font-semibold text-white transition hover:bg-[#5d6954]"
      >
        🌿 Umów wizytę
      </button>

      {isOpen && (
  <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
    <h2 className="text-2xl font-bold text-[#4B4338]">
      🌿 Jak chcesz umówić wizytę?
    </h2>

    <p className="mt-3 text-gray-600">
      Możesz samodzielnie wybrać dogodny termin lub napisać wiadomość.
      Wybierz opcję, która będzie dla Ciebie najwygodniejsza.
    </p>

    <div className="mt-8 space-y-4">

      <button
  onClick={() => {
    setIsOpen(false);
    onCalendarClick();
  }}
  className="w-full rounded-2xl bg-[#6D7A62] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#5d6954]"
>
  📅 Samodzielnie wybiorę termin
</button>

      <div className="text-center text-sm text-gray-400">
        lub
      </div>

      <button
  onClick={() => {
    setIsOpen(false);
    onContactClick();
  }}
  className="w-full rounded-2xl border border-[#6D7A62] px-6 py-4 text-lg font-semibold text-[#6D7A62] transition hover:bg-[#F8F5F0]"
>
  💬 Chcę napisać wiadomość
</button>

    </div>
  </div>
)}
    </div>
  );
}