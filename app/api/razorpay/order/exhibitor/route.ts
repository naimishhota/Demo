import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company_name, contact_person, email, phone, domain, stall_id, amount } = body;

    if (!company_name || !contact_person || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If stall_id provided, fetch stall price from DB and ensure it's not booked/held
    let amountNumber: number | null = null;
    if (stall_id) {
      // Try to select hold-related columns; if DB doesn't have them, fall back
      let stall: any = null;
      let skipHoldChecks = false;
      let stallErr: any = null;
      try {
        const sel = await supabase
          .from("stalls")
          .select("id, price, is_booked, hold_exhibitor_id, hold_expires_at")
          .eq("id", stall_id)
          .limit(1)
          .maybeSingle();
        stall = sel.data;
        stallErr = sel.error;
      } catch (e: any) {
        // some clients throw; capture
        stallErr = e;
      }

      if (stallErr) {
        const msg = String(stallErr?.message || stallErr);
        if (msg.includes("hold_exhibitor_id") || msg.includes("hold_expires_at")) {
          // fallback: select without hold columns and skip hold checks
          const sel2 = await supabase
            .from("stalls")
            .select("id, price, is_booked")
            .eq("id", stall_id)
            .limit(1)
            .maybeSingle();
          stall = sel2.data;
          stallErr = sel2.error;
          skipHoldChecks = true;
        } else {
          return NextResponse.json({ error: stallErr }, { status: 500 });
        }
      }
      if (stallErr) return NextResponse.json({ error: stallErr }, { status: 500 });
      if (!stall) return NextResponse.json({ error: "Selected stall not found" }, { status: 400 });
      // stall already booked
      if (stall.is_booked) return NextResponse.json({ error: "Selected stall is already booked" }, { status: 400 });

      // if there's a current hold that hasn't expired, reject (skip if DB doesn't support holds)
      if (!skipHoldChecks) {
        if (stall.hold_exhibitor_id && stall.hold_expires_at) {
          const expires = new Date(stall.hold_expires_at);
          if (expires.getTime() > Date.now()) {
            return NextResponse.json({ error: "Selected stall is temporarily held, please choose another" }, { status: 400 });
          }
        }
      }

      amountNumber = Number(stall.price);
    } else {
      if (!amount) return NextResponse.json({ error: "Missing amount when no stall selected" }, { status: 400 });
      amountNumber = Number(amount);
    }

    if (isNaN(amountNumber as number) || (amountNumber as number) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await (razorpay.orders as any).create({
      amount: Math.round((amountNumber as number) * 100),
      currency: "INR",
      receipt: `exh_rcpt_${Date.now()}`,
      payment_capture: true,
    } as any);

    // insert exhibitor row with pending payment
    const insertObj: any = {
      company_name,
      contact_person,
      email,
      phone,
      domain: domain || null,
      stall_id: stall_id || null,
      payment_status: "PENDING",
      razorpay_order_id: order.id,
    };

    const { data, error } = await supabase.from("exhibitors").insert(insertObj).select("id").limit(1).single();
    if (error) return NextResponse.json({ error }, { status: 500 });

    const exhibitorId = data.id as string;

    // If stall selected, set a short hold (10 minutes) so others can't book it immediately
    if (stall_id) {
      const holdExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const { error: holdErr } = await supabase
        .from("stalls")
        .update({ hold_exhibitor_id: exhibitorId, hold_expires_at: holdExpires })
        .eq("id", stall_id)
        .eq("is_booked", false);

      if (holdErr) {
        // cleanup exhibitor row
        await supabase.from("exhibitors").delete().eq("id", exhibitorId);
        return NextResponse.json({ error: holdErr }, { status: 500 });
      }
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json({ order, key_id: keyId, exhibitor_id: exhibitorId });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
