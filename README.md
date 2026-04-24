# iWander Philippines - Tourist Website

A modern, responsive tourist website for the Philippines built with React, vite,  Gsap, and Supabase. Features an admin dashboard for managing destinations, gallery, hero content, and contact information.


- **Tech Stack**
  - Frontend: React + Vite + GSAP + Axios
  - Backend: Supabase (Database, Auth, Storage)
  - Deployment: Vercel (Frontend only)
  - Animations: GSAP with ScrollTrigger
  - Styling: Vanilla CSS 


## Features

- **Public Pages:**
  - Home with hero section and image slider
  - Destinations showcase with cards
  - Gallery with beautiful photos
  - Contact form with Gmail integration
  - Dark/Light theme toggle

- **Admin Dashboard:**
  - 🎨 Modern, fantastic UI with gradient sidebar
  - 🔐 Secure JWT login system
  - 📤 Direct file upload for all images (no URL copy-paste!)
  - 🏝️ Manage destinations with photo upload
  - 📸 Manage gallery photos with instant upload
  - 🎡 Edit hero carousel with multiple image support
  - 📝 Update contact information
  - 📱 Fully responsive design
  - 🌙 Dark mode support throughout

- **Technology Stack:**
  - Frontend: React 18 + Vite + React Router
  - Backend: Node.js + Express
  - Database: Supabase (PostgreSQL)
  - Authentication: JWT
  - Email: Nodemailer (Gmail)
  - Styling: Custom CSS with CSS variables

## 📋 Project Structure

```
IWANDER PH/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Destinations.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Admin/
│   │   │       ├── DestinationsAdmin.jsx
│   │   │       ├── GalleryAdmin.jsx
│   │   │       ├── HeroAdmin.jsx
│   │   │       └── ContactAdmin.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html


## 🔧 Installation & Setup


### ✨ NEW: File Upload System

**Version 2.0 Features:**
- 📤 Direct image upload in admin panel
- 🎡 Editable hero carousel with multiple images
- 🏝️ Upload destination photos directly
- 📸 Upload gallery photos without URLs
- 🎨 Modern gradient sidebar UI
- 📱 Mobile-responsive admin interface

**Get Started:**
1. Create Supabase Storage buckets: `destinations`, `gallery`, `hero`
2. See `QUICK_START.md` for 5-minute setup
3. See `STORAGE_SETUP.md` for detailed storage configuration




### 2. Frontend Setups

```bash
cd frontend
npm install
```
