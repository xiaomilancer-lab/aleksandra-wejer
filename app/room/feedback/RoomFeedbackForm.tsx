"use client";

import { ExternalLink, Heart, Send, Star } from "lucide-react";
import { useActionState, useState } from "react";
import { REVIEW_LOCATIONS, type ReviewLocationId, isReviewLocationId } from "@/app/review/reviewLocations";
import { submitRoomFeedbackAction, type RoomFeedbackState } from "./actions";

const initialState: RoomFeedbackState = { kind: "idle", message: "" };

export default function RoomFeedbackForm({ suggestedLocationId, canSendPrivate }: { suggestedLocationId: string | null; canSendPrivate: boolean }) {
  const initialLocation = isReviewLocationId(suggestedLocationId) ? suggestedLocationId : "arthro-cure-clinic";
  const [locationId, setLocationId] = useState<ReviewLocationId>(initialLocation);
  const [state, formAction, pending] = useActionState(submitRoomFeedbackAction, initialState);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
        <span className="inline-flex rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Heart size={24} aria-hidden="true" /></span>
        <h2 className="mt-4 text-2xl font-bold">Prywatnie do Aleksandry</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">Napisz spokojnie, co było pomocne albo co warto zmienić. Ta wiadomość nie będzie publiczna.</p>
        {canSendPrivate ? (
          <form action={formAction} className="mt-5 space-y-3">
            <label className="block text-sm font-semibold">Twoja wiadomość
              <textarea name="feedback" required minLength={3} maxLength={1200} rows={7} disabled={pending || state.kind === "success"} className="mt-2 w-full rounded-2xl border border-[#E5E1D8] px-4 py-3 font-normal outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" placeholder="Wiadomość tylko dla Aleksandry..." />
            </label>
            <button type="submit" disabled={pending || state.kind === "success"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-semibold text-white disabled:opacity-50"><Send size={17} aria-hidden="true" />{pending ? "Wysyłanie..." : "Wyślij prywatnie"}</button>
            {state.message && <p className={`text-sm ${state.kind === "error" ? "text-[#A35D3A]" : "font-semibold text-[#2D4739]"}`} role="status">{state.message}</p>}
          </form>
        ) : (
          <p className="mt-5 rounded-2xl bg-[#FFF9EE] p-4 text-sm text-[#6F5732]">Prywatna wiadomość będzie dostępna po bezpiecznym połączeniu konta z kartą pacjenta.</p>
        )}
      </section>

      <section className="rounded-3xl border border-[#E8D6B8] bg-[#FFF9EE] p-6 shadow-sm">
        <span className="inline-flex rounded-2xl bg-white p-3 text-[#B7791F]"><Star size={24} aria-hidden="true" /></span>
        <h2 className="mt-4 text-2xl font-bold">Publiczna opinia Google</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">Jeżeli masz ochotę, możesz pomóc innym znaleźć właściwe wsparcie. To dobrowolne i niezależne od prywatnej wiadomości.</p>
        <label className="mt-5 block text-sm font-semibold">Wybierz gabinet
          <select value={locationId} onChange={(event) => setLocationId(event.target.value as ReviewLocationId)} className="mt-2 w-full rounded-2xl border border-[#D9C69F] bg-white px-4 py-3 font-normal">
            {Object.entries(REVIEW_LOCATIONS).map(([id, location]) => <option key={id} value={id}>{location.label}</option>)}
          </select>
        </label>
        <a href={REVIEW_LOCATIONS[locationId].reviewUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B7791F] px-4 py-3 font-semibold text-white"><ExternalLink size={17} aria-hidden="true" />Otwórz opinie Google</a>
      </section>
    </div>
  );
}
