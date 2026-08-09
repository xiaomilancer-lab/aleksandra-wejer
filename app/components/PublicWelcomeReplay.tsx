"use client";

export default function PublicWelcomeReplay() { return <button type="button" onClick={() => { window.localStorage.removeItem("psycholka-public-welcome-seen"); window.location.assign("/?psycholkaWelcome=1"); }} className="text-sm text-[#6D7A62] underline-offset-4 transition hover:underline">Zobacz powitanie PsychOLKI ponownie</button>; }
