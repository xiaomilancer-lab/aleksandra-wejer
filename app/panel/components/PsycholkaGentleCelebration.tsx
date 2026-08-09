"use client";

import { useEffect, useState } from "react";

export default function PsycholkaGentleCelebration({ eventKey, enabled }: { eventKey: string; enabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const storageKey = `psycholka-celebration-${eventKey}`;
    if (window.localStorage.getItem(storageKey) === "true") return;

    const showCelebration = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, "true");
      setVisible(true);
    }, 250);
    const hideCelebration = window.setTimeout(() => setVisible(false), 2400);

    return () => {
      window.clearTimeout(showCelebration);
      window.clearTimeout(hideCelebration);
    };
  }, [enabled, eventKey]);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center gap-5 overflow-hidden">
      <span className="psycholka-confetti psycholka-confetti-delay-1">♥</span>
      <span className="psycholka-confetti psycholka-confetti-delay-2">•</span>
      <span className="psycholka-confetti psycholka-confetti-delay-3">♥</span>
      <span className="psycholka-confetti psycholka-confetti-delay-4">•</span>
      <span className="psycholka-confetti psycholka-confetti-delay-5">♥</span>
    </div>
  );
}
