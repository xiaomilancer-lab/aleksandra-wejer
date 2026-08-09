import { notFound } from "next/navigation";
import CareAfterVisitForm from "./CareAfterVisitForm";

export default async function ReviewPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  if (!patientId) notFound();
  return <CareAfterVisitForm patientId={patientId} googleReviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? null} />;
}
