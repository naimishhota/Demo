import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("Fetching booking with ID:", id);

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from("event_bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      console.error("Booking not found:", bookingError);
      return NextResponse.json(
        { error: "Booking not found", details: bookingError?.message },
        { status: 404 }
      );
    }

    console.log("Booking found, fetching related data...");

    // Fetch event details
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", booking.event_id)
      .single();

    // Fetch ticket details
    const { data: ticket } = await supabase
      .from("event_tickets")
      .select("*")
      .eq("id", booking.ticket_id)
      .single();

    // Combine the data
    const bookingWithDetails = {
      ...booking,
      events: event,
      event_tickets: ticket,
    };

    console.log("Booking details fetched successfully");

    return NextResponse.json({ booking: bookingWithDetails }, { status: 200 });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
