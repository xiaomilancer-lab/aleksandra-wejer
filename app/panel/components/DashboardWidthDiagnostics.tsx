"use client";

import { useEffect } from "react";

type OverflowingElement = {
  tag: string;
  id: string | null;
  className: string;
  left: number;
  right: number;
  width: number;
};

export default function DashboardWidthDiagnostics() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debug-width") !== "1") return;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const root = document.documentElement;
        const body = document.body;
        const clientWidth = root.clientWidth;
        const overflowingElements = [...document.querySelectorAll<HTMLElement>("body *")]
          .map((element): OverflowingElement | null => {
            const rect = element.getBoundingClientRect();
            if (rect.left >= -1 && rect.right <= clientWidth + 1) return null;
            return {
              tag: element.tagName,
              id: element.id || null,
              className: typeof element.className === "string" ? element.className : "",
              left: round(rect.left),
              right: round(rect.right),
              width: round(rect.width),
            };
          })
          .filter((element): element is OverflowingElement => element !== null);
        const dimensions = {
          innerWidth: window.innerWidth,
          htmlClientWidth: clientWidth,
          htmlScrollWidth: root.scrollWidth,
          bodyScrollWidth: body.scrollWidth,
          scrollLeft: window.scrollX,
        };

        console.group("[Panel width diagnostics]");
        console.table(dimensions);
        console.table(overflowingElements);
        console.groupEnd();
        window.__panelWidthDiagnostics = { dimensions, overflowingElements };
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    const afterHydration = window.setTimeout(measure, 500);
    measure();

    return () => {
      window.clearTimeout(afterHydration);
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      delete window.__panelWidthDiagnostics;
    };
  }, []);

  return null;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

declare global {
  interface Window {
    __panelWidthDiagnostics?: {
      dimensions: {
        innerWidth: number;
        htmlClientWidth: number;
        htmlScrollWidth: number;
        bodyScrollWidth: number;
        scrollLeft: number;
      };
      overflowingElements: OverflowingElement[];
    };
  }
}
