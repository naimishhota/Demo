-- Migration: add hold columns to stalls for reservation locking
-- Run this SQL in your Supabase SQL editor or via psql against your database.

ALTER TABLE stalls
  ADD COLUMN hold_exhibitor_id UUID,
  ADD COLUMN hold_expires_at TIMESTAMP;

-- Optional: index for faster queries
CREATE INDEX IF NOT EXISTS idx_stalls_hold_expires_at ON stalls(hold_expires_at);
