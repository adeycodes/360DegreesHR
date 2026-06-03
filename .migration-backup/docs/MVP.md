# MVP — 360DegreesHR

## Product summary

Multi-tenant SaaS HRMS covering the employee lifecycle. Three roles:

| Role | Capabilities |
|------|----------------|
| **HR Admin** | Employee records, payroll, assets, disciplinary, policies |
| **Manager** | Requisitions, leave approval, team performance, hiring input |
| **Employee** | Self-service profile, leave, documents, announcements |

## MVP modules (phased)

| # | Module | Status | Screens |
|---|--------|--------|---------|
| 1 | **HRIS** | **Active** | 12–15 |
| 2 | Recruitment | Planned | 10–12 |
| 3 | Onboarding | Planned | 8–10 |
| 4 | Payroll | Planned | 10–12 |
| 5 | Leave | Planned | 8–10 |
| 6 | Dashboard & analytics | Active (with HRIS) | 10–12 |

**Current build:** Module 1 (HRIS) + auth + dashboard APIs.

## Workflows (reference)

- **Recruitment:** Requisition → approval → pipeline → offer → onboarding  
- **Onboarding:** Offer → documents → HR review → HRIS profile → access  
- **Leave:** Request → manager → HR → balance update  
- **Payroll:** HR run → deductions → payslip → employee portal  
- **Disciplinary:** HR records → employee profile in HRIS  

## App routes (implemented)

### Auth (API wired — update paths in `src/config/api-paths.ts`)

| Route | Purpose |
|-------|---------|
| `/login` | Sign in |
| `/register` | Create company account |
| `/forgot-password` | Request reset email |
| `/reset-password?token=` | Set new password |

### App (protected)

| Route | Purpose |
|-------|---------|
| `/dashboard` | Role overview (HRIS module 1) |
| `/hris/employees` | Employee directory (Figma pending) |
| `/hris/departments` | Org structure (Figma pending) |
| `/hris/documents` | Document vault (Figma pending) |
| `/hris/disciplinary` | Disciplinary records (Figma pending) |

## What to share next

1. **Exact API paths + request/response JSON** for auth + dashboard (we use placeholders).  
2. **Figma screens** per HRIS subsection — we replace placeholders in `components/features/`.  
3. Additional HRIS endpoints (employees CRUD, departments, etc.) one module at a time.
