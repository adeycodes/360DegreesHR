---
name: 360HR backend API
description: Shape and quirks of the live 360DegreesHR backend that the Next.js app (artifacts/360-hr) consumes.
---

# 360HR live backend (https://three60degreeshr-iewp.onrender.com/api/v1)

Swagger JSON is embedded in `/api/v1/docs/swagger-ui-init.js` under `"swaggerDoc":`
(the `/swagger.json` path 404s). Brace-balance parse it to extract the spec.

## Surface
Only 5 tags, 21 endpoints: Auth, Departments, Disciplinary Records, Employees,
Employment History. **There is NO `/dashboard` and NO `/reports` endpoint.**

**How to apply:** Dashboard figures and any "reports" screens must be derived
client-side from `/employees` and `/departments/company/tree`. The Reports route
renders the audit-logs screen, which has no backing endpoint and stays on mock data.

## Envelope
All responses are `{ success, message, data }`. The `request<T>` helper in
`src/lib/api.ts` unwraps `.data` automatically — type API clients to the inner
shape, not the envelope.

## Auth field-name inconsistency (easy to get wrong)
- `POST /auth/register` returns `user.id`
- `POST /auth/login` returns `user.userId`
- `GET /auth/me` returns `userId` (top-level)
- role comes UPPERCASE (e.g. `HR_ADMIN`); the app's `UserRole` is lowercase, so
  `.toLowerCase()` it when mapping.
**Why:** Mismapping these makes `userid` undefined → `/auth/me` rehydration fails →
clearSession → redirect to /login on every protected page.

## Company-scoped + empty data
A freshly registered company has zero employees/departments — `GET /employees`
returns `{ employees: [], pagination: { total: 0 } }`. That is expected, not a bug.
Directory/org/dashboard screens fall back to demo/mock data when the API returns
empty OR errors. Render free tier may sleep; first request can be slow / return HTML.

## Create employee
`POST /employees` (CreateEmployeeRequest) requires firstName, lastName, email,
password, gender (MALE/FEMALE). employmentType enum: FULL_TIME/PART_TIME/CONTRACT/
INTERN/REMOTE. departmentId must be a real UUID (fetch via `GET /departments`).
Do NOT send salary/currency/hireDate — not in the schema.
