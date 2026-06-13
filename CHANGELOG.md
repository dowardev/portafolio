# Changelog

## 19.0.2 - 2026-06-13

### Fixed

- **113 TypeScript errors resolved** across 28 frontend files: broken imports (`@/services/interfaces` → `@/utils/interfaces`), missing type exports (`filterPostOptions`, `PostFields`, `StatusPost`), missing `MyPermissionsResponse` import
- **54 TS2339/TS2322/TS2769 errors** resolved by adding `never` return type to `ErrorController.handleError()` and removing `| void` from 12 controller method return type annotations
- **Various type fixes**: missing ionicons imports, `icon: object` → `icon: string` in AdminHomeMenu, snake_case API fields in `projectsController`, `coverId` optional in `CreatePost`, fixed `debounce` binding in PermissionsPage, file type casts in AdminInfoPage, ref typing for component templates, `Event` type annotations in UserProfileComponent
- **Missing components handled**: Replaced `CardCode`/`CardsAlert` with inline HTML in Prueba.vue, removed invalid `img` property in ProjectsEditor.vue

### Added

- **`frontend/src/guides/TemplateView.vue`**: New Vue component template guide with standard structure (ion-page, ion-header, ion-content with comment-delimited sections, organized script setup)

### Note

- 8 SSO-related TypeScript errors remain (`loadUsers`, `updateUserStatus`, `deleteUserAccount`, `updateUserAccount`, `saveUserData`) — pending SSO integration
- Lint errors (147 pre-existing) unchanged

## 19.0.1 - 2026-06-12

### Changed

- **Reorganized icon configuration files**: Moved `iconConfig.ts` and `lineiconsConfig.ts` from `composables/` to `config/` directory as pure data configuration files
- **Relocated unified icon index**: Moved `iconsIndex.ts` from `composables/` to `utils/` directory as utility functions
- **Migrated permission grouping utilities**: Moved `groupPermissions` and `getPermissionLabel` from `usePermissionsGrouped.ts` composable to `permissionsController.ts` as exported utility functions
- **Updated import paths**: Updated all 29 files referencing the old composable locations to use the new `@/config/`, `@/utils/`, and `@/controllers/` paths

### Added

- **`getCurrentUserId()` method**: Added to `UserController` for accessing the current user ID without directly accessing the Pinia store

### Removed

- `composables/iconConfig.ts` — replaced by `config/iconConfig.ts`
- `composables/lineiconsConfig.ts` — replaced by `config/lineiconsConfig.ts`
- `composables/iconsIndex.ts` — replaced by `utils/iconsIndex.ts`
- `composables/usePermissionsGrouped.ts` — logic migrated to `controllers/permissionsController.ts`

## 19.0.0 - 2026-06-09

### Breaking Changes

- **Unified skills editor with stack+tech model**: Replaced the old skills categories structure (many-to-many via pivot) with a unified stacks → techs (one-to-many) model. The `categories_skills` table has been renamed to `techs` with a required `stack_id` foreign key.

  - Migration: `2026_06_08_000001_rename_categories_skills_to_techs.php` — renames table and adds `stack_id` column
  - `TechController.php` — replaces `SkillsCategoryController` with tech CRUD under stacks (stack_id required)
  - `Tech.php` — new model replacing `SkillsCategory` (belongs to Stack, belongs to Icon)
  - `backend/routes/api.php` — consolidated stack/tech admin routes with permissions
  - `StackController.php` — `show()` endpoint now returns stack with nested techs
  - `Icon.php` — added `techs()` hasMany relationship
  - `Stack.php` — added `techs()` hasMany relationship
  - `RolePermissionSeeder.php` — cleaned orphan `skills-categories.*` permissions

### Added

- **Skills unified editor**: New `SkillsEditorPage.vue` that handles both create and edit modes via route params. Single stack form with inline tech management, per-element saving (no batch), and Vuelidate validation (stack name required, at least 1 tech required, tech names required).
- **Skills list page**: New `SkillsListPage.vue` showing stacks with icon, name, tech count, edit/delete actions, and create button.
- **Icon selector component**: New reusable `IconSelectorContent.vue` component extracted for use in the skills editor.
- **Tech controller**: New `techController.ts` and `techStore.ts` for tech CRUD with Pinia state management.
- **Stack `createStack` method**: Added to `stackController.ts` returning the created stack item with ID.
- **Seed data integration**: `seedController.ts` now generates 3 stacks (Frontend, Backend, DevOps) with 3 techs each, properly associated via `stack_id`.

### Changed

- **Admin panel routes**: Replaced single `/admin-panel/skills` route with 3 routes: list (`SkillsListPage`), new (`SkillsNewPage`), and edit (`SkillsEditPage`).
- **Admin menu**: Replaced separate "Stack" and "Techs" entries with single "Skills" entry in both menu and seed modal.
- **Home templates**: `HomeTemplate2.vue` and `HomeTemplate3.vue` updated to consume stacks with nested techs from `GET /stacks`.
- **Skills page**: Updated to load techs from stacks instead of duplicate data.
- **Permissions**: Updated route guards to use specific permissions per action (create/update).

### Removed

- `SkillsCategoryController.php` — replaced by `TechController.php`
- `SkillsCategory.php` — replaced by `Tech.php`
- `skillsCategoriesController.ts` — replaced by `techController.ts`
- `skillsCategoriesStore.ts` — replaced by `techStore.ts`
- `SkillsCategoriesListPage.vue` — replaced by `SkillsListPage.vue`
- `AdminStackPage.vue` — replaced by new skills editor
- `StackEditor.vue` — replaced by inline tech management in `SkillsEditorPage.vue`

### Affected Files

- Added:
  - `backend/app/Http/Controllers/Admin/TechController.php`
  - `backend/app/Models/Tech.php`
  - `backend/database/migrations/2026_06_08_000001_rename_categories_skills_to_techs.php`
  - `frontend/src/components/common/IconSelectorContent.vue`
  - `frontend/src/controllers/techController.ts`
  - `frontend/src/store/techStore.ts`
  - `frontend/src/views/admin/sections/SkillsEditorPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`
- Renamed:
  - `SkillsCategoryController.php` → `TechController.php`
  - `SkillsCategory.php` → `Tech.php`
- Modified:
  - `backend/app/Http/Controllers/Admin/StackController.php`
  - `backend/app/Models/Icon.php`
  - `backend/app/Models/Stack.php`
  - `backend/database/seeders/RolePermissionSeeder.php`
  - `backend/routes/api.php`
  - `frontend/src/composables/usePermissionsGrouped.ts`
  - `frontend/src/controllers/seedController.ts`
  - `frontend/src/controllers/stackController.ts`
  - `frontend/src/router/index.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/templates/HomeTemplate3.vue`
  - `frontend/src/views/admin/AdminEditorPage.vue`
  - `frontend/src/views/admin/AdminHomeMenu.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/presentation/categories/SkillsPage.vue`
- Deleted:
  - `frontend/src/controllers/skillsCategoriesController.ts`
  - `frontend/src/store/skillsCategoriesStore.ts`
  - `frontend/src/views/admin/editors/StackEditor.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`
  - `frontend/src/views/admin/sections/SkillsCategoriesListPage.vue`

---

## 19.1.0 - 2026-06-10

### Bug Fixes

- **StackController::show() response normalization**: Fixed inconsistent response format where `show()` returned the raw Eloquent model while `index()` returned a mapped array. Now both endpoints return the same structure with `id`, `name`, `iconName`, `sort_order`, and nested `techs` with `stackId`.
- **Tech controller update validation**: Changed `stack_id` from `required` to `sometimes` on `update()` so techs can be edited without resending their stack association.
- **Stale menu route references**: Replaced old `SkillsCategoriesListPage`/`EditPage`/`NewPage` route names with `SkillsListPage`/`NewPage`/`EditPage` in both `MenuComponent.vue` and `MenuComponent3.vue`.

### Architecture

- **SkillsEditorPage moved to controller-based API access**: Replaced all direct `getApiConnector()` calls in `SkillsEditorPage.vue` with `StackController` and `TechController` methods, aligning with the project convention that components must not call API services directly.
- **seedController moved to controller-based API access**: Replaced `getApiConnector()` call in `seedSkills()` with `TechController.createTech()`, following the same architecture convention.

### Added

- **StackController.getStack()**: New method to load a single stack with techs by ID, returning a normalized `StackItem`.
- **StackController.updateStackSave()**: New no-toast variant of update for use in composite save workflows.
- **TechController.createTech()**: New method that creates a tech and returns the created entity, enabling use in seed and editor workflows.

### Refactored

- **TechItem type deduplication**: Removed duplicate `TechItem` interface from `techStore.ts` and consolidated to a single source of truth in `services/types.ts`. The store now re-exports the canonical type.

### Cleanup

- Removed unused `IonNote` import from `SkillsListPage.vue`.
- Removed unused `StackResponse` interface, `watch` import, and `ref="nameInput"` from `SkillsEditorPage.vue`.
- Removed unused `StackItem` type import from `seedController.ts`.
- Code style cleanup in controller methods (semicolons, conditional `stack_id` guard, return `data.stack` directly).

### Affected Files

- Modified:
  - `backend/app/Http/Controllers/Admin/StackController.php`
  - `backend/app/Http/Controllers/Admin/TechController.php`
  - `frontend/src/controllers/stackController.ts`
  - `frontend/src/controllers/techController.ts`
  - `frontend/src/controllers/seedController.ts`
  - `frontend/src/store/techStore.ts`
  - `frontend/src/views/admin/sections/SkillsEditorPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`
  - `frontend/src/views/presentation/categories/SkillsPage.vue`
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/components/menu/MenuComponent3.vue`

---

## 18.10.0 - 2026-06-08

### Features

- **Customizable footer for intro profile**: Added `show_footer` toggle and `footer_content` custom text fields to the intro profile, allowing users to control footer visibility and provide personalized footer text instead of the default copyright notice.

  - Migration: `2026_06_07_000001_add_footer_to_intro_profiles_table.php` — adds `show_footer` (boolean, default true) and `footer_content` (text, nullable) columns
  - `IntroProfile.php` — added `show_footer` and `footer_content` to `$fillable`, `show_footer` cast to boolean
  - `IntroProfileController.php` — exposed `showFooter`/`footerContent` in API responses; added server-side validation (required when visible, max 1000 chars); wired save logic
  - `introController.ts` — added `showFooter`/`footerContent` to `IntroData` interface and defaults
  - `introStore.ts` — added `showFooter`/`footerContent` to store state and `setData`
  - `InfoEditor.vue` — added toggle for "Mostrar footer" and textarea for custom content with validation rules
  - `AdminInfoPage.vue` — wired new props and form bindings
  - `HomeTemplate3.vue` — footer now conditionally renders based on `showFooter`; displays `footerContent` when available, falls back to default copyright

### Affected Files

- Added:
  - `backend/database/migrations/2026_06_07_000001_add_footer_to_intro_profiles_table.php`
- Modified:
  - `.gitignore`
  - `backend/app/Http/Controllers/Admin/IntroProfileController.php`
  - `backend/app/Models/IntroProfile.php`
  - `frontend/src/controllers/introController.ts`
  - `frontend/src/store/introStore.ts`
  - `frontend/src/templates/HomeTemplate3.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`

---

## 18.9.0 - 2026-06-07

### Features

- **Username field for intro profile**: Added a `username` field to the `IntroProfile` model, allowing users to display a custom username (e.g. @handle) in the portfolio header instead of the profile name.
- `IntroProfile.php` — added `username` to `$fillable`
- `IntroProfileController.php` — added `username` to create, read, and update operations
- New migration: `2026_06_07_000000_add_username_to_intro_profiles_table.php` — adds nullable `username` column after `name`
- `introController.ts` — added `username` to `IntroData` interface, load fallback, and save payload
- `InfoEditor.vue` — added username input field with `@usuario` placeholder
- `AdminInfoPage.vue` — wired username v-model binding and form data
- `HomeTemplate3.vue` — header logo text now displays `username` (falls back to `name`), header logo image uses `logoUrl` from intro data with static asset fallback
- `seedController.ts` — added default `@juanperez` username to seed data

### Affected Files

- Added:
  - `backend/database/migrations/2026_06_07_000000_add_username_to_intro_profiles_table.php`
- Modified:
  - `backend/app/Http/Controllers/Admin/IntroProfileController.php`
  - `backend/app/Models/IntroProfile.php`
  - `frontend/src/controllers/introController.ts`
  - `frontend/src/controllers/seedController.ts`
  - `frontend/src/templates/HomeTemplate3.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`

---

## 18.8.1 - 2026-05-27

### Removed

- **Local auth code from backend**: Removed all remnants of the legacy local authentication system after migrating to SSO. Auth is now 100% handled by the `tu-org/sso-server` package and the external SSO server.

  - **User model and factory**: Deleted `User.php` model and `UserFactory.php`. The `users` table is no longer needed — SSO provides user data via `SsoAuth::user()`.
  - **AuthController renamed**: Renamed `AuthController.php` to `SsoController.php` to reflect its SSO-only purpose.
  - **Database cleanup**: New migration `drop_local_auth_schema` removes:
    - `users` table (and all its local auth columns: `password`, `email_verified_at`, `remember_token`, `is_email_verified`, `is_admin`, `role`, `is_user_disabled`, `image_id`)
    - `personal_access_tokens` table (Sanctum tokens, unused with SSO)
    - `feedbacks.user_id` column and FK (was unused — controller reads `user_id` from request body, never queried)
  - **Dead routes removed**: Deleted broken `verifyAccount`/`verifyNewEmail` routes from `web.php` (methods never existed in `AuthController`).
  - **Unused imports cleaned**: Removed `AuthController` import from `api.php`, `Auth` facade import from `FeedbackController.php`.
  - **Post model simplified**: Removed unused `Notifiable` trait.
  - **Seeder simplified**: Removed legacy `User::create()` call from `DatabaseSeeder.php`.
  - **Auth config simplified**: Removed `passwords` and `password_timeout` sections from `config/auth.php`.
  - **Environment cleanup**: Removed `BCRYPT_ROUNDS` and simplified `SESSION_DRIVER` to `array` (API is stateless, no DB sessions needed).

### Affected Files

- Renamed:
  - `backend/app/Http/Controllers/AuthController.php` → `backend/app/Http/Controllers/SsoController.php`
- Added:
  - `backend/database/migrations/2026_05_27_000001_drop_local_auth_schema.php`
- Deleted:
  - `backend/app/Models/User.php`
  - `backend/database/factories/UserFactory.php`
- Modified:
  - `backend/.env.example`
  - `backend/app/Http/Controllers/FeedbackController.php`
  - `backend/app/Models/Feedback.php`
  - `backend/app/Models/Post.php`
  - `backend/config/auth.php`
  - `backend/database/seeders/DatabaseSeeder.php`
  - `backend/routes/api.php`
  - `backend/routes/web.php`

---

## 18.8.0 - 2026-05-26

### Features

- **Seed data button in admin panel**: Added centralized "Datos de prueba" button (DEV mode only) in AdminHomeMenu that opens a modal with checkboxes to select which sections to seed with test data. Uses `@faker-js/faker` to generate realistic random data for all 8 sections.
  - `seedController.ts` — new controller with seed logic for Info, Stack, Skills Categories, Experience, Projects, Certificates, Freelance Platforms, and Freelance Comments
  - `AdminHomeMenu.vue` — added bug icon item (visible only in DEV) with modal containing section checkboxes, "Select all" toggle, and seed button with loading spinner
  - `assertSuccess()` helper — verifies boolean return values from all `add*` controller methods and throws on failure for accurate error reporting via toasts
  - Sections seeded in dependency order (info → stack → categories → experience → projects → certificates → platforms → comments)
  - Per-section progress toasts (✅/❌) and final summary toast

- **Homepage modular endpoints refactor**: Split monolithic homepage data endpoint into dedicated controllers per entity. `SkillsCategoryController` now handles its own CRUD with icon relationship support. `TechCloudBackground.vue` simplified to use dynamic icon rendering. Removed `SkillsEditor.vue` (merged into `SkillsCategoriesListPage.vue`).
  - `SkillsCategoryController.php` — expanded with full CRUD, icon_name lookup/creation, sort_order support
  - `SkillsCategory.php` — added `icon()` BelongsTo relationship, `icon_id` and `sort_order` to fillable
  - `SkillsCategoriesListPage.vue` — complete rewrite with inline icon selector, grid layout, and save-in-bulk pattern
  - `TechCloudBackground.vue` — removed static icon mapping, now renders icons from store data
  - New migration: `2026_05_25_071855_update_skills_categories_add_icon.php` — adds `icon_id` and `sort_order` to `categories_skills`

### Fixed

- **Skills categories creation failure**: The migration adding `icon_id` to `categories_skills` was pending and never executed. `SkillsCategory::create()` failed with "Column not found: icon_id" because the column didn't exist in the database. Migration has now been run successfully.

- **Freelance comments creation failure (NOT NULL constraint)**: The `freelance_comments` table had `platform_id` as a required foreign key with no nullable option, but neither the model's `$fillable` nor the seed data included it. This caused a SQL constraint violation on every insert. Fix: made `platform_id` nullable via migration and added it to `$fillable`.
  - New migration: `2026_05_26_235831_fix_freelance_comments_table.php` — makes `platform_id` nullable, renames column `nullable` → `text`

- **Freelance comments `text` column name bug**: The original migration created the text column as `$table->text('nullable')` instead of `$table->text('text')`. The model referenced `'text'` in `$fillable` which pointed to a non-existent column, so the text field was never saved. Fixed by renaming the column from `nullable` to `text`.
  - `FreelanceComment.php` — added `platform_id` to `$fillable`

- **Migration order for icons/socials**: Reordered icon and social creation in seeders to ensure icons exist before socials reference them. Fixed `category_skills_tech` table name and added `HasFactory` trait to User model.

### Affected Files

- Added:
  - `frontend/src/controllers/seedController.ts`
  - `docs/superpowers/specs/2026-05-26-seed-data-button-design.md`
  - `backend/database/migrations/2026_05_26_235831_fix_freelance_comments_table.php`
  - `backend/database/migrations/2026_05_25_071855_update_skills_categories_add_icon.php`
- Modified:
  - `frontend/src/views/admin/AdminHomeMenu.vue`
  - `frontend/src/views/admin/sections/SkillsCategoriesListPage.vue`
  - `frontend/src/components/common/TechCloudBackground.vue`
  - `frontend/src/controllers/skillsCategoriesController.ts`
  - `frontend/src/controllers/stackController.ts`
  - `frontend/src/store/skillsCategoriesStore.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/presentation/categories/SkillsPage.vue`
  - `frontend/src/router/index.ts`
  - `backend/app/Http/Controllers/Admin/SkillsCategoryController.php`
  - `backend/app/Http/Controllers/Admin/StackController.php`
  - `backend/app/Models/SkillsCategory.php`
  - `backend/app/Models/FreelanceComment.php`
- Deleted:
  - `frontend/src/views/admin/editors/SkillsEditor.vue`

---

## 18.7.0 - 2026-05-23

### Features

- **Stack icon-only system**: Replaced image uploads with `icon_id` foreign key to `icons` table. Stack editor now uses IconSelector modal instead of file input/preview. TechCloudBackground renders icons dynamically via Lineicons/ion-icon. Removed 4 static SVG assets.
  - New migration: `2026_05_22_000000_update_stacks_table.php`
  - `StackController.php`, `Stack.php` — icon_name lookup, BelongsTo relationship
  - `stackController.ts`, `StackEditor.vue`, `AdminStackPage.vue` — no file arguments
  - `TechCloudBackground.vue`, `SkillsPage.vue`, `HomeTemplate2.vue` — dynamic icon rendering
  - Deleted: `ionicframework-icon.svg`, `laravel-2.svg`, `mariadb-icon.svg`, `vue-js-1.svg`

- **Auto theme selector**: Added "Automático" mode with 3 `ion-select` dropdowns (main, light theme, dark theme). `resolveAutoTheme()` detects `prefers-color-scheme` to select the effective theme automatically.
  - `ThemeComponente.vue` — 3-select UI for main/light/dark theme
  - `systemController.ts` — `resolveAutoTheme()` method
  - `systemService.ts` — resolved params for classList operations
  - `systemStore.ts` — default lightTheme/darkTheme options
  - `types.ts`, `interfaces.ts` — `ConcreteTheme` type, `Theme` union expanded

- **Catppuccin themes**: Added Catppuccin Latte (light) and Macchiato (dark) with maroon primary accent. Theme list expanded from 3 to 5.
  - New: `catppuccin-latte.css`, `catppuccin-macchiato.css`
  - `variables.css` — imports for both themes
  - `utils/types.ts` — theme type union expanded

### Fixed

- **Theme switching engine repair**: Replaced fragile inline style manipulation with `data-blur` attribute on `<body>` plus CSS-driven states. Unified `changeTheme()` method that atomically updates store, applies theme, and persists. Menu accent color fixed from `--ion-color-secondary` to `--ion-color-primary`.
  - `systemService.ts` — simplified to `body.setAttribute("data-blur")` pattern
  - `MenuComponent.vue`, `MenuItem.vue` — changed accent to `--ion-color-primary`
  - `App.vue` — fixed `oldTheme` reference to use fresh default object
  - `light.css`, `gruvbox.css`, `nord.css` — added `--background-contrast`, `[data-blur]` selectors
  - `variables.css` — uncommented gruvbox/nord CSS imports

### Affected Files

- Added:
  - `backend/database/migrations/2026_05_22_000000_update_stacks_table.php`
  - `frontend/src/theme/catppuccin-latte.css`
  - `frontend/src/theme/catppuccin-macchiato.css`
- Modified:
  - `backend/app/Http/Controllers/Admin/StackController.php`
  - `backend/app/Models/Stack.php`
  - `frontend/src/App.vue`
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/components/menu/MenuItem.vue`
  - `frontend/src/components/theme/ThemeComponente.vue`
  - `frontend/src/components/common/TechCloudBackground.vue`
  - `frontend/src/controllers/stackController.ts`
  - `frontend/src/controllers/systemController.ts`
  - `frontend/src/services/systemService.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/stackStore.ts`
  - `frontend/src/store/systemStore.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/theme/variables.css`
  - `frontend/src/theme/light.css`
  - `frontend/src/theme/gruvbox.css`
  - `frontend/src/theme/nord.css`
  - `frontend/src/utils/interfaces.ts`
  - `frontend/src/utils/types.ts`
  - `frontend/src/views/admin/PermissionsPage.vue`
  - `frontend/src/views/admin/editors/StackEditor.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`
  - `frontend/src/views/presentation/categories/SkillsPage.vue`
- Deleted:
  - `frontend/src/assets/otros/ionicframework-icon.svg`
  - `frontend/src/assets/otros/laravel-2.svg`
  - `frontend/src/assets/otros/mariadb-icon.svg`
  - `frontend/src/assets/otros/vue-js-1.svg`

---

## 18.6.0 - 2026-05-21

### Features

- **SSO client_credentials grant**: Added server-to-server OAuth2 authentication via `SsoApiService`. The portfolio backend can now obtain tokens from the SSO server using `client_credentials` grant type, enabling secure API calls to fetch user data and sync roles without user interaction.
  - `backend/app/Services/SsoApiService.php` — new service handling client_credentials token requests (cached for 55 minutes) and SSO API calls (getUsers, getRoles)
  - `backend/config/sso.php` — new configuration file for SSO client credentials (base_url, client_id, client_secret)

- **User permission overrides**: Added per-user permission management with grant/deny/inherit controls.
  - `PermissionController::getUserPermissions()` — returns all permissions with user override status (`grant`, `deny`, or `null` for inherited)
  - `PermissionController::updateUserPermissions()` — batch updates user permission overrides in a transaction
  - Backend ensures users with no overrides still get a full permission list (all `null` types)

- **Permissions management UI redesign**: Replaced the previous modal-based permissions editor with a tabbed interface featuring role and user management.
  - Three tabs: Roles (checkbox-based), Users (search + ion-popover override picker), SSO (sync status)
  - Role permissions: grouped by module with enabled/total badge, save with change count indicator
  - User permissions: searchable SSO user list with inline filter, ion-popover for grant/deny/inherit selection with hover descriptions and selected-state badge
  - User list filters out the currently logged-in user (normalizes both SsoUser.id and User.id to strings for comparison)
  - `selected-user` highlight styling for the active user

- **SSO user search endpoint**: `GET admin/permissions/users` with optional `?search=` query parameter, proxied through `SsoApiService` to the SSO server's `/api/users` endpoint.

- **SSO role sync UI**: Added sync status display showing roles from SSO with protected badges and last-sync timestamp. Manual sync trigger button.

- **Backend route ordering fix**: Reordered `admin/permissions` routes so static paths (`user-override`, `roles`, `sync`, `users`) are registered before the parameterized `{id}` routes, preventing `user-override` from being captured as the `{id}` parameter (which caused `findOrFail(0)` errors).

### Removed

- **Deleted `PermissionFormModal.vue`**: Replaced by inline ion-popover override picker on the users tab.
- **Deleted `UserSearchInput.vue`**: Replaced by inline search input with debounced filtering on the users tab.

### Changed

- **`permissionsController.ts`**: Replaced the previous controller implementation with a comprehensive set of typed API methods for permissions CRUD, role permissions, user overrides, SSO user search, and sync management. Updated endpoint names (sso-users → users).

- **`PermissionController.php`**: Refactored to support user permission overrides, SSO user proxying, and role sync. Changed `int $id` to `string $id` in update/delete methods with explicit cast (Laravel 12 passes route params as strings). Added fallback for users with no overrides.

- **`usePermissionsGrouped.ts`**: Made null-safe to handle permission entries without descriptions.

### Affected Files

- Added:
  - `backend/app/Services/SsoApiService.php`
  - `backend/config/sso.php`
- Modified:
  - `backend/app/Http/Controllers/Admin/PermissionController.php`
  - `backend/routes/api.php`
  - `frontend/src/composables/usePermissionsGrouped.ts`
  - `frontend/src/controllers/permissionsController.ts`
  - `frontend/src/views/admin/PermissionsPage.vue`
- Deleted:
  - `frontend/src/components/admin/PermissionFormModal.vue`
  - `frontend/src/components/admin/UserSearchInput.vue`

---

## 18.5.3 - 2026-05-17

### Fixed
- **Silent permissions loading failure**: Added `console.error` in `userController.loadPermissions()` catch block so that permission loading failures are no longer silent. This improves debugging of authentication/authorization issues by surfacing errors in the browser console instead of silently failing.

### Refactored
- **Store roles/permissions documentation**: Added clarifying comments in `userStore.ts` to explain the dual role system:
  - `user.roles` (Role[]): comes from SSO server (`/me` endpoint) with full role objects
  - `roles` (string[]): comes from portfolio backend (`my-permissions` endpoint) with only slugs
  - `permissions` (Record<string, boolean>): comes exclusively from portfolio backend
  - This separation is intentional: SSO handles authentication/global roles, portfolio backend handles authorization/permissions

### Affected Files
- Modified: `frontend/src/store/userStore.ts` (documentation comments)
- Modified: `frontend/src/controllers/userController.ts` (console.error in loadPermissions catch block)

---

## 18.5.2 - 2026-05-15

### Refactored

- **Database migrations consolidation**: Consolidated 14 database migration files from 2026 into 6 create migrations by integrating modify operations directly into the initial table creation migrations. This simplifies migration history and improves maintainability.

  - Renamed `technologies` table to `icons` with `pack_name` field directly in create migration
  - Renamed pivot tables (`project_technologies` → `project_icons`, `experience_technologies` → `experience_icons`)
  - Added `icon_id` foreign key to `socials` table in create migration
  - Renamed `freelances` to `freelance_platforms` directly in create migration
  - Removed unused JSON fields (`stack`, `skill_categories`, `experience`, `projects`, `certificates`, `freelance`) from `intro_profiles` in create migration
  - Removed `sort_order` from `categories_skills` directly in create migration
  - Renamed `category_skills_technologies` → `categories_skills_tech` directly in create migration
  - Added `action` field to `permissions` table in create migration
  - Changed `role_permissions` to use `permission_slug` instead of `permission_id` foreign key in create migration

- **Deleted migration files** (14 files removed):
  - `2026_01_17_212502_add_sso_id_to_users_table.php`
  - `2026_03_30_000000_drop_user_permission_fields.php`
  - `2026_04_30_000001_cleanup_intro_profiles_table.php`
  - `2026_04_30_000001_drop_category_from_technologies_table.php`
  - `2026_04_30_000002_rename_freelances_table.php`
  - `2026_04_30_000002_drop_image_and_sort_order_from_technologies_table.php`
  - `2026_04_30_000003_create_freelance_comments_table.php`
  - `2026_04_30_000004_rename_technologies_to_icons.php`
  - `2026_04_30_000005_add_icon_foreign_to_socials.php`
  - `2026_04_30_000006_rename_category_skills_table.php`
  - `2026_04_30_000007_drop_sort_order_from_categories_skills.php`
  - `2026_04_30_000008_rename_category_skills_icons.php`
  - `2026_05_09_000002_simplify_role_permissions.php`
  - `2026_05_09_000003_create_user_permissions_table.php`

- **New migration files** (2 files added):
  - `2026_04_26_000005_create_freelance_comments_table.php`
  - `2026_05_08_000003_create_user_permissions_table.php`

### Affected Files

- Modified:
  - `backend/database/migrations/2026_01_17_220000_create_homepages_table.php`
  - `backend/database/migrations/2026_04_26_000004_create_freelances_table.php`
  - `backend/database/migrations/2026_04_27_000003_create_relations_tables.php`
  - `backend/database/migrations/2026_04_27_000004_create_categories_tables.php`
  - `backend/database/migrations/2026_05_08_000001_create_permissions_table.php`
  - `backend/database/migrations/2026_05_08_000002_create_role_permissions_table.php`
- Added:
  - `backend/database/migrations/2026_04_26_000005_create_freelance_comments_table.php`
  - `backend/database/migrations/2026_05_08_000003_create_user_permissions_table.php`
- Deleted: 14 migration files (see Refactored section)

---

## 18.5.1 - 2026-05-15

### Refactored

- **is_admin / isAdmin cleanup**: Removed all remnants of the legacy `is_admin` boolean field and `isAdmin` method from the portfolio codebase, completing the migration to a role-based admin system. The backend no longer sends `is_admin` in the user-auth response; frontend components now use `userController.hasRole({ slug: 'admin' })` instead of `userController.isAdmin()`.

  - `AuthController.php`: Removed `is_admin` field from JSON response
  - `PermissionService.php`: Removed redundant `isAdmin()` method
  - `UserFactory.php`: Removed obsolete `is_admin` field
  - `interfaces.ts`: Removed `is_admin: boolean` from `UserServerResponse`
  - `userStore.ts`: Removed `isAdmin` computed property
  - `userController.ts`: Removed `isAdmin()` method
  - `MenuComponent.vue`: Replaced `isAdmin` computed with `hasRole()`
  - `PostsPage.vue`: Replaced 3 `isAdmin()` calls with `hasRole()`
  - `PostPage.vue`: Replaced 3 `isAdmin()` calls with `hasRole()`

### Affected Files

- Modified:
  - `backend/app/Http/Controllers/AuthController.php`
  - `backend/app/Services/PermissionService.php`
  - `backend/database/factories/UserFactory.php`
  - `frontend/src/utils/interfaces.ts`
  - `frontend/src/store/userStore.ts`
  - `frontend/src/controllers/userController.ts`
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/views/blog/posts/PostsPage.vue`
  - `frontend/src/views/blog/post/PostPage.vue`
- Added:
  - `docs/superpowers/specs/2026-05-15-is-admin-cleanup-design.md`
  - `docs/superpowers/plans/2026-05-15-is-admin-cleanup-plan.md`

---

## 18.5.0 - 2026-05-15

### Features
- **oxlint integration**: Added oxlint (v1.64.0) as fast ESLint alternative for improved linting performance
- **oxfmt integration**: Added oxfmt (v0.49.0) for fast code formatting
- **eslint-plugin-oxlint**: Integrated oxlint with ESLint configuration for unified linting experience
- **Split lint scripts**: Updated lint script to run `oxlint` and `eslint` separately for better performance and flexibility
- **format script**: Added `oxfmt` script for quick code formatting with `pnpm run format`

### Config
- Added `.oxfmtrc.json` for oxlint formatter configuration
- Added `.oxlintrc.json` for oxlint linter configuration

### Refactored
- **package.json cleanup**: Reorganized fields (moved "private" after "version", cleaned up dependencies ordering)
- **sso-client dependency**: Repositioned `@tu-org/sso-client` in dependencies array

### Fixed
- **cypress.config.ts**: Fixed ESLint comment syntax for setupNodeEvents

### Affected Files
- Added:
  - `.oxfmtrc.json`
  - `.oxlintrc.json`
  - `frontend/.eslintcache`
- Modified:
  - `frontend/package.json` (version, scripts, dependencies)
  - `frontend/pnpm-lock.yaml`
  - `frontend/eslint.config.js` (oxlint integration)
  - `frontend/cypress.config.ts` (ESLint comment fix)

## 18.4.3 - 2026-05-13

### Features
- **PermissionService with caching**: New service that provides centralized permission checking with Laravel Gates support and 1-hour cache TTL
- **Eloquent relationships**: Added hasMany/belongsTo relationships to Permission, RolePermission, and UserPermission models
- **Permission guard helpers**: Added canAny, canAll, canAnyRole, canAllRoles helpers to usePermissionGuard composable for multi-permission checks
- **Frontend permission refresh**: Added MyPermissionsResponse interface, refreshPermissions method, and clearPermissions to support permission state reset

### Fixed
- **Broken isAdmin property access**: Fixed userController.getUser()?.isAdmin in PostsPage and PostPage (6 places) — now uses userController.isAdmin() method
- **Unified admin-check in MenuComponent**: Replaced hasAdminRole with userController.isAdmin() for consistent behavior
- **Robust migration handling**: Added try-catch blocks to simplify_role_permissions migration for safer execution in different DB states

### Refactored
- **Eliminated duplicated extractRoleSlugs**: MyPermissionsController now uses ExtractsRoleSlugs trait instead of local method

### Affected Files
- Added:
  - `backend/app/Services/PermissionService.php`
- Modified:
  - `backend/app/Providers/AppServiceProvider.php` (Gate registration)
  - `backend/app/Models/Permission.php` (relationships)
  - `backend/app/Models/RolePermission.php` (relationships)
  - `backend/app/Models/UserPermission.php` (relationships)
  - `backend/app/Http/Controllers/MyPermissionsController.php` (uses trait)
  - `backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php` (robust error handling)
  - `backend/database/seeders/RolePermissionSeeder.php` (doc comment)
  - `backend/phpunit.xml` (MySQL test config)
  - `frontend/src/composables/usePermissionGuard.ts` (canAny/canAll helpers)
  - `frontend/src/controllers/userController.ts` (refreshPermissions)
  - `frontend/src/store/userStore.ts` (clearPermissions)
  - `frontend/src/utils/interfaces.ts` (MyPermissionsResponse)
  - `frontend/src/components/menu/MenuComponent.vue` (isAdmin method)
  - `frontend/src/views/blog/post/PostPage.vue` (isAdmin method)
  - `frontend/src/views/blog/posts/PostsPage.vue` (isAdmin method)

## 18.4.2 - 2026-05-13

### Fixed
- **Dynamic logo and photo in HomeTemplate2**: Logo and profile photo in the homepage template were hardcoded to static asset paths instead of using `introData.logoUrl` and `introData.photoUrl` from the store. They now bind dynamically to the configured values from the admin editor, with static assets as fallback defaults.

### Affected Files
- Modified:
  - `frontend/src/templates/HomeTemplate2.vue`

## 18.4.1 - 2026-05-13

### Fixed (Critical)
- **Admin role bypass in PermissionMiddleware**: Admins now have consistent access across frontend and backend. The middleware now grants all permissions to admin users, matching the behavior in MyPermissionsController.
- **Route path mismatch**: FreelanceCommentsListPage was navigating to singular `freelance-comment` but router defines plural `freelance-comments`. Fixed navigation paths.
- **Missing UserController import**: ProjectsListPage was using `new UserController()` without importing it. Migrated to usePermissionGuard composable.

### Code Quality
- Extracted duplicated `extractRoleSlugs()` method to shared trait `ExtractsRoleSlugs`
- Migrated ProjectsListPage and SkillsCategoriesListPage to usePermissionGuard composable (consistent pattern)
- Replaced risky `truncate()` in RolePermissionSeeder with `upsert()` for concurrent safety
- Replaced fragile try/catch in migration with explicit `hasIndex()` check

### Affected Files
- Added: `backend/app/Traits/ExtractsRoleSlugs.php`
- Modified: `backend/app/Http/Middleware/PermissionMiddleware.php` (added admin bypass, uses trait)
- Modified: `backend/app/Http/Controllers/MyPermissionsController.php` (uses trait)
- Modified: `backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php`
- Modified: `backend/database/seeders/RolePermissionSeeder.php`
- Modified: `frontend/src/views/admin/sections/FreelanceCommentsListPage.vue`
- Modified: `frontend/src/views/admin/sections/ProjectsListPage.vue`
- Modified: `frontend/src/views/admin/sections/SkillsCategoriesListPage.vue`

---

## 18.4.0 - 2026-05-09

### Added
- Complete permissions system v2 with three-layer architecture:
  - `permissions` table: editable catalog of available permissions (slug, module, action)
  - `role_permissions` table: role-to-permission mappings (editable from admin UI)
  - `user_permissions` table: per-user permission overrides (grant/deny)
- Permission catalog CRUD in admin UI (create, read, update, delete permissions)
- User permission overrides management in admin UI (grant/deny per user)
- Role permissions editor with checkboxes for each permission

### Features
- Permission middleware priority: user deny > user grant > role permissions > deny by default
- Permission slug parser with module/action extraction
- Backend transaction safety for permission updates
- User permission filtering by user_sso_id to improve scalability
- Frontend with loading states, proper types, and named parameters pattern

### Fixed
- Migration down() now uses column names instead of hardcoded index names
- Middleware now checks all user roles instead of just the first one
- PermissionController now uses proper null type validation for user permissions
- Permission delete now cascades to clean orphaned role_permissions and user_permissions
- Permission model now returns direct fields instead of re-parsing slug

### Affected Files
- Added: `backend/app/Models/Permission.php`
- Added: `backend/app/Models/UserPermission.php`
- Added: `backend/database/migrations/2026_05_09_000002_simplify_role_permissions.php`
- Added: `backend/database/migrations/2026_05_09_000003_create_user_permissions_table.php`
- Added: `backend/database/seeders/RolePermissionSeeder.php`
- Added: `docs/superpowers/plans/2026-05-09-permissions-v2.md`
- Modified: `backend/app/Http/Controllers/Admin/PermissionController.php`
- Modified: `backend/app/Http/Middleware/PermissionMiddleware.php`
- Modified: `backend/app/Services/RoleSyncService.php`
- Modified: `backend/routes/api.php`
- Modified: `frontend/src/controllers/permissionsController.ts`
- Modified: `frontend/src/views/admin/PermissionsPage.vue`

---

## 18.3.0 - 2026-05-08

### Added
- New UI/UX Pro Max agent skill for enhanced design guidance during development
- BM25 search engine for querying UI/UX style guides across multiple domains (style, color, typography, charts, landing pages, UX guidelines, products)
- Stack-specific guidelines for HTML/Tailwind, React, Next.js
- Design system generator that aggregates search results and provides comprehensive recommendations
- Master + Overrides pattern for persistent design system documentation

### Features
- Search across 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types
- Generate complete design system recommendations with pattern, colors, typography, effects
- Persist design system to design-system/ folder with page-specific override files

### Affected Files
- Added: `.opencode/skills/ui-ux-pro-max/SKILL.md`
- Added: `.opencode/skills/ui-ux-pro-max/data/` (CSV data files)
- Added: `.opencode/skills/ui-ux-pro-max/scripts/core.py`
- Added: `.opencode/skills/ui-ux-pro-max/scripts/design_system.py`
- Added: `.opencode/skills/ui-ux-pro-max/scripts/search.py`

---

## 18.2.0 - 2026-05-08

### Changed
- Refactored authentication flow to eliminate redundant user-auth endpoint calls
- Frontend now uses SSOClient.getUser() directly instead of calling the portafolio backend's user-auth endpoint

### Removed
- Removed user-auth endpoint from portafolio backend (port 8000) - user data is now fetched exclusively from SSO server (port 8001)

### Affected Files
- Modified: `frontend/src/controllers/userController.ts`
- Modified: `backend/routes/api.php`

---

## 18.1.0 - 2026-05-07

### Added
- Profile photo with animated gradient ring border on homepage hero
- Typing animation on hero greeting that starts after data loads
- Scale-in transition with staggered delays for hero elements (photo, title, description, tags, socials)
- New `v-section-reveal` directive with fade-in + blur effect for sections on scroll
- TechCloudBackground with radial gradient background and icon hover effects
- FinalSection with gradient text heading, platform icons hover lift, and glassmorphism testimonial cards
- Footer uncommented and styled on homepage

### Changed
- Color consistency: use `var(--ion-color-primary)` instead of hardcoded `#0099ff` in waves and section backgrounds
- Blur effect applied only to content (not background) in blue sections (Projects, Experience)
- Removed old `v-scroll-reveal` and `fade-item` transitions, replaced with new scale-in and fade-in+blur
- Reduced blur transition duration from 0.8s to 0.5s for faster effect

### Removed
- Hero parallax background (was using b5.jpg with dark overlay)
- Old scroll reveal directive (`scrollReveal.ts`) replaced by `sectionReveal.ts`

### Affected Files
- Modified: `frontend/src/templates/HomeTemplate2.vue`
- Modified: `frontend/src/main.ts`
- Modified: `frontend/src/theme/styles/transitions.css`
- Modified: `frontend/src/components/common/TechCloudBackground.vue`
- Modified: `frontend/src/views/presentation/sections/FinalSection.vue`
- Added: `frontend/src/directives/sectionReveal.ts`
- Deleted: `frontend/src/directives/scrollReveal.ts`

---

## 18.0.2 - 2026-05-07

### Fixed
- Removed infinite CSS animation (`@property --angle` + `@keyframes rotate`) that caused CPU heating when portfolio page was open - deleted `selectectable-animated.css` file and removed its import from `variables.css`
- Replaced wildcard icon import (`import * as ionicons`) with explicit named imports of 95 used icons to reduce bundle size by ~1200 unused SVG strings

### Affected Files
- Modified: `frontend/src/composables/iconConfig.ts`
- Modified: `frontend/src/theme/variables.css`
- Deleted: `frontend/src/theme/styles/selectectable-animated.css`

### Added
- Added `AGENTS.md` with developer commands and project documentation
- Added `guides/TemplateView.vue` with Vue component template structure guidelines

---

## 18.0.1 - 2026-05-06

### Fixed
- Fixed session loss on page reload by handling "Token no proporcionado" as an authentication error in `userController` and router guard, preventing unhandled errors from the SSO auth middleware
- Added "Token no proporcionado" to auth error detection alongside "Unauthenticated." in `loadUser()`, `resendEmailVerification()`, and router `loadUser` function

### Affected Files
- Modified: `frontend/src/controllers/userController.ts`
- Modified: `frontend/src/router/index.ts`

---

## 18.0.0 - 2026-05-05

### Summary
Replace all backend SSO authentication code with the `tu-org/sso-server` package. The backend no longer manages JWT validation, DPoP verification, JWKS fetching, or role resolution directly — all handled internally by the SSO server package via its built-in SsoServerClient, middleware, and facade.

### Breaking Changes
- Removed `LocalJwtAuth`, `AdminOnly`, `SSOTokenAuth` middlewares — replaced by `SsoAuthMiddleware` and `SsoRoleMiddleware` from the package
- Controllers must now use `SsoAuth` facade instead of `$request->get('sso_user')`, `$request->is_admin`, `$request->roles`
- Route middleware changed from `admin.only` to `sso.role:admin`
- Removed `laravel/passport` dependency — SSO tokens are validated locally via JWKS, not through Passport
- Removed `api` guard (Passport driver) from `config/auth.php`
- `AuthController::user()` now returns `SsoUser` object properties instead of request attributes

### Added
- `tu-org/sso-server` package as a dependency (local path repository)
- `SsoAuth` facade with high-level API: `user()`, `id()`, `isAuthenticated()`, `hasRole()`, `dpopVerified()`
- `sso.auth` middleware with optional `dpop` mode (`sso.auth:dpop` forces DPoP)
- `sso.role:admin` middleware for role-based access control
- Published `config/sso.php` with centralized SSO configuration (sso_url, jwt_issuer, cache TTLs, role mappings, DPoP settings)

### Changed
- `AuthController::user()` refactored to use `SsoAuth` facade instead of request attributes
- `PostsController::createPost()` replaced broken `Auth::guard("api")->user()->is_admin` with `SsoAuth::hasRole('admin')`
- `routes/api.php` updated middleware from `admin.only` to `sso.role:admin`, removed dead imports
- `bootstrap/app.php` removed `sso.auth` and `admin.only` middleware aliases (auto-registered by package)
- `config/app.php` removed redundant `sso_url` key (now in `config/sso.php`)
- `composer.json` added `tu-org/sso-server` and path repository, removed `laravel/passport`

### Removed
- `backend/app/Http/Middleware/LocalJwtAuth.php` (370 lines, replaced by SsoAuthMiddleware)
- `backend/app/Http/Middleware/AdminOnly.php` (21 lines, replaced by SsoRoleMiddleware)
- `backend/app/Http/Middleware/SSOTokenAuth.php` (73 lines, was unused)
- `backend/app/Services/JwksService.php` (158 lines, replaced by JwksFetcher + JwkToPemConverter)
- `laravel/passport` and 11 related transitive dependencies (defuse/php-encryption, firebase/php-jwt, league/oauth2-server, phpseclib/phpseclib, nyholm/psr7, etc.)

### Affected Files
- Modified: `backend/composer.json`
- Modified: `backend/composer.lock`
- Modified: `backend/bootstrap/app.php`
- Modified: `backend/routes/api.php`
- Modified: `backend/app/Http/Controllers/AuthController.php`
- Modified: `backend/app/Http/Controllers/PostsController.php`
- Modified: `backend/config/app.php`
- Modified: `backend/config/auth.php`
- Added: `backend/config/sso.php`
- Deleted: `backend/app/Http/Middleware/LocalJwtAuth.php`
- Deleted: `backend/app/Http/Middleware/AdminOnly.php`
- Deleted: `backend/app/Http/Middleware/SSOTokenAuth.php`
- Deleted: `backend/app/Services/JwksService.php`

---

## 17.0.0 - 2026-05-05

### Summary
Delegate all authentication responsibilities to @tu-org/sso-client package. The portfolio frontend no longer manages tokens, DPoP proofs, or PKCE flows directly — all handled internally by the SSO client via its built-in HttpClient with auto-injected auth headers and transparent token refresh.

### Breaking Changes
- Removed `APIController`, `SSOAPIController`, `SSOServerConfigController`, `ServerConfig`, and `DpopService` — all replaced by `ssoClient.http` (HttpClient from @tu-org/sso-client)
- Removed `token` from userStore and `onAuthStateChange` callback (AuthState no longer exposes tokens)
- Removed `getAccessToken()` and `createDpopProof()` from public SSOClient API
- Removed `refreshUserToken()` and `storeUserToken()` from userController
- Changed `isAuthenticated` from async method to sync boolean property
- API call signature changed: `api.get<T>({url, data})` → `api.get<T>(url, {params: data})`, `api.post<T>({url, data, contentType?})` → `api.post<T>(url, data)`, `api.delete({url})` → `api.delete(url)`

### Added
- SSOClient configured with `ssoFrontendUrl` and `apiBaseUrl` from environment variables
- `ssoClientAccessor.ts` — lazy getter pattern to avoid TDZ circular dependency between main.ts and router
- `apiConnector.ts` rewritten as lazy `setHttpClient()`/`getApiConnector()` accessor returning `ssoClient.http`
- `createAuthGuard()` from @tu-org/sso-client for route protection with public routes list
- `sso-client.d.ts` TypeScript declarations for the new SSOClient, HttpClient, and related types
- `sso:rebuild` script in package.json to rebuild the sso-client package
- Vite alias and optimizeDeps.exclude for @tu-org/sso-client source imports
- @tu-org/sso-client as a file: dependency in package.json

### Changed
- `main.ts` — creates SSOClient with new config shape (ssoUrl, ssoFrontendUrl, apiBaseUrl, clientId), removed ServerConfig/APIController/DpopService instantiation, onAuthStateChange syncs user without token
- `router/index.ts` — replaced inline PKCE code + manual auth redirect with `createAuthGuard()`, admin role check still manual after guard passes
- `userController.ts` — delegates register/recoverPassword/resetPassword/resendEmailVerification/logout to `getSSOClient()` methods instead of manual API calls
- 12 controllers migrated from `APIController` to `getApiConnector()` (HttpClient): stack, skillsCategories, projects, experience, certificates, freelancePlatform, freelanceComment, intro, post, contact, feedback, error
- `userService.ts` and `systemService.ts` migrated to `getApiConnector()` HttpClient
- `LoginPage.vue` — uses `getSSOClient().login()` instead of manual API call + token storage
- `AuthCallbackPage.vue` — uses `getSSOClient().handleCallback()` instead of manual code exchange + PKCE + DPoP
- `MenuComponent.vue` — uses `getSSOClient().loginWithRedirect()` and `getSSOClient().logout()`

### Removed
- `frontend/src/controllers/APIController.ts`
- `frontend/src/controllers/SSOAPIController.ts`
- `frontend/src/controllers/SSOServerConfigController.ts`
- `frontend/src/controllers/serverConfigController.ts`
- `frontend/src/services/dpopService.ts`
- `token` ref and `updateTokenProp()` from userStore
- Inline PKCE helper functions from router and components (generateCodeVerifier, generateCodeChallenge, base64UrlEncode)
- Manual Cookie-based token storage (Cookies.set/remove for user-token, refresh-token)

### Affected Files
- Modified: `frontend/package.json`
- Modified: `frontend/pnpm-lock.yaml`
- Modified: `frontend/vite.config.ts`
- Modified: `frontend/src/main.ts`
- Modified: `frontend/src/router/index.ts`
- Modified: `frontend/src/store/userStore.ts`
- Modified: `frontend/src/controllers/userController.ts`
- Modified: `frontend/src/controllers/stackController.ts`
- Modified: `frontend/src/controllers/skillsCategoriesController.ts`
- Modified: `frontend/src/controllers/projectsController.ts`
- Modified: `frontend/src/controllers/experienceController.ts`
- Modified: `frontend/src/controllers/certificatesController.ts`
- Modified: `frontend/src/controllers/freelancePlatformController.ts`
- Modified: `frontend/src/controllers/freelanceCommentController.ts`
- Modified: `frontend/src/controllers/introController.ts`
- Modified: `frontend/src/controllers/postController.ts`
- Modified: `frontend/src/controllers/contactController.ts`
- Modified: `frontend/src/controllers/feedbackController.ts`
- Modified: `frontend/src/controllers/errorController.ts`
- Modified: `frontend/src/services/userService.ts`
- Modified: `frontend/src/services/systemService.ts`
- Modified: `frontend/src/components/menu/MenuComponent.vue`
- Modified: `frontend/src/views/session/login/LoginPage.vue`
- Modified: `frontend/src/views/session/callback/AuthCallbackPage.vue`
- Added: `frontend/src/ssoClientAccessor.ts`
- Added: `frontend/src/apiConnector.ts`
- Added: `frontend/src/types/sso-client.d.ts`
- Deleted: `frontend/src/controllers/APIController.ts`
- Deleted: `frontend/src/controllers/SSOAPIController.ts`
- Deleted: `frontend/src/controllers/SSOServerConfigController.ts`
- Deleted: `frontend/src/controllers/serverConfigController.ts`
- Deleted: `frontend/src/services/dpopService.ts`

---

## 16.6.2 - 2026-05-04

### Summary
Fixed PKCE authentication flow implementation with security improvements and URL corrections.

### Fixed
- Improved PKCE security by using state-specific sessionStorage keys (`pkce_verifier_${state}`) instead of global key (`pkce_code_verifier`)
- Added `code_verifier` parameter to SSO redirect URL for proper PKCE flow completion
- Fixed AuthCallbackPage to retrieve code verifier using state parameter from callback
- Updated redirect URL from `/login` to `/auth/login` for SSO endpoint consistency
- Refactored token exchange to include code_verifier only when available

### Affected Files
- Modified: `frontend/src/components/menu/MenuComponent.vue`
- Modified: `frontend/src/router/index.ts`
- Modified: `frontend/src/views/session/callback/AuthCallbackPage.vue`

---

## 16.6.1 - 2026-05-04

### Summary
Translated deployment guide to English and replaced hardcoded localhost URLs with generic placeholders to improve documentation accessibility and environment neutrality.

### Changed
- Translated complete `DEPLOY.md` from Spanish to English
- Replaced hardcoded `localhost` URLs in `README.md` with `[direccion]:[puerto]` placeholders
- Updated architecture diagram, API examples, and environment configuration tables to use generic addressing

### Affected Files
- Modified: `DEPLOY.md`
- Modified: `README.md`

---

## 16.6.0 - 2026-05-03

### Summary
Added comprehensive deployment guide and corrected README documentation inaccuracies identified during codebase review.

### Added
- New `DEPLOY.md` with complete shared hosting deployment instructions including:
  - Apache `.htaccess` configuration for SPA routing
  - Ionic Capacitor Android build and APK generation steps
  - Backend deployment with Composer and environment setup
  - SSL certificate configuration guide

### Changed
- Updated README.md tech stack documentation:
  - Replaced incorrect "Laravel Sanctum" with "Laravel Passport + lcobucci/jwt"
  - Fixed Android directory path from `cd Android` to `cd frontend/android/`
  - Added environment variable configuration tables for backend and frontend
  - Improved system architecture diagram with localhost references
  - Unified SSO environment variable naming and documentation
  - Added mail configuration variables to backend documentation

### Removed
- Eliminated non-existent API endpoints from README documentation
- Removed duplicated content between README sections
- Removed production-specific configuration from README (now in DEPLOY.md)

### Affected Files
- Added: `DEPLOY.md`
- Modified: `README.md`

---

## 16.5.3 - 2026-05-03

### Summary
Translated complete README.md documentation from Spanish to English, improving accessibility for international users.

### Changed
- Project description, architecture diagram, and all sections now available in English
- Technical terminology maintained in English with clear explanations
- Updated all headers, instructions, API endpoints table, and deployment checklist

### Affected Files
- Modified: `README.md`

---

## 16.5.2 - 2026-05-03

### Summary
Consolidated separate backend and frontend README files into a single unified project README at the root level, providing comprehensive documentation for the entire portfolio application.

### Changed
- Removed duplicate backend README (backend/README.md)
- Removed duplicate frontend README (frontend/README.md)
- Created unified project README (README.md) with complete documentation including:
  - System architecture diagram with SSO, backend, and frontend components
  - Tech stack overview for frontend (Ionic/Vue) and backend (Laravel)
  - Complete installation and configuration instructions
  - SSO Server integration setup
  - Development and production environment configuration
  - API endpoints reference
  - APK generation instructions
  - Deployment checklist

### Affected Files
- Added: `README.md`
- Deleted: `backend/README.md`
- Deleted: `frontend/README.md`

---

## 16.5.1 - 2026-05-03

### Summary
Documentation updates to fix port references and clarify DPoP authentication flow in README files.

### Fixed
- Updated backend port from 8003 to 8000 in README documentation
- Updated SSO port from 8002 to 8001 in README documentation

### Changed
- Updated authentication architecture diagram to clearly show DPoP flow with RSA key pairs
- Added documentation for new SSO middleware (LocalJwtAuth, SSOTokenAuth) in backend README
- Added VITE_SSO_FRONTEND_URL and VITE_SSO_CLIENT_ID environment variables to frontend README
- Enhanced SSO configuration section with comprehensive setup instructions

### Affected Files
- Modified: `backend/README.md`
- Modified: `frontend/README.md`

---

## 16.5.0 - 2026-05-02

### Summary
Implemented PKCE (Proof Key for Code Exchange) for OAuth authorization code flow to enhance SSO authentication security. PKCE adds an additional layer of protection against authorization code interception attacks.

### Added
- New `generateCodeVerifier` function in router and AuthCallbackPage for generating cryptographically random code verifiers
- New `generateCodeChallenge` function for creating SHA-256 hashed code challenges
- New `base64UrlEncode` helper function for URL-safe base64 encoding
- Added `code_verifier` parameter to token exchange in AuthCallbackPage

### Changed
- Updated router guard to include `code_challenge` and `code_challenge_method` parameters in SSO redirect URL
- Updated AuthCallbackPage to include `code_verifier` in token exchange request
- Removed `login` method from userController (no longer needed with SSO)

### Affected Files
- Frontend:
  - Modified: `frontend/src/router/index.ts`
  - Modified: `frontend/src/views/session/callback/AuthCallbackPage.vue`
  - Modified: `frontend/src/controllers/userController.ts`

---

## 16.3.0 - 2026-05-01

### Summary
Added DPoP (Demonstrating Proof of Possession) authentication support for enhanced security when communicating with the SSO. This implementation includes backend JWT validation with DPoP proof verification and frontend DPoP proof generation using RSA key pairs stored in IndexedDB.

### Added
- New `LocalJwtAuth` middleware in backend for JWT token validation with DPoP support
- New `JwksService` in backend for fetching and caching public keys from SSO JWKS endpoint
- New `dpopService` in frontend for generating RSA key pairs and creating DPoP proofs
- DPoP header generation in `APIController` and `SSOAPIController` for authenticated requests
- Token type handling in `serverConfigController` and `LoginPage`
- Added `lcobucci/jwt` dependency to composer.json

### Changed
- Updated middleware alias from `SSOTokenAuth` to `LocalJwtAuth` in bootstrap/app.php
- Updated `userController` to include DPoP public key in login/register requests
- Updated `login` function in `LoginPage` to handle token_type

### Affected Files
- Backend:
  - Added: `backend/app/Http/Middleware/LocalJwtAuth.php`
  - Added: `backend/app/Services/JwksService.php`
  - Modified: `backend/bootstrap/app.php`
  - Modified: `backend/composer.json`
- Frontend:
  - Added: `frontend/src/services/dpopService.ts`
  - Modified: `frontend/src/controllers/APIController.ts`
  - Modified: `frontend/src/controllers/SSOAPIController.ts`
  - Modified: `frontend/src/controllers/serverConfigController.ts`
  - Modified: `frontend/src/controllers/userController.ts`
  - Modified: `frontend/src/main.ts`
  - Modified: `frontend/src/views/session/login/LoginPage.vue`

---

## 16.2.0 - 2026-05-01

### Summary
Added password confirmation support to user registration and replaced hardcoded client_id values with environment variable configuration.

### Added
- Added `password_confirmation` parameter to user registration endpoint

### Changed
- Changed hardcoded `client_id` to use environment variable `VITE_SSO_CLIENT_ID` in login function
- Changed hardcoded `client_id` to use environment variable `VITE_SSO_CLIENT_ID` in register function

---

## 16.1.3 - 2026-05-01

### Summary
Added missing @ionic/vue component imports across 69 Vue files to prevent runtime registration errors throughout the frontend.

### Fixed
- Added missing `IonPage`, `IonHeader`, `IonToolbar`, `IonTitle`, `IonContent` to 39 view and component files
- Added missing `IonButton`, `IonIcon`, `IonCard`, `IonRow`, `IonCol`, `IonGrid` to 27 view and component files
- Added missing `IonButtons`, `IonMenuButton` to 20 view and component files
- Added missing `IonItem`, `IonLabel` to 16 view and component files
- Added missing `IonAccordionGroup`, `IonAccordion`, `IonReorderGroup`, `IonReorder` to 5 component files
- Added missing `IonList`, `IonListHeader`, `IonCardContent`, `IonCardHeader`, `IonCardTitle` to 12 files
- Added missing `IonBreadcrumbs`, `IonBreadcrumb` to 5 admin list view files
- Added imports to 6 files (`CertificatesComponent.vue`, `CertificatesPage.vue`, `MarkdownCreator.vue`, `indexContentComponent.vue`, `modalIndexContent.vue`, `FilterOptionsComponent.vue`) that had no `@ionic/vue` import at all
- Removed unused imports from `EditorComponent.vue`, `InfoEditor.vue`, `UserPanelPage.vue`, `PoliciesPage.vue`, `CreatePostPage.vue`, `UpdatePostPage.vue`
- Fixed typo `<ion-butons>` → `<ion-buttons>` in `modalIndexContent.vue`

---

## 9.3.1 - 2026-05-01

### Summary
Fixed build errors that prevented production compilation.

### Fixed
- Changed `userSelected` from const to let in UsersPage.vue (was causing "constant reassignment" error)
- Fixed image path in ExperienceCard.vue (`../assets/` → `../../assets/`)
- Fixed image path in ProjectCard.vue (`../assets/` → `../../assets/`)

---

## 9.3.0 - 2026-04-30

### Summary
Restructured icons and technologies into a unified `icons` table with pack support. Simplified categories by removing unused sort_order field.

### Changed
- Renamed `technologies` table to `icons` with new `pack_name` field (lineicons/ionicons)
- Added foreign key `icon_id` to `socials` table (replaces `icon_name` column)
- Renamed pivot tables: `project_technologies` → `project_icons`, `experience_technologies` → `experience_icons`
- Renamed `category_skills_technologies` → `category_skills_tech`
- Removed `sort_order` field from `categories_skills` table
- Updated SkillsCategoryController to not handle sort_order
- Created new `Icon` model replacing `Technology`
- Updated `Social` model with icon() relationship

### Breaking Changes
- Requires `php artisan migrate` to run new migrations
- The `icon_name` column in `socials` is replaced by `icon_id` foreign key
- Technology model replaced by Icon model

---

## 16.1.2 - 2026-04-30

### Summary
Removed `image` and `sort_order` fields from `technologies` table. These fields are not used - technologies are displayed using their name as icon reference.

### Changed
- Removed `image` and `sort_order` columns from `technologies` table (migration required)
- Updated Technology model fillable fields to only include `name`
- Updated SkillsCategoryController to not handle image field
- Removed image from frontend TypeScript interfaces

### Breaking Changes
- Requires `php artisan migrate` to run new migration
- The image and sort_order fields are no longer available in technology data

---

## 16.1.1 - 2026-04-30

### Summary
Removed redundant `category` field from `technologies` table. Categories are already managed through `SkillsCategory` model with many-to-many relationship.

### Changed
- Removed `category` column from `technologies` table (migration required)
- Updated Technology model fillable fields
- Updated SkillsCategoryController to not handle category field
- Removed category from frontend TypeScript interfaces

### Breaking Changes
- Requires `php artisan migrate` to run new migration
- The category field is no longer available in technology data

---

## 16.1.0 - 2026-04-30

### Summary
This release separates the Freelance entity into two independent entities: FreelancePlatform and FreelanceComment. Each now has its own table, model, controller, and frontend components. Also fixes issues with SkillsCategory and improves code consistency.

### Changed
- Renamed Freelance model to FreelancePlatform
- Renamed table `freelances` to `freelance_platforms`
- Updated FreelanceComment to be an independent entity (removed platform_id FK)
- Fixed duplicate class name in SkillsCategoryController (SkillsSkillsCategory → SkillsCategory)
- Fixed SkillsCategory pivot table FK column name (category_id)
- Updated frontend to use separate FreelancePlatformController and FreelanceCommentController

### Added
- Created FreelanceComment model and controller
- Created freelanceCommentController.ts and freelanceCommentStore.ts
- Created new database migrations for tables separation

### Affected Files
- Backend:
  - Created: FreelancePlatform.php, FreelanceComment.php, FreelancePlatformController.php, FreelanceCommentController.php
  - Deleted: Freelance.php, CommentController.php
  - Modified: api.php, SkillsCategoryController.php, SkillsCategory.php
- Frontend:
  - Renamed: freelanceController.ts → freelancePlatformController.ts
  - Created: freelanceCommentController.ts, freelanceCommentStore.ts, freelancePlatformStore.ts
  - Deleted: freelanceController.ts, freelanceStore.ts
  - Modified: FreelanceEditor.vue, FreelanceListPage.vue, AdminFreelancePage.vue, HomeTemplate2.vue

### Breaking Changes
- Requires `php artisan migrate` to run new migrations
- FreelanceComments no longer linked to FreelancePlatforms (independent entities)

---

## 16.0.0 - 2026-04-30

### Summary
This major release implements a complete architectural refactoring to ensure each entity (IntroProfile, Stack, SkillsCategory, Projects, Experience, Certificates, Freelance) has its own dedicated table, model, and controller. This eliminates cross-entity logic and fixes the stack saving functionality.

### Changed
- Renamed `Category` model to `SkillsCategory` for consistency with other entity naming conventions
- Renamed table `categories` to `categories_skills` for clarity
- Updated AdminStackPage.vue to use StackController instead of IntroController
- Cleaned up introController.ts by removing stack-related code
- Fixed router import error (ICustomError moved to correct location)

### Removed
- Deleted `HomePageController.php` (redundant, was causing cross-entity issues)
- Deleted `HomePage.php` model (was sharing intro_profiles table)
- Deleted `Skill.php` model and `SkillController.php` (redundant, stack now serves this purpose)
- Deleted `skillsController.ts` and `skillsStore.ts` (frontend, replaced by stackController)
- Removed old API routes pointing to HomePageController:
  - `/api/get-projects`
  - `/api/get-experiences`
  - `/api/get-freelance`
  - `/api/get-skills`
  - `/api/get-certificates`
- Removed routes `SkillsListPage`, `SkillsEditPage`, `SkillsNewPage` from router

### Added
- Created cleanup migration to remove legacy JSON fields from intro_profiles table:
  - `stack`
  - `skill_categories`
  - `experience`
  - `projects`
  - `certificates`
  - `freelance`

### Affected Files
- Backend:
  - Deleted: HomePageController.php, SkillController.php, HomePage.php, Skill.php
  - Renamed: Category.php -> SkillsCategory.php
  - Modified: api.php, SkillsCategoryController.php
- Frontend:
  - Deleted: skillsController.ts, skillsStore.ts
  - Modified: introController.ts, introStore.ts, AdminStackPage.vue, AdminInfoPage.vue, router/index.ts

### Breaking Changes
- Requires `php artisan migrate` to run new cleanup migration
- Stack now stored in `stacks` table instead of `intro_profiles.stack` JSON field
- SkillsCategory stored in `categories_skills` table instead of `categories`
- All API routes that pointed to HomePageController now point to dedicated controllers

---

## 15.9.1 - 2026-04-29

### Summary
This release removes legacy authentication references and consolidates database migrations. The application now relies entirely on external SSO for authentication, eliminating local auth dependencies.

### Changed
- Removed `after()` clause from tags table creation (MariaDB/MySQL compatibility fix)
- Removed `HasApiTokens` trait from User and Post models

### Removed
- Deleted 10 legacy authentication migrations:
  - `create_password_resets_table.php`
  - `create_users_verify.php`
  - `create_reset_code_passwords_table.php`
  - `create_oauth_auth_codes_table.php`
  - `create_oauth_access_tokens_table.php`
  - `create_oauth_refresh_tokens_table.php`
  - `create_oauth_clients_table.php`
  - `create_oauth_personal_access_clients_table.php`
  - `create_sessions_table.php`
  - `drop_legacy_auth_tables.php`
- Deleted `config/passport.php`

### Affected Files
- Modified:
  - `backend/app/Models/User.php` (removed HasApiTokens)
  - `backend/app/Models/Post.php` (removed HasApiTokens)
  - `backend/database/migrations/2026_04_27_000003_create_relations_tables.php` (removed after clause)
- Deleted:
  - 10 migration files (see Removed section)
  - `backend/config/passport.php`

### Breaking Changes
- Requires `php artisan migrate:fresh` (tables removed)
- Authentication now handled entirely by external SSO

---

## 15.9.0 - 2026-04-29

### Summary
This release consolidates database migrations by integrating modification migrations into creation migrations, reducing the total number of migrations. This simplifies the migration history and improves maintainability.

### Changed
- Integrated `url` column into `tags` table creation migration (previously added via separate migration)
- Removed `status` column from `projects` table creation (previously dropped via separate migration)
- Consolidated homepage table modifications into single creation migration:
  - Table renamed from `homepage` to `intro_profiles` directly in creation
  - All JSON columns (`stack`, `skill_categories`, `experience`, `projects`, `certificates`, `freelance`, `show_contact_form`) created in initial migration

### Removed
- Deleted 7 modification migrations from 2026:
  - `add_url_to_tags_table`
  - `drop_status_from_projects_table`
  - `rename_homepage_to_intro_profiles`
  - `modify_show_contact_form_to_json`
  - `add_show_contact_form_to_homepage`
  - `add_homepage_sections_columns`
  - `rename_homepages_to_homepage`

### Affected Files
- Modified:
  - `backend/database/migrations/2026_01_17_220000_create_homepages_table.php` (renamed to intro_profiles with all columns)
  - `backend/database/migrations/2026_04_26_000002_create_projects_table.php` (removed status column)
  - `backend/database/migrations/2026_04_27_000003_create_relations_tables.php` (added url to tags)
  - `backend/app/Models/HomePage.php` (updated table name to intro_profiles, cast show_contact_form to array)
- Deleted:
  - 7 migration files (see Removed section above)

### Breaking Changes
- Requires `php artisan migrate:fresh` to apply changes (table renamed from `homepage` to `intro_profiles`)

---

## 15.8.0 - 2026-04-29

### Summary
This release refactors the home page to use Pinia stores directly through controllers, enabling reactive data updates from admin panel and inspection via Pinia browser extension. Each section in HomeTemplate2 now manages its own data via controllers while storing state in Pinia stores.

### Added
- Reactive getters to FreelanceController: `platforms` and `comments` for direct Pinia store access
- Reactive getters to IntroController: `data` and `showContactForm` for direct Pinia store access

### Changed
- Refactored HomeTemplate2.vue: replaced props-based data flow with controller-based reactive getters
- HomeTemplate2 now imports and uses all controllers directly (IntroController, ProjectsController, ExperienceController, SkillsCategoriesController, FreelanceController)
- Simplified HomePresentationPage.vue: removed all data loading logic, now only renders the template
- Each section in HomeTemplate2 now loads its own data via Promise.all in onMounted
- FinalSection now receives explicit props instead of $props binding
- Template now uses computed properties accessing controller getters for introData, categories, projects, experiences, etc.

### Affected Files
- `frontend/src/controllers/freelanceController.ts` (added reactive getters)
- `frontend/src/controllers/introController.ts` (added reactive getters)
- `frontend/src/templates/HomeTemplate2.vue` (full refactor to use controllers)
- `frontend/src/views/presentation/HomePresentationPage.vue` (simplified)

## 15.7.0 - 2026-04-29

### Summary
This release converts tags to links with optional URL support. Tags can now store an optional URL that is displayed as a clickable link icon in the frontend template, and users can manage them through the admin panel with proper Vuelidate validation.

### Added
- New migration to add `url` field to `tags` table
- TagItem interface now includes optional `url` field in types, store, and controller
- New route handling in IntroProfileController for reading/writing URL field

### Changed
- Refactored InfoEditor.vue: replaced chips display with inputs (name + URL) for each link
- Integrated Vuelidate validation with `$each` for array items using native `url` validator
- HomeTemplate2.vue: tags with URL now show link icon and open URL in new window on click
- AdminInfoPage.vue: updated tags type from string[] to TagItem[]
- IntroController.ts: updated tags type to TagItem[]

### Affected Files
- `backend/database/migrations/2026_04_29_000001_add_url_to_tags_table.php` (new)
- `backend/app/Models/Tag.php`
- `backend/app/Http/Controllers/Admin/IntroProfileController.php`
- `frontend/src/services/types.ts`
- `frontend/src/store/introStore.ts`
- `frontend/src/controllers/introController.ts`
- `frontend/src/views/admin/sections/AdminInfoPage.vue`
- `frontend/src/views/admin/editors/InfoEditor.vue`
- `frontend/src/templates/HomeTemplate2.vue`

## 15.6.0 - 2026-04-29

### Summary
This release converts the UsersComponent into a standalone page accessible from the menu, improving navigation and code organization.

### Added
- New `UsersPage` component (formerly UsersComponent) as a full Ionic page with ion-page structure
- New route: `/admin-panel/users` -> `UsersPage`
- MenuItem for "Usuarios" now navigates to UsersPage instead of UserPanelPage

### Changed
- Renamed `UsersComponent.vue` to `UsersPage.vue`
- Added ion-page, ion-header, and ion-content wrapper to UsersPage
- Menu "Usuarios" item now points to UsersPage with active route detection
- Added "UsersPage" to ADMIN_PAGES constant and adminRoutes guard

### Removed
- Removed users segment from PanelAdminPage (inline UsersComponent usage)
- Removed popover option for users in PanelAdminPage

### Affected Files
- `frontend/src/views/admin/users/UsersPage.vue` (renamed from UsersComponent.vue)
- `frontend/src/router/index.ts` (added route)
- `frontend/src/components/menu/MenuComponent.vue` (updated menu item)
- `frontend/src/views/admin/PanelAdminPage.vue` (removed embedded users component)

## 15.5.0 - 2026-04-28

### Summary
This release refactors the menu component to use a reusable MenuItem component, reducing code duplication and improving maintainability.

### Added
- New reusable `MenuItem` component with automatic route active detection
- Route constants: `ADMIN_PAGES`, `PRESENTATION_PAGES`, `BLOG_PAGES`

### Changed
- Refactored `MenuComponent` to use `MenuItem` for admin panel, user panel, presentation, blog, and policies
- Simplified template from ~270 lines to ~50 lines of repetitive code

### Fixed
- Removed unused functions (`login`, `signup`, `goToUserPanel`, `goToAdminPanel`)
- Removed unused imports (`isPlatform`, `ellipsisVerticalOutline`, `eventPopOverUserOptions`)

### Affected Files
- `frontend/src/components/menu/MenuComponent.vue` (refactored)
- `frontend/src/components/menu/MenuItem.vue` (new)

## 15.4.0 - 2026-04-28

### Summary
This release introduces separate API endpoints for platforms and comments management, along with several bug fixes for undefined errors and data loading issues.

### Added
- New `CommentController` for managing comments with dedicated endpoints
- New frontend methods: `addComment`, `updateComment`, `deleteComment`
- Auto-refresh functionality on FreelanceListPage using `onIonViewWillEnter`

### Changed
- Separated API endpoints: `profile-platforms` for platforms, `profile-comments` for comments
- FreelanceComment interface now uses flat fields (`comment_title`, `comment_text`, `comment_rating`) instead of nested `platformName`
- Backend FreelanceController methods renamed to `storePlatform`, `updatePlatform`, `destroyPlatform`
- Comments now sent as JSON instead of FormData
- FreelanceEditor now uses dedicated methods for platforms vs comments

### Fixed
- Fixed undefined errors when accessing `platforms.value` and `comments.value` in FreelanceEditor and FreelanceListPage
- Fixed logical condition error (changed `||` to `&&`) for data loading
- Fixed list not refreshing after adding/editing items

### Removed
- Removed `platformName` field from FreelanceComment interface
- Removed `platformName` display from FinalSection and FreelanceListPage
- Removed image platform display from comments in FinalSection

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/FreelanceController.php`
  - `backend/routes/api.php`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/sections/FreelanceListPage.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`
  - `frontend/src/views/presentation/information/InformationComponent.vue`
- Added:
  - `backend/app/Http/Controllers/Admin/CommentController.php`

---

## 15.3.1 - 2026-04-28

### Summary
This release fixes two critical issues in the CertificatesEditor component: a TypeError when loading certificates with invalid aptitudes data, and technologies not being sent to the backend when saving.

### Fixed
- Fixed TypeError ".map is not a function" when editing certificates by adding proper array type checking
- Fixed technologies not being sent to backend by filtering empty items and using correct format
- Improved data validation using Array.isArray() instead of falsy check to handle edge cases

### Changed
- Changed aptitudes mapping from conditional type ('icon'/'img') to always use 'icon' type (consistent with other editors)
- Now filters out empty iconName values before saving to prevent invalid data submission

### Affected Files
- Modified:
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`

---

## 15.3.0 - 2026-04-28

### Summary
This release removes the manual status selection from projects and replaces it with automatic status calculation based on project dates. Projects with an end date are marked as "finished", while projects without an end date are marked as "in progress".

### Removed
- Removed manual status selector (ion-select) from ProjectsEditor
- Removed status field from projects database table
- Removed status field from backend API response
- Removed status from frontend controller form data

### Changed
- Project status is now automatically calculated based on endDate: if endDate exists → "Terminado" (finished), otherwise → "En progreso" (progress)
- Status now displays correctly in ProjectsListPage and ProjectCard components
- Fixed end_date being sent as empty string when "Current" is selected to properly clear the value in the database

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/ProjectController.php`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
  - `frontend/src/components/projects/ProjectCard.vue`
- Added:
  - `backend/database/migrations/2026_04_28_000001_drop_status_from_projects_table.php`

---

## 15.2.0 - 2026-04-28

### Summary
This release adds the "Current" functionality to ProjectsEditor (matching ExperienceEditor), fixes date picker closing immediately, and resolves date mapping issues from the backend API.

### Added
- Added "Actualidad" (Current) checkbox to ProjectsEditor end date picker, allowing projects to be marked as currently in progress

### Fixed
- Fixed ion-datetime popover closing immediately when selecting a date in ProjectsEditor (added event binding, did-dismiss handler, and confirmation buttons)
- Fixed startDate and endDate not loading when editing projects (changed mapping from camelCase to snake_case in projectsController.ts)
- Fixed projects array access error (changed `projects[index]` to `projects.value[index]`)
- Added endDate validation in ProjectsEditor

### Changed
- ProjectsEditor now uses undefined instead of empty string for endDate when "Current" is selected (consistent with ExperienceEditor)

### Affected Files
- Modified:
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/controllers/projectsController.ts`

---

## 15.1.1 - 2026-04-28

### Summary
This release fixes an issue where ionicons were not rendering in the ExperienceCard component, causing blank icon placeholders in the experience section.

### Fixed
- Fixed IconRenderer to render ionicons when the icon source is not lineicons
- Changed import from specific ionicon to IonIcon component for dynamic rendering

### Affected Files
- Modified:
  - `frontend/src/components/IconRenderer.vue`

---

## 15.1.0 - 2026-04-28

### Summary
This release replaces the old specialized editor components with the reusable IconSelector component, adds type filtering via popover in the icon selector modal, and fixes scroll/border issues in the modal.

### Added
- Added type filtering popover in IconSelector to filter icons by category (Sociales/Tecnologías/Todos)
- Added designMode prop to ion-segment for consistent iOS/Android styling

### Changed
- Replaced TechSkillsEditor with IconSelector in SkillsEditor
- Replaced SocialsEditor with IconSelector in InfoEditor (component deleted)
- Updated IconSelector modal with improved scroll handling using height: 96%
- Simplified controllers (ExperienceController, ProjectController) by removing unused JSON parsing code

### Removed
- Deleted SocialsEditor.vue (replaced by direct IconSelector usage)
- Deleted TechSkillsEditor.vue (replaced by IconSelector)

### Fixed
- Fixed modal scroll in IconSelector - card no longer exceeds modal border
- Fixed responsive behavior using percentage-based height (96%) instead of fixed calculations

### Affected Files
- Modified:
  - `frontend/src/components/admin/IconSelector.vue`
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/controllers/systemController.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `backend/app/Http/Controllers/Admin/ExperienceController.php`
  - `backend/app/Http/Controllers/Admin/ProjectController.php`
  - `backend/app/Models/Experience.php`
  - `backend/app/Models/Project.php`
- Deleted:
  - `frontend/src/views/admin/editors/SocialsEditor.vue`
  - `frontend/src/views/admin/editors/TechSkillsEditor.vue`

---

## 15.0.0 - 2026-04-27

### Summary
This release standardizes the technology field naming across the entire application by renaming `name` to `iconName`, fixes JSON parsing issues when saving technologies, and adds logic to prevent duplicate technology creation.

### Added
- Added JSON parsing for technologies in ExperienceController and ProjectController store/update methods
- Added logic to find existing technology by iconName before creating new one (prevents duplicates)
- Made `id` optional in TechnologyItem interface for new records

### Changed
- Renamed `name` field to `iconName` in TechnologyItem interface (frontend/types.ts)
- Updated API responses in ExperienceController, ProjectController, and SkillsCategoryController to return `iconName` instead of `name`
- Updated syncTechnologies methods to use `iconName` for creating/updating technologies
- Simplified technology mapping in HomeTemplate2.vue (removed duplicate name field)
- Removed duplicate `name` field from SkillsCategoryTechItem interface

### Breaking Changes
- API response field changed: `technologies[].name` → `technologies[].iconName`
- Frontend interface field changed: `TechnologyItem.name` → `TechnologyItem.iconName`
- Frontend interface change: `TechnologyItem.id` is now optional

### Fixed
- Fixed "Undefined array key 'name'" error when creating new technologies without id
- Fixed JSON string not being parsed in ExperienceController and ProjectController

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/ExperienceController.php`
  - `backend/app/Http/Controllers/Admin/ProjectController.php`
  - `backend/app/Http/Controllers/Admin/SkillsCategoryController.php`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/skillsCategoriesStore.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`

---

## 14.1.0 - 2026-04-27

### Summary
This release refactors the social buttons in HomeTemplate2 to be dynamically rendered from props instead of hardcoded values, enabling configurable social links without code changes.

### Changed
- Refactored social buttons from hardcoded ion-button elements to dynamic v-for loop using `props.socials`
- Added `openSocialUrl(url)` function to open social URLs in new tab
- Social icons now resolved via `getIconByName(social.iconName)?.icon` for centralized icon management
- Removed unused icon imports: chatbox, logoGitlab, logoLinkedin, logoMastodon

### Affected Files
- Modified:
- `frontend/src/templates/HomeTemplate2.vue`

---

## 14.0.0 - 2026-04-27

### Summary
This major release renames the "Categorías" feature to "Skills Categories" throughout the application, including dedicated API endpoints with `/skills-categories` routes, updated backend controller, and refactored frontend components. This is a breaking change with new API endpoints and response format.

### Added
- New `SkillsCategoryController.php` for skills category management (renamed from CategoryController)
- New `skillsCategoriesController.ts` for frontend skills category operations
- New `skillsCategoriesStore.ts` for centralized state management
- New `SkillsCategoriesListPage.vue` for admin list view (renamed from SkillsListPage)
- New response keys: `skillsCategories` (array), `skillsCategory` (single item)

### Changed
- Renamed API endpoints from `/categories` to `/skills-categories`:
  - Public GET: `/categories` → `/skills-categories`
  - Admin POST: `/admin/categories` → `/admin/skills-categories`
  - Admin POST{id}: `/admin/categories/{id}` → `/admin/skills-categories/{id}`
  - Admin DELETE: `/admin/categories/{id}` → `/admin/skills-categories/{id}`
- Renamed routes from `/admin-panel/categories` to `/admin-panel/skills-categories`
- Updated response format: `categories` → `skillsCategories`, `category` → `skillsCategory`
- Updated controller class name: `CategoryController` → `SkillsCategoryController`
- Updated all frontend imports and references throughout the codebase
- Updated admin menu link and back button navigation targets

### Breaking Changes
- API endpoints changed: `/categories` → `/skills-categories`
- Response keys changed: `categories` → `skillsCategories`, `category` → `skillsCategory`
- Route URLs changed: `/admin-panel/categories` → `/admin-panel/skills-categories`
- Route names changed: `CategoriesListPage` → `SkillsCategoriesListPage`, etc.
- Controller class name changed: `CategoryController` → `SkillsCategoryController`

### Affected Files
- Renamed:
  - `backend/app/Http/Controllers/Admin/CategoryController.php` → `backend/app/Http/Controllers/Admin/SkillsCategoryController.php`
  - `frontend/src/controllers/categoriesController.ts` → `frontend/src/controllers/skillsCategoriesController.ts`
  - `frontend/src/store/categoriesStore.ts` → `frontend/src/store/skillsCategoriesStore.ts`
  - `frontend/src/views/admin/sections/SkillsListPage.vue` → `frontend/src/views/admin/sections/SkillsCategoriesListPage.vue`
- Modified:
  - `backend/routes/api.php`
  - `frontend/src/router/index.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/admin/AdminHomeMenu.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`
  - `frontend/src/views/presentation/categories/SkillsPage.vue`

---

## 13.14.0 - 2026-04-27

### Summary
This release introduces a dedicated Category entity with REST API, migrates tags, socials, and technologies from embedded JSON to normalized database tables, and updates models to use Eloquent relationships.

### Added
- New `Category` Eloquent model with name and sort_order fields
- New `Tag` Eloquent model with name and sort_order fields
- New `Social` Eloquent model with platform, url, and icon_name fields
- New `Technology` Eloquent model with name, category, image, and sort_order fields
- New `CategoryController.php` for category CRUD operations
- New database migrations for relations tables:
  - `create_relations_tables`: tags, socials, technologies, intro_profile_tags, intro_profile_socials, project_technologies, experience_technologies
  - `create_categories_tables`: categories, category_technologies
- Public GET endpoint `/categories` for retrieving categories
- Admin REST endpoints: POST/POST{id}/DELETE `/admin/categories`
- `TechnologyItem`, `TagItem`, `SocialItem` type definitions in types.ts
- `getIconByName()` usage in HomeTemplate2 for icon label resolution

### Changed
- Refactored `IntroProfile` model to use BelongsToMany relationships for tags and socials instead of JSON arrays
- Refactored `Project` model to use BelongsToMany relationship for technologies instead of JSON array
- Refactored `Experience` model to use BelongsToMany relationship for technologies instead of JSON array
- Updated `ExperienceController` and `ProjectController` with `syncTechnologies()` method for managing technology relationships
- Updated `IntroProfileController` to fetch tags and socials through relationships
- Refactored `categoriesStore.ts` to use Composition API with ref() and exported interfaces
- Updated `categoriesController.ts` to use new Category REST API endpoints
- Updated `introStore.ts` with `TagItem` and `SocialItem` interfaces
- Updated `InfoEditor.vue` to handle tag items as objects with name property
- Updated `SkillsEditor.vue` to use CategoryItem type and numeric IDs
- Updated `SkillsListPage.vue` to use `categories` instead of `skillCategories`
- Updated `HomeTemplate2.vue` to display tag names and resolve icon labels
- Updated `HomePresentationPage.vue` to load categories with controller

### Affected Files
- Added:
  - `backend/app/Http/Controllers/Admin/CategoryController.php`
  - `backend/app/Models/Category.php`
  - `backend/app/Models/Social.php`
  - `backend/app/Models/Tag.php`
  - `backend/app/Models/Technology.php`
  - `backend/database/migrations/2026_04_27_000003_create_relations_tables.php`
  - `backend/database/migrations/2026_04_27_000004_create_categories_tables.php`
- Modified:
  - `backend/app/Http/Controllers/Admin/ExperienceController.php`
  - `backend/app/Http/Controllers/Admin/IntroProfileController.php`
  - `backend/app/Http/Controllers/Admin/ProjectController.php`
  - `backend/app/Models/Experience.php`
  - `backend/app/Models/IntroProfile.php`
  - `backend/app/Models/Project.php`
  - `backend/routes/api.php`
  - `frontend/src/composables/iconsIndex.ts`
  - `frontend/src/controllers/categoriesController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/categoriesStore.ts`
  - `frontend/src/store/introStore.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/editors/SocialsEditor.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`

---

## 13.13.0 - 2026-04-27

### Summary
This release refactors all controllers to use instance-based store access with getter properties, replacing the previous module-level store references. List pages now access store data directly through controller instances using `storeToRefs`.

### Changed
- Refactored all controllers (categories, certificates, experience, projects) to use instance-based store access:
  - Removed module-level store instantiation (e.g., `const categoriesStore = useCategoriesStore()`)
  - Made `categoriesStore`/`certificatesStore`/`experienceStore`/`projectsStore` instance properties (public instead of private)
  - Converted exported store references to getter properties (`skillCategories`, `certificates`, `experiences`, `projects`)
  - Converted exported loading states to getter properties (`categoriesLoading`, `certificatesLoading`, `experiencesLoading`, `projectsLoading`)
- Updated all list pages (Certificates, Experience, Projects, Skills) to:
  - Import controller without store exports
  - Access store via `storeToRefs(controllerInstance.storeProperty)`
  - Removed inline type definitions from controllers (now use centralized types from services/types.ts)

### Affected Files
- Modified:
  - `frontend/src/controllers/categoriesController.ts`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/views/admin/sections/CertificatesListPage.vue`
  - `frontend/src/views/admin/sections/ExperienceListPage.vue`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`

---

## 13.12.0 - 2026-04-27

### Summary
This release introduces a new dedicated Skills entity with its own database table and REST API, separating skills management from the homepage JSON structure. It also refactors the intro/profile handling into a dedicated `IntroProfileController` for better code organization.

### Added
- New `Skill` Eloquent model with name, level, iconName, and sort_order fields
- New `SkillController.php` with full REST API (index, store, update, destroy)
- New `IntroProfile` Eloquent model for intro/profile data management
- New `IntroProfileController.php` for intro operations (getIntro, updateIntro)
- New database migration `create_skills_table` with dedicated skills table
- New database migration `rename_homepage_to_intro_profiles` for table refactoring
- Public GET endpoint `/skills` for retrieving skills
- Admin REST endpoints: POST/POST{id}/DELETE `/admin/skills`
- New frontend `skillsController.ts` with loadSkills, addSkill, deleteSkill, updateSkill methods
- New frontend `skillsStore.ts` for centralized skills state management

### Changed
- Refactored `get-intro` endpoint to use `IntroProfileController` instead of `HomePageController`
- Updated admin `update-intro` endpoint to use `IntroProfileController`
- Migrated skills from embedded JSON in homepage to separate skills table
- Changed skill category operations from action-based to RESTful:
  - `admin/add-skill-category` → `admin/skills` (POST)
  - `admin/update-skill-category` → `admin/skills/{id}` (POST)
  - `admin/delete-skill-category` → `admin/skills/{id}` (DELETE)

### Breaking Changes
- Skills data now stored in dedicated `skills` table instead of homepage JSON
- API changes for skills: different endpoint structure and response format

### Affected Files
- Added:
  - `backend/app/Http/Controllers/Admin/IntroProfileController.php`
  - `backend/app/Http/Controllers/Admin/SkillController.php`
  - `backend/app/Models/IntroProfile.php`
  - `backend/app/Models/Skill.php`
  - `backend/database/migrations/2026_04_27_000001_rename_homepage_to_intro_profiles.php`
  - `backend/database/migrations/2026_04_27_000002_create_skills_table.php`
  - `frontend/src/controllers/skillsController.ts`
  - `frontend/src/store/skillsStore.ts`
- Modified:
  - `backend/routes/api.php`

---

## 13.11.0 - 2026-04-27

### Summary
This release implements a dedicated Stack CRUD API following the RESTful architecture pattern established in previous releases. It adds a new Stack entity with full CRUD operations for managing technology stack items in the admin panel.

### Added
- New `StackController.php` for backend Stack CRUD operations (index, store, show, update, destroy)
- New `Stack` Eloquent model with name, img, and sort_order fields
- New database migration `create_stacks_table` with id, name, img, sort_order, timestamps
- New `stackController.ts` frontend controller with loadStack, addStack, deleteStack, updateStack methods
- Public GET endpoint `/stacks` for retrieving stack items
- Admin API endpoints: POST `/admin/stacks`, POST `/admin/stacks/{id}`, DELETE `/admin/stacks/{id}`
- Image upload support with automatic old image cleanup on update
- Multipart form data support with MIME-to-extension mapping
- StackStore integration for centralized state management

### Affected Files
- Added:
  - `backend/app/Http/Controllers/Admin/StackController.php`
  - `backend/app/Models/Stack.php`
  - `backend/database/migrations/2026_04_27_000000_create_stacks_table.php`
  - `frontend/src/controllers/stackController.ts`
- Modified:
  - `backend/routes/api.php`
  - `frontend/src/store/stackStore.ts`

---

## 13.10.0 - 2026-04-26

### Summary
This release refactors admin list pages to use reactive Pinia store data via `storeToRefs` instead of local component refs, and updates controllers to use direct store mutations instead of reloading from API after CRUD operations.

### Added
- New `storeToRefs` exports from all controllers:
  - `categoriesController`: `skillCategories`, `categoriesLoading`
  - `certificatesController`: `certificates`, `certificatesLoading`
  - `experienceController`: `experiences`, `experiencesLoading`
  - `projectsController`: `projects`, `projectsLoading`
- New direct store mutations in controllers after CRUD operations:
  - `loadCategories()` now returns categories, updates store via `addSkillCategory`, `setSkillCategories`
  - `loadPublicCertificates()` now returns certificates, updates store via `addCertificate`, `setCertificates`
  - `loadPublicExperiences()` now returns experiences, updates store via `addExperience`, `setExperiences`
  - `loadPublicProjects()` now returns projects, updates store via `addProject`, `setProjects`

### Changed
- Updated list pages to use reactive store data via `storeToRefs` instead of local refs:
  - `CertificatesListPage.vue`: uses `certificates` from store
  - `ExperienceListPage.vue`: uses `experiences` from store
  - `ProjectsListPage.vue`: uses `projects`, `projectsLoading` from store
  - `SkillsListPage.vue`: uses `skillCategories`, `categoriesLoading` from store
- Controllers now use direct store mutations instead of calling reload methods:
  - `addCategory`/`addCertificate`/`addExperience`/`addProject`: use store add + set methods
  - `deleteCategory`/`deleteCertificate`/`deleteExperience`/`deleteProject`: use store delete + set methods
  - `updateCategory`/`updateCertificate`/`updateExperience`/`updateProject`: use store update + set methods
- Controllers include index validation before performing operations to avoid unnecessary API calls

### Affected Files
- Modified:
  - `frontend/src/controllers/categoriesController.ts`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/views/admin/sections/CertificatesListPage.vue`
  - `frontend/src/views/admin/sections/ExperienceListPage.vue`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`

---

## 13.9.0 - 2026-04-26

### Summary
This release implements a RESTful API architecture by creating dedicated Laravel controllers and models for each entity (Experience, Project, Freelance, Certificate), replacing the previous monolithic HomePageController approach. The frontend has been updated to consume the new REST endpoints with proper HTTP methods.

### Added
- New dedicated Laravel controllers: `ExperienceController`, `ProjectController`, `FreelanceController`, `CertificateController`
- New Eloquent models: `Experience`, `Project`, `Freelance`, `Certificate`
- New database migrations creating separate tables for each entity
- RESTful GET endpoints: `/experiences`, `/projects`, `/certificates`, `/freelances`
- DELETE method in frontend APIController

### Changed
- Converted admin API routes from action-based to RESTful pattern:
  - `admin/add-*` → `admin/*` (POST)
  - `admin/update-*` → `admin/*/{id}` (POST)
  - `admin/delete-*` → `admin/*/{id}` (DELETE)
- Updated all frontend controllers to use REST endpoints with FormData instead of JSON payloads
- Changed public GET endpoints from `get-*` to RESTful `/experiences`, `/projects`, `/certificates`, `/freelances`
- Controllers now return single item responses (`{ item }`) instead of arrays for add/update operations

### Affected Files
- Added:
  - `backend/app/Http/Controllers/Admin/CertificateController.php`
  - `backend/app/Http/Controllers/Admin/ExperienceController.php`
  - `backend/app/Http/Controllers/Admin/FreelanceController.php`
  - `backend/app/Http/Controllers/Admin/ProjectController.php`
  - `backend/app/Models/Certificate.php`
  - `backend/app/Models/Experience.php`
  - `backend/app/Models/Freelance.php`
  - `backend/app/Models/Project.php`
  - `backend/database/migrations/2026_04_26_000001_create_experiences_table.php`
  - `backend/database/migrations/2026_04_26_000002_create_projects_table.php`
  - `backend/database/migrations/2026_04_26_000003_create_certificates_table.php`
  - `backend/database/migrations/2026_04_26_000004_create_freelances_table.php`
- Modified:
  - `backend/routes/api.php`
  - `frontend/src/controllers/APIController.ts`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/projectsController.ts`

---

## 13.8.1 - 2026-04-26

### Summary
This release refactors the tech skills editor components to use ref-based access instead of event-based v-model, allowing parent components to directly access the tech skills data when saving.

### Changed
- Refactored TechSkillsEditor to use v-model directly and expose modelValue via defineExpose
- Updated CertificatesEditor, ExperienceEditor, and SkillsEditor to use ref-based access to TechSkillsEditor instead of @update:model-value event
- Added openNewSelector function in IconSelector for consistent "add new" behavior
- Removed duplicate TechItem interface from SkillsEditor

### Affected Files
- Modified:
  - `frontend/src/components/admin/IconSelector.vue`
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/editors/TechSkillsEditor.vue`

---

## 13.8.0 - 2026-04-26

### Summary
This release refactors the admin editor components to use local component state instead of Pinia stores, and introduces a new stackStore for improved state management. Controllers now return data directly for better component control.

### Added
- New `stackStore.ts` for stack section state management with setStack and setLoading methods

### Changed
- Refactored all editor components (CertificatesEditor, ExperienceEditor, FreelanceEditor, InfoEditor, ProjectsEditor, SkillsEditor) to use local component state (loading, saving, loaded refs) instead of Pinia store computed properties
- Refactored controllers to return data directly instead of storing in Pinia stores
- Updated AdminFreelancePage to manage freelance data locally with ref-based state
- Updated AdminInfoPage to manage form data locally with reactive state
- Updated AdminStackPage to manage stack data locally with ref-based state
- Simplified InfoEditor with v-model patterns and removed form object wrapper
- Removed saving state from introStore (no longer needed with local component state)
- Removed faker dependency usage in FreelanceEditor (replaced with static test data)

### Affected Files
- Added:
  - `frontend/src/store/stackStore.ts`
- Modified:
  - `frontend/src/controllers/categoriesController.ts`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/introController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/store/freelanceStore.ts`
  - `frontend/src/store/introStore.ts`
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/editors/SocialsEditor.vue`
  - `frontend/src/views/admin/sections/AdminFreelancePage.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`
  - `frontend/src/views/admin/sections/CertificatesListPage.vue`
  - `frontend/src/views/admin/sections/ExperienceListPage.vue`
  - `frontend/src/views/admin/sections/FreelanceListPage.vue`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`

---

## 13.7.0 - 2026-04-25

### Summary
This release adds LineIcons support with 150+ additional icons, implements source filtering in IconSelector (ionicons/lineicons), and updates dependencies.

### Added
- LineIcons integration with `@lineiconshq/free-icons` and `@lineiconshq/vue-lineicons` packages
- New `IconRenderer.vue` component for rendering both IonIcons and LineIcons
- New `iconsIndex.ts` composable unifying icon sources with `getIconsBySource()`, `getIconsBySourceAndType()`, `isLineIcon()`, and `getIconColor()` functions
- New `lineiconsConfig.ts` with 150+ LineIcons (social and tech categories)
- Segment-based icon source filtering in IconSelector (all/ionicons/lineicons)
- Icon source display in icon list

### Changed
- Refactored IconSelector to support multiple icon sources with unified interface
- Updated IconSelector modal with source segment selection
- Removed validation UI from SocialsEditor for simplified UX
- Fixed icon URL input to handle empty strings correctly
- Fixed IconSelector modal background styling
- Updated eslint-config-prettier to v10.1.8
- Added 15 new IonIcons: logoMastodon, logoFoursquare, logoFlickr, logoHackernews, logoDesignernews, logoXing, logoYahoo, logoStencil, logoTableau, logoPwa, logoAlipay, logoAmplify, logoAppflow

### Affected Files
- Added:
  - `frontend/src/components/IconRenderer.vue`
  - `frontend/src/composables/iconsIndex.ts`
  - `frontend/src/composables/lineiconsConfig.ts`
- Modified:
  - `frontend/src/components/admin/IconSelector.vue`
  - `frontend/src/composables/iconConfig.ts`
  - `frontend/src/composables/useIconColors.ts`
  - `frontend/src/views/admin/editors/SocialsEditor.vue`
  - `frontend/package.json`
  - `frontend/pnpm-lock.yaml`

---

## 13.6.0 - 2026-04-25

### Summary
This release adds a reusable IconSelector component with centralized icon configuration, refactors SocialsEditor and TechSkillsEditor to use the new component, and adds toast duration support for customizable display times.

### Added
- New reusable `IconSelector.vue` component with icon picker modal and search functionality
- New `iconConfig.ts` composable with centralized icon configuration for 70+ icons (social and tech types)
- `getIconsByType()` function to filter icons by type ("social" | "tech")
- `getIconByName()` function to get icon configuration by name
- `getIconColor()` function to get icon color
- New `duration` field to Toast interface for customizable toast display time

### Changed
- Refactored `useIconColors.ts` to use centralized iconConfig instead of hardcoded colors
- Refactored `SocialsEditor.vue` to use new IconSelector component
- Refactored `TechSkillsEditor.vue` to use new IconSelector component
- Updated toastController to accept optional duration parameter with default 2000ms

### Affected Files
- Added:
  - `frontend/src/components/admin/IconSelector.vue`
  - `frontend/src/composables/iconConfig.ts`
- Modified:
  - `frontend/src/composables/useIconColors.ts`
  - `frontend/src/controllers/toastController.ts`
  - `frontend/src/utils/interfaces.ts`
  - `frontend/src/views/admin/editors/SocialsEditor.vue`
  - `frontend/src/views/admin/editors/TechSkillsEditor.vue`

---

## 13.5.0 - 2026-04-25

### Summary
This release adds toast notifications to all admin controllers for user feedback on CRUD operations. Success and error messages are now displayed after add, update, delete, and save operations across all admin sections.

### Added
- Toast notifications in categoriesController for addCategory, deleteCategory, and updateCategory operations
- Toast notifications in certificatesController for deleteCertificate and updateCertificate operations
- Toast notifications in experienceController for deleteExperience and updateExperience operations
- Toast notifications in freelanceController for save, addFreelance, updateFreelance, and deleteFreelance operations with error handling
- Toast notifications in introController for save operation with error handling
- Toast notifications in projectsController for addProject, deleteProject, and updateProject operations
- ToastController instantiation in freelanceController and introController
- useRouter navigation in AdminFreelancePage, AdminInfoPage, and AdminStackPage for post-save redirects

### Changed
- Updated SkillsEditor to check deleteCategory success before navigating away
- Updated AdminFreelancePage to redirect to freelance list after saving
- Updated AdminInfoPage to redirect to admin panel after saving
- Updated AdminStackPage to redirect to admin panel after saving

### Affected Files
- Modified:
  - `frontend/src/controllers/categoriesController.ts`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/introController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/sections/AdminFreelancePage.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`

---

## 13.4.0 - 2026-04-25

### Summary
This release integrates Pinia stores into the freelance and intro controllers for centralized state management. Admin pages now use store-based computed properties for loading/saving states, providing better reactivity and eliminating local loading/saving refs.

### Added
- Pinia store integration in freelanceController with useFreelanceStore for centralized state management
- Pinia store integration in introController with useIntroStore for centralized state management
- setLoading and setSaving methods to freelanceStore and introStore for external loading state management
- allFreelance computed property in freelanceStore that merges platforms with their comments

### Changed
- Refactored freelanceController to use freelanceStore.setPlatforms/setComments instead of returning separated data
- Refactored introController to use introStore.setData for centralized data storage
- Updated FreelanceEditor to use freelanceStore.loading and freelanceStore.saving computed properties
- Updated SkillsEditor to use categoriesStore.loading and categoriesStore.saving computed properties
- Updated AdminFreelancePage to use freelanceStore.allFreelance and freelanceStore.saving
- Updated AdminStackPage to use introStore.form, introStore.saving, and introStore.loading
- Updated CertificatesListPage, ExperienceListPage, ProjectsListPage, SkillsListPage to use store-based data and loading states
- Changed import paths from absolute (@/controllers/) to relative (./) in freelanceController and introController

### Affected Files
- Modified:
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/introController.ts`
  - `frontend/src/store/freelanceStore.ts`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/sections/AdminFreelancePage.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`
  - `frontend/src/views/admin/sections/CertificatesListPage.vue`
  - `frontend/src/views/admin/sections/ExperienceListPage.vue`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`

---

## 13.3.0 - 2026-04-25

### Summary
This release removes the source image feature for projects that was added in the previous release but never had backend support. The feature is being removed to simplify the codebase until proper backend image handling is implemented.

### Removed
- Removed `img` field from project `source` type in types.ts
- Removed `sourceImageFile` parameter from `addProject` and `updateProject` methods in projectsController
- Removed source image upload UI from ProjectsEditor: file input, preview button, and related handlers
- Removed source image display from ProjectDetailModal component

### Affected Files
- Modified:
  - `frontend/src/components/projects/ProjectDetailModal.vue`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`

---

## 13.2.0 - 2026-04-25

### Summary
This release adds a backend image serving endpoint with proper MIME type detection and CORS support, and refactors the frontend image upload flow to pass File objects directly instead of converting blob URLs.

### Added
- New `serveImage` endpoint in SystemController for serving images with proper Content-Type headers
- MIME type mapping for common image formats (jpg, jpeg, png, gif, webp, svg, ico)
- CORS headers for cross-origin image requests (Access-Control-Allow-Origin: *)
- Cache-Control header with 1-year max-age for images
- OPTIONS route handler for serve-image endpoint
- New `getExtensionFromMime` helper method in HomePageController for MIME-to-extension mapping

### Changed
- Updated all editor components to pass File objects directly to controllers instead of converting blob URLs
- Simplified `pendingFiles` object pattern to individual `pendingImageFile` variables across all editors
- Refactored image URL generation from `asset()` to `url('api/serve-image?path=...')` for consistent image serving
- Updated add/update methods in all controllers to accept optional File parameters

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `backend/app/Http/Controllers/SystemController.php`
  - `backend/routes/api.php`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`

---

## 13.1.0 - 2026-04-24

### Summary
This release adds "Current Job" functionality to the Experience Editor, allowing users to mark positions as ongoing without an end date. It also improves the date picker UX with proper popover positioning and localized button labels.

### Added
- New "Actualidad" (Current Job) checkbox in Experience Editor to mark positions as current/ongoing
- New `isCurrentJob` ref state to track current job status
- New `endDateTouched` ref state for validation tracking
- New `endDateError` computed property for end date validation
- New `syncAndOpenEndDatePopover` function to sync current job state when opening popover
- New `onIsCurrentJobClick` handler for checkbox interaction
- Confirm and cancel buttons for date pickers with localized text ("Aceptar", "Cancelar")
- Event prop for proper popover positioning

### Fixed
- Fixed popover dismiss event handling: changed from deprecated `ion-popover-dismiss` to `did-dismiss`
- Fixed popover positioning by adding event prop to ion-popover
- Added validation error when end date is required but neither date nor "Actualidad" is selected

### Changed
- Updated date pickers to use `show-default-buttons` with localized labels
- Updated formattedEndDate to display "Actual" when isCurrentJob is true

### Affected Files
- Modified:
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`

---

## 13.0.0 - 2026-04-24

### Summary
This major release renames the "Skills" feature to "Categorías" (Categories) throughout the application, including route URL changes, controller/store refactoring, and dynamic category loading. This is a breaking change that updates public-facing URLs.

### Added
- New CategoriesController for category data operations (renamed from SkillsController)
- New categoriesStore for category state management (renamed from skillsStore)
- Reactive watch in TechCloudBackground to dynamically update background technologies when props change
- Dynamic category loading in HomeTemplate2 using CategoriesController

### Changed
- Renamed routes from `/home/skills` to `/home/categories` (SkillsPage -> CategoriesPage)
- Renamed routes from `/admin-panel/skills` to `/admin-panel/categories` (CategoriesListPage, CategoriesEditor)
- Renamed all UI labels from "Skills" to "Categorías" in menus, templates, and admin pages
- Updated background section ID from `section-skills` to `section-categories`
- Updated CSS class from `.skills-grid` to `.categories-grid`
- Updated default title in TechCloudBackground from "My Skillsets" to "My Categorías"

### Breaking Changes
- Route URLs changed: `/home/skills` → `/home/categories`
- Admin route URLs changed: `/admin-panel/skills` → `/admin-panel/categories`
- Route names changed: SkillsPage → CategoriesPage, SkillsListPage → CategoriesListPage, etc.
- Controller name changed: SkillsController → CategoriesController
- Store name changed: skills → categories

### Affected Files
- Renamed:
  - `frontend/src/controllers/skillsController.ts` → `frontend/src/controllers/categoriesController.ts`
  - `frontend/src/store/skillsStore.ts` → `frontend/src/store/categoriesStore.ts`
  - `frontend/src/views/presentation/skills/SkillsPage.vue` → `frontend/src/views/presentation/categories/SkillsPage.vue`
- Modified:
  - `frontend/src/router/index.ts`
  - `frontend/src/App.vue`
  - `frontend/src/components/common/TechCloudBackground.vue`
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/services/types.ts`
  - `frontend/src/templates/HomeTemplate1.vue`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/admin/AdminHomeMenu.vue`
  - `frontend/src/views/admin/HomeEditorComponent.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`
  - `frontend/src/views/presentation/header/Header.vue`

---

### Summary
This release fixes overly restrictive validation rules in the admin API endpoints. The validation previously required array objects for all data fields, but the frontend sends single objects. This fix allows the backend to accept any valid value instead of strictly requiring arrays.

### Fixed
- Relaxed validation rules in HomePageController to accept any required value instead of requiring array type:
  - `addProject` and `updateProject`: project validation changed from `'required|array'` to `'required'`
  - `addExperience` and `updateExperience`: experience validation changed from `'required|array'` to `'required'`
  - `addFreelance` and `updateFreelance`: freelance validation changed from `'required|array'` to `'required'`
  - `addSkillCategory` and `updateSkillCategory`: skillCategory validation changed from `'required|array'` to `'required'`
  - `addCertificate` and `updateCertificate`: certificate validation changed from `'required|array'` to `'required'`

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`

---

## 12.20.0 - 2026-04-24

### Summary
This release completes the CRUD operations for all homepage sections by adding individual update endpoints. All editors now use ID-based operations instead of the previous batch-based approach, enabling proper update functionality with automatic image cleanup.

### Added
- New backend API endpoints for individual update operations:
  - `admin/update-project`, `admin/update-experience`, `admin/update-freelance`
  - `admin/update-skill-category`, `admin/update-certificate`
- Automatic image cleanup when deleting certificates and freelance items
- Validation for all delete endpoints to ensure ID is provided
- New `getPlatformById`, `getCommentById`, `updatePlatformById`, `updateCommentById` methods to freelanceStore

### Changed
- Refactored all frontend editors to use ID-based operations instead of index-based
- Changed list pages from index-based to ID-based deletion
- Removed batch save methods: `saveCertificate`, `saveExperience`, `saveProject`, `saveSkillCategory`

### Breaking Changes
- All CRUD operations now require an `id` field
- Index-based deletion replaced with ID-based approach

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `backend/routes/api.php`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/controllers/skillsController.ts`
  - `frontend/src/store/freelanceStore.ts`
  - All editor and list page components

---

## 12.19.0 - 2026-04-24

### Summary
This release adds mobile-first responsive improvements with scrollable navigation, iOS-specific styling, and improved header visibility controls. It also enhances the Experience and Portfolio pages with better navigation and grid layouts.

### Added
- iOS platform detection in ProjectCard and ExperienceCard for platform-specific flip card heights (296px)
- Avatar visibility control based on scroll position: shows avatar on mobile when not scrolled, hides when scrolled
- Scrollable navigation menu for mobile devices with auto-scrolling active button into view
- Tablet responsive layout: displays 4 items instead of 3 for tablets (576-991px)
- Scroll event handling with handleScroll() for tracking scroll position
- Responsive section heights for iOS: 130dvh for ≤410px, 167dvh for ≤375px
- isTablet computed property for tablet detection

### Changed
- Improved intersection observer with simplified threshold (0) and adaptive rootMargin for mobile/desktop
- Updated ExperiencePage: replaced menu button with back button, added responsive grid layout
- Updated PortfolioPage: replaced menu button with back button, added responsive grid layout
- Changed section heights: 124dvh mobile, 84dvh desktop (was 64dvh)
- Simplified ref type casting in ProjectCard (removed complex type assertion)
- Updated projects/experiences grid with additional responsive breakpoints (size-sm="6", size-md="6")

### Affected Files
- Modified:
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/experience/ExperiencePage.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`

---

## 12.18.0 - 2026-04-23

### Summary
This release adds admin-only access middleware to protect administrative API endpoints and refactors the frontend API controller to use browser cookies for authentication token storage instead of the previous ServerConfig approach.

### Added
- New `AdminOnly` middleware in `backend/app/Http/Middleware/AdminOnly.php` to restrict access to admin-only routes
- Registration of `admin.only` middleware alias in bootstrap/app.php
- Cookie-based token retrieval in APIController using js-cookie library

### Changed
- Refactored admin routes under `/admin` prefix with `admin.only` middleware protection
- Changed token handling from ServerConfig to cookies for Bearer token authentication
- Reorganized routes: public auth routes, authenticated routes, and admin-only routes in separate groups

### Affected Files
- Added:
  - `backend/app/Http/Middleware/AdminOnly.php`
- Modified:
  - `backend/bootstrap/app.php`
  - `backend/routes/api.php`
  - `frontend/src/controllers/APIController.ts`

---

## 12.17.0 - 2026-04-23

### Summary
This release adds individual CRUD operations for all homepage sections, enabling add and delete functionality through dedicated API endpoints instead of batch updates. All data types now include an `id` field for proper identification, replacing the previous index-based deletion approach.

### Added
- New backend API endpoints for individual add/delete operations:
  - `admin/add-project`, `admin/delete-project`
  - `admin/add-experience`, `admin/delete-experience`
  - `admin/add-freelance`, `admin/delete-freelance`
  - `admin/add-skill-category`, `admin/delete-skill-category`
  - `admin/add-certificate`, `admin/delete-certificate`
- New `id` field to all data types: `StackItem`, `SkillCategory`, `ExperienceItem`, `ProjectItem`, `CertificateItem`, `FreelanceItem`, `FreelancePlatform`, `FreelanceComment`
- New optional `date` field to `ExperienceItem` and `ProjectItem` types
- New `saving` state to skillsStore for loading feedback

### Changed
- Refactored all controllers to use new individual add/delete endpoints instead of batch updates
- Changed deletion mechanism from index-based to ID-based for better reliability
- Updated frontend controllers to handle new API response structure

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `backend/routes/api.php`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/controllers/skillsController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/skillsStore.ts`

---

## 12.16.0 - 2026-04-22

### Summary
This release refactors the homepage data management from a monolithic structure into modular endpoints, allowing independent CRUD operations for each section. It also fixes a TypeScript type issue where `getdesignMode()` could return `void`.

### Added
- New `introController.ts` for intro section data loading and saving operations
- New `introStore.ts` (renamed from homeEditorStore) for intro section state management
- Separate backend API endpoints: `get-intro`, `get-projects`, `get-experiences`, `get-freelance`, `get-skills`, `get-certificates`
- Separate admin API endpoints: `admin/update-intro`, `admin/update-projects`, `admin/update-experiences`, `admin/update-freelance`, `admin/update-skills`, `admin/update-certificates`

### Changed
- Split monolithic `HomePageController` into dedicated methods: `getIntro`, `getProjects`, `getExperiences`, `getFreelance`, `getSkills`, `getCertificates`
- Renamed `homeEditorStore.ts` to `introStore.ts` for clearer scope
- Updated all controllers to use granular endpoints instead of single `get-homepage-info`
- Made auth token optional in APIController for public endpoints (no Authorization header when token is undefined)
- Updated HomePresentationPage to load data in parallel using Promise.all

### Fixed
- TypeScript error in systemController.ts where `getdesignMode()` return type was `void | DesignMode` instead of `DesignMode`

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `backend/routes/api.php`
  - `frontend/src/controllers/APIController.ts`
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/controllers/skillsController.ts`
  - `frontend/src/controllers/systemController.ts`
- Added:
  - `frontend/src/controllers/introController.ts`
  - `frontend/src/store/introStore.ts`
- Deleted:
  - `frontend/src/controllers/homeEditorController.ts`
  - `frontend/src/store/homeEditorStore.ts`
- Modified:
  - `frontend/src/views/admin/sections/AdminFreelancePage.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`
  - `frontend/src/views/certificates/CertificatesPage.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`
  - `frontend/src/views/presentation/certificates/CertificatesComponent.vue`
  - `frontend/src/views/presentation/information/InformationComponent.vue`
  - `frontend/src/views/presentation/skills/SkillsPage.vue`

---

## 12.15.1 - 2026-04-22

### Summary
This release improves the responsive layout for experience and portfolio pages by simplifying column sizing and using a more consistent mobile-first approach.

### Changed
- Updated ExperiencePage.vue: simplified outer ion-col to size="12" for full-width mobile layout
- Updated ExperiencePage.vue: changed inner ion-col to size="12" size-lg="4" for stacked mobile and grid desktop
- Updated PortfolioPage.vue: simplified outer ion-col to size="12" for full-width mobile layout
- Updated PortfolioPage.vue: changed inner ion-col to size="12" size-lg="4" for stacked mobile and grid desktop

### Affected Files
- Modified:
  - `frontend/src/views/experience/ExperiencePage.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`

---

## 12.15.0 - 2026-04-22

### Summary
This release separates freelance data into distinct platform and comment structures, enabling independent management of each type. The admin panel now uses a two-column layout with separate CRUD operations for platforms and comments.

### Added
- New `FreelancePlatform` interface with `name`, `image`, and `url` fields for independent platform data
- New `FreelanceComment` interface with `platformName`, `title`, `text`, and `rating` fields for independent comment data
- `convertToSeparatedData()` method in freelanceController to split freelance items into separate data structures
- `freelancePlatforms` and `freelanceComments` properties in HomePageData type
- Backward-compatible legacy routes (FreelanceEditPageOld, FreelanceNewPageOld) for migration support
- `getPlatformImage()` helper function in FinalSection for mapping comments to their platform images

### Changed
- Refactored `loadFreelance()` in freelanceController to return `{freelancePlatforms, freelanceComments}` object
- Refactored `saveFreelance()` in freelanceController to accept separate platforms and comments arrays
- Refactored `deleteFreelanceItem()` to accept `type` parameter ("platform" | "comment")
- Refactored freelanceStore: split single `freelance` array into `platforms` and `comments` with dedicated CRUD methods
- Refactored FreelanceEditor.vue: conditionally renders platform form or comment form based on route type parameter
- Refactored FreelanceListPage.vue: displays two-column layout with separate platform and comment sections
- Updated routes to include type parameter: `/admin-panel/freelance/:type(platform|comment)/new` and `/edit/:index`
- Updated FinalSection to iterate over `freelancePlatforms` and `freelanceComments` separately
- Updated InformationComponent and HomePresentationPage to use separated data structures

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/router/index.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/freelanceStore.ts`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/sections/FreelanceListPage.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`
  - `frontend/src/views/presentation/information/InformationComponent.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`

---

## 12.14.1 - 2026-04-22

### Summary
This release improves the collaboration section layout with better centering, simplified column structure, and enhanced swiper configuration for better testimonial display.

### Changed
- Restructured FinalSection layout with improved centering using align-items: center
- Simplified column sizes: size="12" size-lg="8" for better mobile-first responsive layout
- Updated swiper configuration: slides-per-view="1", centered-slides, max-width 600px container
- Refactored template structure with div wrapper for cleaner layout hierarchy

### Affected Files
- Modified:
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`

---

## 12.14.0 - 2026-04-22

### Summary
This release adds responsive design improvements for mobile devices with adaptive layouts, dynamic height adjustments, and device-specific styling for the tech cloud and homepage components.

### Added
- Added mobile responsive styles in TechCloudBackground with media query for max-width: 576px
- Added window resize listener with onResize() function for tracking viewport changes
- Added isMobile computed property to detect mobile devices (window width <= 576px)
- Added filteredBackgroundTechs computed property for dynamic tech cloud filtering
- Added skills-grid responsive padding in HomeTemplate2 for mobile devices

### Changed
- Updated skills section column sizes: size="12" size-lg="8" for mobile-first responsive layout
- Changed tech cloud height: 350px mobile, 600px desktop based on isMobile computed property
- Changed icon size: 36px mobile, 50px desktop for better mobile readability
- Reorganized imports in HomeTemplate2.vue (moved import statements to top-level)
- Updated background-techs prop to use filteredBackgroundTechs computed property

### TechCloudBackground.vue Changes
- Added responsive styles: skills-section height (280px), main-icons gap (20px), section-title font-size (14px), floating-label font-size (9px)

### Affected Files
- Modified:
  - `frontend/src/components/common/TechCloudBackground.vue`
  - `frontend/src/templates/HomeTemplate2.vue`

---

## 12.13.0 - 2026-04-22

### Summary
This release introduces responsive design improvements for mobile devices and refactors the ProjectCard component with improved TypeScript typing and function parameter patterns.

### Added
- Added responsive column sizes for mobile devices (size="12" size-lg="X")
- Added projects-row and experience-row CSS classes with responsive heights
- Added explicit title for experience section

### Changed
- Updated column layouts: profile section (12/4), projects (12/8), project cards (12/4)
- Changed row heights: 124dvh mobile, 64dvh desktop
- Converted function parameters to object destructuring pattern (getStatusColor, getStatusText, getIconByName, getTechLabel)
- Improved TypeScript typing in ref declarations and Props interface
- Added missing IonCardContent import
- Reorganized imports with structured comments

### Affected Files
- Modified:
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/templates/HomeTemplate2.vue`

---

## 12.12.0 - 2026-04-22

### Summary
This release adds smart tooltips that only appear when text is truncated in project cards, improving user experience by avoiding unnecessary tooltip displays.

### Added
- Added tooltip for project titles with ResizeObserver to detect when titles are truncated
- Added isTitleTruncated and isTruncated refs for tracking text overflow
- Added checkTruncation() function that compares scrollWidth vs clientWidth
- Added truncate-title CSS class with ellipsis styling for title overflow

### Changed
- Updated vTooltip directive to enable/disable tooltips based on content presence
- Modified tooltip.ts to disable tooltip instance when content is undefined, null, or empty string
- Only show tooltips when text is actually truncated (scrollWidth > clientWidth)

### Affected Files
- Modified:
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/directives/tooltip.ts`

---

## 12.11.0 - 2026-04-21

### Summary
This release adds smooth scroll navigation to the homepage with section tracking and active state indicators for better user experience.

### Added
- Added scrollToSection() function for smooth navigation to page sections
- Added IntersectionObserver for tracking visible sections and updating active state
- Added activeSection ref state for managing currently visible section
- Added nav-btn styles with animated underline for active navigation buttons

### Changed
- Added section IDs to all page sections (section-yo, section-proyectos, section-skills, section-experiencia, section-colaboracion)
- Updated navigation buttons with click handlers to scroll to corresponding sections
- Added active class binding to navigation buttons based on current section
- Updated footer to be commented out (temporary removal)

### Affected Files
- Modified:
  - `frontend/src/templates/HomeTemplate2.vue`

---

## 12.10.0 - 2026-04-21

### Summary
This release applies the technology simplification pattern to freelance platform management, adds dedicated CRUD pages with individual platform editing, and removes unused imports from SkillsEditor.

### Added
- Added FreelanceListPage.vue - new list view for managing freelance platforms in admin panel
- Added FreelanceEditor.vue - standalone editor page for creating/editing freelance platforms
- Added freelanceController.ts - new controller for freelance data operations
- Added freelanceStore.ts - new Pinia store for freelance state management
- Added backend endpoint `updateFreelanceItems` in HomePageController for saving freelance platforms
- Added new admin routes: /admin-panel/freelance (list), /admin-panel/freelance/new, /admin-panel/freelance/edit/:index

### Changed
- Simplified FreelanceItem type - replaced array of comments with single optional comment object `{title, text, rating}`
- Refactored freelance management from inline editor to dedicated pages with full CRUD
- Updated FinalSection to use new simplified comment structure
- Removed unused imports (IonList, IonListHeader, IonLabel, reactive) from SkillsEditor
- Removed AdminFreelancePage from AdminEditorPage (replaced by new pages)

### Removed
- Removed AdminFreelancePage.vue - old inline freelance editor (replaced by new pages)

### Affected Files
- Added:
  - `frontend/src/controllers/freelanceController.ts`
  - `frontend/src/store/freelanceStore.ts`
  - `frontend/src/views/admin/sections/FreelanceListPage.vue`
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `backend/routes/api.php`
  - `frontend/src/router/index.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/views/admin/AdminEditorPage.vue`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`
- Deleted:
  - `frontend/src/views/admin/sections/AdminFreelancePage.vue`

---

## 12.9.0 - 2026-04-21

### Summary
This release applies the same technology simplification pattern from projects and experience to certificates management, adds dedicated CRUD pages with individual certificate editing, and improves admin panel navigation with breadcrumbs.

### Added
- Added `getTechLabel()` function to display human-readable labels for technology icons in CertificatesPage
- Added saving state management (`setSaving`, `saving` ref) to certificatesStore for loading feedback during certificate saves
- Added breadcrumbs navigation in CertificatesListPage
- Added certificatesController.ts - new controller for certificates data operations
- Added certificatesStore.ts - new Pinia store for certificates state management
- Added CertificatesListPage.vue - new list view for managing certificates in admin panel
- Added CertificatesEditor.vue - standalone editor page for creating/editing certificates

### Changed
- Simplified technology interface in CertificateItem type - replaced `{source, name, size, type}` with simple `{iconName}`
- Updated CertificatesEditor to use iconName instead of type-based rendering
- Refactored certificates management from inline editor to dedicated pages with full CRUD
- Replaced back button with menu button in CertificatesListPage for consistent navigation
- Replaced TechnologiesEditor with TechSkillsEditor component in CertificatesEditor

### Removed
- Removed AdminCertificatesPage.vue - old inline certificates editor (replaced by new pages)

### Affected Files
- Added:
  - `frontend/src/controllers/certificatesController.ts`
  - `frontend/src/store/certificatesStore.ts`
  - `frontend/src/views/admin/sections/CertificatesListPage.vue`
- Modified:
  - `frontend/src/router/index.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/views/admin/AdminEditorPage.vue`
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`
- Deleted:
  - `frontend/src/views/admin/sections/AdminCertificatesPage.vue`

---

## 12.8.0 - 2026-04-21

### Summary
This release applies the same technology simplification pattern from projects to experience management, adds saving state feedback, and improves admin panel navigation with breadcrumbs.

### Added
- Added `getTechLabel()` function to display human-readable labels for technology icons in ExperienceCard
- Added saving state management (`setSaving`, `saving` ref) to experienceStore for loading feedback during experience saves
- Added breadcrumbs navigation in ExperienceListPage

### Changed
- Simplified technology interface in ExperienceItem type - replaced `{source, name, size, type}` with simple `{iconName}`
- Updated ExperienceCard, ExperienceComponent, and ExperienceEditor to use iconName instead of type-based rendering
- Replaced back button with menu button in ExperienceListPage for consistent navigation
- Replaced TechnologiesEditor with TechSkillsEditor component in ExperienceEditor

### Affected Files
- Modified:
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/experienceStore.ts`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/sections/ExperienceListPage.vue`
  - `frontend/src/views/presentation/experience/ExperienceComponent.vue`

---

## 12.7.0 - 2026-04-21

### Summary
This release simplifies technology management by using icon names instead of image uploads, adds saving state feedback for better UX, and improves admin panel navigation with breadcrumbs.

### Added
- Added `getTechLabel()` function to display human-readable labels for technology icons in ProjectCard, ProjectDetailModal, and ProjectsComponent
- Added saving state management (`setSaving`, `saving` ref) to projectsStore for loading feedback during project saves

### Changed
- Simplified technology interface in types.ts - replaced `{source, name, size, type}` with simple `{iconName}`
- Refactored backend HomePageController to only process iconName (removed image upload logic for technologies)
- Updated ProjectCard, ProjectDetailModal, and ProjectsComponent to use iconName instead of type-based rendering
- Replaced back button with menu button in ProjectsListPage for consistent navigation
- Updated ProjectsEditor back button default-href to /admin-panel/skills

### Affected Files
- Modified:
  - `backend/app/Http/Controllers/Admin/HomePageController.php`
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/components/projects/ProjectDetailModal.vue`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/projectsStore.ts`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`
  - `frontend/src/views/presentation/projects/ProjectsComponent.vue`

---

## 12.6.0 - 2026-04-21

### Summary
This release introduces a new skills management system with dedicated pages, a simplified tech stack, and improved UI. Skills now have their own CRUD interface replacing the inline editor.

### Added
- Added SkillsListPage.vue - new list view for managing skill categories in admin panel
- Added SkillsEditor.vue - standalone editor page for creating/editing skills
- Added TechSkillsEditor.vue - new technology selector component with icon picker modal
- Added skillsController.ts - new controller for skills data operations
- Added skillsStore.ts - new Pinia store for skills state management
- Added new admin routes: /admin-panel/skills (list), /admin-panel/skills/new, /admin-panel/skills/edit/:index

### Changed
- Refactored skills management from inline editor to dedicated pages with full CRUD
- Simplified SkillCategory type - technologies now only use iconName (removed name, image, size, type fields)
- Updated StackEditor with improved button styling including icon and text labels
- Updated SkillsPage presentation to display only icons without text labels

### Removed
- Removed AdminSkillsPage.vue - old inline skills editor (replaced by new pages)

### Affected Files
- Added:
  - `frontend/src/controllers/skillsController.ts`
  - `frontend/src/store/skillsStore.ts`
  - `frontend/src/views/admin/editors/TechSkillsEditor.vue`
  - `frontend/src/views/admin/sections/SkillsListPage.vue`
- Modified:
  - `frontend/src/router/index.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/views/admin/AdminEditorPage.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/editors/StackEditor.vue`
  - `frontend/src/views/presentation/skills/SkillsPage.vue`
- Deleted:
  - `frontend/src/views/admin/sections/AdminSkillsPage.vue`

---

## 12.5.0 - 2026-04-20

### Summary
This release improves admin panel navigation by replacing back buttons with menu buttons and adds breadcrumbs navigation for better user orientation.

### Changed
- Replaced back buttons with menu buttons in AdminInfoPage, AdminSkillsPage, and AdminStackPage
- Added breadcrumbs navigation to AdminSkillsPage and AdminStackPage for better navigation context
- Applied background color styling to toolbars in AdminInfoPage and AdminStackPage

---

## 12.4.0 - 2026-04-20

### Summary
This release refactors the socials editor into a standalone component, improves UI consistency with updated toolbar styling, and enhances the final section review cards layout.

### Added
- Added SocialsEditor.vue component for managing social media links
- Added breadcrumbs navigation to AdminInfoPage

### Changed
- Refactored socials management from InfoEditor to dedicated SocialsEditor component
- Updated toolbar styling to use CSS variables for background color in multiple components
- Improved FinalSection review cards layout using ion-item instead of ion-card for better presentation
- Simplified InfoEditor by removing embedded socials list

### Affected Files
- Added:
  - `frontend/src/views/admin/editors/SocialsEditor.vue`
- Modified:
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/views/admin/PanelAdminPage.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`

---

## 12.3.1 - 2026-04-20

### Summary

This release improves the menu component with better conditional rendering for user sections and adds a footer with source code license information to the HomeTemplate2.

### Added

- Added footer to HomeTemplate2 with source code link and GPL-3.0 license information

### Changed

- Wrapped user menu sections (admin panel, user panel) in conditional v-if to only show when user is logged in
- Removed ellipsisVerticalOutline button from user menu item
- Enhanced route checking in menu to support multiple route names using array includes for active state
- Simplified menu option classes with array-based route name checks

### Affected Files

- Modified:
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/templates/HomeTemplate2.vue`

---

## 12.3.0 - 2026-04-20

### Summary

This release refactors the data layer by extracting types to a dedicated file and introducing a centralized HomeEditorController for better separation of concerns. Stores now delegate API calls to controllers instead of directly calling the API.

### Added

- Added HomeEditorController for centralized homepage data loading and saving operations
- Added setLoading and setSaving methods to homeEditorStore for external loading state management

### Changed

- Extracted all data types (HomePageData, StackItem, SkillCategory, ExperienceItem, ProjectItem, CertificateItem, FreelanceItem) from homeApi.ts to types.ts
- Migrated experienceController and projectsController to use API endpoints instead of store-based local storage
- Refactored stores to use setter methods (setExperiences, setProjects, setLoading, setData) instead of direct data manipulation
- Updated all imports across components to use types.ts instead of homeApi.ts for type definitions

### Removed

- Removed homeApi.ts service file (functionality moved to HomeEditorController)

### Affected Files

- Added:
  - `frontend/src/controllers/homeEditorController.ts`
- Modified:
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/components/projects/ProjectDetailModal.vue`
  - `frontend/src/controllers/experienceController.ts`
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/services/types.ts`
  - `frontend/src/store/experienceStore.ts`
  - `frontend/src/store/homeEditorStore.ts`
  - `frontend/src/store/projectsStore.ts`
  - `frontend/src/templates/HomeTemplate1.vue`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/admin/HomeEditorComponent.vue`
  - `frontend/src/views/admin/editors/CertificatesEditor.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/editors/FreelanceEditor.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/editors/SkillsEditor.vue`
  - `frontend/src/views/admin/editors/StackEditor.vue`
  - `frontend/src/views/admin/sections/AdminCertificatesPage.vue`
  - `frontend/src/views/admin/sections/AdminFreelancePage.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`
  - `frontend/src/views/admin/sections/AdminSkillsPage.vue`
  - `frontend/src/views/admin/sections/AdminStackPage.vue`
  - `frontend/src/views/certificates/CertificatesPage.vue`
  - `frontend/src/views/experience/ExperiencePage.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`
  - `frontend/src/views/presentation/certificates/CertificatesComponent.vue`
  - `frontend/src/views/presentation/experience/ExperienceComponent.vue`
  - `frontend/src/views/presentation/information/InformationComponent.vue`
  - `frontend/src/views/presentation/projects/ProjectsComponent.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`
  - `frontend/src/views/presentation/skills/SkillsPage.vue`
- Deleted:
  - `frontend/src/services/homeApi.ts`

---

## 12.2.0 - 2026-04-19

### Summary

This release restructures the menu with improved organization, adds split-pane layout for desktop views, and enhances experience card displays with better icon handling.

### Added

- Added IonSplitPane for desktop menu layout in App.vue
- Added header with user info and login/register buttons in MenuComponent
- Added calendar icon to experience date display in ExperienceCard

### Changed

- Restructured menu with item-groups (Usuario, Navegación sections) for better organization
- Moved admin panel and user panel options from popover to main menu layout
- Moved logout option to bottom of menu with flex column layout
- Wrapped technologies in ExperienceCard with flex container and gap spacing
- Changed icon imports to named imports (arrowBackOutline, informationCircleOutline, calendarOutline)
- Simplified menu CSS in variables.css

### Affected Files

- Modified:
  - `frontend/src/App.vue`
  - `frontend/src/components/menu/MenuComponent.vue`
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/theme/variables.css`

---

## 12.1.0 - 2026-04-19

### Summary

This release improves the UI/UX of experience and project cards with better visual hierarchy, status indicators, and responsive layout. It refactors the Portfolio page to showcase multiple projects in a grid layout and enhances tooltip consistency across components.

### Added

- Enhanced ProjectCard with status-based color coding (primary for progress, warning for indeterminate, success for finished)
- Added getStatusText and getStatusColor utility functions for consistent status representation
- Improved tooltip configuration with standardized trigger behavior (mouseenter + touch: 'hold')
- Added slot="start" attributes for proper icon alignment in buttons

### Changed

- Refactored ProjectCard.vue layout with better use of Ionic grid system and spacing
- Moved project status display to use colored text labels instead of chips
- Updated ExperienceCard.vue to remove placeholder Lorem Ipsum text and improve icon placement
- Modified PortfolioPage.vue to display projects in a responsive grid (size="4" columns) instead of single project view
- Simplified ExperiencePage.vue layout by removing unnecessary container styling
- Standardized v-tooltip triggers across components to use mouseenter and touch: 'hold'
- Improved card footer layout with proper flexbox alignment for buttons

### Affected Files

- Modified:
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/views/experience/ExperiencePage.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`

---

## 12.0.0 - 2026-04-19