"use client";

import { CalendarClock, XCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { requestAppointmentChangeAction, type ChangeRequestState } from "./actions";

const initialState: ChangeRequestState = { kind: "idle", message: "" };

export default function ChangeRequestForm({ bookingId }: { bookingId: number }) {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<"reschedule" | "cancel">("reschedule");
  const action = requestAppointmentChangeAction.bind(null, bookingId);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (!open) return <button type="button" onClick={() => setOpen(true)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#CBD3C6] px-4 py-2 text-sm font-semibold"><CalendarClock size={17} aria-hidden="true" />Poproś o zmianę</button>;

  return (
    <form action={formAction} className="mt-4 space-y-3 rounded-2xl bg-[#F8F5F0] p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => setRequestType("reschedule")} className={`rounded-xl border p-3 text-left text-sm font-semibold ${requestType === "reschedule" ? "border-[#6D7A62] bg-white" : "border-transparent"}`}><CalendarClock className="mb-2" size={18} aria-hidden="true" />Przełożenie</button>
        <button type="button" onClick={() => setRequestType("cancel")} className={`rounded-xl border p-3 text-left text-sm font-semibold ${requestType === "cancel" ? "border-[#A35D3A] bg-white" : "border-transparent"}`}><XCircle className="mb-2" size={18} aria-hidden="true" />Odwołanie</button>
      </div>
      <input type="hidden" name="requestType" value={requestType} />
      {requestType === "reschedule" && <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Proponowana data<input type="date" name="requestedDate" required className="mt-1 w-full rounded-xl border border-[#D8DDD4] bg-white px-3 py-2 font-normal" /></label><label className="text-sm font-semibold">Godzina<input type="time" name="requestedTime" required className="mt-1 w-full rounded-xl border border-[#D8DDD4] bg-white px-3 py-2 font-normal" /></label></div>}
      <label className="block text-sm font-semibold">Krótka wiadomość (opcjonalnie)<textarea name="message" maxLength={1000} rows={3} className="mt-1 w-full rounded-xl border border-[#D8DDD4] bg-white px-3 py-2 font-normal" placeholder="Np. które dni będą wygodniejsze..." /></label>
      <div className="flex flex-wrap gap-2"><button type="submit" disabled={pending || state.kind === "success"} className="min-h-11 rounded-xl bg-[#6D7A62] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Wysyłanie..." : "Wyślij prośbę"}</button><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl px-4 py-2 text-sm font-semibold">Zamknij</button></div>
      {state.message && <p className={`text-sm ${state.kind === "error" ? "text-[#A35D3A]" : "font-semibold text-[#2D4739]"}`} role="status">{state.message}</p>}
    </form>
  );
}
