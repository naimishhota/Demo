import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, phone, amount } = body;

    if (!full_name || !email || !phone || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await (razorpay.orders as any).create({
      amount: Math.round(amountNumber * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: true,
    } as any);

    const { error } = await supabase.from("expovisitors").insert({
      full_name,
      email,
      phone,
      amount: amountNumber,
      razorpay_order_id: order.id,
      payment_status: "PENDING",
    });

    if (error) return NextResponse.json({ error }, { status: 500 });

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json({ order, key_id: keyId });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
