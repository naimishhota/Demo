-- Migration to add CANCELLED and REFUNDED statuses to event_bookings

-- Add cancelled_at column
ALTER TABLE event_bookings 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- Drop the existing check constraint
ALTER TABLE event_bookings 
DROP CONSTRAINT IF EXISTS event_bookings_payment_status_check;

-- Add new check constraint with additional statuses
ALTER TABLE event_bookings 
ADD CONSTRAINT event_bookings_payment_status_check 
CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'));

-- Create index on cancelled_at for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_cancelled_at ON event_bookings(cancelled_at);
