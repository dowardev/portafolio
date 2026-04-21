# Changelog

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