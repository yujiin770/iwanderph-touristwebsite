# Setup Checklist

Use this checklist to track your setup progress:

## 📋 Pre-Setup

- [ ] Read QUICKSTART.md
- [ ] Read SETUP_SUMMARY.md
- [ ] Have Supabase account ready
- [ ] Have Gmail account ready

## 🗄️ Supabase Setup

- [ ] Create Supabase project
- [ ] Get Supabase URL and API Key
- [ ] Open SQL Editor in Supabase
- [ ] Copy all SQL from DATABASE_SETUP.md
- [ ] Paste and execute SQL queries
- [ ] Verify tables are created

## 🔐 Gmail Setup

- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Go to [Google Account Security](https://myaccount.google.com/security)
- [ ] Generate App Password for Mail
- [ ] Copy the 16-character app password
- [ ] Save for later use

## 📝 Backend Configuration

- [ ] Navigate to `backend/` folder
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_KEY
  - [ ] JWT_SECRET (generate random string)
  - [ ] GMAIL_EMAIL
  - [ ] GMAIL_PASSWORD
- [ ] Run `npm install`
- [ ] Create admin user (run SQL from Supabase console)
- [ ] Test backend with `npm run dev`
- [ ] Verify "Server running on http://localhost:5000" message

## 📱 Frontend Configuration

- [ ] Navigate to `frontend/` folder
- [ ] Frontend `.env` should already have:
  - [ ] VITE_API_URL=http://localhost:5000/api
- [ ] Run `npm install`
- [ ] Test frontend with `npm run dev`
- [ ] Verify "Local: http://localhost:5173/" message

## 🧪 Testing

### Backend Tests
- [ ] Test health check: `curl http://localhost:5000/api/health`
- [ ] Test destinations: `curl http://localhost:5000/api/destinations`
- [ ] Test gallery: `curl http://localhost:5000/api/gallery`
- [ ] Test login: `curl -X POST http://localhost:5000/api/auth/login ...`

### Frontend Tests
- [ ] Open http://localhost:5173 in browser
- [ ] Check homepage loads
- [ ] Check hero image slider works
- [ ] Check light/dark theme toggle
- [ ] Check navigation links work
- [ ] Test contact form submission
- [ ] Verify email received in Gmail inbox
- [ ] Navigate to http://localhost:5173/login
- [ ] Enter admin credentials
- [ ] Verify login works
- [ ] Check admin dashboard loads
- [ ] Test adding a new destination
- [ ] Verify it appears on homepage
- [ ] Test editing destination
- [ ] Test deleting destination
- [ ] Test uploading gallery photo
- [ ] Test editing hero section
- [ ] Test updating contact info
- [ ] Test logout

## 🔒 Security Verification

- [ ] Admin routes require token
- [ ] Passwords are hashed (bcrypt)
- [ ] Environment variables contain no secrets
- [ ] tokens expire after 7 days
- [ ] CORS is configured
- [ ] JWT secret is strong (32+ chars)

## 📦 Version Control (Optional)

- [ ] Initialize git: `git init`
- [ ] Create .gitignore files (already created)
- [ ] Add all files: `git add .`
- [ ] Create initial commit: `git commit -m "Initial commit"`
- [ ] Add GitHub remote: `git remote add origin ...`
- [ ] Push to GitHub: `git push -u origin main`

## 🚀 Deployment (Optional)

### Frontend Deployment (Vercel)
- [ ] Create account on Vercel
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - [ ] VITE_API_URL=https://your-backend-url/api
- [ ] Deploy

### Backend Deployment (Railway)
- [ ] Create account on Railway
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - [ ] PORT=3000
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_KEY
  - [ ] JWT_SECRET
  - [ ] GMAIL_EMAIL
  - [ ] GMAIL_PASSWORD
- [ ] Deploy

### Database
- [ ] Already deployed on Supabase
- [ ] Update frontend API_URL to production backend

## 📚 Documentation

- [ ] README.md - Project overview
- [ ] QUICKSTART.md - Setup guide
- [ ] DATABASE_SETUP.md - Database schema
- [ ] API_DOCS.md - API endpoints
- [ ] ARCHITECTURE.md - System architecture
- [ ] SETUP_SUMMARY.md - Project overview
- [ ] This file - Setup checklist

## ✅ Final Steps

- [ ] Test all features one more time
- [ ] Create admin account with strong password
- [ ] Backup your environment variables (.env files)
- [ ] Share link with team/users
- [ ] Monitor error logs
- [ ] Plan future features

## 🎉 You're Ready When:

- ✅ Both frontend and backend servers are running
- ✅ Homepage displays properly with content
- ✅ Admin login works
- ✅ Can add/edit/delete content from admin panel
- ✅ Changes immediately appear on frontend
- ✅ Contact form sends emails
- ✅ Dark mode toggle works
- ✅ Responsive design works on mobile

## 🆘 Troubleshooting

If you encounter issues:

1. **Check console errors** - Browser and server console for detailed errors
2. **Verify URLs** - Ensure all URLs in code match your setup
3. **Check credentials** - Verify Supabase and Gmail credentials are correct
4. **Test API** - Use curl or Postman to test endpoints
5. **Review logs** - Check backend console for error messages
6. **Recreate admin user** - If login fails, recreate admin user in Supabase

## 📞 Support Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Nodemailer Guide](https://nodemailer.com)

---

**Happy coding! Your modern tourist website is ready to go! 🚀**
