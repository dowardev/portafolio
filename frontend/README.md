# Web Portfolio

This project consists of a web and mobile application (Android), as well as a PWA, designed for developers. It allows showcasing knowledge and completed projects, in addition to offering an editor to publish blog content.

## Demo

You can access the production application at: [Production App](https://dowar.xyz)

---

> **⚠️ IMPORTANT NOTE - PRODUCTION ENVIRONMENT**
>
> Examples in this document use `localhost:8000` and development domains.
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
│   1. Generates DPoP key pair (RSA) on login                    │
│   2. Sends public key to SSO Server to register                 │
│   3. Receives JWT with cnf.jkt (JWK thumbprint)                 │
│   4. Creates DPoP proof (JWT signed with private key)            │
│   5. Sends JWT + DPoP proof in every API request                │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PORTAFOLIO BACKEND                           │
│                   https://api.miapp.com                          │
│                              │                                   │
│   1. Validates JWT signature using JWKS from SSO                │
│   2. Validates DPoP proof (binds token to client's private key) │
│   3. Verifies jkt in token matches DPoP proof's public key      │
│                              │                                   │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   https://sso.miapp.com/api                      │
│                              │                                   │
│   1. Stores client public key                                    │
│   2. Issues JWT with cnf.jkt (JWK thumbprint)                   │
│   3. Provides JWKS at /.well-known/jwks.json                    │
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
VITE_API_URL=http://localhost:8000/api/

# SSO Server URL (REQUIRED)
VITE_SSO_URL=http://localhost:8001/api/

# SSO Frontend URL (REQUIRED)
# Used for OAuth redirects after login/logout
VITE_SSO_FRONTEND_URL=http://localhost:8101

# SSO Client ID (REQUIRED)
# Client identifier for OAuth flow
VITE_SSO_CLIENT_ID=main-app
```

### Variables Description

| Variable | Required | Description | Default Value |
|----------|----------|-------------|---------------|
| `VITE_API_URL` | Yes | Base URL of portfolio backend | `http://localhost:8000/api/` |
| `VITE_SSO_URL` | Yes | Base URL of SSO server API | `http://localhost:8001/api/` |
| `VITE_SSO_FRONTEND_URL` | Yes | Frontend URL of SSO for redirects | `http://localhost:8101` |
| `VITE_SSO_CLIENT_ID` | Yes | OAuth client identifier | `main-app` |

---

## SSO Configuration

This frontend authenticates users through an external SSO Server. The SSO Server must be running and accessible for login/logout to work.

### Prerequisites

- **SSO Server**: A running SSO Server (default project at `../portafolio/`)
- **SSO Frontend**: The frontend component of the SSO (login page, OAuth handler)
- **Client ID**: A valid OAuth client registered in the SSO Server

### How SSO Works in Frontend

1. User clicks login → redirected to SSO Server frontend (`VITE_SSO_FRONTEND_URL`)
2. User authenticates with credentials
3. SSO Server redirects back with authorization code
4. Frontend exchanges code for access token
5. Token is stored and sent with API requests as `Authorization: Bearer {token}`

### SSO Endpoints Used

| Action | SSO Endpoint | Purpose |
|--------|--------------|---------|
| Login | `POST {VITE_SSO_URL}/login` | Authenticate user |
| Register | `POST {VITE_SSO_URL}/register` | Create new user |
| Logout | `POST {VITE_SSO_URL}/logout` | Invalidate session |
| Get User | `GET {VITE_SSO_URL}/user-auth` | Get current user data |

### Getting the SSO Server

If you don't have an SSO Server running:

1. Navigate to the SSO project: `cd ../portafolio/`
2. Follow the SSO Server documentation for installation
3. Register your client and obtain the `VITE_SSO_CLIENT_ID`
4. Configure `VITE_SSO_URL`, `VITE_SSO_FRONTEND_URL` in your `.env` file

### Testing SSO Configuration

```bash
# Verify environment variables are loaded
# Check browser console after running the app
ionic s
```

Look for any authentication errors in the browser console if SSO URLs are incorrect.

---

## Production Configuration

> **IMPORTANT:** All `localhost:8000` values must be replaced with your real domain.

### .env.production File

```env
# Production Portafolio Backend URL
VITE_API_URL=https://api.miapp.com/api/

# Production SSO Server URL
VITE_SSO_URL=https://sso.miapp.com/api/

# Production SSO Frontend URL
VITE_SSO_FRONTEND_URL=https://sso.miapp.com

# Production SSO Client ID
VITE_SSO_CLIENT_ID=main-app
```

### Required Changes for Production

| Configuration | Development | Production |
|---------------|-------------|------------|
| `VITE_API_URL` | `http://localhost:8000/api/` | `https://api.miapp.com/api/` |
| `VITE_SSO_URL` | `http://localhost:8001/api/` | `https://sso.miapp.com/api/` |
| `VITE_SSO_FRONTEND_URL` | `http://localhost:8101` | `https://sso.miapp.com` |
| `VITE_SSO_CLIENT_ID` | `main-app` | Your production client ID |

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

## Running

### Development

```bash
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
