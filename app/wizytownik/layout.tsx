import type { Metadata } from "next";
import type { ReactNode } from "react";
import SessionInactivityGuard from "@/app/components/security/SessionInactivityGuard";
import PanelSessionBridge from "@/app/panel/components/PanelSessionBridge";
import { requirePsychologist } from "@/app/panel/server/requirePsychologist";

export const metadata: Metadata = {
  title: "Wizytownik psychOLKI — prywatne notatki",
  description: "Prywatne, szyfrowane narzędzie do notatek ze spotkań Aleksandry Wejer.",
  applicationName: "Wizytownik psychOLKI",
  manifest: "/wizytownik.webmanifest",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Wizytownik" },
};

export default async function WizytownikLayout({ children }: { children: ReactNode }) {
  await requirePsychologist("/wizytownik");
  return <div className="min-h-screen"><PanelSessionBridge /><SessionInactivityGuard />{children}</div>;
}
