"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RoomLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return <button type="button" onClick={logout} className="min-h-11 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-semibold text-[#2D4739]">Wyloguj się</button>;
}
