"use client";

import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { dismissPsycholkaHeartMessage, takePsycholkaHeartMessage } from "../psycholka/psycholkaHeart";

export default function HeartMessageEngine({ eventKey, trigger, force = false, className = "" }: { eventKey: string; trigger?: string | number; force?: boolean; className?: string }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const showMessage = window.setTimeout(() => setMessage(takePsycholkaHeartMessage(force)), 0);
    return () => window.clearTimeout(showMessage);
  }, [eventKey, trigger, force]);

  if (!message) return null;

  return <div role="status" className={`inline-flex max-w-sm items-center gap-2 rounded-2xl border border-[#E5E1D8] bg-[#FCFDFB] px-3 py-2 text-sm text-[#2D4739] shadow-sm ${className}`}><Heart size={16} className="shrink-0 text-[#C76E76]" fill="currentColor" aria-hidden="true" /><span>{message}</span><button type="button" onClick={() => { dismissPsycholkaHeartMessage(); setMessage(null); }} aria-label="Zamknij wiadomość PsychOLKI" className="ml-1 rounded-md p-1 text-gray-500 hover:bg-[#F8F5F0] hover:text-[#2D4739]"><X size={14} aria-hidden="true" /></button></div>;
}
