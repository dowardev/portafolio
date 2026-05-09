# App-Level Permissions Design

> **Goal:** Allow each application (e.g., Portfolio) to define its own permissions and assign them to SSO roles. The SSO provides roles (admin/editor/viewer), each app gives them meaning via a local permission system. The admin role always has full control.

---

## 1. Architecture

```
SSO Server                    Portfolio Backend              Portfolio Frontend
┌─────────────┐               ┌──────────────────┐          ┌─────────────────┐
│ GET /roles   │◄── cache ──── │ RoleSyncService   │          │ PermisosPage     │
│ (nuevo ep)   │   con TTL     │                   │          │ (admin panel)    │
└─────────────┘               │ permissions table │◄────────►│                  │
                              │ role_permissions  │          │ CRUD permisos    │
                              │                   │          │ Asignar a roles  │
                              │ PermissionMiddleware│         │                  │
                              │ (valida permisos) │          │                  │
                              └──────────────────┘          └─────────────────┘
```

### Flujo

1. **Arranque del Backend:** `RoleSyncService` obtiene roles del SSO (`GET /roles?client_id=X`) y los cachea localmente (TTL: 1 hora).
2. **Configuración:** Admin crea permisos locales (ej: `posts.create`) y los asigna a roles (admin/editor/viewer) vía UI del frontend.
3. **Request:** Cada request autenticada pasa por `PermissionMiddleware` que verifica si el rol del usuario tiene el permiso requerido.
4. **Admin override:** El rol admin siempre tiene acceso total — hardcodeado, no depende de la tabla pivot.

---

## 2. Base de Datos

### Tabla: `permissions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | bigint | Primary key, auto-increment |
| `slug` | string(255) | Unique: `posts.create`, `projects.update` |
| `name` | string(255) | Display: "Crear posts", "Actualizar proyectos" |
| `module` | string(100) | Grupo: `posts`, `projects`, `experience`, etc. |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Tabla: `role_permissions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | bigint | Primary key, auto-increment |
| `role_slug` | string(50) | `admin`, `editor`, `viewer` (del SSO) |
| `permission_id` | foreignId | FK a permissions, cascade on delete |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Unique constraint:** `(role_slug, permission_id)`

### Seeders iniciales

Permisos por cada recurso existente del Portfolio:

| Módulo | Permisos |
|--------|----------|
| `posts` | `posts.index`, `posts.create`, `posts.update`, `posts.delete` |
| `intro` | `intro.index`, `intro.update` |
| `experiences` | `experiences.index`, `experiences.create`, `experiences.update`, `experiences.delete` |
| `projects` | `projects.index`, `projects.create`, `projects.update`, `projects.delete` |
| `certificates` | `certificates.index`, `certificates.create`, `certificates.update`, `certificates.delete` |
| `freelance` | `freelance.index`, `freelance.create`, `freelance.update`, `freelance.delete`, `freelance-comments.index`, `freelance-comments.create`, `freelance-comments.update`, `freelance-comments.delete` |
| `stacks` | `stacks.index`, `stacks.create`, `stacks.update`, `stacks.delete` |
| `skills-categories` | `skills-categories.index`, `skills-categories.create`, `skills-categories.update`, `skills-categories.delete` |

---

## 3. Backend API

### Endpoints (solo accesibles para rol admin)

| Método | Path | Descripción |
|--------|------|-------------|
| GET | `/admin/permissions` | Listar permisos (soporta `?module=posts` para filtrar) |
| POST | `/admin/permissions` | Crear permiso |
| PUT | `/admin/permissions/{permission}` | Actualizar permiso |
| DELETE | `/admin/permissions/{permission}` | Eliminar permiso |
| GET | `/admin/permissions/roles` | Ver permisos asignados a cada rol |
| PUT | `/admin/permissions/roles` | Asignar permisos a un rol (full replace) |

### RoleSyncService

- `getRoles()`: Retorna roles cacheados del SSO (llama a `GET /roles?client_id=X`)
- `syncRoles()`: Fuerza re-sync con el SSO, actualiza cache
- TTL configurable (default: 1 hora)
- Config en `config/sso.php`: `role_cache_ttl` (default: 3600)

### Middleware: `permission`

**Uso en rutas:**
```php
Route::post('/admin/posts', [PostController::class, 'store'])
    ->middleware('sso.auth', 'permission:posts.create');
```

**Lógica del middleware:**
1. Si el usuario tiene rol `admin` → permitir siempre
2. Obtener rol del usuario desde `SsoAuth::roles()`
3. Consultar tabla `role_permissions`: ¿el rol tiene el permiso?
4. Si no tiene → `403 Forbidden` con mensaje `"No tienes el permiso requerido"`

---

## 4. Frontend UI

### Ruta
- Path: `/admin-panel/permissions`
- Acceso: Solo usuarios con rol `admin` del SSO
- Navegación: Accessible desde `AdminHomeMenu.vue`

### Estructura de la página

Pestañas:
1. **Permisos** — CRUD de permisos
2. **Roles** — Asignar permisos a cada rol
3. **Sincronización** — Ver estado del cache de roles del SSO

#### Pestaña Permisos
- Lista de permisos con columns: slug, name, módulo
- Filtro dropdown por módulo
- Botón [+ Nuevo Permiso] → modal con formulario
- Acciones: Editar, Eliminar (con confirmación)

#### Pestaña Roles
- Dropdown para seleccionar rol (admin, editor, viewer)
- Checkboxes de todos los permisos disponibles
- Guardar cambios → PUT `/admin/permissions/roles`
- Admin siempre tiene todos los permisos (checkbox disabled)

#### Pestaña Sincronización
- Lista de roles cacheados del SSO con indicador de "protegido"
- Timestamp de última sincronización
- Botón [Sincronizar ahora] → fuerza re-sync

### Controllers necesarios
- `permissionsController` — llamadas a `/admin/permissions`
- `roleSyncController` — llamadas a sync (endpoint por crear)

---

## 5. Cambios en el SSO Server

### Nuevo endpoint público
`GET /roles?client_id={client_id}`

- **Middleware:** Ninguno (público)
- **Retorna:**
```json
{
  "data": [
    {"id": 1, "name": "Administrador", "slug": "admin", "is_protected": true},
    {"id": 2, "name": "Editor", "slug": "editor", "is_protected": true},
    {"id": 3, "name": "Visor", "slug": "viewer", "is_protected": true}
  ]
}
```

Este endpoint permite que cualquier app cliente obtenga los roles disponibles sin necesidad de token de admin.

---

## 6. Seguridad

- **Admin override:** El middleware permite todo si `hasRole('admin')` es true — no consulta la tabla pivot
- **Permiso mínimo:** Si un rol no tiene un permiso específico, el middleware retorna 403
- **Rutas públicas actuales:** Las rutas que no tienen middleware de permisos mantienen su comportamiento actual (sin cambios)
- **Fallback:** Si el cache de roles expira y el SSO no responde, usar última versión cacheada

---

## 7. Notas

- Los roles `admin`, `editor`, `viewer` son "protegidos" en el SSO — no se pueden eliminar
- El Portfolio define sus propios permisos localmente — el SSO no conoce los recursos del Portfolio
- El sistema es extensible: se pueden agregar más permisos sin cambiar el SSO