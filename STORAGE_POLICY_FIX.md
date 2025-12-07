# Fix Supabase Storage Permissions for Image Upload

## The Problem

Your storage policy requires "Authenticated users" but your app uses **custom authentication** (not Supabase Auth), so uploads are being rejected.

## The Solution

### Option 1: Allow Public Uploads (Recommended for your setup)

1. Go to Supabase Dashboard → Storage → `event-images` bucket
2. Click on **Policies** tab
3. **Delete** the policy "Authenticated users can upload event images"
4. Click **"New Policy"**
5. Select **"For full customization"**
6. Fill in:
   - **Policy name**: `Allow public uploads`
   - **Allowed operation**: Check `INSERT`
   - **Target roles**: Select `anon` and `public`
   - **Policy definition (USING)**: `true`
   - **WITH CHECK expression**: `true`
7. Click **"Save"**

### Option 2: Use Service Role Key (More Secure)

If you want to keep uploads restricted, use the service role key in your API:

1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (NOT the anon key)
3. Add to your `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
4. Update `lib/supabaseClient.ts` to create a server-side client with service role

**For now, use Option 1** - it's simpler and works with your current setup.

## After Fixing

1. Apply the new policy in Supabase
2. Try creating an event with images
3. Images should now upload successfully!

The terminal will show:

```
Found 1 images to upload
Uploading image 1/1: ...
Image uploaded successfully: https://...
Total images uploaded: 1
```
