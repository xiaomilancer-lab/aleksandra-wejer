import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import type { Patient } from "../../domain";

interface PatientProfileHeaderProps {
  patient: Patient;
  createdAt: string;
}

export default function PatientProfileHeader({
  patient,
  createdAt,
}: PatientProfileHeaderProps) {
  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1EB] text-[#6D7A62]">
            <UserRound size={29} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">
              Workspace pacjenta
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#2D4739]">
              {patient.name}
            </h1>
          </div>
        </div>
        <span className="w-fit rounded-full bg-[#E7F3E8] px-3 py-1.5 text-sm font-semibold text-[#3E7C49]">
          Aktywny
        </span>
      </div>

      <div className="mt-8 grid gap-5 border-t border-[#EDEAE4] pt-6 sm:grid-cols-3">
        <ProfileDetail icon={Phone} label="Telefon" value={patient.phone ?? "Brak telefonu"} />
        <ProfileDetail icon={Mail} label="E-mail" value={patient.email ?? "Brak e-maila"} truncate />
        <ProfileDetail icon={CalendarDays} label="Data dodania" value={createdAt} />
      </div>
    </section>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
  truncate = false,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-[#6D7A62]" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`mt-1 font-medium text-[#2D4739] ${truncate ? "truncate" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
