"use client";

type BookingChoiceProps = {
  onCalendarClick?: () => void;
};

export default function BookingChoice({ onCalendarClick }: BookingChoiceProps) {
  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => (onCalendarClick ?? (() => document.getElementById("booking-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" })))()}
        className="group hidden w-full items-center justify-center gap-3 rounded-2xl bg-[#E63946] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#E63946]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#cc2f3c] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] focus-visible:ring-offset-2 md:flex"
      >
        <span aria-hidden="true">📅</span>
        Umów wizytę
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button>

      <p className="mt-3 hidden text-center text-sm text-stone-600 md:block">
        Wybierz dogodny termin w kalendarzu.
      </p>

      <div className="rounded-2xl border border-stone-200 bg-white/75 p-4 text-left md:mt-5">
        <p className="text-center text-sm font-medium text-stone-600">Wolisz inną formę kontaktu?</p>
        <div className="mt-2 grid gap-1">
          <a
            href="https://www.znanylekarz.pl/aleksandra-wejer/psycholog/starogard-gdanski"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#2F6B5F] transition hover:bg-[#F3F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F]"
          >
            Umów przez ZnanyLekarz →
          </a>
          <a
            href="https://wa.me/48512729997"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#2F6B5F] transition hover:bg-[#F3F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F]"
          >
            Napisz wiadomość →
          </a>
        </div>
      </div>
    </div>
  );
}
