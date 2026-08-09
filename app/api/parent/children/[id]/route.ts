import { NextResponse } from "next/server";
import { ParentAccessError, requireParentAccess } from "@/app/parent/server/requireParentAccess";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ParentSharedItem } from "@/app/parent/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await requireParentAccess(request, id);
    const { data, error } = await supabaseAdmin
      .from("parent_shared_items")
      .select("id, patient_id, type, title, content, created_at, is_visible")
      .eq("patient_id", id)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ items: (data ?? []) as ParentSharedItem[] });
  } catch (error) {
    if (error instanceof ParentAccessError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Unable to load parent shared items", error);
    return NextResponse.json({ error: "Dane są chwilowo niedostępne." }, { status: 500 });
  }
}
