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
# Verificar que el .env del frontend esté configurado. Vite hornea estos
# valores en el bundle al compilar, así que sin el archivo configurado
# (o con placeholders del example) la app rompe en producción.
if [ ! -f .env.development ]; then
    echo "  ADVERTENCIA: no se encontró frontend/.env.development"
    echo "  Configúralo: cp .env.development.example .env.development"
    echo "  y reemplaza VITE_API_URL / VITE_SSO_* por las URLs reales."
fi
if [ ! -f .env.production ]; then
    echo "  ADVERTENCIA: no se encontró frontend/.env.production"
    echo "  Configúralo antes de buildear: cp .env.production.example .env.production"
    echo "  y reemplaza VITE_API_URL / VITE_SSO_* por las URLs reales."
fi
cd ..

echo ""
echo "=== Setup completo ==="
echo ""
echo "Para iniciar:"
echo "  Backend:  cd backend && php artisan serve"
echo "  Frontend: cd frontend && pnpm run dev"
