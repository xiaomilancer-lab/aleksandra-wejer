"use client";

interface SaveVisitButtonProps {
  onClick: () => void;
}

export default function SaveVisitButton({
  onClick,
}: SaveVisitButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        bg-[#6D7A62]
        py-4
        text-lg
        font-semibold
        text-white
        transition
        hover:bg-[#58644F]
      "
    >
      💾 Zapisz zmiany
    </button>
  );
}