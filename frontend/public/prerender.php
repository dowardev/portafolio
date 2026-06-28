<?php
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Matar /blog/post/{slug}
$matches = [];
$isPostRoute = preg_match('#^/blog/post/([a-z0-9\-]+)$#', $path, $matches);

if (!$isPostRoute) {
  return false;
}

$slug = $matches[1];

// Detectar bots
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
  return false;
}

// Llamar a la API de Laravel
$apiUrl = 'https://api.dowar.xyz/api/post-by-slug/' . urlencode($slug);
$apiResponse = @file_get_contents($apiUrl, false, stream_context_create([
  'http' => [
    'method' => 'GET',
    'header' => "Accept: application/json\r\n",
    'timeout' => 10,
  ],
]));

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
$description = htmlspecialchars($post['description'] ?? '', ENT_QUOTES, 'UTF-8');
$imageUrl = htmlspecialchars($post['cover']['url'] ?? '', ENT_QUOTES, 'UTF-8');
$siteUrl = 'https://dowar.xyz';
$postUrl = $siteUrl . '/blog/post/' . htmlspecialchars($slug, ENT_QUOTES, 'UTF-8');
$content = $post['content'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $title ?> - Dowar Blog</title>
  <meta name="description" content="<?= $description ?>">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="<?= $title ?>">
  <meta property="og:description" content="<?= $description ?>">
  <meta property="og:image" content="<?= $imageUrl ?>">
  <meta property="og:url" content="<?= $postUrl ?>">
  <meta property="og:site_name" content="Dowar Blog">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= $title ?>">
  <meta name="twitter:description" content="<?= $description ?>">
  <meta name="twitter:image" content="<?= $imageUrl ?>">
</head>
<body>
  <h1><?= $title ?></h1>
  <?php if ($imageUrl): ?>
    <img src="<?= $imageUrl ?>" alt="<?= $title ?>" style="max-width:100%">
  <?php endif; ?>
  <p><?= $description ?></p>
  <p><a href="<?= $postUrl ?>">Leer artículo completo</a></p>
</body>
</html>
