import { connection } from "next/server";
import { CheckCircle2, CircleDot, Clock3, MailCheck, UserRound } from "lucide-react";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import { getMemberUserDirectory, type MemberUserEntry } from "../services/memberUserService";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPatientVaultState } from "../server/patientVault";
import PatientVaultGate from "../patients/PatientVaultGate";

export default async function PanelUsersPage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/users" /></Dashboard></AuthGuard>;

  let entries: MemberUserEntry[] = [];
  let presenceAvailable = false;
  let loadError = false;

  try {
    const directory = await getMemberUserDirectory();
    entries = directory.entries;
    presenceAvailable = directory.presenceAvailable;
  } catch {
    loadError = true;
  }

  const registeredMembers = entries.filter((entry) => entry.role === "patient" || entry.role === "parent").length;
  const signedInMembers = entries.filter((entry) => entry.role !== "psychologist" && entry.hasLoggedIn).length;
  const onlineMembers = entries.filter((entry) => entry.role !== "psychologist" && entry.online).length;

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-7xl">
          <header className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Bezpieczny katalog kont</p>
            <h1 className="mt-1 text-3xl font-bold text-[#2D4739]">Użytkownicy</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">Rejestracje, potwierdzenie adresu, ostatnie logowanie i obecność w prywatnym pokoju. Dane są dostępne wyłącznie w panelu psychologa.</p>
          </header>

          {loadError ? (
            <div className="mt-6 rounded-3xl border border-[#E8D6B8] bg-[#FFF9EE] p-6 text-[#6F5732]">Lista użytkowników jest chwilowo niedostępna. Spróbuj ponownie za moment.</div>
          ) : (
            <>
              <section className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatCard icon={UserRound} label="Zarejestrowani" value={registeredMembers} />
                <StatCard icon={CheckCircle2} label="Logowali się" value={signedInMembers} />
                <StatCard icon={CircleDot} label="Online teraz" value={presenceAvailable ? onlineMembers : "—"} online />
              </section>

              {!presenceAvailable && (
                <p className="mt-5 rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] px-5 py-4 text-sm text-[#6F5732]">Lista kont i ostatnie logowania działają. Status „online teraz” pojawi się po jednorazowym uruchomieniu migracji obecności w Supabase.</p>
              )}

              <section className="mt-6 space-y-3">
                {entries.length === 0 ? (
                  <div className="rounded-3xl border border-[#E5E1D8] bg-white p-8 text-center text-gray-600">Nie ma jeszcze zarejestrowanych kont.</div>
                ) : entries.map((entry) => <UserCard key={entry.id} entry={entry} />)}
              </section>
            </>
          )}
        </div>
      </Dashboard>
    </AuthGuard>
  );
}

function StatCard({ icon: Icon, label, value, online = false }: { icon: typeof UserRound; label: string; value: number | string; online?: boolean }) {
  return (
    <article className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm">
      <span className={`inline-flex rounded-2xl p-3 ${online ? "bg-[#EEF7EC] text-[#4D7A50]" : "bg-[#EEF1EB] text-[#6D7A62]"}`}><Icon size={21} aria-hidden="true" /></span>
      <p className="mt-4 text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[#2D4739]">{value}</p>
    </article>
  );
}

function UserCard({ entry }: { entry: MemberUserEntry }) {
  return (
    <article className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="break-words text-lg font-bold text-[#2D4739]">{entry.displayName}</h2>
            <span className="rounded-full bg-[#EEF1EB] px-3 py-1 text-xs font-semibold text-[#5E6C57]">{roleLabel(entry.role)}</span>
            {entry.online && <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6E8] px-3 py-1 text-xs font-semibold text-[#3F7044]"><CircleDot size={13} aria-hidden="true" />online</span>}
          </div>
          <p className="mt-2 break-all text-sm text-gray-600">{entry.email ?? "Brak adresu e-mail"}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${entry.emailConfirmed ? "bg-[#EEF7EC] text-[#47704B]" : "bg-[#FFF3DF] text-[#8A641F]"}`}><MailCheck size={13} aria-hidden="true" />{entry.emailConfirmed ? "E-mail potwierdzony" : "Czeka na potwierdzenie"}</span>
        </div>
      </div>
      <div className="mt-4 grid gap-3 rounded-2xl bg-[#F8F5F0] p-4 text-sm text-gray-600 sm:grid-cols-3">
        <Info label="Rejestracja" value={formatDate(entry.createdAt)} />
        <Info label="Ostatnie logowanie" value={entry.lastSignInAt ? formatDate(entry.lastSignInAt) : "Jeszcze nie"} />
        <Info label="Ostatnia aktywność" value={entry.lastSeenAt ? formatDate(entry.lastSeenAt) : "Brak sygnału"} icon />
      </div>
    </article>
  );
}

function Info({ label, value, icon = false }: { label: string; value: string; icon?: boolean }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-[#87917F]">{label}</p><p className="mt-1 flex items-center gap-1.5 font-medium text-[#2D4739]">{icon && <Clock3 size={14} aria-hidden="true" />}{value}</p></div>;
}

function roleLabel(role: MemberUserEntry["role"]) {
  if (role === "psychologist") return "Psycholog";
  if (role === "parent") return "Rodzic";
  if (role === "patient") return "Pacjent";
  return "Brak profilu";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(new Date(value));
}
