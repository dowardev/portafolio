# Cleanup de `is_admin` / `isAdmin`

**Fecha:** 2026-05-15
**Objetivo:** Eliminar todos los remanentes de `is_admin` (backend) y `isAdmin` (frontend) del codebase del portfolio, completando la migración a roles genéricos.

## Contexto

El sistema de roles del portfolio ya opera con roles genéricos (`admin`, `editor`, `viewer`). La migration `2026_03_30_000000_drop_user_permission_fields.php` ya elimina la columna `is_admin` de la BD. El `userStore` ya usa `roles.value.includes('admin')` para determinar admin. Sin embargo, quedan residuos:

- El `AuthController` todavía mapea `isAdmin` del SSO a `is_admin` en la respuesta JSON.
- `PermissionService` tiene un método `isAdmin()` innecesario.
- `UserFactory` genera `is_admin` aleatorio (la columna ya no existe).
- `UserServerResponse` en TypeScript declara `is_admin: boolean`.
- `userStore` exporta un computed `isAdmin` redundante.
- `userController` tiene un método `isAdmin()` que es un alias.
- Los componentes Vue usan `userController.isAdmin()` que se migrarán a `hasRole`.

## Cambios

### Backend (portfolio)

#### 1. `backend/app/Http/Controllers/AuthController.php`

Eliminar la línea `'is_admin' => $ssoUser->isAdmin,` de la respuesta JSON.

**Antes:**
```php
return response()->json([
    'id' => $ssoUser->id,
    'name' => $ssoUser->name,
    'user' => $ssoUser->userName,
    'email' => $ssoUser->email,
    'is_admin' => $ssoUser->isAdmin,
    'is_email_verified' => !is_null($ssoUser->email_verified_at),
    'is_user_disabled' => $ssoUser->is_user_disabled ?? false,
    'roles' => $ssoUser->roles,
]);
```

**Después:**
```php
return response()->json([
    'id' => $ssoUser->id,
    'name' => $ssoUser->name,
    'user' => $ssoUser->userName,
    'email' => $ssoUser->email,
    'is_email_verified' => !is_null($ssoUser->email_verified_at),
    'is_user_disabled' => $ssoUser->is_user_disabled ?? false,
    'roles' => $ssoUser->roles,
]);
```

#### 2. `backend/app/Services/PermissionService.php`

Eliminar el método `isAdmin()` (líneas 54-58). Es redundante: `hasRole` + el sistema de permisos ya cubren esta verificación.

**Antes:**
```php
public function isAdmin(): bool
{
    $roleSlugs = $this->getUserRoleSlugs();
    return in_array('admin', $roleSlugs);
}
```

#### 3. `backend/database/factories/UserFactory.php`

Eliminar `"is_admin" => rand(0, 1)` de la definición. La columna ya no existe en la BD.

### Frontend (portfolio)

#### 4. `frontend/src/utils/interfaces.ts`

En `UserServerResponse`, eliminar `is_admin: boolean` (línea 164) y la línea comentada `// isAdmin?: User["is_admin"];` (línea 180).

**Antes:**
```typescript
export interface UserServerResponse {
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  image_id: string | null;
  is_admin: boolean;                              // ELIMINAR
  is_email_verified: boolean;
  is_user_disabled: boolean;
  name: string;
  role: string | null;
  updated_at: string;
  user: string;
  roles?: Role[];
}
```

#### 5. `frontend/src/store/userStore.ts`

Eliminar el computed `isAdmin` y su export del return statement.

**Antes:**
```typescript
const isAdmin = computed(() => roles.value.includes('admin'));

return {
  // ...
  isAdmin,
  // ...
};
```

#### 6. `frontend/src/controllers/userController.ts`

Eliminar el método `isAdmin()` (líneas 170-172).

**Antes:**
```typescript
isAdmin(): boolean {
  return this.userStore.isAdmin;
}
```

#### 7. `frontend/src/components/menu/MenuComponent.vue`

Reemplazar `const isAdmin = computed(...)` por `v-if="userController.hasRole({ slug: 'admin' })"`.

**Antes:**
```typescript
const isAdmin = computed(() => {
  return userController.isAdmin();
});
```
```html
v-if="isAdmin"
```

**Después:**
```html
v-if="userController.hasRole({ slug: 'admin' })"
```

#### 8. `frontend/src/views/blog/posts/PostsPage.vue`

Reemplazar las 3 instancias de `userController.isAdmin()` por `userController.hasRole({ slug: 'admin' })`.

#### 9. `frontend/src/views/blog/post/PostPage.vue`

Reemplazar las 3 instancias de `userController.isAdmin()` por `userController.hasRole({ slug: 'admin' })`.

## No se toca

- **Migration `2026_03_30_000000_drop_user_permission_fields.php`** — Ya existe y es correcta.
- **Migration `2022_02_19_232825_add_admin_user_to_users_table.php`** — Es historial, no se modifica.
- **`userStore.hasRole()`** y **`userController.hasRole()`** — Son los métodos correctos.
- **`PermissionService`** — Los demás métodos (`getUserPermissions`, `hasPermission`, etc.) quedan intactos.

## Verificación

1. `cd front && pnpm run lint` — Sin errores de ESLint
2. `cd front && pnpm run build` — typecheck + build exitoso
3. `cd back && composer test` — Tests pasando
4. Grep confirmando cero resultados de `is_admin`/`isAdmin` en `app/`, `src/`, `database/factories/` (excluyendo docs, migrations históricas y changelog)