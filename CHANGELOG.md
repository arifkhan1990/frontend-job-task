# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Production runs at https://notes.nabasolution.tech with push-to-`main` auto deploy.

## [1.1.0] - 2026-11-10

### Added

- Radix-based UI primitives, dialog forms, typed toasts, skeleton states and ConfirmDialog.
- TanStack Query feature hooks with cache invalidation and server-side pagination.
- React Hook Form + Zod validation with inline errors and unsaved-change warnings.
- DataTable with sorting, column visibility, search, page size, row selection, bulk user delete and mobile cards.
- Admin bulk user deletion UI and transactional backend endpoint.
- Interests distribution chart and grouped interest cards.
- English/Bangla i18n with persisted language switcher.
- Light/dark theme tokens with persisted theme toggle.
- Public `/docs`, admin `/dev/docs` and `/changelog` routes with search, sidebar, TOC and screenshots.
- SEO metadata, canonical URLs, Open Graph tags, robots and sitemap generation.
- Route-level code splitting, including a lazy interests/chart route.
- Frontend `CHANGELOG.md`, docs screenshots script and footer version link.

### Changed

- Auth now uses in-memory access tokens with refresh-cookie session recovery and CSRF.
- The app shell has a collapsible sidebar, breadcrumbs, user menu, responsive drawer and footer.
- The old template pages and global stylesheet were removed.

## [1.0.0] - 2026-11-10

### Added

- Initial React client for the secure notes API: login, register, notes, admin users, all notes, interests and public posts.
- Initial Docker, CI and documentation.
