# App-Level Permissions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Portfolio app to define local permissions and assign them to SSO roles (admin/editor/viewer). Admin role always has full control.

**Architecture:** Three-part system — (1) SSO Server exposes public roles endpoint, (2) Portfolio Backend stores permissions in local tables with RoleSyncService and PermissionMiddleware, (3) Portfolio Frontend provides UI for CRUD permissions and role assignment.

**Tech Stack:** Laravel 12 (Backend), Vue 8 + Ionic (Frontend), PHP 8.2, TypeScript

---

## File Structure Overview

### SSO Server (`/home/dowardev/Documentos/programacion/sso/back/`)
- `routes/api.php` — Add new public endpoint
- `app/Http/Controllers/RoleController.php` — New controller for GET /roles

### Portfolio Backend (`/home/dowardev/Documentos/programacion/portafolio/backend/`)
- `database/migrations/` — Create `permissions` and `role_permissions` tables
- `app/Models/Permission.php` — New model
- `app/Models/RolePermission.php` — New model
- `app/Services/RoleSyncService.php` — New service for SSO role sync
- `app/Http/Middleware/PermissionMiddleware.php` — New middleware
- `app/Http/Controllers/Admin/PermissionController.php` — New admin controller
- `database/seeders/PermissionSeeder.php` — Seed initial permissions
- `config/sso.php` — Add role_cache_ttl config

### Portfolio Frontend (`/home/dowardev/Documentos/programacion/portafolio/frontend/`)
- `src/views/admin/PermissionsPage.vue` — New page with tabs
- `src/controllers/permissionsController.ts` — New controller
- `src/controllers/roleSyncController.ts` — New controller
- `src/router/index.ts` — Add /admin-panel/permissions route
- `src/views/admin/AdminHomeMenu.vue` — Add "Permisos" menu item

---

## Phase 1: SSO Server Changes

### Task 1: Add public GET /roles endpoint

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso/back/routes/api.php:1-50`
- Create: `/home/dowardev/Documentos/programacion/sso/back/app/Http/Controllers/RoleController.php`

- [ ] **Step 1: Create RoleController**

Create `/home/dowardev/Documentos/programacion/sso/back/app/Http/Controllers/RoleController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $clientId = request('client_id');

        $roles = Role::orderBy('is_protected', 'desc')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'slug', 'is_protected']);

        return response()->json(['data' => $roles]);
    }
}
```

- [ ] **Step 2: Add route to api.php**

In `/home/dowardev/Documentos/programacion/sso/back/routes/api.php`, add after the jwks route:

```php
Route::get('/roles', [RoleController::class, 'index']);
```

- [ ] **Step 3: Test endpoint**

Run: `curl -s "http://localhost:8001/api/roles" | jq`
Expected: `{"data": [{"id":1,"name":"Administrador","slug":"admin","is_protected":true}, ...]}`

- [ ] **Step 4: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add app/Http/Controllers/RoleController.php routes/api.php
git commit -m "feat: add public /roles endpoint for client apps"
```

---

## Phase 2: Portfolio Backend - Database & Models

### Task 2: Create permissions table migration

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/database/migrations/2026_05_08_000001_create_permissions_table.php`

- [ ] **Step 1: Create migration**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/database/migrations/2026_05_08_000001_create_permissions_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('module', 100);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
```

- [ ] **Step 2: Run migration**

Run: `php artisan migrate`
Expected: Table `permissions` created

- [ ] **Step 3: Commit**

```bash
git add database/migrations/2026_05_08_000001_create_permissions_table.php
git commit -m "feat: create permissions table"
```

---

### Task 3: Create role_permissions table migration

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/database/migrations/2026_05_08_000002_create_role_permissions_table.php`

- [ ] **Step 1: Create migration**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/database/migrations/2026_05_08_000002_create_role_permissions_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('role_slug', 50);
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['role_slug', 'permission_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};
```

- [ ] **Step 2: Run migration**

Run: `php artisan migrate`
Expected: Table `role_permissions` created

- [ ] **Step 3: Commit**

```bash
git add database/migrations/2026_05_08_000002_create_role_permissions_table.php
git commit -m "feat: create role_permissions table"
```

---

### Task 4: Create Permission and RolePermission models

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Models/Permission.php`
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Models/RolePermission.php`

- [ ] **Step 1: Create Permission model**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/app/Models/Permission.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'module',
    ];
}
```

- [ ] **Step 2: Create RolePermission model**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/app/Models/RolePermission.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_slug',
        'permission_id',
    ];

    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/Models/Permission.php app/Models/RolePermission.php
git commit -m "feat: add Permission and RolePermission models"
```

---

### Task 5: Create PermissionSeeder with initial permissions

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/database/seeders/PermissionSeeder.php`

- [ ] **Step 1: Create seeder**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/database/seeders/PermissionSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Posts
            ['slug' => 'posts.index', 'name' => 'Ver posts', 'module' => 'posts'],
            ['slug' => 'posts.create', 'name' => 'Crear post', 'module' => 'posts'],
            ['slug' => 'posts.update', 'name' => 'Actualizar post', 'module' => 'posts'],
            ['slug' => 'posts.delete', 'name' => 'Eliminar post', 'module' => 'posts'],
            // Intro
            ['slug' => 'intro.index', 'name' => 'Ver intro', 'module' => 'intro'],
            ['slug' => 'intro.update', 'name' => 'Actualizar intro', 'module' => 'intro'],
            // Experiences
            ['slug' => 'experiences.index', 'name' => 'Ver experiencias', 'module' => 'experiences'],
            ['slug' => 'experiences.create', 'name' => 'Crear experiencia', 'module' => 'experiences'],
            ['slug' => 'experiences.update', 'name' => 'Actualizar experiencia', 'module' => 'experiences'],
            ['slug' => 'experiences.delete', 'name' => 'Eliminar experiencia', 'module' => 'experiences'],
            // Projects
            ['slug' => 'projects.index', 'name' => 'Ver proyectos', 'module' => 'projects'],
            ['slug' => 'projects.create', 'name' => 'Crear proyecto', 'module' => 'projects'],
            ['slug' => 'projects.update', 'name' => 'Actualizar proyecto', 'module' => 'projects'],
            ['slug' => 'projects.delete', 'name' => 'Eliminar proyecto', 'module' => 'projects'],
            // Certificates
            ['slug' => 'certificates.index', 'name' => 'Ver certificados', 'module' => 'certificates'],
            ['slug' => 'certificates.create', 'name' => 'Crear certificado', 'module' => 'certificates'],
            ['slug' => 'certificates.update', 'name' => 'Actualizar certificado', 'module' => 'certificates'],
            ['slug' => 'certificates.delete', 'name' => 'Eliminar certificado', 'module' => 'certificates'],
            // Freelance
            ['slug' => 'freelance.index', 'name' => 'Ver plataformas freelance', 'module' => 'freelance'],
            ['slug' => 'freelance.create', 'name' => 'Crear plataforma freelance', 'module' => 'freelance'],
            ['slug' => 'freelance.update', 'name' => 'Actualizar plataforma freelance', 'module' => 'freelance'],
            ['slug' => 'freelance.delete', 'name' => 'Eliminar plataforma freelance', 'module' => 'freelance'],
            // Freelance Comments
            ['slug' => 'freelance-comments.index', 'name' => 'Ver comentarios freelance', 'module' => 'freelance'],
            ['slug' => 'freelance-comments.create', 'name' => 'Crear comentario freelance', 'module' => 'freelance'],
            ['slug' => 'freelance-comments.update', 'name' => 'Actualizar comentario freelance', 'module' => 'freelance'],
            ['slug' => 'freelance-comments.delete', 'name' => 'Eliminar comentario freelance', 'module' => 'freelance'],
            // Stacks
            ['slug' => 'stacks.index', 'name' => 'Ver tecnologías', 'module' => 'stacks'],
            ['slug' => 'stacks.create', 'name' => 'Crear tecnología', 'module' => 'stacks'],
            ['slug' => 'stacks.update', 'name' => 'Actualizar tecnología', 'module' => 'stacks'],
            ['slug' => 'stacks.delete', 'name' => 'Eliminar tecnología', 'module' => 'stacks'],
            // Skills Categories
            ['slug' => 'skills-categories.index', 'name' => 'Ver categorías de habilidades', 'module' => 'skills-categories'],
            ['slug' => 'skills-categories.create', 'name' => 'Crear categoría de habilidades', 'module' => 'skills-categories'],
            ['slug' => 'skills-categories.update', 'name' => 'Actualizar categoría de habilidades', 'module' => 'skills-categories'],
            ['slug' => 'skills-categories.delete', 'name' => 'Eliminar categoría de habilidades', 'module' => 'skills-categories'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }
    }
}
```

- [ ] **Step 2: Register in DatabaseSeeder**

Add to `/home/dowardev/Documentos/programacion/portafolio/backend/database/seeders/DatabaseSeeder.php`:

```php
$this->call([
    PermissionSeeder::class,
    // ... existing seeders
]);
```

- [ ] **Step 3: Run seeder**

Run: `php artisan db:seed --class=PermissionSeeder`

- [ ] **Step 4: Commit**

```bash
git add database/seeders/PermissionSeeder.php database/seeders/DatabaseSeeder.php
git commit -m "feat: add PermissionSeeder with initial permissions"
```

---

## Phase 3: Portfolio Backend - Services & Middleware

### Task 6: Create RoleSyncService

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Services/RoleSyncService.php`

- [ ] **Step 1: Create service**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/app/Services/RoleSyncService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class RoleSyncService
{
    private string $ssoUrl;
    private int $ttl;

    public function __construct()
    {
        $this->ssoUrl = config('sso.server_url', 'http://localhost:8001');
        $this->ttl = config('sso.role_cache_ttl', 3600);
    }

    public function getRoles(): array
    {
        return Cache::remember('sso_roles', $this->ttl, function () {
            return $this->fetchRoles();
        });
    }

    public function syncRoles(): array
    {
        Cache::forget('sso_roles');
        return $this->getRoles();
    }

    public function getLastSyncTime(): ?string
    {
        if (Cache::has('sso_roles')) {
            return Cache::get('sso_roles_synced_at');
        }
        return null;
    }

    private function fetchRoles(): array
    {
        $clientId = config('sso.client_id');
        $response = Http::get("{$this->ssoUrl}/api/roles", [
            'client_id' => $clientId,
        ]);

        if ($response->successful()) {
            $roles = $response->json('data', []);
            Cache::put('sso_roles_synced_at', now()->toIso8601String(), $this->ttl);
            return $roles;
        }

        return [];
    }
}
```

- [ ] **Step 2: Add config in config/sso.php**

Check if `/home/dowardev/Documentos/programacion/portafolio/backend/config/sso.php` exists. If not, create it with role_cache_ttl config. Add:

```php
'role_cache_ttl' => env('SSO_ROLE_CACHE_TTL', 3600),
```

- [ ] **Step 3: Commit**

```bash
git add app/Services/RoleSyncService.php
git commit -m "feat: add RoleSyncService with cache"
```

---

### Task 7: Create PermissionMiddleware

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Middleware/PermissionMiddleware.php`

- [ ] **Step 1: Create middleware**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Middleware/PermissionMiddleware.php`:

```php
<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use TuOrg\SsoServer\Facades\SsoAuth;

class PermissionMiddleware
{
    public function handle(Request $request, string $permission): Response
    {
        if (!SsoAuth::isAuthenticated()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (SsoAuth::hasRole('admin')) {
            return $next($request);
        }

        $userRole = $this->getUserRole($request);

        if (!$userRole) {
            return response()->json(['error' => 'Sin rol asignado'], 403);
        }

        $hasPermission = RolePermission::where('role_slug', $userRole)
            ->whereHas('permission', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();

        if (!$hasPermission) {
            return response()->json(['error' => 'No tienes el permiso requerido'], 403);
        }

        return $next($request);
    }

    private function getUserRole(Request $request): ?string
    {
        $roles = SsoAuth::roles();

        if (empty($roles)) {
            return null;
        }

        if (is_array($roles) && isset($roles[0]['slug'])) {
            return $roles[0]['slug'];
        }

        if (is_object($roles) && isset($roles->slug)) {
            return $roles->slug;
        }

        return null;
    }
}
```

- [ ] **Step 2: Register middleware**

In `/home/dowardev/Documentos/programacion/portafolio/backend/bootstrap/app.php`, add:

```php
$app->router->aliasMiddleware('permission', \App\Http\Middleware\PermissionMiddleware::class);
```

- [ ] **Step 3: Commit**

```bash
git add app/Http/Middleware/PermissionMiddleware.php bootstrap/app.php
git commit -m "feat: add PermissionMiddleware"
```

---

## Phase 4: Portfolio Backend - API Endpoints

### Task 8: Create PermissionController for admin

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Controllers/Admin/PermissionController.php`

- [ ] **Step 1: Create controller**

Create `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Controllers/Admin/PermissionController.php`:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\RolePermission;
use App\Services\RoleSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Permission::orderBy('module')->orderBy('name');

        if ($request->has('module')) {
            $query->where('module', $request->module);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:permissions,slug|max:255',
            'name' => 'required|string|max:255',
            'module' => 'required|string|max:100',
        ]);

        $permission = Permission::create($validated);

        return response()->json(['message' => 'Permiso creado', 'permission' => $permission], 201);
    }

    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'module' => 'sometimes|string|max:100',
        ]);

        $permission->update($validated);

        return response()->json(['message' => 'Permiso actualizado', 'permission' => $permission]);
    }

    public function destroy(Permission $permission): JsonResponse
    {
        RolePermission::where('permission_id', $permission->id)->delete();
        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado']);
    }

    public function getRolePermissions(): JsonResponse
    {
        $roles = config('sso.roles', ['admin', 'editor', 'viewer']);

        $permissions = Permission::orderBy('module')->orderBy('name')->get();
        $rolePermissions = RolePermission::all()->groupBy('role_slug');

        $result = [];
        foreach ($roles as $roleSlug) {
            $rolePerms = $rolePermissions->get($roleSlug, collect())->pluck('permission_id');
            $result[$roleSlug] = $permissions->map(function ($perm) use ($rolePerms) {
                return [
                    'id' => $perm->id,
                    'slug' => $perm->slug,
                    'name' => $perm->name,
                    'module' => $perm->module,
                    'enabled' => $rolePerms->contains($perm->id),
                ];
            })->toArray();
        }

        return response()->json($result);
    }

    public function updateRolePermissions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role_slug' => 'required|string|in:admin,editor,viewer',
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        RolePermission::where('role_slug', $validated['role_slug'])->delete();

        foreach ($validated['permission_ids'] as $permissionId) {
            RolePermission::create([
                'role_slug' => $validated['role_slug'],
                'permission_id' => $permissionId,
            ]);
        }

        return response()->json(['message' => 'Permisos del rol actualizados']);
    }

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

- [ ] **Step 2: Add routes**

In `/home/dowardev/Documentos/programacion/portafolio/backend/routes/api.php`, add after admin routes:

```php
Route::middleware('sso.auth', 'sso.role:admin')->group(function () {
    Route::get('/admin/permissions', [PermissionController::class, 'index']);
    Route::post('/admin/permissions', [PermissionController::class, 'store']);
    Route::put('/admin/permissions/{permission}', [PermissionController::class, 'update']);
    Route::delete('/admin/permissions/{permission}', [PermissionController::class, 'destroy']);
    Route::get('/admin/permissions/roles', [PermissionController::class, 'getRolePermissions']);
    Route::put('/admin/permissions/roles', [PermissionController::class, 'updateRolePermissions']);
    Route::post('/admin/permissions/sync', [PermissionController::class, 'syncRoles']);
    Route::get('/admin/permissions/sync-status', [PermissionController::class, 'getSyncStatus']);
});
```

- [ ] **Step 3: Commit**

```bash
git add app/Http/Controllers/Admin/PermissionController.php routes/api.php
git commit -m "feat: add PermissionController admin endpoints"
```

---

## Phase 5: Portfolio Frontend - UI

### Task 9: Create permissionsController

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/controllers/permissionsController.ts`

- [ ] **Step 1: Create controller**

Create `/home/dowardev/Documentos/programacion/portafolio/frontend/src/controllers/permissionsController.ts`:

```typescript
import { api } from '@/services/api'

interface Permission {
  id: number
  slug: string
  name: string
  module: string
}

interface RolePermissionData {
  id: number
  slug: string
  name: string
  module: string
  enabled: boolean
}

interface RolePermissions {
  [roleSlug: string]: RolePermissionData[]
}

interface SyncStatus {
  roles: { slug: string; name: string; is_protected: boolean }[]
  last_sync: string | null
}

export function usePermissionsController() {
  async function getPermissions(module?: string): Promise<Permission[]> {
    const params = module ? { module } : {}
    const { data } = await api.get('/admin/permissions', { params })
    return data
  }

  async function createPermission(params: { slug: string; name: string; module: string }): Promise<Permission> {
    const { data } = await api.post('/admin/permissions', params)
    return data.permission
  }

  async function updatePermission(id: number, params: { name?: string; module?: string }): Promise<Permission> {
    const { data } = await api.put(`/admin/permissions/${id}`, params)
    return data.permission
  }

  async function deletePermission(id: number): Promise<void> {
    await api.delete(`/admin/permissions/${id}`)
  }

  async function getRolePermissions(): Promise<RolePermissions> {
    const { data } = await api.get('/admin/permissions/roles')
    return data
  }

  async function updateRolePermissions(roleSlug: string, permissionIds: number[]): Promise<void> {
    await api.put('/admin/permissions/roles', {
      role_slug: roleSlug,
      permission_ids: permissionIds,
    })
  }

  async function getSyncStatus(): Promise<SyncStatus> {
    const { data } = await api.get('/admin/permissions/sync-status')
    return data
  }

  async function syncRoles(): Promise<SyncStatus> {
    const { data } = await api.post('/admin/permissions/sync')
    return data
  }

  return {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getRolePermissions,
    updateRolePermissions,
    getSyncStatus,
    syncRoles,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/controllers/permissionsController.ts
git commit -m "feat: add permissionsController"
```

---

### Task 10: Create PermissionsPage.vue with tabs

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/views/admin/PermissionsPage.vue`

- [ ] **Step 1: Create page**

Create `/home/dowardev/Documentos/programacion/portafolio/frontend/src/views/admin/PermissionsPage.vue`:

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
        <ion-segment-button value="sync">
          <ion-label>Sincronización</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Tab: Permisos -->
      <div v-if="activeTab === 'permissions'" class="tab-content">
        <div class="toolbar">
          <ion-select v-model="filterModule" placeholder="Filtrar por módulo" @ionChange="loadPermissions">
            <ion-select-option value="">Todos</ion-select-option>
            <ion-select-option v-for="mod in modules" :key="mod" :value="mod">{{ mod }}</ion-select-option>
          </ion-select>
          <ion-button @click="showCreateModal = true">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Nuevo
          </ion-button>
        </div>

        <ion-list>
          <ion-item v-for="perm in permissions" :key="perm.id">
            <ion-label>
              <h2>{{ perm.name }}</h2>
              <p>{{ perm.slug }} ({{ perm.module }})</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="editPermission(perm)">
                <ion-icon :icon="pencil"></ion-icon>
              </ion-button>
              <ion-button color="danger" @click="confirmDelete(perm)">
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
            <ion-select-option value="admin">Admin</ion-select-option>
            <ion-select-option value="editor">Editor</ion-select-option>
            <ion-select-option value="viewer">Visor</ion-select-option>
          </ion-select>
        </ion-item>

        <div v-if="selectedRole === 'admin'" class="admin-notice">
          <ion-icon :icon="informationCircle"></ion-icon>
          El rol Admin siempre tiene acceso total a todos los permisos.
        </div>

        <div v-else class="permissions-grid">
          <ion-item v-for="perm in rolePermissions[selectedRole]" :key="perm.id">
            <ion-checkbox
              slot="start"
              :checked="perm.enabled"
              @ionChange="togglePermission(perm.id, $detail.checked)"
              :disabled="selectedRole === 'admin'"
            ></ion-checkbox>
            <ion-label>
              <h3>{{ perm.name }}</h3>
              <p>{{ perm.module }}</p>
            </ion-label>
          </ion-item>
        </div>

        <ion-button
          v-if="selectedRole !== 'admin'"
          expand="block"
          @click="saveRolePermissions"
          :disabled="!hasChanges"
          class="save-btn"
        >
          Guardar Cambios
        </ion-button>
      </div>

      <!-- Tab: Sincronización -->
      <div v-if="activeTab === 'sync'" class="tab-content">
        <div class="sync-status">
          <h3>Roles del SSO (cacheados)</h3>
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

          <ion-button @click="doSync">
            <ion-icon slot="start" :icon="sync"></ion-icon>
            Sincronizar ahora
          </ion-button>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <ion-modal :is-open="showCreateModal" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingPermission ? 'Editar' : 'Nuevo' }} Permiso</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-item>
            <ion-label position="stacked">Slug</ion-label>
            <ion-input v-model="form.slug" placeholder="posts.create"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input v-model="form.name" placeholder="Crear post"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Módulo</ion-label>
            <ion-input v-model="form.module" placeholder="posts"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="savePermission" class="save-btn">
            Guardar
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem,
  IonButton, IonIcon, IonSelect, IonSelectOption, IonModal, IonInput,
  IonCheckbox, toastController
} from '@ionic/vue'
import { add, pencil, trash, informationCircle, shield, sync } from 'ionicons/icons'
import { usePermissionsController } from '@/controllers/permissionsController'

const controller = usePermissionsController()

const activeTab = ref('permissions')
const permissions = ref<any[]>([])
const filterModule = ref('')
const modules = computed(() => [...new Set(permissions.value.map(p => p.module))])

const showCreateModal = ref(false)
const editingPermission = ref<any>(null)
const form = ref({ slug: '', name: '', module: '' })

const selectedRole = ref('admin')
const rolePermissions = ref<any>({})
const originalPermissions = ref<any>({})

const syncStatus = ref<any>({ roles: [], last_sync: null })

const hasChanges = computed(() => {
  if (selectedRole.value === 'admin') return false
  const current = JSON.stringify(rolePermissions.value[selectedRole.value]?.map((p: any) => p.enabled))
  const original = JSON.stringify(originalPermissions.value[selectedRole.value]?.map((p: any) => p.enabled))
  return current !== original
})

async function loadPermissions() {
  permissions.value = await controller.getPermissions(filterModule.value || undefined)
}

async function loadRolePermissions() {
  rolePermissions.value = await controller.getRolePermissions()
  originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
}

async function loadSyncStatus() {
  syncStatus.value = await controller.getSyncStatus()
}

function tabChanged() {
  if (activeTab.value === 'permissions') loadPermissions()
  if (activeTab.value === 'roles') loadRolePermissions()
  if (activeTab.value === 'sync') loadSyncStatus()
}

function editPermission(perm: any) {
  editingPermission.value = perm
  form.value = { slug: perm.slug, name: perm.name, module: perm.module }
  showCreateModal.value = true
}

async function savePermission() {
  try {
    if (editingPermission.value) {
      await controller.updatePermission(editingPermission.value.id, {
        name: form.value.name,
        module: form.value.module
      })
    } else {
      await controller.createPermission(form.value)
    }
    closeModal()
    loadPermissions()
    showToast('Permiso guardado')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  }
}

async function confirmDelete(perm: any) {
  try {
    await controller.deletePermission(perm.id)
    loadPermissions()
    showToast('Permiso eliminado')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al eliminar', 'danger')
  }
}

function closeModal() {
  showCreateModal.value = false
  editingPermission.value = null
  form.value = { slug: '', name: '', module: '' }
}

function togglePermission(permId: number, enabled: boolean) {
  const rolePerms = rolePermissions.value[selectedRole.value]
  const perm = rolePerms.find((p: any) => p.id === permId)
  if (perm) perm.enabled = enabled
}

async function saveRolePermissions() {
  try {
    const enabledIds = rolePermissions.value[selectedRole.value]
      .filter((p: any) => p.enabled)
      .map((p: any) => p.id)
    await controller.updateRolePermissions(selectedRole.value, enabledIds)
    originalPermissions.value = JSON.parse(JSON.stringify(rolePermissions.value))
    showToast('Cambios guardados')
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Error al guardar', 'danger')
  }
}

async function doSync() {
  try {
    syncStatus.value = await controller.syncRoles()
    showToast('Sincronización completada')
  } catch (e: any) {
    showToast('Error al sincronizar', 'danger')
  }
}

async function showToast(message: string, color: string = 'success') {
  const toast = await toastController.create({
    message, duration: 2000, color
  })
  toast.present()
}

onMounted(() => {
  loadPermissions()
})
</script>

<style scoped>
.tab-content {
  padding: 16px;
}
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.toolbar ion-select {
  flex: 1;
  max-width: 200px;
}
.admin-notice {
  background: var(--ion-color-warning-bg);
  color: var(--ion-color-warning);
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.permissions-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

- [ ] **Step 2: Add route**

In `/home/dowardev/Documentos/programacion/portafolio/frontend/src/router/index.ts`, add:

```typescript
{
  path: '/admin-panel/permissions',
  component: () => import('@/views/admin/PermissionsPage.vue'),
  meta: { requiresAuth: true, requiresAdmin: true }
},
```

- [ ] **Step 3: Add menu item**

In `/home/dowardev/Documentos/programacion/portafolio/frontend/src/views/admin/AdminHomeMenu.vue`, add new menu item after existing items:

```vue
<ion-item button @click="navigateTo('/admin-panel/permissions')">
  <ion-icon slot="start" :icon="key"></ion-icon>
  <ion-label>Permisos</ion-label>
</ion-item>
```

Import the key icon:

```typescript
import { key from 'ionicons/icons'
```

- [ ] **Step 4: Commit**

```bash
git add src/views/admin/PermissionsPage.vue src/router/index.ts src/views/admin/AdminHomeMenu.vue
git commit -m "feat: add permissions admin page with tabs"
```

---

## Summary

| Task | Description | Status |
|------|-------------|--------|
| 1 | SSO Server: Add public GET /roles endpoint | Pending |
| 2 | Portfolio Backend: Create permissions table | Pending |
| 3 | Portfolio Backend: Create role_permissions table | Pending |
| 4 | Portfolio Backend: Create Permission and RolePermission models | Pending |
| 5 | Portfolio Backend: Create PermissionSeeder | Pending |
| 6 | Portfolio Backend: Create RoleSyncService | Pending |
| 7 | Portfolio Backend: Create PermissionMiddleware | Pending |
| 8 | Portfolio Backend: Create PermissionController + routes | Pending |
| 9 | Portfolio Frontend: Create permissionsController | Pending |
| 10 | Portfolio Frontend: Create PermissionsPage.vue + routes + menu | Pending |

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-08-app-permissions.md`. Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**