import type { ReactNode } from "react";
import RoomPresence from "./RoomPresence";
import RoomThemeProvider from "./RoomThemeProvider";
import SessionInactivityGuard from "@/app/components/security/SessionInactivityGuard";

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <RoomThemeProvider>
      <SessionInactivityGuard />
      <RoomPresence />
      {children}
    </RoomThemeProvider>
  );
}
