# Quick Start Guide

## 1️⃣ Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your Supabase URL and API Key from Settings > API
3. Run the SQL commands from `DATABASE_SETUP.md` in your Supabase SQL editor
4. Save your credentials

## 2️⃣ Gmail Setup (for Nodemailer)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Find "App passwords" and generate a new one for Mail
4. Copy the 16-character password

## 3️⃣ Backend Configuration

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in the values:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=generate_a_random_secret_key
   GMAIL_EMAIL=your_email@gmail.com
   GMAIL_PASSWORD=your_16_char_app_password
   ```

3. Open terminal in the backend folder:
   ```bash
   npm install
   npm run dev
   ```

## 4️⃣ Frontend Configuration

1. Copy `frontend/.env.example` to `frontend/.env`
2. Frontend env is usually ready as-is

3. Open a new terminal in the frontend folder:
   ```bash
   npm install
   npm run dev
   ```

## 5️⃣ Create Admin User (Important!)

### Option A: Using Supabase Console (Easiest)

1. Go to your Supabase project > SQL Editor
2. Create a test user by running this SQL (change the password!):

```sql
-- First, install the pgcrypto extension if not already installed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert admin user with hashed password
INSERT INTO admin_users (email, password) 
VALUES (
  'admin@iwander.com',
  crypt('your_password_here', gen_salt('bf'))
);
```

Replace `'your_password_here'` with your desired password.

### Option B: Using a Script

Create a file `create-admin.js` in the backend folder:

```javascript
import bcrypt from 'bcrypt';
import { supabase } from './config/supabase.js';

const email = 'admin@iwander.com';
const password = 'your_password_here';

const hashedPassword = await bcrypt.hash(password, 10);

const { data, error } = await supabase
  .from('admin_users')
  .insert([{ email, password: hashedPassword }]);

if (error) console.error('Error:', error);
else console.log('Admin user created!', data);
```

Then run: `node create-admin.js`

## 6️⃣ Test the Application

1. **Homepage:** http://localhost:5173
   - Should display hero section with image slider
   - Browse destinations and gallery
   - Try the contact form

2. **Admin Dashboard:** http://localhost:5173/login
   - Login with admin@iwander.com and your password
   - Add/edit/delete destinations
   - Manage gallery photos
   - Edit hero section
   - Update contact info

3. **Dark Mode:** Click the moon/sun icon in navigation

## 🔧 Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port already in use
```bash
# Change PORT in backend/.env
PORT=5001
```

### CORS errors
- Make sure backend is running on http://localhost:5000
- Check that `VITE_API_URL` is correct in frontend

### Email not sending
- Verify Gmail app password is correct
- Check that GMAIL_EMAIL is set to your actual Gmail address
- Use less secure app passwords if 2FA is not set up

### Supabase connection errors
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Check that database tables are created
- Verify Row Level Security policies if enabled

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=super_secret_key_min_32_chars_long
GMAIL_EMAIL=your.email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎉 You're All Set!

Your iWander Philippines website should now be running with:
- ✅ Dynamic content management
- ✅ Admin dashboard for updates
- ✅ Email notifications via Gmail
- ✅ Modern UI with dark/light theme
- ✅ Responsive design for all devices

For more information, see [README.md](./README.md)
