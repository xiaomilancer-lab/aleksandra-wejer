"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";

type Destination = "/" | "/panel" | "/room";

export default function AccountHomeLink() {
  const [destination, setDestination] = useState<Destination>("/");

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/destination", { credentials: "same-origin", cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((result: { loggedIn?: boolean; destination?: string } | null) => {
        if (!active || !result?.loggedIn) return;
        if (result.destination === "/panel" || result.destination === "/room") setDestination(result.destination);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const label = destination === "/panel" ? "Wróć do pulpitu" : destination === "/room" ? "Wróć do pokoju" : "Strona główna";
  return <Link href={destination} className="inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl border border-[#D5DCCF] px-4 py-3 font-semibold"><Home size={18} aria-hidden="true" />{label}</Link>;
}
