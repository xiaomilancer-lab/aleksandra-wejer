"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function establishAppSession(accessToken: string) {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ accessToken }),
    });
    const body = await response.json().catch(() => null) as { destination?: string; message?: string } | null;
    return {
      ok: response.ok,
      destination: body?.destination ?? null,
      message: body?.message ?? "Nie udało się bezpiecznie rozpocząć sesji.",
    };
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let notice = "";
    if (params.get("passwordChanged") === "1") {
      notice = "Hasło zostało zmienione. Możesz zalogować się nowym hasłem.";
    } else if (params.get("reason") === "inactivity") {
      notice = "Dla bezpieczeństwa wylogowaliśmy Cię po 10 minutach bezczynności.";
    }
    const noticeTimer = window.setTimeout(() => setStatusMessage(notice), 0);

    async function restorePanelSession() {
      const { data } = await supabase.auth.getSession();
      const appSession = data.session ? await establishAppSession(data.session.access_token) : null;
      if (appSession?.ok && appSession.destination) {
        router.replace(appSession.destination);
      }
    }
    void restorePanelSession();
    return () => window.clearTimeout(noticeTimer);
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Nieprawidłowy e-mail lub hasło.");
        return;
      }

      const appSession = data.session ? await establishAppSession(data.session.access_token) : null;
      if (!appSession?.ok || !appSession.destination) {
        setErrorMessage(appSession?.message ?? "Nie udało się bezpiecznie rozpocząć sesji.");
        return;
      }

      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement && activeElement !== document.body) {
        activeElement.blur();
      }
      router.push(appSession.destination);
    } catch {
      setErrorMessage("Nie udało się połączyć z panelem. Spróbuj ponownie za chwilę.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"
      >
        <h1 className="text-center text-4xl font-bold text-[#2D4739]">
          🌿
        </h1>

        <h2 className="mt-4 text-center text-3xl font-bold text-[#2D4739]">
          Centrum PsychOLKI
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Zaloguj się do swojego miejsca.
        </p>

        <label className="mt-8 block text-sm font-semibold text-[#2D4739]">
          Adres e-mail
          <input
            type="email"
            placeholder="np. aleksandra@…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white p-4 text-base text-[#23332F] placeholder:text-slate-500 outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-[#2D4739]">
          Hasło
          <input
            type="password"
            placeholder="Wpisz hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white p-4 text-base text-[#23332F] placeholder:text-slate-500 outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]"
          />
        </label>

        <div className="mt-3 text-right">
          <Link href="/forgot-password" className="text-sm font-semibold text-[#526A5B] underline decoration-[#AAB5A4] underline-offset-4 transition hover:text-[#2D4739]">
            Nie pamiętam hasła
          </Link>
        </div>

        {statusMessage && <p role="status" className="mt-5 rounded-2xl border border-[#CAD9C4] bg-[#F1F6EF] px-4 py-3 text-sm font-semibold text-[#2D4739]">{statusMessage}</p>}
        {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] px-4 py-3 text-sm text-[#6F5732]">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 min-h-12 w-full rounded-2xl bg-[#6D7A62] p-4 font-semibold text-white transition hover:bg-[#5A6752] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8] disabled:cursor-not-allowed disabled:bg-[#AAB5A4]"
        >
          {isSubmitting ? "Logowanie…" : "🌿 Zaloguj się"}
        </button>

        <div className="mt-6 border-t border-[#E5E1D8] pt-6 text-center">
          <p className="text-sm text-gray-600">Nie masz jeszcze konta?</p>
          <Link
            href="/register"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#6D7A62] px-5 py-2.5 text-sm font-semibold text-[#2D4739] transition hover:bg-[#EEF1EB]"
          >
            ✨ Zarejestruj się
          </Link>
        </div>
      </form>
    </div>
  );
}
