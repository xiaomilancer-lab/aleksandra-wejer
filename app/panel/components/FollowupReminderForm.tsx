"use client";

import { Plus, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { createFollowupReminderAction } from "../actions/followupReminderActions";

interface FollowupReminderFormProps {
  patientId: string;
  visitId?: number | null;
  onSaved?: () => void;
}

export default function FollowupReminderForm({ patientId, visitId, onSaved }: FollowupReminderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveReminder() {
    setError(null);
    startTransition(async () => {
      try {
        await createFollowupReminderAction({ patientId, visitId, title, description });
        setTitle("");
        setDescription("");
        setIsOpen(false);
        onSaved?.();
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Nie udało się zapisać przypomnienia.");
      }
    });
  }

  if (!isOpen) {
    return <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-3 py-2 text-sm font-semibold text-[#2D4739] transition hover:bg-[#EEF1EB]"><Plus size={16} aria-hidden="true" />Dodaj Follow-up</button>;
  }

  return <div className="rounded-2xl border border-[#D5DCCF] bg-[#EEF1EB] p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">Follow-up na następną wizytę</p><p className="mt-1 text-xs text-[#55624D]">Prywatne przypomnienie dla psychologa.</p></div><button type="button" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-[#55624D] hover:text-[#2D4739]">Anuluj</button></div><label className="mt-4 block text-sm font-medium text-[#2D4739]">Temat<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Np. Zapytaj o sen" className="mt-1.5 w-full rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6D7A62] focus:ring-2 focus:ring-[#DDE5D8]" /></label><label className="mt-3 block text-sm font-medium text-[#2D4739]">Opis <span className="font-normal text-gray-500">(opcjonalnie)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Krótki kontekst, do którego warto wrócić." rows={3} className="mt-1.5 w-full resize-y rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6D7A62] focus:ring-2 focus:ring-[#DDE5D8]" /></label>{error && <p className="mt-3 rounded-xl bg-[#FFF9EE] px-3 py-2 text-sm text-[#7A6540]">{error}</p>}<button type="button" onClick={saveReminder} disabled={isPending || !title.trim()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F] disabled:bg-gray-400"><Save size={16} aria-hidden="true" />{isPending ? "Zapisywanie..." : "Zapisz Follow-up"}</button><p className="mt-3 text-xs text-gray-500">TODO: w przyszłości AI może jedynie zaproponować utworzenie przypomnienia na podstawie notatki psychologa.</p></div>;
}
