"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PsycholkaAssets } from "@/public/psycholka";
import { getPsycholkaAsset, getPsycholkaGreetingFallback, getPsycholkaIdleFallback } from "../psycholka/psycholkaAssets";
import { getPsycholkaBehavior, PSYCHOLKA_DEBUG } from "../psycholka/psycholkaConfig";
import type { PsycholkaAction, PsycholkaContext, PsycholkaEventHooks, PsycholkaMood } from "../psycholka/psycholkaTypes";

export interface PsycholkaWidgetProps extends PsycholkaEventHooks {
  context: PsycholkaContext;
  mood?: PsycholkaMood;
  action?: PsycholkaAction;
  fallbackAction?: PsycholkaAction;
  breath?: boolean;
  message?: string;
  className?: string;
}

const directActions: PsycholkaAction[] = ["idle", "greeting", "open_arms", "point_booking", "search", "sad", "happy", "meet_aleksandra", "help_path", "locations", "reviews", "account_whisper", "booking_choice", "goodbye"];

const motionClassByAction: Record<PsycholkaAction, string> = {
  idle: "psycholka-idle",
  wave: "psycholka-wave",
  coffee: "psycholka-coffee",
  read: "psycholka-read",
  walk: "psycholka-walk",
  run: "psycholka-run",
  sit: "psycholka-sit",
  point: "psycholka-point-booking",
  celebrate: "psycholka-celebrate",
  lost_shoe: "psycholka-lost-shoe",
  sleep: "psycholka-sleep",
  look_around: "psycholka-look-around",
  greeting: "psycholka-greeting",
  open_arms: "psycholka-open-arms",
  point_booking: "psycholka-point-booking",
  search: "psycholka-look-around",
  sad: "psycholka-sad",
  happy: "psycholka-celebrate",
  meet_aleksandra: "psycholka-greeting",
  help_path: "psycholka-walk",
  locations: "psycholka-point-booking",
  reviews: "psycholka-celebrate",
  account_whisper: "psycholka-look-around",
  booking_choice: "psycholka-point-booking",
  goodbye: "psycholka-sleep",
};

export default function PsycholkaWidget({
  context,
  mood,
  action,
  fallbackAction,
  breath,
  message,
  className,
  onVisitSaved,
  onVisitCompleted,
  onTaskCompleted,
  onReviewReceived,
  onDayClosed,
}: PsycholkaWidgetProps) {
  const behavior = getPsycholkaBehavior(context);
  const resolvedMood = mood ?? behavior.mood;
  const requestedAction = action && (behavior.allowedActions.includes(action) || directActions.includes(action)) ? action : behavior.action;
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPrimaryFailed(false);
      setFallbackFailed(false);
      setFallbackIndex(0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [context, requestedAction, fallbackAction]);

  const requestedAsset = getPsycholkaAsset(requestedAction, context);
  const configuredFallback = fallbackAction ? getPsycholkaAsset(fallbackAction, context) : null;
  const greetingFallback = getPsycholkaGreetingFallback();
  const idleFallback = getPsycholkaIdleFallback(context);
  const fallbackAssets = [configuredFallback, greetingFallback, idleFallback].filter((asset, index, all): asset is NonNullable<typeof asset> => Boolean(asset) && all.findIndex((candidate) => candidate?.id === asset?.id) === index);
  const usesFallback = primaryFailed || !requestedAsset;
  const displayedAsset = usesFallback ? fallbackAssets[fallbackIndex] ?? null : requestedAsset;
  const visualAction = requestedAction;
  const isSequenceAction = ["greeting", "open_arms", "celebrate", "point_booking"].includes(requestedAction);
  const breathEnabled = breath ?? (requestedAction === "idle" && !isSequenceAction);

  void onVisitSaved;
  void onVisitCompleted;
  void onTaskCompleted;
  void onReviewReceived;
  void onDayClosed;

  const animationClass = motionClassByAction[visualAction];
  const visualClass = context === "session" ? "psycholka-visual-session" : behavior.size === "small" ? "psycholka-visual-small" : "psycholka-visual-medium";
  const showAsset = displayedAsset && !fallbackFailed;

  return (
    <div className={`psycholka-widget max-w-full ${breathEnabled ? "psycholka-breath-shell" : ""} ${behavior.interactive ? "" : "pointer-events-none"} ${className ?? ""}`} aria-label="PsychOLKA" data-psycholka-mood={resolvedMood} data-psycholka-action={visualAction}>
      <div className={`psycholka-visual ${visualClass} ${animationClass}`}>
        <span className="psycholka-aura" aria-hidden="true" />
        <span className="psycholka-ground-shadow" aria-hidden="true" />
        <span className="psycholka-sparkle psycholka-sparkle-one" aria-hidden="true" />
        <span className="psycholka-sparkle psycholka-sparkle-two" aria-hidden="true" />
        <div className="psycholka-character">
        {showAsset ? (
          <Image
            src={displayedAsset.src}
            width={displayedAsset.width}
            height={displayedAsset.height}
            alt=""
            unoptimized
            onError={() => {
              if (!usesFallback) {
                setPrimaryFailed(true);
                return;
              }
              if (fallbackIndex + 1 < fallbackAssets.length) {
                setFallbackIndex((current) => current + 1);
                return;
              }
              setFallbackFailed(true);
            }}
            className="h-full w-full object-contain"
          />
        ) : (
          <Image
            src={PsycholkaAssets.greeting}
            width={320}
            height={400}
            alt="PsychOLKA"
            unoptimized
            className="h-full w-full object-contain"
          />
        )}
        </div>
      </div>
      {message && <p className="mt-2 text-sm text-[#55624D]">{message}</p>}
      {PSYCHOLKA_DEBUG && displayedAsset && (
        <p className="mt-2 text-center text-[10px] text-[#55624D]">Użyty asset: {displayedAsset.src}</p>
      )}
    </div>
  );
}
