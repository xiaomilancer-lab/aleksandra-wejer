import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Mail, MapPin, Phone, ShieldCheck, UsersRound } from "lucide-react";
import type { LocalArea } from "@/app/lib/localAreas";
import { localAreas } from "@/app/lib/localAreas";

const offices = [
  {
    name: "Arthro Cure Clinic",
    city: "Starogard Gdański",
    address: "Al. Jana Pawła II 1/U9",
  },
  {
    name: "Centrum Medyczno-Estetyczne Zielińscy Premium",
    city: "Nowa Wieś Rzeczna",
    address: "ul. Kasztanowa 1",
  },
] as const;

export default function LocalAreaPage({ area }: { area: LocalArea }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Konsultacje psychologiczne dla mieszkańców ${area.name}`,
    description: area.intro,
    url: `https://aleksandrawejer.pl/${area.slug}`,
    areaServed: { "@type": "AdministrativeArea", name: area.name },
    provider: {
      "@type": "ProfessionalService",
      "@id": "https://aleksandrawejer.pl/#professional-service",
      name: "Aleksandra Wejer – Psycholog",
      telephone: "+48510777469",
      email: "psycholog@aleksandrawejer.pl",
      url: "https://aleksandrawejer.pl",
    },
    availableAtOrFrom: offices.map((office) => ({
      "@type": "Place",
      name: office.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.address,
        addressLocality: office.city,
        addressCountry: "PL",
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://aleksandrawejer.pl" },
      { "@type": "ListItem", position: 2, name: `Psycholog ${area.name}`, item: `https://aleksandrawejer.pl/${area.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#2D4739]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="border-b border-[#E5E1D8] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="font-bold">Aleksandra Wejer <span className="font-normal text-[#6D7A62]">· psycholog</span></Link>
          <Link href="/#kalendarz" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 font-semibold text-white"><CalendarDays size={18} aria-hidden="true" />Umów wizytę</Link>
        </div>
      </header>

      <section className="px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-5xl">
          <nav className="text-sm text-gray-500" aria-label="Okruszki"><Link href="/" className="hover:text-[#2D4739]">Strona główna</Link><span aria-hidden="true"> / </span><span>Psycholog {area.name}</span></nav>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-[#6D7A62]">Wsparcie w rejonie Starogardu Gdańskiego</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Psycholog dla mieszkańców {area.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">{area.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#kalendarz" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 font-bold text-white"><CalendarDays size={19} aria-hidden="true" />Sprawdź wolne terminy</Link>
            <a href="tel:+48510777469" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#6D7A62] bg-white px-5 py-3 font-bold"><Phone size={19} aria-hidden="true" />Zadzwoń: 510 777 469</a>
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {offices.map((office) => (
            <article key={office.name} className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
              <MapPin className="text-[#6D7A62]" size={25} aria-hidden="true" />
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#6D7A62]">Rzeczywista lokalizacja spotkań</p>
              <h2 className="mt-2 text-2xl font-bold">{office.name}</h2>
              <p className="mt-3 leading-7 text-gray-600">{office.address}<br />{office.city}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6D7A62]">Przed pierwszym spotkaniem</p>
            <h2 className="mt-3 text-3xl font-bold">Najważniejsze informacje w jednym miejscu</h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-gray-600">
              <p>{area.travelTip}</p>
              <p>{area.decisionTip}</p>
              <p>Konsultacje są poufne. Standardowe spotkanie trwa około 50 minut, a pierwsza rozmowa nie zobowiązuje do kontynuowania kolejnych wizyt.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <InfoCard icon={<UsersRound size={22} aria-hidden="true" />} title="Dla kogo?" text="Dzieci, młodzież, osoby dorosłe, pary oraz rodziny." />
            <InfoCard icon={<Clock3 size={22} aria-hidden="true" />} title="Jak długo?" text="Standardowa konsultacja trwa około 50 minut." />
            <InfoCard icon={<ShieldCheck size={22} aria-hidden="true" />} title="Czy poufnie?" text="Spotkania są objęte tajemnicą zawodową psychologa." />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#DCE4D8] bg-[#EEF3EB] p-7 sm:p-10">
          <h2 className="text-3xl font-bold">Jak umówić konsultację z {area.name}?</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <Step number="1" text="Wybierz jeden z dwóch gabinetów." />
            <Step number="2" text="Sprawdź dostępny dzień i godzinę." />
            <Step number="3" text="Podaj dane kontaktowe i potwierdź." />
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#kalendarz" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2D4739] px-5 py-3 font-bold text-white">Przejdź do kalendarza <ArrowRight size={18} aria-hidden="true" /></Link>
            <a href="mailto:psycholog@aleksandrawejer.pl" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#AFC0AA] bg-white px-5 py-3 font-bold"><Mail size={18} aria-hidden="true" />Napisz wiadomość</a>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E1D8] bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold">Pomoc psychologiczna także dla osób z okolicy</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {localAreas.filter((item) => item.slug !== area.slug).map((item) => (
              <Link key={item.slug} href={`/${item.slug}`} className="rounded-full border border-[#D8DDD4] px-4 py-2 text-sm font-semibold hover:bg-[#F8F5F0]">{item.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-[#E5E1D8] bg-[#FCFBF8] p-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EEE5] text-[#6D7A62]">{icon}</div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-600">{text}</p></div>;
}

function Step({ number, text }: { number: string; text: string }) {
  return <li className="rounded-2xl bg-white p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6D7A62] font-bold text-white">{number}</span><p className="mt-4 font-semibold leading-6">{text}</p></li>;
}
