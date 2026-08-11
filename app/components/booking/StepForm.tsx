"use client";

import { useEffect, useRef, useState } from "react";
import type { BookingSource } from "@/app/booking/bookingContext";
import { trackSitePulseEvent } from "@/app/site-pulse/client";

interface StepFormProps {
  selectedLocation: string;
  locationId: string;
  selectedDate: string;
  selectedTime: string;
  source: BookingSource;
}

export default function StepForm({ selectedLocation, locationId, selectedDate, selectedTime, source }: StepFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState(false);
  const successRef = useRef<HTMLElement>(null);
  const isFormValid = name.trim().length > 2 && phone.replace(/\D/g, "").length >= 9;
  const displayDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!completed || !window.matchMedia("(max-width: 767px)").matches) return;

    const frame = window.requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [completed]);

  async function handleBooking() {
    if (!isFormValid || loading) return;

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, date: selectedDate, time: selectedTime, name, phone, email, message, source }),
      });
      const data = await response.json();
      const nextStatus = data.message ?? (data.success ? "Gotowe. ❤️ Aleksandra otrzymała Twoją rezerwację." : "Nie udało się zapisać rezerwacji.");

      if (response.ok && data.success) {
        setCompleted(true);
        setStatus(nextStatus);
        void trackSitePulseEvent("booking_completed", "booking");
        return;
      }

      setStatus(nextStatus);
    } catch {
      setStatus("Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️");
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <section ref={successRef} id="step-form" className="mt-12 scroll-mt-6 rounded-3xl border border-[#D5DCCF] bg-white p-8 shadow-xl" aria-live="polite">
        <h2 className="text-2xl font-bold text-[#2D4739]">Dziękujemy ❤️</h2>
        <p className="mt-2 text-gray-600">{status}</p>
        <p className="mt-4 text-sm text-[#55624D]">{displayDate} · {selectedTime} · {selectedLocation}</p>
      </section>
    );
  }

  return (
    <section id="step-form" className="mt-12 rounded-3xl border border-[#EFE8DD] bg-white p-5 shadow-xl sm:p-8">
      <h2 className="text-2xl font-bold text-[#4B4338]">Dane do kontaktu</h2>
      <p className="mt-2 text-gray-600">Wypełnij formularz, a Aleksandra skontaktuje się z Tobą w celu potwierdzenia terminu.</p>
      <div className="mt-6 rounded-2xl border border-[#E8E1D5] bg-[#F8F5F0] p-5">
        <h3 className="mb-3 text-lg font-semibold text-[#4B4338]">Wybrany termin konsultacji</h3>
        <div className="space-y-2 text-[#4B4338]">
          <p><span className="font-semibold">Lokalizacja:</span> {selectedLocation}</p>
          <p><span className="font-semibold">Termin:</span> {displayDate}</p>
          <p><span className="font-semibold">Godzina:</span> {selectedTime}</p>
        </div>
      </div>
      <div className="mt-8 space-y-5">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Imię i nazwisko *" aria-label="Imię i nazwisko" autoComplete="name" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#23332F] placeholder:text-slate-500 outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefon *" aria-label="Telefon" autoComplete="tel" inputMode="tel" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#23332F] placeholder:text-slate-500 outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" aria-label="E-mail" autoComplete="email" inputMode="email" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 py-3 text-[#23332F] placeholder:text-slate-500 outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
        <textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Krótka wiadomość (opcjonalnie)" aria-label="Krótka wiadomość" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#23332F] placeholder:text-slate-500 outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
        <button type="button" onClick={handleBooking} disabled={loading || !isFormValid} className="w-full rounded-xl bg-[#6D7A62] py-4 text-lg font-semibold text-white transition hover:bg-[#58644F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400">
          {loading ? "Wysyłanie…" : "Umów wizytę"}
        </button>
        {status && <p aria-live="polite" className="text-sm text-[#55624D]">{status}</p>}
        <p className="text-sm text-gray-500">* Pola oznaczone gwiazdką są obowiązkowe.</p>
      </div>
    </section>
  );
}
