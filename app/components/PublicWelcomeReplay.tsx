"use client";

import { useRouter } from "next/navigation";

export default function PublicWelcomeReplay() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        window.localStorage.removeItem("psycholka-public-welcome-seen");
        router.push("/?psycholkaWelcome=1");
      }}
      className="text-sm text-[#6D7A62] underline-offset-4 transition hover:underline"
    >
      Zobacz powitanie PsychOLKI ponownie
    </button>
  );
}
