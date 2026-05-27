# Boton Centralizado de Datos de Prueba en Admin Panel

## Resumen

Un boton en `AdminHomeMenu.vue` (solo visible en DEV) que abre un modal con checkboxes para seleccionar secciones a sembrar. La logica se centraliza en `seedController.ts`, que orquesta llamadas a los controladores existentes.

## Decisiones de diseno

- **Visibilidad**: Solo en modo DEV (`import.meta.env.DEV`)
- **Ubicacion**: FAB icono bug en `AdminHomeMenu.vue`
- **Comportamiento**: Modal con checkboxes para seleccionar secciones, boton "Sembrar datos"
- **Datos existentes**: Siempre inserta, no salta secciones con datos
- **Implementacion**: Frontend-only, usa las APIs y controladores existentes

## Componentes nuevos

### `frontend/src/controllers/seedController.ts`

Controlador centralizado que orquesta la insercion de datos de prueba llamando a los controladores existentes de cada seccion.

**Funcion principal**: `seedSections(params: { sections: SeedSection[] })`

**Sections soportadas**: info, stack, skills-categories, experience, projects, certificates, freelance-platform, freelance-comments

**Datos generados por seccion**:

| Section | Cantidad | Datos |
|---------|----------|-------|
| info | 1 perfil, 3 tags, 3 socials | Nombre, descripcion, socials con iconos |
| stack | 5 registros | Nombres de tecnologias con iconos |
| skills-categories | 5 registros | Nombres de categorias con iconos |
| experience | 3 registros | Empresas, fechas, tecnologias |
| projects | 5 registros | Proyectos, status, tecnologias, source |
| certificates | 3 registros | Certificados, URLs, aptitudes |
| freelance-platform | 3 registros | Nombres de plataformas |
| freelance-comments | 5 registros | Comentarios con rating (usa plataformas existentes o recien creadas) |

**UX de progreso**:
- Loading overlay
- Toast por cada seccion completada
- Toast final con resumen (exitos/fallos)

## Cambios en archivos existentes

### `frontend/src/views/admin/AdminHomeMenu.vue`
- Agregar `isDev` y bug icon FAB
- Agregar `IonModal` con checkboxes para 8 secciones + "Seleccionar todo"
- Boton "Sembrar datos de prueba" con loading state
