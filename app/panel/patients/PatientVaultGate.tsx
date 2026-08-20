"use client";

import { useActionState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { setupPatientVaultAction, unlockPatientVaultAction, type VaultActionState } from "./vaultActions";

const initialState: VaultActionState = { error: "" };
const inputClass = "mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 text-base tracking-wider outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]";

export default function PatientVaultGate({ configured, lockedUntil, returnTo = "/panel/patients" }: { configured: boolean; lockedUntil: string | null; returnTo?: string }) {
  const action = configured ? unlockPatientVaultAction : setupPatientVaultAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const lockedLabel = lockedUntil ? new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }).format(new Date(lockedUntil)) : null;

  return (
    <section className="mx-auto max-w-xl rounded-[30px] border border-[#D5DCCF] bg-white p-6 shadow-[0_16px_45px_rgba(45,71,57,0.08)] sm:p-9">
      <span className="inline-flex rounded-2xl bg-[#EEF1EB] p-4 text-[#6D7A62]"><LockKeyhole size={28} aria-hidden="true" /></span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#6D7A62]">Dodatkowa ochrona danych</p>
      <h1 className="mt-2 text-3xl font-bold text-[#2D4739]">{configured ? "Odblokuj karty pacjentów" : "Ustaw PIN do kart pacjentów"}</h1>
      <p className="mt-3 leading-7 text-gray-600">
        {configured
          ? "Karty pacjentów są zamknięte niezależnie od logowania do panelu. Dostęp wygaśnie automatycznie po 10 minutach."
          : "Przy pierwszym uruchomieniu wybierz osobny PIN. Dla bezpieczeństwa potwierdź zmianę aktualnym hasłem do konta gabinetu."}
      </p>
      {lockedLabel ? (
        <p role="alert" className="mt-6 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] p-4 font-semibold text-[#6F5732]">Po kilku błędnych próbach sejf jest zablokowany do {lockedLabel}.</p>
      ) : (
        <form action={formAction} className="mt-7">
          <input type="hidden" name="returnTo" value={returnTo} />
          <label className="block text-sm font-semibold text-[#2D4739]">PIN (6–10 cyfr)<input name="pin" type="password" inputMode="numeric" pattern="[0-9]{6,10}" autoComplete="off" required className={inputClass} /></label>
          {!configured && <>
            <label className="mt-4 block text-sm font-semibold text-[#2D4739]">Powtórz PIN<input name="pinConfirmation" type="password" inputMode="numeric" pattern="[0-9]{6,10}" autoComplete="off" required className={inputClass} /></label>
            <label className="mt-4 block text-sm font-semibold text-[#2D4739]">Hasło do konta gabinetu<input name="password" type="password" autoComplete="current-password" required className={inputClass} /></label>
          </>}
          {state.error && <p role="alert" className="mt-4 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] px-4 py-3 text-sm text-[#6F5732]">{state.error}</p>}
          <button disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#6D7A62] px-5 py-3 font-bold text-white transition hover:bg-[#5A6752] disabled:bg-[#AAB5A4]">
            <ShieldCheck size={19} aria-hidden="true" /> {pending ? "Sprawdzanie…" : configured ? "Odblokuj sejf" : "Ustaw PIN i otwórz"}
          </button>
        </form>
      )}
      <p className="mt-5 text-xs leading-5 text-gray-500">PIN nie jest zapisywany w czytelnej postaci. Po pięciu błędnych próbach dostęp jest czasowo blokowany.</p>
    </section>
  );
}
