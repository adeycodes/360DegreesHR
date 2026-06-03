# 360DegreesHR — Architecture & conventions

See also: **[MVP.md](./MVP.md)** · **[API.md](./API.md)** · **[ROUTE-GROUPS.md](./ROUTE-GROUPS.md)**

## Folder structure

```
src/
├── app/
│   ├── (auth)/              # Public auth routes (URL has no "auth" prefix)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (protected)/         # Protected app shell
│   │   ├── dashboard/
│   │   └── hris/[section]/  # employees, departments, documents, disciplinary
│   ├── splash/
│   └── design-system/
├── components/
│   ├── design-system/       # Tokens reference UI
│   ├── features/
│   │   ├── auth/screens/    # Figma auth flows (one file per screen)
│   │   ├── dashboard/       # hris-dashboard-screen.tsx
│   │   ├── hris/            # module-placeholder.tsx
│   │   └── splash/
│   ├── shared/
│   │   ├── auth/            # auth-split-layout, auth-field, auth-footer, …
│   │   ├── brand-logo.tsx   # compact + splash sizes
│   │   └── dashboard-shell.tsx
│   └── ui/                  # shadcn primitives
├── config/
│   ├── api-paths.ts
│   ├── hris-pages.ts        # HRIS placeholder metadata
│   ├── navigation.ts
│   └── routes.ts
├── lib/
│   ├── api/endpoints/
│   ├── auth/session.ts
│   ├── forms/zod-field-errors.ts
│   └── validations/
├── stores/
└── middleware.ts
```

## Conventions

| Rule | Detail |
|------|--------|
| **Pages stay thin** | `app/**/page.tsx` only imports a feature screen component |
| **One screen = one file** | `components/features/<area>/screens/<name>-screen.tsx` or `<name>-screen.tsx` for dashboard |
| **Shared auth chrome** | `components/shared/auth/*` — not duplicate layouts per form |
| **No duplicate forms** | Do not add `*-form.tsx` alongside `*-screen.tsx`; screens own UI + submit logic |
| **Logos** | Use `BrandLogo` (`size="splash"` on splash, default in shell) |
| **HRIS placeholders** | Add section in `config/hris-pages.ts`; route is automatic via `[section]` |

## State management (Zustand)

- **`auth-store`** — user + session (sessionStorage + cookie for middleware)
- **`ui-store`** — UI chrome when needed

## Validation & errors (Zod)

- Request/response schemas in `lib/validations/`
- Field errors from forms: `fieldErrorsFromZod()` in `lib/forms/zod-field-errors.ts`
- API responses parsed in `lib/validations/parse.ts`
- UI shows `toUserMessage(error)` only

## Security

- No secrets in `NEXT_PUBLIC_*`
- Bearer token in sessionStorage; `auth_token` cookie for middleware
- Protected routes via `middleware.ts`

## Adding a Figma screen

1. Add route in `config/routes.ts` if new.
2. Create `components/features/<area>/screens/<screen>.tsx`.
3. Wire `app/.../page.tsx` with a single import.
4. Add Zod + `lib/api/endpoints/` when the API contract is known.
