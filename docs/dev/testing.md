# Testing and quality gates

## Backend

```bash
cd backend-job-task
npm test
npm run verify
```

The backend suite has 49 tests: 37 API/integration cases against a MongoDB replica set and 12 unit cases for pagination, token hashing and auth-service rotation branches.

Coverage includes:

- register/login/refresh/logout, CSRF, cookie flags and reuse detection
- RBAC, ownership, self-delete and last-admin rules
- note CRUD, bulk user delete and transactional cascade
- pagination metadata and exact index inventories
- interests aggregation (single `aggregate()` assertion)
- posts `$lookup` (single `$lookup`, sorted/paginated)
- health and readiness

`npm run verify` runs repo hygiene, `npm ci`, ESLint, tests and the production dependency audit. CI adds a migration run and the same audit.

## Frontend

```bash
cd frontend-job-task
npm run lint
npm run build
```

The browser smoke suite is executed with Playwright against the real API. It covers login, note dialogs, user dialogs, DataTable views, the interests chart, public posts, docs, theme/language switching and a 360px mobile viewport.

## Browser verification

The Playwright pass covers:

- admin login, note create/edit/delete dialogs, user create/edit dialogs
- users, all-notes and interests DataTable views
- public posts without auth, docs sidebar/hash/search, changelog
- theme and language switching
- 360px mobile drawer navigation

Accessibility and responsive checks:

- axe-core WCAG 2 A/AA: 0 serious/critical violations on login, notes, users, interests, all notes, docs, developer docs and changelog.
- 360×800, 768×1024, 1024×768 and 1440×900: no horizontal page overflow.
- Skip link is the first keyboard focus target.
- Local Chrome measurements: LCP 160–284 ms and CLS 0 after caching the user shell and reserving note-card skeletons. These are local observations, not production benchmarks.

## Bundle shape

The initial shell loads React, the router, TanStack Query and Radix primitives. Recharts is isolated to the lazy interests route (~387 KB raw / 111 KB gzip) and the Markdown renderer to the lazy docs/changelog routes (~165 KB raw / 50 KB gzip). The notes/posts/admin routes are separate chunks.

## Manual checks

- `npm run explain` in the backend to inspect query plans.
- Screenshot refresh: `npm run docs:screenshots` with both servers running.
