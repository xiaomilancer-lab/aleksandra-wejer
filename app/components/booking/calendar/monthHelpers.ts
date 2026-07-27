export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function generateMonthDays(
  year: number,
  month: number
) {
  const totalDays = getDaysInMonth(year, month);

  return Array.from(
    { length: totalDays },
    (_, index) => index + 1
  );
}
export function getFirstDayOfMonth(
  year: number,
  month: number
) {
  const day = new Date(year, month, 1).getDay();

  return day === 0 ? 6 : day - 1;
}