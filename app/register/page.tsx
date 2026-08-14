"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MemberRole } from "@/app/room/types";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<MemberRole>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const initialiseRole = window.setTimeout(() => {
      const requestedRole = new URLSearchParams(window.location.search).get("role");
      if (requestedRole === "patient" || requestedRole === "parent") setRole(requestedRole);
    }, 0);
    return () => window.clearTimeout(initialiseRole);
  }, []);

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Hasło powinno mieć co najmniej 8 znaków.");
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage("Wpisane hasła nie są takie same.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            requested_role: role,
            display_name: displayName.trim(),
          },
          emailRedirectTo: "https://aleksandrawejer.pl/login?confirmed=1",
        },
      });

      if (error) {
        setErrorMessage("Nie udało się utworzyć konta. Sprawdź dane i spróbuj ponownie.");
        return;
      }

      if (data.session) await supabase.auth.signOut();
      setIsComplete(true);
    } catch {
      setErrorMessage("Rejestracja jest chwilowo niedostępna. Spróbuj ponownie za moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isComplete) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8F5F0] p-5">
        <section className="w-full max-w-md rounded-3xl border border-[#E5E1D8] bg-white p-8 text-center shadow-xl">
          <p className="text-4xl" aria-hidden="true">🌸</p>
          <h1 className="mt-4 text-3xl font-bold text-[#2D4739]">Konto prawie gotowe</h1>
          <p className="mt-4 leading-relaxed text-gray-600">
            Sprawdź skrzynkę e-mail i potwierdź adres. Po pierwszym logowaniu zobaczysz swój prywatny pokój PsychOLKI.
          </p>
          <p className="mt-4 rounded-2xl bg-[#F8F5F0] p-4 text-sm text-gray-600">
            Dostęp do istniejących wizyt pojawi się dopiero po bezpiecznym połączeniu konta przez gabinet.
          </p>
          <Link href="/login" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#6D7A62] px-5 py-3 font-semibold text-white">
            Przejdź do logowania
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0] p-5">
      <form onSubmit={handleRegister} className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        <p className="text-center text-4xl" aria-hidden="true">🌸</p>
        <h1 className="mt-3 text-center text-3xl font-bold text-[#2D4739]">Załóż swoje konto</h1>
        <p className="mt-2 text-center text-gray-600">Wybierz miejsce, które najlepiej do Ciebie pasuje.</p>

        <fieldset className="mt-7">
          <legend className="text-sm font-semibold text-[#2D4739]">Rodzaj konta</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <RoleCard
              checked={role === "patient"}
              title="Jestem pacjentem"
              description="Moje terminy i materiały"
              onChange={() => setRole("patient")}
            />
            <RoleCard
              checked={role === "parent"}
              title="Jestem rodzicem"
              description="Pokój rodzica i dziecka"
              onChange={() => setRole("parent")}
            />
          </div>
        </fieldset>

        <Field label="Imię i nazwisko" value={displayName} onChange={setDisplayName} autoComplete="name" required />
        <Field label="Adres e-mail" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field label="Hasło" type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={8} required />
        <p className="mt-2 text-xs text-gray-500">Minimum 8 znaków.</p>
        <Field label="Powtórz hasło" type="password" value={passwordConfirmation} onChange={setPasswordConfirmation} autoComplete="new-password" minLength={8} required />

        <p className="mt-4 rounded-2xl bg-[#F8F5F0] p-4 text-xs leading-relaxed text-gray-600">
          Rola psychologa nie jest dostępna podczas rejestracji i może zostać nadana wyłącznie ręcznie przez administratora gabinetu.
          Jeśli jesteś jednocześnie pacjentem i rodzicem, wystarczy jedno konto — dodatkowy dostęp połączy bezpiecznie gabinet.
        </p>

        {errorMessage && <p role="alert" className="mt-4 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] px-4 py-3 text-sm text-[#6F5732]">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-2xl bg-[#6D7A62] px-5 py-3 font-semibold text-white transition hover:bg-[#5A6752] disabled:cursor-not-allowed disabled:bg-[#AAB5A4]">
          {isSubmitting ? "Tworzenie konta…" : "✨ Zarejestruj się"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Masz już konto? <Link href="/login" className="font-semibold text-[#2D4739] underline underline-offset-4">Zaloguj się</Link>
        </p>
      </form>
    </main>
  );
}

function RoleCard({ checked, title, description, onChange }: { checked: boolean; title: string; description: string; onChange: () => void }) {
  return (
    <label className={`cursor-pointer rounded-2xl border p-4 transition ${checked ? "border-[#6D7A62] bg-[#EEF1EB]" : "border-[#E5E1D8] bg-white hover:bg-[#F8F5F0]"}`}>
      <input type="radio" name="role" checked={checked} onChange={onChange} className="sr-only" />
      <span className="block font-semibold text-[#2D4739]">{title}</span>
      <span className="mt-1 block text-sm text-gray-600">{description}</span>
    </label>
  );
}

function Field({ label, type = "text", value, onChange, autoComplete, minLength, required }: { label: string; type?: string; value: string; onChange: (value: string) => void; autoComplete: string; minLength?: number; required?: boolean }) {
  return (
    <label className="mt-4 block text-sm font-semibold text-[#2D4739]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        className="mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white p-4 text-base text-[#23332F] outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]"
      />
    </label>
  );
}
