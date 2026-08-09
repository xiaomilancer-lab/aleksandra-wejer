interface Props {
  onClose: () => void;
}

export default function VisitDrawerHeader({
  onClose,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b p-6">

      <div>

        <h2 className="text-2xl font-bold text-[#2D4739]">
          👤 Szczegóły wizyty
        </h2>

        <p className="text-gray-500">
          psychOLKA Platform
        </p>

      </div>

      <button
        onClick={onClose}
        className="rounded-xl px-3 py-2 hover:bg-gray-100"
      >
        ✕
      </button>

    </div>
  );
}
