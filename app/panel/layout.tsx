import type { ReactNode } from "react";

export default function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {children}
    </div>
  );
}