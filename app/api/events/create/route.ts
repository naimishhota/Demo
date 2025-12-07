import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Get user email from form data (sent by client)
    const userEmail = formData.get("user_email") as string;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized - User email required" }, { status: 401 });
    }
    
    // Verify user is admin by checking users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, email, id")
      .eq("email", userEmail)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json({ error: "Unauthorized - User not found" }, { status: 401 });
    }
    
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    // Extract event data
    const eventData = {
      event_name: formData.get("event_name") as string,
      organizer: formData.get("organizer") as string,
      description: formData.get("description") as string || null,
      chief_guests: JSON.parse(formData.get("chief_guests") as string || "[]"),
      speakers: JSON.parse(formData.get("speakers") as string || "[]"),
      event_date: formData.get("event_date") as string,
      event_time: formData.get("event_time") as string,
      venue: formData.get("venue") as string,
      address: formData.get("address") as string || null,
      created_by: userData.id,
    };

    // Extract tickets data
    const ticketsData = JSON.parse(formData.get("tickets") as string || "[]");

    // Extract images
    const images: File[] = [];
    let imageIndex = 0;
    while (formData.has(`image_${imageIndex}`)) {
      const file = formData.get(`image_${imageIndex}`) as File;
      if (file) images.push(file);
      imageIndex++;
    }

    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${i}.${fileExt}`;
      const filePath = `events/${fileName}`;

      try {
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          // If storage fails, we'll continue without images
          // You can choose to fail the entire request instead
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from("event-images")
            .getPublicUrl(filePath);
          
          if (urlData?.publicUrl) {
            imageUrls.push(urlData.publicUrl);
          }
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    // Add image URLs to event data
    const eventDataWithImages = {
      ...eventData,
      image_urls: imageUrls,
    };

    // Insert event into database
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert([eventDataWithImages])
      .select()
      .single();

    if (eventError) {
      console.error("Error creating event:", eventError);
      return NextResponse.json(
        { error: "Failed to create event", details: eventError.message },
        { status: 500 }
      );
    }

    // Insert tickets
    if (ticketsData.length > 0) {
      const ticketsWithEventId = ticketsData.map((ticket: any) => ({
        event_id: event.id,
        ticket_name: ticket.ticket_name,
        price: ticket.price,
        available_quantity: ticket.available_quantity,
      }));

      const { error: ticketsError } = await supabase
        .from("event_tickets")
        .insert(ticketsWithEventId);

      if (ticketsError) {
        console.error("Error creating tickets:", ticketsError);
        // Event is created but tickets failed - you may want to handle this differently
      }
    }

    return NextResponse.json(
      { success: true, event, message: "Event created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create event API:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    });
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
