"use client";

import { useState } from "react";

export default function BookingChoice() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
  onClick={() => setIsOpen((prev) => !prev)}
  className="
    flex
    items-center
    justify-between
    gap-4
    bg-[#6D7A62]
    hover:bg-[#56614C]
    transition
    text-white
    px-8
    py-4
    rounded-2xl
    shadow-xl
    text-lg
    font-semibold
    min-w-[320px]
  "
>
  <span>🌿 Umów wizytę</span>

  <span
    className={`transition-transform duration-300 ${
      isOpen ? "rotate-180" : ""
    }`}
  >
    ▼
  </span>
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

      <button className="w-full rounded-2xl bg-[#6D7A62] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#5d6954]">
        📅 Samodzielnie wybiorę termin
      </button>

      <div className="text-center text-sm text-gray-400">
        lub
      </div>

      <button className="w-full rounded-2xl border border-[#6D7A62] px-6 py-4 text-lg font-semibold text-[#6D7A62] transition hover:bg-[#F8F5F0]">
        💬 Chcę napisać wiadomość
      </button>

    </div>
  </div>
)}
    </div>
  );
}