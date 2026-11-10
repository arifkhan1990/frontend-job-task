# Decisions

## Assignment-first scope

The interview PDF explicitly asks for a backend-focused task and no unnecessary indexes. The generic rules kit was applied for engineering quality, but product scope stayed with the PDF:

- No search/sort indexes that the PDF did not ask for.
- No marketing hero or stock imagery.
- Hard delete rather than soft delete, because recoverability is not part of the task.
- Audit events go to structured logs instead of a new collection/index.

## Auth

Short access tokens + rotating refresh cookies were chosen over a single long JWT. Refresh tokens are hashed, revocable and reuse-detected. CSRF is double-submit.

## Pagination

Offset pagination keeps page numbers simple. Deep offsets cost more; cursor pagination on `_id` would be the next step.

## Transactions

Registration, profile updates, refresh rotation, user deletion and bulk delete use MongoDB transactions. The Compose and CI environments run a single-node replica set.

## Aggregations

Interests use `$unwind` + `$group` + `$facet` in one `aggregate()` call. Post-by-user uses one `$lookup` with an inner sort and `$facet`. The blocking `$group` scan is expected; the multikey index supports only the optional equality filter.

## Frontend

Radix primitives instead of native selects/modals; TanStack Query for server state; RHF + Zod for forms; i18next for English/Bangla; CSS design tokens with light/dark themes. Route-level lazy loading keeps the interests chart (Recharts) out of the initial bundle.
