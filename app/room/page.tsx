import Link from "next/link";
import { CalendarDays, Car, Download, Gift, MessageCircleHeart, Palette, Sparkles, Star } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import RoomLogoutButton from "@/app/room/RoomLogoutButton";
import { getMemberPatientAccess } from "@/app/room/server/memberContext";

export default async function MemberRoomPage() {
  const member = await requireMember();
  const accessRows = await getMemberPatientAccess(member.userId);

  const activeRoles = new Set((accessRows ?? []).map((access) => access.access_role));
  const isLinked = activeRoles.size > 0;
  const hasBothContexts = activeRoles.has("patient") && activeRoles.has("parent");

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-4 rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Prywatny pokój PsychOLKI</p>
            <h1 className="mt-1 text-3xl font-bold">Dobrze, że jesteś, {member.displayName}. 🌸</h1>
            <p className="mt-2 text-sm text-gray-600">{member.role === "parent" ? "Pokój rodzica" : "Pokój pacjenta"}</p>
            {hasBothContexts && <p className="mt-2 text-sm font-semibold text-[#6D7A62]">Jedno konto · dostęp pacjenta i rodzica</p>}
          </div>
          <RoomLogoutButton />
        </header>

        {!isLinked && (
          <section className="rounded-3xl border border-[#E8D6B8] bg-[#FFF9EE] p-6">
            <h2 className="font-bold">Konto jest gotowe</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6F5732]">
              Gabinet musi jeszcze bezpiecznie połączyć je z właściwą kartą pacjenta. Do tego czasu żadne dane wizyt nie są wyświetlane.
            </p>
            <a href="/karta-po-spotkaniu-przyklad.pdf" download className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D9C69F] bg-white px-4 py-2 text-sm font-semibold text-[#2D4739]">
              <Download size={17} aria-hidden="true" /> Pobierz przykładową kartę po spotkaniu
            </a>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RoomCard icon={CalendarDays} title="Wizyty" description="Terminy, historia i bezpieczna prośba o przełożenie." href="/room/visits" />
          <RoomCard icon={MessageCircleHeart} title="Od Aleksandry" description="Prywatne wiadomości i udostępnione materiały." href="/room/messages" />
          <RoomCard icon={Gift} title="Prezenty i konkursy" description="Nagrody, rabaty i spokojne niespodzianki." />
          <RoomCard icon={Palette} title="Babyroom" description="Rysowanie i bezpieczne mini-gry bez reklam." href="/room/babyroom" />
          <RoomCard icon={Car} title="Dojazd" description="Samochód, komunikacja miejska i Bolt do obu gabinetów." href="/room/travel" />
          <RoomCard icon={Sparkles} title="Co warto zrobić?" description="Rodzinne atrakcje pobierane ze wspólnego cache." />
          <RoomCard icon={Star} title="Twoja opinia" description="Prywatna wiadomość lub dobrowolna opinia Google dla właściwego gabinetu." href="/room/feedback" />
        </section>
      </div>
    </main>
  );
}

function RoomCard({ icon: Icon, title, description, href }: { icon: typeof CalendarDays; title: string; description: string; href?: string }) {
  const card = (
    <article className={`h-full rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm ${href ? "transition hover:-translate-y-0.5 hover:border-[#AAB5A4]" : ""}`}>
      <span className="inline-flex rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={22} aria-hidden="true" /></span>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#87917F]">{href ? "Otwórz" : "W przygotowaniu"}</p>
    </article>
  );
  return href ? <Link href={href} className="block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8]">{card}</Link> : card;
}
