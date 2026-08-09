import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPartnerConfig } from "@/app/partners/booking/partnerConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const partner = getPartnerConfig(searchParams.get("partner") ?? "");
  const date = searchParams.get("date");
  if (!partner || !date) return Response.json([], { status: 400 });
  const { data, error } = await supabaseAdmin.from("bookings").select("visit_time").eq("visit_date", date).eq("location", partner.location);
  if (error) return Response.json([], { status: 500 });
  return Response.json(data.map((item) => item.visit_time));
}
