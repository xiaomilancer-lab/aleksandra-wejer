import Link from "next/link";
import { ArrowLeft, Bell, ExternalLink, MessageCircleHeart } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import { getMemberPatientAccess } from "@/app/room/server/memberContext";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RoomMessage = { id: string; title: string; content: string; action_label: string | null; action_url: string | null; visible_from: string; expires_at: string | null };
type Bulletin = RoomMessage & { audience: string };

function safeActionUrl(value: string | null) {
  if (!value) return null;
  return /^https:\/\//i.test(value) || /^\/(?!\/)/.test(value) ? value : null;
}

export default async function RoomMessagesPage() {
  const member = await requireMember();
  const accessRows = await getMemberPatientAccess(member.userId);
  const patientIds = [...new Set(accessRows.map((row) => row.patient_id))];
  const now = new Date();
  let privateItems: RoomMessage[] = [];

  if (patientIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("member_room_items")
      .select("id, title, content, action_label, action_url, visible_from, expires_at")
      .in("patient_id", patientIds)
      .eq("is_visible", true)
      .lte("visible_from", now.toISOString())
      .order("visible_from", { ascending: false });
    if (error) throw error;
    privateItems = ((data ?? []) as RoomMessage[]).filter((item) => !item.expires_at || new Date(item.expires_at) > now);
  }

  const { data: bulletinData, error: bulletinError } = await supabaseAdmin
    .from("member_bulletins")
    .select("id, audience, title, content, action_label, action_url, visible_from, expires_at")
    .in("audience", ["all", member.role])
    .eq("is_published", true)
    .lte("visible_from", now.toISOString())
    .order("visible_from", { ascending: false });
  if (bulletinError) throw bulletinError;
  const bulletins = ((bulletinData ?? []) as Bulletin[]).filter((item) => !item.expires_at || new Date(item.expires_at) > now);

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm"><Link href="/room" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D7A62]"><ArrowLeft size={17} aria-hidden="true" />Wróć do pokoju</Link><p className="mt-5 text-sm text-gray-500">Bezpiecznie w Twoim pokoju</p><h1 className="mt-1 text-3xl font-bold">Od Aleksandry</h1><p className="mt-2 text-sm text-gray-600">Prywatne wiadomości, materiały i wspólne ogłoszenia przeznaczone dla Twojego typu konta.</p></header>
        <MessageSection title="Prywatnie dla Ciebie" icon={MessageCircleHeart} messages={privateItems} empty={patientIds.length === 0 ? "Prywatne wiadomości pojawią się po połączeniu konta z kartą pacjenta." : "Nie ma teraz nowych prywatnych wiadomości."} />
        <MessageSection title="Ogłoszenia PsychOLKI" icon={Bell} messages={bulletins} empty="Nie ma teraz nowych ogłoszeń." />
      </div>
    </main>
  );
}

function MessageSection({ title, icon: Icon, messages, empty }: { title: string; icon: typeof Bell; messages: RoomMessage[]; empty: string }) {
  return <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={22} aria-hidden="true" /></span><h2 className="text-2xl font-bold">{title}</h2></div>{messages.length === 0 ? <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-5 text-sm text-gray-600">{empty}</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{messages.map((message) => { const url = safeActionUrl(message.action_url); return <article key={message.id} className="rounded-2xl border border-[#E5E1D8] p-5"><h3 className="font-bold">{message.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{message.content}</p>{url && <a href={url} target={url.startsWith("https://") ? "_blank" : undefined} rel={url.startsWith("https://") ? "noreferrer" : undefined} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#CBD3C6] px-4 py-2 text-sm font-semibold">{message.action_label || "Otwórz"}<ExternalLink size={16} aria-hidden="true" /></a>}</article>; })}</div>}</section>;
}
