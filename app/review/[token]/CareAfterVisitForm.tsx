"use client";

import { Heart, MessageCircle, Send, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { submitGoogleReviewAction, submitPrivateFeedbackAction } from "./actions";

type CareAfterVisitFormProps = {
  token: string;
  googleReviewUrl: string | null;
};

export default function CareAfterVisitForm({ token, googleReviewUrl }: CareAfterVisitFormProps) {
  const [step, setStep] = useState<"choice" | "thanks" | "feedback" | "sent">("choice");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function chooseGoogle() {
    setError(null);
    startTransition(async () => {
      try {
        await submitGoogleReviewAction(token);
        setStep("thanks");
      } catch {
        setError("Nie udało się zapisać odpowiedzi. Spróbuj ponownie za chwilę.");
      }
    });
  }

  function submitFeedback() {
    setError(null);
    startTransition(async () => {
      try {
        await submitPrivateFeedbackAction(token, feedback);
        setStep("sent");
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Nie udało się wysłać uwagi.");
      }
    });
  }

  if (step === "thanks") {
    return <Card><Star className="text-[#B7791F]" size={28} aria-hidden="true" /><h1>Dziękujemy za Twoją opinię</h1><p>Twoje słowa pomagają innym łatwiej trafić do właściwego wsparcia.</p>{googleReviewUrl ? <a href={googleReviewUrl} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-semibold text-white transition hover:bg-[#58644F]"><Star size={17} aria-hidden="true" />Dodaj opinię Google</a> : <p className="rounded-xl bg-[#FFF9EE] p-4 text-sm text-[#7A6540]">Link do opinii Google zostanie udostępniony wkrótce.</p>}</Card>;
  }

  if (step === "feedback") {
    return <Card><MessageCircle className="text-[#6D7A62]" size={28} aria-hidden="true" /><h1>Co możemy zrobić lepiej?</h1><p>Twoja wiadomość trafi prywatnie do gabinetu.</p><label className="text-sm font-semibold text-[#2D4739]">Twoja uwaga<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} rows={6} disabled={isPending} className="mt-2 w-full rounded-xl border border-[#E5E1D8] px-4 py-3 font-normal outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" placeholder="Napisz, co chciałabyś lub chciałbyś nam przekazać..." /></label><button type="button" onClick={submitFeedback} disabled={isPending} className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-semibold text-white transition hover:bg-[#58644F] disabled:cursor-not-allowed"> <Send size={17} aria-hidden="true" />{isPending ? "Wysyłanie..." : "Wyślij"}</button>{error && <p className="text-sm text-[#A35D3A]">{error}</p>}</Card>;
  }

  if (step === "sent") return <Card><Heart className="text-[#BF4D4D]" size={28} aria-hidden="true" /><h1>Dziękujemy za wiadomość</h1><p>Twoja uwaga została przekazana prywatnie do gabinetu.</p></Card>;

  return <Card><Heart className="text-[#BF4D4D]" size={28} aria-hidden="true" /><h1>Jak oceniasz dzisiejszą wizytę?</h1><p>Twoja odpowiedź pomoże nam lepiej zadbać o doświadczenie pacjentów.</p><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={chooseGoogle} disabled={isPending} className="rounded-2xl bg-[#EEF1EB] p-5 text-left font-semibold text-[#2D4739] transition hover:bg-[#DDE6D7] disabled:cursor-not-allowed">😊 Tak</button><button type="button" onClick={() => setStep("feedback")} disabled={isPending} className="rounded-2xl border border-[#E5E1D8] p-5 text-left font-semibold text-[#2D4739] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed">💬 Mam uwagi</button></div>{error && <p className="text-sm text-[#A35D3A]">{error}</p>}</Card>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-screen max-w-xl items-center p-5"><section className="w-full space-y-5 rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.08)] sm:p-8">{children}</section></main>;
}
