# Image Upload Issue - Complete Fix

## Problem

Images are not being uploaded when creating or editing events.

## Root Cause Analysis

After investigation, the issue is likely one of the following:

1. **Supabase Storage bucket doesn't exist or has wrong permissions**
2. **Images are being uploaded but URLs aren't being saved**
3. **Client is not sending images properly**

## Solution

### Step 1: Verify Supabase Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Check if `event-images` bucket exists
4. If it doesn't exist, create it:
   - Click "New bucket"
   - Name: `event-images`
   - Public bucket: **YES** (check this box)
   - Click "Create bucket"

### Step 2: Set Bucket Permissions

1. Click on the `event-images` bucket
2. Go to **Policies** tab
3. Create a new policy:
   - Click "New Policy"
   - Select "For full customization"
   - Policy name: `Public Access`
   - Allowed operation: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
   - Target roles: `public`, `anon`, `authenticated`
   - USING expression: `true`
   - WITH CHECK expression: `true`
   - Click "Save"

### Step 3: Test Image Upload

After setting up the bucket:

1. Go to http://localhost:3000/dashboard/events/create
2. Fill out the form and upload an image in Step 3
3. Submit the form
4. Check the browser console (F12) - you should see:
   ```
   Client: Adding 1 images to FormData
   Client: Appending image 0: filename.jpg, size: 12345
   ```
5. Check the terminal - you should see:
   ```
   Found 1 images to upload
   Uploading image 1/1: 1733577600000_0.jpg
   Image uploaded successfully: https://...
   Total images uploaded: 1
   ```

### Step 4: Verify in Database

After creating an event with images:

1. Go to Supabase Dashboard → Table Editor
2. Open the `events` table
3. Find your event
4. Check the `image_urls` column - it should contain an array of URLs

## If Still Not Working

If images still don't upload after following the above steps, please provide:

1. Screenshot of your Supabase Storage page showing the `event-images` bucket
2. Browser console output when submitting the form
3. Terminal output when submitting the form

This will help identify the exact issue.
