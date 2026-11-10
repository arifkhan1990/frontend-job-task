# Authentication and authorization

## Passwords

bcrypt with a configurable cost (default 12). The hash is `select: false` and removed by the JSON transform. Passwords are capped at 72 bytes.

## Access token

- HS256, 15 minutes, verified `issuer` and `audience`.
- Claims: `sub` and `role` only.
- The account is re-fetched on every request so deletion and role changes apply immediately.

## Refresh token

- 384-bit random value; only a SHA-256 hash is stored.
- Delivered in an `HttpOnly` `refresh_token` cookie scoped to `/api/v1/auth`.
- Seven-day TTL; rotated on every refresh.
- Reuse of a revoked token revokes every active session for that user.
- Password change, role change, logout and account deletion revoke refresh tokens.

## CSRF

Refresh and logout use double-submit CSRF:

1. `GET /auth/csrf` (or login/register/refresh) sets a readable `csrf_token` cookie and returns the token.
2. The SPA sends `X-CSRF-Token`.
3. The API compares cookie and header with `crypto.timingSafeEqual`.

## Authorization

- `authenticate` verifies the Bearer token and re-fetches the user.
- `authorize('admin')` guards admin routes.
- Notes are owner-scoped; non-owners receive `404` to avoid existence leaks.
- Admins can read all notes but cannot mutate another user's note.
- Self-delete, self-role change and last-admin removal are blocked.
