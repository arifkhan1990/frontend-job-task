# Deployment

## Backend

The Docker image is multi-stage and contains production dependencies only. Compose starts MongoDB as a single-node replica set, waits for health, runs `npm run migrate:up`, then starts the API.

Required production variables:

- `MONGODB_URI` with `?replicaSet=rs0`
- `JWT_SECRET` (32+ random characters)
- `COOKIE_SECURE=true` behind HTTPS
- `COOKIE_SAME_SITE=none` for a cross-site frontend, `lax` for same-site
- `CORS_ORIGIN` with the exact frontend origin
- `AUTO_INDEX=false`

## Frontend

```bash
VITE_API_URL=https://api.example.com/api/v1 \
VITE_SITE_URL=https://notes.example.com \
npm run build
```

Serve `dist/` with SPA fallback (`try_files $uri /index.html`). The included Dockerfile uses Nginx.

## CI/CD

- Backend CI: repo hygiene, migrate, lint, tests, `npm audit`.
- Frontend CI: lint and production build.
- Release workflow (to add): build and push images on tags; server deployment is guarded by repository variables/secrets.
- Never deploy by copying the working directory. Deploy the image/artifact only.

## Health

- `GET /health` — liveness.
- `GET /ready` — database readiness; used by the Docker health check.

## Migrations and backups

Run `npm run migrate:up` before the API starts. Backups use encrypted `mongodump` archives; see the backend `docs/backup-restore.md`.
