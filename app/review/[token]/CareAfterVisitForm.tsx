"use client";

import { ExternalLink, Heart, MessageCircle, Send, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { REVIEW_LOCATIONS, type ReviewLocationId, isReviewLocationId } from "../reviewLocations";
import { submitGoogleReviewAction, submitPrivateFeedbackAction } from "./actions";

type CareAfterVisitFormProps = {
  token: string;
  suggestedLocationId: string | null;
  suggestedLocationLabel: string | null;
};

export default function CareAfterVisitForm({ token, suggestedLocationId, suggestedLocationLabel }: CareAfterVisitFormProps) {
  const initialLocation = isReviewLocationId(suggestedLocationId) ? suggestedLocationId : "nowa-wies-rzeczna";
  const [locationId, setLocationId] = useState<ReviewLocationId>(initialLocation);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openGoogleReview() {
    const reviewUrl = REVIEW_LOCATIONS[locationId].reviewUrl;
    window.open(reviewUrl, "_blank", "noopener,noreferrer");
    startTransition(async () => {
      try {
        await submitGoogleReviewAction(token);
      } catch {
        // Otwarcie Google jest ważniejsze niż techniczny licznik kliknięcia.
      }
    });
  }

  function submitFeedback() {
    setError(null);
    startTransition(async () => {
      try {
        await submitPrivateFeedbackAction(token, feedback);
        setSent(true);
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Nie udało się wysłać wiadomości.");
      }
    });
  }

  if (sent) {
    return <Card><Heart className="text-[#BF4D4D]" size={30} aria-hidden="true" /><h1>Dziękujemy za wiadomość</h1><p>Twoja uwaga została przekazana prywatnie do gabinetu Aleksandry.</p></Card>;
  }

  return (
    <Card>
      <Heart className="text-[#BF4D4D]" size={30} aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-[#6D7A62]">Po spotkaniu</p>
        <h1 className="mt-1">Chcesz podzielić się opinią?</h1>
        <p className="mt-2">Możesz napisać prywatnie do Aleksandry lub niezależnie opublikować opinię w Google.</p>
      </div>

      <section className="rounded-2xl border border-[#E5E1D8] p-5">
        <MessageCircle className="text-[#6D7A62]" size={24} aria-hidden="true" />
        <h2 className="mt-3 text-xl font-bold">Prywatnie do Aleksandry</h2>
        <p className="mt-2 text-sm text-gray-600">Ta wiadomość nie będzie publiczna.</p>
        {!showFeedback ? (
          <button type="button" onClick={() => setShowFeedback(true)} className="mt-4 rounded-xl border border-[#CBD3C6] px-4 py-3 font-semibold">Napisz prywatną wiadomość</button>
        ) : (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-semibold">Twoja wiadomość
              <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} maxLength={1200} rows={5} disabled={isPending} className="mt-2 w-full rounded-xl border border-[#E5E1D8] px-4 py-3 font-normal outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" placeholder="Napisz, co chcesz przekazać Aleksandrze..." />
            </label>
            <button type="button" onClick={submitFeedback} disabled={isPending || !feedback.trim()} className="inline-flex items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} aria-hidden="true" />{isPending ? "Wysyłanie..." : "Wyślij prywatnie"}</button>
            {error && <p className="text-sm text-[#A35D3A]" role="alert">{error}</p>}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#E8D6B8] bg-[#FFF9EE] p-5">
        <Star className="text-[#B7791F]" size={24} aria-hidden="true" />
        <h2 className="mt-3 text-xl font-bold">Publiczna opinia Google</h2>
        <p className="mt-2 text-sm text-gray-600">Jeżeli masz ochotę, możesz pomóc innym znaleźć gabinet. Opinia jest całkowicie dobrowolna.</p>
        <label className="mt-4 block text-sm font-semibold">Wybierz miejsce spotkania
          <select value={locationId} onChange={(event) => setLocationId(event.target.value as ReviewLocationId)} className="mt-2 w-full rounded-xl border border-[#D9C69F] bg-white px-4 py-3 font-normal">
            {Object.entries(REVIEW_LOCATIONS).map(([id, location]) => <option key={id} value={id}>{location.label}</option>)}
          </select>
        </label>
        {suggestedLocationLabel && <p className="mt-2 text-xs text-[#7A6540]">Na podstawie ostatniej wizyty: {suggestedLocationLabel}</p>}
        <button type="button" onClick={openGoogleReview} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#B7791F] px-4 py-3 font-semibold text-white"><ExternalLink size={17} aria-hidden="true" />Otwórz opinie Google</button>
      </section>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-screen max-w-2xl items-center p-5"><section className="w-full space-y-5 rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.08)] sm:p-8">{children}</section></main>;
}
