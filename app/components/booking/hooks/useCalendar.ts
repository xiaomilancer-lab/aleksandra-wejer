import { useState } from "react";

export default function useCalendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  return {
    today,

    currentMonth,
    currentYear,

    setCurrentMonth,
    setCurrentYear,

    selectedDate,
    setSelectedDate,
  };
}