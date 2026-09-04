"use client";

import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function WizytownikLogoutButton() {
  async function logout() {
    await fetch("/api/auth/session", { method: "DELETE", credentials: "same-origin", cache: "no-store" }).catch(() => undefined);
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    window.location.replace("/login?next=/wizytownik");
  }

  return <button type="button" onClick={() => void logout()} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#D6DDD3] bg-white px-4 py-2.5 text-sm font-bold text-[#2D4739] transition hover:bg-[#F2F5F0]"><LogOut size={17} aria-hidden="true" />Wyloguj</button>;
}
