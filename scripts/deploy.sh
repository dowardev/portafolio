#!/usr/bin/env bash
# Manual deploy script — replicates `backend_deploy` and `frontend_deploy` jobs
# from `.gitlab-ci.yml` without going through GitLab CI.
#
# Usage:
#   ./scripts/deploy.sh                 # lint+tests + build + deploy backend and frontend from current commit
#   ./scripts/deploy.sh --backend       # only backend
#   ./scripts/deploy.sh --frontend      # only frontend
#   ./scripts/deploy.sh --tag v1.2.3    # checkout tag first, then lint+tests + build + deploy
#   ./scripts/deploy.sh --skip-checks   # skip lint+tests (faster, use with caution)
#   ./scripts/deploy.sh --dry-run       # print commands without executing scp/ssh
#
# Secrets are read from `.env` at the repo root (gitignored).
# Copy `.env.example` → `.env` and fill in your values.

set -euo pipefail

# ---------- Paths ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

# ---------- Args ----------
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true
DRY_RUN=false
SKIP_CHECKS=false
TARGET_REF=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --backend)      DEPLOY_FRONTEND=false; shift ;;
    --frontend)     DEPLOY_BACKEND=false; shift ;;
    --all)          DEPLOY_BACKEND=true; DEPLOY_FRONTEND=true; shift ;;
    --tag)          TARGET_REF="$2"; shift 2 ;;
    --skip-checks)  SKIP_CHECKS=true; shift ;;
    --dry-run)      DRY_RUN=true; shift ;;
    -h|--help)
      sed -n '2,17p' "$0"; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Run with --help for usage." >&2
      exit 1 ;;
  esac
done

# ---------- Load secrets ----------
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found." >&2
  echo "Copy .env.example → .env and fill in your server values." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

: "${SSH_HOST:?SSH_HOST is required in .env}"
: "${SSH_PORT:?SSH_PORT is required in .env}"
: "${SSH_USER:?SSH_USER is required in .env}"
: "${DEPLOY_PATH_BACKEND:?DEPLOY_PATH_BACKEND is required in .env}"
: "${DEPLOY_PATH_FRONTEND:?DEPLOY_PATH_FRONTEND is required in .env}"

# Determine SSH auth mode: explicit key file vs ssh-agent
# If SSH_PRIVATE_KEY_PATH is set AND non-empty AND file exists -> use key file
# If unset, empty, or file missing -> use ssh-agent
if [[ -n "${SSH_PRIVATE_KEY_PATH:-}" && -f "${SSH_PRIVATE_KEY_PATH:-}" ]]; then
  USE_KEY_FILE=true
else
  USE_KEY_FILE=false
fi

if [[ "$USE_KEY_FILE" == "true" ]]; then
  SSH_OPTS=(-i "$SSH_PRIVATE_KEY_PATH" -p "$SSH_PORT" -o StrictHostKeyChecking=accept-new -o BatchMode=yes)
  SCP_OPTS=(-i "$SSH_PRIVATE_KEY_PATH" -P "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
else
  # Use ssh-agent (no -i) — export agent vars so subshells inherit it
  SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new -o BatchMode=yes)
  SCP_OPTS=(-P "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
  echo ">>> Using ssh-agent for authentication (no explicit key file)"
  export SSH_AUTH_SOCK SSH_AGENT_PID
fi

# ---------- Optional ref checkout ----------
cd "$REPO_ROOT"
if [[ -n "$TARGET_REF" ]]; then
  echo ">>> Checking out $TARGET_REF"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] git checkout $TARGET_REF"
  else
    git fetch --tags
    git checkout "$TARGET_REF"
  fi
  echo
fi

# ============================================================
# Pre-deploy checks (lint + tests) — mirrors CI pipeline
# ============================================================
run_checks() {
  local label="$1"
  shift
  if [[ "$SKIP_CHECKS" == "true" ]]; then
    echo ">>> $label: SKIPPED (--skip-checks)"
    return
  fi
  echo ">>> $label: $*"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $*"
  else
    # Use subshell so cd doesn't persist between checks
    (eval "$*")
  fi
  echo
}

# Backend checks
if [[ "$DEPLOY_BACKEND" == "true" ]]; then
  # Ensure dev deps exist for lint/test (don't destroy local vendor)
  if [[ ! -f "backend/vendor/bin/pint" ]]; then
    echo ">>> Backend: installing dev dependencies for checks"
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "[dry-run] (cd backend && composer install --no-interaction)"
    else
      (cd backend && composer install --no-interaction)
    fi
    echo
  fi
  run_checks "Backend lint" "cd backend && vendor/bin/pint --test"
  run_checks "Backend tests" "
    cd backend &&
    cp .env.testing.example .env &&
    php artisan key:generate --force &&
    php artisan config:clear &&
    APP_KEY=\$(grep '^APP_KEY=' .env | cut -d'=' -f2-) \
    DB_CONNECTION=sqlite DB_DATABASE=:memory: php artisan test
  "
fi

# Frontend checks
if [[ "$DEPLOY_FRONTEND" == "true" ]]; then
  run_checks "Frontend lint" "cd frontend && pnpm run lint"
  run_checks "Frontend tests" "cd frontend && pnpm run test:unit"
fi

# ============================================================
# Backend deploy (mirrors .gitlab-ci.yml `backend_deploy`)
# ============================================================
if [[ "$DEPLOY_BACKEND" == "true" ]]; then
  # Build production tarball in temp dir (doesn't touch local vendor)
  BUILD_DIR="/tmp/backend-deploy-$$"
  echo ">>> Backend: building production tarball in $BUILD_DIR"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] mkdir -p $BUILD_DIR && cp -r backend/* backend/.[^.]* $BUILD_DIR/ 2>/dev/null || true"
    echo "[dry-run] (cd $BUILD_DIR && composer install --no-dev --optimize-autoloader --no-interaction)"
    echo "[dry-run] (cd $BUILD_DIR && php artisan config:cache && php artisan route:cache)"
    echo "[dry-run] tar -czf /tmp/backend.tar.gz --exclude='.git' --exclude='node_modules' --exclude='vendor' --exclude='.env*' --exclude='storage/*' --exclude='bootstrap/cache/*.php' -C $BUILD_DIR ."
  else
    mkdir -p "$BUILD_DIR"
    cp -r backend/* backend/.[^.]* "$BUILD_DIR/" 2>/dev/null || true
    (cd "$BUILD_DIR" && composer install --no-dev --optimize-autoloader --no-interaction)
    (cd "$BUILD_DIR" && php artisan config:cache && php artisan route:cache)
    tar -czf /tmp/backend.tar.gz \
      --exclude='.git' \
      --exclude='node_modules' \
      --exclude='vendor' \
      --exclude='.env*' \
      --exclude='storage/*' \
      --exclude='bootstrap/cache/*.php' \
      -C "$BUILD_DIR" .
    rm -rf "$BUILD_DIR"
  fi
  echo

  echo ">>> Backend: scp → $SSH_USER@$SSH_HOST:/tmp/backend.tar.gz"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] scp ${SCP_OPTS[*]} /tmp/backend.tar.gz $SSH_USER@$SSH_HOST:/tmp/backend.tar.gz"
  else
    scp "${SCP_OPTS[@]}" /tmp/backend.tar.gz "$SSH_USER@$SSH_HOST:/tmp/backend.tar.gz"
  fi
  echo

  echo ">>> Backend: ssh → extract + composer install + migrate + cache"
  REMOTE_CMD=$(cat <<EOF
set -e
mkdir -p "$DEPLOY_PATH_BACKEND"
tar -xzf /tmp/backend.tar.gz -C "$DEPLOY_PATH_BACKEND"
cd "$DEPLOY_PATH_BACKEND"
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
rm /tmp/backend.tar.gz
EOF
)
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] ssh ${SSH_OPTS[*]} $SSH_USER@$SSH_HOST <<<"
    echo "$REMOTE_CMD"
  else
    ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST" "$REMOTE_CMD"
  fi
  echo
fi

# ============================================================
# Frontend deploy (mirrors .gitlab-ci.yml `frontend_deploy`)
# ============================================================
if [[ "$DEPLOY_FRONTEND" == "true" ]]; then
  echo ">>> Frontend: pnpm install --frozen-lockfile"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] (cd frontend && corepack enable && pnpm install --frozen-lockfile)"
  else
    (cd frontend && corepack enable && pnpm install --frozen-lockfile)
  fi
  echo

  echo ">>> Frontend: vite build"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] (cd frontend && pnpm exec vite build)"
  else
    (cd frontend && pnpm exec vite build)
  fi
  echo

  echo ">>> Frontend: tar dist/"
  TARBALL="/tmp/frontend.tar.gz"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] tar -czf $TARBALL -C frontend/dist ."
  else
    [[ -d frontend/dist ]] || { echo "ERROR: frontend/dist missing — build failed?" >&2; exit 1; }
    tar -czf "$TARBALL" -C frontend/dist .
  fi
  echo

  echo ">>> Frontend: scp → $SSH_USER@$SSH_HOST:/tmp/frontend.tar.gz"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] scp ${SCP_OPTS[*]} $TARBALL $SSH_USER@$SSH_HOST:/tmp/frontend.tar.gz"
  else
    scp "${SCP_OPTS[@]}" "$TARBALL" "$SSH_USER@$SSH_HOST:/tmp/frontend.tar.gz"
  fi
  echo

  echo ">>> Frontend: ssh → extract"
  REMOTE_CMD=$(cat <<EOF
set -e
mkdir -p "$DEPLOY_PATH_FRONTEND"
tar -xzf /tmp/frontend.tar.gz -C "$DEPLOY_PATH_FRONTEND"
rm /tmp/frontend.tar.gz
EOF
)
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] ssh ${SSH_OPTS[*]} $SSH_USER@$SSH_HOST <<<"
    echo "$REMOTE_CMD"
  else
    ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST" "$REMOTE_CMD"
  fi
  echo
fi

# Cleanup: restore production vendor (no dev deps)
if [[ "$DEPLOY_BACKEND" == "true" && "$DRY_RUN" != "true" ]]; then
  echo ">>> Backend: cleaning up dev dependencies (composer install --no-dev)"
  (cd backend && composer install --no-dev --optimize-autoloader --no-interaction)
  echo
fi

echo ">>> Deploy complete."
