"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import PsycholkaWidget from "./PsychOLKAWidget";

type GreetingStage = "appear" | "wave" | "arms";

type PsycholkaGreetingSequenceProps = {
  onComplete?: () => void;
  className?: string;
};

export default function PsycholkaGreetingSequence({ onComplete, className }: PsycholkaGreetingSequenceProps) {
  const [stage, setStage] = useState<GreetingStage>("appear");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotion = window.setTimeout(() => {
        setStage("arms");
        onComplete?.();
      }, 0);
      return () => window.clearTimeout(reducedMotion);
    }

    const wave = window.setTimeout(() => setStage("wave"), 500);
    const arms = window.setTimeout(() => {
      setStage("arms");
      onComplete?.();
    }, 1500);

    return () => {
      window.clearTimeout(wave);
      window.clearTimeout(arms);
    };
  }, [onComplete]);

  const action = stage === "wave" || stage === "arms" ? "wave" : "greeting";

  return (
    <div className={`psycholka-greeting-sequence psycholka-greeting-${stage} ${className ?? ""}`}>
      <PsycholkaWidget context="welcome" action={action} fallbackAction="greeting" />
      {stage === "arms" && (
        <p className="mt-4 flex items-center justify-center gap-2 text-xl font-semibold text-[#2D4739]">
          Dobrze, że jesteś. <Heart size={20} className="text-[#C76E76]" fill="currentColor" />
        </p>
      )}
    </div>
  );
}
