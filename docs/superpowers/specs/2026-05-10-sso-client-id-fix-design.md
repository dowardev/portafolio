# Fix: SSO Client ID no se envía al endpoint /me

> **Goal:** Corregir que `SsoHttpClient.get('/me')` no envía `client_id` como query param al SSO server, causando que `/me` retorne 400 y los roles del usuario queden vacíos en toda la cadena.

---

## 1. Causa Raíz

```
SsoHttpClient.get('/me', $token)
  → HTTP GET http://localhost:8001/api/me  (sin client_id)
  → SSO AuthController retorna 400: "client_id is required"
  → SsoHttpClient.request() retorna null
  → SsoUserResolver.resolve() retorna []
  → SsoUser siempre tiene roles: []
  → SsoAuth::roles() retorna []
  → extractRoleSlugs() retorna []
  → MyPermissionsController retorna { roles: [], permissions: {} }
  → userStore: permissions:{}, roles:[], permissionsLoaded:false
```

**Cadena completa verificada.** El `/me` del SSO server **requiere** `client_id` como query param (AuthController.php:157-161), pero `SsoHttpClient` nunca lo envía.

---

## 2. Enfoque Elegido: `clientId` en `SsoConfig` + `SsoHttpClient` lo adjunta automáticamente

### Enfoques rechazados

| Enfoque | Por qué se rechazó |
|---------|-------------------|
| B: Enviar `client_id` como header en TODAS las requests | Requiere cambios en SSO server, filtra client_id a endpoints que no lo necesitan |
| C: `SsoUserResolver` pasa `clientId` explícitamente | No DRY — cada caller debe recordar pasarlo |

### Por qué Enfoque A

- `SsoConfig` ya centraliza toda la config del SSO
- `SsoHttpClient` ya tiene acceso a `$this->config`
- Solo los endpoints que lo necesitan (`/me`) reciben `client_id`
- Un solo punto de cambio — agregar `clientId` al config

---

## 3. Cambios por Archivo

### 3.1 `SsoConfig.php` — Agregar `clientId`

**Archivo:** `sso-client/packages/sso-server/src/Types/SsoConfig.php`

Nuevo parámetro en constructor:

```php
public readonly string $clientId,
```

**Posición:** Antes de `$roleMappings` (último parámetro con default).

**Sin default** — si no está configurado, `fromConfig()` lanza `RuntimeException`.

`fromConfig()` actualizado:

```php
$clientId = config('sso.client_id');

if (empty($clientId)) {
    throw new \RuntimeException(
        'sso.client_id is required. Set it in config/sso.php or SSO_CLIENT_ID env.'
    );
}

return new self(
    ssoUrl: rtrim(config('sso.sso_url', env('SSO_URL', 'http://localhost:8001/api')), '/'),
    jwtIssuer: config('sso.jwt_issuer', env('SSO_JWT_ISSUER', 'http://localhost:8001')),
    jwksCacheTtl: (int) config('sso.jwks_cache_ttl', 3600),
    rolesCacheTtl: (int) config('sso.roles_cache_ttl', 300),
    dpopReplayTtl: (int) config('sso.dpop_replay_ttl', 120),
    dpopIatLeeway: (int) config('sso.dpop_iat_leeway', 60),
    clientId: $clientId,
    roleMappings: config('sso.role_mappings', []),
);
```

**Nota:** No se usa `env()` directamente en `fromConfig()` porque Laravel cached, `env()` retorna null en runtime. El config file ya hace el env fallback.

### 3.2 `SsoHttpClient.php` — Adjuntar `client_id` a `/me`

**Archivo:** `sso-client/packages/sso-server/src/Http/SsoHttpClient.php`

En `request()`, antes de hacer la llamada HTTP:

```php
private const CLIENT_ID_ROUTES = ['/me', '/check-session'];

private function request(string $method, string $path, string $bearerToken, array $data = []): ?array
{
    try {
        $url = $this->config->ssoUrl . '/' . ltrim($path, '/');

        if (in_array($path, self::CLIENT_ID_ROUTES, true)) {
            $separator = str_contains($url, '?') ? '&' : '?';
            $url .= $separator . 'client_id=' . urlencode($this->config->clientId);
        }

        // ... resto igual
    }
}
```

**Nota:** `/check-session` se incluye en `CLIENT_ID_ROUTES` como preparación futura, aunque actualmente no existe.

### 3.3 `SsoUserResolver.php` — Cache stale + RuntimeException si no hay roles

**Archivo:** `sso-client/packages/sso-server/src/Auth/SsoUserResolver.php`

Flujo actualizado de `resolve()`:

```
1. ¿Cache fresco? → retornar
2. Llamar /me
3. ¿/me OK? → cachear fresco + stale → retornar roles
4. ¿/me falló? → ¿Cache stale? → log warning → retornar stale
5. ¿No hay stale? → lanzar RuntimeException
```

Cambios:

```php
public function resolve(string $userId, string $token): array
{
    $cached = $this->getCachedRoles($userId);
    if ($cached !== null) {
        return $cached;
    }

    try {
        $userData = $this->httpClient->get('/me', $token);

        if ($userData && isset($userData['roles'])) {
            $this->cacheRoles($userId, $userData['roles']);
            return $userData['roles'];
        }
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
}

private function cacheRoles(string $userId, array $roles): void
{
    Cache::put('sso_user_roles:' . $userId, $roles, $this->config->rolesCacheTtl);
    Cache::put(
        'sso_user_roles_stale:' . $userId,
        $roles,
        $this->config->rolesCacheTtl * 6,
    );
}

private function getStaleRoles(string $userId): ?array
{
    return Cache::get('sso_user_roles_stale:' . $userId);
}
```

**TTL stale:** `rolesCacheTtl * 6` = 300 * 6 = 1800s = 30 minutos.

**RuntimeException en vez de `[]`:** El `SsoAuthMiddleware` ya atrapa `\Exception` (línea 62-67) y retorna 401.

### 3.4 `config/sso.php` del paquete — Agregar `client_id`

**Archivo:** `sso-client/packages/sso-server/config/sso.php`

Agregar:

```php
'client_id' => env('SSO_CLIENT_ID', '1'),
```

### 3.5 `tests/TestCase.php` — Agregar `client_id`

**Archivo:** `sso-client/packages/sso-server/tests/TestCase.php`

En `defineEnvironment()`:

```php
$app['config']->set('sso.client_id', '1');
```

### 3.6 Nuevo `tests/SsoHttpClientTest.php`

**Archivo:** `sso-client/packages/sso-server/tests/SsoHttpClientTest.php`

Tests:

1. `test_get_me_includes_client_id` — GET a `/me` incluye `?client_id=1` en la URL
2. `test_get_other_route_excludes_client_id` — GET a `/roles` NO incluye `client_id`
3. `test_url_with_existing_query_params_uses_ampersand` — Si la URL ya tiene `?`, usa `&`

### 3.7 Portafolio `config/sso.php` — Cambiar int a string

**Archivo:** `portafolio/backend/config/sso.php`

Cambio:

```php
// Antes:
'client_id' => (int) env('SSO_CLIENT_ID', 1),

// Después:
'client_id' => env('SSO_CLIENT_ID', '1'),
```

---

## 4. Archivos que NO cambian

| Archivo | Razón |
|---------|-------|
| `SsoServerClient.php` | No usa `clientId` directamente |
| `SsoAuthMiddleware.php` | Ya atrapa `\Exception` genérica |
| `SsoRoleMiddleware.php` | No usa `clientId` directamente |
| `RoleChecker.php` | No usa `clientId` directamente |
| `SsoUser.php` | No usa `clientId` directamente |
| SSO server `AuthController.php` | Ya acepta `client_id` |
| `MyPermissionsController.php` | Beneficiario pasivo |
| `PermissionMiddleware.php` | Beneficiario pasivo |
| Frontend | No hay cambios |

---

## 5. Edge Cases

| Caso | Comportamiento |
|------|----------------|
| `clientId` no configurado | RuntimeException al boot (fail early) |
| URL ya tiene query params | Usa `&` en vez de `?` |
| `clientId` con caracteres especiales | `urlencode()` los maneja |
| SSO server caído, cache fresco existe | Usa cache fresco (comportamiento actual) |
| SSO server caído, no hay cache fresco pero sí stale | Usa stale + log warning |
| SSO server caído, no hay cache de ningún tipo | RuntimeException → middleware retorna 401 |
| Cache stale con roles desactualizados | Máximo 30 min (trade-off aceptado) |

---

## 6. Secuencia de implementación

1. `SsoConfig.php` — agregar `clientId` + `fromConfig()` con RuntimeException
2. `SsoHttpClient.php` — agregar `CLIENT_ID_ROUTES` + lógica de query param
3. `SsoUserResolver.php` — cache stale + RuntimeException
4. `config/sso.php` (paquete) — agregar `client_id`
5. `tests/TestCase.php` — agregar `sso.client_id`
6. `tests/SsoHttpClientTest.php` — tests nuevos
7. Portafolio `config/sso.php` — eliminar cast `(int)`

---

## 7. Verificación

1. `composer test` en el paquete sso-server — todos los tests pasan
2. GET `/my-permissions` con usuario autenticado → retorna roles y permisos
3. Frontend `userStore` tiene `roles` y `permissions` poblados
4. Router guard bloquea correctamente usuarios sin permisos