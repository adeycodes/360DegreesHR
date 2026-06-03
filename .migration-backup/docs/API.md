# API integration guide

Base URL: `NEXT_PUBLIC_API_URL` (see `.env.local`)

All calls go through `src/lib/api/`. Update paths in **`src/config/api-paths.ts`** when the backend contract is confirmed.

## Phase 1 — Auth & dashboard (HRIS entry)

| Action | Method | Config key | Zod schema |
|--------|--------|------------|------------|
| Create company account | `POST` | `auth.registerCompany` | `authSessionSchema` |
| Login | `POST` | `auth.login` | `authSessionSchema` |
| Get authenticated user | `GET` | `auth.me` | `authUserSchema` |
| Forgot password | `POST` | `auth.forgotPassword` | `messageResponseSchema` |
| Reset password | `POST` | `auth.resetPassword` | `messageResponseSchema` |
| Dashboard overview | `GET` | `dashboard.overview` | `dashboardOverviewSchema` |

### Register company request body

```json
{
  "companyName": "360Degrees HR",
  "companyEmail": "info@360degrees.com",
  "companyAddress": "Abuja, Nigeria",
  "companyPhone": "+2348012345678",
  "adminName": "Arthur",
  "adminEmail": "arthur@360degrees.com",
  "password": "SecurePass123"
}
```

Validated by `registerCompanySchema` in `src/lib/validations/auth.ts`.

### Default paths (change to match backend)

```
POST /auth/register-company
POST /auth/login
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
GET  /dashboard
```

### Expected session shape (adjust in `lib/validations/auth.ts`)

```json
{
  "user": {
    "id": "string",
    "email": "user@company.com",
    "firstName": "string",
    "lastName": "string",
    "role": "hr_admin | manager | employee",
    "companyId": "optional"
  },
  "accessToken": "jwt",
  "refreshToken": "optional"
}
```

### Auth header

```
Authorization: Bearer <accessToken>
```

Token is stored in `sessionStorage` and mirrored to `auth_token` cookie for middleware.

## Adding the next endpoint

1. Add path to `src/config/api-paths.ts`  
2. Add Zod schema in `src/lib/validations/`  
3. Add function in `src/lib/api/endpoints/<resource>.ts`  
4. Use from a feature component or hook — never from `app/` pages directly  

## Phase 2 — HRIS (upcoming)

Planned files:

- `lib/api/endpoints/employees.ts`
- `lib/api/endpoints/departments.ts`
- `lib/validations/hris.ts`

Share OpenAPI or example payloads when ready.
