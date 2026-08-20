import type { Metadata } from "next";
import CalmMinute from "./CalmMinute";

export const metadata: Metadata = {
  title: "Chwila z PsychOLKĄ | Aleksandra Wejer",
  description: "Spokojna minuta oddechu z PsychOLKĄ — bez konta i bez zapisywania odpowiedzi.",
};

export default function CalmMinutePage() {
  return <CalmMinute />;
}
