"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HEARTBEAT_MS = 45_000;

export default function RoomPresence() {
  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();

    const sendHeartbeat = () => {
      if (document.hidden) return;
      void fetch("/api/member/presence", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        signal: controller.signal,
      }).catch(() => undefined);
    };

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", sendHeartbeat);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", sendHeartbeat);
    };
  }, [pathname]);

  return null;
}
