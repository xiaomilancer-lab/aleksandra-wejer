import { CalendarPlus, Mail, MessageSquare, Star } from "lucide-react";

interface PatientActionsProps {
  email: string | null;
}

export default function PatientActions({ email }: PatientActionsProps) {
  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Szybkie akcje</p>
      <div className="mt-4 space-y-2">
        <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-[#E5E1D8] px-3.5 py-3 text-left text-sm font-semibold text-[#2D4739] hover:bg-[#F8F5F0]">
          <CalendarPlus size={17} className="text-[#6D7A62]" aria-hidden="true" />
          Umów wizytę
        </button>
        {email ? (
          <a href={`mailto:${email}`} className="flex w-full items-center gap-3 rounded-xl border border-[#E5E1D8] px-3.5 py-3 text-sm font-semibold text-[#2D4739] hover:bg-[#F8F5F0]">
            <Mail size={17} className="text-[#6D7A62]" aria-hidden="true" />
            Wyślij e-mail
          </a>
        ) : (
          <button type="button" disabled className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl border border-[#E5E1D8] px-3.5 py-3 text-left text-sm font-semibold text-gray-400">
            <Mail size={17} aria-hidden="true" />
            Wyślij e-mail
          </button>
        )}
        <button type="button" disabled className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl border border-[#E5E1D8] px-3.5 py-3 text-left text-sm font-semibold text-gray-400">
          <MessageSquare size={17} aria-hidden="true" />
          Wyślij SMS (wkrótce)
        </button>
        <button type="button" className="flex w-full items-center gap-3 rounded-xl border border-[#E5E1D8] px-3.5 py-3 text-left text-sm font-semibold text-[#2D4739] hover:bg-[#F8F5F0]">
          <Star size={17} className="text-[#6D7A62]" aria-hidden="true" />
          Poproś o opinię
        </button>
      </div>
    </section>
  );
}
