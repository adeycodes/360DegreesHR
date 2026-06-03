---
name: 360HR API shape quirks
description: Mismatch between API response shapes and internal TypeScript types
---

## Rule
`authApi.registerCompany` returns `{ token, user: { id, name, email, role }, company? }`.
The `id` field maps to `AuthUser.userid` — the register-company screen manually maps:
`userid: user.id`.
Do NOT change `authApi.registerCompany` return type to use `AuthUser` directly — it will break.

**Why:** The API returns `id` but our internal `AuthUser` type uses `userid` (historical naming).
Changing the API response shape requires a backend change; the mapping lives at the call site.

**How to apply:** Any time you work with `registerCompany` response, keep the inline anonymous return type with `id`, not `AuthUser`.
