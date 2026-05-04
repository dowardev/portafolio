# Guía de Despliegue

Esta guía cubre el despliegue de la aplicación Portfolio en hosting tradicional (hosting compartido, VPS o servidor dedicado).

> **Nota:** Las instrucciones asumen que tienes tu entorno de desarrollo listo localmente. El servidor solo necesita servir los archivos compilados.

---

## 1. Requisitos Previos

- PHP 8.2+
- Composer
- Node.js
- Ionic CLI
- Base de datos MySQL (proporcionada por tu hosting)
- Dominio apuntando a tu hosting

---

## 2. Despliegue del Backend

### 1. Instalar Dependencias

```bash
cd backend
composer install --no-dev --optimize-autoloader
```

### 2. Configurar Entorno

Crea el archivo `backend/.env` a partir del ejemplo y configúralo con los valores de producción:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `APP_NAME` | Nombre de la aplicación | `Portafolio` |
| `APP_ENV` | Entorno de ejecución | `production` |
| `APP_DEBUG` | Modo debug (false en prod) | `false` |
| `APP_URL` | URL del backend | `https://api.tudominio.com` |
| `DB_CONNECTION` | Driver de base de datos | `mysql` |
| `DB_HOST` | Host de MySQL | `[mysql_host_del_hosting]` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_DATABASE` | Nombre de la base de datos | `[nombre_base_datos]` |
| `DB_USERNAME` | Usuario de la base de datos | `[usuario_base_datos]` |
| `DB_PASSWORD` | Password de la base de datos | `[password_base_datos]` |
| `SESSION_DRIVER` | Driver de sesiones | `database` |
| `MAIL_MAILER` | Driver de correo | `smtp` |
| `MAIL_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_USERNAME` | Usuario SMTP | `[tu_email@example.com]` |
| `MAIL_PASSWORD` | Password SMTP | `[tu_password]` |
| `MAIL_ENCRYPTION` | Encriptación (tls/ssl) | `tls` |
| `MAIL_FROM_ADDRESS` | Email del remitente | `noreply@tudominio.com` |
| `MAIL_FROM_NAME` | Nombre del remitente | `Portafolio` |
| `SSO_URL` | URL de la API del SSO Server | `https://sso.tudominio.com/api` |

### 3. Subir Archivos

Sube toda la carpeta `backend/` a tu hosting. Rutas comunes:

- Hosting compartido: `/home/[usuario]/[carpeta_proyecto]/`
- cPanel: `/home/[usuario]/public_html/[carpeta_proyecto]/`

### 4. Ejecutar Migraciones

Ejecuta este comando en tu hosting (vía SSH, terminal o panel del hosting):

```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 3. Despliegue del Frontend

### 1. Configurar Entorno

Crea el archivo `frontend/.env` con los valores de producción:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend Laravel | `https://api.tudominio.com/api` |
| `VITE_SSO_URL` | URL de la API del SSO Server | `https://sso.tudominio.com/api` |
| `VITE_SSO_FRONTEND_URL` | URL del frontend web del SSO | `https://sso.tudominio.com` |
| `VITE_SSO_CLIENT_ID` | ID del cliente registrado en el SSO | `main-app` |

### 2. Compilar para Producción

```bash
cd frontend
ionic build --prod
```

### 3. Subir Archivos

Sube el contenido de `frontend/dist/` al directorio público de tu hosting:

- Hosting compartido: `/home/[usuario]/public_html/`
- El `index.html` y la carpeta `assets/` deben ser directamente accesibles

---

## 4. Configuración del Servidor Web

### Apache (.htaccess)

Coloca esto en tu directorio público (donde está el index.html):

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

> **Nota:** Si tu hosting usa una estructura de directorios personalizada, ajusta las rutas según corresponda. Contacta a tu proveedor de hosting para conocer las rutas correctas.

---

## 5. Configuración SSL

Habilita HTTPS a través del panel de tu hosting (la mayoría de proveedores ofrecen certificados gratuitos de Let's Encrypt) o configura manualmente tu certificado SSL.

Después de habilitar SSL, actualiza tus archivos `.env` para usar `https://` en lugar de `http://`.

---

## 6. Checklist de Despliegue

- [ ] Archivos del backend subidos al hosting
- [ ] Archivos del frontend subidos al directorio público
- [ ] Base de datos configurada y migraciones ejecutadas
- [ ] Variables de entorno configuradas para producción
- [ ] URLs del SSO actualizadas a dominios de producción
- [ ] SSL/HTTPS habilitado
- [ ] Reglas de rewrite funcionando (sin 404 al navegar)
- [ ] Probar flujo de autenticación
- [ ] Revisar logs de la aplicación por errores

---

## 7. Solución de Problemas

### 404 al refrescar página (SPA)

Asegúrate de que las reglas de rewrite estén correctamente configuradas en tu `.htaccess` o configuración del servidor.

### Error de conexión a la base de datos

Verifica tus credenciales de base de datos en `backend/.env`. Contacta a tu proveedor de hosting para obtener el host correcto de la base de datos.

### Assets no cargan

Verifica que los archivos del frontend estén en el directorio público correcto y que las rutas en `index.html` sean correctas.

### Autenticación SSO no funciona

Verifica que `VITE_SSO_URL` y `SSO_URL` apunten al servidor SSO de producción en tus archivos `.env`.

---

## 8. Resumen de Dominios

| Servicio | Desarrollo | Producción |
|----------|------------|------------|
| Frontend | `http://localhost:8100` | `https://tudominio.com` |
| Backend API | `http://localhost:8000` | `https://api.tudominio.com` |
| SSO Server | `http://localhost:8001` | `https://sso.tudominio.com` |
| SSO Frontend | `http://localhost:8101` | `https://sso.tudominio.com` |