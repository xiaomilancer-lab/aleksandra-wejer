import { weekDays } from "./constants/weekDays";
import CalendarDay from "./CalendarDay";
import {
  generateMonthDays,
  getFirstDayOfMonth,
} from "./monthHelpers";

interface CalendarGridProps {
  selectedDay: number | null;
  setSelectedDay: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}

export default function CalendarGrid({
  selectedDay,
  setSelectedDay,
}: CalendarGridProps) {
  const days = generateMonthDays(2026, 6);
  const firstDay = getFirstDayOfMonth(2026, 6);

  return (
    <>
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="rounded-xl bg-[#F8F5F0] py-3 text-center font-semibold text-[#2D4739]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-3">
       {Array.from({ length: firstDay }).map((_, index) => (
  <div key={`empty-${index}`} />
))}
        {days.map((day) => (
          <CalendarDay
  key={day}
  day={day}
  selected={selectedDay === day}
  onClick={() => setSelectedDay(day)}
/>
        ))}
      </div>
    </>
  );
}