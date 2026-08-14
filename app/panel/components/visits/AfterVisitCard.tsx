"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, Download, ExternalLink, MapPin, Printer, ShieldCheck, Smartphone, Sparkles, UserRound, UsersRound } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import PsycholkaWidget from "../PsychOLKAWidget";

type Audience = "patient" | "parent";

type VisitCardData = {
  id: number;
  name: string;
  visitDate: string;
  visitTime: string;
  locationName: string;
  locationAddress: string | null;
};

type NextVisitData = {
  visitDate: string;
  visitTime: string;
  locationName: string;
};

export default function AfterVisitCard({ visit, nextVisit }: { visit: VisitCardData; nextVisit: NextVisitData | null }) {
  const [audience, setAudience] = useState<Audience>("patient");
  const [personalMessage, setPersonalMessage] = useState("Dziękuję za dzisiejsze spotkanie. Zadbaj o spokojny czas dla siebie i wracaj do naszych ustaleń we własnym tempie.");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const audienceLabel = audience === "parent" ? "rodzica pacjenta" : "pacjenta";
  const firstName = useMemo(() => visit.name.trim().split(/\s+/)[0] || "", [visit.name]);
  const registerUrl = useMemo(() => {
    const url = new URL("/register", "https://aleksandrawejer.pl");
    url.searchParams.set("role", audience);
    url.searchParams.set("source", "after-visit-card");
    return url.toString();
  }, [audience]);

  useEffect(() => {
    QRCode.toDataURL(registerUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 360,
      color: { dark: "#2D4739", light: "#FFFFFF" },
    }).then(setQrCode).catch(() => setQrCode(null));
  }, [registerUrl]);

  return (
    <main className="after-visit-root min-h-screen bg-[#F3F0EA] px-4 py-6 text-[#2D4739] sm:px-6 sm:py-10">
      <div className="after-visit-screen-only mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 shadow-sm">
        <Link href="/panel/visits" className="inline-flex min-h-11 items-center rounded-xl border border-[#D5DCCF] px-4 py-2 text-sm font-semibold">← Wróć do wizyt</Link>
        <div className="flex flex-wrap gap-2">
          <a href="/karta-po-spotkaniu-przyklad.pdf" download className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2 text-sm font-semibold"><Download size={17} />Pobierz przykładowy PDF</a>
          <button type="button" onClick={() => setAudience("patient")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${audience === "patient" ? "bg-[#2D4739] text-white" : "bg-[#EEF1EB]"}`}><UserRound size={17} />Dla pacjenta</button>
          <button type="button" onClick={() => setAudience("parent")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${audience === "parent" ? "bg-[#2D4739] text-white" : "bg-[#EEF1EB]"}`}><UsersRound size={17} />Dla rodzica</button>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2 text-sm font-semibold text-white"><Printer size={17} />Drukuj kartę</button>
        </div>
      </div>
      <section className="after-visit-screen-only mx-auto mb-5 max-w-[210mm] rounded-2xl border border-[#D5DCCF] bg-white p-4 shadow-sm">
        <label className="text-sm font-semibold text-[#2D4739]">Wiadomość od Aleksandry na wydruku
          <textarea value={personalMessage} onChange={(event) => setPersonalMessage(event.target.value)} maxLength={280} rows={3} className="mt-2 w-full resize-y rounded-xl border border-[#D5DCCF] bg-[#F8F5F0] p-3 text-sm font-normal leading-6 outline-none focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
        </label>
        <p className="mt-2 text-xs text-gray-500">Możesz zmienić tekst przed drukiem. Nie wpisuj tutaj diagnozy ani poufnych notatek klinicznych.</p>
      </section>

      <article className="after-visit-print-page mx-auto w-full max-w-[210mm] overflow-hidden rounded-[28px] border border-[#D5DCCF] bg-white shadow-[0_24px_70px_rgba(45,71,57,0.12)]">
        <header className="relative overflow-hidden bg-[#294D3D] px-8 py-7 text-white sm:px-12 sm:py-9">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#DDE6D7]">Aleksandra Wejer · psycholog</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Dziękuję za spotkanie</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#E8EEE5]">{firstName ? `${firstName}, ` : ""}ta karta pomoże spokojnie przejść do kolejnego kroku.</p>
            </div>
            <PsycholkaWidget context="after_visit" action="wave" fallbackAction="greeting" className="after-visit-psycholka shrink-0" />
          </div>
        </header>

        <div className="grid gap-7 px-8 py-8 sm:px-12 sm:py-10 lg:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E5E1D8] bg-[#F8F5F0] p-6">
              <div className="flex items-center gap-3"><span className="rounded-2xl bg-white p-3 text-[#6D7A62]"><CalendarDays size={22} /></span><div><p className="text-xs uppercase tracking-[0.14em] text-gray-500">Odbyte spotkanie</p><h2 className="font-bold">{formatDate(visit.visitDate)} · {visit.visitTime}</h2></div></div>
              <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-gray-600"><MapPin size={18} className="mt-0.5 shrink-0 text-[#6D7A62]" /><p><strong className="block text-[#2D4739]">{visit.locationName}</strong>{visit.locationAddress ?? "Adres gabinetu został potwierdzony przy rezerwacji."}</p></div>
              {nextVisit && <div className="mt-5 rounded-2xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Następny termin</p><p className="mt-1 font-bold">{formatDate(nextVisit.visitDate)} · {nextVisit.visitTime}</p><p className="mt-1 text-sm text-gray-600">{nextVisit.locationName}</p></div>}
            </section>

            <section>
              <div className="flex items-center gap-3"><Sparkles size={21} className="text-[#B7791F]" /><h2 className="text-xl font-bold">Twój prywatny pokój PsychOLKI</h2></div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Po utworzeniu konta {audienceLabel} znajdziesz tam spokojne, prywatne miejsce związane z wizytami.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {["Terminy i przypomnienia", "Prośba o zmianę wizyty", "Materiały od Aleksandry", audience === "parent" ? "Pokój rodzica i dziecka" : "Ćwiczenia i spokojne wsparcie"].map((item) => <li key={item} className="flex items-start gap-2 rounded-2xl bg-[#EEF1EB] px-4 py-3 text-sm font-semibold"><Check size={17} className="mt-0.5 shrink-0" />{item}</li>)}
              </ul>
            </section>
            {personalMessage.trim() && <section className="rounded-3xl border border-[#D5DCCF] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D7A62]">Kilka słów od Aleksandry</p><p className="mt-3 text-sm italic leading-6 text-gray-700">„{personalMessage.trim()}”</p></section>}
          </div>

          <aside className="rounded-3xl border border-[#D5DCCF] p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6D7A62]">Konto {audience === "parent" ? "rodzica" : "pacjenta"}</p>
            <h2 className="mt-2 text-2xl font-bold">Zeskanuj aparatem</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Kod otworzy bezpieczną rejestrację na aleksandrawejer.pl.</p>
            <div className="mx-auto mt-5 grid aspect-square w-52 place-items-center rounded-3xl border border-[#E5E1D8] bg-white p-3">
              {qrCode ? <Image src={qrCode} width={360} height={360} unoptimized alt={`Kod QR do rejestracji konta ${audienceLabel}`} className="h-full w-full" /> : <span className="text-sm text-gray-500">Przygotowywanie kodu…</span>}
            </div>
            <p className="mt-4 break-all text-xs font-semibold text-[#2D4739]">aleksandrawejer.pl/register</p>
            <a href={registerUrl} target="_blank" rel="noreferrer" className="after-visit-screen-only mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2 text-sm font-semibold text-white">Otwórz rejestrację <ExternalLink size={16} /></a>
            <div className="mt-5 rounded-2xl bg-[#294D3D] p-4 text-left text-white"><div className="flex items-center gap-2 font-bold"><Smartphone size={19} />PsychOLKA w telefonie</div><p className="mt-2 text-xs leading-5 text-[#E8EEE5]">Załóż konto już teraz. Aplikacja jest w przygotowaniu, a Twoje konto będzie gotowym początkiem prywatnego pokoju.</p></div>
            <div className="mt-6 flex items-start gap-2 rounded-2xl bg-[#F8F5F0] p-4 text-left text-xs leading-5 text-gray-600"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#6D7A62]" /><p>Po rejestracji gabinet bezpiecznie połączy konto z właściwą kartą. Żaden inny pacjent nie zobaczy tych danych.</p></div>
          </aside>
        </div>

        <footer className="border-t border-[#E5E1D8] px-8 py-5 text-center text-[11px] leading-5 text-gray-500 sm:px-12">Karta ma charakter organizacyjny i nie jest dokumentacją medyczną ani zaświadczeniem. Nie zawiera notatek ze spotkania.</footer>
      </article>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}
