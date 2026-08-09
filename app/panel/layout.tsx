import type { ReactNode } from "react";
import PanelSessionBridge from "./components/PanelSessionBridge";
import { requirePsychologist } from "./server/requirePsychologist";

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePsychologist();

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <PanelSessionBridge />
      {children}
    </div>
  );
}
