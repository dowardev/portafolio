<?php
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Match /blog/post/{slug}
$matches = [];
$isPostRoute = preg_match('#^/blog/post/([a-z0-9\-]+)$#', $path, $matches);

if (!$isPostRoute) {
    http_response_code(404);
    echo "<html><body><h1>Not Found</h1></body></html>";
    exit;
}

$slug = $matches[1];

// Detect bots
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$botPatterns = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'Twitter',
  'WhatsApp',
  'Googlebot',
  'Bingbot',
  'Slackbot',
  'LinkedInBot',
  'Discordbot',
  'TelegramBot',
  'Pinterestbot',
  'Slurp',
  'DuckDuckBot',
  'Applebot',
  'baiduspider',
  'yandexbot',
  'semrushbot',
  'ahrefsbot',
  'dotbot',
];

$isBot = false;
foreach ($botPatterns as $pattern) {
    if (stripos($userAgent, $pattern) !== false) {
        $isBot = true;
        break;
    }
}

if (!$isBot) {
    // Non-bot request reached prerender directly: serve the SPA shell
    readfile(__DIR__ . "/index.html");
    exit;
}

// Tell caches (CDN, proxies) that the response varies by User-Agent.
// Without this, the CDN may serve the SPA shell to bot crawlers.
header('Vary: User-Agent');

// Helper: fetch JSON via curl (file_get_contents fails with HTTPS on some Hostinger configs)
function curlGet($url) {
    $ch = curl_init($url);
    $sslVerify = strtolower(getenv('PRERENDER_SSL_VERIFY') ?: '') !== 'false';
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => $sslVerify,
        CURLOPT_SSL_VERIFYHOST => $sslVerify ? 2 : 0,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        return false;
    }
    return $response;
}

// Discover API URL from seo-settings, fallback to env var
$defaultApiUrl = getenv('API_URL');
if (!$defaultApiUrl) {
    $defaultApiUrl = 'https://blog-backend.dowar.xyz';
    error_log('WARNING: API_URL env var not set, using fallback: ' . $defaultApiUrl);
}
$apiBaseUrl = $defaultApiUrl;

$seoSettingsUrl = rtrim($defaultApiUrl, '/') . '/api/seo-settings';
$seoResponse = curlGet($seoSettingsUrl);

$siteTitle = 'Dowar Blog';
$siteDescription = '';
$siteImageUrl = '';
$ogSiteName = 'Dowar Blog';
$twitterHandle = '';

if ($seoResponse !== false) {
    $seoSettings = json_decode($seoResponse, true);
    if ($seoSettings) {
        if (!empty($seoSettings['adminApiUrl'])) {
            $apiBaseUrl = $seoSettings['adminApiUrl'];
        }
        $siteTitle = $seoSettings['siteTitle'] ?? $siteTitle;
        $siteDescription = $seoSettings['siteDescription'] ?? $siteDescription;
        $siteImageUrl = $seoSettings['siteImageUrl'] ?? $siteImageUrl;
        $ogSiteName = $seoSettings['ogSiteName'] ?? $ogSiteName;
        $twitterHandle = $seoSettings['twitterHandle'] ?? $twitterHandle;
    }
}

// Fetch post from Laravel API
$apiUrl = rtrim($apiBaseUrl, '/') . '/api/post-by-slug/' . urlencode($slug);
$apiResponse = curlGet($apiUrl);

if ($apiResponse === false) {
    http_response_code(502);
    echo '<html><body><h1>Error</h1></body></html>';
    exit;
}

$data = json_decode($apiResponse, true);

if (!$data || !isset($data['post'])) {
    http_response_code(404);
    echo '<html><body><h1>Not Found</h1></body></html>';
    exit;
}

$post = $data['post'];
$title = htmlspecialchars($post['title'] ?? '', ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars($post['description'] ?? $siteDescription, ENT_QUOTES, 'UTF-8');
$imageUrl = htmlspecialchars($post['cover']['url'] ?? $siteImageUrl, ENT_QUOTES, 'UTF-8');

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$siteUrl = "$protocol://$host";
$postUrl = $siteUrl . '/blog/post/' . htmlspecialchars($slug, ENT_QUOTES, 'UTF-8');
$content = $post['content'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $title ?> - <?= htmlspecialchars($siteTitle, ENT_QUOTES, 'UTF-8') ?></title>
  <meta name="description" content="<?= $description ?>">
  <link rel="shortcut icon" href="/img/favicon.ico">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="<?= $title ?>">
  <meta property="og:description" content="<?= $description ?>">
  <meta property="og:image" content="<?= $imageUrl ?>">
  <meta property="og:url" content="<?= $postUrl ?>">
  <meta property="og:site_name" content="<?= htmlspecialchars($ogSiteName, ENT_QUOTES, 'UTF-8') ?>">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= $title ?>">
  <meta name="twitter:description" content="<?= $description ?>">
  <meta name="twitter:image" content="<?= $imageUrl ?>">
  <?php if ($twitterHandle) { ?>
  <meta name="twitter:site" content="<?= htmlspecialchars($twitterHandle, ENT_QUOTES, 'UTF-8') ?>">
  <?php } ?>
</head>
<body>
  <h1><?= $title ?></h1>
  <?php if ($imageUrl) { ?>
    <img src="<?= $imageUrl ?>" alt="<?= $title ?>" style="max-width:100%">
  <?php } ?>
  <p><?= $description ?></p>
  <p><a href="<?= $postUrl ?>">Leer artículo completo</a></p>
</body>
</html>
