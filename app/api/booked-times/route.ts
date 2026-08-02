import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");

  if (!date) {
    return Response.json([]);
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("visit_time")
    .eq("visit_date", date);

  if (error) {
    console.error(error);
    return Response.json([]);
  }

  return Response.json(
    data.map((item) => item.visit_time)
  );
}