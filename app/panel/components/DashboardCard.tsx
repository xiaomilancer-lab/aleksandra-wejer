import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <section
      className={`rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(45,71,57,0.08)] ${className}`}
    >
      {children}
    </section>
  );
}
