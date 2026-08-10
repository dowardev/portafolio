#!/bin/bash
set -e

echo "=== Portafolio Setup ==="

# Backend
echo ""
echo "--- Backend ---"
cd backend
composer install
cp -n .env.example .env 2>/dev/null || true
if ! grep -qE "^APP_KEY=.+" .env 2>/dev/null; then
    php artisan key:generate --force
else
    echo "  APP_KEY ya existe, se conserva"
fi
php artisan migrate --force --no-interaction
cd ..

# Frontend
echo ""
echo "--- Frontend ---"
cd frontend
pnpm install
cd ..

echo ""
echo "=== Setup completo ==="
echo ""
echo "Para iniciar:"
echo "  Backend:  cd backend && php artisan serve"
echo "  Frontend: cd frontend && pnpm run dev"
