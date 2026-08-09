import Link from "next/link";
import { APP_BRAND_NAME } from "../lib/branding";

export default function ParentHubPage() {
  return <main className="min-h-screen bg-[#F8F5F0] p-6"><section className="mx-auto max-w-xl rounded-3xl border border-[#E5E1D8] bg-white p-8 shadow-[0_12px_35px_rgba(45,71,57,0.06)]"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">{APP_BRAND_NAME}</p><h1 className="mt-2 text-3xl font-bold text-[#2D4739]">Parent Hub</h1><p className="mt-4 text-gray-600">Bezpieczny dostęp dla rodziców jest przygotowywany. Ten ekran nie wyświetla jeszcze żadnych danych dziecka.</p><Link href="/parent/children" className="mt-6 inline-flex rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white">Moje dzieci</Link></section></main>;
}
