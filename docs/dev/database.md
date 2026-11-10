# Database and indexes

## Collections

| Collection | Purpose |
| --- | --- |
| `users` | Account, role and interests |
| `notes` | Private notes with `owner` |
| `posts` | Public posts with `author` |
| `refreshtokens` | Hashed refresh tokens, rotation and TTL cleanup |

All documents use MongoDB `_id` plus `createdAt`/`updatedAt`. User deletion is transactional and cascades to notes, posts and refresh tokens.

## Task indexes

| Collection | Index | Query |
| --- | --- | --- |
| `users` | `{ email: 1 }` unique | Login lookup and uniqueness |
| `users` | `{ createdAt: -1, _id: -1 }` | Admin user list |
| `users` | `{ interests: 1 }` | Interest equality filter |
| `notes` | `{ owner: 1, createdAt: -1, _id: -1 }` | User notes / admin owner filter |
| `notes` | `{ createdAt: -1, _id: -1 }` | Admin all-notes list |
| `posts` | `{ author: 1, createdAt: -1, _id: -1 }` | `$lookup` and post sort |
| `refreshtokens` | `{ tokenHash: 1 }` unique | Refresh lookup |
| `refreshtokens` | `{ user: 1, createdAt: -1 }` | Revoke-all |
| `refreshtokens` | `{ expiresAt: 1 }` TTL | Expiry cleanup |

No text index, role index or all-posts index is needed by the assignment. The interests `$group` is a blocking stage; the multikey index supports the optional filter, not the grouping itself.

## Aggregations

1. **Interests** — one `aggregate()` pipeline with `$unwind`, `$group`, `$sort`, `$project`, `$facet`.
2. **Posts by user** — one pipeline with a single `$lookup`, sorted inside the lookup, paginated with `$facet`.

See the backend README and `docs/performance.md` for the `EXPLAIN` evidence.
