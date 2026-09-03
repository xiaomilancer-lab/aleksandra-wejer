"use client";

import { Download, Share2, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandalone() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

export default function PanelPwaInstallCard() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const initialStateTimer = window.setTimeout(() => {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
      setIsVisible(true);
    }, 0);

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setIsVisible(false);

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.clearTimeout(initialStateTimer);
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!isVisible) return null;

  const install = async () => {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setIsVisible(false);
    setInstallEvent(null);
  };

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#C9D7C4] bg-gradient-to-br from-white to-[#EEF3EB] p-5 shadow-[0_12px_35px_rgba(45,71,57,0.08)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2D4739] text-white"><Smartphone size={23} aria-hidden="true" /></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D7A62]">Prywatna aplikacja Aleksandry</p>
            <h2 className="mt-1 text-xl font-bold text-[#2D4739]">Dodaj panel do ekranu telefonu</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">Osobna ikona będzie otwierać bezpośrednio panel. Gdy sesja wygaśnie, aplikacja bezpiecznie poprosi o zalogowanie.</p>
          </div>
        </div>
        <button type="button" onClick={() => void install()} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#2D4739] px-5 py-3 font-semibold text-white transition hover:bg-[#243A30]">
          <Download size={19} aria-hidden="true" />{installEvent ? "Zainstaluj panel" : "Jak zainstalować?"}
        </button>
      </div>

      {showInstructions && (
        <div className="mt-5 rounded-2xl border border-[#D8E2D4] bg-white p-4 text-sm leading-6 text-[#4D5D53]">
          {isIOS ? (
            <p className="flex items-start gap-3"><Share2 className="mt-0.5 shrink-0 text-[#6D7A62]" size={20} aria-hidden="true" /><span>Otwórz ten panel w Safari, wybierz <strong>Udostępnij</strong>, a następnie <strong>Dodaj do ekranu początkowego</strong>. Nazwa ikony: „PsychOLKA Panel”.</span></p>
          ) : (
            <p className="flex items-start gap-3"><Download className="mt-0.5 shrink-0 text-[#6D7A62]" size={20} aria-hidden="true" /><span>Otwórz menu przeglądarki i wybierz <strong>Zainstaluj aplikację</strong> albo <strong>Dodaj do ekranu głównego</strong>.</span></p>
          )}
          <p className="mt-3 flex items-start gap-3 text-xs text-gray-500"><ShieldCheck className="mt-0.5 shrink-0" size={17} aria-hidden="true" />Panel pozostaje chroniony kontem psychologa. Sama ikona nie omija logowania.</p>
        </div>
      )}
    </section>
  );
}
