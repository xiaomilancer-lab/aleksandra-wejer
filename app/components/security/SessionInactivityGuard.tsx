"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clock3, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const INACTIVITY_MS = 10 * 60 * 1000;
const WARNING_MS = 2 * 60 * 1000;
const REFRESH_MS = 5 * 60 * 1000;
const STORAGE_KEY = "psycholka:last-activity";

export default function SessionInactivityGuard() {
  const [remainingMs, setRemainingMs] = useState(INACTIVITY_MS);
  const [warningVisible, setWarningVisible] = useState(false);
  const lastActivityRef = useRef(0);
  const lastRecordedRef = useRef(0);
  const lastRefreshRef = useRef(0);
  const loggingOutRef = useRef(false);

  const refreshServerSession = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshRef.current < REFRESH_MS) return;
    lastRefreshRef.current = now;
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ accessToken: data.session.access_token }),
    }).catch(() => undefined);
  }, []);

  const logout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    await fetch("/api/auth/session", { method: "DELETE", credentials: "same-origin", cache: "no-store" }).catch(() => undefined);
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.replace("/login?reason=inactivity");
  }, []);

  const recordActivity = useCallback((force = false) => {
    const now = Date.now();
    if (!force && now - lastRecordedRef.current < 1_000) return;
    lastRecordedRef.current = now;
    lastActivityRef.current = now;
    setWarningVisible(false);
    setRemainingMs(INACTIVITY_MS);
    window.localStorage.setItem(STORAGE_KEY, String(now));
    void refreshServerSession();
  }, [refreshServerSession]);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(STORAGE_KEY));
    const now = Date.now();
    const initial = Number.isFinite(stored) && stored > now - INACTIVITY_MS ? stored : now;
    lastActivityRef.current = initial;
    window.localStorage.setItem(STORAGE_KEY, String(initial));
    void refreshServerSession();

    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll", "focus"];
    const onActivity = () => recordActivity();
    activityEvents.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      const value = Number(event.newValue);
      if (Number.isFinite(value) && value > lastActivityRef.current) {
        lastActivityRef.current = value;
        setWarningVisible(false);
      }
    };
    window.addEventListener("storage", onStorage);

    const timer = window.setInterval(() => {
      const remaining = INACTIVITY_MS - (Date.now() - lastActivityRef.current);
      setRemainingMs(Math.max(0, remaining));
      if (remaining <= 0) void logout();
      else setWarningVisible(remaining <= WARNING_MS);
    }, 1_000);

    return () => {
      activityEvents.forEach((event) => window.removeEventListener(event, onActivity));
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, [logout, recordActivity, refreshServerSession]);

  if (!warningVisible) return null;
  const seconds = Math.max(0, Math.ceil(remainingMs / 1_000));
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#18261F]/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="session-warning-title">
      <section className="w-full max-w-md rounded-[28px] border border-[#D5DCCF] bg-white p-6 text-[#2D4739] shadow-2xl sm:p-8">
        <span className="inline-flex rounded-2xl bg-[#FFF4D9] p-3 text-[#9B6A08]"><Clock3 size={25} aria-hidden="true" /></span>
        <h2 id="session-warning-title" className="mt-5 text-2xl font-bold">Sesja wkrótce wygaśnie</h2>
        <p className="mt-3 leading-7 text-gray-600">Dla ochrony danych wylogujemy Cię po 10 minutach bezczynności.</p>
        <p className="mt-4 rounded-2xl bg-[#F8F5F0] p-4 text-center text-2xl font-bold tabular-nums">{minutes}:{rest}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => recordActivity(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#6D7A62] px-4 py-3 font-bold text-white"><ShieldCheck size={18} /> Pozostań</button>
          <button type="button" onClick={() => void logout()} className="min-h-12 rounded-2xl border border-[#D5DCCF] px-4 py-3 font-bold">Wyloguj teraz</button>
        </div>
      </section>
    </div>
  );
}
