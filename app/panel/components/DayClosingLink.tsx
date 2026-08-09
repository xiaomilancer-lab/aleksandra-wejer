import { MoonStar } from "lucide-react";
import Link from "next/link";

export default function DayClosingLink({ isRecommended = false }: { isRecommended?: boolean }) {
  return <Link href="/panel/day-closing" className={`mt-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${isRecommended ? "bg-[#EEF1EB] text-[#2D4739] hover:bg-[#DDE5D8]" : "text-[#6D7A62] hover:bg-[#F8F5F0]"}`}><MoonStar size={17} aria-hidden="true" />Zakończ dzień</Link>;
}
