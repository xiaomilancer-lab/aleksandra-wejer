"use client";

import Image from "next/image";
import { RefreshCw, ShieldCheck, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0] px-5 py-10 text-[#2D4739]">
      <section className="w-full max-w-lg rounded-[2rem] border border-[#E5E1D8] bg-white p-6 text-center shadow-[0_18px_50px_rgba(45,71,57,0.1)] sm:p-10">
        <div className="relative mx-auto h-40 w-40">
          <Image
            src="/psycholka/system/6_sleep_spi.png"
            alt="PsychOLKA chwilowo odpoczywa"
            fill
            sizes="160px"
            className="object-contain"
            priority
          />
        </div>
        <span className="mx-auto mt-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1EB]">
          <WifiOff className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">PsychOLKA chwilowo odpoczywa</h1>
        <p className="mx-auto mt-3 max-w-md leading-7 text-[#58645D]">
          Telefon nie ma teraz połączenia z internetem. Twoje dane są bezpieczne — aplikacja nie pokazuje zapisanych wizyt ani informacji pacjenta bez połączenia.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2D4739] px-5 py-3 font-semibold text-white"
        >
          <RefreshCw className="h-5 w-5" />
          Spróbuj ponownie
        </button>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-[#6D7A62]">
          <ShieldCheck className="h-4 w-4" />
          Dane medyczne nie są przechowywane w pamięci offline.
        </p>
      </section>
    </main>
  );
}
