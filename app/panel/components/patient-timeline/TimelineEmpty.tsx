interface TimelineEmptyProps {
  message?: string;
}

export default function TimelineEmpty({ message = "Brak wydarzeń dla tego pacjenta." }: TimelineEmptyProps) {
  return <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-4 py-7 text-center text-sm text-gray-500">{message}</p>;
}
