# 360DegreesHR Codebase Analysis & Refactoring Guide

**Date:** May 2026  
**Status:** MVP Phase (HRIS Module 1 Active)  
**Framework:** Next.js 16.2.6 + React 19.2.4 + TypeScript 5 + Zustand 5 + Zod 4

---

## Executive Summary

The codebase demonstrates **solid foundational architecture** with clear conventions (routes, validations, API client). However, there are **critical clarity and maintainability issues** that will become severe as the application scales beyond Module 1:

- **Inline hardcoded colors and styles** scattered throughout UI components
- **No explicit component export strategy** (mixing default/named exports)
- **Vague naming patterns** for screens, layouts, and pages
- **Duplicate or redundant code patterns** in dashboard and auth flows
- **Type organization fragmentation** (auth types, validations, schemas scattered)
- **Store management feels incomplete** (missing error states, loading patterns)
- **API layer lacks documentation** on contract expectations
- **No clear hooks or utility extraction** for common patterns
- **Design system tokens not used consistently** in component implementations

---

## 1. FOLDER STRUCTURE & ORGANIZATION

### Current State
```
src/
├── app/                    # ✓ Clear route groups (auth, protected, marketing)
├── components/
│   ├── design-system/      # ✓ Tokens reference UI (colors, typography, icons)
│   ├── features/           # ⚠ Inconsistent depth: dashboard (1 file) vs auth (6 files)
│   ├── shared/             # ⚠ "auth" subfolder but no equivalent for dashboard
│   ├── providers/          # ✓ Clear role (hydration, theme, toast)
│   └── ui/                 # ✓ Shadcn primitives
├── config/                 # ✓ Well-organized (routes, nav, mvp, api-paths)
├── lib/
│   ├── api/
│   │   ├── client.ts       # ✓ Single source for fetch wrapper
│   │   ├── endpoints/      # ⚠ Minimal docs; only auth + dashboard
│   │   └── errors.ts       # ✓ Error handling strategy
│   ├── auth/               # ✓ Session/token management
│   ├── validations/        # ✓ Zod schemas centralized
│   ├── forms/              # ⚠ Only one utility; missing form logic
│   └── design-system/      # ✓ Color utilities
└── stores/                 # ⚠ Minimal state; missing error/loading states
```

### Issues Identified

#### 1.1 Inconsistent Feature Nesting
- **Dashboard:** `components/features/dashboard/hris-dashboard-screen.tsx` (single file, loose organization)
- **Auth:** `components/features/auth/screens/` (6 separate files, well-organized)
- **HRIS:** `components/features/hris/module-placeholder.tsx` + `hris-section-page.tsx` (two related files, unclear roles)

**Problem:** Future modules (Payroll, Recruitment) will lack a clear pattern.

#### 1.2 Shared Component Ambiguity
- `components/shared/auth/` exists with layout + field helpers
- **No equivalent for dashboard layout** — `DashboardShell` lives in `shared/` directly
- **No equivalent for form utilities** — only `zod-field-errors.ts` in lib, no `form-helpers.tsx`

**Problem:** New developers won't know where to place "shared" components for new modules.

#### 1.3 Missing Hooks Directory
- `src/hooks/` is **empty**
- No custom hooks extracted (e.g., `useAuth()`, `useNavigation()`, `usePagination()`)
- Logic is duplicated across components (e.g., `DashboardShell` and auth layouts both manage state)

---

## 2. CODE COMPLEXITY & PATTERNS

### 2.1 Inline Hardcoded Colors & Styles

**File:** [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx#L50-L150)

```tsx
// ❌ CURRENT (scattered hardcoded colors)
<div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
  <Icon className="size-[18px] text-[#3B82F6]" strokeWidth={1.75} />
</div>

<span className={cn(
  "mt-2 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium",
  badgeVariant === "blue"
    ? "bg-[#EFF6FF] text-[#2563EB]"
    : "bg-[#FEF2F2] text-[#DC2626]",
)}>
```

**Issues:**
- Color codes like `#EFF6FF`, `#3B82F6`, `#2563EB` appear **3-5 times each** in component
- No connection to `src/config/design-system/colors.ts` (which defines scales)
- **Maintenance nightmare:** If design changes, must find & replace 50+ instances
- **No semantic meaning:** `#EFF6FF` should be `primary-50` or `bg-primary-light`

**Also affected:**
- [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx) (icon colors, borders)
- [login-sso-screen.tsx](src/components/features/auth/screens/login-sso-screen.tsx) (hero colors, borders)
- All dashboard chart colors are hardcoded in arrays

### 2.2 Monolithic Dashboard Component

**File:** [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx) (~350+ lines)

```tsx
// ❌ CURRENT (everything in one file)
export function HrisDashboardScreen() {
  return (
    <div className="space-y-6">
      {/* 6 stat cards with inline StatCard component */}
      {/* 2 main charts (attendance, department pie) */}
      {/* Sidebar: retention line chart, coming up calendar, on leave, recent activity */}
      {/* Hard-coded mock data for ALL sections */}
    </div>
  )
}

// Sub-components defined in same file
function StatCard(...) { ... }
function StatusBadge(...) { ... }
```

**Issues:**
- **~350+ lines** in a single export; no modular sub-components
- **7 hardcoded data arrays** (attendance, department, retention, etc.)
- **Complex Recharts configurations** embedded inline (margins, ticks, axes)
- **No data/API integration** — purely mock data, no loading/error states
- **Difficult to test** — can't isolate stat card vs chart rendering
- **Impossible to reuse** — stat card defined locally, not exported

**Expected for MVP 1 but problematic for scaling.**

### 2.3 Inconsistent Component Export Patterns

**Default exports:**
- [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx): `export function HrisDashboardScreen()`
- [login-sso-screen.tsx](src/components/features/auth/screens/login-sso-screen.tsx): `export function LoginSsoScreen()`
- [module-placeholder.tsx](src/components/features/hris/module-placeholder.tsx): `export function ModulePlaceholder()`

**Named exports:**
- [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx): `export function DashboardShell()`
- [brand-logo.tsx](src/components/shared/brand-logo.tsx): appears to be named
- [auth-field.tsx](src/components/shared/auth/auth-field.tsx): `export function AuthField()` + `export function authInputClassName()`

**Issue:** Some apps use default exports for page-level components, others don't. **No documented convention.**

### 2.4 Mock Data Hard-Coded in Components

**Files affected:**
- [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx) — 7 arrays
- [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx) — icon map

```tsx
// ❌ CURRENT
const attendanceData = [
  { day: "Mon", value: 210 },
  { day: "Tue", value: 235 },
  // ... 5 more entries
];

const departmentData = [
  { name: "Engineering", value: 37, color: "#14B8A6" },
  // ...
];

const onLeave = [
  {
    name: "Tiger Nixon",
    type: "Parental Leave",
    // ...
  },
  // ...
];
```

**Problem:** 
- Mocks should live in `lib/mocks/` or be replaced by API calls
- **No loading state handling** — component assumes data is always present
- **No error state handling** — what happens if API fails?
- **When API lands, massive refactor needed** — mocks are baked into render logic

---

## 3. NAMING & LOGIC CLARITY

### 3.1 Vague or Overloaded Names

| File/Variable | Issue | Suggestion |
|---|---|---|
| `hris-section-page.tsx` | "Page" suggests a route page, but it's a component wrapper | `HrisSectionLayout.tsx` or `HrisSectionRouter.tsx` |
| `module-placeholder.tsx` | Describes what it is, not what it does | `HrisModuleNotImplemented.tsx` or `UnfinishedModuleCard.tsx` |
| `DashboardShell` | "Shell" is vague — app layout? sidebar wrapper? | `AppLayout.tsx` or `ProtectedLayout.tsx` |
| `AuthSplitLayout` | "Split" doesn't describe the purpose (side-by-side hero + form) | `SideBySideAuthLayout.tsx` or `HeroAuthLayout.tsx` |
| `authInputClassName()` | Mixes concerns: input styling + auth context | `createAuthInputClass()` or `authInputStyles()` |
| `apiPaths` | Could be endpoints, routes, or URL patterns | `API_ENDPOINTS` or `BACKEND_PATHS` |
| `hrisPages` | Config structure? type defs? Route params? | `HRIS_MODULES` or `HRIS_SECTIONS` |
| `zod-field-errors` | Unclear: validates fields? converts errors? | `zodFieldErrorExtractor.ts` or `zod-validation-errors.ts` |
| `parse.ts` in validations | Parse what? Responses? Requests? | `parseApiResponse.ts` (already used inside) |

### 3.2 Unclear Logic Flow

#### In `auth-hydration.tsx`
```tsx
// ❌ CURRENT (duplicated logic, unclear intent)
useEffect(() => {
  if (!isHydrated) return;

  const token = getAccessToken();
  if (isAuthenticated) {
    authApi.me().then(setUser).catch(() => clearSession());
    return;  // ← Early return confuses flow
  }

  if (token) {
    authApi
      .me()
      .then((user) => setSession({ token, user }))
      .catch(() => clearSession());
  }
}, [isHydrated, isAuthenticated, setSession, setUser, clearSession]);
```

**Issues:**
- Multiple branches with similar logic (`authApi.me()` + error handling repeated)
- **Why call `.me()` if already authenticated?** Comment needed
- **Why two different success handlers** (`setUser` vs `setSession`)?
- **Missing edge case:** What if `getAccessToken()` returns a token but `isAuthenticated` is false?

#### In `HrisSectionPage`
```tsx
// ❌ CURRENT (unclear pattern)
export function HrisSectionPage({ section }: HrisSectionPageProps) {
  if (!isHrisPageSection(section)) {
    notFound();
  }

  const page = hrisPages[section as HrisPageSection];

  return <ModulePlaceholder {...page} />;
}

export function getHrisStaticParams() {
  return Object.keys(hrisPages).map((section) => ({ section }));
}
```

**Issues:**
- `getHrisStaticParams()` is a Next.js pattern but **not called anywhere visible**
- Function should be named `generateHrisStaticParams()` to match Next.js conventions
- Two related but separate exports; unclear they belong together
- **Why not export `HrisSectionPageWrapper` + a separate `generateStaticParams()` that Next calls directly?**

### 3.3 Unclear Type Organization

**Types scattered across 4 locations:**

1. **Response schemas** in `lib/validations/auth.ts`:
   ```tsx
   export const authUserSchema = z.object({ ... });
   export type AuthUser = z.infer<typeof authUserSchema>;
   ```

2. **State type** in `stores/auth-store.ts`:
   ```tsx
   type AuthState = {
     user: AuthUser | null;
     isAuthenticated: boolean;
     // ...
   };
   ```

3. **Config type** in `config/mvp.ts`:
   ```tsx
   export type UserRole = (typeof userRoles)[number];
   ```

4. **General types** in `types/index.ts`:
   ```tsx
   export type Nullable<T> = T | null;
   export type AsyncStatus = "idle" | "loading" | "success" | "error";
   ```

**Problem:** New developers don't know where to find/add types. No single source of truth.

---

## 4. DUPLICATE & REDUNDANT CODE

### 4.1 Color/Style Badge Logic

**In `hris-dashboard-screen.tsx`:**
```tsx
function StatCard({ badgeVariant }: { ..., badgeVariant: "blue" | "red"; ... }) {
  return (
    <span className={cn(
      "mt-2 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium",
      badgeVariant === "blue"
        ? "bg-[#EFF6FF] text-[#2563EB]"
        : "bg-[#FEF2F2] text-[#DC2626]",
    )}>
      {badge}
    </span>
  );
}

function StatusBadge({ status }: { status: "Approved" | "Pending" }) {
  return (
    <span className={cn(
      "inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium",
      status === "Approved"
        ? "bg-[#EFF6FF] text-[#2563EB]"
        : "bg-[#F3F4F6] text-[#4B5563]",
    )}>
      {status}
    </span>
  );
}
```

**Duplication:** Identical badge base styles, variant logic, same color palette.

**Also in `login-sso-screen.tsx`:** Similar badge patterns for status indicators.

**Also in `dashboard-shell.tsx`:** Icon colors repeated for different icon contexts.

### 4.2 Modal/Dropdown State Management

**In `dashboard-shell.tsx`:**
```tsx
const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ HRIS: true });
const [profileOpen, setProfileOpen] = useState(false);
const profileRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClick(e: MouseEvent) {
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
      setProfileOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);
```

**Also in `ui-store.ts`:**
```tsx
export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open: boolean) => set({ mobileNavOpen }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}));
```

**Issue:** Two competing patterns for UI state (local `useState` vs Zustand store). **Should be consistent.**

### 4.3 Error Handling Pattern

**In `auth-hydration.tsx`:**
```tsx
authApi.me().catch(() => clearSession());
```

**In `api/client.ts`:**
```tsx
catch (error) {
  if (error instanceof ApiError) throw error;
  // ...
  throw new ApiError({ ... });
}
```

**Issue:** Catch-all handlers that swallow errors; no logging strategy.

### 4.4 Theme Provider Pattern

**In `layout.tsx`:**
```tsx
<ThemeProvider>
  <AuthHydration>{children}</AuthHydration>
  <ToastProvider />
</ThemeProvider>
```

**Pattern:** All providers at root level. **What happens when Module 2 adds a new provider?** No clear convention.

---

## 5. COMPONENT HIERARCHIES

### 5.1 Deep Nesting Issues

```
app/(protected)/layout.tsx
  ├─ DashboardShell (shared/dashboard-shell.tsx)
  │   ├─ AnimatedSplashScreen (features/splash/)
  │   ├─ Sidebar with navigation
  │   ├─ Header with search, notifications, profile menu
  │   └─ children
  │       ├─ app/dashboard/page.tsx
  │       │   └─ HrisDashboardScreen (features/dashboard/)
  │       │       ├─ StatCard (inline)
  │       │       ├─ StatusBadge (inline)
  │       │       └─ Recharts (BarChart, AreaChart, PieChart)
  │       │
  │       └─ app/hris/[section]/page.tsx
  │           └─ HrisSectionPage (features/hris/)
  │               └─ ModulePlaceholder (features/hris/)
  │
  app/(auth)/layout.tsx
  ├─ children
  │   ├─ /login/page.tsx
  │   │   └─ LoginSsoScreen (features/auth/screens/)
  │   │       ├─ AuthSplitLayout (shared/auth/)
  │   │       ├─ AuthField (shared/auth/)
  │   │       └─ BrandLogo (shared/)
```

**Issues:**
- **auth routes have no layout wrapper** — each screen duplicates hero/form split
- **dashboard routes have DashboardShell at layout level** — can't easily test without shell
- **No intermediate component layers** between page and screen for composition

### 5.2 Screen Component Ambiguity

**Pattern:** `<Feature>Screen` (e.g., `LoginSsoScreen`, `HrisDashboardScreen`)

**Problems:**
- Doesn't indicate if it's a page-level component or a re-usable card
- `LoginSsoScreen` is page-level; `HrisDashboardScreen` is page-level; but no distinction in naming
- New modules will copy this pattern inconsistently

**Better naming:**
- Page-level: `LoginSsoPage.tsx` or `<Feature>PageScreen.tsx`
- Card/widget: `<Feature>Card.tsx` or `<Feature>Widget.tsx`
- Layout: `<Feature>Layout.tsx`

---

## 6. API LAYER CLARITY

### 6.1 Minimal Endpoint Coverage

**File:** [lib/api/endpoints/](src/lib/api/endpoints/)

Current endpoints:
- `auth.ts` — 5 auth endpoints (register, login, me, forgotPassword, resetPassword)
- `dashboard.ts` — 1 dashboard endpoint (getOverview)

**Problem:** 
- Only 6 endpoints defined; MVP expects 12-15 HRIS screens
- **No HRIS endpoints** (employees, departments, documents, disciplinary)
- When backend contract lands, massive additions needed with no pattern guidance

### 6.2 Hardcoded API Paths

**File:** [config/api-paths.ts](src/config/api-paths.ts)

```tsx
export const apiPaths = {
  auth: {
    registerCompany: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    // ...
  },
  dashboard: {
    overview: "/dashboard",
  },
} as const;
```

**Issue:**
- Paths are strings without TypeScript validation
- **No base URL logic** — how to handle versioning (e.g., `/v2/auth/login`)?
- **No path building utilities** — inline `/hris/employees/${id}` in routes.ts, no helper
- **Inconsistent path format** — some are flat (`/dashboard`), others nested (`/auth/login`)

### 6.3 Client Validation is Strict but Lacks Context

**File:** [lib/api/client.ts](src/lib/api/client.ts)

```tsx
// ✓ GOOD: Response validation with Zod
return parseApiResponse(response, schema);

// ✗ ISSUE: No documentation on schema expectations
// What if backend returns { data: {...}, meta: {...} }?
// How are errors structured?
```

**Missing documentation:**
- Expected response envelope format
- How pagination works
- How errors are structured
- If API changes, where to update schemas?

### 6.4 Inconsistent Error Messages

**File:** [lib/api/errors.ts](src/lib/api/errors.ts)

```tsx
function defaultMessageForStatus(status: number): string {
  if (status === 401) return "Please sign in to continue.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "The requested resource was not found.";
  if (status >= 500) return "Our servers are unavailable. Please try again later.";
  return "Something went wrong. Please try again.";
}
```

**Issue:**
- Generic messages; no domain context (is this a login error? A data fetch error?)
- **No field-level errors** — only status-level messages
- **No retry logic** — 500 errors don't suggest "try again in a few seconds"

---

## 7. TYPE DEFINITION ORGANIZATION

### 7.1 Scattered Type Sources

**Auth types live in 4 places:**

1. `lib/validations/auth.ts` — schemas + inferred types
   ```tsx
   export const authUserSchema = z.object({ ... });
   export type AuthUser = z.infer<typeof authUserSchema>;
   ```

2. `stores/auth-store.ts` — state type
   ```tsx
   type AuthState = {
     user: AuthUser | null;
     isAuthenticated: boolean;
     // ...
   };
   ```

3. `config/mvp.ts` — user role type
   ```tsx
   export type UserRole = (typeof userRoles)[number];
   ```

4. `types/index.ts` — generic types
   ```tsx
   export type Nullable<T> = T | null;
   export type AsyncStatus = "idle" | "loading" | "success" | "error";
   ```

**Problem:** Finding the right place to add new types is unclear. **No central type index.**

### 7.2 Input vs Output Schema Inconsistency

**In [lib/validations/auth.ts](src/lib/validations/auth.ts):**

```tsx
// Response schemas (what backend sends)
export const authSessionSchema = z.object({
  token: z.string(),
  user: authUserSchema,
  company: z.object({ id: z.string(), name: z.string() }).optional(),
});
export type AuthSession = z.infer<typeof authSessionSchema>;

// Input schemas (what frontend sends)
export const registerCompanySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  // ...
});
export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;
```

**Issue:**
- Schemas and types mixed in one file
- No clear separation: input schemas → validation, output schemas → parsing
- **Dashboard validation** is separate (`lib/validations/dashboard.ts`), but uses same pattern differently

### 7.3 Missing Type-Safe Route Parameters

**In [config/hris-pages.ts](src/config/hris-pages.ts):**

```tsx
export function isHrisPageSection(value: string): value is HrisPageSection {
  return value in hrisPages;
}
```

**Works but tedious.** Better approach:

```tsx
// Type-safe route building
type HrisSection = keyof typeof hrisPages;

// Auto-validate param
function getHrisPage(section: HrisSection) {
  return hrisPages[section];
}
```

---

## 8. STORE/STATE MANAGEMENT CLARITY

### 8.1 Missing Error & Loading States

**File:** [stores/auth-store.ts](src/stores/auth-store.ts)

```tsx
type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  showSplash: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
  setShowSplash: (value: boolean) => void;
};
```

**Missing:**
- `isLoading: boolean` — needed during `authApi.me()` calls
- `error: Error | null` — needed to show error UI during auth failures
- `error: string | null` — what failed and why?
- `loginError`, `registerError`, etc. — field-level errors from API

**Impact:** Components can't show loading spinners or error messages during auth operations.

### 8.2 Inconsistent Toast Implementation

**File:** [stores/toast-store.ts](src/stores/toast-store.ts)

```tsx
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "error", duration),
  // ...
};
```

**Issue:**
- Toast store exists but **not integrated** into API error handling
- When API fails, error message shows in console, not as toast
- `toUserMessage(error)` is called but toast never triggered
- **Where should toast live?** Store? Error handler? Component level?

### 8.3 UI Store is Minimal & Incomplete

**File:** [stores/ui-store.ts](src/stores/ui-store.ts)

```tsx
type UiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
};
```

**Missing UI states:**
- `profileMenuOpen: boolean` — currently in DashboardShell local state
- `searchOpen: boolean` — currently in DashboardShell local state
- `sidebarCollapsed: boolean` — no collapse support yet
- `theme: "light" | "dark"` — exists in ThemeProvider but not centralized

**Problem:** Some UI state in store, some local. **No convention.**

### 8.4 No Data/Cache Store

**Issue:** No Zustand store for dashboard data, HRIS data, etc.

**Current approach:**
- Mock data hardcoded in components
- No API integration
- When API lands, need to add new store(s)
- **Pattern unclear:** One store per module? One global data store?

---

## SUMMARY TABLE: Issues & Recommendations

| Category | Issue | Severity | Recommendation | Est. Time |
|----------|-------|----------|-----------------|-----------|
| **Colors** | Hardcoded hex values scattered throughout | 🔴 High | Extract to `colors.ts` utility; use design tokens in components | 4h |
| **Dashboard** | 350+ line monolithic component | 🔴 High | Split into: DashStats, AttendanceChart, LeavePanel, ActivityFeed | 6h |
| **Hooks** | No custom hooks; logic duplicated | 🔴 High | Create `useAuth()`, `useNavigation()`, `usePagination()` | 4h |
| **Component Exports** | Inconsistent default/named exports | 🟡 Medium | Document & enforce one pattern (recommend named exports) | 1h |
| **Type Organization** | Types scattered across 4 locations | 🟡 Medium | Centralize in `types/` or co-locate with schemas | 3h |
| **API Endpoints** | Only 6 endpoints defined; HRIS missing | 🟡 Medium | Create endpoint file for each module; add helper for building paths | 2h |
| **Auth Hydration** | Complex effect logic, duplicated branching | 🟡 Medium | Extract to utility function; add comments explaining flow | 2h |
| **Mock Data** | Hardcoded in components; no loading states | 🟡 Medium | Move to `lib/mocks/`; add `AsyncStatus` to stores | 3h |
| **Store Error States** | No loading/error tracking in auth/ui stores | 🟡 Medium | Add `isLoading`, `error`, `status` to all stores | 2h |
| **Toast Integration** | Exists but not connected to API error handling | 🟡 Medium | Wire into API client error handler; document pattern | 1h |
| **Naming Clarity** | Vague names (hris-section-page, module-placeholder) | 🟡 Medium | Rename for clarity; document component type convention | 2h |
| **Component Hierarchy** | Screen components mixed with layouts | 🟡 Medium | Clarify page vs screen vs layout vs card components | 2h |
| **API Documentation** | No docs on response envelope, pagination, errors | 🟡 Medium | Add comments to `client.ts`, `errors.ts`, `endpoints/` | 2h |
| **UI State Consistency** | Some state in store, some local | 🟡 Medium | Decide: all UI state in store? or local where possible? | 1h |

---

## REFACTORING ROADMAP (Priority Order)

### Phase 1: High-Impact, Low-Risk (2-3 days)
1. **Extract design system utilities** → color-to-class mapping
2. **Create custom hooks** → `useAuth()`, `useNavigation()`, etc.
3. **Centralize type definitions** → new `types/auth.ts`, `types/dashboard.ts`, etc.
4. **Add error/loading states to stores**
5. **Document component export patterns**

### Phase 2: Medium-Impact, Medium-Risk (3-5 days)
6. **Split dashboard component** into smaller pieces
7. **Move mock data to `lib/mocks/`**
8. **Build HRIS endpoint structure** (ready for backend)
9. **Create feature-specific stores** (dashboard data, HRIS data)
10. **Connect toast to API error handling**

### Phase 3: Foundation for Scaling (5-7 days)
11. **Standardize auth flow logic** (extract hydration complexity)
12. **Build module scaffolding template** (so Module 2+ are consistent)
13. **Document API contract expectations**
14. **Add form helper utilities** (shared validation, error display)
15. **Create component example gallery** (design system showcase)

---

## FILES REQUIRING IMMEDIATE ATTENTION

### Critical (High complexity, MVP blocker)
- `src/components/features/dashboard/hris-dashboard-screen.tsx` — Split into sub-components, extract mocks, add loading states
- `src/stores/auth-store.ts` — Add error/loading states
- `src/components/shared/dashboard-shell.tsx` — Extract modal/dropdown state management to hook

### Important (Will scale poorly)
- `src/lib/api/client.ts` — Add documentation on response envelope & pagination
- `src/lib/validations/auth.ts` — Separate input/output schemas more clearly
- `src/config/api-paths.ts` — Add helper for building paths with parameters
- `src/components/features/auth/screens/*.tsx` — Reduce duplication in color/badge logic

### Nice-to-Have (Maintenance & clarity)
- `src/types/index.ts` → Expand and clarify type organization
- `src/hooks/` → Populate with custom hooks
- `src/lib/mocks/` → Create directory for mock data
- Document component naming conventions

---

## SPECIFIC CODE IMPROVEMENTS

### 1. Extract Color Utilities
**Create:** `src/lib/design-system/color-classes.ts`

```tsx
const colorVariants = {
  primary: {
    50: "bg-blue-50 text-blue-900",
    100: "bg-blue-100 text-blue-900",
    // ...
  },
  badge: {
    blue: "bg-[#EFF6FF] text-[#2563EB]",
    red: "bg-[#FEF2F2] text-[#DC2626]",
    green: "bg-[#EFF6FF] text-[#0CAF60]",
  },
};

export function getBadgeClass(variant: "blue" | "red" | "green") {
  return colorVariants.badge[variant];
}
```

### 2. Extract Icon Color Mapping
**Create:** `src/config/design-system/icon-colors.ts`

```tsx
export const iconColorMap = {
  dashboard: { bg: "bg-blue-50", icon: "text-blue-500" },
  hris: { bg: "bg-teal-50", icon: "text-teal-500" },
  calendar: { bg: "bg-yellow-50", icon: "text-yellow-500" },
} as const;
```

### 3. Create Custom Hook: `useAuth()`
**Create:** `src/hooks/useAuth.ts`

```tsx
export function useAuth() {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isHydrated: store.isHydrated,
    login: async (email, password) => { /* ... */ },
    logout: () => store.clearSession(),
  };
}
```

### 4. Add Error/Loading States to Auth Store

```tsx
type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  showSplash: boolean;
  // ✨ NEW:
  isLoading: boolean;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";
  // ... existing methods
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};
```

### 5. Move Dashboard Mock Data
**Create:** `src/lib/mocks/dashboard.ts`

```tsx
export const dashboardMocks = {
  attendanceData: [
    { day: "Mon", value: 210 },
    // ...
  ],
  departmentData: [
    { name: "Engineering", value: 37, color: "#14B8A6" },
    // ...
  ],
} as const;

export function useDashboardData() {
  // Load from mock or API
  const [data, setData] = useState(dashboardMocks);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  // ...
}
```

---

## CONCLUSION

Your codebase has **solid fundamentals** (clear routes, good validation patterns, error handling). However, **clarity and reusability issues** will become blocking as the app scales beyond Module 1.

**Top 5 Quick Wins:**
1. Extract hardcoded colors to utility functions
2. Create `useAuth()` and `useNavigation()` hooks
3. Add error/loading states to stores
4. Split dashboard component into smaller pieces
5. Document component naming & export patterns

**Start with Phase 1** (2-3 days) to establish patterns, then scale confidently to Module 2+.
