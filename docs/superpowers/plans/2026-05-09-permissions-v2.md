# Permissions v2 Implementation Plan

**Goal:** Sistema de permisos con catálogo editable + overrides por usuario + fixes críticos

**Architecture:**
- 3 tablas: `permissions` (catálogo), `role_permissions` (roles), `user_permissions` (overrides)
- Middleware: user deny > user grant > role permissions > deny
- PermissionController: CRUD para permissions y user_permissions, usa Permission model

---

## Task 1: Migration - crear tabla permissions

**Files:**
- Modify: `backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php` (agregar recreate table permissions)

- [ ] **Step 1: Modificar simplify migration para recrear permissions table**

```php
// En up() después de dropIfExists('permissions'), agregar:
Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    $table->string('slug', 100)->unique();
    $table->string('module', 50);
    $table->string('action', 50);
    $table->timestamps();
});

// En down() al final, antes de los cambios a role_permissions:
Schema::dropIfExists('permissions');
```

- [ ] **Step 2: Commit**

```bash
git add backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php
git commit -m "fix: recreate permissions table in migration for editable catalog"
```

---

## Task 2: Modelo Permission + Seeder

**Files:**
- Create: `backend/app/Models/Permission.php`
- Modify: `backend/database/seeders/RolePermissionSeeder.php`

- [ ] **Step 1: Create Permission model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'slug',
        'module',
        'action',
    ];
}
```

- [ ] **Step 2: Modificar RolePermissionSeeder para usar Permission model**

```php
// Agregar al inicio del run():
Permission::truncate();

// Poblar permissions
$permissions = [
    ['slug' => 'posts.index', 'module' => 'posts', 'action' => 'index'],
    ['slug' => 'posts.create', 'module' => 'posts', 'action' => 'create'],
    ['slug' => 'posts.update', 'module' => 'posts', 'action' => 'update'],
    ['slug' => 'posts.delete', 'module' => 'posts', 'action' => 'delete'],
    ['slug' => 'intro.index', 'module' => 'intro', 'action' => 'index'],
    ['slug' => 'intro.update', 'module' => 'intro', 'action' => 'update'],
    ['slug' => 'experiences.index', 'module' => 'experiences', 'action' => 'index'],
    ['slug' => 'experiences.create', 'module' => 'experiences', 'action' => 'create'],
    ['slug' => 'experiences.update', 'module' => 'experiences', 'action' => 'update'],
    ['slug' => 'experiences.delete', 'module' => 'experiences', 'action' => 'delete'],
    ['slug' => 'projects.index', 'module' => 'projects', 'action' => 'index'],
    ['slug' => 'projects.create', 'module' => 'projects', 'action' => 'create'],
    ['slug' => 'projects.update', 'module' => 'projects', 'action' => 'update'],
    ['slug' => 'projects.delete', 'module' => 'projects', 'action' => 'delete'],
    ['slug' => 'certificates.index', 'module' => 'certificates', 'action' => 'index'],
    ['slug' => 'certificates.create', 'module' => 'certificates', 'action' => 'create'],
    ['slug' => 'certificates.update', 'module' => 'certificates', 'action' => 'update'],
    ['slug' => 'certificates.delete', 'module' => 'certificates', 'action' => 'delete'],
    ['slug' => 'freelance.index', 'module' => 'freelance', 'action' => 'index'],
    ['slug' => 'freelance.create', 'module' => 'freelance', 'action' => 'create'],
    ['slug' => 'freelance.update', 'module' => 'freelance', 'action' => 'update'],
    ['slug' => 'freelance.delete', 'module' => 'freelance', 'action' => 'delete'],
    ['slug' => 'freelance-comments.index', 'module' => 'freelance-comments', 'action' => 'index'],
    ['slug' => 'freelance-comments.create', 'module' => 'freelance-comments', 'action' => 'create'],
    ['slug' => 'freelance-comments.update', 'module' => 'freelance-comments', 'action' => 'update'],
    ['slug' => 'freelance-comments.delete', 'module' => 'freelance-comments', 'action' => 'delete'],
    ['slug' => 'stacks.index', 'module' => 'stacks', 'action' => 'index'],
    ['slug' => 'stacks.create', 'module' => 'stacks', 'action' => 'create'],
    ['slug' => 'stacks.update', 'module' => 'stacks', 'action' => 'update'],
    ['slug' => 'stacks.delete', 'module' => 'stacks', 'action' => 'delete'],
    ['slug' => 'skills-categories.index', 'module' => 'skills-categories', 'action' => 'index'],
    ['slug' => 'skills-categories.create', 'module' => 'skills-categories', 'action' => 'create'],
    ['slug' => 'skills-categories.update', 'module' => 'skills-categories', 'action' => 'update'],
    ['slug' => 'skills-categories.delete', 'module' => 'skills-categories', 'action' => 'delete'],
];

foreach ($permissions as $perm) {
    Permission::create($perm]);
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/app/Models/Permission.php backend/database/seeders/RolePermissionSeeder.php
git commit -m "feat: add Permission model and populate catalog in seeder"
```

---

## Task 3: Migration user_permissions table

**Files:**
- Create: `backend/database/migrations/2026_05_09_000003_create_user_permissions_table.php`

- [ ] **Step 1: Create migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('user_sso_id', 36);
            $table->string('permission_slug', 100);
            $table->enum('type', ['grant', 'deny']);
            $table->timestamps();
            $table->unique(['user_sso_id', 'permission_slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};
```

- [ ] **Step 2: Commit**

```bash
git add backend/database/migrations/2026_05_09_000003_create_user_permissions_table.php
git commit -m "feat: add user_permissions table for per-user permission overrides"
```

---

## Task 4: Modelo UserPermission

**Files:**
- Create: `backend/app/Models/UserPermission.php`

- [ ] **Step 1: Create model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    protected $fillable = [
        'user_sso_id',
        'permission_slug',
        'type',
    ];
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/Models/UserPermission.php
git commit -m "feat: add UserPermission model"
```

---

## Task 5: Fix migration down() + RoleSyncService::getRoleSlugs()

**Files:**
- Modify: `backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php`
- Modify: `backend/app/Services/RoleSyncService.php`

- [ ] **Step 1: Fix migration down() - use column names instead of hardcoded index**

El down() actual usa nombres de índice generados. Cambiar a nombres de columna:

```php
// En down(), cambiar dropUnique de:
// $table->dropUnique(['role_permissions_role_slug_permission_slug_unique']);
// A:
$table->dropUnique(['role_slug', 'permission_slug']);
```

También agregar comentario en el código sobre data loss esperado.

- [ ] **Step 2: Add getRoleSlugs() to RoleSyncService**

```php
public function getRoleSlugs(): array
{
    $roles = $this->getRoles();
    return array_filter(array_map(function ($role) {
        return $role['slug'] ?? $role->slug ?? null;
    }, $roles));
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php backend/app/Services/RoleSyncService.php
git commit -m "fix: migration down() dropUnique by columns, add getRoleSlugs() to RoleSyncService"
```

---

## Task 6: PermissionController - CRUD + user permissions + fixes

**Files:**
- Modify: `backend/app/Http/Controllers/Admin/PermissionController.php`

- [ ] **Step 1: Rewrite controller with all fixes**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\RolePermission;
use App\Models\UserPermission;
use App\Services\RoleSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    private function parsePermissionSlug(string $slug): array
    {
        $parts = explode('.', $slug, 2);
        return [
            'slug' => $slug,
            'module' => $parts[0],
            'action' => $parts[1] ?? '',
        ];
    }

    // ========== PERMISSIONS CATALOG CRUD ==========

    public function getAvailablePermissions(): JsonResponse
    {
        $permissions = Permission::all()->map(function ($perm) {
            return $this->parsePermissionSlug($perm->slug);
        });

        return response()->json($permissions);
    }

    public function createPermission(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:100|unique:permissions,slug',
            'module' => 'required|string|max:50',
            'action' => 'required|string|max:50',
        ]);

        $permission = Permission::create($validated);

        return response()->json([
            'message' => 'Permiso creado',
            'permission' => $this->parsePermissionSlug($permission->slug),
        ], 201);
    }

    public function updatePermission(Request $request, int $id): JsonResponse
    {
        $permission = Permission::findOrFail($id);

        $validated = $request->validate([
            'slug' => 'sometimes|string|max:100|unique:permissions,slug,' . $id,
            'module' => 'sometimes|string|max:50',
            'action' => 'sometimes|string|max:50',
        ]);

        $permission->update($validated);

        return response()->json([
            'message' => 'Permiso actualizado',
            'permission' => $this->parsePermissionSlug($permission->slug),
        ]);
    }

    public function deletePermission(int $id): JsonResponse
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado']);
    }

    // ========== ROLE PERMISSIONS ==========

    public function getRolePermissions(RoleSyncService $roleService): JsonResponse
    {
        $roleSlugs = $roleService->getRoleSlugs();
        $allPermissions = Permission::all()->map(function ($perm) {
            return $this->parsePermissionSlug($perm->slug);
        });

        $rolePermissions = RolePermission::all()->groupBy('role_slug');

        $result = [];
        foreach ($roleSlugs as $roleSlug) {
            $rolePerms = $rolePermissions->get($roleSlug, collect())->pluck('permission_slug')->toArray();
            $result[$roleSlug] = $allPermissions->map(function ($perm) use ($rolePerms) {
                return array_merge($perm, ['enabled' => in_array($perm['slug'], $rolePerms)]);
            })->toArray();
        }

        return response()->json($result);
    }

    public function updateRolePermissions(Request $request, RoleSyncService $roleService): JsonResponse
    {
        $roleSlugs = $roleService->getRoleSlugs();
        $allSlugs = Permission::pluck('slug')->toArray();

        $validated = $request->validate([
            'role_slug' => 'required|string|in:' . implode(',', $roleSlugs),
            'permission_slugs' => 'required|array',
            'permission_slugs.*' => 'string|in:' . implode(',', $allSlugs),
        ]);

        try {
            DB::transaction(function () use ($validated) {
                RolePermission::where('role_slug', $validated['role_slug'])->delete();

                foreach ($validated['permission_slugs'] as $slug) {
                    RolePermission::create([
                        'role_slug' => $validated['role_slug'],
                        'permission_slug' => $slug,
                    ]);
                }
            });

            return response()->json(['message' => 'Permisos del rol actualizados']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al actualizar permisos'], 500);
        }
    }

    // ========== USER PERMISSIONS ==========

    public function getUserPermissions(): JsonResponse
    {
        $permissions = Permission::all()->map(function ($perm) {
            return $this->parsePermissionSlug($perm->slug);
        });

        $userPermissions = UserPermission::all()->groupBy('user_sso_id');

        $result = [];
        foreach ($userPermissions as $userId => $userPerms) {
            $result[$userId] = $permissions->map(function ($perm) use ($userPerms) {
                $override = $userPerms->firstWhere('permission_slug', $perm['slug']);
                return array_merge($perm, [
                    'type' => $override?->type ?? null,
                ]);
            })->toArray();
        }

        return response()->json($result);
    }

    public function updateUserPermissions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_sso_id' => 'required|string|max:36',
            'permissions' => 'required|array',
            'permissions.*.slug' => 'required|string',
            'permissions.*.type' => 'sometimes|in:grant,deny,null',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                UserPermission::where('user_sso_id', $validated['user_sso_id'])->delete();

                foreach ($validated['permissions'] as $perm) {
                    if ($perm['type'] !== null) {
                        UserPermission::create([
                            'user_sso_id' => $validated['user_sso_id'],
                            'permission_slug' => $perm['slug'],
                            'type' => $perm['type'],
                        ]);
                    }
                }
            });

            return response()->json(['message' => 'Permisos de usuario actualizados']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error al actualizar permisos'], 500);
        }
    }

    // ========== SYNC ==========

    public function syncRoles(RoleSyncService $service): JsonResponse
    {
        $roles = $service->syncRoles();

        return response()->json([
            'message' => 'Roles sincronizados',
            'roles' => $roles,
            'synced_at' => now()->toIso8601String(),
        ]);
    }

    public function getSyncStatus(RoleSyncService $service): JsonResponse
    {
        $roles = $service->getRoles();
        $lastSync = $service->getLastSyncTime();

        return response()->json([
            'roles' => $roles,
            'last_sync' => $lastSync,
        ]);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/Http/Controllers/Admin/PermissionController.php
git commit -m "feat: add permissions CRUD, user permissions CRUD, fixes (transaction, try/catch, parsePermissionSlug)"
```

---

## Task 7: PermissionMiddleware - priority logic

**Files:**
- Modify: `backend/app/Http/Middleware/PermissionMiddleware.php`

- [ ] **Step 1: Rewrite middleware with user override priority**

```php
<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use App\Models\UserPermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use TuOrg\SsoServer\Facades\SsoAuth;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!SsoAuth::isAuthenticated()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $user = SsoAuth::user();
        $userId = $user?->id;

        // Step 1: Check user override - deny takes precedence
        if ($userId) {
            $userDeny = UserPermission::where('user_sso_id', $userId)
                ->where('permission_slug', $permission)
                ->where('type', 'deny')
                ->exists();

            if ($userDeny) {
                return response()->json(['error' => 'No tienes el permiso requerido'], 403);
            }

            $userGrant = UserPermission::where('user_sso_id', $userId)
                ->where('permission_slug', $permission)
                ->where('type', 'grant')
                ->exists();

            if ($userGrant) {
                return $next($request);
            }
        }

        // Step 2: Check role permissions
        $userRoles = SsoAuth::roles();
        $roleSlugs = $this->extractRoleSlugs($userRoles);

        if (empty($roleSlugs)) {
            return response()->json(['error' => 'Sin rol asignado'], 403);
        }

        $hasPermission = RolePermission::whereIn('role_slug', $roleSlugs)
            ->where('permission_slug', $permission)
            ->exists();

        if (!$hasPermission) {
            return response()->json(['error' => 'No tienes el permiso requerido'], 403);
        }

        return $next($request);
    }

    private function extractRoleSlugs($roles): array
    {
        if (empty($roles)) {
            return [];
        }

        if (is_array($roles)) {
            return array_filter(array_map(function ($role) {
                return $role['slug'] ?? $role->slug ?? null;
            }, $roles));
        }

        if (is_object($roles) && isset($roles->slug)) {
            return [$roles->slug};
        }

        return [];
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/Http/Middleware/PermissionMiddleware.php
git commit -m "feat: middleware checks user overrides first (deny > grant > role)"
```

---

## Task 8: Routes - add permissions CRUD and user-permissions endpoints

**Files:**
- Modify: `backend/routes/api.php`

- [ ] **Step 1: Add new routes**

```php
// En el grupo admin (sso.role:admin), agregar:
Route::get("permissions", [PermissionController::class, "getAvailablePermissions"]);
Route::post("permissions", [PermissionController::class, "createPermission"]);
Route::put("permissions/{id}", [PermissionController::class, "updatePermission"]);
Route::delete("permissions/{id}", [PermissionController::class, "deletePermission"]);

Route::get("permissions/user-override", [PermissionController::class, "getUserPermissions"]);
Route::put("permissions/user-override", [PermissionController::class, "updateUserPermissions"]);
```

- [ ] **Step 2: Commit**

```bash
git add backend/routes/api.php
git commit -m "feat: add permissions CRUD and user-permissions endpoints"
```

---

## Task 9: Frontend permissionsController.ts - named params + types + methods

**Files:**
- Modify: `frontend/src/controllers/permissionsController.ts`

- [ ] **Step 1: Rewrite controller with named params and user permissions**

```ts
import { getApiConnector } from '@/apiConnector'

export interface AvailablePermission {
  slug: string
  module: string
  action: string
}

export interface RolePermissionData {
  slug: string
  module: string
  action: string
  enabled: boolean
}

export interface RolePermissions {
  [roleSlug: string]: RolePermissionData[]
}

export interface SyncStatus {
  roles: { slug: string; name: string; is_protected: boolean }[]
  last_sync: string | null
}

export interface UserPermissionOverride {
  slug: string
  module: string
  action: string
  type: 'grant' | 'deny' | null
}

export interface UserPermissions {
  [userId: string]: UserPermissionOverride[]
}

export function usePermissionsController() {
  async function getAvailablePermissions(): Promise<AvailablePermission[]> {
    const response = await getApiConnector().get<AvailablePermission[]>('admin/permissions')
    return response
  }

  async function createPermission(params: { slug: string; module: string; action: string }): Promise<void> {
    const { slug, module, action } = params
    await getApiConnector().post('admin/permissions', { slug, module, action })
  }

  async function updatePermission(params: { id: number; slug?: string; module?: string; action?: string }): Promise<void> {
    const { id, ...body } = params
    await getApiConnector().put(`admin/permissions/${id}`, body)
  }

  async function deletePermission(params: { id: number }): Promise<void> {
    const { id } = params
    await getApiConnector().delete(`admin/permissions/${id}`)
  }

  async function getRolePermissions(): Promise<RolePermissions> {
    const response = await getApiConnector().get<RolePermissions>('admin/permissions/roles')
    return response
  }

  async function updateRolePermissions(params: { roleSlug: string; permissionSlugs: string[] }): Promise<void> {
    const { roleSlug, permissionSlugs } = params
    await getApiConnector().put('admin/permissions/roles', {
      role_slug: roleSlug,
      permission_slugs: permissionSlugs,
    })
  }

  async function getUserPermissions(): Promise<UserPermissions> {
    const response = await getApiConnector().get<UserPermissions>('admin/permissions/user-override')
    return response
  }

  async function updateUserPermissions(params: { userSsoId: string; permissions: { slug: string; type: 'grant' | 'deny' | null }[] }): Promise<void> {
    const { userSsoId, permissions } = params
    await getApiConnector().put('admin/permissions/user-override', {
      user_sso_id: userSsoId,
      permissions,
    })
  }

  async function getSyncStatus(): Promise<SyncStatus> {
    const response = await getApiConnector().get<SyncStatus>('admin/permissions/sync-status')
    return response
  }

  async function syncRoles(): Promise<SyncStatus> {
    const response = await getApiConnector().post<SyncStatus>('admin/permissions/sync')
    return response
  }

  return {
    getAvailablePermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getRolePermissions,
    updateRolePermissions,
    getUserPermissions,
    updateUserPermissions,
    getSyncStatus,
    syncRoles,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/controllers/permissionsController.ts
git commit -m "feat: add CRUD methods, user permissions, named params pattern, proper types"
```

---

## Task 10: PermissionsPage.vue - tabs, types, script order, loading states

**Files:**
- Modify: `frontend/src/views/admin/PermissionsPage.vue`

- [ ] **Step 1: Rewrite with all fixes**

```vue
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin-panel"></ion-back-button>
        </ion-buttons>
        <ion-title>Permisos del Sistema</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-segment v-model="activeTab" @ionChange="tabChanged">
        <ion-segment-button value="permissions">
          <ion-label>Permisos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="roles">
          <ion-label>Roles</ion-label>
        </ion-segment-button>
        <ion-segment-button value="users">
          <ion-label>Usuarios</ion-label>
        </ion-segment-button>
        <ion-segment-button value="sync">
          <ion-label>SSO</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Tab: Permissions Catalog -->
      <div v-if="activeTab === 'permissions'" class="tab-content">
        <ion-button @click="showAddPermissionModal" :disabled="saving">
          <ion-icon slot="start" :icon="addCircle"></ion-icon>
          Agregar Permiso
        </ion-button>

        <ion-list>
          <ion-item v-for="perm in permissions" :key="perm.slug">
            <ion-label>
              <h2>{{ perm.module }}.{{ perm.action }}</h2>
              <p>{{ perm.slug }}</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="editPermission(perm)">
                <ion-icon :icon="pencil"></ion-icon>
              </ion-button>
              <ion-button @click="deletePermission(perm)" color="danger">
                <ion-icon :icon="trash"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>
      </div>

      <!-- Tab: Roles -->
      <div v-if="activeTab === 'roles'" class="tab-content">
        <ion-item>
          <ion-label>Rol:</ion-label>
          <ion-select v-model="selectedRole" @ionChange="loadRolePermissions">
            <ion-select-option v-for="role in availableRoles" :key="role.slug" :value="role.slug">
              {{ role.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <div class="permissions-grid">
          <ion-item v-for="perm in rolePermissions[selectedRole]" :key="perm.slug">
            <ion-checkbox
              slot="start"
              :checked="perm.enabled"
              @ionChange="togglePermission(perm.slug, $detail.checked)"
              :disabled="saving"
            ></ion-checkbox>
            <ion-label>
              <h3>{{ perm.module }}.{{ perm.action }}</h3>
              <p>{{ perm.slug }}</p>
            </ion-label>
          </ion-item>
        </div>

        <ion-button
          expand="block"
          @click="saveRolePermissions"
          :disabled="!hasChanges || saving"
          class="save-btn"
        >
          <ion-icon slot="start" :icon="save"></ion-icon>
          Guardar Cambios
        </ion-button>
      </div>

      <!-- Tab: Users -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <ion-item>
          <ion-label>Usuario SSO ID:</ion-label>
          <ion-input v-model="selectedUserId" placeholder="Ingrese ID del usuario"></ion-input>
        </ion-item>

        <div v-if="userPermissions[selectedUserId]" class="permissions-grid">
          <ion-item v-for="perm in userPermissions[selectedUserId]" :key="perm.slug">
            <ion-select
              slot="start"
              :value="perm.type"
              @ionChange="updateUserOverride(perm.slug, $detail.value)"
              :disabled="saving"
            >
              <ion-select-option :value="null">Heredado del rol</ion-select-option>
              <ion-select-option value="grant">Permitir</ion-select-option>
              <ion-select-option value="deny">Denegar</ion-select-option>
            </ion-select>
            <ion-label>
              <h3>{{ perm.module }}.{{ perm.action }}</h3>
              <p>{{ perm.slug }}</p>
            </ion-label>
          </ion-item>
        </div>

        <ion-button
          v-if="selectedUserId"
          expand="block"
          @click="saveUserPermissions"
          :disabled="saving"
          class="save-btn"
        >
          <ion-icon slot="start" :icon="save"></ion-icon>
          Guardar Permisos de Usuario
        </ion-button>
      </div>

      <!-- Tab: SSO -->
      <div v-if="activeTab === 'sync'" class="tab-content">
        <div class="sync-status">
          <h3>Roles desde SSO</h3>
          <ion-list>
            <ion-item v-for="role in syncStatus.roles" :key="role.slug">
              <ion-label>
                <h2>{{ role.name }}</h2>
                <p>{{ role.slug }} {{ role.is_protected ? '(protegido)' : '' }}</p>
              </ion-label>
              <ion-icon v-if="role.is_protected" slot="end" :icon="shield" color="success"></ion-icon>
            </ion-item>
          </ion-list>

          <p class="last-sync">
            Última sincronización: {{ syncStatus.last_sync || 'Nunca' }}
          </p>

          <ion-button @click="doSync" :disabled="saving">
            <ion-icon slot="start" :icon="syncIcon"></ion-icon>
            Sincronizar ahora
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonCheckbox, toastController,
  IonInput, alertController
} from '@ionic/vue'
import { shield, sync as syncIcon, addCircle, pencil, trash, save } from 'ionicons/icons'
import { usePermissionsController, type AvailablePermission, type RolePermissions, type SyncStatus, type UserPermissions } from '@/controllers/permissionsController'

const controller = usePermissionsController()

const activeTab = ref('permissions')
const saving = ref(false)

const selectedRole = ref('admin')
const availableRoles = ref<{slug: string; name: string}[]>([])
const rolePermissions = ref<RolePermissions>({})
const originalPermissions = ref<RolePermissions>({})

const selectedUserId = ref('')
const userPermissions = ref<UserPermissions>({})
const originalUserPermissions = ref<UserPermissions>({})

const permissions = ref<AvailablePermission[]>([])

const syncStatus = ref<SyncStatus>({ roles: [], last_sync: null })

const hasChanges = computed(() => {
  if (!selectedRole.value) return false
  const current = JSON.stringify(rolePermissions.value[selectedRole.value]?.map((p) => p.enabled))
  const original = JSON.stringify(originalPermissions.value[selectedRole.value]?.map((p) => p.enabled))
  return current !== original
})

const userHasChanges = computed(() => {
  if (!selectedUserId.value) return false
  const current = JSON.stringify(userPermissions.value[selectedUserId.value])
  const original = JSON.stringify(originalUserPermissions.value[selectedUserId.value])
  return current !== original
})

watch(selectedUserId, (newVal) => {
  if (!userPermissions.value[newVal]) {
    loadUserPermissions()
  }
})

async function loadPermissions() {
  permissions.value = await controller.getAvailablePermissions()
}

async function loadRolePermissions() {
  rolePermissions.value = await controller.getRolePermissions()
  originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
}

async function loadUserPermissions() {
  if (!selectedUserId.value) return
  userPermissions.value = await controller.getUserPermissions()
  originalUserPermissions.value = JSON.parse(JSON.stringify(userPermissions.value))
}

async function loadAvailableRoles() {
  const status = await controller.getSyncStatus()
  availableRoles.value = (status.roles || []).map((r) => ({
    slug: r.slug,
    name: r.name
  }))
  if (availableRoles.value.length > 0 && !selectedRole.value) {
    selectedRole.value = availableRoles.value[0].slug
  }
}

async function loadSyncStatus() {
  syncStatus.value = await controller.getSyncStatus()
}

function tabChanged() {
  if (activeTab.value === 'permissions') loadPermissions()
  if (activeTab.value === 'roles') loadRolePermissions()
  if (activeTab.value === 'users') loadUserPermissions()
  if (activeTab.value === 'sync') loadSyncStatus()
}

function togglePermission(permSlug: string, enabled: boolean) {
  const rolePerms = rolePermissions.value[selectedRole.value]
  const perm = rolePerms.find((p) => p.slug === permSlug)
  if (perm) perm.enabled = enabled
}

function updateUserOverride(permSlug: string, type: string | null) {
  const userPerms = userPermissions.value[selectedUserId.value]
  const perm = userPerms.find((p) => p.slug === permSlug)
  if (perm) perm.type = type as 'grant' | 'deny' | null
}

async function saveRolePermissions() {
  try {
    saving.value = true
    const enabledSlugs = rolePermissions.value[selectedRole.value]
      .filter((p) => p.enabled)
      .map((p) => p.slug)
    await controller.updateRolePermissions({ roleSlug: selectedRole.value, permissionSlugs: enabledSlugs })
    originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
    showToast('Cambios guardados')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

async function saveUserPermissions() {
  if (!selectedUserId.value) return
  try {
    saving.value = true
    const perms = userPermissions.value[selectedUserId.value].map((p) => ({
      slug: p.slug,
      type: p.type,
    }))
    await controller.updateUserPermissions({ userSsoId: selectedUserId.value, permissions: perms })
    originalUserPermissions.value = JSON.parse(JSON.stringify(userPermissions.value))
    showToast('Permisos de usuario guardados')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  } finally {
    saving.value = false
  }
}

async function doSync() {
  try {
    saving.value = true
    syncStatus.value = await controller.syncRoles()
    showToast('Sincronización completada')
  } catch (e: any) {
    showToast('Error al sincronizar', 'danger')
  } finally {
    saving.value = false
  }
}

async function showAddPermissionModal() {
  const alert = await alertController.create({
    header: 'Agregar Permiso',
    inputs: [
      { name: 'module', placeholder: 'Módulo (ej: posts)', type: 'text' },
      { name: 'action', placeholder: 'Acción (ej: create)', type: 'text' },
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Agregar',
        handler: async (data) => {
          if (!data.module || !data.action) {
            showToast('Complete todos los campos', 'warning')
            return
          }
          const slug = `${data.module}.${data.action}`
          try {
            saving.value = true
            await controller.createPermission({ slug, module: data.module, action: data.action })
            await loadPermissions()
            showToast('Permiso creado')
          } catch (e: any) {
            showToast(e.response?.data?.message || 'Error al crear', 'danger')
          } finally {
            saving.value = false
          }
        },
      },
    ],
  })
  await alert.present()
}

async function editPermission(perm: AvailablePermission) {
  const alert = await alertController.create({
    header: 'Editar Permiso',
    inputs: [
      { name: 'slug', placeholder: 'Slug', value: perm.slug, type: 'text' },
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: async (data) => {
          const parts = data.slug.split('.')
          try {
            saving.value = true
            await controller.updatePermission({ id: permissions.value.find(p => p.slug === perm.slug)?.id as number, slug: data.slug, module: parts[0], action: parts[1] })
            await loadPermissions()
            showToast('Permiso actualizado')
          } catch (e: any) {
            showToast(e.response?.data?.message || 'Error al actualizar', 'danger')
          } finally {
            saving.value = false
          }
        },
      },
    ],
  })
  await alert.present()
}

async function deletePermission(perm: AvailablePermission) {
  const alert = await alertController.create({
    header: 'Eliminar Permiso',
    message: `¿Eliminar ${perm.slug}?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          try {
            saving.value = true
            await controller.deletePermission({ id: permissions.value.find(p => p.slug === perm.slug)?.id as number })
            await loadPermissions()
            showToast('Permiso eliminado')
          } catch (e: any) {
            showToast(e.response?.data?.message || 'Error al eliminar', 'danger')
          } finally {
            saving.value = false
          }
        },
      },
    ],
  })
  await alert.present()
}

async function showToast(message: string, color: string = 'success') {
  const toast = await toastController.create({
    message, duration: 2000, color
  })
  toast.present()
}

onMounted(() => {
  loadPermissions()
  loadAvailableRoles()
  loadRolePermissions()
  loadSyncStatus()
})
</script>

<style scoped>
.tab-content {
  padding: 16px;
}
.permissions-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
}
.save-btn {
  margin-top: 20px;
}
.last-sync {
  color: var(--ion-color-medium);
  margin: 16px 0;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/admin/PermissionsPage.vue
git commit -m "feat: add permissions tab, user overrides tab, types, loading states, script order"
```

---

## Execution Notes

- Run migrations: `cd backend && php artisan migrate`
- Run seeder: `cd backend && php artisan db:seed --class=RolePermissionSeeder`
- Test: Use Postman or frontend UI to verify CRUD operations
- Build frontend: `cd frontend && pnpm run build`