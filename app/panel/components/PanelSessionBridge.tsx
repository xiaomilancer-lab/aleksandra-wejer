"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

async function syncPanelSession(accessToken: string) {
  await fetch("/api/auth/panel-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ accessToken }),
  });
}

/** Keeps the HttpOnly server session aligned when Supabase refreshes a browser token. */
export default function PanelSessionBridge() {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        void syncPanelSession(session.access_token);
      }
      if (event === "SIGNED_OUT") {
        void fetch("/api/auth/panel-session", { method: "DELETE", credentials: "same-origin" });
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
}
