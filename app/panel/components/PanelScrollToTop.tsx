"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

export default function PanelScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const resetScroll = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    resetScroll();
    const animationFrame = window.requestAnimationFrame(resetScroll);
    const timeout = window.setTimeout(resetScroll, 50);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
