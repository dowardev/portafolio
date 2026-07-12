# Deployment Guide

This guide covers deploying the Portfolio application on traditional hosting (shared hosting, VPS, or dedicated server).

> **Note:** These instructions assume your local development environment is ready. The server only needs to serve the compiled files.
>
> Deploy can be done **manually** (SSH/FTP, documented here) or **automatically** via GitLab CI/CD with tags (see section 9).
>
> For a detailed step-by-step checklist, see [backend/DEPLOYMENT_CHECKLIST.md](backend/DEPLOYMENT_CHECKLIST.md).

---

## 1. Prerequisites

- PHP 8.2+
- Composer
- Node.js
- Ionic CLI
- MySQL database (provided by your hosting)
- Domain pointing to your hosting

---

## 2. Backend Deployment

### 1. Install Dependencies

```bash
cd backend
composer install --no-dev --optimize-autoloader
```

### 2. Configure Environment

Create the `backend/.env.production` file from the example and configure it with production values:

```bash
cp .env.production.example .env.production
```

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Application name | `Portfolio` |
| `APP_ENV` | Environment | `production` |
| `APP_DEBUG` | Debug mode (false in prod) | `false` |
| `APP_URL` | Backend URL | `https://api.dowar.xyz` |
| `DB_CONNECTION` | Database driver | `mysql` |
| `DB_HOST` | MySQL host | `[mysql_host_from_provider]` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_DATABASE` | Database name | `[database_name]` |
| `DB_USERNAME` | Database user | `[database_user]` |
| `DB_PASSWORD` | Database password | `[database_password]` |
| `SESSION_DRIVER` | Session driver | `database` |
| `MAIL_MAILER` | Mail driver | `smtp` |
| `MAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP user | `[your_email@example.com]` |
| `MAIL_PASSWORD` | SMTP password | `[your_password]` |
| `MAIL_ENCRYPTION` | Encryption (tls/ssl) | `tls` |
| `MAIL_FROM_ADDRESS` | Sender email | `noreply@dowar.xyz` |
| `MAIL_FROM_NAME` | Sender name | `Portfolio` |
| `SSO_URL` | SSO Server API URL | `https://sso.dowar.xyz/api` |

### 3. Upload Files

Upload the entire `backend/` folder to your hosting. Common paths:

- Shared hosting: `/home/[user]/[project_folder]/`
- cPanel: `/home/[user]/public_html/[project_folder]/`

### 4. Run Migrations

Run these commands on your hosting (via SSH, terminal, or hosting panel):

```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 3. Frontend Deployment

### 1. Configure Environment

Create the `frontend/.env.production` file from the example:

```bash
cp .env.production.example .env.production
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Laravel backend URL | `https://api.dowar.xyz/api` |
| `VITE_SSO_URL` | SSO Server API URL | `https://sso.dowar.xyz/api` |
| `VITE_SSO_FRONTEND_URL` | SSO web frontend URL | `https://sso.dowar.xyz` |
| `VITE_SSO_CLIENT_ID` | Client ID registered in SSO | `main-app` |

### 2. Build for Production

```bash
cd frontend
ionic build --prod
```

### 3. Upload Files

Upload the contents of `frontend/dist/` to your hosting public directory:

- Shared hosting: `/home/[user]/public_html/`
- The `index.html` and `assets/` folder must be directly accessible

---

## 4. Web Server Configuration

### Apache (.htaccess)

Place this in your public directory (where index.html is located):

```apache
RewriteEngine On

# API URL for prerender.php (change for staging overrides)
SetEnv API_URL "https://api.dowar.xyz"

# Social media bots → prerender.php (full HTML with OG/Twitter meta tags)
RewriteCond %{REQUEST_URI} ^/blog/post/[a-z0-9\-]+$ [NC]
RewriteCond %{HTTP_USER_AGENT} "facebookexternalhit|Facebot|Twitterbot|Twitter|WhatsApp|Googlebot|LinkedInBot|Slackbot|Discordbot|TelegramBot|Pinterestbot|Slurp|DuckDuckBot|Applebot|baiduspider|yandexbot|semrushbot|ahrefsbot|dotbot" [NC]
RewriteRule ^blog/post/([a-z0-9\-]+)$ /prerender.php?slug=$1 [L,QSA]

# SPA fallback (serve index.html for any non-file route)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### SEO Prerendering

Social media crawlers (Facebook, Twitter, LinkedIn, WhatsApp, Google) do not execute JavaScript. The `.htaccess` rules redirect known bot user agents to `prerender.php`, which fetches the post data from the Laravel API and generates a full HTML page with Open Graph and Twitter Card meta tags.

The `prerender.php` reads the API URL from the `API_URL` environment variable (set via `SetEnv` in `.htaccess`). The fallback is `https://api.dowar.xyz`.

Configure per environment:

| Environment | `.htaccess` SetEnv |
|-------------|-------------------|
| Production | `SetEnv API_URL "https://api.dowar.xyz"` |
| Staging | `SetEnv API_URL "https://api-staging.dowar.xyz"` |

The site URL (used for `og:url`) is auto-detected from `HTTP_HOST`, so no additional configuration is needed per domain.

> **Note:** `.env.production` is not committed. It is generated on the server from `.env.production.example`.

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

> **Note:** If your hosting uses a custom directory structure, adjust the paths accordingly. Contact your hosting provider for the correct paths.

---

## 5. SSL Configuration

Enable HTTPS through your hosting panel (most providers offer free Let's Encrypt certificates) or manually configure your SSL certificate.

After enabling SSL, update your `.env.production` files to use `https://` instead of `http://`.

---

## 6. Deployment Checklist

- [ ] Backend files uploaded to hosting
- [ ] Frontend files uploaded to public directory
- [ ] Database configured and migrations executed
- [ ] Environment variables configured for production
- [ ] SSO URLs updated to production domains
- [ ] SSL/HTTPS enabled
- [ ] Rewrite rules working (no 404 when navigating)
- [ ] Bot detection `.htaccess` rules uploaded (for SEO prerendering)
- [ ] `SetEnv API_URL` configured for correct environment
- [ ] Test authentication flow
- [ ] Check application logs for errors

---

## 7. Troubleshooting

### 404 when refreshing page (SPA)

Make sure rewrite rules are correctly configured in your `.htaccess` or server configuration.

### Database connection error

Verify your database credentials in `backend/.env.production`. Contact your hosting provider for the correct database host.

### Assets not loading

Verify that frontend files are in the correct public directory and that paths in `index.html` are correct.

### SSO authentication not working

Verify that `VITE_SSO_URL` and `SSO_URL` point to the production SSO server in your `.env.production` files.

---

## 8. Domain Summary

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | `http://localhost:8100` | `https://dowar.xyz` |
| Backend API | `http://localhost:8000` | `https://api.dowar.xyz` |
| SSO Server | `http://localhost:8001` | `https://sso.dowar.xyz` |
| SSO Frontend | `http://localhost:8101` | `https://sso.dowar.xyz` |

---

## 9. GitLab CI/CD Auto-Deploy (manual alternative)

The `.gitlab-ci.yml` files in `backend/` and `frontend/` enable automatic deploy when pushing a semantic tag.

### Prerequisites

Configure these variables in **GitLab → Settings → CI/CD → Variables**:

| Variable | Value | Protected | Masked |
|----------|-------|-----------|--------|
| `SSH_PRIVATE_KEY` | Server SSH private key | ✅ | ✅ |
| `SSH_HOST` | `your-server.com` | ✅ | ✅ |
| `SSH_PORT` | `22` | ✅ | ✅ |
| `SSH_USER` | `your-ssh-user` | ✅ | ✅ |
| `DEPLOY_PATH_BACKEND` | `/home/your-user/path/to/backend` | ✅ | ❌ |
| `DEPLOY_PATH_FRONTEND` | `/home/your-user/path/to/frontend` | ✅ | ❌ |
| `VITE_API_URL` | `https://api.yourdomain.com/api/` | ✅ | ❌ |

### Deploy trigger

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

The pipeline runs **only on tags** matching `vX.Y.Z`:

- **Backend**: `test` → `deploy` (git pull + php artisan migrate)
- **Frontend**: `lint` → `test` → `build` → `package` → `deploy` (uploads compressed `dist/`)

Normal pushes to `main`/`master` **do not trigger deploy**. Only semantic tags.

### Pipeline sequence (frontend)

```mermaid
graph LR
    L[lint] --> T[test] --> B[build] --> P[package] --> D[deploy]
```

If any stage fails (`lint`, `test`, `build`), the pipeline stops and won't deploy.
