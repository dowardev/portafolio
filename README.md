# Mi Portafolio

Full-stack platform for software development professionals. Includes responsive web interface, Android mobile application and PWA support. Allows showcasing technical knowledge, completed projects, and a content management system for blog publications.

## Demo

Access the production application at: [Production App](https://dowar.xyz)

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Ionic/Vue)                        │
│                   [direccion]:[puerto]                          │
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
│                   [direccion]:[puerto]                         │
│                              │                                   │
│   1. Validates JWT signature using JWKS from SSO                 │
│   2. Validates DPoP proof (binds token to private key)           │
│   3. Verifies jkt in token matches DPoP public key              │
│                              │                                   │
└──────────────────────────────┬──────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   [direccion]:[puerto]                         │
│                              │                                   │
│   1. Stores client public key                                    │
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
- Laravel Passport (OAuth2 token infrastructure)
- lcobucci/jwt (JWT validation & DPoP proof verification)
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
│   └── android/       # Android project (Capacitor)
├── backend/           # Laravel API
└── README.md          # This file
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

    Only the SSO-related variables are listed here. For the complete list, see the [Development Configuration](#development-configuration) section.

    **Frontend** (`.env`):

    | Variable | Descripción | Ejemplo |
    |----------|-------------|---------|
    | `VITE_SSO_URL` | URL de la API del SSO Server | `[direccion]:[puerto]/api` |
    | `VITE_SSO_FRONTEND_URL` | URL del frontend web del SSO (login visual) | `[direccion]:[puerto]` |
    | `VITE_SSO_CLIENT_ID` | ID del cliente registrado en el SSO | `main-app` |

    **Backend** (`.env`):

    | Variable | Descripción | Ejemplo |
    |----------|-------------|---------|
    | `SSO_URL` | URL de la API del SSO Server | `[direccion]:[puerto]/api` |

3. **Register client in SSO**:
    ```bash
    curl -X POST [direccion]:[puerto]/api/admin/clients \
      -H "Authorization: Bearer {admin_token}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Mi Portafolio",
        "client_id": "main-app",
        "redirect_url": "[direccion]:[puerto]/auth/callback",
        "active": true
      }'
    ```

### Complete Documentation
For complete SSO Server details, see the SSO Server documentation.

> **Note:** The SSO Server is a separate service. Make sure it is running before starting the backend or frontend. See the [SSO Server prerequisites](#sso-server-external-service) section above.

---

## Installation

### 1. SSO Server (First)

Make sure the SSO Server is running. For setup instructions, consult the SSO Server documentation.

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

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `APP_URL` | URL donde corre el backend | `[direccion]:[puerto]` |
| `DB_CONNECTION` | Driver de base de datos (sqlite/mysql) | `sqlite` |

### Frontend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend Laravel | `[direccion]:[puerto]/api` |

---

## How to Run

### Development (all services)

```bash
# Terminal 1: SSO Server
cd ../sso/back
php artisan serve --port=8001

# Terminal 2: Backend
cd backend
php artisan serve --port=8000

# Terminal 3: Frontend
cd frontend
ionic s
```

---

## APK Generation (Android)

### Testing

```bash
cd frontend/android
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

## License

This project is developed under the GPL 3 license.