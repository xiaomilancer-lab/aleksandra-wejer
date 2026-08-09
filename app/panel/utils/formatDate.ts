export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
