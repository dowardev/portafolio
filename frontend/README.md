# Web Portfolio

This project consists of a web and mobile application (Android), as well as a PWA, designed for developers. It allows showcasing knowledge and completed projects, in addition to offering an editor to publish blog content.

## Demo

You can access the production application at: [Production App](https://dowar.xyz)

---

> **⚠️ IMPORTANT NOTE - PRODUCTION ENVIRONMENT**
>
> Examples in this document use `localhost:8003` and development domains.
> **In production, replace all local values with your actual domains.**
>
> See the "[Production Configuration](#production-configuration)" section below.

---

## Tech Stack

- Ionic Framework
- Vue.js 3
- Capacitor.js
- Vite
- Pinia (state management)
- Axios (HTTP client)

## Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Ionic/Vue)                        │
│                   https://miapp.com                              │
│                              │                                   │
│            Sends Bearer Token in all requests                   │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PORTAFOLIO BACKEND                           │
│                   https://api.miapp.com                          │
│                              │                                   │
│              Validates token with SSO Server                    │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   https://sso.miapp.com/api                      │
└─────────────────────────────────────────────────────────────────┘
```

## Requirements

- Node.js LTS
- pnpm (package manager)
- [SSO Server](../sso-server/README.md) running
- [Portafolio Backend](../backend/README.md) running

## Installation

```bash
# Install dependencies
pnpm i
```

---

## Development Configuration

### .env File

Create `.env` file in the project root:

```env
# Portafolio Backend URL (main API)
VITE_API_URL=http://localhost:8003/api/

# SSO Server URL
VITE_SSO_URL=http://localhost:8002/api/
```

### Variables Description

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_URL` | Base URL of portfolio backend | `http://localhost:8003/api/` |
| `VITE_SSO_URL` | Base URL of SSO server | `http://localhost:8002/api/` |

---

## Production Configuration

> **IMPORTANT:** All `localhost:8003` values must be replaced with your real domain.

### .env.production File

```env
# Production Portafolio Backend URL
VITE_API_URL=https://api.miapp.com/api/

# Production SSO Server URL
VITE_SSO_URL=https://sso.miapp.com/api/
```

### Required Changes for Production

| Configuration | Development | Production |
|---------------|-------------|------------|
| `VITE_API_URL` | `http://localhost:8003/api/` | `https://api.miapp.com/api/` |
| `VITE_SSO_URL` | `http://localhost:8002/api/` | `https://sso.miapp.com/api/` |

### Production Build

```bash
# Generate production build
ionic build --prod

# Files are generated in the 'dist' directory
```

### Deploying the Build

Copy the contents of the `dist` directory to your web server or hosting service (Vercel, Netlify, self-hosted, etc.).

### Web Server Configuration

If deploying on your own server:

```nginx
server {
    server_name miapp.com www.miapp.com;
    root /var/www/miapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configure security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

---

## SSO Endpoints Used (Development)

The frontend connects directly to the SSO for:

| Action | SSO Endpoint | Function |
|--------|--------------|---------|
| Register | `POST {VITE_SSO_URL}/register` | `userController.createUserAccount()` |
| Login | `POST {VITE_SSO_URL}/login` | `userController.login()` |
| Get User | `GET {VITE_SSO_URL}/user-auth` | `userService.getUser()` |
| Logout | `POST {VITE_SSO_URL}/logout` | `MenuComponent.logout()` |

### Usage Example (Development)

```bash
# Login
curl -X POST http://localhost:8002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"123"}'

# Response
# {"user": {...}, "token": "1|abc123xyz..."}
```

---

## Running

### Development

```bash
# Port 8003
ionic s
# or
pnpm run dev
```

### Production

```bash
ionic build --prod
```

The contents of the `dist` directory should be deployed to the web server.

---

## APK Generation

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

## Deployment Checklist

- [ ] Configure domains (`miapp.com`, `api.miapp.com`, `sso.miapp.com`)
- [ ] Obtain SSL certificates
- [ ] Update `.env` with production URLs
- [ ] Compile production build
- [ ] Deploy to server or CDN
- [ ] Configure security headers (CORS, CSP, etc.)
- [ ] Test complete authentication flow
- [ ] Configure service worker for PWA (if applicable)

---

## License

This project is developed under the GPL 3 license.
