"use client";

import { useEffect, useState } from "react";

type Dimensions = {
  visualViewportWidth: number | null;
  visualViewportHeight: number | null;
  visualViewportScale: number | null;
  visualViewportOffsetLeft: number | null;
  visualViewportOffsetTop: number | null;
  innerWidth: number;
  documentElementClientWidth: number;
  documentElementScrollWidth: number;
  bodyClientWidth: number;
  bodyScrollWidth: number;
  scrollX: number;
};

type MeasuredElement = {
  tag: string;
  selector: string;
  left: number;
  right: number;
  width: number;
  clientWidth: number;
  scrollWidth: number;
  position: string;
};

type Measurement = {
  phase: string;
  measuredAt: string;
  dimensions: Dimensions;
  widestElement: MeasuredElement | null;
  overflowingElements: MeasuredElement[];
};

const OVERLAY_ATTRIBUTE = "data-dashboard-width-diagnostics";

export default function DashboardWidthDiagnostics() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const enabled =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug-width") === "1";

  useEffect(() => {
    if (!enabled) return;

    let initialFrame = 0;
    let liveFrame = 0;
    let hydrationFrame = 0;

    const capture = (phase: string, replaceEvent = false) => {
      const measurement = measurePage(phase);
      setMeasurements((current) => {
        if (replaceEvent && current.at(-1)?.phase.startsWith("event:")) {
          return [...current.slice(0, -1), measurement];
        }
        return [...current, measurement];
      });
      window.__panelWidthDiagnostics = measurement;
    };

    const scheduleEventCapture = (phase: string) => {
      window.cancelAnimationFrame(liveFrame);
      liveFrame = window.requestAnimationFrame(() => capture(`event: ${phase}`, true));
    };

    const onRootResize = () => scheduleEventCapture("ResizeObserver");
    const onWindowResize = () => scheduleEventCapture("window.resize");
    const onOrientationChange = () => scheduleEventCapture("window.orientationchange");
    const onWindowScroll = () => scheduleEventCapture("window.scroll");
    const onVisualViewportResize = () => scheduleEventCapture("visualViewport.resize");
    const onVisualViewportScroll = () => scheduleEventCapture("visualViewport.scroll");

    capture("effect / hydration");
    initialFrame = window.requestAnimationFrame(() => capture("requestAnimationFrame"));
    const afterHydration = window.setTimeout(() => {
      hydrationFrame = window.requestAnimationFrame(() => capture("750ms after hydration"));
    }, 750);

    const observer = new ResizeObserver(onRootResize);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", onVisualViewportResize);
    window.visualViewport?.addEventListener("scroll", onVisualViewportScroll);

    return () => {
      window.clearTimeout(afterHydration);
      window.cancelAnimationFrame(initialFrame);
      window.cancelAnimationFrame(liveFrame);
      window.cancelAnimationFrame(hydrationFrame);
      observer.disconnect();
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("scroll", onWindowScroll);
      window.visualViewport?.removeEventListener("resize", onVisualViewportResize);
      window.visualViewport?.removeEventListener("scroll", onVisualViewportScroll);
      delete window.__panelWidthDiagnostics;
    };
  }, [enabled]);

  if (!enabled) return null;

  const latest = measurements.at(-1);

  return (
    <aside
      {...{ [OVERLAY_ATTRIBUTE]: "true" }}
      aria-label="Dashboard width diagnostics"
      style={{
        position: "fixed",
        zIndex: 2147483647,
        inset: "0 0 auto 0",
        maxHeight: "78dvh",
        overflow: "auto",
        overscrollBehavior: "contain",
        background: "rgba(15, 23, 42, 0.96)",
        color: "#f8fafc",
        padding: "calc(env(safe-area-inset-top) + 8px) 8px 10px",
        font: "11px/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <section style={{ border: "1px solid #fb7185", padding: 6, marginBottom: 8 }}>
        <strong style={{ color: "#fda4af" }}>WIDEST / FARTHEST ELEMENT</strong>
        <ElementDetails element={latest?.widestElement ?? null} />
      </section>

      {measurements.map((measurement, index) => (
        <section key={`${measurement.phase}-${measurement.measuredAt}-${index}`} style={{ marginBottom: 10 }}>
          <strong style={{ color: "#7dd3fc" }}>
            {measurement.phase} · {measurement.measuredAt}
          </strong>
          <DimensionsDetails dimensions={measurement.dimensions} />
          <div style={{ marginTop: 5, color: "#fde68a" }}>
            SUSPECTS ({measurement.overflowingElements.length}; position: fixed excluded)
          </div>
          {measurement.overflowingElements.length === 0 ? (
            <div>none</div>
          ) : (
            measurement.overflowingElements.map((element, elementIndex) => (
              <ElementDetails key={`${element.selector}-${elementIndex}`} element={element} numbered={elementIndex + 1} />
            ))
          )}
        </section>
      ))}
    </aside>
  );
}

function measurePage(phase: string): Measurement {
  const root = document.documentElement;
  const body = document.body;
  const visualViewport = window.visualViewport;
  const elements = [root, body, ...document.querySelectorAll<HTMLElement>("body *")].filter(
    (element) => !element.closest(`[${OVERLAY_ATTRIBUTE}]`),
  );
  const measured = elements.map(measureElement);
  const widestElement = measured.reduce<MeasuredElement | null>(
    (widest, element) => (widest === null || element.right > widest.right ? element : widest),
    null,
  );
  const overflowingElements = measured.filter(
    (element) => element.position !== "fixed" && (element.left < 0 || element.right > window.innerWidth),
  );

  return {
    phase,
    measuredAt: new Date().toLocaleTimeString("pl-PL", { fractionalSecondDigits: 3 }),
    dimensions: {
      visualViewportWidth: nullableRound(visualViewport?.width),
      visualViewportHeight: nullableRound(visualViewport?.height),
      visualViewportScale: nullableRound(visualViewport?.scale),
      visualViewportOffsetLeft: nullableRound(visualViewport?.offsetLeft),
      visualViewportOffsetTop: nullableRound(visualViewport?.offsetTop),
      innerWidth: window.innerWidth,
      documentElementClientWidth: root.clientWidth,
      documentElementScrollWidth: root.scrollWidth,
      bodyClientWidth: body.clientWidth,
      bodyScrollWidth: body.scrollWidth,
      scrollX: round(window.scrollX),
    },
    widestElement,
    overflowingElements,
  };
}

function measureElement(element: HTMLElement): MeasuredElement {
  const rect = element.getBoundingClientRect();
  return {
    tag: element.tagName.toLowerCase(),
    selector: describeElement(element),
    left: round(rect.left),
    right: round(rect.right),
    width: round(rect.width),
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    position: window.getComputedStyle(element).position,
  };
}

function describeElement(element: HTMLElement) {
  const id = element.id ? `#${element.id}` : "";
  const classes = typeof element.className === "string" ? element.className.trim().split(/\s+/).filter(Boolean) : [];
  const classSuffix = classes.length > 0 ? `.${classes.slice(0, 3).join(".")}${classes.length > 3 ? "…" : ""}` : "";
  return `${element.tagName.toLowerCase()}${id}${classSuffix}`.slice(0, 100);
}

function DimensionsDetails({ dimensions }: { dimensions: Dimensions }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 10px", marginTop: 4 }}>
      <span>visualViewport.width: {formatNullable(dimensions.visualViewportWidth)}</span>
      <span>visualViewport.height: {formatNullable(dimensions.visualViewportHeight)}</span>
      <span>visualViewport.scale: {formatNullable(dimensions.visualViewportScale)}</span>
      <span>visualViewport.offsetLeft: {formatNullable(dimensions.visualViewportOffsetLeft)}</span>
      <span>visualViewport.offsetTop: {formatNullable(dimensions.visualViewportOffsetTop)}</span>
      <span>innerWidth: {dimensions.innerWidth}</span>
      <span>documentElement.clientWidth: {dimensions.documentElementClientWidth}</span>
      <span>documentElement.scrollWidth: {dimensions.documentElementScrollWidth}</span>
      <span>body.clientWidth: {dimensions.bodyClientWidth}</span>
      <span>body.scrollWidth: {dimensions.bodyScrollWidth}</span>
      <span>scrollX: {dimensions.scrollX}</span>
    </div>
  );
}

function ElementDetails({ element, numbered }: { element: MeasuredElement | null; numbered?: number }) {
  if (!element) return <div>not measured yet</div>;
  return (
    <div style={{ borderTop: "1px solid rgba(148, 163, 184, 0.25)", paddingTop: 3, marginTop: 3, overflowWrap: "anywhere" }}>
      {numbered ? `${numbered}. ` : ""}
      <span style={{ color: "#c4b5fd" }}>{element.selector}</span>
      {` | left ${element.left} | right ${element.right} | width ${element.width} | clientWidth ${element.clientWidth} | scrollWidth ${element.scrollWidth} | position ${element.position}`}
    </div>
  );
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function nullableRound(value: number | undefined) {
  return value === undefined ? null : round(value);
}

function formatNullable(value: number | null) {
  return value === null ? "unsupported" : value;
}

declare global {
  interface Window {
    __panelWidthDiagnostics?: Measurement;
  }
}
