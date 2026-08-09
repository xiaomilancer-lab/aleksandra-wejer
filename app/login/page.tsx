"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function establishPanelSession(accessToken: string) {
    const response = await fetch("/api/auth/panel-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });
    return response.ok;
  }

  useEffect(() => {
    async function restorePanelSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session && await establishPanelSession(data.session.access_token)) {
        router.replace("/panel");
      }
    }
    void restorePanelSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Nieprawidłowy e-mail lub hasło.");
      return;
    }

    if (!data.session || !(await establishPanelSession(data.session.access_token))) {
      alert("Nie udało się bezpiecznie rozpocząć sesji panelu.");
      return;
    }

    router.push("/panel");
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
          Centrum Gabinetu
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Zaloguj się do panelu.
        </p>

        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-8 w-full rounded-2xl border p-4"
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-2xl border p-4"
        />

        <button
          type="submit"
          className="mt-8 w-full rounded-2xl bg-[#6D7A62] p-4 font-semibold text-white transition hover:bg-[#5A6752]"
        >
          🌿 Zaloguj się
        </button>
      </form>
    </div>
  );
}
