"use client";

import { useEffect } from "react";
import { recordPsycholkaCompletedDay } from "../psycholka/psycholkaMemory";

export default function PsycholkaMemoryDayClosing({ isComplete }: { isComplete: boolean }) {
  useEffect(() => {
    if (!isComplete) return;
    const record = window.setTimeout(() => recordPsycholkaCompletedDay(), 0);
    return () => window.clearTimeout(record);
  }, [isComplete]);

  return null;
}
