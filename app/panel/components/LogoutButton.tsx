"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/panel-session", { method: "DELETE", credentials: "same-origin" });
    await supabase.auth.signOut();

    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="min-h-11 w-full rounded-2xl bg-red-50 px-5 py-3 text-left font-semibold text-red-600 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
    >
      🚪 Wyloguj się
    </button>
  );
}
