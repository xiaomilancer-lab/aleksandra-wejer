"use client";

import { ArrowLeft, Printer } from "lucide-react";

export default function PrintControls() {
  return <div className="print:hidden mb-6 flex flex-wrap gap-3"><button type="button" onClick={() => window.history.back()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-4 py-2.5 font-bold"><ArrowLeft size={17} />Wróć</button><button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2D4739] px-5 py-2.5 font-bold text-white"><Printer size={18} />Drukuj / zapisz jako PDF</button></div>;
}
