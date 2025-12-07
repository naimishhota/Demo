# Complete Storage Policy Fix - Run This SQL

## Problem

Images still not uploading even after policy update.

## Solution

Run this SQL in Supabase SQL Editor to create the correct policies:

```sql
-- First, drop all existing policies on event-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Create INSERT policy (for uploading images)
CREATE POLICY "Allow public image uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-images');

-- Create SELECT policy (for viewing images)
CREATE POLICY "Allow public image access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Create DELETE policy (for deleting images)
CREATE POLICY "Allow public image deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'event-images');
```

## After Running SQL

1. Go to Supabase Dashboard → Storage → `event-images` → Policies
2. You should see 3 policies:

   - `Allow public image uploads` (INSERT)
   - `Allow public image access` (SELECT)
   - `Allow public image deletes` (DELETE)

3. Try creating an event with images
4. Check browser console (F12) - should see: `Client: Adding X images to FormData`
5. Check terminal - should see: `Found X images to upload`

## If Still Not Working

Please share:

1. Screenshot of the Storage Policies page after running the SQL
2. Browser console output when creating an event
3. Terminal output when creating an event
