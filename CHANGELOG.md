# Changelog

## 12.0.0 - 2026-04-19

### Summary

This release refactors the experiences and projects presentation and admin flows, introduces a reusable icon color composable, and replaces several inline implementations with dedicated components. It contains multiple new components, composables, and UI improvements across the frontend.

### Added

- `frontend/src/components/experience/ExperienceCard.vue`: New flip-card component for experiences with front/back views and tooltips
- `frontend/src/composables/useIconColors.ts`: Composable providing icon color mapping for consistent icon theming

### Changed

- Replaced multiple inline icon color functions with `useIconColors` and updated components to use `getIconColor(source)`
- Replaced older date `date` field with `startDate`/`endDate` where applicable in experience data model and components
- Prefactored experience and project list templates to use `ExperienceCard` and `ProjectCard` components respectively
- Converted several pages to use `ion-page` wrapper for proper Ionic navigation (ExperiencePage, PortfolioPage, HomeTemplate2)
- Multiple components updated to use standardized v-tooltip triggers (`mouseenter` + `touch: 'hold'`) instead of `click`

### Fixed

- Various UI and keying fixes: replaced index-based v-for keys with stable keys (title) where appropriate

### Affected Files

- New:
  - `frontend/src/components/experience/ExperienceCard.vue`
  - `frontend/src/composables/useIconColors.ts`
- Modified (selected):
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/components/projects/ProjectDetailModal.vue`
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/services/homeApi.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/admin/editors/ExperienceEditor.vue`
  - `frontend/src/views/admin/sections/ExperienceListPage.vue`
  - `frontend/src/views/certificates/CertificatesPage.vue`
  - `frontend/src/views/experience/ExperiencePage.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`
  - `frontend/src/views/presentation/*` (multiple components)

---

## 11.17.0 - 2026-04-17

### Added

- **ProjectsController**: New controller class for managing projects with centralized business logic
  - Handles loading, saving, adding, updating, and deleting projects
  - Integrates with ProjectsStore and ToastController for state management and notifications

- **ProjectsStore**: New Pinia store for centralized projects state management
  - Manages projects data, loading/saving states, and loaded flag
  - Provides methods for loading, saving, adding, updating, and deleting projects
  - Implements caching to avoid redundant API calls

- **ProjectsListPage**: New dedicated admin page for viewing and managing projects list
  - Displays all projects with edit/delete actions
  - Navigation to create new project or edit existing

- **ProjectsEditor**: Refactored as standalone page with create/edit/delete functionality
  - Supports both embedded mode (within home editor) and standalone mode
  - Added save button in header for standalone mode
  - Added delete confirmation dialog with alert controller

- **Routes**: New routes for projects management
  - `/admin-panel/projects` - ProjectsListPage
  - `/admin-panel/projects/new` - Create new project
  - `/admin-panel/projects/edit/:index` - Edit existing project

### Changed

- **ProjectsComponent**: Refactored to use ProjectsController instead of direct API calls
  - Cleaner component with controller-based data management
  - Uses computed property for reactive project data

- **AdminEditorPage**: Removed projects section reference
  - Projects now managed through dedicated standalone pages
  - Cleaner admin editor structure

- **PanelAdminPage**: Wrapped content in ion-page for proper Ionic navigation
  - Added IonPage wrapper for consistent navigation behavior
  - Improved component structure

- **homeEditorStore**: Removed projects from form and sectionFiles
  - Projects now managed independently by ProjectsStore
  - Cleaner separation of concerns

- **ProjectsEditor**: Refactored to support standalone and embedded modes
  - Added standalone/computed properties for mode detection
  - Uses localProjects for standalone editing
  - Unified save handler for both modes

### Breaking Changes

- Projects are no longer managed through homeEditorStore
- Projects now have dedicated store (ProjectsStore) and controller (ProjectsController)
- Admin projects management moved to dedicated pages instead of main editor section

### Affected Files

- New:
  - `frontend/src/controllers/projectsController.ts`
  - `frontend/src/store/projectsStore.ts`
  - `frontend/src/views/admin/sections/ProjectsListPage.vue`
- Modified:
  - `frontend/src/components/projects/ProjectsComponent.vue`
  - `frontend/src/router/index.ts`
  - `frontend/src/store/homeEditorStore.ts`
  - `frontend/src/views/admin/AdminEditorPage.vue`
  - `frontend/src/views/admin/PanelAdminPage.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
- Deleted:
  - `frontend/src/views/admin/sections/AdminProjectsPage.vue`

---

## 11.16.0 - 2026-04-16

### Changed

- **Router**: Refactored routing to use direct page component imports instead of HomePage placeholder
  - All routes now reference their dedicated page components directly
  - Fixed typo: `/home/certifcates` corrected to `/home/certificates`
  - Improved code organization and maintainability

- **HomeTemplate2**: Restructured component with proper Ionic page structure
  - Added `ion-page` wrapper for correct Ionic navigation handling
  - Added `ion-toolbar` in header for proper toolbar integration
  - Changed `$router` to `router` variable for consistency

- **HomePage.vue**: Removed legacy placeholder component
  - Functionality distributed to individual page components
  - Cleaner component architecture

- **AdminEditorPage.vue**: New dedicated page component for admin section routing
  - Handles routing to Info, Stack, Skills, Experience, Projects, Certificates, and Freelance admin sections
  - Replaces conditional rendering logic previously in HomePage

- **PortfolioPage.vue**: Added proper Ionic page wrapper
  - Wrapped content in `ion-page` for consistent navigation behavior
  - Added necessary Ionic component imports

### Affected Files

- Modified:
  - `frontend/src/router/index.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`
- Deleted:
  - `frontend/src/views/HomePage.vue`
- New:
  - `frontend/src/views/admin/AdminEditorPage.vue`

---

## 11.15.0 - 2026-04-16

### Added

- **Projects**: Added date range fields (startDate, endDate) to project data model
  - ProjectsEditor now includes date picker popovers for selecting project start and end dates
  - ProjectCard displays formatted date range (e.g., "ene 2026 - Actual") instead of single date
  - New `formatDateRange` function handles date formatting with "Actual" for ongoing projects

### Changed

- **ProjectsEditor**: Refactored project form layout with collapsible sections
  - Each project now uses ion-item-divider with sticky header showing project title
  - Delete button moved to project header for easier access
  - Form fields reorganized into "Básico" and "Fuente" sections with ion-list grouping

### Affected Files

- Modified:
  - `frontend/src/components/projects/ProjectCard.vue`
  - `frontend/src/services/homeApi.ts`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`

---

## 11.14.0 - 2026-04-16

### Added

- **ProjectCard**: New flip card component for interactive project display
  - Displays project front with image, status chip, title, date, source, and technologies
  - Back side shows description and project links with flip animation
  - Added tooltip for technology names on hover
  - Supports flipped prop for external control
- **Test Data Generation**: Added faker-based test data generation for projects
  - AdminProjectsPage: Added "Add test data" button to populate 3 random projects
  - HomeEditorComponent: Added fillTestData function with random project generation

### Changed

- **ProjectsComponent**: Replaced inline card design with ProjectCard component
  - Removed ProjectDetailModal - project details now shown via flip card interaction
  - Simplified template using ProjectCard for each project
- **HomeTemplate2**: Updated to use dynamic template content
  - Added name, description, tags from props for personalization
  - Projects now rendered using ProjectCard component
  - Added router navigation to portfolio page
- **PortfolioPage**: Simplified layout
  - Removed filter selector (temporarily disabled)
  - Cleaned up unused imports
- **ProjectsEditor**: Refactored template structure
  - Each project now wrapped in individual ion-card (moved v-for to ion-card)
  - Improved form field organization and spacing

### Affected Files

- New:
  - `frontend/src/components/projects/ProjectCard.vue`
- Modified:
  - `frontend/src/components/projects/ProjectsComponent.vue`
  - `frontend/src/services/homeApi.ts`
  - `frontend/src/templates/HomeTemplate2.vue`
  - `frontend/src/views/TemplatePage.vue`
  - `frontend/src/views/admin/HomeEditorComponent.vue`
  - `frontend/src/views/admin/editors/ProjectsEditor.vue`
  - `frontend/src/views/admin/sections/AdminProjectsPage.vue`
  - `frontend/src/views/portfolio/PortfolioPage.vue`

---

## 11.13.0 - 2026-04-15

### Changed

- **Admin/InfoEditor**: Improve variable naming for better code clarity
  - Renamed index variables to descriptive names (index -> tagIndex/socialIndex, i -> tagIndex/socialIndex)
  - Renamed item variables to descriptive names (tag -> tagItem, social -> socialItem)
  - Renamed function parameters to descriptive names (type -> targetType/fileType, event -> fileEvent)
  - Renamed loop variables in v-for directives to follow naming conventions
- **Admin/InfoEditor**: Expand social platform list to include all available ionicons platforms (30+ platforms)
  - Added explicit iconMap with all ionicons imports for better icon resolution
  - Improved getIconByName function to handle more icon name variations

### Fixed

- **TemplatePage**: Fixed typo in ion-toolbar component (was ion-toolvar)

### Affected Files

- Modified:
  - `frontend/src/views/TemplatePage.vue`
  - `frontend/src/views/admin/editors/InfoEditor.vue`

---

## 11.12.0 - 2026-04-15

### Added

- **Admin/InfoEditor**: Tag management UI enhancements
  - Add button to open tag reorder modal and reorder UI using Ionic's reorder group
  - Add IonAlert-based "Add tag" input to simplify tag creation
  - Local tag objects with stable ids to avoid key collisions when labels repeat
  - Reorder modal with save/close controls and immediate local preview of changes

### Changed

- **Admin/InfoEditor**: Improve tag chip keys and make tag addition immediate in UI
- **Admin/AdminInfoPage**: Added handlers for `add-tag` and `reorder-tags` events from child editor and keep store in sync

### Affected Files

- Modified:
  - `frontend/src/views/admin/editors/InfoEditor.vue`
  - `frontend/src/views/admin/sections/AdminInfoPage.vue`

---

## 11.10.1 - 2026-04-15

### Changed

- **Template System**: Refactored template structure for improved organization
  - Moved template components from `components/templates/home` to `templates` directory
  - Replaced old `HomeTemplate` component with new `HomeTemplate1` and `HomeTemplate2` variants
  - Removed legacy `SectionWrapper` and `templates.ts` files
  - Added new `TechCloudBackground` component for visual effects
- **TemplatePage**: Updated to use new template structure
- **HomePresentationPage**: Updated to use new template components
- **FinalSection**: Removed unused `ContractLogo` import

### Affected Files

- Deleted:
  - `frontend/src/components/templates/home/HomeTemplate.vue`
  - `frontend/src/components/templates/home/SectionWrapper.vue`
  - `frontend/src/components/templates/home/templates.ts`
- New:
  - `frontend/src/components/common/TechCloudBackground.vue`
  - `frontend/src/templates/HomeTemplate1.vue`
  - `frontend/src/templates/HomeTemplate2.vue`
- Modified:
  - `frontend/src/views/TemplatePage.vue`
  - `frontend/src/views/presentation/HomePresentationPage.vue`
  - `frontend/src/views/presentation/sections/FinalSection.vue`

---

## 11.10.0 - 2026-04-12

### Added

- **Template System**: Added configurable template system for home presentation page
  - New `HomeTemplate` component with scroll snap navigation and segment-based section switching
  - New `SectionWrapper` component for reusable section rendering
  - New `FinalSection` component extracted from homepage for freelance testimonials
  - New `templates.ts` with predefined template configurations
  - New TypeScript types in `homeTemplate.ts` for template data structures
- **Template Options**: Added three template variants:
  - `default`: Classic vertical scroll with snap sections
  - `compact`: All sections in single view
  - `skillsFirst`: Skills section displayed first

### Changed

- **HomePresentationPage**: Refactored to use new template system instead of inline template code
- **Attribute Order**: Fixed Vue attribute order to comply with style guide (v-bind directives before static attributes):
  - `MarkdownCreator.vue`: Reordered drag-and-drop class binding
  - `ProjectDetailModal.vue`: Reordered ion-buttons attributes
  - `ProjectsComponent.vue`: Fixed `isOpen` prop to kebab-case
  - `EditorComponent.vue`: Reordered style and v-if attributes
  - `ExperiencePage.vue`: Reordered ion-buttons slot attributes
  - `HomeEditorComponent.vue`: Reordered button and input attributes
  - `InformationComponent.vue`: Reordered v-if and fill attributes
  - `HomePresentationPage.vue`: Full refactoring, attribute order N/A
- **PostStore**: Fixed unused variable declaration (`let` to `const`)

### Affected Files

- New Files:
  - `frontend/src/components/templates/home/HomeTemplate.vue`
  - `frontend/src/components/templates/home/SectionWrapper.vue`
  - `frontend/src/components/templates/home/templates.ts`
  - `frontend/src/utils/types/homeTemplate.ts`
  - `frontend/src/views/presentation/sections/FinalSection.vue`
- Modified:
  - `frontend/src/views/presentation/HomePresentationPage.vue`
  - `frontend/src/components/markdown-creator/MarkdownCreator.vue`
  - `frontend/src/components/projects/ProjectDetailModal.vue`
  - `frontend/src/components/projects/ProjectsComponent.vue`
  - `frontend/src/store/postStore.ts`
  - `frontend/src/views/admin/HomeEditorComponent.vue`
  - `frontend/src/views/blog/editor/EditorComponent.vue`
  - `frontend/src/views/experience/ExperiencePage.vue`
  - `frontend/src/views/presentation/information/InformationComponent.vue`
  - `frontend/src/views/presentation/projects/ProjectsComponent.vue`

---

## 11.9.0 - 2026-04-12

### Changed

- Admin editors: Migrated form validation from manual error display to Vuelidate's built-in Ionic integration
- Admin editors: Added `error-text` prop on form inputs to display validation errors inline
- Admin editors: Added `ion-touched` class tracking to properly show errors only after field blur
- Admin editors: Added dynamic `getError()` functions to retrieve localized error messages from Vuelidate
- Admin editors: Refactored `touched` state to use nested object structure for better organization
- Admin editors: Removed redundant manual error `<span>` elements, now handled by Ionic components
- Admin editors: Removed deprecated `.ion-invalid` CSS rules (no longer needed with Ionic built-in styling)
- Admin editors: Cleaned up unused CSS classes and styles

### Affected Files

- frontend/src/views/admin/editors/CertificatesEditor.vue
- frontend/src/views/admin/editors/ExperienceEditor.vue
- frontend/src/views/admin/editors/FreelanceEditor.vue
- frontend/src/views/admin/editors/ProjectsEditor.vue
- frontend/src/views/admin/editors/SkillsEditor.vue
- frontend/src/views/admin/editors/StackEditor.vue
- frontend/src/views/admin/editors/TechnologiesEditor.vue

---

## 11.8.2 - 2026-04-12

### Changed

- Admin/InfoEditor: Refactored to use props/emits pattern instead of direct store coupling for better reusability
- Admin/InfoEditor: Removed store imports and replaced with reactive props and event emits
- Admin/InfoEditor: Added proper TypeScript interface for props and emits
- Admin/InfoEditor: Uses computed initialData synced from store via parent component
- Admin/InfoEditor: Form state now managed locally with validation, emits save event to parent
- Admin/InfoEditor: Removed preview modal and associated functionality (moved to parent)
- Admin/InfoEditor: Removed tag alert functionality (tags now managed via parent)
- Admin/AdminInfoPage: Added handlers for child component events, manages store synchronization
- Admin/AdminInfoPage: Connected save button to child component's handleSubmit method

### Affected Files

- frontend/src/views/admin/editors/InfoEditor.vue
- frontend/src/views/admin/sections/AdminInfoPage.vue

---

## 11.8.1 - 2026-04-12

### Changed

- Admin/InfoEditor: Removed `<form>` wrapper and simplified template structure for cleaner layout
- Admin/InfoEditor: Refactored form state management with improved local reactive state synchronizing to store

### Affected Files

- frontend/src/views/admin/editors/InfoEditor.vue

---

## 11.8.0 - 2026-04-12

### Added

- Admin/HomeEditorComponent: Added separate toggle controls for contact form visibility (socials section vs freelance section)
- Admin/InfoEditor: Added Vuelidate form validation with error messages for name, description, and socials URL fields
- Frontend: Added mail icon for contact button in information section

### Changed

- Admin/InfoEditor: Refactored form to use local reactive state with two-way sync to store for proper validation handling
- Presentation/InformationComponent: Updated contact button to use mail icon instead of chatbox

### Breaking Changes

- API type change: `showContactForm` field changed from `boolean` to object `{ socials: boolean, freelance: boolean }` for independent visibility control per section
- Backend: `show_contact_form` column converted from boolean to JSON in homepage table

### Affected Files

- backend/app/Http/Controllers/Admin/HomePageController.php
- backend/database/migrations/2026_04_11_000000_modify_show_contact_form_to_json.php
- frontend/src/services/homeApi.ts
- frontend/src/views/admin/HomeEditorComponent.vue
- frontend/src/views/admin/editors/InfoEditor.vue
- frontend/src/views/presentation/HomePresentationPage.vue
- frontend/src/views/presentation/information/InformationComponent.vue

---

## 11.7.0 - 2026-04-11

### Added

- Backend: New `homepage:clean-images` artisan command to remove orphaned images from storage that are no longer in the database
- Backend/HomePageController: Added automatic image cleanup when updating homepage content

### Changed

- Admin/SkillsEditor: Always show upload button for image-type technologies regardless of existing image state

### Fixed

- Admin/ExperienceEditor: Clean up pending tech files when technology items are removed
- Admin/ProjectsEditor: Clean up pending tech files when technology items are removed

### Affected Files

- backend/app/Console/Commands/CleanHomepageImages.php
- backend/app/Http/Controllers/Admin/HomePageController.php
- frontend/src/views/admin/editors/ExperienceEditor.vue
- frontend/src/views/admin/editors/ProjectsEditor.vue
- frontend/src/views/admin/editors/SkillsEditor.vue

---

## 11.6.0 - 2026-04-10

### Added

- Admin/InfoEditor: Social selector modal with search, platform additions (GitLab, Bitbucket, ChatBox)

### Changed

- Admin/InfoEditor: Replace popover with modal for social selection; refactor item markup and button handlers
- Admin/InfoEditor: Use reactive modal/search state and computed filtered/displayed social lists
- Admin/SkillsEditor: Improve formatting of handlers and validations; expand function signatures to explicit typed params
- Presentation/InformationComponent: Improve social icon resolution to handle missing iconName and map more icon variations
- Presentation/InformationComponent: Add CSS to force monochromatic social icons and hover behavior

### Fixed

- Admin/SkillsEditor: Fix input event handler formatting and touched-state helpers to ensure correct validation

### Affected Files

- frontend/src/views/admin/editors/InfoEditor.vue
- frontend/src/views/admin/editors/SkillsEditor.vue
- frontend/src/views/presentation/information/InformationComponent.vue

---

## 11.5.2 - 2026-04-10

## 11.5.1 - 2026-04-10

### Changed
- Admin/Freelance: Refactored FreelanceEditor.vue layout to use IonList/IonCard structure with improved form layout and floating labels
- Admin/Freelance: Added image preview modal functionality for platform logos and client images
- Admin/Freelance: Added file name display for uploaded platform and client images
- Admin/Freelance: Moved save button to header in AdminFreelancePage with spinner and reorganized layout using ion-grid

### Added
- Admin/Freelance: Modal preview component for platform logos and client images
- Admin/Freelance: Click-to-upload file dialog with button triggers

---

## 11.5.0 - 2026-04-10

### Changed
- Admin/Certificates: Refactored CertificatesEditor.vue layout to use IonList/IonCard structure with improved form layout and floating labels
- Admin/Certificates: Added image preview modal functionality for certificate images
- Admin/Certificates: Added file name display for uploaded certificate images
- Admin/Certificates: Improved TechnologiesEditor integration with proper model-value binding
- Admin/CertificatesPage: Moved save button to header with spinner and reorganized layout using ion-grid

### Added
- Admin/Certificates: Modal preview component for certificate images
- Admin/Certificates: Click-to-upload file dialog with button triggers

---

## 11.4.0 - 2026-04-09

### Changed
- Admin/Projects: Refactored ProjectsEditor.vue layout to use IonList/IonCard structure with improved form layout and floating labels
- Admin/Projects: Added image preview modal functionality for project logo and source images
- Admin/Projects: Added file name display for uploaded project and source images
- Admin/Projects: Improved TechnologiesEditor integration with proper model-value binding
- Admin/ProjectsPage: Moved save button to header with spinner and reorganized layout using ion-grid

### Added
- Admin/Projects: Modal preview component for project images
- Admin/Projects: File name display for uploaded project and source images
- Admin/Projects: Click-to-upload file dialog with button triggers

---

## 11.3.3 - 2026-04-09

### Changed
- Admin/Experience: Refactored ExperienceEditor.vue layout to use IonList/IonCard structure with improved form layout and floating labels
- Admin/Experience: Added image preview modal functionality for company logos
- Admin/Experience: Added file name display for uploaded experience images
- Admin/Experience: Improved TechnologiesEditor integration with proper model-value binding
- Admin/Technologies: Refactored TechnologiesEditor.vue layout to use IonList/IonCard structure with improved form layout
- Admin/Technologies: Added image preview modal functionality for technology images
- Admin/Technologies: Added file name display for uploaded technology images
- Admin/Technologies: Improved TechIconSelector integration with proper model-value binding
- Admin/ExperiencePage: Moved save button to header with spinner and reorganized layout using ion-grid

### Added
- Admin/Experience: Modal preview component for experience images
- Admin/Technologies: Modal preview component for technology images
- Admin/Experience: File name display for uploaded experience images
- Admin/Technologies: File name display for uploaded technology images

### Added

- Admin/Skills: Skills editor supports image preview modal and file input handling for technology images

### Changed

- Admin/Skills: TechIconSelector improved icon list and search behavior; mapping cleanup and label fixes
- Admin/Skills: AdminSkillsPage layout updated to connect SkillsEditor with store save flow and file handling

### Fixed

- Admin/Skills: Fix validation and touched state handling for technology image fields and file change events

---

## 11.3.1 - 2026-04-07

### Added

- Admin: Info editor (InfoEditor.vue) — add image preview modal for logo/photo and add tag input in an alert

### Changed

- Admin: refactor InfoEditor.vue layout to use IonCard sections, hidden file inputs, and improved form item lines
- Admin: use reactive file name display and preview state for logo/photo

### Fixed

- Admin: fix tag addition flow by moving input to IonAlert and prevent duplicate empty tags

---

## 11.3.0 - 2026-04-07

### Added

- Admin: improved Stack editor UI with file name display and image preview modal
- Admin: added sectional layout for Stack editor in AdminStackPage for better responsiveness

### Changed

- Frontend: updated StackEditor.vue to use IonCard layout, hidden file inputs, and improved validation error rendering
- AdminStackPage.vue: moved save button to header with spinner and reorganized layout using ion-grid/ion-row/ion-col

### Fixed

- File upload handling: store pending file names for display and ensure cleanup when removing items

---

## 11.2.0 - 2026-04-06

### Added

- Admin panel: new section-based admin views and Info editor components for homepage content management

### Changed

- Frontend structure: added tooltip directive and tippy.js themes/styles
- Main app initialization updated: storage initialization, server config export, and service worker registration refined

### Fixed

- Various admin/editor integration fixes and styling updates (light/variables CSS and HomePage adjustments)

## 11.1.1 - 2026-04-03

### Fixed

- ESLint flat config restructured for proper Vue 3 + TypeScript compatibility
- Separated `ignores` into dedicated config object per ESLint 9 flat config spec
- Fixed ignore patterns to use proper glob syntax (`**` instead of `/`)
- Corrected `@eslint/js` version from v10 to v9 to match ESLint v9 peer dependency
- Added missing `@eslint/js` and `typescript-eslint` dev dependencies

## 11.1.0 - 2026-04-01

### Added

- Homepage content editor with tabbed sections (Stack, Skills, Experience, Projects, Certificates, Freelance)
- TechIconSelector component with searchable modal for technology icon selection (~50 icons)
- Vuelidate validation on all homepage section editors to prevent incomplete items
- `showContactForm` toggle in admin to control contact modal visibility
- Backend `show_contact_form` field in homepage table with migration
- ProjectDetailModal shared component for consistent project details display
- File upload handling for stack, skills, experience, projects, certificates, and freelance images

### Changed

- All presentation components now load dynamic content from API instead of hardcoded data
- SkillsPage, ExperiencePage, CertificatesPage, PortfolioPage updated to use API data
- HomeEditorComponent refactored with section tabs and file upload handling
- Skills section supports both images and ionicons with icon selector
- TechnologiesEditor enhanced with icon selector and file upload support

### Fixed

- Stack images now display centered in SkillsPage
- Project "Fuente/Cliente" information now visible in project detail modal
- Experience and Certificates pages now show API data correctly

## 11.0.0 / 9.0.0 - 2026-03-30

### Breaking Changes

- Removed local authentication system (signup, login, logout, password reset, email verification)
- Removed local user management functionality (admin user panel, user status management, user CRUD operations)
- Removed legacy authentication tables (users_verify, reset_code_passwords)
- Removed local user permission fields from users table (is_admin, role, is_user_disabled, sso_id)
- Frontend usersStore removed entirely
- AuthController and UserController moved to SSO-only operations

### Changed

- Backend AuthController simplified to only return SSO user data via SSOTokenAuth middleware
- SSOTokenAuth middleware now determines admin role from SSO user roles array instead of local database
- Admin role check now uses roles array with 'slug' or 'name' fields (admin/administrador)
- User identification now relies entirely on SSO server
- Removed all local password-based authentication endpoints
- Removed user search, status update, and admin delete endpoints from API routes
- Frontend authController.ts removed, authentication handled through SSO
- UserController refactored to remove all local user management methods
- MenuComponent and router now check admin role from roles array
- HomeEditorComponent improved icon handling for social links

### Removed

- Backend: UserController.php, UserVerify.php, ResetCodePassword.php models
- Backend: Legacy authentication routes (login, signup, recover-password, reset-password)
- Backend: User management routes (users, update-user-status, admin/delete-user, admin/update-user-account)
- Frontend: authController.ts, usersStore.ts
- Frontend: UserService methods for local user management

### Migration Required

- Applications must use external SSO server for authentication
- All user management must be performed through SSO server
- Admin role management moved to SSO system

## 10.12.0 / 8.8.0 - 2026-03-29

### Added

- Role interface in TypeScript for type-safe role handling
- Roles support in SSO authentication flow

### Changed

- Updated AuthController to return roles in SSO auth response
- Enhanced SSOTokenAuth middleware to extract and pass roles from SSO user
- Updated userService to map roles from server response
- Extended User interface with optional roles array

## 10.11.2 - 2026-03-29

### Added

- Added `client_id: "main-app"` parameter to SSO registration and login requests for proper client identification

### Changed

- Refactored APIController and SSOAPIController to retrieve accessToken dynamically from configService instead of storing it as a class property
- Exported serverConfigController and ssoServerConfig in main.ts for use across the application
- Updated UserController to use serverConfigController.setAuthTokens() for proper token management

### Fixed

- Fixed token storage approach to use centralized config controller instead of directly setting cookies

## 10.11.1 / 8.7.1 - 2026-01-19

### Changed

- Refactored social media icons to store iconName (string) instead of icon object in database
- Simplified InformationComponent template by removing 300+ lines of repetitive v-show buttons
- Added getSocialIcon helper function to map icon names to ionicons objects
- Updated HomeEditorComponent to save iconName field instead of icon object
- Updated HomePageData interface to use iconName: string instead of icon: string

### Fixed

- Resolved issue where social icons were not displaying due to CSS .social-button class conflict
- Fixed dynamic icon rendering by using iconMap lookup instead of dynamic imports

### Added

- Dynamic homepage content management system with admin panel
- Editable homepage name, tags, description, social links, logo, and cover photo
- Support for 35+ social media platforms (Facebook, LinkedIn, GitHub, Twitter, Instagram, etc.)
- Backend API endpoints for homepage CRUD operations (admin and public)
- File upload handling for logo and photo uploads
- HomeEditorComponent for managing homepage content in admin panel

### Changed

- Enhanced APIController with proper FormData support for multipart file uploads
- Updated InformationComponent to load dynamic homepage content from API
- Updated UserController to use SSO user data for authentication
- Improved social icons mapping for consistent display across platforms

### Backend 8.7.0

Same changes as frontend 10.11.0 for backend components

## 10.10.0 - 2026-01-17

### Added

- Admin mappings table setup SQL script for role-based access control
- Migration to add sso_id column to users table for local user mapping
- clearData() method to ServerConfig for logout/reset functionality

### Changed

- Enhanced SSOTokenAuth middleware to look up local user status (admin, email verified, disabled) from database
- Updated AuthController to get is_admin from middleware-provided request attribute
- Switched userService to use apiConnector instead of ssoApiConnector for user endpoint
- Added optional chaining for user ID to prevent errors with missing data
- Fixed MenuComponent to await user loading for consistent state
- Fixed LoginPage to await user loading after successful authentication

### Backend 8.6.0

Same changes as frontend 10.10.0 for backend components

## 10.9.0 - 2026-01-17

### Added

- SSO authentication middleware (SSOTokenAuth) for validating tokens with external SSO server
- Production environment template files for backend and frontend deployment
- Comprehensive deployment checklist with architecture diagrams and server configuration guides

### Changed

- Reorganized API routes to use SSO middleware for protected endpoints
- Updated AuthController to return SSO user data with proper field mapping
- Enhanced backend configuration with SSO_URL support
- Improved documentation in backend and frontend README files with architecture diagrams and production setup guides

### Backend 8.5.0

Same changes as frontend 10.9.0 for backend components

## 10.8.0 - 2026-01-16

### Added

- SSOAPIController for handling SSO (Single Sign-On) authentication operations
- SSOServerConfigController for managing SSO server configuration

### Changed

- Updated APIController to support SSO authentication flow
- Extended serverConfigController with SSO server configuration support
- Enhanced userController to integrate SSO-based user authentication
- Updated SignUpFormComponent with SSO signup options
- Modified main.ts to initialize SSO authentication configuration
- Refactored userService to handle SSO user operations
- Updated userStore to manage SSO authentication state
- Extended TypeScript interfaces in utils/interfaces.ts for SSO support
- Updated LoginPage with SSO login functionality
- Enhanced SignUpPage with SSO registration support
- Modified MenuComponent to reflect SSO authentication status

## 10.7.0 - 2025-03-23

### Changed

- Removed SessionService class in favor of direct API calls in UserController
- Simplified user authentication operations by using apiConnector directly in controller
- Refactored login, registration and password reset operations to remove service layer
- Moved user-related API calls from SessionService to UserController

## 10.6.0 - 2025-03-23

### Changed

- Removed PostService class in favor of direct API calls in PostController
- Simplified post operations by using apiConnector directly in controller
- Moved formatPostResponse helper method to PostController

## 10.5.0 - 2025-03-23

### Changed

- Moved interface definitions from services/interfaces.ts to utils/interfaces.ts
- Updated all interface imports across the application to use new path

## 10.4.0 - 2025-03-23

### Changed

- Migrated feedback functionality from SystemController to dedicated FeedbackController
- Removed FeedbackService and ErrorService in favor of direct API calls
- Simplified error handling by using apiConnector directly in controllers

## 10.3.0 - 2025-03-23

### Changed

- Moved contact message handling from SystemController to dedicated ContactController
- Removed ContactService in favor of direct controller implementation
- Updated ContactModal to use new ContactController

## 10.2.0 - 2025-03-23

### Changed

- Moved APIService to controllers directory and renamed to APIController
- Updated related imports across the application to use new APIController path

## 10.1.0 - 2025-03-22

### Added

- Implemented email verification resend functionality
- Added dedicated ToastController for consistent toast notifications
- Added support for buttons in Toast interface

### Changed

- Improved error handling with ICustomError type checking
- Refactored login form component with proper TypeScript types
- Updated toast implementations to use centralized ToastController

## 10.0.0 - 2025-03-21

### Added

- Support for retrying GET and POST requests in APIService after token refresh.
- Implemented the handleTokenRefresh method to wrap requests when the token expires.
- Added refreshAccessToken method to automatically update the access and refresh tokens.

### Changed

- Updated APIService to obtain its configuration (baseUrl, accessToken, refreshToken, refreshTokenEndPoint) from the config service.
- Adjusted authorization headers in the GET and POST methods of APIService.
- Refactored error handling to detect token expiration and trigger a request retry.

## 9.5.0 - 2025-03-05

- Changed the way feedback reporting works

## 9.4.1 - 2025-03-05

### Changed

- Changed ButtonIconAnimationComponent to LoadButton

### Removed

- Removed IonItemLoader Component

## 9.4.0 - 2025-03-05

### Changed

- Changed the way error reporting works

## 9.3.0 - 2025-03-03

### Changed

- The way errors are handled in controllers and services has been changed

## 9.2.0 - 2025-03-02

### Added

- Added handleError to missing controllers

## 9.1.3 - 2025-03-02

### Added

- Added prettier format prop to postPage cardCode component

## 9.1.2 - 2025-03-02

- Simplified post page layout

## 9.1.1 - 2025-03-02

### Changed

- CSS code was changed to Ionic variables

## 9.1.0 - 2025-03-01

### Changed

- Simplified posts page layout

## 9.0.13 - 2025-02-28

### Removed

- Removed unused CardAlert and CardCode components.

## 9.0.12 - 2025-02-28

### Added

- Added CardAlert and CardCode to MarkdownViewer

## 9.0.11 - 2025-02-26

### Changed

- Improved login UI

### Fixed

- Fixed issue preventing login
- Fixed problem with password reset

## 9.0.10 - 2025-02-17

### Fixed

- Adapted to the new operation of CardOptionsExpand(0.9.4)

### Chaged

- Ionic extra components updated to version 0.9.4

## 9.0.9 - 2025-02-15

### Added

- Added CardOptionsExpand to Options Edit Component Post

## 9.0.8 - 2025-02-15

### Added

- Added CardOptionsExpand to Admin Users Filter Options Component

## 9.0.7 - 2025-02-15

### Changed

- Replaced ButtonIconAnimationComponent with LoadButton in Admin Users Component
- Replaced CardOptions with CardOptionsExpand in Admin Users Component

## 9.0.6 - 2025-02-15

### Fixed

- Fixed issue with the size of the new ion-item when the update button was not present

## 9.0.5 - 2025-02-15

### Added

- Added button update app

## 9.0.4 - 2025-02-15

### Changed

- Added component for reusing portfolio projects

## 9.0.3 - 2025-02-15

### Fixed

- Fixed issue that opened the wrong project in PortfolioPage

## 9.0.2 - 2025-02-14

### Fixed

- Fixed url ionic components project

## 9.0.1 - 2025-02-14

### Fixed

- Fixed url ionic components project

## 9.0.0 - 2025-02-06

### Changed

- Updated the landing page to display information in a simpler and more centralized way.

- Completely redesigned the site to make it simpler and more visually attractive.

### Fixed

- Corrected various issues in the user administration panel that prevented it from working correctly.

## [8.12.14] - 2024-12-13

### Added

- Added changelog file

### Changed

- Design improvements

### Removed

- Removed old versioning system

## [8.12.13] - 2024-12-12

### Added

- Improved readability: several improvements were made to the post page design

### Fixed

- General fixes

## [8.11.0] - 2024-12-02

### Added

- Added a settings panel to the post editor
- Minor improvements to the post editor

## [8.10.0] - 2024-11-29

### Added

- Resolved the issue that hid the post content
- Improved navigation fluidity on the presentation page
- API call optimization

### Fixed

- General fixes

## [8.8.0] - 2024-11-25

### Added

- Design improvements

### Fixed

- General fixes

## [8.6.5] - 2024-11-18

### Added

- Design improvements

## [8.6.0] - 2024-11-17

### Added

- General optimizations

### Fixed

- General fixes

## [8.5.2] - 2024-11-12

### Added

- Improved version listing
- API improvements
- Post page design improvements
- Performance improvements

### Fixed

- Fixed issue that prevented logging out

## [8.1.1] - 2024-11-23

### Fixed

- Fixes for status filter

## [8.1.0] - 2024-11-08

### Added

- Ability to filter posts by status (admin only)

## [8.0.1]

### Added

- Performance optimizations

### Fixed

- Minor fixes

## [8.0.0]

### Added

- New design
- Performance improvements

## [7.5.6]

### Added

- Blur effect

### Fixed

- Minor fixes
