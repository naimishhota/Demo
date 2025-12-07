import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Verify signature
    const generated = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid = generated === razorpay_signature;

    const paymentData = valid
      ? { razorpay_payment_id, razorpay_signature, payment_status: "PAID" }
      : { razorpay_payment_id, razorpay_signature, payment_status: "FAILED" };

    // Update booking record
    console.log("Updating booking with order ID:", razorpay_order_id);
    const { data: booking, error: updateError } = await supabase
      .from("event_bookings")
      .update({
        ...paymentData,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select("*")
      .single();

    if (updateError || !booking) {
      console.error("Booking update error:", updateError);
      return NextResponse.json(
        { error: "Booking not found", details: updateError?.message },
        { status: 404 }
      );
    }

    console.log("Booking updated successfully:", booking.id);

    if (valid) {
      // Fetch ticket to get current availability
      const { data: currentTicket } = await supabase
        .from("event_tickets")
        .select("available_quantity")
        .eq("id", booking.ticket_id)
        .single();

      if (currentTicket) {
        // Deduct ticket availability
        const newQuantity = currentTicket.available_quantity - booking.quantity;

        const { error: ticketUpdateError } = await supabase
          .from("event_tickets")
          .update({ available_quantity: Math.max(0, newQuantity) })
          .eq("id", booking.ticket_id);

        if (ticketUpdateError) {
          console.error("Ticket update error:", ticketUpdateError);
          return NextResponse.json(
            { error: "Failed to update ticket availability" },
            { status: 500 }
          );
        }

        console.log("Ticket availability updated. New quantity:", newQuantity);
      }

      // TODO: Send confirmation email with booking details and QR code
      // This can be implemented similar to the visitor registration email

      return NextResponse.json(
        {
          valid: true,
          payment_status: "PAID",
          booking_id: booking.id,
          message: "Booking confirmed successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          valid: false,
          payment_status: "FAILED",
          message: "Payment verification failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
