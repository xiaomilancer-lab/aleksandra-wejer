import { weekDays } from "./constants/weekDays";
import CalendarDay from "./CalendarDay";
import { generateMonthDays, getFirstDayOfMonth } from "./monthHelpers";

interface CalendarGridProps { selectedDate: string | null; setSelectedDate: (date: string) => void; currentMonth: number; currentYear: number; }

export default function CalendarGrid({ selectedDate, setSelectedDate, currentMonth, currentYear }: CalendarGridProps) {
  const days = generateMonthDays(currentYear, currentMonth); const firstDay = getFirstDayOfMonth(currentYear, currentMonth); const today = new Date(); today.setHours(0, 0, 0, 0);
  return <><div className="grid grid-cols-7 gap-3">{weekDays.map((day) => <div key={day} className="rounded-xl bg-[#F8F5F0] py-3 text-center font-semibold text-[#2D4739]">{day}</div>)}</div><div className="mt-3 grid grid-cols-7 gap-3">{Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}{days.map((day) => { const value = new Date(currentYear, currentMonth, day); value.setHours(0, 0, 0, 0); const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; return <CalendarDay key={day} day={day} available={value >= today} selected={selectedDate === date} onClick={() => value >= today && setSelectedDate(date)} />; })}</div></>;
}
