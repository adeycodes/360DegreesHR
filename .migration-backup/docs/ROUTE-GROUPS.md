# Route groups

Parentheses in `src/app/` folder names are **route groups** — they organize layouts and do **not** appear in the URL.

```
src/app/
├── (auth)/login/page.tsx           → /login
├── (auth)/login/password/page.tsx  → /login/password
├── (auth)/register/page.tsx        → /register
├── (protected)/dashboard/page.tsx  → /dashboard
├── (protected)/hris/page.tsx        → /hris (redirects to /hris/employees)
├── (protected)/hris/[section]/page.tsx → /hris/employees | departments | …
└── splash/page.tsx                 → /splash
```

| Group | Purpose |
|-------|---------|
| `(auth)` | Public auth screens — split layout, no sidebar |
| `(protected)` | Protected HRIS — `DashboardShell` (sidebar + top bar) |

## Middleware

`src/middleware.ts` uses `src/lib/routing/middleware-routes.ts`:

- `/` → `/splash` (guest) or `/dashboard` (signed in)
- Public auth paths allow guests; signed-in users are sent to `/dashboard` from splash/login/register
- `/hris/*` and `/dashboard` require `auth_token` cookie

## After changing routes

If you delete or move `page.tsx` files while `npm run dev` is running, stop the server, delete `.next`, and start again:

```bash
# PowerShell
Remove-Item -Recurse -Force .next
npm run dev
```
