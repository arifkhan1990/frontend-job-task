# API reference

The API base path is `/api/v1`.

- Swagger UI: [`/api/docs`](/api/docs)
- Raw OpenAPI 3 spec: [`/api/openapi.yaml`](/api/openapi.yaml)

## Response shape

Success:

```json
{ "data": {}, "meta": { "page": 1, "limit": 20, "total": 1, "pages": 1 } }
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "path": "email", "message": "Enter a valid email" }]
  }
}
```

## Main endpoints

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/csrf`, `GET/PATCH /auth/me` |
| Users | `GET/POST /users`, `GET/PATCH/DELETE /users/:id`, `POST /users/bulk-delete`, `GET /users/grouped-by-interests` |
| Notes | `GET/POST /notes`, `GET/PATCH/DELETE /notes/:id` |
| Posts | `POST /posts`, `GET /users/:id/posts` |

## Pagination

All list endpoints accept `page` (default 1) and `limit` (default 20, max 100). Responses include `meta.page`, `meta.limit`, `meta.total` and `meta.pages`.

## Auth headers

- Access token: `Authorization: Bearer <accessToken>`
- Refresh/logout: `X-CSRF-Token` must match the `csrf_token` cookie.
