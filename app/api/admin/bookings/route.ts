import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get user email from query params for admin check
    const userEmail = searchParams.get("user_email");
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("email", userEmail)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Get filter parameters
    const eventName = searchParams.get("event_name");
    const email = searchParams.get("user_email_filter");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const ticketType = searchParams.get("ticket_type");
    const status = searchParams.get("status");

    // Build query
    let query = supabase
      .from("event_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (email) {
      query = query.ilike("user_email", `%${email}%`);
    }
    
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    
    if (endDate) {
      query = query.lte("created_at", endDate);
    }
    
    if (status) {
      query = query.eq("payment_status", status);
    }

    const { data: bookings, error: bookingsError } = await query;

    if (bookingsError) {
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: bookingsError.message },
        { status: 500 }
      );
    }

    // Fetch related event and ticket data for each booking
    const bookingsWithDetails = await Promise.all(
      (bookings || []).map(async (booking) => {
        // Fetch event
        const { data: event } = await supabase
          .from("events")
          .select("event_name, event_date, venue")
          .eq("id", booking.event_id)
          .single();

        // Fetch ticket
        const { data: ticket } = await supabase
          .from("event_tickets")
          .select("ticket_name, price")
          .eq("id", booking.ticket_id)
          .single();

        return {
          ...booking,
          event_name: event?.event_name || "Unknown",
          event_date: event?.event_date || null,
          venue: event?.venue || "Unknown",
          ticket_name: ticket?.ticket_name || "Unknown",
          ticket_price: ticket?.price || 0,
        };
      })
    );

    // Apply event name filter (after fetching event data)
    let filteredBookings = bookingsWithDetails;
    if (eventName) {
      filteredBookings = bookingsWithDetails.filter((b) =>
        b.event_name.toLowerCase().includes(eventName.toLowerCase())
      );
    }

    // Apply ticket type filter
    if (ticketType) {
      filteredBookings = filteredBookings.filter((b) =>
        b.ticket_name.toLowerCase().includes(ticketType.toLowerCase())
      );
    }

    return NextResponse.json({ bookings: filteredBookings }, { status: 200 });
  } catch (error) {
    console.error("Admin bookings API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
