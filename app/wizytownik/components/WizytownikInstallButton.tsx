"use client";

import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function WizytownikInstallButton() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [instructions, setInstructions] = useState(false);
  const [installed, setInstalled] = useState(false);
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const navigatorWithStandalone = hydrated ? navigator as Navigator & { standalone?: boolean } : null;
  const standalone = installed || (hydrated && (window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone?.standalone === true));

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (standalone) return null;
  async function install() {
    if (!prompt) { setInstructions(true); return; }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPrompt(null);
  }

  return <><button type="button" onClick={() => void install()} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#D6DDD3] bg-white px-4 py-2.5 text-sm font-bold text-[#2D4739]"><Download size={17} />Zainstaluj</button>{instructions && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#18271F]/60 p-4 backdrop-blur-sm"><section className="relative w-full max-w-md rounded-[28px] bg-white p-7 text-[#263E32] shadow-2xl"><button type="button" onClick={() => setInstructions(false)} className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6DDD3]" aria-label="Zamknij"><X size={18} /></button><Smartphone size={34} className="text-[#6D7A62]" /><h2 className="mt-4 text-2xl font-black">Wizytownik na telefonie</h2><p className="mt-3 leading-7 text-gray-600">Na iPhonie otwórz tę stronę w Safari, wybierz <strong>Udostępnij</strong>, a następnie <strong>Dodaj do ekranu początkowego</strong>. Na Androidzie wybierz w menu przeglądarki <strong>Zainstaluj aplikację</strong>.</p><button type="button" onClick={() => setInstructions(false)} className="mt-6 min-h-12 w-full rounded-2xl bg-[#2D4739] px-5 font-bold text-white">Rozumiem</button></section></div>}</>;
}
