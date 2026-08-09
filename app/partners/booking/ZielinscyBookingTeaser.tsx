import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import PsycholkaWidget from "@/app/panel/components/PsychOLKAWidget";

type ZielinscyBookingTeaserProps = {
  variant: "landing" | "embed";
};

export default function ZielinscyBookingTeaser({ variant }: ZielinscyBookingTeaserProps) {
  const isEmbed = variant === "embed";
  const bookingHref = isEmbed ? "/book/zielinscy?source=embed" : "/book/zielinscy";

  return (
    <section className={`mx-auto w-full ${isEmbed ? "max-w-xl" : "max-w-5xl"}`} aria-labelledby="zielinscy-booking-title">
      <div className={`overflow-hidden rounded-3xl border border-[#D5DCCF] bg-white shadow-sm ${isEmbed ? "p-5" : "p-6 sm:p-10"}`}>
        <div className={`grid items-center gap-5 ${isEmbed ? "sm:grid-cols-[110px_1fr]" : "md:grid-cols-[180px_1fr]"}`}>
          <div className="flex justify-center">
            <PsycholkaWidget context="welcome" action="greeting" className={isEmbed ? "w-[100px]" : "w-[160px]"} />
          </div>
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><MapPin size={16} aria-hidden="true" />Nowa Wieś Rzeczna</p>
            <h1 id="zielinscy-booking-title" className={`${isEmbed ? "mt-2 text-xl" : "mt-3 text-3xl sm:text-4xl"} font-bold tracking-tight text-[#2D4739]`}>Konsultacje z Aleksandrą Wejer</h1>
            <p className={`${isEmbed ? "mt-2 text-sm" : "mt-4 text-lg"} max-w-2xl leading-relaxed text-[#55624D]`}>Aleksandra Wejer — psycholog. Konsultacje również w Centrum Medyczno-Estetycznym Zielińscy w Nowej Wsi Rzecznej.</p>
            <Link href={bookingHref} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#58644F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6D7A62]">
              <CalendarDays size={18} aria-hidden="true" />
              {isEmbed ? "Umów wizytę" : "Sprawdź wolne terminy"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
