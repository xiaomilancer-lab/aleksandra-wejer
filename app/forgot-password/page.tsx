"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-4">
      <section className="w-full max-w-md rounded-3xl border border-[#E5E1D8] bg-white p-7 shadow-xl sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1EB] text-[#6D7A62]"><Mail size={27} aria-hidden="true" /></span>
        <h1 className="mt-5 text-center text-3xl font-bold text-[#2D4739]">Odzyskaj hasło</h1>
        <p className="mt-3 text-center leading-7 text-gray-600">Podaj adres użyty przy rejestracji. Wyślemy bezpieczny link do ustawienia nowego hasła.</p>

        {sent ? (
          <div className="mt-7">
            <div className="rounded-2xl border border-[#CAD9C4] bg-[#F1F6EF] p-5 text-[#2D4739]">
              <div className="flex items-center gap-2 font-bold"><ShieldCheck size={20} aria-hidden="true" />Sprawdź skrzynkę pocztową</div>
              <p className="mt-2 text-sm leading-6">Jeśli konto z tym adresem istnieje, wiadomość z linkiem została wysłana. Sprawdź również folder SPAM.</p>
            </div>
            <Link href="/login" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#6D7A62] px-5 py-3 font-bold text-[#2D4739] transition hover:bg-[#EEF1EB]">Wróć do logowania</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-sm font-semibold text-[#2D4739]">Adres e-mail
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 text-base outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
            </label>
            <button disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-2xl bg-[#6D7A62] px-5 py-3 font-bold text-white transition hover:bg-[#5A6752] disabled:bg-[#AAB5A4]">{isSubmitting ? "Wysyłanie…" : "Wyślij link do zmiany hasła"}</button>
            <Link href="/login" className="mt-4 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[#526A5B] underline underline-offset-4">Wróć do logowania</Link>
          </form>
        )}
      </section>
    </main>
  );
}
