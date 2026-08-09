"use client";

import Image from "next/image";
import { PsycholkaAssets } from "@/public/psycholka";

export type PartnerPsycholkaState = "greeting" | "booking" | "waiting" | "success";

const stateAssets: Record<PartnerPsycholkaState, string> = {
  greeting: PsycholkaAssets.greeting,
  booking: PsycholkaAssets.booking.calendar,
  waiting: PsycholkaAssets.waiting,
  success: PsycholkaAssets.emotions.success,
};

type PartnerPsycholkaVisualProps = {
  state: PartnerPsycholkaState;
  className?: string;
  priority?: boolean;
};

export default function PartnerPsycholkaVisual({ state, className = "", priority = false }: PartnerPsycholkaVisualProps) {
  return (
    <Image
      src={stateAssets[state]}
      alt=""
      aria-hidden="true"
      width={240}
      height={240}
      sizes="(max-width: 640px) 112px, 144px"
      priority={priority}
      onError={(event) => {
        event.currentTarget.src = PsycholkaAssets.greeting;
      }}
      className={`h-auto w-28 object-contain sm:w-36 ${className}`}
    />
  );
}
