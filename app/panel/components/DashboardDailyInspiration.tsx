import { Coffee, Quote } from "lucide-react";
import { getPsycholkaDailyQuote } from "../psycholka/psycholkaEmotion";
import DashboardCard from "./DashboardCard";

const selfCareMessages = [
  "Pamiętaj: nie musisz zmienić całego świata. Dzisiaj wystarczy pomóc jednej osobie.",
  "Zostaw między spotkaniami chwilę na oddech.",
  "Twoja uważność jest już ważnym wsparciem.",
  "Nie każda odpowiedź musi pojawić się od razu.",
  "Daj sobie prawo do spokojnego tempa.",
  "Krótka przerwa też jest częścią dobrej pracy.",
  "Zadbaj dziś o jedną małą rzecz tylko dla siebie.",
  "Twoje granice pomagają Ci pomagać innym.",
  "Zatrzymaj się na chwilę przed kolejnym zadaniem.",
  "Wystarczy, że jesteś obecna.",
  "Nie musisz unieść wszystkiego sama.",
  "Łagodność wobec siebie ma znaczenie.",
  "Pamiętaj o wodzie i spokojnym oddechu.",
  "Po wymagającej rozmowie daj sobie minutę ciszy.",
  "Dobre spotkanie nie musi być idealne.",
  "Twoja praca jest procesem, nie wyścigiem.",
  "Dziś wybierz spokój zamiast pośpiechu.",
  "Jedna chwila uważności wystarczy, by wrócić do równowagi.",
  "Warto zauważyć także to, co już się udało.",
  "Masz prawo dbać o własną energię.",
];

function dailyIndex() {
  const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return [...key].reduce((sum, character) => sum + character.charCodeAt(0), 0) % selfCareMessages.length;
}

export default function DashboardDailyInspiration() {
  const index = dailyIndex();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardCard>
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Quote size={20} aria-hidden="true" /></span>
          <div><p className="text-sm text-gray-500">Zatrzymaj się na moment</p><h2 className="font-bold text-[#2D4739]">Cytat dnia</h2></div>
        </div>
        <blockquote className="mt-6 text-lg font-medium leading-relaxed text-[#2D4739]">„{getPsycholkaDailyQuote()}”</blockquote>
      </DashboardCard>
      <DashboardCard>
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-[#FFF4D9] p-3 text-[#B7791F]"><Coffee size={20} aria-hidden="true" /></span>
          <div><p className="text-sm text-gray-500">Mała troska o siebie</p><h2 className="font-bold text-[#2D4739]">Chwila dla Ciebie</h2></div>
        </div>
        <p className="mt-6 text-lg font-medium leading-relaxed text-[#2D4739]">{selfCareMessages[index]}</p>
      </DashboardCard>
    </div>
  );
}
