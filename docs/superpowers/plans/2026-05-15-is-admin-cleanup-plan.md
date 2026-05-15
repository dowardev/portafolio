# Cleanup de `is_admin` / `isAdmin` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar todos los remanentes de `is_admin` (backend) y `isAdmin` (frontend) del codebase del portfolio, completando la migración a roles genéricos.

**Architecture:** Limpieza de residuos en 9 archivos. Cada archivo se modifica de forma independiente. Los componentes Vue migran de `userController.isAdmin()` a `userController.hasRole({ slug: 'admin' })`.

**Tech Stack:** Laravel 12 (PHP 8.2), Ionic Vue 8 (TypeScript)

---

### Task 1: AuthController — eliminar `is_admin` de la respuesta JSON

**Files:**
- Modify: `backend/app/Http/Controllers/AuthController.php`

- [ ] **Step 1: Eliminar `'is_admin' => $ssoUser->isAdmin,` de la respuesta JSON**

Cambiar de:

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

A:

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

- [ ] **Step 2: Verificar PHP syntax**

Run: `cd back && php -l app/Http/Controllers/AuthController.php`
Expected: No syntax errors

---

### Task 2: PermissionService — eliminar método `isAdmin()`

**Files:**
- Modify: `backend/app/Services/PermissionService.php`

- [ ] **Step 1: Eliminar el método `isAdmin()` completo (líneas 54-58)**

Eliminar:

```php
public function isAdmin(): bool
{
    $roleSlugs = $this->getUserRoleSlugs();
    return in_array('admin', $roleSlugs);
}
```

- [ ] **Step 2: Verificar PHP syntax**

Run: `cd back && php -l app/Services/PermissionService.php`
Expected: No syntax errors

- [ ] **Step 3: Verificar que no haya referencias a `isAdmin()` en otros archivos**

Run: `rg "isAdmin|is_admin" back/app back/routes --no-heading`
Expected: Ningún resultado en `app/` y `routes/`

---

### Task 3: UserFactory — eliminar `is_admin` de la factory

**Files:**
- Modify: `backend/database/factories/UserFactory.php`

- [ ] **Step 1: Eliminar `"is_admin" => rand(0, 1)` de la definición**

Cambiar de:

```php
return [
  "name" => $this->faker->name(),
  "email" => $this->faker->unique()->safeEmail(),
  "password" => bcrypt("123"),
  "remember_token" => Str::random(10),
  "is_email_verified" => rand(0, 1),
  "is_admin" => rand(0, 1),
  "user" => $this->faker->userName(),
  "is_user_disabled" => rand(0, 1),
];
```

A:

```php
return [
  "name" => $this->faker->name(),
  "email" => $this->faker->unique()->safeEmail(),
  "password" => bcrypt("123"),
  "remember_token" => Str::random(10),
  "is_email_verified" => rand(0, 1),
  "user" => $this->faker->userName(),
  "is_user_disabled" => rand(0, 1),
];
```

- [ ] **Step 2: Verificar PHP syntax**

Run: `cd back && php -l database/factories/UserFactory.php`
Expected: No syntax errors

---

### Task 4: interfaces.ts — eliminar `is_admin` de `UserServerResponse`

**Files:**
- Modify: `frontend/src/utils/interfaces.ts`

- [ ] **Step 1: Eliminar `is_admin: boolean;` de `UserServerResponse`**

Cambiar de:

```typescript
export interface UserServerResponse {
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  image_id: string | null;
  is_admin: boolean;
  is_email_verified: boolean;
  is_user_disabled: boolean;
  name: string;
  role: string | null;
  updated_at: string;
  user: string;
  roles?: Role[];
}
```

A:

```typescript
export interface UserServerResponse {
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  image_id: string | null;
  is_email_verified: boolean;
  is_user_disabled: boolean;
  name: string;
  role: string | null;
  updated_at: string;
  user: string;
  roles?: Role[];
}
```

- [ ] **Step 2: Eliminar línea comentada `// isAdmin?: User["is_admin"];` (línea 180)**

---

### Task 5: userStore — eliminar computed `isAdmin`

**Files:**
- Modify: `frontend/src/store/userStore.ts`

- [ ] **Step 1: Eliminar `const isAdmin = computed(() => roles.value.includes('admin'));`**

- [ ] **Step 2: Eliminar `isAdmin,` del return statement**

---

### Task 6: userController — eliminar método `isAdmin()`

**Files:**
- Modify: `frontend/src/controllers/userController.ts`

- [ ] **Step 1: Eliminar el método `isAdmin()` completo**

Eliminar:

```typescript
isAdmin(): boolean {
  return this.userStore.isAdmin;
}
```

---

### Task 7: MenuComponent — migrar `isAdmin` a `hasRole`

**Files:**
- Modify: `frontend/src/components/menu/MenuComponent.vue`

- [ ] **Step 1: Eliminar el computed `isAdmin`**

Eliminar:

```typescript
const isAdmin = computed(() => {
  return userController.isAdmin();
});
```

- [ ] **Step 2: Reemplazar `v-if="isAdmin"` por `v-if="userController.hasRole({ slug: 'admin' })"`**

Buscar y reemplazar `v-if="isAdmin"` → `v-if="userController.hasRole({ slug: 'admin' })"`

---

### Task 8: PostsPage — migrar `isAdmin()` a `hasRole`

**Files:**
- Modify: `frontend/src/views/blog/posts/PostsPage.vue`

- [ ] **Step 1: Reemplazar todas las instancias de `userController.isAdmin()` por `userController.hasRole({ slug: 'admin' })`**

Hay 3 lugares: línea 13, línea 82, línea 224.

---

### Task 9: PostPage — migrar `isAdmin()` a `hasRole`

**Files:**
- Modify: `frontend/src/views/blog/post/PostPage.vue`

- [ ] **Step 1: Reemplazar todas las instancias de `userController.isAdmin()` por `userController.hasRole({ slug: 'admin' })`**

Hay 3 lugares: línea 24, línea 120, línea 130.

---

### Task 10: Verificación final

- [ ] **Step 1: Grep confirmar cero residuos**

Run: `rg "is_admin|isAdmin" front/src back/app back/database/factories --no-heading`
Expected: Ningún resultado

- [ ] **Step 2: Frontend lint + build**

Run: `cd front && pnpm run lint && pnpm run build`
Expected: Sin errores

- [ ] **Step 3: Backend tests**

Run: `cd back && composer test`
Expected: Todos pasando