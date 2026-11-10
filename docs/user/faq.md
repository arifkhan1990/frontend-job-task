# FAQ

## Do I need an account to read posts?

No. Every `/users/<id>/posts` page is public.

## Why do I not see other users' notes?

Notes are private by default. Only admins can read every user's notes; regular users never can.

## Why was I logged out?

Access tokens expire after 15 minutes. The client refreshes silently using the refresh cookie. If the refresh token is expired, revoked or reused, the client clears the session and asks you to log in again.

## Can I change my own role?

No. An admin can change another user's role, but self-role changes and self-deletion are blocked.

## How do I switch theme or language?

Use the theme and language controls in the header. Both choices are saved locally.
