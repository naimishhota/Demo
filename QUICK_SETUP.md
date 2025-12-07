# Quick Setup Guide

## ⚠️ IMPORTANT: Database Setup Required

Before you can create events, you need to set up the database tables in Supabase.

### Step 1: Run SQL Migration

1. Open your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the **entire contents** of this file: `db/migrations/001_create_events_tables.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

You should see a success message. This creates:

- ✅ `events` table
- ✅ `event_tickets` table
- ✅ Row Level Security policies
- ✅ Performance indexes

### Step 2: (Optional) Setup Image Storage

If you want to upload event images:

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `event-images`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**
6. Go to the bucket's **Policies** tab
7. Add the policies from `db/storage_setup.md`

**Note:** If you skip this step, events will still be created but without images.

### Step 3: Test Event Creation

1. Make sure `npm run dev` is running
2. Login as admin at http://localhost:3000/login
3. Go to http://localhost:3000/dashboard/events
4. Click "Create New Event"
5. Fill out all 4 steps
6. Click Submit

### Troubleshooting

**Error: "Failed to create event"**

- ✅ Check that you ran the SQL migration in Supabase
- ✅ Verify tables exist in Supabase Table Editor
- ✅ Check browser console for detailed error messages

**Error: "relation 'events' does not exist"**

- ❌ You haven't run the SQL migration yet
- ✅ Go to Supabase SQL Editor and run the migration

**Images not uploading**

- The `event-images` bucket doesn't exist
- Run the storage setup steps above
