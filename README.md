# Mi Portafolio

Full-stack platform for software development professionals. Includes responsive web interface, Android mobile application and PWA support. Allows showcasing technical knowledge, completed projects, and a content management system for blog publications.

## Demo

Access the production application at: [Production App](https://dowar.xyz)

---

> **⚠️ IMPORTANT NOTE - PRODUCTION ENVIRONMENT**
>
> Examples in this document use `localhost` and development domains.
> **In production, replace all local values with your actual domains.**
>
> See the "[Production Configuration](#production-configuration)" section below.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Ionic/Vue)                        │
│                   https://miapp.com                              │
│                              │                                   │
│   1. Generates DPoP key pair (RSA) on login                     │
│   2. Sends public key to SSO Server                             │
│   3. Receives JWT with cnf.jkt (JWK thumbprint)                 │
│   4. Creates DPoP proof (JWT signed with private key)          │
│   5. Sends JWT + DPoP proof in every API request                │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PORTAFOLIO BACKEND                            │
│                   https://api.miapp.com                          │
│                              │                                   │
│   1. Validates JWT signature using JWKS from SSO               │
│   2. Validates DPoP proof (binds token to private key)         │
│   3. Verifies jkt in token matches DPoP public key              │
│                              │                                   │
└──────────────────────────────┬──────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   https://sso.miapp.com/api                      │
│                              │                                   │
│   1. Stores client public key                                   │
│   2. Issues JWT with cnf.jkt (JWK thumbprint)                  │
│   3. Provides JWKS at /.well-known/jwks.json                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- Ionic Framework
- Vue.js 3
- Capacitor.js
- Vite
- Pinia (state management)
- Axios (HTTP client)

### Backend
- Laravel 11
- Laravel Sanctum (SSO communication)
- SQLite (development) / MySQL (production)

### External
- SSO Server (centralized authentication)

---

## Prerequisites

- Node.js LTS
- pnpm (package manager)
- PHP 8.2+
- Composer
- MySQL (production) / SQLite (development)
- **SSO Server** running (see section below)

---

## Project Structure

```
portafolio/
├── frontend/          # Ionic/Vue application (web, mobile, PWA)
├── backend/          # Laravel API
└── README.md         # This file
```

---

## SSO Server (External Service)

The SSO Server is a **separate external service** that provides centralized authentication for multiple applications.

### Purpose
- Manages users and sessions centrally
- Issues JWT tokens for client applications
- Provides login, registration and token validation endpoints

### How to Integrate

1. **Get the SSO Server**:
   ```bash
   cd ../sso/back
   # Follow installation instructions in its README
   ```

2. **Configure environment variables**:

   **Frontend** (`.env`):
   ```env
   VITE_SSO_URL=http://localhost:8002/api/
   VITE_SSO_FRONTEND_URL=http://localhost:8102
   VITE_SSO_CLIENT_ID=main-app
   ```

   **Backend** (`.env`):
   ```env
   SSO_URL=http://localhost:8002/api
   ```

3. **Register client in SSO**:
   ```bash
   curl -X POST http://localhost:8002/api/admin/clients \
     -H "Authorization: Bearer {admin_token}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Mi Portafolio",
       "client_id": "main-app",
       "redirect_url": "https://miapp.com/callback",
       "active": true
     }'
   ```

### Complete Documentation
For complete SSO Server details, see: `../sso/back/README.md`

---

## Installation

### 1. SSO Server (First)

See previous section or consult `../sso/back/README.md`.

### 2. Backend

```bash
cd backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start server
php artisan serve --port=8000
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
pnpm i

# Start development server
pnpm run dev
# or
ionic s
```

---

## Development Configuration

### Backend (.env)

```env
APP_NAME=Portafolio Backend
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

SSO_URL=http://localhost:8002/api
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api/
VITE_SSO_URL=http://localhost:8002/api/
VITE_SSO_FRONTEND_URL=http://localhost:8102
VITE_SSO_CLIENT_ID=main-app
```

---

## Production Configuration

> **IMPORTANT:** All `localhost` values must be replaced with your actual domain.

### Required Changes

| Configuration | Development | Production |
|---------------|------------|------------|
| **Frontend** |
| `VITE_API_URL` | `http://localhost:8000/api/` | `https://api.miapp.com/api/` |
| `VITE_SSO_URL` | `http://localhost:8002/api/` | `https://sso.miapp.com/api/` |
| `VITE_SSO_FRONTEND_URL` | `http://localhost:8102` | `https://sso.miapp.com` |
| **Backend** |
| `APP_URL` | `http://localhost:8000` | `https://api.miapp.com` |
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `DB_CONNECTION` | `sqlite` | `mysql` |
| `SSO_URL` | `http://localhost:8002/api` | `https://sso.miapp.com/api` |

### Production Build

```bash
# Frontend
cd frontend
ionic build --prod

# Files are generated in the 'dist' directory
```

---

## How to Run

### Development (all services)

```bash
# Terminal 1: SSO Server
cd ../sso/back
php artisan serve --port=8002

# Terminal 2: Backend
cd portafolio/backend
php artisan serve --port=8000

# Terminal 3: Frontend
cd portafolio/frontend
ionic s
```

### Production

1. Compile frontend: `ionic build --prod`
2. Deploy `dist/` to your web server
3. Configure backend on server with MySQL
4. Configure DNS and SSL

---

## API Endpoints

### Protected Endpoints (require `Authorization: Bearer {token}`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user-auth` | Get authenticated user |
| POST | `/api/new-post` | Create post (SSO user relation) |
| GET | `/api/users` | List users (admin) |
| POST | `/api/update-user-status` | Enable/disable user |
| POST | `/api/admin/delete-user` | Delete user (admin) |
| POST | `/api/admin/update-user-account` | Update account (admin) |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/{date}/{filter}` | List posts |
| GET | `/api/post-dates` | Post dates |
| GET | `/api/post/{id}` | Get single post |
| GET | `/api/search-posts/{search}` | Search posts |
| POST | `/api/create-post` | Create public post |
| POST | `/api/update-post` | Update post |
| POST | `/api/delete-post` | Delete post |
| POST | `/api/upload-image` | Upload image |
| POST | `/api/contact` | Send contact form |
| POST | `/api/feedback` | Send feedback |

---

## APK Generation (Android)

### Testing

```bash
cd Android
./gradlew assembleDebug
# APK at: app/build/outputs/apk/debug/
```

### Production

```bash
ionic cap open android
# Configure signing and generate release build
```

---

## Useful Commands

```bash
# Backend
php artisan route:list          # List registered routes
php artisan config:clear        # Clear configuration cache
php artisan migrate             # Run migrations

# Frontend
ionic build                     # Production build
pnpm run dev                    # Development server
```

---

## Deployment Checklist

- [ ] Configure domains (`miapp.com`, `api.miapp.com`, `sso.miapp.com`)
- [ ] Obtain SSL certificates
- [ ] Configure MySQL in production
- [ ] Update `.env` with production URLs
- [ ] Compile frontend production build
- [ ] Deploy frontend to web server
- [ ] Deploy backend to server
- [ ] Configure security headers (CORS, CSP)
- [ ] Test complete authentication flow
- [ ] Configure service worker for PWA (if applicable)
- [ ] Configure rate limiting for public endpoints
- [ ] Configure logs and monitoring

---

## License

This project is developed under the GPL 3 license.