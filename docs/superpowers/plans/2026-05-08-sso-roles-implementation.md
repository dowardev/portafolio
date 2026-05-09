# SSO Roles System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el sistema de roles SSO de un mecanismo dual (`is_admin` + roles) a roles genéricos unificados, con filtrado por client_id en la API y middleware de roles en el backend del portfolio.

**Architecture:** Big bang approach - todos los cambios simultáneamente. El SSO filtra roles por client_id obligatoriamente, el SSO Client Package envía el client_id, y el Portfolio Backend implementa RoleMiddleware para validación de permisos.

**Tech Stack:** Laravel 12 (SSO), TypeScript (SSO Client, Portfolio Front), Laravel (Portfolio Backend), PHPUnit, Vitest, Cypress

---

## Phase 1: SSO Backend - Modelo y Migraciones

### Task 1: Actualizar RoleSeeder

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso/back/database/seeders/RoleSeeder.php`

- [ ] **Step 1: Leer el RoleSeeder actual**

```php
// Leer el archivo para ver la estructura actual
```

- [ ] **Step 2: Modificar RoleSeeder para usar admin/editor/viewer**

```php
public function run(): void
{
    $roles = [
        [
            'name' => 'Administrador',
            'slug' => 'admin',
            'description' => 'Acceso completo al sistema',
            'is_protected' => true,
        ],
        [
            'name' => 'Editor',
            'slug' => 'editor',
            'description' => 'Crear y editar contenido',
            'is_protected' => true,
        ],
        [
            'name' => 'Visor',
            'slug' => 'viewer',
            'description' => 'Solo lectura',
            'is_protected' => true,
        ],
    ];

    foreach ($roles as $role) {
        Role::updateOrCreate(
            ['slug' => $role['slug']],
            $role
        );
    }
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add database/seeders/RoleSeeder.php
git commit -m "refactor: replace roles with admin/editor/viewer slugs"
```

---

### Task 2: Crear Migration para actualizar roles

**Files:**
- Create: `/home/dowardev/Documentos/programacion/sso/back/database/migrations/2026_05_08_000001_update_roles_slugs.php`

- [ ] **Step 1: Escribir la migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update existing roles
        DB::table('roles')
            ->where('slug', 'standard')
            ->update(['slug' => 'viewer', 'name' => 'Visor', 'description' => 'Solo lectura']);

        // Delete moderator role
        DB::table('roles')
            ->where('slug', 'moderator')
            ->delete();

        // Insert editor if not exists
        DB::table('roles')->updateOrInsert(
            ['slug' => 'editor'],
            [
                'name' => 'Editor',
                'description' => 'Crear y editar contenido',
                'is_protected' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    public function down(): void
    {
        DB::table('roles')
            ->where('slug', 'editor')
            ->delete();

        DB::table('roles')
            ->where('slug', 'viewer')
            ->update(['slug' => 'standard', 'name' => 'Estandar', 'description' => '']);

        DB::table('roles')->insert([
            'name' => 'Moderador',
            'slug' => 'moderator',
            'description' => '',
            'is_protected' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
```

- [ ] **Step 2: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add database/migrations/2026_05_08_000001_update_roles_slugs.php
git commit -m "refactor: migrate roles to admin/editor/viewer schema"
```

---

### Task 3: Migration para eliminar columna is_admin

**Files:**
- Create: `/home/dowardev/Documentos/programacion/sso/back/database/migrations/2026_05_08_000002_drop_is_admin_column.php`

- [ ] **Step 1: Escribir la migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('password');
        });
    }
};
```

- [ ] **Step 2: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add database/migrations/2026_05_08_000002_drop_is_admin_column.php
git commit -m "refactor: remove is_admin column from users table"
```

---

## Phase 2: SSO Backend - Modelos

### Task 4: Actualizar User.php modelo

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso/back/app/Models/User.php`

- [ ] **Step 1: Leer User.php actual**

```php
// Leer el archivo para ver estructura actual
// Buscar: $fillable, isAdmin(), getEffectiveRole()
```

- [ ] **Step 2: Modificar $fillable - eliminar is_admin**

```php
protected $fillable = [
    'name',
    'user',
    'email',
    'password',
    // is_admin REMOVIDO
];
```

- [ ] **Step 3: Eliminar método isAdmin() si existe**

- [ ] **Step 4: Actualizar getEffectiveRole() para default a 'viewer'**

```php
public function getEffectiveRole(?int $ssoClientId = null): ?Role
{
    // Primero buscar rol específico del cliente
    if ($ssoClientId) {
        $role = $this->roles()
            ->where('sso_client_id', $ssoClientId)
            ->first();
        if ($role) {
            return $role;
        }
    }

    // Luego buscar rol global (sso_client_id = null)
    $globalRole = $this->roles()
        ->whereNull('sso_client_id')
        ->first();

    if ($globalRole) {
        return $globalRole;
    }

    // Default a viewer si no tiene rol
    return Role::where('slug', 'viewer')->first();
}
```

- [ ] **Step 5: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add app/Models/User.php
git commit -m "refactor: update User model - remove is_admin, use roles"
```

---

## Phase 3: SSO Backend - Middleware

### Task 5: Actualizar IsAdmin middleware

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso/back/app/Http/Middleware/IsAdmin.php`

- [ ] **Step 1: Leer IsAdmin.php actual**

```php
// Leer el archivo para ver implementación actual
```

- [ ] **Step 2: Reescribir para usar hasRole('admin')**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $ssoUserId = $request->get('sso_user_id');

        if (!$ssoUserId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = \App\Models\User::find($ssoUserId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Usar hasRole en lugar de is_admin
        $ssoClientId = $request->query('sso_client_id');

        if ($ssoClientId) {
            // Verificar rol específico del cliente
            $effectiveRole = $user->getEffectiveRole((int) $ssoClientId);
            if (!$effectiveRole || $effectiveRole->slug !== 'admin') {
                return response()->json(['error' => 'Forbidden - admin role required for this client'], 403);
            }
        } else {
            // Verificar rol global
            if (!$user->hasRole('admin')) {
                return response()->json(['error' => 'Forbidden - admin role required'], 403);
            }
        }

        return $next($request);
    }
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add app/Http/Middleware/IsAdmin.php
git commit -m "refactor: IsAdmin middleware uses hasRole instead of is_admin"
```

---

## Phase 4: SSO Backend - Controllers

### Task 6: Actualizar AuthController

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso/back/app/Http/Controllers/AuthController.php`

- [ ] **Step 1: Leer AuthController.php - buscar métodos me() y userAuth()**

```php
// Encontrar: me(), userAuth(), checkSession()
```

- [ ] **Step 2: Modificar método me() para filtrar por client_id**

```php
public function me(Request $request): Response
{
    $ssoUserId = $request->get('sso_user_id');
    $clientId = $request->query('client_id');

    if (!$clientId) {
        return response()->json(['error' => 'client_id is required'], 400);
    }

    $user = User::with(['roles' => function ($query) use ($clientId) {
        $query->where('sso_client_id', $clientId)
              ->orWhereNull('sso_client_id');
    }])->find($ssoUserId);

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'user' => $user->user,
        'email' => $user->email,
        'roles' => $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_protected' => $role->is_protected,
                'pivot' => [
                    'sso_client_id' => $role->pivot->sso_client_id,
                ],
            ];
        }),
    ]);
}
```

- [ ] **Step 3: Modificar método userAuth() (igual que me pero con otro nombre)**

```php
public function userAuth(Request $request): Response
{
    $ssoUserId = $request->get('sso_user_id');
    $clientId = $request->query('client_id');

    if (!$clientId) {
        return response()->json(['error' => 'client_id is required'], 400);
    }

    $user = User::with(['roles' => function ($query) use ($clientId) {
        $query->where('sso_client_id', $clientId)
              ->orWhereNull('sso_client_id');
    }])->find($ssoUserId);

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    return response()->json([
        'authenticated' => true,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'user' => $user->user,
            'email' => $user->email,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'description' => $role->description,
                    'is_protected' => $role->is_protected,
                    'pivot' => [
                        'sso_client_id' => $role->pivot->sso_client_id,
                    ],
                ];
            }),
        ],
    ]);
}
```

- [ ] **Step 4: Modificar checkSession() de manera similar**

```php
public function checkSession(Request $request): Response
{
    $ssoUserId = $request->get('sso_user_id');
    $clientId = $request->query('client_id');

    if (!$ssoUserId) {
        return response()->json(['authenticated' => false, 'user' => null]);
    }

    if (!$clientId) {
        return response()->json(['error' => 'client_id is required'], 400);
    }

    $user = User::with(['roles' => function ($query) use ($clientId) {
        $query->where('sso_client_id', $clientId)
              ->orWhereNull('sso_client_id');
    }])->find($ssoUserId);

    if (!$user) {
        return response()->json(['authenticated' => false, 'user' => null]);
    }

    return response()->json([
        'authenticated' => true,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'user' => $user->user,
            'email' => $user->email,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'description' => $role->description,
                    'is_protected' => $role->is_protected,
                    'pivot' => [
                        'sso_client_id' => $role->pivot->sso_client_id,
                    ],
                ];
            }),
        ],
    ]);
}
```

- [ ] **Step 5: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add app/Http/Controllers/AuthController.php
git commit -m "feat: filter roles by client_id in /me, /user-auth, /session/check"
```

---

### Task 7: Actualizar AdminController

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso/back/app/Http/Controllers/AdminController.php`

- [ ] **Step 1: Leer AdminController.php - buscar método toggle()**

```php
// Encontrar: toggle() método
```

- [ ] **Step 2: Eliminar o modificar método toggle()**

El método toggle() actualmente hace flip del boolean is_admin. Como el is_admin ya no existe (se elimina en migration), este endpoint debe:
- O eliminarlo completamente de las rutas
- O convertirlo para asignar/remover rol admin

**Opción: Convertir a endpoint de rol (recomendado)**

```php
public function toggle(Request $request, int $id): Response
{
    $request->validate([
        'action' => 'required|in:assign,remove',
        'sso_client_id' => 'nullable|integer',
    ]);

    $user = User::findOrFail($id);
    $action = $request->input('action');
    $ssoClientId = $request->input('sso_client_id');
    $adminRole = Role::where('slug', 'admin')->firstOrFail();

    if ($action === 'assign') {
        $user->roles()->attach($adminRole->id, ['sso_client_id' => $ssoClientId]);
    } else {
        $user->roles()->where('role_id', $adminRole->id)
            ->where('sso_client_id', $ssoClientId ?? null)
            ->detach();
    }

    return response()->json(['message' => 'Role updated successfully']);
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add app/Http/Controllers/AdminController.php
git commit -m "refactor: toggle endpoint now manages admin role instead of is_admin"
```

---

## Phase 5: SSO Client Package

### Task 8: Actualizar AuthService.ts

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso-client/packages/sso-client/src/AuthService.ts`

- [ ] **Step 1: Leer AuthService.ts - buscar getUser()**

```typescript
// Encontrar: getUser() método
```

- [ ] **Step 2: Modificar getUser() para enviar client_id**

```typescript
async getUser(): Promise<User | null> {
  const clientId = this.getClientId();
  if (!clientId) {
    console.warn('SSO Client: client_id not configured');
    return null;
  }

  try {
    const response = await fetch(`${this.baseUrl}/user-auth?client_id=${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.user || data;
  } catch (error) {
    console.error('SSO: Error fetching user:', error);
    return null;
  }
}

private getClientId(): string | null {
  const clientId = (this.config as any).clientId || (this.config as any).client_id;
  return clientId || null;
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso-client
git add packages/sso-client/src/AuthService.ts
git commit -m "feat: AuthService sends client_id to /user-auth"
```

---

### Task 9: Actualizar types/index.ts

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso-client/packages/sso-client/src/types/index.ts`

- [ ] **Step 1: Leer types/index.ts - buscar interfaz User**

```typescript
// Encontrar: interface User
```

- [ ] **Step 2: Eliminar isAdmin de User**

```typescript
export interface User {
  id: number | string;
  name: string;
  user?: string;
  email: string;
  roles?: Role[];
  // isAdmin ELIMINADO
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso-client
git add packages/sso-client/src/types/index.ts
git commit -m "refactor: remove isAdmin from User type"
```

---

## Phase 6: Portfolio Frontend

### Task 10: Actualizar interfaces.ts

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/interfaces.ts`

- [ ] **Step 1: Leer interfaces.ts - buscar User interface**

```typescript
// Encontrar: interface User
```

- [ ] **Step 2: Eliminar isAdmin de User**

```typescript
export interface User {
  id: number;
  name: string;
  user?: string;
  email: string;
  roles?: Role[];
  // isAdmin ELIMINADO
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/frontend
git add src/interfaces.ts
git commit -m "refactor: remove isAdmin from User interface"
```

---

### Task 11: Actualizar sso-client.d.ts

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/types/sso-client.d.ts`

- [ ] **Step 1: Leer sso-client.d.ts**

```typescript
// Encontrar: User type
```

- [ ] **Step 2: Eliminar isAdmin de User**

```typescript
export type User = {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
  // isAdmin ELIMINADO
};
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/frontend
git add src/types/sso-client.d.ts
git commit -m "refactor: remove isAdmin from sso-client.d.ts User type"
```

---

### Task 12: Actualizar userService.ts

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/services/userService.ts`

- [ ] **Step 1: Leer userService.ts - buscar formatUserResponse()**

```typescript
// Encontrar: formatUserResponse() función
```

- [ ] **Step 2: Eliminar mapeo is_admin -> isAdmin**

```typescript
export function formatUserResponse(data: any): User {
  return {
    id: data.id,
    name: data.name,
    user: data.user,
    email: data.email,
    roles: data.roles || [],
    // isAdmin ELIMINADO
  };
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/frontend
git add src/services/userService.ts
git commit -m "refactor: remove isAdmin mapping from formatUserResponse"
```

---

### Task 13: Actualizar router/index.ts

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/router/index.ts`

- [ ] **Step 1: Leer router/index.ts - buscar hasAdminRole()**

```typescript
// Encontrar: hasAdminRole() función
```

- [ ] **Step 2: Verificar que hasAdminRole() funcione correctamente**

La función ya verifica `role.slug === 'admin'` lo cual es correcto. Los roles ya vendrán filtrados por client_id desde el SSO.

```typescript
export function hasAdminRole(user: User | null): boolean {
  if (!user?.roles || user.roles.length === 0) return false;
  return user.roles.some(
    (role) => role.slug === 'admin' || role.name.toLowerCase() === 'administrador'
  );
}
```

- [ ] **Step 3: Commit (si hay cambios, si no omitir)**

No se requieren cambios si la función ya usa roles.

---

### Task 14: Actualizar MenuComponent.vue

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/frontend/src/components/menu/MenuComponent.vue`

- [ ] **Step 1: Leer MenuComponent.vue - buscar isAdmin computed**

```vue
// Encontrar: isAdmin computed (línea ~439)
```

- [ ] **Step 2: Modificar isAdmin para usar hasAdminRole del router**

```typescript
import { hasAdminRole } from '@/router';

const isAdmin = computed(() => {
  return hasAdminRole(userController.getUser());
});
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/frontend
git add src/components/menu/MenuComponent.vue
git commit -f "refactor: use hasAdminRole from router instead of local computed"
```

---

## Phase 7: Portfolio Backend - RoleMiddleware

### Task 15: Crear RoleMiddleware

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Middleware/RoleMiddleware.php`

- [ ] **Step 1: Escribir RoleMiddleware**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $allowedRoles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $role = $user->role ?? $request->header('X-User-Role');

        if (!$role) {
            return response()->json(['error' => 'Role not found'], 403);
        }

        $allowedRolesArray = explode(',', $allowedRoles);
        $allowedRolesArray = array_map('trim', $allowedRolesArray);

        if (!in_array($role, $allowedRolesArray)) {
            return response()->json(['error' => 'Forbidden - insufficient permissions'], 403);
        }

        return $next($request);
    }
}
```

- [ ] **Step 2: Registrar middleware en Kernel.php**

Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Kernel.php`

```php
protected $middlewareAliases = [
    // ... existentes
    'role' => \App\Http\Middleware\RoleMiddleware::class,
];
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
git add app/Http/Middleware/RoleMiddleware.php app/Http/Kernel.php
git commit -m "feat: add RoleMiddleware for permission checking"
```

---

### Task 16: Integrar SSO client con RoleMiddleware

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/routes/api.php`

- [ ] **Step 1: Leer api.php para ver estructura de rutas**

```php
// Ver estructura de rutas
```

- [ ] **Step 2: Agregar ejemplos de uso del RoleMiddleware**

```php
// Rutas solo para admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('images', ImageController::class);
});

// Rutas para admin y editor
Route::middleware(['auth:sanctum', 'role:admin,editor'])->group(function () {
    Route::post('/projects/{id}/publish', [ProjectController::class, 'publish']);
});

// Rutas publicas o viewer
Route::middleware(['auth:sanctum', 'role:admin,editor,viewer'])->group(function () {
    Route::get('/projects/public', [ProjectController::class, 'publicIndex']);
});
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
git add routes/api.php
git commit -m "feat: add role middleware examples to routes"
```

---

## Phase 8: Testing

### Task 17: Tests unitarios para SSO Backend

**Files:**
- Create: `/home/dowardev/Documentos/programacion/sso/back/tests/Feature/RolesTest.php`

- [ ] **Step 1: Escribir tests de integración para roles**

```php
<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolesTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_have_role(): void
    {
        $user = User::factory()->create();
        $adminRole = Role::where('slug', 'admin')->first() ?? Role::create([
            'name' => 'Administrador',
            'slug' => 'admin',
            'description' => 'Admin role',
            'is_protected' => true,
        ]);

        $user->roles()->attach($adminRole->id);

        $this->assertTrue($user->hasRole('admin'));
    }

    public function test_get_effective_role_returns_viewer_by_default(): void
    {
        $user = User::factory()->create();

        $effectiveRole = $user->getEffectiveRole(1);

        $this->assertEquals('viewer', $effectiveRole?->slug);
    }

    public function test_user_auth_requires_client_id(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->getJson('/api/user-auth', [
            'Authorization' => "Bearer $token",
        ]);

        $response->assertStatus(400);
        $response->assertJson(['error' => 'client_id is required']);
    }

    public function test_user_auth_filters_roles_by_client(): void
    {
        $user = User::factory()->create();
        $adminRole = Role::where('slug', 'admin')->first() ?? Role::create([
            'name' => 'Administrador',
            'slug' => 'admin',
            'description' => 'Admin role',
            'is_protected' => true,
        ]);
        $viewerRole = Role::where('slug', 'viewer')->first() ?? Role::create([
            'name' => 'Visor',
            'slug' => 'viewer',
            'description' => 'Viewer role',
            'is_protected' => true,
        ]);

        // Asignar rol global (admin)
        $user->roles()->attach($adminRole->id, ['sso_client_id' => null]);
        // Asignar rol específico para client_id=1 (viewer)
        $user->roles()->attach($viewerRole->id, ['sso_client_id' => 1]);

        $token = $user->createToken('test')->plainTextToken;

        // Request para client_id=1 debe devolver viewer
        $response = $this->getJson('/api/user-auth?client_id=1', [
            'Authorization' => "Bearer $token",
        ]);

        $response->assertOk();
        $this->assertCount(1, $response->json('user.roles'));
        $this->assertEquals('viewer', $response->json('user.roles.0.slug'));
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso/back
git add tests/Feature/RolesTest.php
git commit -m "test: add integration tests for role filtering by client"
```

---

### Task 18: Tests para RoleMiddleware

**Files:**
- Create: `/home/dowardev/Documentos/programacion/portafolio/backend/tests/Feature/RoleMiddlewareTest.php`

- [ ] **Step 1: Escribir tests para RoleMiddleware**

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_middleware_blocks_unauthorized_role(): void
    {
        $this->withoutMiddleware('role');

        $response = $this->getJson('/api/test-protected');

        $response->assertStatus(401);
    }

    public function test_role_middleware_allows_admin(): void
    {
        // Simular request con rol admin
        $response = $this->withHeader('X-User-Role', 'admin')
            ->getJson('/api/test-protected');

        // El middleware debe pasar o fallar según la config
    }

    public function test_role_middleware_rejects_viewer_on_admin_route(): void
    {
        $response = $this->withHeader('X-User-Role', 'viewer')
            ->getJson('/api/admin-only');

        $response->assertStatus(403);
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
git add tests/Feature/RoleMiddlewareTest.php
git commit -m "test: add RoleMiddleware tests"
```

---

## Summary

**Total Tasks:** 18 tasks across 8 phases

**Orden de ejecución recomendado:**
1. Phase 1: Migraciones (Tasks 1-3)
2. Phase 2: Modelos (Task 4)
3. Phase 3: Middleware (Task 5)
4. Phase 4: Controllers (Tasks 6-7)
5. Phase 5: SSO Client (Tasks 8-9)
6. Phase 6: Portfolio Frontend (Tasks 10-14)
7. Phase 7: Portfolio Backend (Tasks 15-16)
8. Phase 8: Testing (Tasks 17-18)

**Antes de ejecutar las migrations, asegurar:**
1. Backup de la base de datos
2. Entornos de staging/producción notificados del cambio de API (client_id requerido)