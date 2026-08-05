"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-auto w-full rounded-2xl bg-red-50 px-5 py-3 text-left font-semibold text-red-600 transition hover:bg-red-100"
    >
      🚪 Wyloguj się
    </button>
  );
}