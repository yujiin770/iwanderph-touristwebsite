# iWander Philippines - Tourist Website

A modern, responsive tourist website for the Philippines built with React, Node.js, and Supabase. Features an admin dashboard for managing destinations, gallery, hero content, and contact information.

## Features

- **Public Pages:**
  - Home with hero section and image slider
  - Destinations showcase with cards
  - Gallery with beautiful photos
  - Contact form with Gmail integration
  - Dark/Light theme toggle

- **Admin Dashboard:**
  - Secure login system
  - Manage destinations (add/edit/delete)
  - Manage gallery photos
  - Edit hero section content
  - Update contact information
  - Responsive admin interface

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
│
├── backend/
│   ├── config/
│   │   ├── supabase.js
│   │   └── mailer.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── destinationController.js
│   │   ├── galleryController.js
│   │   ├── heroController.js
│   │   └── contactController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── destinations.js
│   │   ├── gallery.js
│   │   ├── hero.js
│   │   └── contact.js
│   ├── server.js
│   └── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 
- npm or yarn
- Supabase account
- Gmail account (for nodemailer)

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```

