# Skills Editor — Panel Admin Unificado

## Resumen

Unificar las páginas `AdminStackPage` (stacks) y `TechListPage` (techs) en un solo editor visual donde cada stack se expande para mostrar y gestionar sus techs hijos. Esto reemplaza el flujo actual de navegar entre dos páginas separadas para crear un stack y luego asignarle techs.

## Estado Actual

- `AdminStackPage.vue` (vía `AdminEditorPage` en `/admin-panel/stack`): CRUD de stacks (nombre + icono). No muestra techs asociados.
- `TechListPage.vue` (vía `/admin-panel/techs`): CRUD de techs con dropdown para seleccionar stack padre. Flujo tedioso: crear stack → ir a techs → buscar stack en dropdown.
- `StackEditor.vue`: Componente reutilizado por AdminStackPage para el formulario de stacks.
- `SkillsSection3.vue`: Componente público que renderiza stacks como categorías con techs como tags.
- `HomeTemplate3.vue` ya consume stacks con techs anidados (`GET /stacks` devuelve stacks con `techs[]`).

## Diseño Propuesto

### Nueva página: `SkillsEditorPage.vue`

Una sola vista de editor que reemplaza `AdminStackPage` + `TechListPage` + `StackEditor`.

### Layout

```
┌─────────────────────────────────────────────┐
│ Panel > Skills editor              [Guardar] │
├─────────────────────────────────────────────┤
│                                              │
│  ┌── Stack Card ──────────────────────────┐ │
│  │ [▼] [icono] Frontend    [icono] [✕]  │ │
│  │  ┌─ Techs ──────────────────────────┐  │ │
│  │  │ [icono] Vue.js      [icono] [✕] │  │ │
│  │  │ [icono] TypeScript   [icono] [✕] │  │ │
│  │  │ [+ Añadir tecnología]           │  │ │
│  │  └──────────────────────────────────┘  │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌── Stack Card ──────────────────────────┐ │
│  │ [▼] [icono] Backend     [icono] [✕]  │ │
│  │  ┌─ Techs ──────────────────────────┐  │ │
│  │  │ [icono] Laravel     [icono] [✕] │  │ │
│  │  │ [+ Añadir tecnología]           │  │ │
│  │  └──────────────────────────────────┘  │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [+ Añadir stack]                            │
│                                              │
└─────────────────────────────────────────────┘
```

### Comportamiento

- **Cada Stack Card** es expandible/colapsable. Muestra nombre del stack + icono principal + botón eliminar.
- **Al expandir**: se muestra la lista de techs hijos. Cada tech tiene icono + nombre + botón eliminar.
- **[+ Añadir tecnología]**: agrega un tech vacío dentro del stack actual. `stackId` se asigna automáticamente al stack padre.
- **[+ Añadir stack]**: agrega un stack vacío al final de la lista.
- **Al guardar**: itera stacks y techs, creando/actualizando/eliminando según corresponda (mismo patrón que `TechListPage` y `AdminStackPage` actuales).
- **Iconos**: se reutiliza el modal de selección de iconos existente (mismo patrón que `StackEditor` y `TechListPage`).
- **Techs sin stack**: no existen. Todo tech debe pertenecer a un stack.

### Cambios en Frontend

| Archivo | Acción |
|---|---|
| `src/views/admin/sections/SkillsEditorPage.vue` | **Crear** — nueva página unificada |
| `src/views/admin/sections/AdminStackPage.vue` | **Eliminar** |
| `src/views/admin/sections/TechListPage.vue` | **Eliminar** |
| `src/views/admin/editors/StackEditor.vue` | **Eliminar** |
| `src/views/admin/AdminEditorPage.vue` | Actualizar: reemplazar `AdminStackPage` por `SkillsEditorPage` |
| `src/views/admin/AdminHomeMenu.vue` | Reemplazar entradas "Stack" + "Techs" por una sola "Skills" |
| `src/router/index.ts` | Reemplazar ruta `TechListPage` por `SkillsEditorPage` con permisos combinados |

### Cambios en Backend

| Archivo | Acción |
|---|---|
| `app/Http/Controllers/Admin/TechController.php` | `stack_id` pasa de `nullable` a `required` (validación) |
| `app/Models/Tech.php` | `stack_id` se mantiene en `$fillable`, sigue siendo nullable a nivel DB (migración no cambia) |

### Rutas

- **Nueva**: `/admin-panel/skills` → `SkillsEditorPage`
- **Eliminar**: `/admin-panel/stack` + `/admin-panel/techs`
- **Permisos**: combinación de `stacks.*` y `techs.*` (requiere cualquiera)

### Menú Admin

Reemplazar:
```
Stack (icono code-slash) + Techs (icono bar-chart)
```
Por:
```
Skills (icono code-slash, color #4ECB71)
```
