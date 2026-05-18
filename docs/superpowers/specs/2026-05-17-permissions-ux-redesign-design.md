# Spec: Rediseño UX Permisos/Roles/Usuarios

**Fecha:** 2026-05-17
**Enfoque:** Evolución del diseño actual (A) — mantener 4 pestañas, mejorar contenido e interacción

---

## Problema

La página de permisos/roles en el panel admin es poco intuitiva para usuarios sin conocimiento del sistema:

1. Nombres técnicos (`post.create`, `post.update`) confunden a usuarios externos
2. El alert para agregar permisos no tiene labels claros — no indica qué debe ingresarse
3. Lista plana de permisos sin agrupar — difícil de escanear
4. En pestaña Usuarios, input manual de "SSO User ID" — no hay forma de buscar usuarios

---

## Solución

Mejorar las 4 pestañas sin cambiar la estructura — solo el contenido y la interacción dentro de cada una.

---

## Cambios por Pestaña

### 1. Permisos (Catálogo)

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Lista | Plana, sin agrupar | Agrupada por módulo, secciones colapsables |
| Nombre | `posts.create` como título | Descripción legible ("Crear publicación") como título, slug como secundario |
| Agregar/Editar | Alert con 2 inputs sin labels claros | Modal con formulario: Módulo, Acción, Descripción con labels y placeholders |

**Nuevo campo en BD:**
- Agregar columna `description` (string, nullable) a tabla `permissions`
- Si está vacío, autogenerar: "{acción} {módulo}" (ej: "Crear posts")
- El usuario puede editar la descripción para personalizarla

**Modal para crear/editar permiso:**
- Campo "Módulo" — label: "Módulo al que pertenece", placeholder: "Ej: posts, projects, certificates"
- Campo "Acción" — label: "Acción que permite", placeholder: "Ej: create, update, delete"
- Campo "Descripción" (opcional) — label: "Nombre legible para el permiso", placeholder: "Ej: Crear publicaciones"
- Preview del slug resultante: `modulo.accion`

---

### 2. Roles (Asignación)

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Permisos en lista | Lista plana de checkboxes con `module.action` | Agrupados por módulo, con descripción legible y slug secundario |
| Selector de rol | `ion-select` dropdown | Mismo selector pero con nombre legible del rol + slug |
| Guardado | Botón "Guardar Cambios" | Contador de cambios pendientes en botón |

**Vista de permisos por rol:**
- Encabezado de módulo colapsable (igual que pestaña Permisos)
- Dentro de cada módulo: lista de permisos con checkbox
- Cada permiso muestra: "Crear publicación" + `posts.create` en secundario
- Contador de cambios: "Guardar (3 cambios pendientes)"

---

### 3. Usuarios (Overrides)

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Buscar usuario | Input de texto para "Usuario SSO ID" | Buscador de usuarios SSO con debounce (500ms) |
| Permisos | Lista plana de `ion-select` (Heredado/Permitir/Denegar) con `module.action` | Agrupados por módulo, con descripción legible + slug secundario |
| Selectores | `ion-select` con 3 opciones texto | Iconos/colors: 🟡 Heredado, ✅ Permitir, ❌ Denegar |

**Buscador de usuarios SSO:**
- Input con label: "Buscar usuario por nombre o email"
- Al escribir (debounce 500ms): llama nuevo endpoint `GET admin/permissions/search-users?q=...`
- Resultados: lista de coincidencias con nombre, email y SSO ID
- Al seleccionar: carga permisos override del usuario

**Nuevo endpoint backend:**
- `GET admin/permissions/search-users?q=termino`
- Consulta al SSO server, retorna array de usuarios: `{ id, name, email }`

---

### 4. SSO

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Lista de roles | Tabla simple con name, slug, is_protected | Cards con nombre legible, slug como secundario, badge "Protegido" |
| Sincronización | Botón "Sincronizar ahora" + timestamp | Spinner durante sync, check al completar |
| Timestamp | Raw | Formato relativo ("hace 5 min") + tooltip con completo |

---

## Cambios de Backend

### Migration
- Agregar columna `description` (string[255], nullable) a tabla `permissions`

### Seeder
- Agregar descripciones legibles a los 27 permisos existentes
- Mapeo: `posts.create` → "Crear publicaciones", `posts.update` → "Editar publicaciones", etc.

### PermissionController
- Incluir `description` en todas las respuestas de API
- En `createPermission`: aceptar y guardar `description`
- En `updatePermission`: permitir actualizar `description`
- Autogenerar descripción si no se provee: `ucfirst($action) . ' ' . $module`

### Nuevo endpoint
- `GET admin/permissions/search-users?q={term}`
- Consultar SSO server `/users?client_id={clientId}&q={term}`
- Retornar: `[{ id, name, email }]`

### Modelo Permission
- Agregar `description` a fillable y JSON visible

---

## Cambios de Frontend

### PermissionsPage.vue
- Agrupar permisos por módulo — crear helper/composable reutilizable
- Reemplazar alerts con modal para crear/editar permisos
- Mostrar descripción legible + slug secundario en cada item
- Implementar buscador de usuarios con debounce

### permissionsController.ts
- Agregar tipos para search-users response
- Actualizar interfaces de permisos para incluir description

### Nuevos componentes
- `PermissionFormModal.vue` — modal para crear/editar permiso
- `UserSearchInput.vue` — buscador de usuarios SSO
- Helper/composable para agrupar permisos por módulo

---

## Validación

El sistema debe:
1. Mostrar permisos agrupados por módulo en todas las pestañas
2. Mostrar descripción legible con slug como secundario
3. Permitir crear/editar permisos con modal con labels claros
4. Permitir buscar usuarios SSO por nombre/email
5. Mantener toda la funcionalidad existente (CRUD permisos, asignación a roles, overrides por usuario)