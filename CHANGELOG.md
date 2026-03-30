# Changelog

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
