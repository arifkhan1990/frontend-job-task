# Troubleshooting

## The page says it could not load

- Check that the API is running.
- Check `VITE_API_URL`; the default is `/api/v1`.
- Use **Try again** in the error state.
- For local development, confirm MongoDB is running as a single-node replica set.

## Login fails

- Confirm the email and password.
- If you changed your password, old refresh sessions are revoked; log in again.
- If you see "Too many authentication attempts", wait before retrying.

## A form will not close

Unsaved forms ask for confirmation before discarding changes. Save or choose **Discard**.

## The admin table is empty

Admin views require the `admin` role. If you just registered, ask an existing admin to promote your account.
