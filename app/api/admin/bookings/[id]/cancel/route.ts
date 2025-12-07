import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { user_email } = body;

    if (!user_email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("email", user_email)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch booking to check current status and get details
    const { data: booking, error: fetchError } = await supabase
      .from("event_bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking is already cancelled
    if (booking.payment_status === "CANCELLED" || booking.payment_status === "REFUNDED") {
      return NextResponse.json(
        { error: "Booking is already cancelled or refunded" },
        { status: 400 }
      );
    }

    // 1. Process Refund via Razorpay
    let refundId = null;
    let refundStatus = "PENDING";
    
    if (booking.payment_status === "PAID" && booking.razorpay_payment_id) {
      try {
        const Razorpay = require("razorpay");
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const refund = await razorpay.payments.refund(booking.razorpay_payment_id, {
          speed: "normal",
          notes: {
            reason: "Admin cancelled booking",
            booking_id: id
          }
        });

        refundId = refund.id;
        refundStatus = "REFUNDED";
      } catch (refundError: any) {
        console.error("Razorpay refund failed:", refundError);
        // We continue with cancellation but mark as CANCELLED (not REFUNDED)
        // and log the error. Admin might need to refund manually.
        refundStatus = "CANCELLED"; 
      }
    } else {
      refundStatus = "CANCELLED"; // For PENDING/FAILED bookings
    }

    // 2. Restore Ticket Availability
    // Fetch current ticket data
    const { data: ticket } = await supabase
      .from("event_tickets")
      .select("available_quantity")
      .eq("id", booking.ticket_id)
      .single();

    if (ticket) {
      const newQuantity = ticket.available_quantity + booking.quantity;
      await supabase
        .from("event_tickets")
        .update({ available_quantity: newQuantity })
        .eq("id", booking.ticket_id);
    }

    // 3. Update Booking Status
    const { data: updatedBooking, error: updateError } = await supabase
      .from("event_bookings")
      .update({
        payment_status: refundStatus,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Store refund ID if available (assuming we add a column for it, or just in notes)
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update booking status", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: refundStatus === "REFUNDED" ? "Booking cancelled and refunded successfully" : "Booking cancelled successfully",
        booking: updatedBooking,
        refund_id: refundId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
