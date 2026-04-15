# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS (Browsers)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
            ┌───────▼────────┐  ┌────▼──────────┐
            │ PUBLIC USERS   │  │ ADMIN USERS   │
            └────────┬────────┘  └────┬─────────┘
                     │                │
        ┌────────────▼────────────────▼──────────────┐
        │       REACT FRONTEND (Port 5173)          │
        │  ┌──────────────────────────────────────┐ │
        │  │  Pages:                              │ │
        │  │  - Home                              │ │
        │  │  - Login                             │ │
        │  │  - Admin Dashboard                   │ │
        │  │                                      │ │
        │  │  Components:                         │ │
        │  │  - Navigation                        │ │
        │  │  - Hero                              │ │
        │  │  - Destinations                      │ │
        │  │  - Gallery                           │ │
        │  │  - Contact                           │ │
        │  │  - Admin Controls                    │ │
        │  └──────────────────────────────────────┘ │
        │          Theme Context & Auth             │
        └────────────────┬───────────────────────────┘
                         │ HTTP (Axios)
                         │ API Calls
        ┌────────────────▼───────────────────────────┐
        │   EXPRESS.JS BACKEND (Port 5000)          │
        │  ┌──────────────────────────────────────┐ │
        │  │ Routes:                              │ │
        │  │ - POST   /api/auth/login            │ │
        │  │ - GET    /api/destinations          │ │
        │  │ - POST   /api/destinations (auth)   │ │
        │  │ - PUT    /api/destinations/:id      │ │
        │  │ - DELETE /api/destinations/:id      │ │
        │  │ - GET    /api/gallery               │ │
        │  │ - POST   /api/gallery (auth)        │ │
        │  │ - GET    /api/hero                  │ │
        │  │ - PUT    /api/hero (auth)           │ │
        │  │ - GET    /api/contact               │ │
        │  │ - PUT    /api/contact (auth)        │ │
        │  │ - POST   /api/contact/send          │ │
        │  └──────────────────────────────────────┘ │
        │  JWT Auth Middleware                      │
        │  CORS Enabled                             │
        └────────────┬──────────────────┬───────────┘
                     │                  │
        ┌────────────▼──────┐  ┌───────▼─────────────┐
        │   SUPABASE        │  │  GMAIL SMTP         │
        │   DATABASE        │  │  (Nodemailer)       │
        │  (PostgreSQL)     │  │                     │
        │                   │  │ Sends Contact Form  │
        │  Tables:          │  │ Emails              │
        │  - destinations   │  │                     │
        │  - gallery        │  └─────────────────────┘
        │  - hero_content   │
        │  - contact_info   │
        │  - contact_msgs   │
        │  - admin_users    │
        └───────────────────┘
```

## Data Flow Diagram

### Public User Flow
```
User visits homepage
       │
       ▼
React fetches destinations, gallery, hero content
       │
       ▼
Express Backend retrieves data from Supabase
       │
       ▼
Frontend displays data with images and content
       │
       ▼ (User fills contact form)
       │
       ▼
Contact form sends to /api/contact/send
       │
       ▼
Backend saves to database AND sends Gmail email
       │
       ▼
User receives confirmation message
```

### Admin Flow
```
Admin navigates to /login
       │
       ▼
Enters email & password
       │
       ▼
Sends to POST /api/auth/login
       │
       ▼
Backend verifies against admin_users table
       │
       ▼
Generates JWT token on success
       │
       ▼
Frontend stores token & redirects to /admin
       │
       ▼
Admin can now make authenticated requests
       │
       ▼
Edit endpoints include JWT token in header
       │
       ▼
Backend verifies token before allowing changes
       │
       ▼
Changes saved to Supabase database
       │
       ▼
Frontend updates display
```

## Component Hierarchy

```
App
├── Router
│   ├── HomePage
│   │   ├── Navigation
│   │   ├── Hero
│   │   ├── Destinations
│   │   │   └── DestinationCard (multiple)
│   │   ├── Gallery
│   │   ├── Contact
│   │   └── Footer
│   │
│   ├── LoginPage
│   │   └── LoginForm
│   │
│   └── AdminDashboard (Protected)
│       ├── Sidebar Navigation
│       ├── Routes
│       │   ├── DestinationsAdmin
│       │   ├── GalleryAdmin
│       │   ├── HeroAdmin
│       │   └── ContactAdmin
│       └── Footer
│
└── AuthContext (Global State)
    ├── user
    ├── theme
    └── login/logout methods
```

## Database Schema

```
admin_users
├── id (UUID)
├── email (VARCHAR)
├── password (VARCHAR - hashed)
└── created_at (TIMESTAMP)

destinations
├── id (UUID)
├── name (VARCHAR)
├── label (VARCHAR)
├── description (TEXT)
├── image (TEXT - URL)
├── rating (DECIMAL)
└── created_at (TIMESTAMP)

gallery
├── id (UUID)
├── title (VARCHAR)
├── url (TEXT)
└── created_at (TIMESTAMP)

hero_content
├── id (UUID)
├── title (TEXT)
├── description (TEXT)
└── updated_at (TIMESTAMP)

contact_info
├── id (UUID)
├── phone (VARCHAR)
├── email (VARCHAR)
├── address (TEXT)
└── updated_at (TIMESTAMP)

contact_messages
├── id (UUID)
├── name (VARCHAR)
├── email (VARCHAR)
├── message (TEXT)
└── created_at (TIMESTAMP)
```

## API Request/Response Flow

### Example: Create Destination

**Request from Admin:**
```
POST /api/destinations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Palawan",
  "label": "Island Paradise",
  "description": "...",
  "image": "https://...",
  "rating": 4.9
}
```

**Backend Processing:**
1. Middleware verifies JWT token
2. Controller receives request data
3. Supabase inserts into destinations table
4. Database returns new record with ID

**Response:**
```
HTTP 201 Created

{
  "id": "uuid-123",
  "name": "Palawan",
  "label": "Island Paradise",
  "description": "...",
  "image": "https://...",
  "rating": 4.9,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Frontend Updates:**
1. Form clears
2. Component refetches destinations list
3. New destination appears in admin UI
4. Also appears publicly on homepage

## Email Flow (Contact Form)

```
User submits contact form
       │
       ▼
POST /api/contact/send
       │
       ▼
Backend receives name, email, message
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
   Validate         Save to DB         Send via Gmail
   required         (contact_messages   (Nodemailer)
   fields           table)              │
                                        ├─> From: your_gmail@gmail.com
                                        ├─> To: your_gmail@gmail.com
                                        ├─> Subject: New Message from [User]
                                        └─> Body: HTML formatted message
       │                                    │
       └────────────────┬────────────────────┘
                        ▼
                   Response Success
                        │
                        ▼
                Frontend shows confirmation
                "Message sent successfully!"
```

## Authentication Flow

```
├─ User visits /login
│
├─ Enters credentials
│
├─ Frontend POST /api/auth/login
│  ├─ Email
│  └─ Password
│
├─ Backend authController.login()
│  ├─ Query admin_users table by email
│  ├─ Compare password with bcrypt
│  ├─ Generate JWT token
│  └─ Return { token, user }
│
├─ Frontend stores token in localStorage
│  └─ localStorage.setItem('admin_token', token)
│
├─ Frontend updates AuthContext
│  └─ setUser(userData)
│
├─ Redirect to /admin dashboard
│
├─ All API requests include token
│  ├─ Authorization: Bearer {token}
│
├─ Backend verifies token in middleware
│  ├─ jwt.verify(token, JWT_SECRET)
│  ├─ Extracts user info
│  └─ Allows request to proceed
│
└─ On logout
   ├─ localStorage.removeItem('admin_token')
   ├─ localStorage.removeItem('admin_user')
   ├─ Redirect to home
   └─ Token no longer sent in requests
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│            PRODUCTION DEPLOYMENT                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (Vercel/Netlify)      Backend (Railway)  │
│  ├─ React App                   ├─ Express Server  │
│  ├─ Build: npm run build        ├─ Node.js         │
│  ├─ CDN Delivery                ├─ Auto Deploy     │
│  ├─ HTTPS                       └─ HTTPS           │
│  └─ Domain: www.iwander.com                        │
│                                                    │
│  Database (Supabase)                               │
│  ├─ Cloud PostgreSQL                               │
│  ├─ Automatic Backups                              │
│  ├─ HTTPS APIs                                     │
│  └─ Row Level Security                             │
│                                                    │
│  Email Service (Gmail)                             │
│  ├─ SMTP Relay                                     │
│  ├─ App-Specific Password                          │
│  └─ No username/password in code                   │
│                                                    │
└─────────────────────────────────────────────────────┘
```

## Environment Variables

```
Frontend (.env)
├─ VITE_API_URL = Backend API base URL

Backend (.env)
├─ PORT = 5000
├─ SUPABASE_URL = Database endpoint
├─ SUPABASE_KEY = API key
├─ JWT_SECRET = Token signing key
├─ GMAIL_EMAIL = Sender email
└─ GMAIL_PASSWORD = Gmail app password
```

This architecture ensures:
- ✅ Scalability
- ✅ Security (JWT, password hashing, env variables)
- ✅ Separation of concerns
- ✅ Easy maintenance
- ✅ Production-ready
