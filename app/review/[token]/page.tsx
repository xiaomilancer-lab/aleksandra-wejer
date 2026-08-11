import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CareAfterVisitForm from "./CareAfterVisitForm";
import { verifyReviewToken } from "../reviewToken";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!verifyReviewToken(token)) notFound();
  return <CareAfterVisitForm token={token} googleReviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? null} />;
}
