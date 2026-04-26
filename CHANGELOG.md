# Changelog

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