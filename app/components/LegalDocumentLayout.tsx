import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { LEGAL_EFFECTIVE_DATE, PRACTICE_CONTACT } from "@/app/lib/legal";

export default function LegalDocumentLayout({ eyebrow, title, version, children }: { eyebrow: string; title: string; version: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-8 text-[#23332F] sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-[32px] border border-[#E5E1D8] bg-white p-6 shadow-[0_18px_55px_rgba(45,71,57,0.08)] sm:p-10 lg:p-12">
        <Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739] transition hover:bg-[#F8F5F0]">
          <ArrowLeft size={19} aria-hidden="true" /> Wróć do rejestracji
        </Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#6D7A62]">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-[#2D4739] sm:text-5xl">{title}</h1>
        <p className="mt-4 rounded-2xl bg-[#F8F5F0] px-4 py-3 text-sm leading-6 text-gray-600">
          Wersja {version} · obowiązuje od {LEGAL_EFFECTIVE_DATE}
        </p>
        <div className="legal-document mt-9 space-y-9 text-[15px] leading-7 text-gray-700">{children}</div>
        <footer className="mt-12 border-t border-[#E5E1D8] pt-7">
          <p className="font-semibold text-[#2D4739]">Pytania dotyczące konta lub danych?</p>
          <a href={`mailto:${PRACTICE_CONTACT.email}`} className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#6D7A62] px-5 py-3 font-semibold text-white">
            <Mail size={18} aria-hidden="true" /> {PRACTICE_CONTACT.email}
          </a>
        </footer>
      </article>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="text-2xl font-bold text-[#2D4739]">{title}</h2><div className="mt-3 space-y-3">{children}</div></section>;
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-[#6D7A62]">{children}</ul>;
}
