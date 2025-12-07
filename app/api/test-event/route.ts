import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userEmail = formData.get("user_email") as string;

    console.log("1. Received user_email:", userEmail);

    if (!userEmail) {
      return NextResponse.json({ error: "No user email provided", step: 1 }, { status: 400 });
    }

    // Check users table
    console.log("2. Querying users table...");
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    console.log("3. User query result:", { userData, userError });

    if (userError) {
      return NextResponse.json({ 
        error: "User query failed", 
        step: 2, 
        details: userError.message,
        userError 
      }, { status: 500 });
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found", step: 3 }, { status: 404 });
    }

    console.log("4. User data:", userData);
    console.log("5. User ID:", userData.id);
    console.log("6. User ID type:", typeof userData.id);

    // Try to create a test event
    console.log("7. Creating test event...");
    const testEvent = {
      event_name: "Test Event",
      organizer: "Test Org",
      description: "Test",
      chief_guests: ["Guest 1"],
      speakers: ["Speaker 1"],
      event_date: "2025-12-20",
      event_time: "10:00",
      venue: "Test Venue",
      address: "Test Address",
      image_urls: [],
      created_by: userData.id,
    };

    console.log("8. Test event data:", testEvent);

    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert([testEvent])
      .select()
      .single();

    console.log("9. Event insert result:", { event, eventError });

    if (eventError) {
      return NextResponse.json({ 
        error: "Event insert failed", 
        step: 4, 
        details: eventError.message,
        eventError,
        testEvent 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      event,
      userData: { id: userData.id, email: userData.email, role: userData.role }
    }, { status: 200 });

  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({ 
      error: "Caught exception", 
      details: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
