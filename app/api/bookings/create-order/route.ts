import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received booking request:", body);
    
    const { event_id, ticket_id, quantity, user_name, user_email, user_phone } = body;

    // Validate input
    if (!event_id || !ticket_id || !quantity || !user_name || !user_email || !user_phone) {
      console.log("Missing fields:", { event_id, ticket_id, quantity, user_name, user_email, user_phone });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Fetch ticket details
    console.log("Fetching ticket with ID:", ticket_id);
    const { data: ticket, error: ticketError } = await supabase
      .from("event_tickets")
      .select("*")
      .eq("id", ticket_id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { 
          error: "Ticket not found", 
          details: ticketError?.message,
          ticket_id_received: ticket_id,
        },
        { status: 404 }
      );
    }

    console.log("Ticket found:", ticket);

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", ticket.event_id)
      .single();

    if (eventError || !event) {
      console.log("Event query error:", eventError);
      return NextResponse.json(
        { error: "Event not found for this ticket" },
        { status: 404 }
      );
    }

    console.log("Event found:", event.event_name);

    // Check ticket availability
    if (ticket.available_quantity < quantity) {
      return NextResponse.json(
        { error: `Only ${ticket.available_quantity} tickets available` },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = ticket.price * quantity;
    console.log("Total amount:", totalAmount);

    // Create Razorpay order
    console.log("Creating Razorpay order...");
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await (razorpay.orders as any).create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    });

    console.log("Razorpay order created:", order.id);

    // Create preliminary booking record
    console.log("Creating booking record in database...");
    const bookingData = {
      event_id,
      ticket_id,
      user_name,
      user_email,
      user_phone,
      quantity,
      total_amount: totalAmount,
      razorpay_order_id: order.id,
      payment_status: "PENDING",
    };
    console.log("Booking data:", bookingData);

    const { data: booking, error: bookingError } = await supabase
      .from("event_bookings")
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking", details: bookingError.message },
        { status: 500 }
      );
    }

    console.log("Booking created successfully:", booking.id);

    // Return order details and key_id for Razorpay checkout
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json(
      {
        order,
        key_id: keyId,
        booking_id: booking.id,
        event_name: event.event_name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
