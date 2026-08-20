import Link from "next/link";
import { Bell, BookOpen, CalendarDays, Heart, LogIn, Target, UserPlus } from "lucide-react";
import PsycholkaWidget from "../panel/components/PsychOLKAWidget";

const benefits = [
  { label: "Wizyty", icon: CalendarDays },
  { label: "Zadania", icon: Target },
  { label: "Materiały", icon: BookOpen },
  { label: "Przypomnienia", icon: Bell },
  { label: "PsychOLKA", icon: Heart },
];

export default function PatientAccountTeaser() {
  return <section className="bg-white py-20 sm:py-24"><div className="mx-auto grid max-w-6xl gap-8 px-6 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><div className="flex justify-center"><PsycholkaWidget context="welcome" action="account_whisper" fallbackAction="greeting" className="public-account-psycholka" /></div><div className="rounded-3xl border border-[#E5E2DB] bg-[#FCFDFB] p-6 sm:p-8"><div className="flex items-center gap-3"><Heart size={22} className="text-[#C76E76]" fill="currentColor" aria-hidden="true" /><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Twoje miejsce w PsychOLCE</p></div><h2 className="mt-4 text-3xl font-bold text-[#4B4338]">Pssst... konto naprawdę ułatwia życie. 😉</h2><p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-gray-600">{"Załóż prywatny pokój pacjenta lub rodzica.\nWizyty, wiadomości i bezpieczny Babyroom\nbędą zawsze pod ręką."}</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-2xl bg-[#F8F5F0] px-4 py-3 text-sm font-semibold text-[#4B4338]"><Icon size={18} className="text-[#6D7A62]" aria-hidden="true" />{label}</div>)}</div><div className="mt-7 flex flex-wrap gap-3"><Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 text-sm font-bold text-white"><UserPlus size={18} />Załóż konto</Link><Link href="/login" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#C8D0C3] bg-white px-5 py-3 text-sm font-bold text-[#2D4739]"><LogIn size={18} />Mam już konto</Link></div><p className="mt-3 text-sm text-gray-500">Konto nie pokazuje danych innych pacjentów. Połączenie z kartą pacjenta zatwierdza gabinet.</p></div></div></section>;
}
