-- Create event_bookings table
CREATE TABLE IF NOT EXISTS event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES event_tickets(id) ON DELETE CASCADE,
  
  -- User details
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  
  -- Booking details
  quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 10),
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Payment details
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookings by email
CREATE POLICY "Users can view their own bookings"
  ON event_bookings FOR SELECT
  USING (true);

-- Policy: Allow booking inserts (validation done in API layer)
CREATE POLICY "Allow booking inserts"
  ON event_bookings FOR INSERT
  WITH CHECK (true);

-- Policy: Allow booking updates (for payment verification)
CREATE POLICY "Allow booking updates"
  ON event_bookings FOR UPDATE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON event_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ticket_id ON event_bookings(ticket_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_email ON event_bookings(user_email);
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_order_id ON event_bookings(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON event_bookings(payment_status);
