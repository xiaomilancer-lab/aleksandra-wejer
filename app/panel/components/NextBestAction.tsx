import { ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, MoonStar, Play, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { DailyFlowKind, DailyFlowState } from "../services/dashboardService";
import PsycholkaWidget from "./PsychOLKAWidget";

const icons: Record<DailyFlowKind, LucideIcon> = {
  visit_active: Play,
  visit_preparation: CalendarClock,
  visit_closure: ClipboardCheck,
  followup_attention: ClipboardCheck,
  day_closing: MoonStar,
  today_queue: CheckCircle2,
};

const labels: Record<DailyFlowKind, string> = {
  visit_active: "Wizyta w toku",
  visit_preparation: "Następna akcja",
  visit_closure: "Wymaga domknięcia",
  followup_attention: "Wymaga uwagi",
  day_closing: "Koniec dnia",
  today_queue: "Plan dnia",
};

export default function NextBestAction({ state }: { state: DailyFlowState }) {
  const Icon = icons[state.kind];
  const cta = state.kind === "visit_preparation" ? "Przygotuj się" : state.kind === "visit_active" ? "Wróć do wizyty" : state.kind === "visit_closure" ? "Domknij wizytę" : state.kind === "day_closing" ? "Zakończ dzień" : "Otwórz";
  const action = state.kind === "today_queue" ? "search" : undefined;

  return (
    <section className="mt-5 rounded-3xl border border-[#D5DCCF] bg-[#FCFDFB] p-5 shadow-[0_12px_35px_rgba(45,71,57,0.05)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={21} aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-semibold text-[#55624D]">{labels[state.kind]}{state.visitTime ? ` · ${state.visitTime}` : ""}</p>
            <h2 className="mt-1 text-xl font-bold text-[#2D4739]">{state.title}</h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600">{state.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <PsycholkaWidget context="dashboard" action={action} fallbackAction="wave" className="hidden md:block" />
          <Link href={state.href} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#58644F]">
            {cta}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
