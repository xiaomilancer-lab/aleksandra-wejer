import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import ReviewCareOverview from "../components/reviews/ReviewCareOverview";
import type { PatientReviewCare } from "../domain";
import { getReviewCareOverview } from "../services/reviewCareService";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPatientVaultState } from "../server/patientVault";
import PatientVaultGate from "../patients/PatientVaultGate";

export default async function ReviewsPage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/reviews" /></Dashboard></AuthGuard>;
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
