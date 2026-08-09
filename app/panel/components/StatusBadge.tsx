interface StatusBadgeProps {
  status: string;
  label?: string;
}

const statusStyles: Record<string, string> = {
  Nowe: "bg-blue-100 text-blue-700",
  Potwierdzone: "bg-green-100 text-green-700",
  Zrealizowane: "bg-emerald-100 text-emerald-700",
  Odwołane: "bg-red-100 text-red-700",
  "Nie pojawił się": "bg-gray-200 text-gray-700",
  todo: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClasses = statusStyles[status] ?? "bg-gray-200 text-gray-700";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colorClasses}`}>
      {label ?? status}
    </span>
  );
}
