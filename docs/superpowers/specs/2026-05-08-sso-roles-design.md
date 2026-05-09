# SSO Roles System - Sistema de Roles Genéricos

**Fecha**: 2026-05-08
**Estado**: Aprobado

## 1. Resumen ejecutivo

Este documento especifica la migración del sistema de roles SSO de un mecanismo dual (`is_admin` boolean + roles) a un sistema unificado basado exclusivamente en roles genéricos con slugs. El SSO almacenará roles genéricos (`admin`, `editor`, `viewer`) y cada aplicación cliente definirá el significado de cada rol en su propio contexto.

## 2. Decisiones de diseño

| Decisión | Selección |
|---|---|
| Modelo de roles | Slugs genéricos (admin, editor, viewer) — cada app define significado |
| `is_admin` boolean | Eliminado. Todo por roles |
| Filtrado de roles | SSO filtra por `client_id` (obligatorio en la API) |
| Rol default | `viewer` si no tiene rol asignado para el cliente |
| Roles en JWT | No. JWT solo identidad, roles via API |
| Roles protegidos | admin, editor, viewer (reemplazan moderator/standard) |
| Enfoque | Big bang — todo simultáneamente |
| Portfolio backend | Agregar RoleMiddleware |

## 3. Arquitectura

### 3.1 Flujo de autenticación

```
1. Usuario se loguea en SSO → JWT (sin roles)
2. App cliente inicializa SSO client con su client_id
3. SSO client llama GET /user-auth?client_id=XYZ
4. SSO devuelve usuario con roles filtrados para client_id=XYZ
5. App cliente usa role.slug para autorización local
6. Portfolio backend lee rol del header/middleware y valida permisos
```

### 3.2 Modelo de datos

- **`roles`**: id, name, slug (unique), description, is_protected
- **`user_roles`**: id, user_id, role_id, sso_client_id (nullable), timestamps
- **`users`**: id, name, user, email, password — **sin** is_admin

El `sso_client_id` nullable permite roles globales (null) o específicos por app.

## 4. Cambios en SSO Backend

### 4.1 Modelo User.php

- Eliminar `is_admin` de `$fillable`
- Eliminar método `isAdmin()` — reemplazar por `hasRole('admin')`
- Actualizar `getEffectiveRole()` para default a `viewer` en vez de `standard`

### 4.2 Middleware IsAdmin.php

- Reescribir para usar `$user->hasRole('admin')` en vez de `$user->is_admin`
- Si el request incluye `sso_client_id`, verificar rol para ese cliente; si no, verificar rol global

### 4.3 AuthController

- `/me` y `/user-auth`: **Requerir** `client_id` como query param
- Devolver solo roles para ese cliente (específicos + globales con `sso_client_id = null`)
- Si no se pasa `client_id`: devolver error 400

### 4.4 AdminController

- `toggle`: Eliminar (ya no hay `is_admin` que toggle). Reemplazar por asignar/remover rol admin via `updateUserRoles`
- `updateUserRoles`: Ya funciona con `{role_id, sso_client_id}` — sin cambios

### 4.5 Migration

- Nueva migration: eliminar columna `is_admin` de users
- Actualizar RoleSeeder: reemplazar moderator/standard por editor/viewer
- Migration para renombrar roles existentes: `standard` → `viewer`, eliminar `moderator`, agregar `editor`

## 5. Cambios en SSO Client Package

### 5.1 AuthService.ts

- `getUser()` ahora envía `client_id` como query param a `GET user-auth?client_id=X`
- El client_id viene de la configuración del SSO client

### 5.2 types/index.ts

- Eliminar `isAdmin` de la interfaz User
- Mantener `roles: Role[]` — ahora vendrá filtrado por cliente desde el SSO

### 5.3 SSOClient.ts

- Al inicializar, ya tiene `clientId` en config — usarlo en las llamadas a getUser

## 6. Cambios en Portfolio Frontend

### 6.1 interfaces.ts

- Eliminar `isAdmin` de User
- Mantener `roles: Role[]`

### 6.2 sso-client.d.ts

- Actualizar tipo User para eliminar `isAdmin`

### 6.3 userService.ts

- Eliminar mapeo `is_admin` → `isAdmin`

### 6.4 router/index.ts

- `hasAdminRole()` funciona sobre roles ya filtrados por cliente

### 6.5 MenuComponent.vue

- Eliminar `isAdmin` computed, usar `hasAdminRole()` del router

## 7. Cambios en Portfolio Backend

### 7.1 RoleMiddleware

- Lee el rol del usuario desde el request (inyectado por SSO client o header `X-User-Role`)
- Valida que el rol esté en la lista permitida para la ruta
- Uso: `Route::middleware('role:admin,editor')->group(...)`

### 7.2 Permisos por rol en portfolio

- `admin`: CRUD completo de proyectos, imágenes, configuración
- `editor`: Crear/editar proyectos e imágenes
- `viewer`: Solo lectura

### 7.3 Modelo User.php (portfolio)

- No necesita relación de roles — el rol viene del SSO via middleware

## 8. Excepciones y casos edge

- **Usuario sin rol para el cliente**: devuelve `viewer` por defecto
- **Sin client_id en request**: error 400 "client_id requerido"
- **Rol global vs específico**: los roles con `sso_client_id = null` aplican a todas las apps; los específicos tienen precedencia

## 9. Testing

- Tests unitarios para `hasRole()` y `getEffectiveRole()` en User model
- Tests de integración para `/user-auth?client_id=X`
- Tests e2e para flujo completo de autenticación con roles
- Tests de RoleMiddleware en portfolio backend

## 10. Riesgos identificados

- **Riesgo**: Clientes existentes no actualizados podrían fallar al no enviar `client_id`
- **Mitigación**: Documentar el cambio y dar ventana de migración
- **Riesgo**: Rolling back difícil si hay problemas en producción
- **Mitigación**: Tener scripts de rollback listos para migrations