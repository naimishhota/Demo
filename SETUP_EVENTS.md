# Event Management System Setup Guide

## Step 1: Database Setup

### 1.1 Run SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `db/migrations/001_create_events_tables.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

This will create:

- `events` table
- `event_tickets` table
- Row Level Security policies
- Indexes for performance

### 1.2 Setup Supabase Storage

#### Option A: If Storage is Available

1. Navigate to **Storage** in the Supabase dashboard
2. Click **New bucket**
3. Configure the bucket:

   - **Name**: `event-images`
   - **Public bucket**: Toggle **ON**
   - Click **Create bucket**

4. Set up storage policies (go to Policies tab in Storage):
   - Click **New Policy** and add the three policies from `db/storage_setup.md`

#### Option B: If Storage is NOT Available

If Supabase Storage is not enabled in your project:

1. You can still use the system, but images won't be uploaded
2. The API will gracefully handle missing storage
3. Events will be created without images
4. To enable storage later, contact Supabase support or upgrade your plan

## Step 2: Verify Setup

### 2.1 Check Database Tables

Run this query in SQL Editor to verify tables were created:

\`\`\`sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('events', 'event_tickets');
\`\`\`

You should see both tables listed.

### 2.2 Check Storage Bucket (if using Storage)

1. Go to **Storage** in Supabase dashboard
2. You should see the `event-images` bucket listed
3. Click on it to verify it's configured as public

## Step 3: Test the Application

### 3.1 Start Development Server

\`\`\`bash
npm run dev
\`\`\`

### 3.2 Login as Admin

1. Navigate to `http://localhost:3000/login`
2. Login with an admin account
3. Verify you're redirected to the dashboard

### 3.3 Access Event Management

1. On the dashboard, click **Manage Events** in the Quick Actions section
2. You should see the events listing page (empty initially)
3. Click **Create New Event**

### 3.4 Test Event Creation

Complete all 4 steps of the wizard:

**Step 1 - General Information:**

- Event Name: "Tech Expo 2025"
- Organizer: "Your Organization"
- Description: "Annual technology exhibition"
- Add chief guests and speakers

**Step 2 - Date & Location:**

- Event Date: Select a future date
- Event Time: Select a time
- Venue: "Convention Center"
- Address: Full address

**Step 3 - Media Upload:**

- Upload 1-3 event images
- Verify previews appear
- Test delete button on previews

**Step 4 - Tickets:**

- Add multiple ticket types (VIP, Premium, Classic)
- Set prices and quantities
- Test add/remove ticket buttons

**Submit:**

- Click Submit
- Wait for success message
- Verify redirect to events list

### 3.5 Verify in Database

Check Supabase dashboard:

1. Go to **Table Editor**
2. View `events` table - you should see your new event
3. View `event_tickets` table - you should see the ticket types
4. If using Storage, check `event-images` bucket for uploaded images

### 3.6 Test Delete Functionality

1. On the events list page, click **Delete** on an event
2. Confirm the deletion in the modal
3. Verify the event is removed from the list
4. Check database to confirm deletion

## Troubleshooting

### Issue: "Unauthorized" error when creating event

**Solution:**

- Ensure you're logged in as an admin user
- Check that your user record in the `users` table has `role = 'admin'`
- Verify the auth token is being sent correctly

### Issue: Images not uploading

**Solution:**

- Check if Supabase Storage is enabled
- Verify the `event-images` bucket exists and is public
- Check storage policies are correctly configured
- Review browser console for specific error messages

### Issue: "Failed to create event" error

**Solution:**

- Check browser console for detailed error message
- Verify all required fields are filled
- Check Supabase logs in the dashboard
- Ensure database tables were created correctly

### Issue: Can't access /dashboard/events

**Solution:**

- Ensure you're logged in as admin
- Check the AuthContext is working correctly
- Verify the route file exists at the correct path

## Next Steps

Once the basic system is working:

1. **Add Edit Functionality**: Implement event editing (currently only create/delete)
2. **Add Filtering**: Add search and filter options on events list
3. **Add Pagination**: Implement pagination for large event lists
4. **Add Event Details Page**: Create a detailed view for each event
5. **Add Ticket Sales**: Implement ticket purchasing functionality
6. **Add Analytics**: Track event views, ticket sales, etc.

## File Structure

\`\`\`
app/
├── api/
│ └── events/
│ ├── route.ts # GET all events
│ ├── create/
│ │ └── route.ts # POST create event
│ └── [id]/
│ └── route.ts # GET/DELETE single event
├── components/
│ └── CreateEventWizard.tsx # Multi-step wizard component
├── dashboard/
│ ├── page.tsx # Dashboard with events link
│ └── events/
│ ├── page.tsx # Events listing
│ └── create/
│ └── page.tsx # Event creation page
├── type/
│ └── events.ts # TypeScript types
db/
├── migrations/
│ └── 001_create_events_tables.sql
└── storage_setup.md
\`\`\`
