# Library Organization

This folder contains utilities, helpers, and business logic — not React components.

## Folder Structure

```
lib/
├── api/                   # API client and endpoint definitions
│   ├── client.ts          # HTTP client with interceptors
│   ├── errors.ts          # API error handling and types
│   ├── index.ts           # Public API exports
│   └── endpoints/         # API endpoint functions (grouped by feature)
│       ├── auth.ts        # Authentication endpoints
│       ├── dashboard.ts   # Dashboard endpoints
│       └── index.ts       # Export all endpoints
├── auth/                  # Authentication utilities
│   └── session.ts         # Session token management
├── design-system/         # Design system helpers
│   └── color-utils.ts     # Color manipulation functions
├── forms/                 # Form utilities
│   └── zod-field-errors.ts # Zod error formatting
├── routing/               # Routing utilities
│   └── proxy-routes.ts    # Route proxy helpers
├── validations/           # Zod schemas
│   ├── auth.ts            # Auth validation schemas
│   ├── common.ts          # Common/reusable schemas
│   ├── dashboard.ts       # Dashboard schemas
│   ├── parse.ts           # Schema parsing helpers
│   └── index.ts           # Export all schemas
├── mocks/                 # Mock data for testing
│   └── dashboard.ts       # Mock dashboard data
├── constants.ts           # Application constants
├── env.ts                 # Environment variables
└── utils.ts               # General utilities (cn, formatting, etc.)
```

## Organization Principles

1. **By Feature** → `api/endpoints/auth.ts`, `validations/auth.ts`
2. **By Concern** → `auth/`, `forms/`, `validations/`
3. **Clear Names** → `color-utils.ts` (not `colors.ts` or `colorHelpers.ts`)
4. **Exports Organized** → Each folder has an `index.ts`

## When to Add

- **api/** → API client functions
- **auth/** → Authentication/session logic
- **design-system/** → Design token helpers
- **forms/** → Form handling utilities
- **validations/** → Zod schemas
- **mocks/** → Test/mock data
- **constants.ts** → Hardcoded values (timings, error messages, etc.)
- **utils.ts** → General utilities

## Example Usage

```tsx
// ✅ Good: Clear imports from organized folders
import { useForm } from "@/hooks";
import { loginSchema } from "@/lib/validations/auth";
import { login } from "@/lib/api/endpoints/auth";
import { ERROR_MESSAGES } from "@/lib/constants";

// ❌ Avoid: Scattered imports
import loginSchema from "../../../validators";
import { login } from "../../../api/auth-client";
```
