import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    // Check 1: Can we connect to Supabase?
    diagnostics.checks.supabase_connection = "Testing...";
    const { data, error } = await supabase.from("users").select("count").limit(1);
    if (error) {
      diagnostics.checks.supabase_connection = `Failed: ${error.message}`;
    } else {
      diagnostics.checks.supabase_connection = "✅ Connected";
    }

    // Check 2: Does events table exist?
    diagnostics.checks.events_table = "Testing...";
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("count")
      .limit(1);
    if (eventsError) {
      diagnostics.checks.events_table = `❌ Failed: ${eventsError.message}`;
    } else {
      diagnostics.checks.events_table = "✅ Table exists";
    }

    // Check 3: Does event_tickets table exist?
    diagnostics.checks.event_tickets_table = "Testing...";
    const { data: ticketsData, error: ticketsError } = await supabase
      .from("event_tickets")
      .select("count")
      .limit(1);
    if (ticketsError) {
      diagnostics.checks.event_tickets_table = `❌ Failed: ${ticketsError.message}`;
    } else {
      diagnostics.checks.event_tickets_table = "✅ Table exists";
    }

    // Check 4: Does users table exist and have admin users?
    diagnostics.checks.users_table = "Testing...";
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("email, role")
      .eq("role", "admin")
      .limit(5);
    if (usersError) {
      diagnostics.checks.users_table = `❌ Failed: ${usersError.message}`;
    } else {
      diagnostics.checks.users_table = `✅ Table exists with ${usersData?.length || 0} admin user(s)`;
      diagnostics.admin_users = usersData?.map(u => u.email) || [];
    }

    // Check 5: Storage bucket
    diagnostics.checks.storage_bucket = "Testing...";
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      diagnostics.checks.storage_bucket = `❌ Failed: ${bucketError.message}`;
    } else {
      const eventImagesBucket = buckets?.find(b => b.name === "event-images");
      if (eventImagesBucket) {
        diagnostics.checks.storage_bucket = "✅ event-images bucket exists";
      } else {
        diagnostics.checks.storage_bucket = "⚠️ event-images bucket not found (images won't upload)";
      }
    }

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    diagnostics.error = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
