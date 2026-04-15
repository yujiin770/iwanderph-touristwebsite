# Supabase Storage Setup

To enable photo uploads in the admin panel, you need to create storage buckets in your Supabase project.

## Setup Instructions

### 1. Go to Supabase Dashboard
- Open your Supabase project
- Click on "Storage" in the left sidebar

### 2. Create Storage Buckets

Create THREE public buckets with the following names:

1. **destinations** - For destination images
2. **gallery** - For gallery photos
3. **hero** - For hero carousel images

**For each bucket:**
- Click "Create a new bucket"
- Enter the bucket name exactly as listed above
- Toggle **Public OFF** (then set it as public via policies)
- Click "Create bucket"

### 3. Set Bucket Policies (Make Public)

For each bucket, set the following policy to allow public access:

**Steps:**
1. Click on the bucket name
2. Click "Policies" tab
3. Click "New policy"
4. Select "For full customization, use custom policies"
5. Choose operation: **SELECT** (for reading)
6. Add the following policy:
   ```
   (bucket_id = 'destinations') OR (bucket_id = 'gallery') OR (bucket_id = 'hero')
   ```
7. Click "Review" then "Save policy"

**Create another policy for uploads:**
1. Click "New policy"
2. Choose operation: **INSERT** and **UPDATE**
3. Target role: User role in policy
4. Using expression:
   ```
   auth.role() = 'authenticated'
   ```
5. Save policy

### 4. Verify Setup

You should now have:
- 3 public storage buckets
- Ability to upload files
- Public read access to files

### 5. Test Upload

1. Go to admin panel
2. Navigate to "Destinations" or "Gallery"
3. Try uploading a photo
4. The photo should appear with a public URL

## Troubleshooting

**Upload returns 401 Unauthorized:**
- Check JWT token is in localStorage
- Ensure backend .env has correct SUPABASE_KEY (service role key)

**Upload returns 404 Not Found:**
- Check bucket names are exactly: `destinations`, `gallery`, `hero`
- Verify buckets are created in correct Supabase project

**Uploaded photo shows broken image:**
- Check bucket is set to public
- Verify image URL is accessible from browser
- Check CORS is configured properly

## File Structure After Upload

```
supabase://
├── destinations/
│   ├── 1713000000001-abc123-image.png
│   ├── 1713000001001-def456-photo.jpg
│   └── ...
├── gallery/
│   ├── 1713000002001-ghi789-sunset.png
│   └── ...
└── hero/
    ├── 1713000003001-jkl012-beach1.png
    ├── 1713000003002-mno345-beach2.png
    └── ...
```

## Important Notes

- Files are stored by timestamp + random ID to prevent conflicts
- File names are preserved in the upload
- All files are publicly readable
- Recommended max file size: 5MB per image
- Supported formats: JPG, PNG, WebP, GIF

---

Once setup is complete, the admin panel will automatically handle all uploads through the `/api/upload` endpoint.
