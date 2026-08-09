"use client";

import { CalendarDays, MessageCircle, Phone, RotateCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import PsycholkaWidget from "../../panel/components/PsychOLKAWidget";

export type BookingContact = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type AvailabilityResponse = {
  state: "AVAILABLE" | "NO_SLOTS" | "NO_SCHEDULE" | "ERROR";
  slots: Array<{ date: string; time: string }>;
  message?: string;
};

export type BookingGuideState = "greeting" | "booking" | "waiting" | "success";

type Props = {
  location: string;
  cta: string;
  showPhone: boolean;
  showWhatsApp: boolean;
  loadAvailability: () => Promise<AvailabilityResponse>;
  submitBooking: (date: string, time: string, contact: BookingContact) => Promise<{ success: boolean; message: string }>;
  skipIntro?: boolean;
  renderGuide?: (state: BookingGuideState) => ReactNode;
};

const availabilityErrorMessage = "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️";

export default function SmartBookingFlow({
  location,
  cta,
  showPhone,
  showWhatsApp,
  loadAvailability,
  submitBooking,
  skipIntro = false,
  renderGuide,
}: Props) {
  const [step, setStep] = useState(skipIntro ? 1 : 0);
  const [kind, setKind] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [contact, setContact] = useState<BookingContact>({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step !== 2) return;

    let active = true;

    loadAvailability()
      .then((result) => {
        if (active) setAvailability(result);
      })
      .catch(() => {
        if (active) setAvailability({ state: "ERROR", slots: [], message: availabilityErrorMessage });
      });

    return () => {
      active = false;
    };
  }, [loadAvailability, reloadToken, step]);

  useEffect(() => {
    if (step < 2) return;

    const frame = window.requestAnimationFrame(() => {
      stepContentRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "nearest",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [availability, step]);

  const slotsByDate = useMemo(
    () =>
      (availability?.slots ?? []).reduce<Record<string, string[]>>((groups, slot) => {
        (groups[slot.date] ??= []).push(slot.time);
        return groups;
      }, {}),
    [availability],
  );

  const guideState: BookingGuideState = step === 4 ? "success" : step === 1 ? "greeting" : step === 2 && !availability ? "waiting" : step >= 2 ? "booking" : "greeting";
  const defaultAction = guideState === "greeting" ? "greeting" : guideState === "success" ? "celebrate" : "search";
  const guide = renderGuide?.(guideState) ?? <PsycholkaWidget context="welcome" action={defaultAction} fallbackAction="greeting" className="shrink-0" />;

  async function send() {
    if (!date || !time || contact.name.trim().length < 3 || contact.phone.replace(/\D/g, "").length < 9 || isSubmitting) return;

    setIsSubmitting(true);
    setStatus("Zapisywanie…");

    try {
      const result = await submitBooking(date, time, contact);
      setStatus(result.message);
      if (result.success) setStep(4);
    } catch {
      setStatus("Coś nam uciekło. Spróbujmy jeszcze raz. ❤️");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goBack() {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  }

  return (
    <section className="w-full max-w-2xl rounded-3xl border border-[#D5DCCF] bg-white p-5 shadow-sm sm:p-7" aria-live="polite">
      <header className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#6D7A62]">Rezerwacja · {location}</p>
          <h1 className="mt-1 text-2xl font-bold text-[#2D4739]">{step === 4 ? "Dziękuję ❤️" : "Znajdźmy dogodny termin"}</h1>
        </div>
        {guide}
      </header>

      {step > 1 && step < 4 && (
        <button
          type="button"
          onClick={goBack}
          className="mt-5 inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[#55624D] transition hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          ← Wstecz
        </button>
      )}

      <div ref={stepContentRef}>
        {step === 0 && (
          <div className="mt-7">
            <p className="whitespace-pre-line text-gray-600">{"Cześć ❤️\nPomogę Ci znaleźć dogodny termin."}</p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 min-h-12 rounded-xl bg-[#6D7A62] px-5 py-3 font-semibold text-white transition hover:bg-[#58644F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Zaczynamy
            </button>
          </div>
        )}

        {step === 1 && (
          <Choices
            title="Cześć! 👋 Pomogę Ci znaleźć dogodny termin u Aleksandry."
            choices={["Pierwsza konsultacja", "Kolejna konsultacja"]}
            value={kind}
            onSelect={(value) => {
              setKind(value);
              setAvailability(null);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <div className="mt-7">
            <h2 className="font-bold text-[#2D4739]">
              <CalendarDays className="mr-2 inline" size={18} />
              Najbliższe dostępne terminy
            </h2>

            {!availability && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F8F5F0] p-4 text-sm text-[#55624D]">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#6D7A62]" aria-hidden="true" />
                Już sprawdzam wolne terminy…
              </div>
            )}

            {availability?.state === "ERROR" && (
              <div role="alert" className="mt-5 rounded-2xl bg-[#FFF9EE] p-4 text-sm text-[#7A6540]">
                <p>{availability.message ?? availabilityErrorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setAvailability(null);
                    setReloadToken((token) => token + 1);
                  }}
                  className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 font-semibold text-[#55624D] transition hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2"
                >
                  <RotateCw size={15} aria-hidden="true" />
                  Spróbuj ponownie
                </button>
              </div>
            )}

            {availability?.state === "NO_SCHEDULE" && (
              <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-4 text-sm leading-relaxed text-[#55624D]">Terminy nie są jeszcze dostępne. Wróć proszę później lub skontaktuj się z nami telefonicznie.</p>
            )}

            {availability?.state === "NO_SLOTS" && (
              <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-4 text-sm leading-relaxed text-[#55624D]">W najbliższym czasie nie ma już wolnych terminów. Wróć proszę później lub skontaktuj się z nami telefonicznie.</p>
            )}

            {availability?.state === "AVAILABLE" && (
              <div className="mt-5 space-y-4">
                {Object.entries(slotsByDate).map(([slotDate, times]) => (
                  <section key={slotDate} className="rounded-2xl bg-[#F8F5F0] p-4">
                    <h3 className="font-semibold capitalize text-[#2D4739]">
                      {new Date(`${slotDate}T12:00:00`).toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {times.map((slotTime) => (
                        <button
                          type="button"
                          key={slotTime}
                          onClick={() => {
                            setDate(slotDate);
                            setTime(slotTime);
                            setStep(3);
                          }}
                          className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.98] ${date === slotDate && time === slotTime ? "border-[#6D7A62] bg-[#6D7A62] text-white" : "border-[#E5E1D8] bg-white text-[#2D4739] hover:border-[#6D7A62]"}`}
                        >
                          {slotTime}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <input value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} placeholder="Imię i nazwisko *" autoComplete="name" className="min-h-12 rounded-xl border border-[#E5E1D8] px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-2 focus:ring-[#EEF1EB]" />
            <input value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} placeholder="Telefon *" autoComplete="tel" inputMode="tel" className="min-h-12 rounded-xl border border-[#E5E1D8] px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-2 focus:ring-[#EEF1EB]" />
            <input value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} placeholder="E-mail" autoComplete="email" inputMode="email" className="min-h-12 rounded-xl border border-[#E5E1D8] px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-2 focus:ring-[#EEF1EB] sm:col-span-2" />
            <textarea value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} placeholder="Wiadomość (opcjonalnie)" rows={3} className="rounded-xl border border-[#E5E1D8] px-4 py-3 outline-none focus:border-[#6D7A62] focus:ring-2 focus:ring-[#EEF1EB] sm:col-span-2" />
            <button type="button" onClick={send} disabled={isSubmitting} className="min-h-12 rounded-xl bg-[#6D7A62] px-5 py-3 font-semibold text-white transition hover:bg-[#58644F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 sm:col-span-2">
              {isSubmitting ? "Zapisywanie…" : cta}
            </button>
            {status && <p aria-live="polite" className="text-sm text-[#55624D] sm:col-span-2">{status}</p>}
          </div>
        )}

        {step === 4 && (
          <div className="mt-6">
            <p className="text-gray-600">Gotowe! 🎉 Termin został zarezerwowany.</p>
            <p className="mt-2 text-sm text-[#55624D]">{new Date(`${date}T12:00:00`).toLocaleDateString("pl-PL")} · {time} · {location}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {showPhone && <a href="tel:+48510777469" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-[#2D4739] transition hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2"><Phone size={16} />Telefon</a>}
              {showWhatsApp && <a href="https://wa.me/48510777469" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-[#2D4739] transition hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2"><MessageCircle size={16} />WhatsApp</a>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Choices({ title, choices, value, onSelect }: { title: string; choices: string[]; value: string; onSelect: (value: string) => void }) {
  return (
    <div className="mt-7">
      <h2 className="max-w-xl text-lg font-bold leading-snug text-[#2D4739]">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {choices.map((choice) => (
          <button
            type="button"
            key={choice}
            onClick={() => onSelect(choice)}
            className={`min-h-16 rounded-xl border px-4 py-4 text-left font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.98] ${value === choice ? "border-[#6D7A62] bg-[#EEF1EB]" : "border-[#E5E1D8] hover:bg-[#F8F5F0]"}`}
          >
            ○ {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
