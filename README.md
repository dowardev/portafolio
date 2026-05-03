# Mi Portafolio

Plataforma full-stack para profesionales de desarrollo de software. Incluye interfaz web adaptativa, aplicación móvil para Android y soporte PWA. Permite mostrar conocimientos técnicos, proyectos realizados y un sistema de gestión de contenido/blog para publicaciones.

## Demo

Accede a la aplicación en producción: [Production App](https://dowar.xyz)

---

> **⚠️ NOTA IMPORTANTE - ENTORNO DE PRODUCCIÓN**
>
> Los ejemplos en este documento usan `localhost` y dominios de desarrollo.
> **En producción, reemplaza todos los valores locales con tus dominios reales.**
>
> Consulta la sección "[Configuración de Producción](#configuración-de-producción)" más abajo.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Ionic/Vue)                        │
│                   https://miapp.com                              │
│                              │                                   │
│   1. Genera par de claves DPoP (RSA) al iniciar sesión          │
│   2. Envía clave pública al SSO Server                          │
│   3. Recibe JWT con cnf.jkt (thumbprint JWK)                    │
│   4. Crea prueba DPoP (JWT firmado con clave privada)           │
│   5. Envía JWT + prueba DPoP en cada solicitud API              │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PORTAFOLIO BACKEND                            │
│                   https://api.miapp.com                          │
│                              │                                   │
│   1. Valida firma JWT usando JWKS del SSO                       │
│   2. Valida prueba DPoP (vincula token a clave privada)         │
│   3. Verifica que jkt en token coincida con clave pública DPoP  │
│                              │                                   │
└──────────────────────────────┬──────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SSO SERVER                              │
│                   https://sso.miapp.com/api                      │
│                              │                                   │
│   1. Almacena clave pública del cliente                        │
│   2. Emite JWT con cnf.jkt (thumbprint JWK)                     │
│   3. Proporciona JWKS en /.well-known/jwks.json                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- Ionic Framework
- Vue.js 3
- Capacitor.js
- Vite
- Pinia (gestión de estado)
- Axios (cliente HTTP)

### Backend
- Laravel 11
- Laravel Sanctum (comunicación con SSO)
- SQLite (desarrollo) / MySQL (producción)

### External
- SSO Server (autenticación centralizada)

---

## Requisitos Previos

- Node.js LTS
- pnpm (gestor de paquetes)
- PHP 8.2+
- Composer
- MySQL (producción) / SQLite (desarrollo)
- **SSO Server** ejecutándose (ver sección abajo)

---

## Estructura del Proyecto

```
portafolio/
├── frontend/          # Aplicación Ionic/Vue (web, móvil, PWA)
├── backend/          # API Laravel
└── README.md         # Este archivo
```

---

## SSO Server (Servicio Externo)

El SSO Server es un **servicio externo separado** que proporciona autenticación centralizada para múltiples aplicaciones.

### Propósito
- Gestiona usuarios y sesiones de forma centralizada
- Emite tokens JWT para aplicaciones cliente
- Proporciona endpoints de login, registro y validación de tokens

### Cómo Integrar

1. **Obtener el SSO Server**:
   ```bash
   cd ../sso/back
   # Seguir instrucciones de instalación en su README
   ```

2. **Configurar variables de entorno**:

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

3. **Registrar cliente en SSO**:
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

### Documentación Completa
Para detalles completos del SSO Server, consulta: `../sso/back/README.md`

---

## Instalación

### 1. SSO Server (Primero)

Ver sección anterior o consultar `../sso/back/README.md`.

### 2. Backend

```bash
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve --port=8000
```

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
pnpm i

# Iniciar servidor desarrollo
pnpm run dev
# o
ionic s
```

---

## Configuración de Desarrollo

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

## Configuración de Producción

> **IMPORTANTE:** Todos los valores `localhost` deben reemplarse con tu dominio real.

### Cambios Requeridos

| Configuración | Desarrollo | Producción |
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

### Build Producción

```bash
# Frontend
cd frontend
ionic build --prod

# Los archivos se generan en el directorio 'dist'
```

---

## Cómo Ejecutar

### Desarrollo (todos los servicios)

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

### Producción

1. Compilar frontend: `ionic build --prod`
2. Desplegar `dist/` al servidor web
3. Configurar backend en servidor con MySQL
4. Configurar DNS y SSL

---

## Endpoints API

### Endpoints Protegidos (requieren `Authorization: Bearer {token}`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/user-auth` | Obtener usuario autenticado |
| POST | `/api/new-post` | Crear post (relación con usuario SSO) |
| GET | `/api/users` | Listar usuarios (admin) |
| POST | `/api/update-user-status` | Habilitar/deshabilitar usuario |
| POST | `/api/admin/delete-user` | Eliminar usuario (admin) |
| POST | `/api/admin/update-user-account` | Actualizar cuenta (admin) |

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/posts/{date}/{filter}` | Listar posts |
| GET | `/api/post-dates` | Fechas de posts |
| GET | `/api/post/{id}` | Obtener post individual |
| GET | `/api/search-posts/{search}` | Buscar posts |
| POST | `/api/create-post` | Crear post público |
| POST | `/api/update-post` | Actualizar post |
| POST | `/api/delete-post` | Eliminar post |
| POST | `/api/upload-image` | Subir imagen |
| POST | `/api/contact` | Enviar formulario contacto |
| POST | `/api/feedback` | Enviar feedback |

---

## Generación de APK (Android)

### Pruebas

```bash
cd Android
./gradlew assembleDebug
# APK en: app/build/outputs/apk/debug/
```

### Producción

```bash
ionic cap open android
# Configurar firma y generar build de release
```

---

## Comandos Útiles

```bash
# Backend
php artisan route:list          # Ver rutas registradas
php artisan config:clear         # Limpiar caché de configuración
php artisan migrate              # Ejecutar migraciones

# Frontend
ionic build                      # Build de producción
pnpm run dev                     # Servidor desarrollo
```

---

## Checklist de Deployment

- [ ] Configurar dominios (`miapp.com`, `api.miapp.com`, `sso.miapp.com`)
- [ ] Obtener certificados SSL
- [ ] Configurar MySQL en producción
- [ ] Actualizar `.env` con URLs de producción
- [ ] Compilar build de producción del frontend
- [ ] Desplegar frontend al servidor web
- [ ] Desplegar backend al servidor
- [ ] Configurar headers de seguridad (CORS, CSP)
- [ ] Probar flujo completo de autenticación
- [ ] Configurar service worker para PWA (si aplica)
- [ ] Configurar rate limiting para endpoints públicos
- [ ] Configurar logs y monitoreo

---

## Licencia

Este proyecto se desarrolla bajo la licencia GPL 3.