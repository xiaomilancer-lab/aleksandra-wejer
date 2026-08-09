import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { recordTimelineEvent } from "@/app/panel/services/patientService";
import { scheduleReviewRequestAfterCompletedVisit } from "@/app/panel/services/reviewCareService";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";

export async function POST(req: Request) {
  const authorization = await getPsychologistApiAuthorization(req);
  if (authorization.kind === "unauthenticated") return NextResponse.json({ success: false, message: "Zaloguj się, aby zarządzać wizytami." }, { status: 401 });
  if (authorization.kind === "forbidden") return NextResponse.json({ success: false, message: "Nie masz dostępu do zarządzania wizytami." }, { status: 403 });

  const body = await req.json().catch(() => null) as { id?: unknown; status?: unknown } | null;
  if (!body || !Number.isInteger(body.id) || typeof body.status !== "string" || !body.status.trim()) {
    return NextResponse.json({ success: false, message: "Nieprawidłowe dane wizyty." }, { status: 400 });
  }
  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .update({ status: body.status.trim() })
    .eq("id", body.id)
    .select("id, patient_id, status, visit_date")
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, message: "Nie udało się zapisać statusu wizyty." },
      { status: 500 }
    );
  }

  if (booking?.patient_id) {
    const isCompleted = booking.status === "Zrealizowane";
    await recordTimelineEvent({
      patientId: booking.patient_id as string,
      visitId: booking.id as number,
      eventType: isCompleted ? "visit_completed" : "status_changed",
      title: isCompleted ? "Zrealizowano wizytę" : "Zmieniono status wizyty",
      description: `Status wizyty: ${booking.status}`,
      metadata: { bookingId: booking.id as number, status: booking.status as string },
    });

    if (isCompleted) {
      try {
        await scheduleReviewRequestAfterCompletedVisit(
          booking.patient_id as string,
          booking.visit_date as string,
        );
      } catch (reviewError) {
        // Review scheduling must never block saving a visit status.
        // TODO: add structured monitoring when the message worker is introduced.
        console.error("Unable to schedule review request", reviewError);
      }
    }
  }

  return NextResponse.json({ success: true });
}
