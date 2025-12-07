import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Fetch tickets
    const { data: tickets } = await supabase
      .from("event_tickets")
      .select("*")
      .eq("event_id", id);

    return NextResponse.json(
      { event: { ...event, tickets: tickets || [] } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get user email from request body or query params
    const body = await request.json().catch(() => ({}));
    const userEmail = body.user_email || request.nextUrl.searchParams.get("user_email");
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized - User email required" }, { status: 401 });
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

    // Get event to retrieve image URLs
    const { data: event } = await supabase
      .from("events")
      .select("image_urls")
      .eq("id", id)
      .single();

    // Delete images from storage
    if (event?.image_urls && event.image_urls.length > 0) {
      for (const url of event.image_urls) {
        try {
          // Extract file path from URL
          const urlParts = url.split("/");
          const bucketIndex = urlParts.indexOf("event-images");
          if (bucketIndex !== -1) {
            const filePath = urlParts.slice(bucketIndex + 1).join("/");
            await supabase.storage.from("event-images").remove([filePath]);
          }
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    }

    // Delete event (tickets will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete event", details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
