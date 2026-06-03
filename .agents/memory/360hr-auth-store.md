---
name: 360HR auth store shape
description: AuthState fields and how to access user/session data from the Zustand store
---

## Rule
`useAuthStore` exposes `user: AuthUser | null` (not a `session` object).
Always use `useAuthStore((s) => s.user)` to get the current user.

**Why:** `AuthState` was designed with a flat `user` field. There is no `session` property.
The `setSession()` action accepts an `AuthSession` and extracts the user internally.

**How to apply:** In any screen that needs the current user (name, role, etc.), selector is `s.user`.
