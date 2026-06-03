# Component Organization

This folder is organized by concern and feature, not by component type.

## Folder Structure

```
components/
├── design-system/          # Design tokens + base UI components (typography, icons, colors)
├── ui/                     # Low-level UI primitives (button, input, card, etc.)
├── features/               # Feature-specific components (one per major feature)
│   ├── auth/              # Authentication screens and login/signup flows
│   ├── dashboard/         # Dashboard screens and dashboard-specific components
│   ├── hris/              # HRIS module screens and components
│   └── splash/            # Splash screen components
├── shared/                # Shared components used across features
│   ├── auth/              # Shared auth components (fields, layouts, etc.)
│   ├── brand-logo.tsx     # Brand logo component
│   └── dashboard-shell.tsx # Dashboard layout wrapper
├── layout/                # Layout components (wrappers, grids, etc.)
└── providers/             # Context providers (theme, auth, toast)
```

## When to Add a Component

1. **Design System** → Base design tokens and atomic components (colors, typography, icons)
2. **UI** → Reusable UI primitives without business logic (Button, Input, Card)
3. **Features** → Business logic related to a specific feature/page
4. **Shared** → Used across multiple features
5. **Providers** → Context/state providers for the app

## Component Example

```tsx
// ✅ Good: Clear feature folder structure
src/components/features/auth/screens/login-screen.tsx
src/components/features/dashboard/components/stat-card.tsx
src/components/shared/dashboard-shell.tsx

// ❌ Avoid: Scattered structure
src/components/LoginScreen.tsx
src/components/DashboardUtils.tsx
```

## File Naming

- **Components** (PascalCase): `LoginScreen.tsx`, `StatCard.tsx`
- **Utilities** (camelCase): `useForm.ts`, `formatDate.ts`
- **Types** (camelCase or kebab-case): `auth.ts`, `dashboard-types.ts`

## Exporting

- Use **named exports** from component files
- Use **index files** to organize folder exports:

```tsx
// src/components/features/auth/index.ts
export { LoginScreen } from "./screens/login-screen";
export { RegisterScreen } from "./screens/register-screen";
```
