"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputClass = "mt-2 min-h-12 w-full rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 text-base outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]";

type PasswordStatus = { kind: "idle" | "error" | "success"; message: string };

export default function AccountSecuritySettings({ email }: { email: string }) {
  const router = useRouter();
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus>({ kind: "idle", message: "" });

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwordPending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmation = String(data.get("newPasswordConfirmation") ?? "");

    if (newPassword.length < 8) {
      setPasswordStatus({ kind: "error", message: "Nowe hasło musi mieć co najmniej 8 znaków." });
      return;
    }
    if (newPassword !== confirmation) {
      setPasswordStatus({ kind: "error", message: "Wpisane nowe hasła nie są takie same." });
      return;
    }

    setPasswordPending(true);
    setPasswordStatus({ kind: "idle", message: "" });
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) {
        setPasswordStatus({ kind: "error", message: "Aktualne hasło jest nieprawidłowe." });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setPasswordStatus({ kind: "error", message: "Nie udało się zmienić hasła. Spróbuj ponownie za chwilę." });
        return;
      }

      await fetch("/api/auth/session", { method: "DELETE", credentials: "same-origin", cache: "no-store" }).catch(() => undefined);
      await supabase.auth.signOut({ scope: "global" }).catch(() => undefined);
      router.replace("/login?passwordChanged=1");
      router.refresh();
    } finally {
      setPasswordPending(false);
    }
  }

  return (
    <section id="security" className="mt-6 rounded-3xl border border-[#E5E1D8] bg-white p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><ShieldCheck size={23} aria-hidden="true" /></span>
        <div>
          <h2 className="text-xl font-bold text-[#2D4739]">Zabezpieczenia konta</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">Tutaj możesz bezpiecznie zmienić hasło do panelu. Po 10 minutach bezczynności panel wyloguje Cię automatycznie.</p>
        </div>
      </div>

      <div className="mt-6 max-w-xl">
        <form onSubmit={changePassword} className="rounded-3xl border border-[#E5E1D8] bg-[#FAF8F3] p-5">
          <div className="flex items-center gap-2 text-[#2D4739]"><KeyRound size={20} aria-hidden="true" /><h3 className="font-bold">Zmień hasło do panelu</h3></div>
          <p className="mt-2 text-sm leading-6 text-gray-600">Po zmianie hasła wylogujemy konto ze wszystkich urządzeń. Zalogujesz się ponownie nowym hasłem.</p>
          <label className="mt-4 block text-sm font-semibold text-[#2D4739]">Aktualne hasło<input name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} /></label>
          <label className="mt-4 block text-sm font-semibold text-[#2D4739]">Nowe hasło (min. 8 znaków)<input name="newPassword" type="password" minLength={8} autoComplete="new-password" required className={inputClass} /></label>
          <label className="mt-4 block text-sm font-semibold text-[#2D4739]">Powtórz nowe hasło<input name="newPasswordConfirmation" type="password" minLength={8} autoComplete="new-password" required className={inputClass} /></label>
          {passwordStatus.message && <p role={passwordStatus.kind === "error" ? "alert" : "status"} className="mt-4 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] px-4 py-3 text-sm text-[#6F5732]">{passwordStatus.message}</p>}
          <button disabled={passwordPending} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2D4739] px-5 py-3 font-bold text-white transition hover:bg-[#21372B] disabled:bg-[#AAB5A4]">
            <KeyRound size={18} aria-hidden="true" />{passwordPending ? "Zmienianie…" : "Zmień hasło"}
          </button>
        </form>
      </div>
    </section>
  );
}
