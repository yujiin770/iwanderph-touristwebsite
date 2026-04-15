# 🔧 Fix Upload 500 Error - Create Supabase Storage Buckets

## ✅ Good News!
Your backend upload is NOW WORKING! The error is that the storage buckets don't exist in Supabase yet.

## 🚀 What to Do Now

### Step 1: Go to Supabase Console
1. Open https://supabase.com
2. Login to your account
3. Click your iWander project

### Step 2: Access Storage
1. Click **Storage** in left sidebar
2. You should see a "Storage" section

### Step 3: Create 3 Buckets

**Create First Bucket:**
- Click **"Create a new bucket"** button
- Name it: `destinations`
- Toggle **Make it public** to ON ✅
- Click **Create bucket**

**Create Second Bucket:**
- Click **"Create a new bucket"**
- Name it: `gallery`
- Toggle **Make it public** to ON ✅
- Click **Create bucket**

**Create Third Bucket:**
- Click **"Create a new bucket"**
- Name it: `hero`
- Toggle **Make it public** to ON ✅
- Click **Create bucket**

### Step 4: Verify Upload Works
1. Go back to http://localhost:5173/admin
2. Click **Gallery**
3. Select a photo
4. Click **Upload Photo**
5. ✅ Should work now!

## 🎯 Bucket Names (MUST be exact)
```
✅ destinations
✅ gallery
✅ hero
```

## 📱 If You Already Created Buckets
Check that they are **PUBLIC**:
1. Click the bucket name
2. Click **Settings** tab
3. Find "Public access" or permissions
4. Make sure it's set to PUBLIC

## ✨ Backend Logs Show
```
Upload request received ✅
File received ✅
Bucket name captured ✅
Uploading to bucket: destinations ⏳
```

The ONLY error is: `Bucket not found` → This means buckets don't exist yet

## 🆘 If Still Getting Error After Creating Buckets

1. Wait 10 seconds for Supabase to sync
2. Refresh page (Ctrl+R)
3. Try uploading again
4. Check backend console for error details

## 📊 Expected Success
After uploading, you should see in backend console:
```
Upload request received
File: yourimage.jpg (xxxxx bytes)
Uploading to bucket: gallery
File uploaded successfully: 12345-abc123-yourimage.jpg
Public URL: https://your-project.supabase.co/storage/v1/object/public/gallery/12345-abc123-yourimage.jpg
```

## ⚡ Backend is 100% Ready!
- ✅ Upload endpoint working
- ✅ Multer processing files
- ✅ FormData parsing correct
- ✅ JWT authentication working
- ✅ Just needs buckets!

Go create those buckets and you're golden! 🚀
