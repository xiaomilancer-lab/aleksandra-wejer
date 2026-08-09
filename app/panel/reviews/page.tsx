import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import ReviewCareOverview from "../components/reviews/ReviewCareOverview";
import type { PatientReviewCare } from "../domain";
import { getReviewCareOverview } from "../services/reviewCareService";

export default async function ReviewsPage() {
  await connection();
  let reviews: PatientReviewCare[] = [];
  let loadError = false;

  try {
    reviews = await getReviewCareOverview();
  } catch {
    loadError = true;
  }

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-7xl">
          <ReviewCareOverview reviews={reviews} loadError={loadError} />
        </div>
      </Dashboard>
    </AuthGuard>
  );
}
