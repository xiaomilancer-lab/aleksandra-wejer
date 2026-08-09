import Link from "next/link";

export default async function ParentChildPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return <main className="min-h-screen bg-[#F8F5F0] p-6"><section className="mx-auto max-w-xl rounded-3xl border border-[#E5E1D8] bg-white p-8 shadow-[0_12px_35px_rgba(45,71,57,0.06)]"><h1 className="text-3xl font-bold text-[#2D4739]">Panel dziecka</h1><p className="mt-4 text-gray-600">Dane zostaną pokazane wyłącznie po serwerowym sprawdzeniu roli rodzica oraz aktywnej relacji dostępu.</p><p className="mt-4 rounded-2xl bg-[#F8F5F0] p-4 text-sm text-gray-600">Nie są tu wyświetlane notatki psychologa ani inne prywatne dane terapeutyczne.</p><Link href="/parent/children" className="mt-6 inline-flex text-sm font-semibold text-[#6D7A62]">Wróć do listy</Link></section></main>;
}
