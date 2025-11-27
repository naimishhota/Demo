import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("stalls")
      .select("id, stall_no, stall_type, price, is_booked")
      .eq("is_booked", false);

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ stalls: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
