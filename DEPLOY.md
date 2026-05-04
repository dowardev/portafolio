# Deployment Guide

This guide covers deploying the Portfolio application on traditional hosting (shared hosting, VPS, or dedicated server).

> **Note:** These instructions assume your local development environment is ready. The server only needs to serve the compiled files.

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

Create the `backend/.env` file from the example and configure it with production values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Application name | `Portfolio` |
| `APP_ENV` | Environment | `production` |
| `APP_DEBUG` | Debug mode (false in prod) | `false` |
| `APP_URL` | Backend URL | `https://api.yourdomain.com` |
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
| `MAIL_FROM_ADDRESS` | Sender email | `noreply@yourdomain.com` |
| `MAIL_FROM_NAME` | Sender name | `Portfolio` |
| `SSO_URL` | SSO Server API URL | `https://sso.yourdomain.com/api` |

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

Create the `frontend/.env` file with production values:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Laravel backend URL | `https://api.yourdomain.com/api` |
| `VITE_SSO_URL` | SSO Server API URL | `https://sso.yourdomain.com/api` |
| `VITE_SSO_FRONTEND_URL` | SSO web frontend URL | `https://sso.yourdomain.com` |
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
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

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

After enabling SSL, update your `.env` files to use `https://` instead of `http://`.

---

## 6. Deployment Checklist

- [ ] Backend files uploaded to hosting
- [ ] Frontend files uploaded to public directory
- [ ] Database configured and migrations executed
- [ ] Environment variables configured for production
- [ ] SSO URLs updated to production domains
- [ ] SSL/HTTPS enabled
- [ ] Rewrite rules working (no 404 when navigating)
- [ ] Test authentication flow
- [ ] Check application logs for errors

---

## 7. Troubleshooting

### 404 when refreshing page (SPA)

Make sure rewrite rules are correctly configured in your `.htaccess` or server configuration.

### Database connection error

Verify your database credentials in `backend/.env`. Contact your hosting provider for the correct database host.

### Assets not loading

Verify that frontend files are in the correct public directory and that paths in `index.html` are correct.

### SSO authentication not working

Verify that `VITE_SSO_URL` and `SSO_URL` point to the production SSO server in your `.env` files.

---

## 8. Domain Summary

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | `[direccion]:[puerto]` | `https://yourdomain.com` |
| Backend API | `[direccion]:[puerto]` | `https://api.yourdomain.com` |
| SSO Server | `[direccion]:[puerto]` | `https://sso.yourdomain.com` |
| SSO Frontend | `[direccion]:[puerto]` | `https://sso.yourdomain.com` |
