# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All admin routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /auth/login
Login with admin credentials and get JWT token.

**Request:**
```json
{
  "email": "admin@iwander.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "admin@iwander.com"
  }
}
```

---

### Destinations

#### GET /destinations
Get all destinations. **Public access**

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Boracay Island",
    "label": "Beach Paradise",
    "description": "...",
    "image": "https://...",
    "rating": 4.8,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /destinations/:id
Get a single destination. **Public access**

#### POST /destinations
Create a new destination. **Requires authentication**

**Request:**
```json
{
  "name": "Boracay Island",
  "label": "Beach Paradise",
  "description": "Describe the destination...",
  "image": "https://example.com/image.jpg",
  "rating": 4.8
}
```

#### PUT /destinations/:id
Update a destination. **Requires authentication**

**Request:** Same as POST

#### DELETE /destinations/:id
Delete a destination. **Requires authentication**

---

### Gallery

#### GET /gallery
Get all gallery photos. **Public access**

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Sunset at Boracay",
    "url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /gallery
Upload a new gallery photo. **Requires authentication**

**Request:**
```json
{
  "title": "Sunset at Boracay",
  "url": "https://example.com/photo.jpg"
}
```

#### DELETE /gallery/:id
Delete a gallery photo. **Requires authentication**

---

### Hero Section

#### GET /hero
Get hero section content. **Public access**

**Response:**
```json
{
  "id": "uuid",
  "title": "Explore The Islands of The Philippines",
  "description": "Discover the stunning beaches...",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /hero
Update hero section. **Requires authentication**

**Request:**
```json
{
  "title": "New Title",
  "description": "New description"
}
```

---

### Contact

#### GET /contact
Get contact information. **Public access**

**Response:**
```json
{
  "id": "uuid",
  "phone": "+63 917 123 4567",
  "email": "info@iwanderph.com",
  "address": "Manila, Philippines"
}
```

#### PUT /contact
Update contact information. **Requires authentication**

**Request:**
```json
{
  "phone": "+63 917 123 4567",
  "email": "info@iwanderph.com",
  "address": "Manila, Philippines"
}
```

#### POST /contact/send
Send a contact message (triggers email). **Public access**

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I would like to inquire about..."
}
```

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "message": "Invalid token"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iwander.com",
    "password": "your_password"
  }'
```

### Get All Destinations
```bash
curl http://localhost:5000/api/destinations
```

### Create Destination (with token)
```bash
curl -X POST http://localhost:5000/api/destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Palawan",
    "label": "Island Paradise",
    "description": "...",
    "image": "https://...",
    "rating": 4.9
  }'
```

### Send Contact Message
```bash
curl -X POST http://localhost:5000/api/contact/send \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like more information..."
  }'
```
