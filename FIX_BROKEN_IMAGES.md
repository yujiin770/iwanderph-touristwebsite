# 🖼️ Fix Broken Images - Upload Policy Issue

## Problem
Images upload successfully but show as broken (404 or error loading).

## Root Cause
The bucket policies aren't allowing public read access.

## 🔧 Solution: Add Public Read Policy

### For EACH bucket (`destination`, `gallery`, `hero`):

1. **Click the bucket name**
2. **Click "Policies" tab**
3. **Click "New policy"** button
4. **Select "For full customization, use custom policies"**

### Policy 1: Public Read (SELECT)
- **Operation**: SELECT
- **Applied to**: public
- **With expression**: Leave blank or use:
  ```
  true
  ```
- Click **Save**

### Policy 2: Authenticated Upload (INSERT)
- **Operation**: INSERT  
- **Applied to**: public
- **With expression**: Leave blank or use:
  ```
  auth.role() = 'authenticated'
  ```
- Click **Save**

### Policy 3: Authenticated Update (UPDATE)
- **Operation**: UPDATE
- **Applied to**: public
- **With expression**: Leave blank or use:
  ```
  auth.role() = 'authenticated'
  ```
- Click **Save**

## ✅ Expected Result
After adding policies, you should see in each bucket's Policies tab:
```
✅ SELECT - public
✅ INSERT - public  
✅ UPDATE - public
```

## 🧪 Test Again
1. Go back to admin
2. Upload a photo
3. Image should now display! ✅

## 📝 Policy Details

The policies allow:
- **Anyone** (public) to read files → Images display
- **Authenticated users** to upload files → Your JWT token works
- **Authenticated users** to update files → Edit photos

## 🆘 If Still Broken

Try this simple fix:
1. Click bucket name
2. Look for "Public access" toggle
3. Turn it **ON** if available
4. Refresh page and try again

## 🔍 Debug
Check browser console (F12):
- Right-click broken image → Inspect
- Check what URL it's trying to load
- Copy URL and paste in new tab
- See what error you get (403 = permission denied, 404 = not found)

If you see **403 Forbidden** → Policies not set correctly  
If you see **404 Not Found** → Wrong bucket name or file location

---

**Once policies are set, images will load instantly!** 🚀
