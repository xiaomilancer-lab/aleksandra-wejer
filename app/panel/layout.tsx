import type { Metadata } from "next";
import type { ReactNode } from "react";
import PanelSessionBridge from "./components/PanelSessionBridge";
import { requirePsychologist } from "./server/requirePsychologist";
import SessionInactivityGuard from "@/app/components/security/SessionInactivityGuard";

export const metadata: Metadata = {
  title: "PsychOLKA Panel — Aleksandra Wejer",
  applicationName: "PsychOLKA Panel",
  manifest: "/panel.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PsychOLKA Panel",
  },
};

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePsychologist();

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full bg-[#F8F5F0]">
      <PanelSessionBridge />
      <SessionInactivityGuard />
      {children}
    </div>
  );
}
