# Supabase Storage Setup Instructions

## Check if Storage is Enabled

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. If you see the Storage interface, it's already enabled

## Create Event Images Bucket

1. In the Storage section, click **"New bucket"**
2. Set the following:

   - **Name**: `event-images`
   - **Public bucket**: Toggle ON (so images can be displayed publicly)
   - **File size limit**: 5MB
   - **Allowed MIME types**: Leave default or specify: `image/jpeg, image/png, image/webp`

3. Click **"Create bucket"**

## Set Storage Policies

After creating the bucket, set up the following policies:

### Policy 1: Public Read Access

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-images' );
```

### Policy 2: Authenticated Upload

```sql
CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-images'
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Admin Delete

```sql
CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'event-images'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);
```

## Verify Setup

After setup, you should be able to:

- ✅ Upload images via the Supabase client
- ✅ Access uploaded images via public URLs
- ✅ Delete images as an admin user

## Alternative: Use Base64 Storage (if Storage not available)

If Supabase Storage is not available or you prefer not to use it, we can store images as base64 strings directly in the database. This is less efficient but works without Storage enabled.
