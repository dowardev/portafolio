# Permissions UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar la página de permisos/roles/usuarios del panel admin para que sea intuitiva para usuarios sin conocimiento del sistema - nombres legibles, agrupados por módulo, modales claros, buscador de usuarios SSO.

**Architecture:** Enfoque de evolución - mantener las 4 pestañas actuales pero mejorar el contenido e interacción dentro de cada una. Backend: agregar campo description a permissions, nuevo endpoint para buscar usuarios. Frontend: agrupar permisos por módulo, reemplazar alerts con modales, nuevo buscador de usuarios.

**Tech Stack:** Laravel 12 (PHP 8.2+), Ionic Vue 8, TypeScript

---

## File Mapping

### Backend
- **Create:** `backend/database/migrations/2026_05_17_000000_add_description_to_permissions_table.php`
- **Modify:** `backend/app/Models/Permission.php` — agregar description a fillable y hidden
- **Modify:** `backend/database/seeders/RolePermissionSeeder.php` — agregar descripciones a los 27 permisos
- **Modify:** `backend/app/Http/Controllers/Admin/PermissionController.php` — incluir description en responses, autogenerar, nuevo endpoint search-users
- **Modify:** `backend/routes/api.php` — agregar ruta para search-users

### Frontend
- **Create:** `frontend/src/components/admin/PermissionFormModal.vue` — modal para crear/editar permisos
- **Create:** `frontend/src/components/admin/UserSearchInput.vue` — buscador de usuarios SSO
- **Create:** `frontend/src/composables/usePermissionsGrouped.ts` — helper para agrupar permisos por módulo
- **Modify:** `frontend/src/controllers/permissionsController.ts` — agregar tipos, nuevos endpoints
- **Modify:** `frontend/src/views/admin/PermissionsPage.vue` — agrupar por módulo, usar modales, buscador usuarios

---

## Tasks

### Task 1: Backend — Migration para agregar description

**Files:**
- Create: `backend/database/migrations/2026_05_17_000000_add_description_to_permissions_table.php`

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
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('description', 255)->nullable()->after('action');
        });
    }

    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
```

- [ ] **Step 2: Commit**

```bash
git add backend/database/migrations/2026_05_17_000000_add_description_to_permissions_table.php
git commit -m "feat(permissions): add description column to permissions table"
```
---

### Task 2: Backend — Actualizar modelo Permission

**Files:**
- Modify: `backend/app/Models/Permission.php`

- [ ] **Step 1: Leer el archivo actual**

```bash
read backend/app/Models/Permission.php
```

- [ ] **Step 2: Agregar description a fillable**

En el array `$fillable`, agregar `'description'`:

```php
protected $fillable = ['slug', 'module', 'action', 'description'];
```

- [ ] **Step 3: Commit**

```bash
git add backend/app/Models/Permission.php
git commit -m "feat(permissions): add description to Permission model fillable"
```
---

### Task 3: Backend — Actualizar seeder con descripciones

**Files:**
- Modify: `backend/database/seeders/RolePermissionSeeder.php`

- [ ] **Step 1: Leer el seeder actual**

```bash
read backend/database/seeders/RolePermissionSeeder.php
```

- [ ] **Step 2: Agregar descripciones al array de permisos**

Agregar campo `description` a cada permission. Mapeo a agregar:

| Slug | Description |
|------|-------------|
| posts.create | Crear publicaciones |
| posts.update | Editar publicaciones |
| posts.delete | Eliminar publicaciones |
| intro.update | Editar información de inicio |
| experiences.create | Crear experiencias |
| experiences.update | Editar experiencias |
| experiences.delete | Eliminar experiencias |
| projects.create | Crear proyectos |
| projects.update | Editar proyectos |
| projects.delete | Eliminar proyectos |
| certificates.create | Crear certificados |
| certificates.update | Editar certificados |
| certificates.delete | Eliminar certificados |
| freelance.create | Crear plataformas freelance |
| freelance.update | Editar plataformas freelance |
| freelance.delete | Eliminar plataformas freelance |
| freelance-comments.create | Crear comentarios freelance |
| freelance-comments.update | Editar comentarios freelance |
| freelance-comments.delete | Eliminar comentarios freelance |
| stacks.create | Crear tecnologías del stack |
| stacks.update | Editar tecnologías del stack |
| stacks.delete | Eliminar tecnologías del stack |
| skills-categories.create | Crear categorías de skills |
| skills-categories.update | Editar categorías de skills |
| skills-categories.delete | Eliminar categorías de skills |

- [ ] **Step 3: Commit**

```bash
git add backend/database/seeders/RolePermissionSeeder.php
git commit -m "feat(permissions): add descriptions to permission seeder"
```
---

### Task 4: Backend — Actualizar PermissionController

**Files:**
- Modify: `backend/app/Http/Controllers/Admin/PermissionController.php`

- [ ] **Step 1: Leer el controller actual**

```bash
read backend/app/Http/Controllers/Admin/PermissionController.php
```

- [ ] **Step 2: Modificar método getAvailablePermissions para incluir description**

En el método `getAvailablePermissions()`, modificar el return para incluir description:

```php
return response()->json([
    'permissions' => Permission::select('id', 'slug', 'module', 'action', 'description')->get()
]);
```

- [ ] **Step 3: Modificar método createPermission para aceptar description y autogenerar si no existe**

En `createPermission()`, después de validar y antes de crear:

```php
$description = $request->input('description');
if (empty($description)) {
    // Autogenerar: "Crear posts" = ucfirst(acción) . ' ' . módulo
    $description = ucfirst($request->action) . ' ' . $request->module;
}
```

Agregar `'description' => $description` al crear el permiso.

- [ ] **Step 4: Modificar método updatePermission para actualizar description**

Igual que create, aceptar description en el request y actualizar.

- [ ] **Step 5: Modificar getRolePermissions para incluir description**

En `getRolePermissions()`, el return de cada permission debe incluir description:

```php
'description' => $permission->description
```

- [ ] **Step 6: Modificar getUserPermissions para incluir description**

Igual que getRolePermissions.

- [ ] **Step 7: Commit**

```bash
git add backend/app/Http/Controllers/Admin/PermissionController.php
git commit -m "feat(permissions): add description field to all API responses and auto-generate"
```
---

### Task 5: Backend — Agregar endpoint search-users

**Files:**
- Modify: `backend/routes/api.php`
- Modify: `backend/app/Http/Controllers/Admin/PermissionController.php`

- [ ] **Step 1: Agregar método searchUsers al PermissionController**

En `backend/app/Http/Controllers/Admin/PermissionController.php`, agregar nuevo método:

```php
public function searchUsers(Request $request)
{
    $query = $request->query('q', '');

    if (strlen($query) < 2) {
        return response()->json(['users' => []]);
    }

    // Consultar SSO server para buscar usuarios
    $ssoUrl = config('sso.url');
    $clientId = config('sso.client_id');

    try {
        $response = Http::get("{$ssoUrl}/users", [
            'client_id' => $clientId,
            'q' => $query,
            'limit' => 10
        ]);

        if ($response->successful()) {
            $users = $response->json('data', []);
            return response()->json([
                'users' => collect($users)->map(function ($user) {
                    return [
                        'id' => $user['id'] ?? null,
                        'name' => $user['name'] ?? $user['username'] ?? 'Sin nombre',
                        'email' => $user['email'] ?? ''
                    ];
                })->filter(fn($u) => $u['id'])->values()
            ]);
        }
    } catch (\Exception $e) {
        // Log error but return empty array
        \Log::error('SSO user search failed: ' . $e->getMessage());
    }

    return response()->json(['users' => []]);
}
```

- [ ] **Step 2: Agregar ruta en api.php**

En `backend/routes/api.php`, agregar dentro del grupo admin:

```php
Route::get('permissions/search-users', [PermissionController::class, 'searchUsers']);
```

- [ ] **Step 3: Commit**

```bash
git add backend/app/Http/Controllers/Admin/PermissionController.php backend/routes/api.php
git commit -m "feat(permissions): add search-users endpoint for SSO user lookup"
```
---

### Task 6: Frontend — Agregar tipos y actualizar controller

**Files:**
- Modify: `frontend/src/controllers/permissionsController.ts`

- [ ] **Step 1: Leer el controller actual**

```bash
read frontend/src/controllers/permissionsController.ts
```

- [ ] **Step 2: Agregar interfaces para description y search-users**

Agregar al inicio del archivo:

```typescript
export interface PermissionWithDescription {
  id: number
  slug: string
  module: string
  action: string
  description: string | null
}

export interface SearchUserResult {
  id: string
  name: string
  email: string
}
```

- [ ] **Step 3: Agregar función searchUsers**

```typescript
async function searchUsers(params: { query: string }): Promise<SearchUserResult[]> {
  const { query } = params
  if (query.length < 2) return []

  const { data } = await api.get<{ users: SearchUserResult[] }>(
    'admin/permissions/search-users',
    { params: { q: query } }
  )
  return data.users
}
```

Agregar al objeto retornado: `searchUsers`.

- [ ] **Step 4: Actualizar getAvailablePermissions para usar nuevo tipo**

Cambiar el tipo de retorno a `PermissionWithDescription[]`.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/controllers/permissionsController.ts
git commit -m "feat(permissions): add types for description and search-users endpoint"
```
---

### Task 7: Frontend — Crear composable usePermissionsGrouped

**Files:**
- Create: `frontend/src/composables/usePermissionsGrouped.ts`

- [ ] **Step 1: Escribir el composable**

```typescript
import { computed } from 'vue'
import type { PermissionWithDescription } from '@/controllers/permissionsController'

export interface GroupedPermission {
  module: string
  label: string
  permissions: PermissionWithDescription[]
}

export function usePermissionsGrouped() {
  function groupPermissions(permissions: PermissionWithDescription[]): GroupedPermission[] {
    const groups: Record<string, PermissionWithDescription[]> = {}

    for (const perm of permissions) {
      if (!groups[perm.module]) {
        groups[perm.module] = []
      }
      groups[perm.module].push(perm)
    }

    const moduleLabels: Record<string, string> = {
      posts: 'Publicaciones',
      projects: 'Proyectos',
      intro: 'Información de inicio',
      experiences: 'Experiencias',
      certificates: 'Certificados',
      freelance: 'Plataformas Freelance',
      'freelance-comments': 'Comentarios Freelance',
      stacks: 'Stack Tecnológico',
      'skills-categories': 'Categorías de Skills'
    }

    return Object.entries(groups).map(([module, perms]) => ({
      module,
      label: moduleLabels[module] || module,
      permissions: perms.sort((a, b) => a.action.localeCompare(b.action))
    })).sort((a, b) => a.label.localeCompare(b.label))
  }

  function getPermissionLabel(permission: PermissionWithDescription): string {
    if (permission.description) {
      return permission.description
    }
    // Autogenerar: "Crear posts" = acción + módulo
    const actionLabels: Record<string, string> = {
      create: 'Crear',
      update: 'Editar',
      delete: 'Eliminar'
    }
    const action = actionLabels[permission.action] || permission.action
    const moduleLabels: Record<string, string> = {
      posts: 'publicaciones',
      projects: 'proyectos',
      intro: 'información de inicio',
      experiences: 'experiencias',
      certificates: 'certificados',
      freelance: 'plataformas freelance',
      'freelance-comments': 'comentarios freelance',
      stacks: 'tecnologías del stack',
      'skills-categories': 'categorías de skills'
    }
    const module = moduleLabels[permission.module] || permission.module
    return `${action} ${module}`
  }

  return {
    groupPermissions,
    getPermissionLabel
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/composables/usePermissionsGrouped.ts
git commit -m "feat(permissions): add usePermissionsGrouped composable"
```
---

### Task 8: Frontend — Crear PermissionFormModal

**Files:**
- Create: `frontend/src/components/admin/PermissionFormModal.vue`

- [ ] **Step 1: Leer la estructura de modales existentes para seguir el patrón**

```bash
glob frontend/src/components/admin/*.vue
```

- [ ] **Step 2: Escribir el modal siguiendo el patrón de Ionic Vue**

```vue
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="dismiss">Cancelar</ion-button>
      </ion-buttons>
      <ion-title>{{ isEdit ? 'Editar Permiso' : 'Nuevo Permiso' }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="save" :strong="true" :disabled="!isValid">Guardar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-list>
      <ion-item>
        <ion-label position="stacked">Módulo</ion-label>
        <ion-input
          v-model="module"
          placeholder="Ej: posts, projects, certificates"
          @ion-input="updateSlugPreview"
        ></ion-input>
        <ion-note>Al que pertenece el permiso</ion-note>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Acción</ion-label>
        <ion-input
          v-model="action"
          placeholder="Ej: create, update, delete"
          @ion-input="updateSlugPreview"
        ></ion-input>
        <ion-note>Qué acción permite</ion-note>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Slug (preview)</ion-label>
        <ion-input :value="slugPreview" readonly></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Descripción (opcional)</ion-label>
        <ion-input
          v-model="description"
          placeholder="Ej: Crear publicaciones"
        ></ion-input>
        <ion-note>Nombre legible para mostrar. Se autogenera si se deja vacío.</ion-note>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonNote, modalController } from '@ionic/vue'
import type { PermissionWithDescription } from '@/controllers/permissionsController'

const props = defineProps<{
  permission?: PermissionWithDescription | null
}>()

const emit = defineEmits<{
  (e: 'saved', permission: { slug: string; module: string; action: string; description: string }): void
}>()

const isEdit = computed(() => !!props.permission)

const module = ref('')
const action = ref('')
const description = ref('')
const slugPreview = ref('')

function updateSlugPreview() {
  if (module.value && action.value) {
    slugPreview.value = `${module.value.toLowerCase().trim()}.${action.value.toLowerCase().trim()}`
    // Autogenerar descripción si está vacía
    if (!description.value) {
      const actionLabels: Record<string, string> = {
        create: 'Crear',
        update: 'Editar',
        delete: 'Eliminar'
      }
      const actionLabel = actionLabels[action.value.toLowerCase()] || action.value
      description.value = `${actionLabel} ${module.value}`
    }
  } else {
    slugPreview.value = ''
  }
}

const isValid = computed(() => {
  return module.value.trim().length > 0 && action.value.trim().length > 0
})

function dismiss() {
  modalController.dismiss()
}

function save() {
  if (!isValid.value) return

  emit('saved', {
    slug: slugPreview.value,
    module: module.value.trim().toLowerCase(),
    action: action.value.trim().toLowerCase(),
    description: description.value.trim()
  })

  modalController.dismiss()
}

onMounted(() => {
  if (props.permission) {
    module.value = props.permission.module
    action.value = props.permission.action
    description.value = props.permission.description || ''
    slugPreview.value = props.permission.slug
  }
})
</script>
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/admin/PermissionFormModal.vue
git commit -m "feat(permissions): add PermissionFormModal component"
```
---

### Task 9: Frontend — Crear UserSearchInput

**Files:**
- Create: `frontend/src/components/admin/UserSearchInput.vue`

- [ ] **Step 1: Escribir el componente buscador**

```vue
<template>
  <div>
    <ion-item>
      <ion-label position="stacked">Buscar usuario por nombre o email</ion-label>
      <ion-input
        v-model="searchQuery"
        placeholder="Escribe para buscar..."
        @ion-input="onSearch"
        debounce="500"
      ></ion-input>
    </ion-item>

    <ion-list v-if="results.length > 0 && showResults" lines="full">
      <ion-item
        v-for="user in results"
        :key="user.id"
        button
        @click="selectUser(user)"
        detail="false"
      >
        <ion-icon :icon="personOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ user.name }}</h2>
          <p>{{ user.email }}</p>
        </ion-label>
      </ion-item>
    </ion-list>

    <div v-if="selectedUser" class="selected-user">
      <ion-item>
        <ion-icon :icon="checkmarkCircle" slot="start" color="success"></ion-icon>
        <ion-label>
          <h2>{{ selectedUser.name }}</h2>
          <p>{{ selectedUser.email }}</p>
        </ion-label>
        <ion-button
          fill="clear"
          color="medium"
          slot="end"
          @click="clearSelection"
        >
          <ion-icon :icon="close"></ion-icon>
        </ion-button>
      </ion-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IonItem, IonLabel, IonInput, IonList, IonIcon, IonButton } from '@ionic/vue'
import { personOutline, checkmarkCircle, close } from 'ionicons/icons'
import { usePermissionsController } from '@/controllers/permissionsController'
import type { SearchUserResult } from '@/controllers/permissionsController'

const emit = defineEmits<{
  (e: 'selected', user: SearchUserResult): void
}>()

const controller = usePermissionsController()

const searchQuery = ref('')
const results = ref<SearchUserResult[]>([])
const showResults = ref(false)
const selectedUser = ref<SearchUserResult | null>(null)

async function onSearch() {
  if (searchQuery.value.length < 2) {
    results.value = []
    showResults.value = false
    return
  }

  const users = await controller.searchUsers({ query: searchQuery.value })
  results.value = users
  showResults.value = true
}

function selectUser(user: SearchUserResult) {
  selectedUser.value = user
  showResults.value = false
  searchQuery.value = ''
  emit('selected', user)
}

function clearSelection() {
  selectedUser.value = null
  emit('selected', null as any)
}
</script>

<style scoped>
.selected-user {
  margin-top: 12px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/admin/UserSearchInput.vue
git commit -m "feat(permissions): add UserSearchInput component"
```
---

### Task 10: Frontend — Actualizar PermissionsPage.vue

**Files:**
- Modify: `frontend/src/views/admin/PermissionsPage.vue`

- [ ] **Step 1: Leer el archivo actual**

```bash
read frontend/src/views/admin/PermissionsPage.vue
```

- [ ] **Step 2: Importar el composable y componentes nuevos**

Agregar imports:

```typescript
import { usePermissionsGrouped, type GroupedPermission } from '@/composables/usePermissionsGrouped'
import PermissionFormModal from '@/components/admin/PermissionFormModal.vue'
import UserSearchInput from '@/components/admin/UserSearchInput.vue'
```

- [ ] **Step 3: Reemplazar lista plana por grouped en pestaña Permisos**

En el template de la pestaña Permisos, reemplazar el ion-list flat con:

```vue
<template v-for="group in groupedPermissions" :key="group.module">
  <ion-list-header class="module-header">
    <ion-label>
      {{ group.label }}
      <ion-badge color="medium">{{ group.permissions.length }}</ion-badge>
    </ion-label>
  </ion-list-header>

  <ion-item v-for="perm in group.permissions" :key="perm.id">
    <ion-label>
      <h2>{{ getPermissionLabel(perm) }}</h2>
      <p>{{ perm.slug }}</p>
    </ion-label>
    <ion-buttons slot="end">
      <ion-button @click="editPermission(perm)" color="primary">
        <ion-icon :icon="createOutline"></ion-icon>
      </ion-button>
      <ion-button @click="deletePermission(perm)" color="danger">
        <ion-icon :icon="trashOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>
```

- [ ] **Step 4: Reemplazar alert de crear permiso con modal**

Reemplazar `presentAlertPrompt` con:

```typescript
async function createPermission() {
  const modal = await modalController.create({
    component: PermissionFormModal,
    componentProps: { permission: null }
  })

  modal.onDidDismiss().then((result) => {
    if (result.data) {
      // Llamar al controller para crear el permiso
      controller.createPermission(result.data).then(() => {
        loadPermissions()
        showToast('Permiso creado correctamente')
      })
    }
  })

  await modal.present()
}
```

- [ ] **Step 5: Reemplazar alert de editar permiso con modal**

Similar a create, pasando el permission al modal.

- [ ] **Step 6: Actualizar pestaña Roles para grouping**

En la pestaña Roles, cada permiso en el checklist debe mostrar:
- Título: `getPermissionLabel(perm)` (ej: "Crear publicaciones")
- Subtítulo: `perm.slug` (ej: "posts.create")

- [ ] **Step 7: Actualizar pestaña Usuarios para grouping y usar UserSearchInput**

Reemplazar el input SSO ID con el componente `UserSearchInput` y agrupar permisos por módulo.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/views/admin/PermissionsPage.vue
git commit -m "feat(permissions): update PermissionsPage with grouped view and modals"
```
---

### Task 11: Verificar y testear

- [ ] **Step 1: Correr migración**

```bash
cd backend && php artisan migrate
```

- [ ] **Step 2: Correr seeder para agregar descripciones**

```bash
cd backend && php artisan db:seed --class=RolePermissionSeeder
```

- [ ] **Step 3: Verificar endpoints**

```bash
curl http://localhost:8001/api/admin/permissions
```

- [ ] **Step 4: Compilar frontend**

```bash
cd frontend && pnpm run build
```

- [ ] **Step 5: Probar manualmente en el navegador**

Abrir `/admin-panel/permissions y verificar:
- Pestaña Permisos: permisos agrupados por módulo, modal para crear/editar
- Pestaña Roles: permisos agrupados con descripciones legibles
- Pestaña Usuarios: buscador de usuarios SSO
- Pestaña SSO: improves cosmetics

- [ ] **Step 6: Commit final**

```bash
git add .
git commit -m "feat: complete permissions UX redesign"
```