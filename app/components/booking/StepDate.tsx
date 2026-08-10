"use client";

import { useState } from "react";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";

interface StepDateProps { selectedDate: string | null; setSelectedDate: (date: string) => void; locationId: string; }
export default function StepDate({ selectedDate, setSelectedDate, locationId }: StepDateProps) {
  const today = new Date(); const [currentMonth, setCurrentMonth] = useState(today.getMonth()); const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((year) => year + 1); } else setCurrentMonth((month) => month + 1); };
  const previousMonth = () => { if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) return; if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((year) => year - 1); } else setCurrentMonth((month) => month - 1); };
  const canGoPrevious = currentMonth !== today.getMonth() || currentYear !== today.getFullYear();
  return <div id="step-date" className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-[#2D4739]">Wybierz termin wizyty</h2><p className="mt-2 text-gray-600">Kliknij dzień, który ma dostępne godziny wizyt.</p><div className="mt-6 sm:mt-8"><CalendarHeader month={currentMonth} year={currentYear} onPrevious={previousMonth} onNext={nextMonth} canGoPrevious={canGoPrevious} /><CalendarGrid selectedDate={selectedDate} setSelectedDate={setSelectedDate} currentMonth={currentMonth} currentYear={currentYear} locationId={locationId} /></div></div>;
}
