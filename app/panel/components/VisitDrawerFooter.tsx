"use client";

interface Props {
  onSave: () => void;
  saving: boolean;
}

export default function VisitDrawerFooter({
  onSave,
  saving,
}: Props) {
  return (
    <div className="w-full border-t bg-white p-6">

      <button
        onClick={onSave}
        disabled={saving}
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
        {saving ? "⏳ Zapisywanie..." : "💾 Zapisz zmiany"}
      </button>

    </div>
  );
}
