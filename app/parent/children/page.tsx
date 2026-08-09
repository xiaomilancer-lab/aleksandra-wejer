import Link from "next/link";

export default function ParentChildrenPage() {
  return <main className="min-h-screen bg-[#F8F5F0] p-6"><section className="mx-auto max-w-xl rounded-3xl border border-[#E5E1D8] bg-white p-8 shadow-[0_12px_35px_rgba(45,71,57,0.06)]"><h1 className="text-3xl font-bold text-[#2D4739]">Moje dzieci</h1><p className="mt-4 text-gray-600">Lista dzieci będzie pobierana dopiero po podłączeniu serwerowej sesji rodzica i aktywnych uprawnień.</p><Link href="/parent" className="mt-6 inline-flex text-sm font-semibold text-[#6D7A62]">Wróć do Parent Hub</Link></section></main>;
}
