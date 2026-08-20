import type { ReactNode } from "react";
import RoomPresence from "./RoomPresence";
import RoomThemeProvider from "./RoomThemeProvider";

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <RoomThemeProvider>
      <RoomPresence />
      {children}
    </RoomThemeProvider>
  );
}
