#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

# sed -i portability: GNU sed needs `sed -i`, BSD sed (macOS) needs `sed -i ''`.
# Detected at startup so sed_set works on both Linux and macOS out of the box.
if [ "$(uname)" = "Darwin" ]; then
    SEDI=(-i '')
else
    SEDI=(-i)
fi

# =============================================================================
# Portafolio (dowar-blog) - Setup Script
# Helps configure the backend (Laravel 11: .env, composer, migrations, seeders,
# SSO client) and the Ionic/Vue frontend (.env, pnpm, build) during deployment.
#
# Adapted from sso/setup.sh and oneSpend/setup.sh for the portafolio stack:
#   - Split env model: dev and production both configure backend/.env (the file
#     Laravel always loads). Prod still runs artisan with --env=production, which
#     falls back to .env when backend/.env.production does not exist - so .env is
#     the single source of truth on the server (deploy tarball excludes .env*).
#   - External SSO *client* (no local JWT keys, no generate_jwt_keys step).
#   - SQLite by default, MySQL/MariaDB in the examples -> DB check handles all.
#   - Frontend dirs are backend/ and frontend/ (not back/ and front/).
#   - Non-interactive prefix: PORTFOLIO_*
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACK_DIR="$SCRIPT_DIR/backend"
FRONT_DIR="$SCRIPT_DIR/frontend"
BACKUP_KEEP=5
CURRENT_STEP=0

DEV_MODE=false
NON_INTERACTIVE=false
NO_BACKUP=false
HAS_NODE=false
HAS_PNPM=false
HOSTING_ENV=""
SKIP_FRONT_BUILD=false
# --advanced: re-prompt all frontend vars even when they can be copied from the
# backend env file. Default (advanced off) copies VITE_API_URL, VITE_SSO_URL and
# VITE_SSO_CLIENT_ID from backend and only prompts for VITE_SSO_FRONTEND_URL
# (frontend-only, has no backend counterpart).
ADVANCED_MODE=false
HEALTH_OK=true
HEALTH_RESULTS=()

# Backend env file actually configured by this script.
# Dev -> backend/.env (Laravel loads this for local runs, APP_ENV=local).
# Prod -> backend/.env too: Laravel always loads .env, and .env.production only
#         loads when an external APP_ENV=production exists (not guaranteed on
#         shared hosting). Artisan runs with --env=production fall back to .env.
BACKEND_ENV_FILE=""
# Extra artisan flag so prod commands deterministically target the production
# env (loads .env.production when present, otherwise falls back to .env).
APP_ENV_ARG=""

# -----------------------------------------------------------------------------
# Helpers: logging, prompts, backup, sed
# -----------------------------------------------------------------------------

color() { printf '\033[3%sm%s\033[0m' "$1" "$2"; }
log_ok()   { echo "  $(color 2 "[OK]")   $1"; }
log_info() { echo "  $(color 6 "[..]")  $1"; }
log_warn() { echo "  $(color 3 "[!]")   $1"; }
log_error(){ echo "  $(color 1 "[ER]")  $1"; }

confirm() {
    local prompt="$1" default="${2:-N}"
    if [ "$NON_INTERACTIVE" = true ]; then
        [[ "$default" =~ ^[Yy]$ ]]
        return $?
    fi
    local yn
    if [[ "$default" =~ ^[Yy]$ ]]; then
        printf "%s [Y/n]: " "$prompt" >&2
        read -r yn || true
        yn="${yn:-Y}"
    else
        printf "%s [y/N]: " "$prompt" >&2
        read -r yn || true
        yn="${yn:-N}"
    fi
    [[ "$yn" =~ ^[Yy]$ ]]
}

ask() {
    local prompt="$1" default="$2"
    if [ "$NON_INTERACTIVE" = true ]; then
        echo "$default"
        return 0
    fi
    local val
    printf "%s [%s]: " "$prompt" "$default" >&2
    read -r val || true
    echo "${val:-$default}"
}

ask_secret() {
    local prompt="$1" default="$2"
    if [ "$NON_INTERACTIVE" = true ]; then
        echo "$default"
        return 0
    fi
    local val
    printf "%s: " "$prompt" >&2
    read -s -r val || true
    echo >&2
    echo "${val:-$default}"
}

get_env_default() {
    local key="$1" file="$2"
    grep -E "^${key}=" "$file" | cut -d= -f2- || true
}

# Remove .env quoting from a captured value: strip wrapping double quotes
# and unescape inner \" and \\ so re-running sed_set doesn't double-escape.
unquote_env_val() {
    local val="$1"
    if [[ "$val" == \"*\" ]] && [ "${#val}" -ge 2 ]; then
        val="${val:1:${#val}-2}"
        val="$(printf '%s' "$val" | sed 's/\\\\/\\/g; s/\\"/"/g')"
    fi
    printf '%s' "$val"
}

require_cmd() {
    local bin="$1" hint="${2:-}"
    if ! command -v "$bin" >/dev/null 2>&1; then
        log_error "Required command not found: $bin"
        [ -n "$hint" ] && log_error "Hint: $hint"
        exit 2
    fi
}

backup_file() {
    local path="$1"
    [ "$NO_BACKUP" = true ] && return 0
    [ ! -f "$path" ] && return 0
    local ts
    ts="$(date +%Y%m%d_%H%M%S)"
    cp "$path" "${path}.bak.${ts}"
    local backups=()
    for f in "${path}.bak".*; do
        [ -f "$f" ] && backups+=("$f")
    done
    local count=${#backups[@]}
    if [ "$count" -gt "$BACKUP_KEEP" ]; then
        local remove_count=$((count - BACKUP_KEEP))
        for f in $(printf '%s\n' "${backups[@]}" | sort | head -n "$remove_count"); do
            rm -f "$f"
        done
    fi
}

sed_set() {
    local file="$1" key="$2" val="$3"
    local escaped_val="$val"
    local needs_quoting=false
    if [[ "$val" =~ [[:space:]#\"\'] ]] || [ -z "$val" ]; then
        needs_quoting=true
        escaped_val="${escaped_val//\"/\\\"}"
    fi
    escaped_val="${escaped_val//\\/\\\\}"
    escaped_val="${escaped_val//&/\\&}"
    escaped_val="${escaped_val//|/\\|}"
    if [ "$needs_quoting" = true ]; then
        escaped_val="\"${escaped_val}\""
    fi
    if grep -qE "^\s*${key}=" "$file" 2>/dev/null; then
        sed "${SEDI[@]}" "s|^[[:space:]]*${key}=.*|${key}=${escaped_val}|" "$file"
    else
        echo "${key}=${escaped_val}" >> "$file"
    fi
}

# Trim whitespace and ensure http(s):// scheme. Optional frontends (where empty
# is acceptable) get just a warning; required URLs return 1 so callers can loop
# until the user supplies one. Used for both backend (APP_URL/FRONTEND_URL)
# and frontend (VITE_*) variables.
normalize_url() {
    local value="$1" required="${2:-true}"
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"
    if [ -z "$value" ]; then
        if [ "$required" = true ]; then
            return 1
        fi
        echo ""
        return 0
    fi
    if [[ ! "$value" =~ ^https?:// ]]; then
        log_warn "'$value' lacks http:// or https:// scheme — prepending http://"
        value="http://$value"
    fi
    echo "$value"
}

detect_hosting() {
    if [ -d "/usr/local/cpanel" ] || [ -n "${CPANEL:-}" ]; then
        echo "shared"
    elif command -v sudo >/dev/null 2>&1 || command -v apt >/dev/null 2>&1 || command -v yum >/dev/null 2>&1; then
        echo "vps"
    else
        echo "shared"
    fi
}

# Check the DB credentials from an env file. Returns a token for the caller to
# parse: "OK", "OK:sqlite", or "FAIL:<detail>".
check_db_connection() {
    local env_file="$1"
    php -r '
        $env = file_get_contents($argv[1]);
        $lines = explode("\n", $env);
        $vars = [];
        foreach ($lines as $line) {
            if (preg_match("/^([A-Z_]+)=\"?([^\"]*)\"?/", $line, $m)) {
                $vars[$m[1]] = $m[2];
            }
        }
        $driver = strtolower(trim($vars["DB_CONNECTION"] ?? ""));
        if ($driver === "" || $driver === "sqlite") {
            echo "OK:sqlite";
            return;
        }
        if (!in_array($driver, ["mysql", "mariadb"], true)) {
            echo "FAIL:Driver " . ($vars["DB_CONNECTION"] ?? "") . " no soportado.";
            return;
        }
        $dsn = "mysql:host={$vars["DB_HOST"]};port={$vars["DB_PORT"]};dbname={$vars["DB_DATABASE"]}";
        try {
            new PDO($dsn, $vars["DB_USERNAME"] ?? "", $vars["DB_PASSWORD"] ?? "");
            echo "OK";
        } catch (\PDOException $e) {
            echo "FAIL:" . $e->getMessage();
        }
    ' "$env_file" 2>/dev/null || echo "FAIL:Could not run PHP check"
}

# -----------------------------------------------------------------------------
# CLI options
# -----------------------------------------------------------------------------

usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Portafolio (dowar-blog) setup script for Laravel backend and Ionic/Vue frontend.

Options:
  --dev               Development mode (configures backend/.env and
                      frontend/.env.development)
  --non-interactive   Non-interactive mode (requires PORTFOLIO_* env vars)
  --no-backup         Skip backups of existing files
  --skip-front-build  Skip the frontend build step
  --advanced          Re-prompt all frontend vars (default copies shared ones
                      from the backend env and only asks VITE_SSO_FRONTEND_URL)
  --help              Show this help message and exit

Exit codes:
  0   Success
  2   Missing prerequisite
  3   Missing required environment variable
  4   No TTY available (use --non-interactive) / DB connection error
  5   Database migration or seeding failed
  6   Write permission error
EOF
    exit 0
}

while [ $# -gt 0 ]; do
    case "$1" in
        --dev) DEV_MODE=true; shift ;;
        --non-interactive) NON_INTERACTIVE=true; shift ;;
        --no-backup) NO_BACKUP=true; shift ;;
        --skip-front-build) SKIP_FRONT_BUILD=true; shift ;;
        --advanced) ADVANCED_MODE=true; shift ;;
        --help) usage ;;
        *) log_error "Unknown option: $1"; usage; exit 2 ;;
    esac
done

error_handler() {
    local exit_code=$?
    log_error "Error on line $1 (exit code: $exit_code)"
    exit "$exit_code"
}
trap 'error_handler $LINENO' ERR

# -----------------------------------------------------------------------------
# Banner & prerequisites
# -----------------------------------------------------------------------------

banner() {
    echo ""
    echo "  +------------------------------------------+"
    echo "  |   Portafolio (dowar-blog) Setup          |"
    echo "  +------------------------------------------+"
    echo ""
}

check_prereqs() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Checking prerequisites..."

    require_cmd php "Install PHP 8.2+ (e.g., apt install php8.2-cli php8.2-mbstring php8.2-xml php8.2-curl php8.2-sqlite3)"
    require_cmd composer "Install Composer (https://getcomposer.org)"

    local php_ver
    php_ver="$(php -v | head -1 | sed -E 's/^PHP[[:space:]]+//; s/[[:space:]].*//')"
    if ! echo "$php_ver" | grep -qE '^[0-9]+\.[0-9]+'; then
        log_warn "Could not determine PHP version, assuming compatible"
    else
        local min_ver="8.2.0"
        if ! printf '%s\n' "$php_ver" "$min_ver" | sort -V | head -1 | grep -qF "$min_ver"; then
            log_error "PHP 8.2+ required, found $php_ver"
            exit 2
        fi
        log_ok "PHP $php_ver"
    fi

    # PHP extensions required by Laravel (+ SQLite default / MySQL in prod)
    local missing_ext=()
    for ext in pdo pdo_sqlite mbstring xml curl fileinfo; do
        if ! php -m 2>/dev/null | grep -qi "^$ext$"; then
            missing_ext+=("$ext")
        fi
    done
    if [ ${#missing_ext[@]} -gt 0 ]; then
        log_warn "Missing PHP extensions: ${missing_ext[*]}"
        log_warn "Install them (e.g., apt install php8.2-sqlite3 php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl)"
    else
        log_ok "Required PHP extensions present"
    fi

    if command -v node >/dev/null 2>&1; then
        HAS_NODE=true
        log_ok "Node.js found"
    else
        HAS_NODE=false
        log_warn "Node.js not found - frontend build will be skipped"
    fi

    if command -v pnpm >/dev/null 2>&1; then
        HAS_PNPM=true
        log_ok "pnpm found"
    else
        HAS_PNPM=false
        log_warn "pnpm not found - frontend build will be skipped (install: npm i -g pnpm | corepack enable)"
    fi

    HOSTING_ENV="$(detect_hosting)"
    log_info "Hosting environment detected: $HOSTING_ENV"

    log_ok "Prerequisites met"
}

# -----------------------------------------------------------------------------
# Backend configuration
# -----------------------------------------------------------------------------

configure_backend() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Configuring backend..."

    cd "$BACK_DIR"

    if [ "$DEV_MODE" = true ]; then
        BACKEND_ENV_FILE=".env"
    else
        # Production writes backend/.env, not .env.production. Laravel loads
        # .env unconditionally; .env.production is only read when the hosting
        # defines APP_ENV=production as a real process environment variable,
        # which shared hosting does not guarantee. The production values still
        # come from .env.production.example, and artisan commands keep
        # --env=production (it falls back to .env when .env.production does
        # not exist).
        BACKEND_ENV_FILE=".env"
    fi

    local example_file
    if [ "$DEV_MODE" = true ]; then
        example_file=".env.example"
    else
        example_file=".env.production.example"
    fi

    if [ ! -f "$example_file" ]; then
        log_error "Example file not found: $example_file"
        cat <<EOF

  The backend template ($example_file) is missing in this directory.

  It lives in the repository (committed) but the deploy excludes it from the
  backend tarball. Fix: re-deploy with the corrected deploy.conf, or copy it:

      scp backend/$example_file user@server:$BACK_DIR/$example_file

  (setup.sh must run from the app root where backend/ and frontend/ live)
EOF
        exit 6
    fi

    # Preserve existing values so a re-run after a mid-way failure doesn't
    # force the user to re-enter everything: previous values become defaults.
    # All are pre-initialized to empty: with sqlite the DB vars are optional,
    # so `${PORTFOLIO_DB_HOST:-$prev_db_host}` would otherwise expand an
    # unset variable under `set -u`.
    local prev_app_name="" prev_app_url="" prev_frontend_url=""
    local prev_db_connection="" prev_db_host="" prev_db_port="" prev_db_database="" prev_db_username="" prev_db_password=""
    local prev_mail_mailer="" prev_mail_host="" prev_mail_port="" prev_mail_username="" prev_mail_password="" prev_mail_encryption="" prev_mail_from_address=""
    local prev_sso_url="" prev_sso_jwt_issuer="" prev_sso_client_id="" prev_sso_client_secret=""
    if [ -f "$BACKEND_ENV_FILE" ]; then
        prev_app_name="$(unquote_env_val "$(get_env_default APP_NAME "$BACKEND_ENV_FILE")")"
        prev_app_url="$(unquote_env_val "$(get_env_default APP_URL "$BACKEND_ENV_FILE")")"
        prev_frontend_url="$(unquote_env_val "$(get_env_default FRONTEND_URL "$BACKEND_ENV_FILE")")"
        prev_db_connection="$(unquote_env_val "$(get_env_default DB_CONNECTION "$BACKEND_ENV_FILE")")"
        prev_db_host="$(unquote_env_val "$(get_env_default DB_HOST "$BACKEND_ENV_FILE")")"
        prev_db_port="$(unquote_env_val "$(get_env_default DB_PORT "$BACKEND_ENV_FILE")")"
        prev_db_database="$(unquote_env_val "$(get_env_default DB_DATABASE "$BACKEND_ENV_FILE")")"
        prev_db_username="$(unquote_env_val "$(get_env_default DB_USERNAME "$BACKEND_ENV_FILE")")"
        prev_db_password="$(unquote_env_val "$(get_env_default DB_PASSWORD "$BACKEND_ENV_FILE")")"
        prev_mail_mailer="$(unquote_env_val "$(get_env_default MAIL_MAILER "$BACKEND_ENV_FILE")")"
        prev_mail_host="$(unquote_env_val "$(get_env_default MAIL_HOST "$BACKEND_ENV_FILE")")"
        prev_mail_port="$(unquote_env_val "$(get_env_default MAIL_PORT "$BACKEND_ENV_FILE")")"
        prev_mail_username="$(unquote_env_val "$(get_env_default MAIL_USERNAME "$BACKEND_ENV_FILE")")"
        prev_mail_password="$(unquote_env_val "$(get_env_default MAIL_PASSWORD "$BACKEND_ENV_FILE")")"
        prev_mail_encryption="$(unquote_env_val "$(get_env_default MAIL_ENCRYPTION "$BACKEND_ENV_FILE")")"
        prev_mail_from_address="$(unquote_env_val "$(get_env_default MAIL_FROM_ADDRESS "$BACKEND_ENV_FILE")")"
        prev_sso_url="$(unquote_env_val "$(get_env_default SSO_URL "$BACKEND_ENV_FILE")")"
        prev_sso_jwt_issuer="$(unquote_env_val "$(get_env_default SSO_JWT_ISSUER "$BACKEND_ENV_FILE")")"
        prev_sso_client_id="$(unquote_env_val "$(get_env_default SSO_CLIENT_ID "$BACKEND_ENV_FILE")")"
        prev_sso_client_secret="$(unquote_env_val "$(get_env_default SSO_CLIENT_SECRET "$BACKEND_ENV_FILE")")"
    fi

    # If the existing env file already authenticates against the database,
    # trust it: do not re-prompt and do not sed_set over a value the user may
    # have updated by hand. This avoids the trap where a stale prev_db_password
    # snapshot got accepted by the user pressing Enter and silently overwrote
    # a freshly-rotated password.
    db_already_ok=false
    if [ -f "$BACKEND_ENV_FILE" ]; then
        local db_check
        db_check="$(check_db_connection "$BACKEND_ENV_FILE")"
        if [[ "$db_check" == OK* ]]; then
            db_already_ok=true
            log_info "Existing backend/.env DB credentials verified — will not overwrite"
        fi
    fi

    backup_file "$BACKEND_ENV_FILE"
    if [ ! -f "$BACKEND_ENV_FILE" ]; then
        cp "$example_file" "$BACKEND_ENV_FILE"
    fi

    local app_name app_url frontend_url
    local db_connection db_host db_port db_database db_username db_password
    local mail_mailer mail_host mail_port mail_username mail_password mail_encryption mail_from_address
    local sso_url sso_jwt_issuer sso_client_id sso_client_secret

    if [ "$NON_INTERACTIVE" = true ]; then
        # PORTFOLIO_* env vars are the source of truth. Required: SSO client
        # credentials (the app cannot boot without an SSO server) and, unless
        # the connection is sqlite, the DB connection basics.
        local missing=false
        for var in PORTFOLIO_SSO_URL PORTFOLIO_SSO_CLIENT_ID; do
            if [ -z "${!var:-}" ]; then
                log_error "Missing required env var: $var"
                missing=true
            fi
        done
        if [ "$DEV_MODE" = false ]; then
            if [ -z "${PORTFOLIO_SSO_CLIENT_SECRET:-}" ]; then
                log_error "Missing required env var: PORTFOLIO_SSO_CLIENT_SECRET"
                missing=true
            fi
        fi
        db_connection="${PORTFOLIO_DB_CONNECTION:-${prev_db_connection:-$(get_env_default DB_CONNECTION "$example_file")}}"
        db_connection="${db_connection:-sqlite}"  # dev .env.example has no DB_CONNECTION line
        if [[ "$db_connection" != "sqlite" ]]; then
            for var in PORTFOLIO_DB_HOST PORTFOLIO_DB_PORT PORTFOLIO_DB_DATABASE PORTFOLIO_DB_USERNAME; do
                if [ -z "${!var:-}" ]; then
                    log_error "Missing required env var: $var (or set PORTFOLIO_DB_CONNECTION=sqlite)"
                    missing=true
                fi
            done
        fi
        if [ "$missing" = true ]; then
            exit 3
        fi

        app_url="$(normalize_url "${PORTFOLIO_APP_URL:-${prev_app_url:-$(get_env_default APP_URL "$example_file")}}")" \
            || app_url="$(normalize_url "${PORTFOLIO_APP_URL:-http://localhost:8000}")"
        frontend_url="$(normalize_url "${PORTFOLIO_FRONTEND_URL:-${prev_frontend_url:-$(get_env_default FRONTEND_URL "$example_file")}}")" \
            || frontend_url="$(normalize_url "${PORTFOLIO_FRONTEND_URL:-http://localhost:8100}")"
        app_name="${PORTFOLIO_APP_NAME:-${prev_app_name:-$(get_env_default APP_NAME "$example_file" | tr -d '"')}}"
        db_host="${PORTFOLIO_DB_HOST:-$prev_db_host}"
        db_port="${PORTFOLIO_DB_PORT:-$prev_db_port}"
        db_database="${PORTFOLIO_DB_DATABASE:-$prev_db_database}"
        db_username="${PORTFOLIO_DB_USERNAME:-$prev_db_username}"
        if [ -n "${PORTFOLIO_DB_PASSWORD:-}" ]; then
            db_password="${PORTFOLIO_DB_PASSWORD}"
        elif [ "$db_already_ok" = true ]; then
            # Respect existing .env password if it already authenticates and
            # the caller didn't explicitly provide a new one via PORTFOLIO_DB_PASSWORD.
            db_password="${prev_db_password}"
        else
            db_password="${prev_db_password}"
        fi
        mail_mailer="${PORTFOLIO_MAIL_MAILER:-$(get_env_default MAIL_MAILER "$example_file")}"
        mail_host="${PORTFOLIO_MAIL_HOST:-$prev_mail_host}"
        mail_port="${PORTFOLIO_MAIL_PORT:-$(get_env_default MAIL_PORT "$example_file")}"
        mail_username="${PORTFOLIO_MAIL_USERNAME:-$prev_mail_username}"
        mail_password="${PORTFOLIO_MAIL_PASSWORD:-$prev_mail_password}"
        mail_encryption="${PORTFOLIO_MAIL_ENCRYPTION:-$(get_env_default MAIL_ENCRYPTION "$example_file")}"
        mail_from_address="${PORTFOLIO_MAIL_FROM_ADDRESS:-$prev_mail_from_address}"
        sso_url="${PORTFOLIO_SSO_URL:-$prev_sso_url}"
        sso_jwt_issuer="${PORTFOLIO_SSO_JWT_ISSUER:-${prev_sso_jwt_issuer:-$(get_env_default SSO_JWT_ISSUER "$example_file")}}"
        sso_client_id="${PORTFOLIO_SSO_CLIENT_ID:-$prev_sso_client_id}"
        sso_client_secret="${PORTFOLIO_SSO_CLIENT_SECRET:-$prev_sso_client_secret}"
    else
        local default_app_name default_app_url default_frontend_url
        default_app_name="${prev_app_name:-$(get_env_default APP_NAME "$example_file" | tr -d '"' || echo "Portafolio")}"
        default_app_url="${prev_app_url:-$(grep -E "^APP_URL=" "$example_file" | cut -d= -f2- || echo "http://localhost:8000")}"
        default_frontend_url="${prev_frontend_url:-$(grep -E "^FRONTEND_URL=" "$example_file" | cut -d= -f2- || echo "http://localhost:8100")}"

        app_name="$(ask "App name" "$default_app_name")"
        # Persist immediately so a cancelled/failed run keeps answered values.
        sed_set "$BACKEND_ENV_FILE" "APP_NAME" "$app_name"
        while :; do
            app_url="$(ask "App URL (backend)" "$default_app_url")"
            app_url="$(normalize_url "$app_url")" && break
            log_error "URL cannot be empty. Enter something like http://localhost:8000 or https://api.yourdomain.com"
        done
        sed_set "$BACKEND_ENV_FILE" "APP_URL" "$app_url"
        while :; do
            frontend_url="$(ask "Frontend URL" "$default_frontend_url")"
            frontend_url="$(normalize_url "$frontend_url")" && break
            log_error "URL cannot be empty. Enter something like http://localhost:8100"
        done
        sed_set "$BACKEND_ENV_FILE" "FRONTEND_URL" "$frontend_url"

        db_connection="$(ask "DB connection" "${prev_db_connection:-$(get_env_default DB_CONNECTION "$example_file")}")"
        db_connection="${db_connection:-sqlite}"  # dev .env.example has no DB_CONNECTION line
        sed_set "$BACKEND_ENV_FILE" "DB_CONNECTION" "$db_connection"
        if [[ "$db_connection" == "sqlite" ]]; then
            db_host=""
            db_port=""
            db_database=""
            db_username=""
            db_password=""
        else
            if [ "$db_already_ok" = false ]; then
                db_host="$(ask "DB host" "${prev_db_host:-${DB_HOST:-127.0.0.1}}")"
                sed_set "$BACKEND_ENV_FILE" "DB_HOST" "$db_host"
                db_port="$(ask "DB port" "${prev_db_port:-${DB_PORT:-3306}}")"
                sed_set "$BACKEND_ENV_FILE" "DB_PORT" "$db_port"
                db_database="$(ask "DB database" "${prev_db_database:-${DB_DATABASE:-portafolio_backend}}")"
                sed_set "$BACKEND_ENV_FILE" "DB_DATABASE" "$db_database"
                db_username="$(ask "DB username" "${prev_db_username:-${DB_USERNAME:-root}}")"
                sed_set "$BACKEND_ENV_FILE" "DB_USERNAME" "$db_username"
                db_password="$(ask_secret "DB password" "${prev_db_password:-${DB_PASSWORD:-}}")"
                sed_set "$BACKEND_ENV_FILE" "DB_PASSWORD" "$db_password"
            else
                log_info "Skipping DB prompts — existing credentials verified"
                db_host="${prev_db_host}"
                db_port="${prev_db_port}"
                db_database="${prev_db_database}"
                db_username="${prev_db_username}"
                db_password="${prev_db_password}"
            fi
        fi

        mail_mailer="$(get_env_default MAIL_MAILER "$example_file")"
        mail_port="$(get_env_default MAIL_PORT "$example_file")"
        local default_mail_host default_mail_username default_mail_password default_mail_encryption
        default_mail_host="${prev_mail_host:-${MAIL_HOST:-$(get_env_default MAIL_HOST "$example_file")}}"
        default_mail_username="${prev_mail_username:-${MAIL_USERNAME:-$(get_env_default MAIL_USERNAME "$example_file")}}"
        default_mail_password="${prev_mail_password:-${MAIL_PASSWORD:-$(get_env_default MAIL_PASSWORD "$example_file")}}"
        default_mail_encryption="${prev_mail_encryption:-${MAIL_ENCRYPTION:-$(get_env_default MAIL_ENCRYPTION "$example_file")}}"

        if [ "$mail_mailer" = "smtp" ]; then
            mail_host="$(ask "Mail host" "$default_mail_host")"
            sed_set "$BACKEND_ENV_FILE" "MAIL_HOST" "$mail_host"
            mail_username="$(ask "Mail username" "$default_mail_username")"
            sed_set "$BACKEND_ENV_FILE" "MAIL_USERNAME" "$mail_username"
            mail_password="$(ask_secret "Mail password" "$default_mail_password")"
            sed_set "$BACKEND_ENV_FILE" "MAIL_PASSWORD" "$mail_password"
            mail_encryption="$(ask "Mail encryption" "$default_mail_encryption")"
            sed_set "$BACKEND_ENV_FILE" "MAIL_ENCRYPTION" "$mail_encryption"
        else
            mail_host="$default_mail_host"
            mail_username="$default_mail_username"
            mail_password="$default_mail_password"
            mail_encryption="$default_mail_encryption"
        fi

        # Persist immediately so a cancelled/failed run keeps answered values.
        sed_set "$BACKEND_ENV_FILE" "MAIL_MAILER" "$mail_mailer"
        sed_set "$BACKEND_ENV_FILE" "MAIL_HOST" "$mail_host"
        sed_set "$BACKEND_ENV_FILE" "MAIL_PORT" "$mail_port"
        sed_set "$BACKEND_ENV_FILE" "MAIL_USERNAME" "$mail_username"
        sed_set "$BACKEND_ENV_FILE" "MAIL_PASSWORD" "$mail_password"
        sed_set "$BACKEND_ENV_FILE" "MAIL_ENCRYPTION" "$mail_encryption"

        # SSO (external authentication server - this app is an SSO client)
        local default_sso_url default_sso_jwt default_sso_client_id
        default_sso_url="${prev_sso_url:-$(get_env_default SSO_URL "$example_file")}"
        default_sso_jwt="${prev_sso_jwt_issuer:-$(get_env_default SSO_JWT_ISSUER "$example_file")}"
        default_sso_client_id="${prev_sso_client_id:-$(get_env_default SSO_CLIENT_ID "$example_file")}"

        sso_url="$(ask "SSO Server URL (API)" "$default_sso_url")"
        sed_set "$BACKEND_ENV_FILE" "SSO_URL" "$sso_url"
        sso_jwt_issuer="$(ask "SSO JWT issuer" "$default_sso_jwt")"
        sed_set "$BACKEND_ENV_FILE" "SSO_JWT_ISSUER" "$sso_jwt_issuer"
        sso_client_id="$(ask "SSO client ID" "$default_sso_client_id")"
        sed_set "$BACKEND_ENV_FILE" "SSO_CLIENT_ID" "$sso_client_id"
        sso_client_secret="$(ask_secret "SSO client secret" "$prev_sso_client_secret")"
        sed_set "$BACKEND_ENV_FILE" "SSO_CLIENT_SECRET" "$sso_client_secret"
    fi

    local app_url_host
    app_url_host="$(echo "$app_url" | sed -E 's|^https?://([^/]+).*|\1|')"
    mail_from_address="${mail_from_address:-${prev_mail_from_address:-noreply@${app_url_host}}}"

    if [ "$DEV_MODE" = true ]; then
        mail_mailer="log"
    fi

    sed_set "$BACKEND_ENV_FILE" "APP_NAME" "$app_name"
    sed_set "$BACKEND_ENV_FILE" "APP_URL" "$app_url"
    sed_set "$BACKEND_ENV_FILE" "FRONTEND_URL" "$frontend_url"
    sed_set "$BACKEND_ENV_FILE" "DB_CONNECTION" "$db_connection"
    if [[ "$db_connection" != "sqlite" ]]; then
        sed_set "$BACKEND_ENV_FILE" "DB_HOST" "$db_host"
        sed_set "$BACKEND_ENV_FILE" "DB_PORT" "$db_port"
        sed_set "$BACKEND_ENV_FILE" "DB_DATABASE" "$db_database"
        sed_set "$BACKEND_ENV_FILE" "DB_USERNAME" "$db_username"
        if [ "$db_already_ok" = false ]; then
            sed_set "$BACKEND_ENV_FILE" "DB_PASSWORD" "$db_password"
        else
            log_info "Skipping DB_PASSWORD overwrite — existing credentials verified"
        fi
    fi
    sed_set "$BACKEND_ENV_FILE" "MAIL_MAILER" "$mail_mailer"
    sed_set "$BACKEND_ENV_FILE" "MAIL_HOST" "$mail_host"
    sed_set "$BACKEND_ENV_FILE" "MAIL_PORT" "$mail_port"
    sed_set "$BACKEND_ENV_FILE" "MAIL_USERNAME" "$mail_username"
    sed_set "$BACKEND_ENV_FILE" "MAIL_PASSWORD" "$mail_password"
    sed_set "$BACKEND_ENV_FILE" "MAIL_ENCRYPTION" "$mail_encryption"
    sed_set "$BACKEND_ENV_FILE" "MAIL_FROM_ADDRESS" "$mail_from_address"
    sed_set "$BACKEND_ENV_FILE" "SSO_URL" "$sso_url"
    sed_set "$BACKEND_ENV_FILE" "SSO_JWT_ISSUER" "$sso_jwt_issuer"
    sed_set "$BACKEND_ENV_FILE" "SSO_CLIENT_ID" "$sso_client_id"
    sed_set "$BACKEND_ENV_FILE" "SSO_CLIENT_SECRET" "$sso_client_secret"

    # Verify DB connection (supports sqlite + mysql/mariadb drivers)
    local db_check db_check_msg
    db_check="$(check_db_connection "$BACKEND_ENV_FILE")"
    db_check_msg="${db_check#FAIL:}"
    case "$db_check" in
        "OK"*)
            log_ok "DB connection verified"
            ;;
        "FAIL:")
            log_error "Could not verify DB connection"
            exit 4
            ;;
        *"Access denied"*)
            log_error "DB access denied - wrong DB_USERNAME or DB_PASSWORD"
            exit 4
            ;;
        *"Connection refused"*|*"not reachable"*|*"No such file"*|*"Host"*)
            log_error "DB host $db_host:$db_port not reachable - is the database server running?"
            exit 4
            ;;
        *"Unknown database"*)
            log_error "DB database '$db_database' does not exist. Create it first:"
            log_error "  sudo mariadb -e \"CREATE DATABASE $db_database;\""
            log_error "  sudo mariadb -e \"GRANT ALL ON ${db_database}.* TO '${db_username}'@'localhost' IDENTIFIED BY 'password';\""
            exit 4
            ;;
        *"Driver"*)
            log_error "$db_check_msg"
            log_error "This script supports sqlite, mysql and mariadb. Set DB_CONNECTION accordingly."
            exit 4
            ;;
        *)
            log_error "DB connection failed: $db_check_msg"
            exit 4
            ;;
    esac

    log_ok "Backend configured ($BACKEND_ENV_FILE)"
    cd "$SCRIPT_DIR"
}

# -----------------------------------------------------------------------------
# APP_KEY, SSO verification, migrations, seeders
# -----------------------------------------------------------------------------

generate_app_key() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Generating app key..."

    cd "$BACK_DIR"

    # .env.example (dev) has an empty APP_KEY= line; .env.production.example
    # ships a 'your_app_key_here' placeholder. Either way key:generate writes
    # a fresh key, but only if the line exists.
    if ! grep -qE "^APP_KEY=" "$BACKEND_ENV_FILE" 2>/dev/null; then
        echo "APP_KEY=" >> "$BACKEND_ENV_FILE"
        log_info "Added empty APP_KEY= line to $BACKEND_ENV_FILE"
    fi

    # Protected: only generate when there is no real (base64) key yet.
    if grep -qE "^APP_KEY=base64:" "$BACKEND_ENV_FILE" 2>/dev/null; then
        log_ok "APP_KEY already set in $BACKEND_ENV_FILE, skipping"
    else
        # shellcheck disable=SC2086
        php artisan key:generate --force $APP_ENV_ARG 2>&1 || true
        if grep -qE "^APP_KEY=base64:" "$BACKEND_ENV_FILE" 2>/dev/null; then
            log_ok "APP_KEY generated in $BACKEND_ENV_FILE"
        else
            log_error "APP_KEY generation failed (no key in $BACKEND_ENV_FILE)"
            exit 5
        fi
    fi
    cd "$SCRIPT_DIR"
}

configure_sso() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Verifying SSO configuration..."

    cd "$BACK_DIR"
    local sso_url_val sso_secret_val sso_client_id_val
    sso_url_val="$(get_env_default SSO_URL "$BACKEND_ENV_FILE" | tr -d '"')"
    sso_secret_val="$(get_env_default SSO_CLIENT_SECRET "$BACKEND_ENV_FILE" | tr -d '"')"
    sso_client_id_val="$(get_env_default SSO_CLIENT_ID "$BACKEND_ENV_FILE" | tr -d '"')"

    if [ -z "$sso_url_val" ]; then
        log_error "SSO_URL is empty - external auth server is required"
        exit 4
    fi
    if [ -z "$sso_client_id_val" ]; then
        log_error "SSO_CLIENT_ID is empty - the SSO client needs a registered client ID"
        exit 4
    fi
    if [ -z "$sso_secret_val" ]; then
        log_warn "SSO_CLIENT_SECRET is empty - set it if the SSO server requires it"
    fi

    # Best-effort reachability check (non-fatal)
    if command -v curl >/dev/null 2>&1; then
        if curl -sf -o /dev/null --max-time 5 "${sso_url_val}/.well-known/jwks" 2>/dev/null; then
            log_ok "SSO JWKS endpoint reachable"
        else
            log_warn "SSO JWKS endpoint unreachable at ${sso_url_val}/.well-known/jwks"
            log_warn "The SSO server may be down, behind a firewall, or the URL is wrong."
        fi
    else
        log_info "curl not available, skipping SSO reachability check"
    fi

    log_ok "SSO configuration verified"
    cd "$SCRIPT_DIR"
}

migrate_db() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Running database migrations..."

    cd "$BACK_DIR"
    # shellcheck disable=SC2086
    php artisan migrate --force $APP_ENV_ARG || { log_error "Migration failed"; exit 5; }
    log_ok "Database migrated"
    cd "$SCRIPT_DIR"
}

seed_db() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Seeding database..."

    cd "$BACK_DIR"

    # portafolio only has DatabaseSeeder (RolePermissionSeeder + PostSeeder).
    # Check whether any user exists to avoid duplicating seed data. Use a
    # numeric-only regex so tinker warnings/stack traces don't fool us.
    local user_count=0
    local count_unknown=false
    local tinker_out
    # shellcheck disable=SC2086
    tinker_out="$(php artisan tinker --execute="echo App\\Models\\User::count();" $APP_ENV_ARG 2>/dev/null || true)"
    tinker_out="${tinker_out##*$'\n'}"   # take last line (tinker sometimes prints banners)
    if [[ "$tinker_out" =~ ^[0-9]+$ ]]; then
        user_count="$tinker_out"
    else
        log_warn "Could not determine user count (tinker output: '${tinker_out:-<empty>}')"
        count_unknown=true
        user_count="0"
    fi

    if [ "$user_count" -gt 0 ]; then
        log_info "Found $user_count existing user(s) - database already seeded"
        log_info "Seeding skipped"
    else
        if [ "$NON_INTERACTIVE" = true ]; then
            if [ "$count_unknown" = true ]; then
                log_error "Cannot determine DB state in non-interactive mode (tinker failed)"
                log_error "Run interactively, or fix the tinker error first, then rerun setup"
                exit 5
            fi
            # shellcheck disable=SC2086
            php artisan db:seed --force $APP_ENV_ARG || { log_error "db:seed failed"; exit 5; }
            log_ok "Database seeded"
        elif confirm "Seed database with sample data?" "Y"; then
            # shellcheck disable=SC2086
            php artisan db:seed --force $APP_ENV_ARG || { log_error "db:seed failed"; exit 5; }
            log_ok "Database seeded"
        else
            log_info "Seeding skipped"
        fi
    fi

    cd "$SCRIPT_DIR"
}

# -----------------------------------------------------------------------------
# Frontend configuration & build
# -----------------------------------------------------------------------------

configure_frontend() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Configuring frontend..."

    cd "$FRONT_DIR"

    local example_file target_file
    if [ "$DEV_MODE" = true ]; then
        example_file=".env.development.example"
        target_file=".env.development"
    else
        example_file=".env.production.example"
        target_file=".env.production"
    fi

    if [ ! -f "$example_file" ]; then
        log_warn "Frontend example file not found: $example_file, trying .env.example"
        if [ -f ".env.example" ]; then
            example_file=".env.example"
        else
            log_error "No frontend .env example found"
            cd "$SCRIPT_DIR"
            return
        fi
    fi

    # Verify the frontend env file is configured. The Vite build bakes these
    # values into the bundle at compile time, so deploying without the file
    # configured (or with example placeholders) breaks the app in production.
    if [ ! -f "$target_file" ]; then
        log_warn "Frontend env file not found: $target_file"
        log_warn "You must configure it: copy $example_file to $target_file and set the real URLs (VITE_API_URL, etc.) before building."
        if [ "$DEV_MODE" = true ]; then
            log_info "Development mode: creating $target_file from the example template. You can adjust the values afterwards."
        else
            log_error "Production mode requires a configured $target_file. Create it from $example_file with the real production URLs, then re-run the script."
            cd "$SCRIPT_DIR"
            return 1
        fi
    fi

    backup_file "$target_file"

    # Capture existing frontend .env values BEFORE overwriting with the example.
    # VITE_SSO_FRONTEND_URL cannot be derived from the backend env (SSO backend
    # port != SSO frontend Vite port); the only safe default is a previously
    # correct value in the user's .env, an env var, or the example file.
    local prev_api_url="" prev_sso_url="" prev_sso_fe_url="" prev_sso_client_id=""
    if [ -f "$target_file" ]; then
        prev_api_url="$(grep -E "^VITE_API_URL=" "$target_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
        prev_sso_url="$(grep -E "^VITE_SSO_URL=" "$target_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
        prev_sso_fe_url="$(grep -E "^VITE_SSO_FRONTEND_URL=" "$target_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
        prev_sso_client_id="$(grep -E "^VITE_SSO_CLIENT_ID=" "$target_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    fi

    if [ ! -f "$target_file" ]; then
        cp "$example_file" "$target_file"
    fi

    # Example placeholder values for this env file (e.g. api.miapp.com). If the
    # user just copied the example unedited, their "previous value" IS the
    # placeholder - preserving it would ship a broken URL. Only preserve a
    # previous value that differs from the example placeholder.
    local example_api_url example_sso_url example_sso_fe example_sso_client_id
    example_api_url="$(grep -E "^VITE_API_URL=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    example_sso_url="$(grep -E "^VITE_SSO_URL=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    example_sso_fe="$(grep -E "^VITE_SSO_FRONTEND_URL=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    example_sso_client_id="$(grep -E "^VITE_SSO_CLIENT_ID=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    [ "$prev_api_url" = "$example_api_url" ] && prev_api_url=""
    [ "$prev_sso_url" = "$example_sso_url" ] && prev_sso_url=""
    [ "$prev_sso_fe_url" = "$example_sso_fe" ] && prev_sso_fe_url=""
    [ "$prev_sso_client_id" = "$example_sso_client_id" ] && prev_sso_client_id=""

    local backend_url default_api_url
    backend_url="$(grep -E "^APP_URL=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    if [ -z "$backend_url" ]; then
        # Backend env not fully populated yet (mid-way run): fall back to the
        # frontend example (which already carries the /api/ suffix).
        default_api_url="${prev_api_url:-$(grep -E "^VITE_API_URL=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "http://localhost:8000/api/")}"
    else
        default_api_url="${prev_api_url:-${backend_url}/api/}"
    fi

    # Shared values copied from the backend env (same value, VITE_ prefix for Vite).
    # Fall back to the frontend example file when the backend env is not yet
    # fully populated (e.g. a mid-way run).
    local default_sso_url default_sso_client_id default_sso_fe
    default_sso_url="$(grep -E "^SSO_URL=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    if [ -z "$default_sso_url" ]; then
        default_sso_url="$(grep -E "^VITE_SSO_URL=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    fi
    default_sso_client_id="$(grep -E "^SSO_CLIENT_ID=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    if [ -z "$default_sso_client_id" ]; then
        default_sso_client_id="$(grep -E "^VITE_SSO_CLIENT_ID=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "main-app")"
    fi

    # Prefer preserved value; fall back to env var override, then example file.
    default_sso_fe="${PORTFOLIO_VITE_SSO_FRONTEND_URL:-}"
    if [ -z "$default_sso_fe" ]; then
        default_sso_fe="$prev_sso_fe_url"
    fi
    if [ -z "$default_sso_fe" ]; then
        default_sso_fe="$(grep -E "^VITE_SSO_FRONTEND_URL=" "$example_file" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "")"
    fi

    local api_url sso_url_fe sso_frontend_url sso_client_id_fe

    if [ "$ADVANCED_MODE" = true ] || [ "$NON_INTERACTIVE" = true ]; then
        if [ "$ADVANCED_MODE" = true ]; then
            log_info "Advanced mode: prompting all frontend vars"
        fi
        # Advanced: prompt all frontend vars (lets the user pick values that
        # differ from the backend, e.g. CDN/proxy scenarios). In non-interactive
        # mode ask() echoes the PORTFOLIO_VITE_* override or the default.
        api_url="$(ask "VITE_API_URL" "${PORTFOLIO_VITE_API_URL:-$default_api_url}")"
        api_url="$(normalize_url "$api_url" false)"
        sso_url_fe="$(ask "VITE_SSO_URL (API)" "${PORTFOLIO_VITE_SSO_URL:-$default_sso_url}")"
        sso_url_fe="$(normalize_url "$sso_url_fe" false)"
        sso_client_id_fe="$(ask "VITE_SSO_CLIENT_ID" "${PORTFOLIO_VITE_SSO_CLIENT_ID:-$default_sso_client_id}")"
    else
        # Simplified: copy the 3 vars shared with the backend silently.
        # Only VITE_SSO_FRONTEND_URL is frontend-only and needs prompting.
        log_info "Copying shared vars from backend env:"
        log_info "  VITE_API_URL        = $default_api_url"
        log_info "  VITE_SSO_URL       = $default_sso_url"
        log_info "  VITE_SSO_CLIENT_ID = $default_sso_client_id"
        api_url="$default_api_url"
        sso_url_fe="$default_sso_url"
        sso_client_id_fe="$default_sso_client_id"
    fi

    # Persist immediately so a cancelled/failed run keeps answered values.
    sed_set "$target_file" "VITE_API_URL" "$api_url"
    sed_set "$target_file" "VITE_SSO_URL" "$sso_url_fe"
    sed_set "$target_file" "VITE_SSO_CLIENT_ID" "$sso_client_id_fe"

    sso_frontend_url="$(ask "VITE_SSO_FRONTEND_URL (SSO UI login, e.g. http://localhost:8101)" "$default_sso_fe")"
    if [ -z "$sso_frontend_url" ]; then
        log_warn "VITE_SSO_FRONTEND_URL is required (cannot be derived from SSO_URL)"
        while [ -z "$sso_frontend_url" ]; do
            if [ "$NON_INTERACTIVE" = true ]; then
                log_error "VITE_SSO_FRONTEND_URL is required in non-interactive mode"
                log_error "Set PORTFOLIO_VITE_SSO_FRONTEND_URL in the environment or run without --non-interactive"
                exit 3
            fi
            sso_frontend_url="$(ask "VITE_SSO_FRONTEND_URL (SSO UI login, e.g. http://localhost:8101)" "")"
        done
    fi
    sso_frontend_url="$(normalize_url "$sso_frontend_url" false)"

    # Persist immediately so a cancelled/failed run keeps answered values.
    sed_set "$target_file" "VITE_SSO_FRONTEND_URL" "$sso_frontend_url"

    sed_set "$target_file" "VITE_API_URL" "$api_url"
    sed_set "$target_file" "VITE_SSO_URL" "$sso_url_fe"
    sed_set "$target_file" "VITE_SSO_FRONTEND_URL" "$sso_frontend_url"
    sed_set "$target_file" "VITE_SSO_CLIENT_ID" "$sso_client_id_fe"

    log_ok "Frontend configured ($target_file)"
    cd "$SCRIPT_DIR"
}

build_frontend() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Building frontend..."

    if [ "$HOSTING_ENV" = "shared" ]; then
        SKIP_FRONT_BUILD=true
        cat <<EOF

  !!! Frontend build skipped: shared hosting detected.

  Build the frontend on a development machine and upload the dist/ directory:

      cd frontend
      pnpm install
      pnpm run build

  Then upload frontend/dist/ contents to your hosting public directory.
EOF
        log_info "Frontend build skipped (shared hosting)"
        return
    fi

    if [ "$HAS_NODE" = false ] || [ "$HAS_PNPM" = false ]; then
        SKIP_FRONT_BUILD=true
        cat <<EOF

  !!! Frontend build skipped: Node.js/pnpm not available.

  To build the frontend manually on a development machine:

      cd frontend
      pnpm install
      pnpm run build

  Then upload frontend/dist/ contents to your hosting public directory.

  To install pnpm on this machine: npm i -g pnpm  (or: corepack enable)
EOF
        log_info "Frontend build skipped (no Node.js/pnpm)"
        return
    fi

    cd "$FRONT_DIR"
    if [ ! -d "node_modules" ]; then
        log_info "Installing frontend dependencies..."
        pnpm install || { log_warn "pnpm install failed"; SKIP_FRONT_BUILD=true; cd "$SCRIPT_DIR"; return; }
    fi

    log_info "Building frontend..."
    if pnpm run build; then
        log_ok "Frontend built successfully"
    else
        SKIP_FRONT_BUILD=true
        log_warn "Frontend build failed"
    fi
    cd "$SCRIPT_DIR"
}

# -----------------------------------------------------------------------------
# Health checks
# -----------------------------------------------------------------------------

healthcheck() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    log_info "Step $CURRENT_STEP: Running health checks..."

    cd "$BACK_DIR"

    local all_ok=true
    HEALTH_RESULTS=()

    # DB connection
    local check_result
    check_result="$(check_db_connection "$BACKEND_ENV_FILE")"
    if echo "$check_result" | grep -q "^OK"; then
        HEALTH_RESULTS+=("PASS|DB connection")
    else
        HEALTH_RESULTS+=("FAIL|DB connection: $check_result")
        all_ok=false
    fi

    # APP_KEY present
    if grep -qE "^APP_KEY=base64:" "$BACKEND_ENV_FILE" 2>/dev/null; then
        HEALTH_RESULTS+=("PASS|APP_KEY set")
    else
        HEALTH_RESULTS+=("FAIL|APP_KEY missing")
        all_ok=false
    fi

    # SSO_URL set
    if grep -qE "^SSO_URL=.+" "$BACKEND_ENV_FILE" 2>/dev/null; then
        HEALTH_RESULTS+=("PASS|SSO_URL configured")
    else
        HEALTH_RESULTS+=("FAIL|SSO_URL missing")
        all_ok=false
    fi

    # SSO_CLIENT_SECRET set (warning only - dev SSO may allow empty)
    if grep -qE "^SSO_CLIENT_SECRET=.+" "$BACKEND_ENV_FILE" 2>/dev/null; then
        HEALTH_RESULTS+=("PASS|SSO_CLIENT_SECRET set")
    else
        HEALTH_RESULTS+=("WARN|SSO_CLIENT_SECRET empty (check if your SSO server requires it)")
    fi

    # Pending migrations
    # shellcheck disable=SC2086
    if { php artisan migrate:status --no-ansi $APP_ENV_ARG 2>&1 || true; } | grep -q "Pending"; then
        HEALTH_RESULTS+=("FAIL|Pending migrations detected")
        all_ok=false
    else
        HEALTH_RESULTS+=("PASS|All migrations applied")
    fi

    # Storage permissions (writable by web server)
    local storage_ok=true
    for d in storage storage/framework storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache; do
        if [ -d "$d" ] && [ ! -w "$d" ]; then
            storage_ok=false
            HEALTH_RESULTS+=("FAIL|$d not writable")
        fi
    done
    if [ "$storage_ok" = true ]; then
        HEALTH_RESULTS+=("PASS|Storage directories writable")
    else
        all_ok=false
    fi

    # Config cache (informational)
    # shellcheck disable=SC2086
    if php artisan config:clear $APP_ENV_ARG >/dev/null 2>&1; then
        HEALTH_RESULTS+=("PASS|Config cache cleared")
    else
        HEALTH_RESULTS+=("WARN|Config cache could not be cleared")
    fi

    HEALTH_OK=$all_ok
    cd "$SCRIPT_DIR"
}

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------

print_summary() {
    echo ""
    echo "  +------------------------------------------+"
    echo "  |   Portafolio (dowar-blog) Setup Complete |"
    echo "  +------------------------------------------+"
    echo ""

    echo "  Configuration"
    echo "    APP_URL:      $(grep -E "^APP_URL=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "N/A")"
    echo "    FRONTEND_URL: $(grep -E "^FRONTEND_URL=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "N/A")"
    echo "    SSO_URL:      $(grep -E "^SSO_URL=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' || echo "N/A")"
    echo "    DB:           $(grep -E "^DB_CONNECTION=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- || echo "N/A") $(grep -E "^DB_HOST=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- || echo "")/$(grep -E "^DB_DATABASE=" "$BACK_DIR/$BACKEND_ENV_FILE" 2>/dev/null | cut -d= -f2- || echo "")"
    echo "    Backend env:  $BACKEND_ENV_FILE"
    echo "    Frontend env: $([ "$DEV_MODE" = true ] && echo ".env.development" || echo ".env.production")"
    echo "    Hosting:      $HOSTING_ENV"
    echo ""

    echo "  Health Checks"
    for result in "${HEALTH_RESULTS[@]}"; do
        local status="${result%%|*}"
        local label="${result#*|}"
        if [ "$status" = "PASS" ]; then
            printf "    \033[32m[PASS]\033[0m %s\n" "$label"
        elif [ "$status" = "WARN" ]; then
            printf "    \033[33m[WARN]\033[0m %s\n" "$label"
        else
            printf "    \033[31m[FAIL]\033[0m %s\n" "$label"
        fi
    done
    echo ""

    echo "  Next Steps"
    if [ "$HOSTING_ENV" = "shared" ]; then
        echo "    1. Schedule cron in your hosting panel (cPanel/Plesk):"
        echo "       * * * * * cd $BACK_DIR && php artisan schedule:run >> /dev/null 2>&1"
        echo "    2. Point your web server's document root to $BACK_DIR/public"
        echo "    3. Upload frontend/dist/ contents to your hosting public directory"
        echo "    4. Configure SSL/TLS for your domain"
    else
        echo "    1. Set up cron:"
        echo "       * * * * * cd $BACK_DIR && php artisan schedule:run >> /dev/null 2>&1"
        echo "    2. Configure your web server (Nginx/Apache) document root to $BACK_DIR/public"
        if [ "$DEV_MODE" = false ]; then
            echo "    3. Configure SSL/TLS for your domain"
        else
            echo "    3. Run the dev servers: cd $BACK_DIR && php artisan serve  (frontend: cd $FRONT_DIR && pnpm run dev)"
        fi
    fi
    echo ""
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main() {
    if [ ! -t 0 ] && [ "$NON_INTERACTIVE" != true ]; then
        log_error "No TTY available. Use --non-interactive for unattended setup."
        exit 4
    fi

    banner

    if [ "$NON_INTERACTIVE" != true ]; then
        if ! confirm "This script will configure Portafolio (backend + frontend). Continue?" "Y"; then
            log_info "Setup cancelled by user"
            exit 0
        fi
    fi

    if [ ! -d "$BACK_DIR" ]; then
        log_error "Backend directory not found: $BACK_DIR"
        exit 6
    fi
    if [ ! -d "$FRONT_DIR" ]; then
        log_error "Frontend directory not found: $FRONT_DIR"
        exit 6
    fi

    if [ "$DEV_MODE" = true ]; then
        APP_ENV_ARG=""
        BACKEND_ENV_FILE=".env"
    else
        APP_ENV_ARG="--env=production"
        BACKEND_ENV_FILE=".env"
    fi

    check_prereqs

    cd "$BACK_DIR"
    if [ ! -d "vendor" ]; then
        log_info "Installing Composer dependencies..."
        composer install --no-interaction --prefer-dist
    else
        log_info "Composer dependencies already installed"
    fi
    # If a previous run cached Laravel config (bootstrap/cache/config.php) with
    # old DB or app values, downstream `php artisan migrate` would use the
    # stale cache and ignore edits we are about to make to the .env file.
    if [ -f "bootstrap/cache/config.php" ]; then
        php artisan config:clear >/dev/null 2>&1 || true
    fi
    cd "$SCRIPT_DIR"

    configure_backend
    generate_app_key
    configure_sso
    migrate_db
    seed_db

    # Frontend config + build only when the toolchain exists. Without
    # node/pnpm (or on shared hosting) there is nothing to configure here:
    # the CI deploy already uploads the built dist.
    if [ "$HAS_NODE" = true ] && [ "$HAS_PNPM" = true ]; then
        configure_frontend
    fi

    if [ "$SKIP_FRONT_BUILD" != true ]; then
        build_frontend
    fi

    healthcheck
    print_summary

    if [ "$HEALTH_OK" = true ]; then
        log_ok "Portafolio setup complete"
    else
        log_warn "Portafolio setup complete with warnings - review the health checks above"
    fi
}

main "$@"
