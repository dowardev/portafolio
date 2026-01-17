# Portafolio Backend

Backend API for the web portfolio. Manages posts, images, users, and business functionality. Authentication is delegated to the **SSO Server**.

---

> **⚠️ IMPORTANT NOTE - PRODUCTION ENVIRONMENT**
>
> Examples in this document use `localhost:8003` and development domains.
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
│            Sends Bearer Token in Authorization header            │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PORTAFOLIO BACKEND                           │
│                   https://api.miapp.com                          │
│                              │                                   │
│           Middleware SSOTokenAuth                               │
│                  │           │                                   │
│                  └─────┬─────┘                                   │
│                        ▼                                         │
│              GET https://sso.miapp.com/api/me                    │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   https://sso.miapp.com/api                      │
│                    (                           │
└────────────────────────────────Only handles auth)─────────────────────────────────┘
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
APP_URL=http://localhost:8003

# Database (SQLite by default)
DB_CONNECTION=sqlite

# SSO Server URL - REQUIRED for authentication
SSO_URL=http://localhost:8002/api
```

### Critical Variables Description

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `SSO_URL` | Base URL of the SSO Server | `http://localhost:8002/api` |

**This variable is REQUIRED** for protected routes to work.

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
php artisan serve --port=8003
```

---

## Production Configuration

> **IMPORTANT:** All `localhost:8003` values must be replaced with your real domain.

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
| `APP_URL` | `http://localhost:8003` | `https://api.miapp.com` |
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `DB_CONNECTION` | `sqlite` | `mysql` |
| `SSO_URL` | `http://localhost:8002/api` | `https://sso.miapp.com/api` |

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

## SSO Authentication Middleware

This project includes a custom middleware `SSOTokenAuth` that:

1. Extracts token from `Authorization: Bearer {token}` header
2. Makes HTTP request to SSO Server to validate token
3. If valid, adds user data to `$request->sso_user`

### Location

```
app/Http/Middleware/SSOTokenAuth.php
```

### Implementation

```php
class SSOTokenAuth
{
    protected string $ssoUrl;

    public function __construct()
    {
        // Read SSO_URL from .env
        $this->ssoUrl = rtrim(config('app.sso_url', env('SSO_URL', 'http://localhost:8002/api')), '/');
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        try {
            // Validate token with SSO Server
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $token,
            ])->get($this->ssoUrl . '/me');

            if ($response->failed()) {
                return response()->json(['message' => 'Invalid token'], 401);
            }

            $ssoUser = $response->json();
            $request->merge(['sso_user' => $ssoUser]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error validating token with SSO'], 500);
        }

        return $next($request);
    }
}
```

### Route Usage

```php
use App\Http\Middleware\SSOTokenAuth;

// In routes/api.php
Route::middleware([SSOTokenAuth::class])->group(function () {
    Route::get('/user-auth', [AuthController::class, 'user']);
    Route::post('/new-post', [PostsController::class, 'createPost']);
});
```

### Getting Authenticated User in Controllers

```php
public function createPost(Request $request)
{
    // Get user data from SSO
    $ssoUser = $request->get('sso_user');
    
    // $ssoUser = ['id' => 5, 'name' => 'Admin', 'email' => 'admin@admin.com', ...]
    
    $post = Post::create([
        'title' => $request->title,
        'content' => $request->content,
        'user_id' => $ssoUser['id'],  // Relation with SSO user
    ]);
    
    return $post;
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
>>> Http::get('http://localhost:8003/api/posts/2026-01-16/all')
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
│   └── Middleware/          # SSOTokenAuth.php (validates SSO tokens)
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
| `AuthController` | Endpoints `/user-auth` and `/login-status` |
| `PostsController` | Posts CRUD and date handling |
| `ImagesController` | Image upload |
| `ContactController` | Contact form |

---

## API Routes - Usage Examples (Development)

### Protected Endpoints (require `Authorization: Bearer {token}`)

```bash
# Get authenticated user from SSO
curl http://localhost:8003/api/user-auth \
  -H "Authorization: Bearer 1|abc123xyz..."

# Create post associated with SSO user
curl -X POST http://localhost:8003/api/new-post \
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
curl http://localhost:8003/api/posts/2026-01-16/all

# Get single post
curl http://localhost:8003/api/post/1

# Search posts
curl http://localhost:8003/api/search-posts/laravel

# Upload image
curl -X POST http://localhost:8003/api/upload-image \
  -F "image=@/path/to/image.jpg"

# Send contact form
curl -X POST http://localhost:8003/api/contact \
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
| Portafolio Backend | 8003 | `http://localhost:8003` |
| SSO Server | 8002 | `http://localhost:8002/api` |

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
