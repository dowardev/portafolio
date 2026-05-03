# Portafolio Backend

Backend API for the web portfolio. Manages posts, images, users, and business functionality. Authentication is delegated to the **SSO Server**.

---

> **⚠️ IMPORTANT NOTE - PRODUCTION ENVIRONMENT**
>
> Examples in this document use `localhost:8000` and development domains.
> **In production, replace all local values with your actual domains.**
>
> See the "[Production Configuration](#production-configuration)" section below.

---

## Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Ionic/Vue)                        │
│                   https://miapp.com                              │
│                              │                                   │
│   1. Generates DPoP key pair (RSA) on login                     │
│   2. Sends public key to SSO Server                             │
│   3. Receives JWT with cnf.jkt (JWK thumbprint)                 │
│   4. Sends JWT + DPoP proof in every request                    │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PORTAFOLIO BACKEND                           │
│                   https://api.miapp.com                          │
│                              │                                   │
│   1. Validates JWT signature with JWKS from SSO                 │
│   2. Validates DPoP proof (binds token to client key)            │
│   3. Verifies jkt in token matches DPoP proof                   │
│                              │                                   │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   https://sso.miapp.com/api                      │
│                              │                                   │
│   1. Issues JWT with cnf.jkt (JWK thumbprint of client key)      │
│   2. Provides JWKS endpoint for public key verification          │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

- Laravel 11
- Laravel Sanctum (external SSO communication)
- SQLite (development) / MySQL (production)
- HTTP Client for SSO Server communication

---

## Development Configuration

### .env File

Create `.env` file with the following variables:

```env
APP_NAME=Portafolio Backend
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite by default)
DB_CONNECTION=sqlite

# SSO Server URL - REQUIRED for authentication
SSO_URL=http://localhost:8001/api
```

### Critical Variables Description

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `SSO_URL` | Base URL of the SSO Server | `http://localhost:8001/api` |
| `SSO_JWT_ISSUER` | JWT issuer for token validation | `http://localhost:8001` |

**These variables are REQUIRED** for protected routes to work.

---

## SSO Configuration

This application delegates authentication to an external SSO Server. The SSO Server must be configured and running separately before the application can authenticate users.

### Prerequisites

- **SSO Server**: You need a running SSO Server. This can be the default project at `../portafolio/` or any compatible OAuth2/OIDC server.
- **SSO Endpoints**: The backend communicates with these SSO endpoints:
  - `GET {SSO_URL}/me` - Validate token and get user data
  - `GET {SSO_URL}/.well-known/jwks.json` - Fetch public keys for JWT validation (if using JWT middleware)

### SSO Middleware

This project includes two authentication middlewares:

| Middleware | File | Description |
|------------|------|-------------|
| `SSOTokenAuth` | `app/Http/Middleware/SSOTokenAuth.php` | Simple token validation via SSO API |
| `LocalJwtAuth` | `app/Http/Middleware/LocalJwtAuth.php` | Full JWT validation with JWKS, DPoP, and role fetching |

The active middleware is defined in `bootstrap/app.php`. By default, it uses `sso.auth` which maps to `LocalJwtAuth`.

### Required .env Variables

```env
# SSO Server URL (REQUIRED)
# Base URL of the SSO server API
SSO_URL=http://localhost:8001/api
```

### Variable Descriptions

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SSO_URL` | Yes | Base URL of the SSO Server API | `http://localhost:8001/api` |
| `SSO_JWT_ISSUER` | Yes* | Issuer for JWT token validation | `http://localhost:8001` |

*Required when using `LocalJwtAuth` middleware. Check `bootstrap/app.php` to see which middleware is active.

### Getting the SSO Server

If you don't have an SSO Server running:

1. Navigate to the SSO project: `cd ../portafolio/`
2. Follow the SSO Server README for installation
3. Ensure the SSO Server is running and accessible
4. Update `SSO_URL` and `SSO_JWT_ISSUER` in your `.env` file

### Testing SSO Configuration

```bash
# Test SSO connectivity
php artisan tinker
>>> Http::get('http://localhost:8001/api/me')

# View current SSO configuration
php artisan env | grep SSO
```

---

### Installation

```bash
# Install dependencies
composer install

# Configure database
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start server
php artisan serve --port=8000
```

---

## Production Configuration

> **IMPORTANT:** All `localhost:8000` values must be replaced with your real domain.

### .env.production File

```env
APP_NAME=Portafolio Backend
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.miapp.com

# MySQL database in production
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portafolio_backend
DB_USERNAME=portafolio_user
DB_PASSWORD=your_secure_password_here

# SSO Server URL - REQUIRED
SSO_URL=https://sso.miapp.com/api
```

### Required Changes for Production

| Configuration | Development | Production |
|---------------|-------------|------------|
| `APP_URL` | `http://localhost:8000` | `https://api.miapp.com` |
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `DB_CONNECTION` | `sqlite` | `mysql` |
| `SSO_URL` | `http://localhost:8001/api` | `https://sso.miapp.com/api` |

### DNS and SSL

1. **DNS:** Configure A or CNAME record for `api.miapp.com` → Server IP
2. **SSL:** Obtain SSL certificate (Let's Encrypt or commercial)
3. **Redirect:** Configure HTTP → HTTPS on web server

### Web Server Configuration (NGINX)

```nginx
server {
    server_name api.miapp.com;
    root /var/www/portafolio-backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

---

## Useful Artisan Commands

```bash
# View registered routes
php artisan route:list

# Clear configuration cache
php artisan config:clear

# View environment info
php artisan env

# Run migrations
php artisan migrate

# Create migration
php artisan make:migration your_migration_name

# Create model with migration and controller
php artisan make:model Post -mc

# Test endpoint locally
php artisan tinker
>>> Http::get('http://localhost:8000/api/posts/2026-01-16/all')
```

---

## Laravel Directory Structure

```
app/
├── Console/                 # Custom Artisan commands
├── Exceptions/              # Exception handling
├── Http/
│   ├── Controllers/         # Controllers (AuthController, PostsController)
│   ├── Kernel.php           # Middleware definitions
│   └── Middleware/          # SSOTokenAuth.php, LocalJwtAuth.php (SSO authentication)
├── Models/                  # Eloquent Models (Post, etc.)
└── Providers/               # Service Providers

bootstrap/                   # Bootstrap files
config/                      # Configuration files (app.php, database.php)
database/
├── migrations/              # Database migrations
└── seeders/                 # Seeders for initial data

routes/
├── api.php                  # API routes (protected and public)
├── console.php              # Command routes
└── web.php                  # Web routes

storage/
├── app/                     # User uploaded files
├── framework/               # Cache, sessions, views
└── logs/                    # Application logs
```

---

## Models

Models follow the Eloquent standard:

```php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'content', 'user_id', 'date', 'slug'];
    
    // Relation with SSO user (no local users table)
    public function user()
    {
        // The user_id relates to the user ID in SSO
        // No local User model, use $request->sso_user
    }
}
```

---

## Main Controllers

| Controller | Description |
|------------|-------------|
| `AuthController` | Endpoint `/user-auth` for authenticated user |
| `PostsController` | Posts CRUD and date handling |
| `ImagesController` | Image upload |
| `ContactController` | Contact form |

---

## API Routes - Usage Examples (Development)

### Protected Endpoints (require `Authorization: Bearer {token}`)

```bash
# Get authenticated user from SSO
curl http://localhost:8000/api/user-auth \
  -H "Authorization: Bearer 1|abc123xyz..."

# Create post associated with SSO user
curl -X POST http://localhost:8000/api/new-post \
  -H "Authorization: Bearer 1|abc123xyz..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "Post content...",
    "date": "2026-01-17"
  }'
```

### Public Endpoints

```bash
# List posts
curl http://localhost:8000/api/posts/2026-01-16/all

# Get single post
curl http://localhost:8000/api/post/1

# Search posts
curl http://localhost:8000/api/search-posts/laravel

# Upload image
curl -X POST http://localhost:8000/api/upload-image \
  -F "image=@/path/to/image.jpg"

# Send contact form
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@email.com", "message": "Hello"}'
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user-auth` | Get logged-in user data |
| POST | `/api/new-post` | Create post (SSO user relation) |
| GET | `/api/users` | List users (admin) |
| POST | `/api/update-user-status` | Enable/disable user |
| POST | `/api/admin/delete-user` | Delete user (admin) |
| POST | `/api/admin/update-user-account` | Update account (admin) |

## Public Routes (no authentication required)

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
| POST | `/api/contact` | Send contact message |
| POST | `/api/feedback` | Send feedback |

---

## Frontend Integration

The Ionic frontend connects to this backend for all operations except authentication:

```typescript
// Frontend uses these endpoints
await apiConnector.get({ url: 'posts/2026-01-16/all' });
await apiConnector.post({ url: 'new-post', data: {...} });
await apiConnector.get({ url: 'user-auth' });  // Validates token with SSO
```

---

## SSO Server Integration

The portfolio backend communicates with the SSO Server to validate tokens. This communication is **internal between backends** and is transparent to the frontend.

### Consumed SSO Endpoints

| SSO Endpoint | Purpose |
|--------------|---------|
| `GET {SSO_URL}/me` | Validate token and get user data |

### Default Ports (Development)

| Service | Port | URL |
|---------|------|-----|
| Portafolio Backend | 8000 | `http://localhost:8000` |
| SSO Server | 8001 | `http://localhost:8001/api` |

---

## Deployment Checklist

- [ ] Configure domain and DNS (`api.miapp.com`)
- [ ] Obtain SSL certificate
- [ ] Configure MySQL database
- [ ] Set secure credentials in `.env`
- [ ] Configure `SSO_URL` with production SSO URL
- [ ] Disable `APP_DEBUG`
- [ ] Configure job queue if needed
- [ ] Configure logs and monitoring
- [ ] Configure CORS to allow only necessary domains
- [ ] Test complete flow: login → access protected resources
- [ ] Configure rate limiting for public endpoints
