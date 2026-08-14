import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getBookingLocation, getBookingLocationDisplayName, isBookingLocationId } from "@/app/booking/locations";
import AfterVisitCard from "../../../components/visits/AfterVisitCard";
import { requirePsychologist } from "../../../server/requirePsychologist";
import { getNextOrganizerVisit, getOrganizerVisitById } from "../../../services/visitOrganizerService";

export default async function AfterVisitPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const visitId = Number(id);
  if (!Number.isInteger(visitId) || visitId < 1) notFound();

  await requirePsychologist();
  const visit = await getOrganizerVisitById(visitId);
  if (!visit || visit.record_kind === "test" || visit.status !== "Zrealizowane") notFound();

  const nextVisit = await getNextOrganizerVisit(visit);
  const locationName = getBookingLocationDisplayName(visit.location_id, visit.location);
  const locationId = visit.location_id ?? "";
  const locationAddress = isBookingLocationId(locationId)
    ? `${getBookingLocation(locationId).street}, ${getBookingLocation(locationId).city}`
    : null;

  return (
    <AfterVisitCard
      visit={{
        id: visit.id,
        name: visit.name,
        visitDate: visit.visit_date,
        visitTime: visit.visit_time,
        locationName,
        locationAddress,
      }}
      nextVisit={nextVisit ? {
        visitDate: nextVisit.visit_date,
        visitTime: nextVisit.visit_time,
        locationName: getBookingLocationDisplayName(nextVisit.location_id, nextVisit.location),
      } : null}
    />
  );
}
