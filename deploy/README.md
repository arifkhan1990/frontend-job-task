# Production deployment

The frontend is published as a static Nginx image from `.github/workflows/release.yml` on a `v*` tag. The server never builds from the working directory and never receives `.env`, tests or AI tooling files.

## Build-time values

Set these repository variables before tagging:

- `VITE_API_URL` — the public API base, for example `https://api.example.com/api/v1`
- `VITE_SITE_URL` — the public frontend origin, for example `https://notes.example.com`

If the frontend and API share an origin, use `/api/v1` and route `/api` to the backend at the reverse proxy. If they are cross-site, the backend needs `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=none` and a CORS allow-list entry for the frontend origin.

## One-time server setup

1. Install Docker Engine and the Compose plugin.
2. Create `/opt/notes-web` and copy `deploy/docker-compose.prod.yml` there.
3. Log in to GHCR if the package is private.

## Release and deploy

```bash
git tag v1.1.0
git push origin v1.1.0
```

The release workflow publishes `ghcr.io/arifkhan1990/frontend-job-task:v1.1.0` and `:latest`.

The `deploy` job is opt-in with repository variable `ENABLE_DEPLOY=true`, `DEPLOY_PATH=/opt/notes-web`, and the `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` secrets. It runs:

```bash
cd /opt/notes-web
docker compose -f deploy/docker-compose.prod.yml pull
docker compose -f deploy/docker-compose.prod.yml up -d
```

Point the reverse proxy at port `8080`. Roll back by deploying the previous image tag.
