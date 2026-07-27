interface StepSummaryProps {
  locationName: string;
}

export default function StepSummary({
  locationName,
}: StepSummaryProps) {
  return (
    <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
        ✓ Wybrana lokalizacja
      </p>

      <h3 className="mt-2 text-2xl font-bold text-[#2D4739]">
        {locationName}
      </h3>
    </div>
  );
}