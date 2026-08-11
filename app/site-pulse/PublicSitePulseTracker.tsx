"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pageKeyFromPathname, type SitePulseSectionKey } from "./domain";
import { sendSitePulseHeartbeat, setSitePulseActiveSection, trackSitePulseEvent } from "./client";

const HEARTBEAT_INTERVAL_MS = 75_000;
const selectors: Array<{ selector: string; section: SitePulseSectionKey }> = [
  { selector: "[data-pulse-section='hero'], #start", section: "hero" },
  { selector: "[data-pulse-section='about'], #omnie, #mobile-aleksandra", section: "about" },
  { selector: "[data-pulse-section='services'], #oferta, #mobile-pomoc", section: "services" },
  { selector: "[data-pulse-section='booking'], #kalendarz, #rezerwacja", section: "booking" },
  { selector: "[data-pulse-section='contact'], #kontakt", section: "contact" },
];

export default function PublicSitePulseTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pageKeyFromPathname(pathname)) return;
    void trackSitePulseEvent("page_view");
    void sendSitePulseHeartbeat();
    const timer = window.setInterval(() => { void sendSitePulseHeartbeat(); }, HEARTBEAT_INTERVAL_MS);
    const onVisibility = () => { if (document.visibilityState === "visible") void sendSitePulseHeartbeat(); };
    document.addEventListener("visibilitychange", onVisibility);

    const observed = new Set<Element>();
    const dwellTimers = new Map<Element, number>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const currentTimer = dwellTimers.get(entry.target);
        if (entry.intersectionRatio < 0.5) {
          if (currentTimer) window.clearTimeout(currentTimer);
          dwellTimers.delete(entry.target);
          continue;
        }
        const section = entry.target.getAttribute("data-site-pulse-key") as SitePulseSectionKey;
        setSitePulseActiveSection(section);
        if (currentTimer) continue;
        dwellTimers.set(entry.target, window.setTimeout(() => {
          void trackSitePulseEvent("section_view", section);
          if (section === "booking") void trackSitePulseEvent("booking_opened", section);
          dwellTimers.delete(entry.target);
        }, 1000));
      }
    }, { threshold: 0.5 });

    for (const { selector, section } of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (observed.has(element)) continue;
        observed.add(element);
        element.setAttribute("data-site-pulse-key", section);
        observer.observe(element);
      }
    }

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const timer of dwellTimers.values()) window.clearTimeout(timer);
      observer.disconnect();
      setSitePulseActiveSection(null);
    };
  }, [pathname]);

  return null;
}
