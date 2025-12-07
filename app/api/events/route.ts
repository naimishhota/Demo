import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch events
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventsError) {
      return NextResponse.json(
        { error: "Failed to fetch events", details: eventsError.message },
        { status: 500 }
      );
    }

    // Fetch tickets for each event
    const eventsWithTickets = await Promise.all(
      (events || []).map(async (event) => {
        const { data: tickets } = await supabase
          .from("event_tickets")
          .select("*")
          .eq("event_id", event.id);

        return {
          ...event,
          tickets: tickets || [],
        };
      })
    );

    return NextResponse.json({ events: eventsWithTickets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
