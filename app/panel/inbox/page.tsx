import Link from "next/link";
import { Archive, ArrowLeft, Mail, MailOpen, Paperclip, Search } from "lucide-react";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PatientVaultGate from "../patients/PatientVaultGate";
import { getPatientVaultState } from "../server/patientVault";
import { requirePsychologist } from "../server/requirePsychologist";
import { getInboundEmail, getInboundEmails } from "../services/inboundEmailService";
import { archiveInboundEmailAction, markInboundEmailReadAction } from "../actions/inboundEmailActions";

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ id?: string; q?: string }> }) {
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/inbox" /></Dashboard></AuthGuard>;

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  let result = { emails: [], available: true } as Awaited<ReturnType<typeof getInboundEmails>>;
  let loadError = false;
  try { result = await getInboundEmails(query); } catch { loadError = true; }
  const selected = params.id && result.available ? await getInboundEmail(params.id).catch(() => null) : null;
  const unread = result.emails.filter((email) => !email.is_read).length;

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-7xl">
          <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Bezpiecznie w panelu Aleksandry</p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold text-[#2D4739]">Skrzynka</h1><p className="mt-2 text-sm leading-relaxed text-gray-600">Poczta e-mail przekazana z OVH oraz prywatne wiadomości z PsychOLKI. Oryginały maili nadal pozostają w Roundcube.</p></div><span className="w-fit rounded-full bg-[#EEF1EB] px-4 py-2 text-sm font-semibold text-[#2D4739]">{unread} nieprzeczytanych</span></div>
          </header>

          {!result.available ? <SetupNotice /> : loadError ? <ErrorNotice /> : (
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.5fr)]">
              <section className="rounded-3xl border border-[#E5E1D8] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex gap-2 rounded-2xl bg-[#F8F5F0] p-1"><span className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[#2D4739] shadow-sm">Poczta e-mail</span><span title="Prywatne odpowiedzi użytkowników dołączymy w następnym etapie" className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold text-[#87917F]">PsychOLKA · wkrótce</span></div>
                <form className="relative mt-4"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="q" defaultValue={query} placeholder="Szukaj nadawcy lub tematu…" className="min-h-12 w-full rounded-2xl border border-[#E5E1D8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#6D7A62]" /></form>
                <div className="mt-4 space-y-2">{result.emails.length === 0 ? <p className="rounded-2xl bg-[#F8F5F0] p-5 text-sm text-gray-600">{query ? "Nie znaleziono wiadomości." : "Nie ma jeszcze odebranych wiadomości."}</p> : result.emails.map((email) => <Link key={email.id} href={`/panel/inbox?id=${email.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={`block rounded-2xl border p-4 transition hover:border-[#AEB8A9] ${email.id === selected?.id ? "border-[#83907C] bg-[#EEF1EB]" : "border-[#E5E1D8] bg-white"}`}><div className="flex items-start gap-3">{email.is_read ? <MailOpen size={18} className="mt-0.5 shrink-0 text-[#87917F]" /> : <Mail size={18} className="mt-0.5 shrink-0 text-[#2D4739]" />}<div className="min-w-0 flex-1"><p className={`truncate text-sm ${email.is_read ? "font-medium" : "font-bold"}`}>{email.sender}</p><p className="mt-1 truncate text-sm text-gray-600">{email.subject}</p><p className="mt-2 text-xs text-gray-500">{formatDate(email.received_at)}</p></div>{email.attachment_metadata.length > 0 && <Paperclip size={15} className="shrink-0 text-gray-500" />}</div></Link>)}</div>
              </section>

              <section className="min-w-0 rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-7">{selected ? <EmailDetail email={selected} /> : <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="rounded-3xl bg-[#EEF1EB] p-5 text-[#6D7A62]"><Mail size={30} /></span><h2 className="mt-5 text-xl font-bold text-[#2D4739]">Wybierz wiadomość</h2><p className="mt-2 max-w-md text-sm text-gray-600">Treść pokaże się tutaj. Dla bezpieczeństwa skrzynka nie uruchamia kodu HTML ani zdalnych obrazów z maila.</p></div>}</section>
            </div>
          )}
        </div>
      </Dashboard>
    </AuthGuard>
  );
}

function EmailDetail({ email }: { email: NonNullable<Awaited<ReturnType<typeof getInboundEmail>>> }) {
  return <article><Link href="/panel/inbox" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E5E1D8] px-4 py-2 text-sm font-semibold text-[#2D4739] xl:hidden"><ArrowLeft size={17} />Lista</Link><div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="break-words text-sm font-semibold text-[#6D7A62]">{email.sender}</p><h2 className="mt-2 break-words text-2xl font-bold text-[#2D4739]">{email.subject}</h2><p className="mt-2 text-xs text-gray-500">{formatDate(email.received_at)} · do: {email.recipients.join(", ")}</p></div><div className="flex shrink-0 flex-wrap gap-2"><form action={markInboundEmailReadAction}><input type="hidden" name="id" value={email.id} /><input type="hidden" name="read" value={String(email.is_read ? false : true)} /><button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2 text-sm font-semibold"><MailOpen size={17} />{email.is_read ? "Oznacz jako nowe" : "Oznacz jako przeczytane"}</button></form><form action={archiveInboundEmailAction}><input type="hidden" name="id" value={email.id} /><button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E4CFCF] px-4 py-2 text-sm font-semibold text-[#9A4545]"><Archive size={17} />Archiwizuj</button></form></div></div>{email.attachment_metadata.length > 0 && <div className="mt-5 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] p-4"><p className="flex items-center gap-2 text-sm font-bold text-[#6F5732]"><Paperclip size={17} />Załączniki ({email.attachment_metadata.length})</p><p className="mt-2 text-xs leading-relaxed text-[#7C6848]">Dla bezpieczeństwa widoczna jest tylko informacja o załącznikach. Pobieranie włączymy po dodaniu skanowania i kontroli typu pliku.</p><ul className="mt-2 list-inside list-disc text-xs text-[#6F5732]">{email.attachment_metadata.map((item) => <li key={item.id}>{item.filename || "Załącznik"} ({item.content_type})</li>)}</ul></div>}<div className="mt-6 whitespace-pre-wrap break-words rounded-2xl bg-[#F8F5F0] p-5 text-[15px] leading-7 text-gray-700">{email.body_text || "Ta wiadomość nie zawiera czytelnej treści tekstowej."}</div><p className="mt-5 text-xs leading-5 text-gray-500">Kopia w panelu jest pomocnicza i ma 90-dniowy okres retencji. Oryginalna poczta pozostaje na koncie OVH/Roundcube.</p></article>;
}

function SetupNotice() { return <div className="mt-6 rounded-3xl border border-[#E8D6B8] bg-[#FFF9EE] p-6 text-[#6F5732]"><h2 className="font-bold">Skrzynka czeka na jednorazowe uruchomienie</h2><p className="mt-2 text-sm">Najpierw uruchomimy przygotowaną migrację w Supabase, a następnie dodamy bezpieczny webhook Resend. Panel i pozostałe funkcje działają normalnie.</p></div>; }
function ErrorNotice() { return <div className="mt-6 rounded-3xl border border-[#E4CFCF] bg-[#FFF7F7] p-6 text-[#8D4747]">Skrzynka jest chwilowo niedostępna. Spróbuj ponownie za moment.</div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Warsaw" }).format(new Date(value)); }
