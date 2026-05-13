# Fix SSO Client ID + Defense-in-Depth

**Fecha:** 2026-05-11
**Estado:** Aprobado
**Usuario:** dowardev

## Problema

El login SSO redirige al usuario de vuelta a portafolio, pero los botones de "Iniciar sesión" siguen mostrando (el usuario no queda autenticado en el frontend).

### Causa Raíz

1. Portafolio `.env` no tiene `SSO_CLIENT_ID=main-app`
2. `config('sso.client_id')` devuelve el default `'1'`
3. `SsoHttpClient.get('/me')` envía `?client_id=1`
4. SSO `/me` valida contra tabla `sso_clients` (solo tiene `main-app`) → 400
5. `SsoUserResolver` lanza `RuntimeException`
6. `SsoAuthMiddleware` captura la excepción y devuelve **401** genérico
7. Frontend `HttpClient` intercepta 401 → dispara token refresh
8. Refresh falla → `handleRefreshFailed()` → limpia **todo** el estado de auth
9. Usuario aparece completamente deslogueado

### Problema Adicional (Defense-in-Depth)

El 401 del `SsoAuthMiddleware` es semánticamente incorrecto:
- El JWT es válido (pasó la validación en el middleware)
- El DPoP es válido (pasó la verificación)
- El problema es que el **SSO server no puede resolver los roles** (está caído, client_id incorrecto, sin cache)

Un 401 "Token inválido" engaña al frontend, que interpreta que el token expiró y hace refresh, cuando en realidad el problema es del servidor, no del token.

## Solución

### Fix Primario: Agregar SSO_CLIENT_ID al .env

| Archivo | Cambio |
|---------|--------|
| `portafolio/backend/.env` | Agregar `SSO_CLIENT_ID=main-app` |
| `portafolio/backend/config/sso.php:16` | Default `'1'` → `'main-app'` |
| `portafolio/backend/app/Http/Controllers/MyPermissionsController.php:60` | Default `1` → `'main-app'` (string) |

### Defense-in-Depth: Diferenciar 401 vs 500

Cambios en el paquete `sso-server`:

1. **Nueva excepción:** `SsoUserResolveException`
   - Ubicación: `src/Exceptions/SsoUserResolveException.php`
   - Extiende: `RuntimeException`
   - Propósito: Identificar errores de resolución de roles (SSO caído, client_id incorrecto, sin cache stale)

2. **SsoUserResolver:** Cambiar `RuntimeException` → `SsoUserResolveException`
   - Ubicación: `src/Auth/SsoUserResolver.php:41-43`

3. **SsoAuthMiddleware:** Diferenciar el catch de excepciones
   - Ubicación: `src/Middleware/SsoAuthMiddleware.php:62-67`
   - Agregar catch específico para `SsoUserResolveException` → devuelve **500**
   - Mantener catch genérico para otras excepciones → devuelve **401**

### Behavior Post-Fix

| Escenario | Antes | Después |
|-----------|-------|---------|
| SSO caído + sin cache | 401 → refresh → logout completo | 500 → sin refresh → usuario logueado sin permisos |
| client_id incorrecto | 401 → refresh → logout completo | 500 → sin refresh → usuario logueado sin permisos |
| Token expirado | 401 → refresh → re-login | 401 → refresh → re-login (mismo comportamiento) |
| Todo OK | 200 → login exitoso | 200 → login exitoso (mismo comportamiento) |

## Archivos a Modificar

### Portafolio (backend)
- `.env` — agregar `SSO_CLIENT_ID=main-app`
- `config/sso.php` — cambiar default
- `app/Http/Controllers/MyPermissionsController.php` — cambiar default

### sso-client (packages/sso-server)
- `src/Exceptions/SsoUserResolveException.php` — **NUEVO**
- `src/Auth/SsoUserResolver.php` — lanzar `SsoUserResolveException`
- `src/Middleware/SsoAuthMiddleware.php` — agregar catch específico → 500

## Notas

- El fix primario (agregar `SSO_CLIENT_ID` al .env) resuelve el problema para el caso normal (SSO funcionando)
- El defense-in-depth evita que errores de SSO interno causen logout completo
- Los cambios en el paquete sso-server requieren commit y sincronización con el vendor de portafolio