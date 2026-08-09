"use client";

interface ToastProps {
  show: boolean;
  message: string;
}

export default function Toast({
  show,
  message,
}: ToastProps) {

  return (
    <div
      className={`
        fixed
        top-6
        right-6
        z-[999]
        transition-all
        duration-500
        ${
          show
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }
      `}
    >
      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-green-600
          px-6
          py-4
          text-white
          shadow-2xl
        "
      >
        <span className="text-xl">✅</span>

        <div>
          <div className="font-semibold">
            {message}
          </div>

          <div className="text-sm text-green-100">
            Status wizyty został zaktualizowany.
          </div>
        </div>
      </div>
    </div>
  );
}
