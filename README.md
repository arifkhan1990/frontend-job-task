# Notes API Client

React client for the secure notes API, with a functional admin surface, public posts and a small design system.

**Stack:** React 18 · Vite · Radix primitives · TanStack Query · React Hook Form + Zod · Recharts · Nginx

The backend is in [`backend-job-task`](https://github.com/arifkhan1990/backend-job-task).

> This is the **strict-PDF variant**: a single 1-hour JWT, with no refresh token or CSRF cookie. The `main` branch keeps rotating refresh tokens and CSRF for stronger revocation guarantees.

---

## Features

- Login, registration and session recovery via a single JWT.
- Notes CRUD with a card grid, relative timestamps, quick edit/delete actions, dialog character counters and pagination.
- Admin user management with a sortable, filterable, selectable DataTable and bulk delete.
- Admin all-notes view with owner avatars, owner filter and column visibility.
- Interests aggregation view with a responsive distribution chart.
- Public per-user posts with a journal-style hero/feed and an owner-only publish dialog.
- English-only UI with a persisted light/dark theme.
- SEO metadata, canonical URLs, Open Graph tags, robots and sitemap generation.
- Route-level code splitting; Recharts is isolated to the lazy interests route.
- Responsive dashboard shell: sidebar, breadcrumbs, user menu, mobile drawer and footer.

---

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Login |
| `/register` | Public | Create a user account |
| `/` | Authenticated | Personal notes |
| `/admin/users` | Admin | User management and bulk delete |
| `/admin/notes` | Admin | All notes, filterable by owner |
| `/admin/interests` | Admin | Users grouped by interests |
| `/users/:id/posts` | Public | Public posts for a user |

`/login` and `/register` render in a focused modal layout with no app navigation.

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- The backend running on `http://localhost:5000` with its MongoDB replica set

### Install and run

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

The Vite dev server proxies `/api` to `http://localhost:5000`, and the default `VITE_API_URL=/api/v1` works without CORS changes.

### Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `/api/v1` | API base URL |
| `VITE_SITE_URL` | `http://localhost:5173` | Canonical URL and generated sitemap |

### Scripts

```bash
npm run dev               # Vite dev server
npm run build             # production build + robots.txt/sitemap.xml
npm run preview           # preview the build
npm run lint              # ESLint
```

---

## Authentication

This branch uses a single 1-hour JWT.

1. Login/register returns `{ user, token }`.
2. API calls use `Authorization: Bearer <token>`.
3. The token is kept in `sessionStorage` so a page reload keeps the session; closing the tab clears it.
4. A `401` clears the session and redirects to login. There is no refresh endpoint or CSRF cookie.

The token is not written to `localStorage`.

---

## Project structure

```text
src/
  api/                 fetch wrapper, JWT token store
  app/                 query and theme providers
  components/ui/       buttons, fields, select, dialog, toast, skeleton, DataTable
  components/shared/   app shell, sidebar, user menu, breadcrumbs, states, SEO
  features/
    auth/              provider, schemas, login/register pages
    notes/             api, hooks, schemas, dialog, note card, notes/all-notes pages
    users/             api, hooks, schemas, dialog, users page
    interests/         api, hooks, chart page
    posts/             api, hooks, schemas, dialog, post card/hero, public posts page
  styles/              tokens, base, UI, layout, table, page styles
  utils/               class names, dates
scripts/               SEO generation
```

---

## UI decisions

- **Radix primitives** provide accessible dialogs, selects, toasts and menus; no native `<select>`.
- **TanStack Query** owns server state and cache invalidation. Feature hooks are the only callers of feature APIs.
- **React Hook Form + Zod** provide inline validation, disabled submit states and dirty-form warnings.
- **Design tokens** define colors, spacing, radius, shadows, typography, motion and dark-mode values.
- **DataTable** provides sorting, column visibility, debounced search, page size, row selection, bulk actions, sticky headers, empty/loading/error states and mobile cards.
- **Notes** use a card grid with relative timestamps and quick actions; **posts** use a public journal hero and full-content feed.
- **Route-level lazy loading** keeps the chart bundle out of the initial app shell.

---

## Docker

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com/api/v1 \
  --build-arg VITE_SITE_URL=https://notes.example.com \
  -t notes-client .

docker run --rm -p 8080:80 notes-client
```

The Nginx image serves the SPA with `try_files` fallback for client routes. The tag-based release workflow and opt-in deploy job are documented in [`deploy/README.md`](deploy/README.md).

## Production

The client is deployed at **https://notes.nabasolution.tech** with `VITE_API_URL=https://notes-api.nabasolution.tech/api/v1`. Pushes to `main` auto-deploy through the self-hosted srv host.

---

## Quality

- ESLint + production build are required in CI.
- The backend owns the API/integration suite; this client is verified with a headless Chrome pass covering login, dialogs, DataTable views, chart, public posts, theme, English-only copy and 360px mobile layout.
- axe-core reports 0 serious/critical WCAG 2 A/AA violations on login, notes, users, interests and all notes.
- 360×800, 768×1024, 1024×768 and 1440×900 have no horizontal page overflow; the skip link is the first focus target.
- Local Chrome measurements: LCP 160–284 ms, CLS 0. Recharts is a lazy route chunk.
- `CHANGELOG.md` is the release history.
