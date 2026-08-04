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
    <div>
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
        <span>🌿 Kliknij by umówić wizytę</span>

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
            🌿 Kliknij poniżej, aby umówić się na wizytę
          </h2>

          <p className="mt-3 text-gray-600">
            Wybierz sposób kontaktu. Możesz samodzielnie wybrać termin wizyty
            lub wysłać wiadomość.
          </p>

          <div className="mt-8 space-y-4">

            <button
              onClick={() => {
                setIsOpen(false);
                onCalendarClick();
              }}
              className="w-full rounded-2xl bg-[#6D7A62] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#5d6954]"
            >
              📅 Wybierz termin wizyty

              <span className="mt-1 block text-sm font-normal text-green-100">
                🌿 Polecana forma rezerwacji • dostępna dla obu lokalizacji gabinetu
              </span>
            </button>

            <a
              href="https://www.znanylekarz.pl/aleksandra-wejer/psycholog/starogard-gdanski"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl border border-[#2E7D32] bg-white px-6 py-4 text-center text-lg font-semibold text-[#2E7D32] transition hover:bg-[#F4FBF4]"
            >
              🩺 Umów przez ZnanyLekarz

              <span className="mt-1 block text-sm font-normal text-[#5E8F65]">
                📍 Rezerwacja dostępna wyłącznie dla Arthro Cure Clinic
              </span>
            </a>

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
              💬 Wyślij wiadomość
            </button>

          </div>
        </div>
      )}
    </div>
  );
}