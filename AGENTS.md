# AGENTS.md - Portafolio (dowar-blog)

## Project Structure

Monorepo with two directories:
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
cp .env.development.example .env.development
php artisan key:generate          # rellena APP_KEY en .env
php artisan migrate
php artisan db:seed
php artisan serve
```

## Variables de entorno (Backend)

Laravel carga los archivos en este orden (de menor a mayor prioridad):
- `.env`                    → siempre, base común a todos los entornos
- `.env.[environment]`      → solo cuando `APP_ENV=environment`
  - `.env.development`     → `APP_ENV=local` (desarrollo)
  - `.env.testing`         → `APP_ENV=testing` (PHPUnit)
  - `.env.production`      → `APP_ENV=production` (deploy)
- `.env.local`             → override local (gitignored)

Solo `.env` raíz contiene valores comunes. Lo específico de cada entorno
vive en su `.env.[environment]`.

### Plantillas commiteables

- `backend/.env.example`                    → `cp .env.example .env`
- `backend/.env.development.example`        → `cp .env.development.example .env.development`
- `backend/.env.production.example`         → `cp .env.production.example .env.production`
- `backend/.env.testing.example`            → `cp .env.testing.example .env.testing`

Los archivos `.env.development`, `.env.production` y `.env.testing` están
gitignored para que cada desarrollador mantenga sus valores locales reales.

## Architecture

### Backend (`backend/`)
- **Laravel 11** con PHP 8.2+
- `app/Http/Controllers/` — API Controllers (Admin, Auth, Posts, System, etc.)
- `app/Models/` — Eloquent models (Post, Project, Certificate, Experience, etc.)
- `app/Services/` — PermissionService, RoleSyncService, SsoApiService
- `app/Http/Middleware/` — Cors, PermissionMiddleware
- `routes/api.php` — All API endpoints
- `config/sso.php` — SSO client configuration (lcobucci/jwt ^5.0)
- **Authentication:** SSO client against external server (JWT + JWKS + DPoP)
- **Database:** SQLite by default
- **CI/CD:** GitLab CI (unified in root `.gitlab-ci.yml`, tag-based deploy on `v*`)

### Frontend (`frontend/`)
- **Ionic 8** + **Vue 3** with Composition API
- **Pinia** for state management
- **SSO client** (local package `@tu-org/sso-client`)
- `src/views/` — Views organized by feature (admin, blog, portfolio, session, etc.)
- `src/components/` — Reusable components
- `src/controllers/` — Business logic
- `src/composables/` — Vue composables
- `src/store/` — Pinia stores
- `src/services/` — API services
- `src/router/` — Vue Router

#### Identity Layer (Reflow de Autenticación + Autorización)

Una sola fuente de verdad para "quién soy y qué puedo hacer". Las vistas
leen reactivamente del store; nadie hace HTTP directamente para identidad.

**Arquitectura:**

```
main.ts → ssoClient.init()
        → new UserController().loadUser()  // único bootstrap
        → app.mount('#app')
```

- `loadUser()` usa `loadIdentitySafely()` (módulo-level, deduplicado):
  1. Checkea `getSSOClient().isAuthenticated` (sin HTTP)
  2. Si `true`, lee `getUser()` (cached del SSO Client)
  3. Si hay sesión, pide `my-permissions` al backend Laravel
  4. Si 401 → silencioso (estado `unauthenticated`)
  5. Se escribe en `userStore` con loadState: `idle|loading|loaded|unauthenticated`

**Vistas:** leen de `useUserStore()` via `storeToRefs`, no hacen HTTP.
`UserController` tiene `refreshIdentity()` para refrescos explícitos.

**Archivos clave:**
- `src/controllers/userController.ts` — `loadIdentitySafely()`, `refreshIdentity()`
- `src/store/userStore.ts` — `loadState` reactivo
- `src/main.ts` — bootstrap + condiciona SW a `import.meta.env.PROD`
- `src/components/menu/MenuComponent*.vue` — leen del store, sin `onMounted` HTTP
- `src/views/user/profile/UserProfileComponent.vue` — `loadUserFromStore()` + `refreshIdentity()`
- `src/components/feedback/FeedbackComponent.vue` — lee del store en `onMounted`

## Authentication

This project is an **SSO client**. Authentication is handled against an external SSO server:
- JWT validation via JWKS endpoint of the SSO server
- `lcobucci/jwt` ^5.0 for JWT handling
- DPoP (Demonstration of Proof-of-Possession)
- `client_credentials` grant for server-to-server communication
- Required environment variables: `SSO_URL`, `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`, `SSO_JWT_ISSUER`
- Frontend requires: `VITE_SSO_URL`, `VITE_SSO_FRONTEND_URL`, `VITE_SSO_CLIENT_ID`, `VITE_API_URL`

## Variables de entorno (Frontend)

Vite carga los archivos en este orden (de menor a mayor prioridad):
- `.env`                  → siempre (en todos los modos)
- `.env.[mode]`           → solo cuando coincide el modo (dev/prod/staging)
- `.env.[mode].local`     → override local (gitignored)

Solo se exponen al cliente las variables con prefijo `VITE_`.
Reiniciar Vite tras editar cualquier archivo `.env.*`.

### Plantillas commiteables

- `frontend/.env.development.example` → `cp .env.development.example .env.development`
- `frontend/.env.production.example`  → `cp .env.production.example .env.production`
- `frontend/.env.example`             → `cp .env.example .env.local`

Los archivos `.env.development` y `.env.production` están en `.gitignore`
para que cada desarrollador mantenga sus valores locales reales.

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
import { useAuthStore } from '@/store/auth'
const store = useAuthStore()

// ❌ Wrong — component calls API service directly
import { authApi } from '@/services/auth'
authApi.login(params)
```

### Frontend (Vue Components): Template Structure

There are two distinct template patterns depending on the file type: **Pages** (route-level views) and **Components** (reusable UI blocks). Both must follow the numbered section structure in the script.

#### Pages (`src/views/`)

Pages are route-level views. Root element is `<ion-page>` with `<ion-header>` and `<ion-content>`.
Reference: `guides/TemplatePage.vue`

```vue
<template>
  <ion-page>
    <ion-header>...</ion-header>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="4"><!-- content --></ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <!-- popovers -->
    <!-- alerts -->
    <!-- modals -->
  </ion-page>
</template>
```

#### Components (`src/views/**/components/` or `src/components/`)

Components are reusable blocks. NO `<ion-page>`, NO `<ion-header>`, NO `<ion-content>`.
Reference: `guides/TemplateComponent.vue`

```vue
<template>
  <!-- No ion-page — this is a reusable component -->
  <ion-list class="transparent">
    <ion-card>
      <ion-item lines="full" class="transparent">...</ion-item>
    </ion-card>
  </ion-list>
</template>
```

**Script (`<script lang="ts" setup>`) — same numbered section structure for both:**

```ts
<script setup lang="ts>
// 1. Imports (ionic/vue/ionicons)
//    - Vue: ref, computed, watch, onMounted, etc.
//    - Ionicons: addOutline, chevronBackOutline, etc.
//    - Utilities: date-fns, messages, db, etc.
//    - Ionic: IonButton, IonContent, IonDatetime, etc.
//    - Local packages: @/utils/..., @/store/..., etc.
import { ref, computed, onMounted } from 'vue'
import { addOutline } from 'ionicons/icons'
import { format } from 'date-fns'
import { IonButton, IonContent, IonDatetime } from '@ionic/vue'

// 2. Controllers / Composables
//    - Import and instantiate controllers/composables
import { AuthController } from '@/controllers/authController'
const authController = new AuthController()

// 3. Components
//    - Import child Vue components
import ChildComponent from '@/components/ChildComponent.vue'

// 4. Interface and types imports
//    - ONLY types/interfaces (import type)
import type { User, EventItem } from '@/store/userStore'
import type { ViewCalendar } from '@/store/calendarStore'

// 5. Main (props, emits, etc.)
defineProps<{ items: Item[] }>()
defineEmits<{ update: [value: string] }>()

// 6. Vars and const
const isOpen = ref(false)
const loading = ref(false)

// 7. Watch
watch(() => props.items, (val) => { /* ... */ })

// 8. Computed
const filtered = computed(() => items.value.filter(...))

// 9. OnMounted
onMounted(() => { loadData() })

// 10. Functions (named parameters pattern)
function loadData(params: { force?: boolean }) { /* ... */ }
</script>
```

**Rules:**
- Each section **must** have its numbered comment (`// 1.`, `// 2.`, etc.)
- Section 1 groups **all** value imports (no types)
- Section 4 is **exclusively** `import type`
- ⚠️ **Ionic imports go in section 1**, never in section 4

### Frontend (Vue Components): Controller vs Composable Decision

Determines when to use a **controller** vs a **composable**:

| Scenario | Use | Example |
|-----------|------|---------|
| Pure business logic (CRUD, calculations, rules) | Controller | `accountsController.getAccounts()` |
| Reactive state + logic (ref, computed, watch) | Composable | `useAccountSelection({ items, getAccountId })` |
| Pinia store access + logic | Controller or Composable | `budgetDayStore.saveBudgetData()` in controller |
| Shared logic across multiple components | Composable | `useAttachments`, `useDatePicker` |
| Operations that do NOT need Vue state | Controller | `budgetEntriesController.getEntries()` |
| Operations that DO need reactive state | Composable | `useDeleteConfirm({ onConfirm })` |

**General rule:** If you need `ref`, `computed`, `watch`, or `onMounted` → **composable**.
If you only need pure functions or data access → **controller**.

---

### Frontend (Vue Components): Ionic Imports

All Vue components that use Ionic components in their template **must explicitly import** those components in **section 1** (`// 1. Imports (ionic/vue/ionicons)`) of the script.

```ts
// ✅ Correct — imports what the template uses in section 1
import { IonButton, IonContent, IonDatetime, IonPopover } from '@ionic/vue'

// ❌ Incorrect — uses IonDatetime in template but does not import it
// (TypeScript cannot infer types: $el is never, methods reset/confirm/cancel do not exist)

// ❌ Incorrect — importing Ionic in section 4 (types)
```

> Ionic Vue registers components globally via `app.use(IonicVue)`, but TypeScript needs the import in **section 1** to correctly infer types (e.g. `InstanceType<typeof IonDatetime>`, access to `$el`, methods like `reset()`, `confirm()`, `cancel()`).

### Frontend (Theme): Single Source of Truth

The default theme/template lives in **one** constant: `DEFAULT_THEME` in `frontend/src/utils/themeDefaults.ts`.

To change the app-wide default (template, selected variant, options), edit **only that file**. Never hardcode `template: "templateN"` or theme literals in stores, controllers, views, or services.

- `systemStore` initializes its state from `DEFAULT_THEME`.
- `systemController.loadThemeSelected()` falls back to `DEFAULT_THEME` when no theme is stored (clean install / cache miss).
- `App.vue` uses `DEFAULT_THEME` for the initial `oldTheme` passed to `applyTheme`.

> Why: previously the default was duplicated in 4+ places (store said `template3`, controller said `template2`), which caused a first-load flash: template 3 rendered for an instant, then the async `loadThemeSelected()` overwrote the store with `template2`.

### Frontend (Ionic): Ionic-First Layout

Prefer Ionic layout utilities over custom CSS:

- `ion-grid` / `ion-row` / `ion-col` for responsive layout (never manual flexbox for page layout)
- Utility classes: `ion-padding-*`, `ion-margin-*`, `ion-text-*`, `ion-justify-content-*`, `ion-align-items-*`
- `ion-list` with `ion-item` for forms instead of `<div>` with CSS
- `ion-card` for cards
- Modals: `ion-modal` with `ion-header` + `ion-content`
- Popovers: `ion-popover` with `ion-content`
- Do NOT use `<div>` with manual styles when an equivalent Ionic component exists

## Commit Policy

NEVER create git commits unless the user explicitly requests it. This overrides any skill or workflow that suggests committing as a final step.

## Ticket / Issue Policy

NEVER create or edit Linear tickets (or any external issue/ticket) without the user explicitly asking for it. Creating a ticket is a mutation an agent must never do on its own initiative — even when a finding, follow-up, or proposal seems obvious. If you think a ticket is warranted, propose it in the conversation and ask the user first; only create it after an explicit request. This also covers branch names derived from tickets: do not branch off a ticket that was not requested.

This rule exists because tickets (unlike code) are project-planning artifacts the user owns: content, priority, and even whether an item deserves a ticket are the user's decisions, not the agent's. The same applies to changelog/package edits that imply a release decision — propose, don't act.


## Pi lifecycle command guard (gentle-ai)

> **Histórico (gentle-pi v2.2.0):** este guard era un problema de la extensión
> gentle-pi v2.2.0 y fue eliminado en la v2.3.0. Con la versión actual los comandos
> compuestos (con `&&`, `;`, `|`, backtick o `$(`) ya no se bloquean. Esta sección
> se conserva como referencia histórica únicamente.

`git commit` / `git push` / `glab mr ...` desde el bash tool se bloquean si el
comando tiene `&&`, `;`, `|`, backtick o `$(` (reporte: "Compound or wrapped
lifecycle command ... must fail closed"). NO tiene que ver con RDD; RDD off no
bloquea. El guard es stateless: cada comando se evalúa de forma aislada, no queda
"trabado" tras un bloqueo.

Fix: un solo comando directo, sin `&&` ni `cd`, preferiblemente
`git -C <ruta-absoluta> <subcommand> -m "mensaje de una sola linea"`.
IMPORTANTE: el mensaje del `-m` debe ser UNA sola linea (sin saltos de linea);
un cuerpo multilinea introduce un `\n` sin comillar que dispara el mismo bloqueo.
Si un comando "simple" sigue bloqueando, no es estado persistido: tiene algun
control-char sin comillar (`;`, `|`, `&`, backtick, `$(` o `\n`) en la linea.
