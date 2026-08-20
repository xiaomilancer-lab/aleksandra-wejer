"use client";

import { Download, Share2, Smartphone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "psycholka-pwa-install-dismissed";
const DISMISS_FOR_MS = 3 * 24 * 60 * 60 * 1000;

function isRunningStandalone() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function PwaInstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isRunningStandalone()) return;

    const dismissedAt = Number(window.localStorage.getItem(DISMISSED_KEY) ?? 0);
    if (Date.now() - dismissedAt < DISMISS_FOR_MS) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };
    const handleInstalled = () => {
      setInstallEvent(null);
      setIsVisible(false);
      setShowInstructions(false);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    const timer = window.setTimeout(() => {
      setIsIOS(ios);
      if (ios) setIsVisible(true);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const isSupportedRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/room");

  if (!isVisible || !isSupportedRoute) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsVisible(false);
  };

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
    <aside
      className="fixed bottom-4 left-4 z-[160] w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-[#D6DED2] bg-white p-4 text-[#2D4739] shadow-[0_18px_50px_rgba(45,71,57,0.2)] sm:bottom-6 sm:left-6"
      aria-label="Instalacja aplikacji PsychOLKA"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#607066] hover:bg-[#EEF1EB]"
        aria-label="Przypomnij później"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex gap-3 pr-8">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1EB]">
          <Smartphone className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D7A62]">
            PsychOLKA w telefonie
          </p>
          <p className="mt-1 font-bold">Zainstaluj bezpłatną aplikację</p>
          <p className="mt-1 text-sm leading-5 text-[#58645D]">
            Szybszy dostęp do pokoju, wizyt i Babyroom — bez sklepu z aplikacjami.
          </p>
        </div>
      </div>

      {showInstructions ? (
        <div className="mt-3 rounded-2xl bg-[#F8F5F0] p-3 text-sm leading-5">
          {isIOS ? (
            <p className="flex gap-2">
              <Share2 className="mt-0.5 h-5 w-5 shrink-0" />
              W Safari wybierz „Udostępnij”, a następnie „Dodaj do ekranu początkowego”.
            </p>
          ) : (
            <p>Otwórz menu przeglądarki i wybierz „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”.</p>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void install()}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2D4739] px-4 py-3 font-semibold text-white transition hover:bg-[#243A30]"
      >
        <Download className="h-5 w-5" />
        {installEvent ? "Zainstaluj PsychOLKĘ" : "Jak zainstalować?"}
      </button>
    </aside>
  );
}
