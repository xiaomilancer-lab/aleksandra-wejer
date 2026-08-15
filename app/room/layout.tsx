import type { ReactNode } from "react";
import RoomPresence from "./RoomPresence";

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RoomPresence />
      {children}
    </>
  );
}
