"use client";

import { useEffect, useState } from "react";
import PsycholkaWidget from "../panel/components/PsychOLKAWidget";
import type { PsycholkaAction } from "../panel/psycholka/psycholkaTypes";

export const PUBLIC_GUIDE_START_EVENT = "psycholka-public-guide-start";

type PublicPsycholkaGuideProps = { message: string; action?: PsycholkaAction };

/** A small, in-flow cue that is revealed only after a visitor starts the guided walk. */
export default function PublicPsycholkaGuide({ message, action = "idle" }: PublicPsycholkaGuideProps) {
  const [isGuiding, setIsGuiding] = useState(false);

  useEffect(() => {
    const enableGuide = () => setIsGuiding(true);
    window.addEventListener(PUBLIC_GUIDE_START_EVENT, enableGuide);
    return () => window.removeEventListener(PUBLIC_GUIDE_START_EVENT, enableGuide);
  }, []);

  if (!isGuiding) return null;

  return (
    <div className="mb-8 flex items-center justify-center gap-3 text-center sm:mb-10">
      <PsycholkaWidget context="welcome" action={action} fallbackAction="greeting" breath className="public-psycholka-guide" />
      <p className="max-w-xs rounded-2xl border border-[#DCE8E2] bg-[#F7FBF9] px-4 py-3 text-sm font-medium leading-6 text-[#31584F] shadow-sm">
        {message}
      </p>
    </div>
  );
}
