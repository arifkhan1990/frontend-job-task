# Getting started

Notes API is a small workspace for private notes, public posts and admin management.

## Create an account

1. Open **Register**.
2. Enter your name, email and a password of at least 8 characters.
3. Add interests as a comma-separated list, for example `chess, reading`.
4. Submit the form.

New accounts always start with the **user** role. An administrator can promote you later.

## Log in

Open **Log in**, enter your email and password, and submit. The session uses a short-lived access token plus a refresh cookie, so a page refresh keeps you signed in.

## Roles at a glance

| Capability | User | Admin |
| --- | :---: | :---: |
| Manage own notes | Yes | Yes |
| Manage own posts | Yes | Yes |
| Read everyone's notes | No | Yes |
| Manage users | No | Yes |
| View users grouped by interests | No | Yes |

## Next steps

- [Notes](/docs#notes)
- [Posts](/docs#posts)
- [Admin views](/docs#admin)
