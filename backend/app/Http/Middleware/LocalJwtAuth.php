<?php

namespace App\Http\Middleware;

use App\Services\JwksService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\Clock\SystemClock;
use Symfony\Component\HttpFoundation\Response;

class LocalJwtAuth
{
    private JwksService $jwksService;

    public function __construct(JwksService $jwksService)
    {
        $this->jwksService = $jwksService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' => 'Token no proporcionado'
            ], 401);
        }

        $publicKeyPem = $this->jwksService->getVerificationKey();

        if (!$publicKeyPem) {
            return response()->json([
                'message' => 'No se pudo obtener la clave pública del SSO'
            ], 503);
        }

        try {
            $jwtConfig = Configuration::forAsymmetricSigner(
                new Sha256(),
                InMemory::plainText('unused-signing-key'),
                InMemory::plainText($publicKeyPem)
            );

            $parsedToken = $jwtConfig->parser()->parse($token);

            $ssoIssuer = env('SSO_JWT_ISSUER', 'http://localhost:8001');

            $constraints = [
                new SignedWith($jwtConfig->signer(), $jwtConfig->verificationKey()),
                new IssuedBy($ssoIssuer),
                new LooseValidAt(new SystemClock(new \DateTimeZone('UTC'))),
            ];

            if (!$jwtConfig->validator()->validate($parsedToken, ...$constraints)) {
                Cache::forget('sso_jwt_public_key');
                Cache::forget('sso_jwks');
                return response()->json([
                    'message' => 'Token inválido'
                ], 401);
            }

            $cnf = $parsedToken->claims()->get('cnf');
            if ($cnf !== null && isset($cnf['jkt'])) {
                $dpopHeader = $request->header('DPoP');
                if (!$dpopHeader) {
                    return response()->json([
                        'message' => 'DPoP proof requerido para este token'
                    ], 401);
                }

                $dpopError = $this->verifyDpopProof($dpopHeader, $token, $cnf['jkt'], $request, $jwtConfig);
                if ($dpopError !== null) {
                    return $dpopError;
                }

                $request->merge(['dpop_verified' => true]);
            }

            $userClaim = $parsedToken->claims()->get('user');
            $userId = $parsedToken->claims()->get('sub');

            $ssoUser = [
                'id' => $userId,
                'name' => $userClaim['name'] ?? null,
                'email' => $userClaim['email'] ?? null,
                'user' => $userClaim['user'] ?? null,
            ];

            $roles = $this->fetchUserRoles($userId, $token);

            $ssoUser['roles'] = $roles;
            $ssoUser['is_email_verified'] = true;
            $ssoUser['is_user_disabled'] = false;

            $isAdmin = $this->checkIsAdmin($roles);

            $request->merge([
                'sso_user' => $ssoUser,
                'sso_user_id' => $userId,
                'is_admin' => $isAdmin,
                'roles' => $roles,
            ]);

        } catch (\Exception $e) {
            Log::error('LocalJwtAuth error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Token inválido: ' . $e->getMessage()
            ], 401);
        }

        return $next($request);
    }

    private function verifyDpopProof(string $dpopHeader, string $accessToken, string $expectedJkt, Request $request, Configuration $jwtConfig): ?Response
    {
        try {
            $dpopToken = $jwtConfig->parser()->parse($dpopHeader);

            $header = $dpopToken->headers();

            if ($header->get('typ') !== 'dpop+jwt') {
                return response()->json(['message' => 'Tipo de token DPoP inválido'], 401);
            }

            $alg = $header->get('alg');
            if ($alg !== 'RS256') {
                return response()->json(['message' => 'Algoritmo DPoP no soportado'], 401);
            }

            $jwkHeader = $header->get('jwk');
            if (!$jwkHeader) {
                return response()->json(['message' => 'Falta la clave pública JWK en el header DPoP'], 401);
            }

            $jwkArray = (array) $jwkHeader;
            if (!isset($jwkArray['kty']) || !isset($jwkArray['n']) || !isset($jwkArray['e'])) {
                return response()->json(['message' => 'JWK del DPoP proof incompleto: faltan campos requeridos'], 401);
            }

            $jktFromProof = $this->generateJWKThumbprint($jwkArray);

            if (!hash_equals($expectedJkt, $jktFromProof)) {
                return response()->json(['message' => 'Huella digital JWK del DPoP proof no coincide'], 401);
            }

            $dpopPublicKeyPem = $this->jwkToPem($jwkArray);
            $dpopVerificationKey = InMemory::plainText($dpopPublicKeyPem);
            $signer = new Sha256();

            $dpopConfig = Configuration::forAsymmetricSigner(
                $signer,
                InMemory::plainText('unused'),
                $dpopVerificationKey
            );

            $signedWith = new SignedWith($signer, $dpopVerificationKey);
            if (!$dpopConfig->validator()->validate($dpopToken, $signedWith)) {
                return response()->json(['message' => 'Firma del DPoP proof inválida'], 401);
            }

            $payload = $dpopToken->claims();

            $htm = $payload->get('htm');
            $htu = $payload->get('htu');
            $iat = $payload->get('iat');
            $jti = $payload->get('jti');
            $ath = $payload->get('ath');

            if (!$htm || !$htu || !$iat || !$jti || !$ath) {
                return response()->json(['message' => 'DPoP proof incompleto: faltan claims requeridos (htm, htu, iat, jti, ath)'], 401);
            }

            if ($htm !== $request->method()) {
                return response()->json(['message' => 'Método HTTP no coincide en DPoP proof'], 401);
            }

            $baseUrl = $request->getSchemeAndHttpHost() . $request->getBaseUrl();
            $expectedHtu = $baseUrl . $request->getPathInfo();
            if ($htu !== $expectedHtu && $htu !== $request->fullUrl()) {
                return response()->json(['message' => 'URI HTTP no coincide en DPoP proof'], 401);
            }

            $now = time();
            $iatTimestamp = $iat instanceof \DateTimeInterface ? $iat->getTimestamp() : (int) $iat;
            if ($iatTimestamp > $now + 60 || $iatTimestamp < $now - 60) {
                return response()->json(['message' => 'Timestamp del DPoP proof fuera de rango'], 401);
            }

            $tokenHash = rtrim(strtr(base64_encode(hash('sha256', $accessToken, true)), '+/', '-_'), '=');
            if (!hash_equals($tokenHash, $ath)) {
                return response()->json(['message' => 'Hash del token de acceso no coincide'], 401);
            }

            $cacheKey = 'dpop_jti:' . $jti;
            if (Cache::has($cacheKey)) {
                return response()->json(['message' => 'DPoP proof reutilizado (replay detectado)'], 401);
            }
            Cache::put($cacheKey, true, 120);

            return null;

        } catch (\Exception $e) {
            return response()->json(['message' => 'DPoP proof inválido: ' . $e->getMessage()], 401);
        }
    }

    private function generateJWKThumbprint(array $jwk): string
    {
        $jwkString = json_encode([
            'kty' => $jwk['kty'] ?? 'RSA',
            'n' => $jwk['n'] ?? null,
            'e' => $jwk['e'] ?? null,
        ]);

        return rtrim(strtr(base64_encode(hash('sha256', $jwkString, true)), '+/', '-_'), '=');
    }

    private function jwkToPem(array $jwk): string
    {
        $n = $this->base64UrlDecode($jwk['n']);
        $e = $this->base64UrlDecode($jwk['e']);

        $asn1 = $this->encodeASN1Sequence(
            $this->encodeASN1Sequence(
                $this->encodeASN1Sequence(
                    $this->encodeASN1OID('1.2.840.113549.1.1.1') .
                    $this->encodeASN1Null()
                ) .
                $this->encodeASN1BitString(
                    $this->encodeASN1Sequence(
                        $this->encodeASN1Integer($n) .
                        $this->encodeASN1Integer($e)
                    )
                )
            )
        );

        return "-----BEGIN PUBLIC KEY-----\n" .
            wordwrap(base64_encode($asn1), 64, "\n", true) .
            "\n-----END PUBLIC KEY-----";
    }

    private function encodeASN1Integer(string $value): string
    {
        if (ord($value[0]) & 0x80) {
            $value = "\x00" . $value;
        }
        return "\x02" . $this->encodeASN1Length(strlen($value)) . $value;
    }

    private function encodeASN1Sequence(string $value): string
    {
        return "\x30" . $this->encodeASN1Length(strlen($value)) . $value;
    }

    private function encodeASN1BitString(string $value): string
    {
        $value = "\x00" . $value;
        return "\x03" . $this->encodeASN1Length(strlen($value)) . $value;
    }

    private function encodeASN1Null(): string
    {
        return "\x05\x00";
    }

    private function encodeASN1OID(string $oid): string
    {
        $parts = array_map('intval', explode('.', $oid));
        $encoded = chr(40 * $parts[0] + $parts[1]);
        for ($i = 2; $i < count($parts); $i++) {
            if ($parts[$i] < 128) {
                $encoded .= chr($parts[$i]);
            } else {
                $temp = '';
                $val = $parts[$i];
                $temp = chr($val % 128) . $temp;
                $val = intdiv($val, 128);
                while ($val > 0) {
                    $temp = chr(($val % 128) | 0x80) . $temp;
                    $val = intdiv($val, 128);
                }
                $encoded .= $temp;
            }
        }
        return "\x06" . $this->encodeASN1Length(strlen($encoded)) . $encoded;
    }

    private function encodeASN1Length(int $length): string
    {
        if ($length < 128) {
            return chr($length);
        }
        $lengthBytes = '';
        $temp = $length;
        while ($temp > 0) {
            $lengthBytes = chr($temp & 0xFF) . $lengthBytes;
            $temp >>= 8;
        }
        return chr(0x80 | strlen($lengthBytes)) . $lengthBytes;
    }

    private function base64UrlDecode(string $data): string
    {
        $padded = str_pad(strtr($data, '-_', '+/'), strlen($data) % 4 === 0 ? strlen($data) : strlen($data) + (4 - strlen($data) % 4), '=', STR_PAD_RIGHT);
        return base64_decode($padded);
    }

    private function fetchUserRoles(string $userId, string $token): array
    {
        try {
            $ssoUrl = rtrim(config('app.sso_url', env('SSO_URL', 'http://localhost:8001/api')), '/');
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $token,
            ])->timeout(5)->get($ssoUrl . '/me');

            if ($response->successful()) {
                $userData = $response->json();
                if (isset($userData['roles'])) {
                    $this->cacheUserRoles($userId, $userData['roles']);
                    return $userData['roles'];
                }
                $ssoUser = $userData;
            }
        } catch (\Exception $e) {
            Log::warning('Failed to fetch user roles from SSO, using cache: ' . $e->getMessage());
        }

        $cached = $this->getCachedUserRoles($userId);
        if ($cached !== null) {
            return $cached;
        }

        return [];
    }

    private function cacheUserRoles(string $userId, array $roles): void
    {
        Cache::put('sso_user_roles:' . $userId, $roles, 300);
    }

    private function getCachedUserRoles(string $userId): ?array
    {
        return Cache::get('sso_user_roles:' . $userId);
    }

    private function checkIsAdmin(array $roles): bool
    {
        foreach ($roles as $role) {
            if (isset($role['slug']) && $role['slug'] === 'admin') {
                return true;
            }
            if (isset($role['name']) && strtolower($role['name']) === 'administrador') {
                return true;
            }
        }
        return false;
    }
}