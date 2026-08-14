import { CalendarDays, Car, Gift, MessageCircleHeart, Palette, Sparkles } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import RoomLogoutButton from "@/app/room/RoomLogoutButton";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function MemberRoomPage() {
  const member = await requireMember();
  const { data: accessRows } = await supabaseAdmin
    .from("member_patient_access")
    .select("access_role")
    .eq("user_id", member.userId)
    .eq("status", "active");

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
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RoomCard icon={CalendarDays} title="Wizyty" description="Terminy, rezerwacja i prośba o przełożenie." />
          <RoomCard icon={MessageCircleHeart} title="Od Aleksandry" description="Prywatne wiadomości i udostępnione materiały." />
          <RoomCard icon={Gift} title="Prezenty i konkursy" description="Nagrody, rabaty i spokojne niespodzianki." />
          <RoomCard icon={Palette} title="Babyroom" description="Kolorowanki, rysowanie i bezpieczne mini-gry." />
          <RoomCard icon={Car} title="Dojazd" description="Nawigacja do właściwego gabinetu." />
          <RoomCard icon={Sparkles} title="Co warto zrobić?" description="Rodzinne atrakcje pobierane ze wspólnego cache." />
        </section>
      </div>
    </main>
  );
}

function RoomCard({ icon: Icon, title, description }: { icon: typeof CalendarDays; title: string; description: string }) {
  return (
    <article className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
      <span className="inline-flex rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={22} aria-hidden="true" /></span>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#87917F]">W przygotowaniu</p>
    </article>
  );
}
