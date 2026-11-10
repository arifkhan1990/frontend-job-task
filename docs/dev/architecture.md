# Architecture

## Repositories

- `backend-job-task` — Express API, MongoDB models, repositories, services, OpenAPI, Docker, tests.
- `frontend-job-task` — React/Vite client, Radix primitives, TanStack Query, docs and screenshots.

## Frontend layers

```text
src/
  api/                 fetch wrapper, refresh, CSRF, in-memory token
  app/                 providers (theme, query)
  components/ui/       buttons, fields, dialog, select, toast, table
  components/shared/   shell, sidebar, breadcrumbs, states, SEO
  features/<domain>/   api.js, hooks.js, schemas.js, components, pages
  i18n/                English + Bangla resources
  styles/              tokens, base, layout, table, pages
```

Pages do not call `fetch` directly. Feature `api.js` files own transport, `hooks.js` owns TanStack Query caching and invalidation, and components render.

## Backend layers

```text
routes -> controllers -> services -> repositories -> Mongoose models
```

Controllers translate HTTP only. Services own business rules (ownership, roles, token rotation). Repositories own queries and aggregations.

## Auth flow

1. Login returns a 15-minute access token and sets `refresh_token` (HttpOnly) and `csrf_token` cookies.
2. The SPA keeps the access token in memory and sends it as a Bearer token.
3. On `401 TOKEN_EXPIRED`, the client calls `/auth/refresh` with the CSRF header, gets a new access token and retries once.
4. Refresh rotates the token. Reuse revokes every session for that user.

## Data flow

```text
Browser -> Vite proxy -> Express /api/v1 -> service -> repository -> MongoDB
```
