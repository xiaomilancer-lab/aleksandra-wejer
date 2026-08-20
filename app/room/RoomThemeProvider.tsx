"use client";

import { Check, Palette, X } from "lucide-react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

type RoomTheme = "calm" | "forest" | "lavender" | "sky" | "peach";

const STORAGE_KEY = "psycholka-room-theme";
const themes: ReadonlyArray<{ id: RoomTheme; label: string; description: string; colors: [string, string, string] }> = [
  { id: "calm", label: "Spokojny beż", description: "Jasny i naturalny", colors: ["#F8F5F0", "#FFFFFF", "#6D7A62"] },
  { id: "forest", label: "Leśny", description: "Zieleń i miękkie światło", colors: ["#EFF4EE", "#FBFDF9", "#53705B"] },
  { id: "lavender", label: "Lawendowy", description: "Delikatny fiolet", colors: ["#F5F1F8", "#FFFFFF", "#776888"] },
  { id: "sky", label: "Błękitny", description: "Spokojny i świeży", colors: ["#EFF6F8", "#FFFFFF", "#557986"] },
  { id: "peach", label: "Brzoskwiniowy", description: "Ciepły i pogodny", colors: ["#FCF2EC", "#FFFDFC", "#A86F5A"] },
];

const validThemes = new Set<RoomTheme>(themes.map((theme) => theme.id));
const RoomThemeContext = createContext<{ theme: RoomTheme; chooseTheme: (theme: RoomTheme) => void } | null>(null);

export default function RoomThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<RoomTheme>("calm");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as RoomTheme | null;
    if (!saved || !validThemes.has(saved)) return;
    const timer = window.setTimeout(() => setTheme(saved), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo(() => ({
    theme,
    chooseTheme(nextTheme: RoomTheme) {
      setTheme(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    },
  }), [theme]);

  return (
    <RoomThemeContext.Provider value={value}>
      <div className="room-theme-shell" data-room-theme={theme}>{children}</div>
    </RoomThemeContext.Provider>
  );
}

export function RoomThemePicker() {
  const context = useContext(RoomThemeContext);
  const [open, setOpen] = useState(false);
  if (!context) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-4 py-2.5 text-sm font-semibold text-[#2D4739] shadow-sm transition hover:bg-[#F8F5F0]"
        aria-expanded={open}
      >
        <Palette size={17} aria-hidden="true" /> Wygląd pokoju
      </button>

      {open && (
        <div className="room-theme-picker-panel fixed inset-x-4 top-20 z-[140] mx-auto max-w-md rounded-3xl border border-[#D8DDD4] bg-white p-5 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-14 sm:w-[360px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Skórka tego urządzenia</p>
              <h2 className="text-xl font-bold">Wybierz swój klimat</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[#E5E1D8] p-2" aria-label="Zamknij wybór wyglądu"><X size={18} /></button>
          </div>
          <div className="mt-4 grid gap-2">
            {themes.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => { context.chooseTheme(item.id); setOpen(false); }}
                className={`flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left transition ${context.theme === item.id ? "border-[#6D7A62] bg-[#F5F7F3]" : "border-[#E5E1D8] hover:bg-[#FAF8F4]"}`}
              >
                <span className="flex shrink-0 overflow-hidden rounded-full border border-white shadow" aria-hidden="true">
                  {item.colors.map((color) => <span key={color} className="h-8 w-4" style={{ backgroundColor: color }} />)}
                </span>
                <span className="min-w-0 flex-1"><span className="block font-bold">{item.label}</span><span className="block text-xs text-gray-500">{item.description}</span></span>
                {context.theme === item.id && <Check size={18} className="shrink-0 text-[#53705B]" aria-label="Wybrana" />}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">Wybór zapisuje się tylko na tym telefonie lub komputerze. Nie zmienia danych konta.</p>
        </div>
      )}
    </div>
  );
}
