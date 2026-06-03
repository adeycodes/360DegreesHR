# 360DegreesHR Codebase Guide

Welcome to the 360DegreesHR frontend codebase. This guide explains the structure and conventions to keep the code clean and maintainable.

## Quick Links

- 📁 [Component Organization](./src/components/README.md)
- 📁 [Library Organization](./src/lib/README.md)
- 🏗️ [Architecture Guide](./docs/ARCHITECTURE.md)

## Project Structure at a Glance

```
360DegreesHR/
├── src/
│   ├── app/                    # Next.js 16 App Router pages
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (protected)/        # Protected routes (requires login)
│   │   ├── (marketing)/        # Marketing pages
│   │   └── layout.tsx          # Root layout with font setup
│   ├── components/             # React components (see components/README.md)
│   ├── config/                 # Configuration files
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and business logic (see lib/README.md)
│   ├── stores/                 # Zustand state stores
│   ├── styles/                 # Global and design system styles
│   └── types/                  # Shared TypeScript types
├── docs/                       # Documentation
├── public/                     # Static assets
└── package.json
```

## Key Technologies

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui + custom design system
- **State**: Zustand
- **Validation**: Zod
- **Fonts**: Manrope (brand), Open Sans (UI)

## Core Concepts

### 1. Design System First

The design system is implemented and available at `/design-system`. All colors, typography, and icons are tokens — not hardcoded values.

```tsx
// ✅ Good: Use design system
<div className="text-primary-500 text-h2">Title</div>

// ❌ Avoid: Hardcoded colors
<div style={{ color: "#274376", fontSize: "2rem" }}>Title</div>
```

### 2. Component Organization

Components are organized by feature, not by type:

```
features/
├── auth/          # Login, signup, password reset
├── dashboard/     # Dashboard and analytics
├── hris/          # HRIS module screens
└── splash/        # Splash screen
```

Each feature owns its screens, components, and sometimes APIs.

### 3. State Management with Zustand

Global state is managed in `src/stores/`:

```tsx
// Auth store with loading/error states
import { useAuthStore } from "@/stores/auth-store";

export function LoginForm() {
  const { isLoading, error, setSession, setIsLoading, setError } = useAuthStore();

  // Use loading and error states for UX
  return (
    <>
      {error && <Alert>{error}</Alert>}
      <button disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </>
  );
}
```

### 4. Custom Hooks for Logic Reuse

Use hooks in `src/hooks/` for reusable logic:

```tsx
import { useForm } from "@/hooks";

export function LoginForm() {
  const { values, errors, handleSubmit, handleChange } = useForm({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      // Handle login
    },
  });

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 5. Validation with Zod

All API inputs and outputs are validated:

```tsx
import { loginSchema } from "@/lib/validations/auth";

// Server-side or client-side
const validData = loginSchema.parse(formData);
```

### 6. API Layer Organization

API calls are in `src/lib/api/`:

```tsx
// src/lib/api/endpoints/auth.ts
export async function login(email: string, password: string) {
  const response = await apiClient.post("/auth/login", { email, password });
  return loginResponseSchema.parse(response.data);
}

// Usage in component
import { login } from "@/lib/api/endpoints/auth";
import { useAsync } from "@/hooks";

export function LoginForm() {
  const { execute, isLoading } = useAsync();

  const handleSubmit = async (values) => {
    await execute(login(values.email, values.password));
  };
}
```

## Constants, Not Magic Numbers

Use `src/lib/constants.ts` for hardcoded values:

```tsx
import { TIMINGS, ERROR_MESSAGES } from "@/lib/constants";

// ✅ Good
setTimeout(() => {}, TIMINGS.SPLASH_SCREEN_DURATION);

// ❌ Avoid
setTimeout(() => {}, 2500);
```

## Common Patterns

### Form Handling

```tsx
import { useForm } from "@/hooks";
import { loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const form = useForm({
    initialValues: { email: "", password: "" },
    onValidate: (values) => {
      const result = loginSchema.safeParse(values);
      return result.success ? {} : result.error.flatten().fieldErrors;
    },
    onSubmit: handleLogin,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <span className="text-error">{form.errors.email}</span>
      )}
      <button type="submit" disabled={form.isSubmitting}>
        Login
      </button>
    </form>
  );
}
```

### Loading and Error States

```tsx
import { useAuthStore } from "@/stores/auth-store";
import { useAsync } from "@/hooks";

export function LoginButton() {
  const { setIsLoading, setError } = useAuthStore();
  const { execute } = useAsync({
    onError: (error) => setError(error.message),
  });

  const handleClick = async () => {
    setIsLoading(true);
    await execute(login());
    setIsLoading(false);
  };

  return <button onClick={handleClick}>Login</button>;
}
```

## Performance Tips

1. **Use constants** instead of inline values
2. **Organize imports** — feature folder imports, then lib, then components
3. **Keep components small** — split large components into smaller ones
4. **Memoize** expensive computations
5. **Lazy load** routes and heavy components

## Testing

Mock data is in `src/lib/mocks/`. Use it for component development:

```tsx
import { mockDashboardStats } from "@/lib/mocks/dashboard";

export function DashboardComponent() {
  // During development, use mock data
  // const stats = mockDashboardStats;
  
  // In production, use real API
  const { data: stats } = useQuery("stats", fetchStats);
}
```

## Common Mistakes to Avoid

❌ **Don't:**
- Hardcode colors (use design tokens)
- Put all state in React (use Zustand for global state)
- Mix API logic in components (put in `lib/api/`)
- Forget validation (always use Zod)
- Create monolithic components (split into smaller ones)

✅ **Do:**
- Use design system tokens
- Organize state properly (local → Zustand → custom hooks)
- Keep components focused and small
- Validate all inputs and outputs
- Document complex logic

## Getting Help

1. Check the [Architecture Guide](./docs/ARCHITECTURE.md)
2. Look at existing examples in the codebase
3. Review Zod docs for validation
4. Check Zustand docs for state management
5. Read shadcn/ui documentation for UI components

## Contributing

- Follow the structure guidelines in this document
- Use the hooks and utilities provided in `src/hooks/` and `src/lib/`
- Keep components in appropriate feature folders
- Add validation with Zod
- Use design system tokens for styling

---

**Last Updated:** May 23, 2026
**Version:** 1.0
