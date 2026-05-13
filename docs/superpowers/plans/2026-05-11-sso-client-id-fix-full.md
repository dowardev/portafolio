# Fix SSO Client ID + Defense-in-Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir el login SSO (agregar SSO_CLIENT_ID al .env) y evitar que errores internos de SSO (500) causen logout completo (diferenciar 401 vs 500).

**Architecture:** Fix primario: agregar SSO_CLIENT_ID=main-app a .env del backend. Defense-in-depth: crear SsoUserResolveException, lanzar desde SsoUserResolver, capturar en SsoAuthMiddleware para devolver 500 en vez de 401.

**Tech Stack:** PHP Laravel 12, sso-server package, Vue.js frontend

---

### Task 1: Agregar SSO_CLIENT_ID al .env del backend

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/.env:68` (after SSO_JWT_ISSUER line)
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/config/sso.php:16`
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Controllers/MyPermissionsController.php:60`

- [ ] **Step 1: Agregar SSO_CLIENT_ID al .env**

Abrir `/home/dowardev/Documentos/programacion/portafolio/backend/.env` y agregar al final (después de `SSO_JWT_ISSUER`):

```bash
SSO_CLIENT_ID=main-app
```

- [ ] **Step 2: Cambiar default en config/sso.php**

Abrir `/home/dowardev/Documentos/programacion/portafolio/backend/config/sso.php` y cambiar línea 16:

```php
// ANTES:
'client_id' => env('SSO_CLIENT_ID', '1'),

// DESPUÉS:
'client_id' => env('SSO_CLIENT_ID', 'main-app'),
```

- [ ] **Step 3: Cambiar default en MyPermissionsController.php**

Abrir `/home/dowardev/Documentos/programacion/portafolio/backend/app/Http/Controllers/MyPermissionsController.php` y cambiar línea 60:

```php
// ANTES:
$clientId = config('sso.client_id', 1);

// DESPUÉS:
$clientId = config('sso.client_id', 'main-app');
```

- [ ] **Step 4: Commit**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
git add .env config/sso.php app/Http/Controllers/MyPermissionsController.php
git commit -m "fix: add SSO_CLIENT_ID=main-app to .env and defaults"
```

---

### Task 2: Crear SsoUserResolveException

**Files:**
- Create: `/home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Exceptions/SsoUserResolveException.php`

- [ ] **Step 1: Escribir el archivo de excepción**

Crear `/home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Exceptions/SsoUserResolveException.php`:

```php
<?php

namespace TuOrg\SsoServer\Exceptions;

use RuntimeException;

class SsoUserResolveException extends RuntimeException
{
    public function __construct(string $message = "", ?Throwable $previous = null)
    {
        parent::__construct($message, 0, $previous);
    }

    public static function noRolesAvailable(string $userId): self
    {
        return new self(
            "Cannot resolve roles for user {$userId}: SSO /me failed and no stale cache available"
        );
    }
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso-client
git add packages/sso-server/src/Exceptions/SsoUserResolveException.php
git commit -m "feat(sso-server): add SsoUserResolveException for role resolution errors"
```

---

### Task 3: Modificar SsoUserResolver para lanzar SsoUserResolveException

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Auth/SsoUserResolver.php:31-44`

- [ ] **Step 1: Modificar imports**

Abrir `/home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Auth/SsoUserResolver.php` y agregar import:

```php
use TuOrg\SsoServer\Exceptions\SsoUserResolveException;
```

- [ ] **Step 2: Modificar el catch y throw**

Cambiar líneas 31-44 (el bloque catch y el throw final):

```php
// ANTES (líneas 31-43):
} catch (\Exception $e) {
    Log::warning('Failed to fetch user roles from SSO: ' . $e->getMessage());
}

$stale = $this->getStaleRoles($userId);
if ($stale !== null) {
    Log::warning("Using stale roles cache for user {$userId}");
    return $stale;
}

throw new \RuntimeException(
    "Cannot resolve roles for user {$userId}: SSO /me failed and no stale cache available"
);

// DESPUÉS:
} catch (SsoUserResolveException $e) {
    Log::warning('SSO user resolution failed: ' . $e->getMessage());
    throw $e; // Re-throw to be caught by middleware
} catch (\Exception $e) {
    Log::warning('Failed to fetch user roles from SSO: ' . $e->getMessage());
}

$stale = $this->getStaleRoles($userId);
if ($stale !== null) {
    Log::warning("Using stale roles cache for user {$userId}");
    return $stale;
}

throw SsoUserResolveException::noRolesAvailable($userId);
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso-client
git add packages/sso-server/src/Auth/SsoUserResolver.php
git commit -m "fix(sso-server): throw SsoUserResolveException instead of RuntimeException"
```

---

### Task 4: Modificar SsoAuthMiddleware para capturar SsoUserResolveException

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Middleware/SsoAuthMiddleware.php:47-67`

- [ ] **Step 1: Agregar import**

Abrir `/home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Middleware/SsoAuthMiddleware.php` y agregar import después de los otros imports:

```php
use TuOrg\SsoServer\Exceptions\SsoUserResolveException;
```

- [ ] **Step 2: Modificar el bloque catch**

Cambiar el bloque catch de excepciones (líneas 62-67):

```php
// ANTES:
} catch (\Exception $e) {
    return response()->json([
        'message' => 'Token inválido: ' . $e->getMessage(),
        'error' => 'sso_authentication_failed',
    ], 401);
}

// DESPUÉS:
} catch (SsoUserResolveException $e) {
    return response()->json([
        'message' => $e->getMessage(),
        'error' => 'sso_resolve_failed',
    ], 500);
} catch (\Exception $e) {
    return response()->json([
        'message' => 'Token inválido: ' . $e->getMessage(),
        'error' => 'sso_authentication_failed',
    ], 401);
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/dowardev/Documentos/programacion/sso-client
git add packages/sso-server/src/Middleware/SsoAuthMiddleware.php
git commit -m "fix(sso-server): return 500 for SsoUserResolveException, 401 for other auth errors"
```

---

### Task 5: Sincronizar vendor de portafolio

**Files:**
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/vendor/tu-org/sso-server/src/Exceptions/SsoUserResolveException.php` (copia)
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/vendor/tu-org/sso-server/src/Auth/SsoUserResolver.php` (copia)
- Modify: `/home/dowardev/Documentos/programacion/portafolio/backend/vendor/tu-org/sso-server/src/Middleware/SsoAuthMiddleware.php` (copia)

- [ ] **Step 1: Copiar archivos modificados al vendor**

Los cambios en sso-client deben reflejarse en el vendor de portafolio. Copiar:

```bash
# SsoUserResolveException
cp /home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Exceptions/SsoUserResolveException.php \
   /home/dowardev/Documentos/programacion/portafolio/backend/vendor/tu-org/sso-server/src/Exceptions/

# SsoUserResolver
cp /home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Auth/SsoUserResolver.php \
   /home/dowardev/Documentos/programacion/portafolio/backend/vendor/tu-org/sso-server/src/Auth/

# SsoAuthMiddleware
cp /home/dowardev/Documentos/programacion/sso-client/packages/sso-server/src/Middleware/SsoAuthMiddleware.php \
   /home/dowardev/Documentos/programacion/portafolio/backend/vendor/tu-org/sso-server/src/Middleware/
```

- [ ] **Step 2: Commit en portafolio**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
git add vendor/tu-org/sso-server/src/Exceptions/SsoUserResolveException.php
git add vendor/tu-org/sso-server/src/Auth/SsoUserResolver.php
git add vendor/tu-org/sso-server/src/Middleware/SsoAuthMiddleware.php
git commit -m "chore(vendor): sync sso-server changes from sso-client repo"
```

---

### Task 6: Verificación end-to-end

- [ ] **Step 1: Limpiar cache de Laravel**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
php artisan config:clear
php artisan cache:clear
```

- [ ] **Step 2: Verificar config cargando correctamente**

```bash
cd /home/dowardev/Documentos/programacion/portafolio/backend
php artisan tinker --execute="echo config('sso.client_id');"
```

Expected output: `main-app`

- [ ] **Step 3: Probar login SSO**

1. Iniciar servers:
   - SSO backend: `cd /home/dowardev/Documentos/programacion/sso/back && php artisan serve --port=8001`
   - Portafolio backend: `cd /home/dowardev/Documentos/programacion/portafolio/backend && php artisan serve --port=8000`
   - Frontend: `cd /home/dowardev/Documentos/programacion/portafolio/frontend && pnpm run dev`

2. Abrir http://localhost:5173
3. Click en "Iniciar sesión" (debería redirigir a SSO)
4. Completar login en SSO
5. Verificar que redirige a `/auth/callback` y luego a `/home`
6. Verificar que los botones de login desaparecen y muestra el nombre del usuario
7. Verificar que el menú de admin aparece si el usuario tiene rol admin