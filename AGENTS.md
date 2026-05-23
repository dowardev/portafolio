# AGENTS.md - Portafolio (dowar-blog)

## Project Structure

Monorepo con dos directorios:
- `backend/` — Laravel 11 backend (PHP 8.2+)
- `frontend/` — Ionic Vue 8 frontend (Node.js, pnpm)

## Developer Commands

```bash
# Run backend
cd backend && php artisan serve

# Run frontend
cd frontend && pnpm run dev

# Build frontend
cd frontend && pnpm run build    # vue-tsc + vite build

# Frontend lint
cd frontend && pnpm run lint     # oxlint + eslint

# Frontend unit tests
cd frontend && pnpm run test:unit

# Frontend e2e tests
cd frontend && pnpm run test:e2e
```

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

## Architecture

### Backend (`backend/`)
- **Laravel 11** con PHP 8.2+
- `app/Http/Controllers/` — API Controllers (Admin, Auth, Posts, System, etc.)
- `app/Models/` — Eloquent models (Post, Project, Certificate, Experience, etc.)
- `app/Services/` — PermissionService, RoleSyncService, SsoApiService
- `app/Http/Middleware/` — Cors, PermissionMiddleware
- `routes/api.php` — All API endpoints
- `config/sso.php` — SSO client configuration (lcobucci/jwt ^5.0)
- **Autenticación:** SSO client contra servidor externo (JWT + JWKS + DPoP)
- **Base de datos:** SQLite por defecto
- **CI/CD:** GitLab CI (deploy en main a servidor producción)

### Frontend (`frontend/`)
- **Ionic 8** + **Vue 3** con Composition API
- **Capacitor 7** para soporte Android
- **Pinia** para manejo de estado
- **SSO client** (paquete local `@tu-org/sso-client`)
- `src/views/` — Vistas organizadas por feature (admin, blog, portfolio, session, etc.)
- `src/components/` — Componentes reutilizables
- `src/controllers/` — Lógica de negocio
- `src/composables/` — Composables Vue
- `src/store/` — Pinia stores
- `src/services/` — Servicios API
- `src/router/` — Vue Router
- **PWA** con vite-plugin-pwa
- **CI/CD:** GitLab CI (build → package → deploy en master)

## Authentication

Este proyecto es un **SSO client**. La autenticación se maneja contra un servidor SSO externo:
- Validación de JWT via JWKS endpoint del SSO server
- `lcobucci/jwt` ^5.0 para manejo de JWT
- DPoP (Demonstration of Proof-of-Possession)
- `client_credentials` grant para comunicación server-to-server
- Variables de entorno requeridas: `SSO_URL`, `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`, `SSO_JWT_ISSUER`
- Frontend requiere: `VITE_SSO_URL`, `VITE_SSO_FRONTEND_URL`, `VITE_SSO_CLIENT_ID`, `VITE_API_URL`

## Code Conventions

### Frontend (TypeScript): Named Parameters Pattern

All functions must use a single `params` object instead of positional parameters. Destructure inside the function body.

```ts
// ✅ Correct
function holaMundo(params: { objeto1: string; objeto2: number }) {
  const { objeto1, objeto2 } = params
}

// ❌ Wrong
function holaMundo(objeto1: string, objeto2: number) { ... }
```

> This pattern requires TypeScript. In plain JS the inline type annotation is invalid syntax — use JSDoc `@param` instead if needed.

### Frontend (Vue Components): Controller or Composable Communication

Vue components may contain any **local** logic (props, emits, computed, watch, onMounted, reactive variables, internal functions, etc.) that is internal to the component. However, any logic that is **shared** with or reused by other parts of the application — such as API calls, store access, or cross-component business logic — must go through **controllers or composables**, depending on what best fits the case. These are the bridge between Vue components and external application layers.

```ts
// ✅ Correct — local logic in component is fine
const isOpen = ref(false)
const label = computed(() => isOpen.value ? 'Open' : 'Closed')
onMounted(() => { isOpen.value = true })

// ✅ Correct — shared logic uses a controller
import { useAuthController } from '@/controllers/authController'
const controller = useAuthController()
controller.login(params)

// ✅ Correct — shared logic uses a composable
import { useAuth } from '@/composables/useAuth'
const { login } = useAuth()
login(params)

// ❌ Wrong — component accesses store directly
import { useAuthStore } from '@/stores/auth'
const store = useAuthStore()

// ❌ Wrong — component calls API service directly
import { authApi } from '@/services/auth'
authApi.login(params)
```

### Frontend (Vue Components): Template Structure

All Vue components must follow the structure and rules defined in `guides/TemplateView.vue`. Key sections in order:

**Template:**
- `<ion-page>` as root with `<ion-header>` and `<ion-content>`
- Content, modals, popovers, and alerts in dedicated comment-delimited sections

**Script (`<script lang="ts" setup>`):**
1. Imports (ionic/vue/ionicons)
2. Controllers / Composables
3. Components
4. Interface and types imports
5. Main (props, emits, etc.)
6. Vars and const
7. Watch
8. Computed
9. OnMounted
10. Functions (must use named parameters pattern)

## Commit Policy

NEVER create git commits unless the user explicitly requests it. This overrides any skill or workflow that suggests committing as a final step.
