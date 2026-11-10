# Notes API Client

Minimal React client for the secure notes API. The task prioritises backend functionality, so the UI is deliberately plain and focused on exercising every API flow.

Backend repository: [`backend-job-task`](https://github.com/arifkhan1990/backend-job-task)

---

## Features

- Register and log in with JWT authentication.
- Create, edit and delete personal notes with pagination.
- Admin user management: create, edit, list and delete users.
- Admin read-only view of every note, filterable by owner.
- Admin interests view backed by the `$group` aggregation.
- Public per-user posts page backed by the `$lookup` aggregation.
- Logged-in users can publish posts on their own profile.
- Automatic logout when the API rejects an expired token.
- Loading, empty and error states on every data view.

---

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Login |
| `/register` | Public | Create a user account |
| `/` | Authenticated | Personal notes |
| `/admin/users` | Admin | User management |
| `/admin/notes` | Admin | All notes, filterable by owner |
| `/admin/interests` | Admin | Users grouped by interests |
| `/users/:id/posts` | Public | Public posts for a user |

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- The backend API running on `http://localhost:5000`

### Install and run

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

The Vite dev server proxies `/api` to `http://localhost:5000`, so the default `VITE_API_URL=/api` works without CORS changes.

### Build

```bash
npm run build
npm run preview
```

For a production build served from another origin, set the full API URL before building:

```bash
VITE_API_URL=https://api.example.com/api npm run build
```

On the backend, add the frontend origin to `CORS_ORIGIN`.

### Docker

```bash
docker build --build-arg VITE_API_URL=https://api.example.com/api -t notes-client .
docker run --rm -p 8080:80 notes-client
```

The Nginx image serves the SPA and falls back to `index.html` for client-side routes.

### Scripts

```bash
npm run dev       # Vite dev server
npm run build     # production build
npm run preview   # preview the build
npm run lint      # ESLint
```

---

## Authentication storage

The JWT is stored in `localStorage` so a page refresh keeps the session. This is acceptable for a small demo, but a production app should prefer an `httpOnly`, `Secure`, `SameSite` cookie with CSRF protection to reduce XSS exposure. The API itself is stateless and accepts a bearer token, so switching the client storage does not require backend changes.

---

## Admin account

The frontend has no hard-coded credentials. Create the first admin with the backend seed script:

```bash
cd ../backend-job-task
npm run seed:admin
```

Then log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the backend `.env`.

---

## Project structure

```text
src/
  api/client.js          Fetch wrapper, ApiError and error formatting
  context/               Auth state, token persistence, login/register/logout
  hooks/useApi.js        Small data-fetching hook with loading/error/reload
  components/            Layout, protected route, pagination, alert
  pages/                 Login, register, notes, admin pages, public posts
```

No UI framework or component template is used; styling is a single hand-written stylesheet.
