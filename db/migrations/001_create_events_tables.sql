-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  description TEXT,
  chief_guests TEXT[], -- Array of chief guest names
  speakers TEXT[], -- Array of speaker names
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue TEXT NOT NULL,
  address TEXT,
  image_urls TEXT[], -- Array of image URLs from Supabase Storage
  created_by UUID, -- References users table (custom table, not auth.users)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_tickets table
CREATE TABLE IF NOT EXISTS event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view events (public access)
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Policy: Allow inserts (admin check is done in API layer)
CREATE POLICY "Allow event inserts"
  ON events FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (admin check is done in API layer)
CREATE POLICY "Allow event updates"
  ON events FOR UPDATE
  USING (true);

-- Policy: Allow deletes (admin check is done in API layer)
CREATE POLICY "Allow event deletes"
  ON events FOR DELETE
  USING (true);

-- Enable Row Level Security on event_tickets
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view tickets
CREATE POLICY "Tickets are viewable by everyone"
  ON event_tickets FOR SELECT
  USING (true);

-- Policy: Allow ticket inserts (admin check is done in API layer)
CREATE POLICY "Allow ticket inserts"
  ON event_tickets FOR INSERT
  WITH CHECK (true);

-- Policy: Allow ticket updates (admin check is done in API layer)
CREATE POLICY "Allow ticket updates"
  ON event_tickets FOR UPDATE
  USING (true);

-- Policy: Allow ticket deletes (admin check is done in API layer)
CREATE POLICY "Allow ticket deletes"
  ON event_tickets FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);

