"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    let recoveryConfirmed = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    const timeout = window.setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setCanReset(Boolean(data.session) && recoveryConfirmed);
      setChecking(false);
    }, 800);

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event !== "PASSWORD_RECOVERY") return;
      recoveryConfirmed = true;
      setCanReset(Boolean(session));
      setChecking(false);
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Nowe hasło musi mieć co najmniej 8 znaków.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("Wpisane hasła nie są takie same.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage("Link wygasł albo nie udało się zmienić hasła. Poproś o nowy link.");
        return;
      }
      await fetch("/api/auth/session", { method: "DELETE", credentials: "same-origin", cache: "no-store" }).catch(() => undefined);
      await supabase.auth.signOut({ scope: "global" }).catch(() => undefined);
      router.replace("/login?passwordChanged=1");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-4">
      <section className="w-full max-w-md rounded-3xl border border-[#E5E1D8] bg-white p-7 shadow-xl sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1EB] text-[#6D7A62]"><KeyRound size={27} aria-hidden="true" /></span>
        <h1 className="mt-5 text-center text-3xl font-bold text-[#2D4739]">Ustaw nowe hasło</h1>

        {checking ? (
          <p className="mt-7 text-center text-gray-600">Sprawdzamy bezpieczny link…</p>
        ) : canReset ? (
          <form onSubmit={handleSubmit} className="mt-7">
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#CAD9C4] bg-[#F1F6EF] p-4 text-sm leading-6 text-[#2D4739]"><ShieldCheck className="mt-0.5 shrink-0" size={19} aria-hidden="true" /><span>Link jest prawidłowy. Nowe hasło powinno mieć co najmniej 8 znaków.</span></div>
            <label className="block text-sm font-semibold text-[#2D4739]">Nowe hasło
              <input name="password" type="password" minLength={8} autoComplete="new-password" required className="mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 text-base outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
            </label>
            <label className="mt-4 block text-sm font-semibold text-[#2D4739]">Powtórz nowe hasło
              <input name="confirmation" type="password" minLength={8} autoComplete="new-password" required className="mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 text-base outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
            </label>
            {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] px-4 py-3 text-sm text-[#6F5732]">{errorMessage}</p>}
            <button disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-2xl bg-[#6D7A62] px-5 py-3 font-bold text-white transition hover:bg-[#5A6752] disabled:bg-[#AAB5A4]">{isSubmitting ? "Zapisywanie…" : "Zapisz nowe hasło"}</button>
          </form>
        ) : (
          <div className="mt-7 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] p-5 text-[#6F5732]">
            <p className="font-bold">Link jest nieprawidłowy lub wygasł.</p>
            <p className="mt-2 text-sm leading-6">Poproś o nową wiadomość, aby bezpiecznie ustawić hasło.</p>
            <Link href="/forgot-password" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[#9B8054] px-4 py-2.5 font-bold">Wyślij nowy link</Link>
          </div>
        )}
      </section>
    </main>
  );
}
