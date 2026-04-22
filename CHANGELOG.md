# Changelog

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