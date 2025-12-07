# Fix for Existing Tables

If you've already run the previous migration and are getting errors, you need to drop the existing tables and recreate them with the correct schema.

## Step 1: Drop Existing Tables

Run this in Supabase SQL Editor:

```sql
-- Drop existing policies first
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Admins can insert events" ON events;
DROP POLICY IF EXISTS "Admins can update events" ON events;
DROP POLICY IF EXISTS "Admins can delete events" ON events;
DROP POLICY IF EXISTS "Tickets are viewable by everyone" ON event_tickets;
DROP POLICY IF EXISTS "Admins can insert tickets" ON event_tickets;
DROP POLICY IF EXISTS "Admins can update tickets" ON event_tickets;
DROP POLICY IF EXISTS "Admins can delete tickets" ON event_tickets;

-- Drop tables (CASCADE will drop event_tickets too)
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF NOT EXISTS event_tickets CASCADE;
```

## Step 2: Run the Updated Migration

Now run the updated migration from `db/migrations/001_create_events_tables.sql`

This will create the tables with the correct schema that works with your custom `users` table.

## What Changed?

- ❌ **Removed**: `created_by UUID REFERENCES auth.users(id)` (auth.users doesn't exist)
- ✅ **Added**: `created_by UUID` (simple UUID field, no foreign key)
- ❌ **Removed**: RLS policies that check `auth.users` and `auth.uid()`
- ✅ **Added**: Simple RLS policies that allow all operations (admin check is in API layer)

The admin authentication is now handled entirely in the API routes, not in the database policies.
