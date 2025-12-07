import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const userEmail = formData.get("user_email") as string;
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized - User email required" }, { status: 401 });
    }
    
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

    const ticketsData = JSON.parse(formData.get("tickets") as string || "[]");

    const images: File[] = [];
    let imageIndex = 0;
    while (formData.has(`image_${imageIndex}`)) {
      const file = formData.get(`image_${imageIndex}`) as File;
      if (file && file.size > 0) images.push(file);
      imageIndex++;
    }



    const imageUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${i}.${fileExt}`;
      const filePath = `events/${fileName}`;



      try {
        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error(`Upload error for ${fileName}:`, uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from("event-images")
            .getPublicUrl(filePath);
          

          
          if (urlData?.publicUrl) {
            imageUrls.push(urlData.publicUrl);
          }
        }
      } catch (error) {
        console.error(`Exception uploading ${fileName}:`, error);
      }
    }



    const eventDataWithImages = {
      ...eventData,
      image_urls: imageUrls,
    };

    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert([eventDataWithImages])
      .select()
      .single();

    if (eventError) {
      return NextResponse.json(
        { error: "Failed to create event", details: eventError.message },
        { status: 500 }
      );
    }

    if (ticketsData.length > 0) {
      const ticketsWithEventId = ticketsData.map((ticket: any) => ({
        event_id: event.id,
        ticket_name: ticket.ticket_name,
        price: ticket.price,
        available_quantity: ticket.available_quantity,
      }));

      await supabase
        .from("event_tickets")
        .insert(ticketsWithEventId);
    }

    return NextResponse.json(
      { success: true, event, message: "Event created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
