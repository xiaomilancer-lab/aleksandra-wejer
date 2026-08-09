"use client";

import { useEffect, useRef, useState } from "react";
import { pickPsycholkaMessage, psycholkaDeskClickMessages } from "../psycholka/psycholkaEmotion";
import { recordPsycholkaWelcomeClick } from "../psycholka/psycholkaMemory";
import { getRareMomentDelay, getRareMomentDuration, pickRareMoment, type PsycholkaRareMoment } from "../psycholka/psycholkaSecretLife";
import type { PsycholkaMood } from "../psycholka/psycholkaTypes";
import PsycholkaWidget from "./PsychOLKAWidget";

type DeskBehavior = "rest" | "look" | "blink" | "smile" | "coffee" | "wave";
const activeBehaviors: DeskBehavior[] = ["look", "blink", "smile", "coffee", "wave"];

export default function PsycholkaDesk({ hasVisits, celebrate = false, forceRareMoment }: { hasVisits: boolean; celebrate?: boolean; forceRareMoment?: number }) {
  const [behavior, setBehavior] = useState<DeskBehavior>("rest");
  const [rareMoment, setRareMoment] = useState<PsycholkaRareMoment | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isEvening, setIsEvening] = useState(false);
  const lastRareMoment = useRef<PsycholkaRareMoment | null>(null);
  const lastActivityAt = useRef(0);

  useEffect(() => {
    lastActivityAt.current = Date.now();
    const clock = window.setTimeout(() => setIsEvening(new Date().getHours() >= 18), 0);
    return () => window.clearTimeout(clock);
  }, []);

  useEffect(() => {
    const recordActivity = () => { lastActivityAt.current = Date.now(); };
    const updateInputState = () => {
      const activeElement = document.activeElement;
      setIsInputActive(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLSelectElement || activeElement?.getAttribute("contenteditable") === "true");
      recordActivity();
    };

    window.addEventListener("pointerdown", recordActivity);
    window.addEventListener("keydown", recordActivity);
    document.addEventListener("focusin", updateInputState);
    document.addEventListener("focusout", updateInputState);

    return () => {
      window.removeEventListener("pointerdown", recordActivity);
      window.removeEventListener("keydown", recordActivity);
      document.removeEventListener("focusin", updateInputState);
      document.removeEventListener("focusout", updateInputState);
    };
  }, []);

  useEffect(() => {
    if (!hasVisits || isHovered || rareMoment) {
      const rest = window.setTimeout(() => setBehavior("rest"), 0);
      return () => window.clearTimeout(rest);
    }

    let actionTimer: number | undefined;
    let restTimer: number | undefined;
    const scheduleBehavior = () => {
      actionTimer = window.setTimeout(() => {
        setBehavior(activeBehaviors[Math.floor(Math.random() * activeBehaviors.length)]!);
        restTimer = window.setTimeout(() => { setBehavior("rest"); scheduleBehavior(); }, 1400);
      }, 120_000 + Math.floor(Math.random() * 120_000));
    };
    scheduleBehavior();

    return () => {
      if (actionTimer) window.clearTimeout(actionTimer);
      if (restTimer) window.clearTimeout(restTimer);
    };
  }, [hasVisits, isHovered, rareMoment]);

  useEffect(() => {
    if (!hasVisits) return;
    let rareTimer: number | undefined;
    let returnToIdleTimer: number | undefined;

    const scheduleRareMoment = () => {
      rareTimer = window.setTimeout(() => {
        const isActive = Date.now() - lastActivityAt.current < 5 * 60_000;
        const isBlocked = isHovered || isInputActive || document.hidden;
        if (!isActive || isBlocked) {
          scheduleRareMoment();
          return;
        }

        const nextMoment = pickRareMoment(lastRareMoment.current);
        lastRareMoment.current = nextMoment;
        setRareMoment(nextMoment);
        returnToIdleTimer = window.setTimeout(() => {
          setRareMoment(null);
          scheduleRareMoment();
        }, getRareMomentDuration());
      }, getRareMomentDelay());
    };
    scheduleRareMoment();

    return () => {
      if (rareTimer) window.clearTimeout(rareTimer);
      if (returnToIdleTimer) window.clearTimeout(returnToIdleTimer);
    };
  }, [hasVisits, isHovered, isInputActive]);

  useEffect(() => {
    if (forceRareMoment === undefined) return;
    const runPreview = window.setTimeout(() => {
      const nextMoment = pickRareMoment(lastRareMoment.current);
      lastRareMoment.current = nextMoment;
      setRareMoment(nextMoment);
    }, 0);
    const endPreview = window.setTimeout(() => setRareMoment(null), 3_000);
    return () => { window.clearTimeout(runPreview); window.clearTimeout(endPreview); };
  }, [forceRareMoment]);

  const mood: PsycholkaMood = celebrate ? "celebrate" : isEvening ? "sleepy" : hasVisits ? "happy" : "calm";
  const action = behavior === "rest" ? "idle" : behavior === "wave" ? "wave" : behavior === "coffee" || isEvening ? "coffee" : "greeting";
  const showMessage = () => { const nextMessage = pickPsycholkaMessage(psycholkaDeskClickMessages); if (nextMessage === "Dobrze, że jesteś.") recordPsycholkaWelcomeClick(); setMessage(nextMessage); window.setTimeout(() => setMessage(null), 2800); };

  return <div className={`psycholka-desk psycholka-desk-${behavior} ${rareMoment ? "psycholka-desk-rare" : ""}`} data-psycholka-rare-moment={rareMoment ?? undefined} data-psycholka-desk-items="book coffee plant notebook lamp" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}><button type="button" onClick={showMessage} className="psycholka-desk-character" aria-label="PsychOLKA"><PsycholkaWidget context="dashboard" mood={mood} action={action} fallbackAction="greeting" breath={behavior === "rest" && !rareMoment} /></button><div aria-hidden="true" className="psycholka-desk-surface"><span /><span /><span /><span /><span /></div><p aria-live="polite" className={`psycholka-desk-message ${message ? "psycholka-desk-message-visible" : ""}`}>{message ?? ""}</p></div>;
}
