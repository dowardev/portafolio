# Changelog

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