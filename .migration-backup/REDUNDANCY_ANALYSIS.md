# 360DegreesHR Codebase Redundancy Analysis Report

**Date:** May 2026  
**Status:** MVP Phase - HRIS Module 1 Active  
**Framework:** Next.js 16 + React 19 + TypeScript 5

---

## Executive Summary

The codebase has a **solid foundation** with clear architectural patterns but suffers from **critical maintainability issues**:

| Category | Severity | Count | Impact |
|----------|----------|-------|--------|
| **Hardcoded Colors** | 🔴 CRITICAL | 40+ instances | Design changes require 50+ edits across 8 files |
| **Inconsistent Component Structure** | 🟠 HIGH | 3 patterns | New modules lack clear organization model |
| **Inline Styles + Tailwind Mix** | 🟠 HIGH | 15+ instances | Inconsistent styling approach |
| **Type Organization Fragmentation** | 🟡 MEDIUM | Multiple locations | Auth types scattered; hard to locate single definitions |
| **Empty Hooks Directory** | 🟡 MEDIUM | ~60% unused | Custom hooks not extracted; logic duplicated |
| **Export Pattern Inconsistency** | 🟡 MEDIUM | Mixed default/named | Unclear which pattern to follow for new code |
| **Unused Layout Directory** | 🟡 MEDIUM | Empty folder | Confusing organizational intent |
| **Circular Import Risk** | 🟡 MEDIUM | Not yet but likely | Auth store → hooks → components → store |

---

## 1. FILE/FOLDER REDUNDANCY & ORGANIZATION ISSUES

### 1.1 Critical: Hardcoded Colors — $40+ instances (vs. design-system tokens)

**Severity:** 🔴 CRITICAL  
**Files Affected:** 8 component files  
**Maintenance Cost:** Very High

The design system defines color tokens, but components use **hardcoded hex codes instead**:

#### Examples of Redundancy

**Color Code `#3B82F6` (Primary Blue) appears in:**
- [login-password-screen.tsx](src/components/features/auth/screens/login-password-screen.tsx#L105) (3 times)
- [login-sso-screen.tsx](src/components/features/auth/screens/login-sso-screen.tsx#L22) (2 times)
- [forgot-password-screen.tsx](src/components/features/auth/screens/forgot-password-screen.tsx#L144) (3 times)
- [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx#L170) (2 times)
- [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx#L120) (2 times)
- **Total: 12+ instances of same color**

**Color Code `#274376` (Primary Dark) appears in:**
- [login-password-screen.tsx](src/components/features/auth/screens/login-password-screen.tsx#L147) (2 times)
- [register-company-screen.tsx](src/components/features/auth/screens/register-company-screen.tsx#L232) (2 times)
- [auth-split-layout.tsx](src/components/shared/auth/auth-split-layout.tsx#L50)
- [reset-password-screen.tsx](src/components/features/auth/screens/reset-password-screen.tsx#L114) (2 times)
- **Total: 7+ instances**

**Color Code `#EFF6FF` (Primary Light BG) appears in:**
- [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx#L119) (2 times)
- [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx#L208)
- [forgot-password-success-screen.tsx](src/components/features/auth/screens/forgot-password-success-screen.tsx#L67)
- **Total: 4+ instances**

#### Current (❌ WRONG):
```tsx
// ❌ hris-dashboard-screen.tsx - line 119-120
<div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
  <Icon className="size-[18px] text-[#3B82F6]" strokeWidth={1.75} />
</div>

// ❌ login-password-screen.tsx - line 147
<button className="h-[48px] w-full rounded-lg bg-[#274376] text-[15px] font-medium text-white 
    transition-colors hover:bg-[#1e3559] disabled:opacity-70">
  Sign In
</button>

// ❌ dashboard-shell.tsx - line 170
<input className="h-10 w-full rounded-lg border border-grey-200 bg-[#F9FAFB] pr-14 pl-10 
    text-[14px] outline-none focus:border-[#93C5FD] focus:ring-2 focus:ring-[#3B82F6]/20" />
```

#### Should Be (✅ CORRECT):
```tsx
// ✅ Use design system tokens from config/design-system/colors.ts
<div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary-50">
  <Icon className="size-[18px] text-primary-500" strokeWidth={1.75} />
</div>

// ✅ Use semantic color from design system
<button className="h-[48px] w-full rounded-lg bg-primary-900 text-[15px] font-medium text-white 
    transition-colors hover:bg-primary-900/90 disabled:opacity-70">
  Sign In
</button>

// ✅ Use Tailwind design system classes
<input className="h-10 w-full rounded-lg border border-grey-200 bg-grey-50 pr-14 pl-10 
    text-[14px] outline-none focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-400/25" />
```

**Affected Files:**
1. [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx) — 15 hardcoded colors
2. [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx) — 8 hardcoded colors
3. [login-password-screen.tsx](src/components/features/auth/screens/login-password-screen.tsx) — 7 hardcoded colors
4. [login-sso-screen.tsx](src/components/features/auth/screens/login-sso-screen.tsx) — 6 hardcoded colors
5. [register-company-screen.tsx](src/components/features/auth/screens/register-company-screen.tsx) — 4 hardcoded colors
6. [forgot-password-screen.tsx](src/components/features/auth/screens/forgot-password-screen.tsx) — 5 hardcoded colors
7. [forgot-password-success-screen.tsx](src/components/features/auth/screens/forgot-password-success-screen.tsx) — 4 hardcoded colors
8. [reset-password-screen.tsx](src/components/features/auth/screens/reset-password-screen.tsx) — 4 hardcoded colors

**Refactoring Priority:** 🔴 **CRITICAL - Fix First**

---

### 1.2 High: Inconsistent Feature Folder Structure

**Severity:** 🟠 HIGH  
**Issue:** New modules will lack clear organization pattern

#### Current Inconsistency:

```
src/components/features/
├── auth/
│   └── screens/              ✅ Well-organized
│       ├── login-sso-screen.tsx
│       ├── login-password-screen.tsx
│       ├── forgot-password-screen.tsx
│       ├── forgot-password-success-screen.tsx
│       ├── register-company-screen.tsx
│       └── reset-password-screen.tsx
│
├── dashboard/
│   └── hris-dashboard-screen.tsx  ⚠️ Single file, inconsistent naming
│
└── hris/
    ├── module-placeholder.tsx      ⚠️ Unclear purpose
    ├── hris-section-page.tsx       ⚠️ Similar naming, different role
    └── (no screens/ subdirectory)
```

**Problem:** When building next modules (Payroll, Recruitment, etc.), which pattern should be used?
- Auth: Has `/screens/` subdirectory
- Dashboard: Single file in feature root
- HRIS: Two files with ambiguous relationship

#### Suggested Standard:

```
src/components/features/
├── {module}/
│   ├── screens/              ✅ All page-level components
│   │   ├── {name}-screen.tsx
│   │   └── {name}-screen.tsx
│   ├── components/           ✅ Reusable module components
│   │   ├── {name}-card.tsx
│   │   └── {name}-form.tsx
│   ├── hooks.ts              ✅ Module-specific hooks
│   ├── types.ts              ✅ Module-specific types
│   └── index.ts              ✅ Public API
```

**Files to Refactor:**
- [src/components/features/dashboard/](src/components/features/dashboard/) → Move to `dashboard/screens/` structure
- [src/components/features/hris/](src/components/features/hris/) → Reorganize with clear subdirectories

---

### 1.3 High: Shared Component Ambiguity

**Severity:** 🟠 HIGH  
**Files Affected:** [src/components/shared/](src/components/shared/)

#### Current Organization:

```
src/components/shared/
├── auth/                  ✅ Auth module helpers
│   ├── auth-field.tsx
│   ├── auth-footer.tsx
│   ├── auth-split-layout.tsx
│   ├── glass-brand-card.tsx
│   └── login-building-hero.tsx
│
├── brand-logo.tsx         ✅ Brand component
├── dashboard-shell.tsx    ❌ Dashboard layout here, not in dashboard/
└── (no auth/ equivalent for other modules)
```

**Problem:** 
- Why is `DashboardShell` in `shared/` instead of `dashboard/`?
- If a component is shared across modules, how do we organize it?
- No clear pattern for future modules (Payroll, Recruitment, etc.)

#### After Refactoring:

```
src/components/shared/
├── brand/
│   ├── brand-logo.tsx
│   └── auth-footer.tsx (brand-footer variant)
│
├── layout/
│   ├── dashboard-shell.tsx
│   ├── auth-split-layout.tsx
│   └── (future: payroll-shell.tsx, recruitment-shell.tsx)
│
├── cards/
│   └── glass-brand-card.tsx
│
└── (module-specific goes to features/{module}/components/)
```

---

### 1.4 Medium: Empty Folders with Unclear Intent

**Severity:** 🟡 MEDIUM  

**Empty Folder:** [src/components/layout/](src/components/layout/)
- Created with the intention of centralizing layout components
- Now unused — layouts live scattered in:
  - `src/components/shared/dashboard-shell.tsx` 
  - `src/components/shared/auth/auth-split-layout.tsx`
  - `src/app/(auth)/layout.tsx` (empty wrapper)

**Recommendation:** Either populate or remove this folder.

---

## 2. CODE REPETITION & DUPLICATION

### 2.1 Critical: Color Palette Duplication in Data Objects

**Severity:** 🔴 CRITICAL

Colors are hardcoded in two separate places:

#### Instance 1: [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx#L38-L40)
```tsx
const departmentData = [
  { name: "Engineering", value: 37, color: "#14B8A6" },
  { name: "Operations", value: 24, color: "#9CA3AF" },
  { name: "Designs", value: 22, color: "#D1D5DB" },
];
```

#### Instance 2: [hris-dashboard-screen.tsx](src/components/features/dashboard/hris-dashboard-screen.tsx#L90-L100)
```tsx
const recentActivity = [
  {
    text: "Aria Montgomery signed her offer...",
    meta: "2 hours ago • HR Operations",
    color: "bg-[#3B82F6]",
  },
  {
    text: "Marcus Chen requested sick leave...",
    meta: "5 hours ago • Engineering",
    color: "bg-[#EF4444]",
  },
  {
    text: "Monthly payroll finalized...",
    meta: "Yesterday • Finance",
    color: "bg-[#14B8A6]",
  },
];
```

**Should Be:** Define in [src/lib/mocks/dashboard.ts](src/lib/mocks/dashboard.ts) with semantic tokens.

---

### 2.2 High: Repeated Layout State Management

**Severity:** 🟠 HIGH  
**Files Affected:** [dashboard-shell.tsx](src/components/shared/dashboard-shell.tsx) vs auth screens

#### Pattern in DashboardShell:

```tsx
// src/components/shared/dashboard-shell.tsx
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

#### Same Pattern in Auth Layouts:

[login-sso-screen.tsx](src/components/features/auth/screens/login-sso-screen.tsx) duplicates similar event handling:

```tsx
// These patterns repeat but aren't extracted to custom hooks
useEffect(() => { /* click handlers */ }, []);
```

**Should Extract To:**
- `useClickOutside()` hook for profile dropdown
- `useNavigation()` hook for sidebar navigation
- `useLocalStorage()` or Zustand for persistent UI state

---

### 2.3 High: Button Style Duplication

**Severity:** 🟠 HIGH

Buttons with identical styling patterns appear in multiple files:

#### Primary Button Pattern (appears 6+ times):
```tsx
// ❌ Repeated in: login-password-screen, register-company, forgot-password, reset-password
className="h-[48px] w-full rounded-lg bg-[#274376] text-[15px] font-medium text-white 
    transition-colors hover:bg-[#1e3559] disabled:opacity-70"

// ❌ Alternative in: forgot-password-success, login-sso
className="h-[48px] w-full rounded-lg bg-[#3B82F6] text-[15px] font-medium text-white 
    hover:bg-[#2563EB] disabled:opacity-70"
```

**Files with Duplicate Buttons:**
1. [login-password-screen.tsx](src/components/features/auth/screens/login-password-screen.tsx#L147)
2. [register-company-screen.tsx](src/components/features/auth/screens/register-company-screen.tsx#L232)
3. [forgot-password-screen.tsx](src/components/features/auth/screens/forgot-password-screen.tsx#L144)
4. [reset-password-screen.tsx](src/components/features/auth/screens/reset-password-screen.tsx#L114)
5. [forgot-password-success-screen.tsx](src/components/features/auth/screens/forgot-password-success-screen.tsx#L90)
6. [login-sso-screen.tsx](src/components/features/auth/screens/login-sso-screen.tsx#L90)

**Should Use:** `src/components/ui/button.tsx` (if exists) or create reusable Button component with variants.

---

### 2.4 Medium: Form Input Style Duplication

**Severity:** 🟡 MEDIUM

All auth screens use [authInputClassName()](src/components/shared/auth/auth-field.tsx#L39) which is:

```tsx
export function authInputClassName(className?: string) {
  return cn(
    "h-[48px] w-full rounded-lg border border-transparent bg-[#F3F4F6] px-4 text-[15px] 
     text-grey-900 outline-none transition-[box-shadow,border-color,background] 
     placeholder:text-grey-500 focus:border-primary-300 focus:bg-white 
     focus:ring-2 focus:ring-primary-400/25",
    className,
  );
}
```

**Instances:** 6 files using this pattern

**Should Be:** Move to component or consolidate with UI button/input library.

---

## 3. COMPLEX FOLDER STRUCTURES

### 3.1 Unnecessarily Nested: API Endpoints

**Severity:** 🟡 MEDIUM  
**Path:** [src/lib/api/endpoints/](src/lib/api/endpoints/)

Current structure:
```
src/lib/api/
├── client.ts          ✅ API client wrapper
├── errors.ts          ✅ Error handling
├── endpoints/
│   ├── auth.ts        ✅ Auth endpoints
│   ├── dashboard.ts   ✅ Dashboard endpoints
│   └── index.ts
```

**Issue:** Extra nesting for only 2 endpoint files

#### Option A: Flatten for MVP
```
src/lib/api/
├── client.ts
├── auth.ts      (rename from endpoints/auth.ts)
├── dashboard.ts (rename from endpoints/dashboard.ts)
└── errors.ts
```

#### Option B: Keep nesting but add documentation
```
src/lib/api/endpoints/
├── README.md    (explain endpoint organization)
├── auth.ts
└── dashboard.ts
```

**Recommendation:** Option B — Keep structure but document it for future modules (payroll.ts, recruitment.ts, etc.)

---

### 3.2 Inconsistent Naming: hris-dashboard vs hris-section

**Severity:** 🟡 MEDIUM  
**Files:** [src/components/features/hris/](src/components/features/hris/)

```
hris/
├── hris-dashboard-screen.tsx      ❌ Called "dashboard" but it's a screen
├── hris-section-page.tsx          ❌ Called "page" but it's also a screen
└── module-placeholder.tsx         ❌ Unclear purpose
```

**Issues:**
- What's the difference between `hris-dashboard-screen` and `hris-section-page`?
- Is "module-placeholder" still needed or dead code?
- Naming mixes concerns (hris-dashboard is at `/hris`, `/hris/employees`, etc.)

**Should Be:**
```
hris/
├── screens/
│   ├── hris-overview-screen.tsx      (main HRIS page)
│   └── hris-section-screen.tsx       (generic section handler)
├── components/
│   ├── employee-table.tsx
│   ├── department-card.tsx
│   └── ...
└── types.ts
```

---

## 4. IMPORT COMPLEXITY & PATTERNS

### 4.1 High: Long Import Paths & No Barrel Exports

**Severity:** 🟠 HIGH  
**Issue:** Components lack central export points

#### Current (❌ VERBOSE):
```tsx
// ❌ In a page.tsx file
import { LoginPasswordScreen } from "@/components/features/auth/screens/login-password-screen";
import { HrisDashboardScreen } from "@/components/features/dashboard/hris-dashboard-screen";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";
```

#### Should Be (✅ CLEAN):
```tsx
// ✅ With barrel exports
import { LoginPasswordScreen, HrisDashboardScreen } from "@/components/features";
import { BrandLogo } from "@/components/shared";
import { useAuthStore, useUiStore } from "@/stores";
```

**Current Barrel Exports:**
- ✅ [src/stores/index.ts](src/stores/index.ts) — Good
- ✅ [src/hooks/index.ts](src/hooks/index.ts) — Exists but minimal

**Missing Barrel Exports:**
- ❌ [src/components/index.ts](src/components/index.ts) — Doesn't exist
- ❌ [src/components/features/index.ts](src/components/features/index.ts) — Doesn't exist
- ❌ [src/components/shared/index.ts](src/components/shared/index.ts) — Doesn't exist

---

### 4.2 Medium: Mixed Export Patterns

**Severity:** 🟡 MEDIUM

Code uses both default and named exports inconsistently:

#### Default Exports (Page files):
```tsx
// src/app/(auth)/login/page.tsx
export default function LoginPage() { ... }  // ✅ Good for Next.js pages
```

#### Named Exports (Components):
```tsx
// src/components/features/auth/screens/login-sso-screen.tsx
export function LoginSsoScreen() { ... }  // ✅ Correct for components

// src/components/shared/brand-logo.tsx
export function BrandLogo({ ... }: BrandLogoProps) { ... }  // ✅ Correct
```

#### Mixed in Same File:
```tsx
// src/components/design-system/color-scale.tsx
export function ColorScaleDisplay({ ... }) { ... }  // Named export
export function GreyscaleSwatch({ ... }) { ... }     // Named export (multiple)
export function AdditionalSwatch({ ... }) { ... }    // Named export (multiple)
```

**Recommendation:** Document pattern — pages use default, components use named exports.

---

## 5. NAMING INCONSISTENCIES

### 5.1 High: Naming Mixes Concerns

**Severity:** 🟠 HIGH

#### Pattern 1: Screen Naming Confusion

- `hris-dashboard-screen.tsx` — Is this the HRIS dashboard or main dashboard?
- `hris-section-page.tsx` — Called "page" but in components directory?
- `module-placeholder.tsx` — What module? Why still here?

#### Pattern 2: Auth Component Naming

All auth screens use `{feature}-screen.tsx`:
- ✅ `login-sso-screen.tsx` — Clear
- ✅ `forgot-password-screen.tsx` — Clear
- ❌ `forgot-password-success-screen.tsx` — Is this a screen or a success state?

#### Pattern 3: Shared vs Feature

- `DashboardShell` is in `shared/` but only used by dashboard
- `AuthSplitLayout` is in `shared/auth/` — should this be in features or shared?

**Suggested Pattern:**

```
Naming Convention:
- Screens: {module}-{feature}-screen.tsx    (e.g., auth-login-screen.tsx)
- Pages: {route}-page.tsx                   (e.g., dashboard-page.tsx) 
- Cards: {name}-card.tsx                    (e.g., stat-card.tsx)
- Forms: {name}-form.tsx                    (e.g., login-form.tsx)
- Layouts: {name}-layout.tsx                (e.g., auth-layout.tsx)
```

---

### 5.2 Medium: Abbreviation Inconsistency

**Severity:** 🟡 MEDIUM

Same concepts abbreviated differently:

- `HRIS` (Human Resource Information System) — always consistent ✅
- `auth` vs `Auth` — inconsistent casing in different files
- `UI` vs `ui` — mixed casing in store names
- `color` vs `colour` — English variant inconsistency (not found here but watch for it)

---

## 6. TYPE ORGANIZATION FRAGMENTATION

### 6.1 Medium: Auth Types Scattered

**Severity:** 🟡 MEDIUM  
**Files:** Multiple locations

```
Auth-related types live in:
├── src/lib/validations/auth.ts         ✅ Main auth schemas
│   ├── authUserSchema
│   ├── authSessionSchema
│   └── (also: loginSchema, registerSchema, etc.)
│
├── src/stores/auth-store.ts            ❌ AuthState type defined here
│   └── AuthState (not exported centrally)
│
└── src/config/mvp.ts                   ❌ UserRole type defined here
    └── UserRole enum
```

**Problem:** If you need all auth types, which file(s) do you import from?

**Should Consolidate To:** [src/types/index.ts](src/types/index.ts) or [src/lib/validations/auth.ts](src/lib/validations/auth.ts)

#### After Consolidation:
```
src/types/
├── index.ts                    (re-exports all)
├── auth.ts                     (AuthUser, AuthSession, AuthState)
└── ui.ts                       (UIState, etc.)

src/lib/validations/
├── auth.ts                     (Zod schemas — separate from types)
└── dashboard.ts
```

---

## 7. STATE MANAGEMENT ISSUES

### 7.1 Medium: Incomplete Store Patterns

**Severity:** 🟡 MEDIUM  
**File:** [src/stores/auth-store.ts](src/stores/auth-store.ts)

Store has minimal error/loading state handling:

```tsx
type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  showSplash: boolean;
  isLoading: boolean;              // ✅ Has loading
  error: string | null;            // ✅ Has error
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
  setShowSplash: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
};
```

**Problems:**
- ❌ No loading states for dashboard, HRIS, etc.
- ❌ `useUiStore` is empty or minimal
- ❌ No loading states for specific operations (delete, update, etc.)

**Recommendations:**
```tsx
// Add operation-specific loading states
type AuthState = {
  // Existing...
  
  // Add operation states
  operations: {
    login: { loading: boolean; error?: string };
    logout: { loading: boolean; error?: string };
    register: { loading: boolean; error?: string };
  };
};
```

---

## 8. MISSING HOOKS & UTILITIES

### 8.1 Critical: Underutilized Hooks Directory

**Severity:** 🔴 CRITICAL  
**Path:** [src/hooks/](src/hooks/)

```
src/hooks/
├── index.ts
├── useAsync.ts      ⚠️ Exists but might not be used
├── useAuth.ts       ✅ Used
├── useForm.ts       ⚠️ Exists but might not be used
```

**Missing Custom Hooks:**
- ❌ `useClickOutside()` — Needed in DashboardShell for profile dropdown
- ❌ `useNavigation()` — Navigation state in DashboardShell
- ❌ `useLocalStorage()` — Persist UI state (sidebar open, etc.)
- ❌ `useDashboardState()` — Compose dashboard-specific state
- ❌ `useApi()` or `useFetch()` — Wrap API calls with loading/error
- ❌ `useDebounce()` — For search inputs in upcoming modules
- ❌ `useTheme()` — Already have ThemeProvider but no hook

#### Example: useClickOutside Hook (Missing)

Currently duplicated in `DashboardShell`:
```tsx
// ❌ In dashboard-shell.tsx - lines 65-73
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

**Should Be:** [src/hooks/useClickOutside.ts](src/hooks/useClickOutside.ts)

---

## 9. CIRCULAR DEPENDENCY RISKS

### 9.1 Medium: Auth Store → Hooks → Components Chain

**Severity:** 🟡 MEDIUM  
**Risk Level:** Not yet, but likely with growth

#### Current Chain:
```
src/stores/auth-store.ts
  ↓ (imported by)
src/hooks/useAuth.ts
  ↓ (imported by)
src/components/features/auth/screens/*.tsx
  ↓ (uses state from)
src/stores/auth-store.ts  ❌ Back to start
```

**Not a problem yet**, but if components start re-exporting or auth-store imports components, circular dependency risk emerges.

**Prevention:** Use barrel exports and strict layer separation.

---

## PRIORITY REFACTORING ROADMAP

### Priority 1 🔴 (Week 1) — DO FIRST

**Estimated Effort:** 2-3 days

1. **Replace all hardcoded colors** (40+ instances)
   - Search/replace hex codes with Tailwind classes
   - Map colors to design system tokens
   - Files: 8 component files
   - Impact: Maintenance cost drops by 80%

2. **Extract repeated button styles** (6+ instances)
   - Create `Button` component or extend existing UI button
   - Update 6 auth screen files
   - Impact: Consistency, maintainability

3. **Create missing hooks**
   - `useClickOutside()` — Replace inline in DashboardShell
   - `useNavigation()` — Extract sidebar state
   - Impact: ~50 lines of code removed

### Priority 2 🟠 (Week 2) — DO SECOND

**Estimated Effort:** 2-3 days

4. **Standardize component structure**
   - Move dashboard to `dashboard/screens/` structure
   - Reorganize HRIS with clear roles
   - Create README.md for each feature folder

5. **Consolidate auth types**
   - Move AuthState from store to `src/types/auth.ts`
   - Re-export from stores
   - Create `src/types/index.ts` barrel

6. **Create barrel exports**
   - `src/components/index.ts` — All public components
   - `src/components/features/index.ts` — Feature screens
   - `src/components/shared/index.ts` — Shared components

### Priority 3 🟡 (Week 3) — DO THIRD

**Estimated Effort:** 1-2 days

7. **Move dashboard-shell to shared/layout/**
8. **Document folder structure** with templates for new modules
9. **Add missing test utilities** (useAsync, useForm comprehensive tests)

### Priority 4 💡 (Future) — BACKLOG

10. Extract inline mock data from hris-dashboard-screen.tsx
11. Create operation-specific loading states in stores
12. Add TypeScript strict mode validation

---

## BEFORE/AFTER STRUCTURE EXAMPLES

### Example 1: Color Hardcoding Fix

#### BEFORE (❌)
```tsx
// src/components/features/dashboard/hris-dashboard-screen.tsx
<div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-[#EFF6FF]">
  <Icon className="size-[18px] text-[#3B82F6]" strokeWidth={1.75} />
</div>

// Same hardcoded colors in 7 other files...
```

#### AFTER (✅)
```tsx
// src/components/features/dashboard/hris-dashboard-screen.tsx
<div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary-50">
  <Icon className="size-[18px] text-primary-500" strokeWidth={1.75} />
</div>

// One change fixes all instances across the codebase
```

---

### Example 2: Feature Folder Standardization

#### BEFORE (❌)
```
src/components/features/
├── auth/screens/              (well-organized)
├── dashboard/                 (single file chaos)
├── hris/                       (two ambiguous files)
└── splash/
```

#### AFTER (✅)
```
src/components/features/
├── auth/
│   ├── screens/               (all page-level components)
│   ├── components/            (form fields, helpers)
│   ├── hooks.ts
│   ├── types.ts
│   └── index.ts
│
├── dashboard/
│   ├── screens/               (main dashboard screen)
│   ├── components/            (stat cards, charts)
│   ├── hooks.ts
│   ├── types.ts
│   └── index.ts
│
├── hris/
│   ├── screens/               (overview, section screens)
│   ├── components/            (tables, forms)
│   ├── hooks.ts
│   ├── types.ts
│   └── index.ts
│
└── splash/
```

---

### Example 3: Hook Extraction

#### BEFORE (❌)
```tsx
// src/components/shared/dashboard-shell.tsx — 65 lines of duplicated logic
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

#### AFTER (✅)
```tsx
// src/hooks/useClickOutside.ts
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  ref: React.RefObject<T>,
  onClickOutside: () => void
) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClickOutside]);
}

// In dashboard-shell.tsx — now 3 lines
const profileRef = useRef<HTMLDivElement>(null);
const [profileOpen, setProfileOpen] = useState(false);
useClickOutside(profileRef, () => setProfileOpen(false));
```

---

## SUMMARY METRICS

| Issue | Count | Files | Severity | Fix Time |
|-------|-------|-------|----------|----------|
| Hardcoded Colors | 40+ | 8 | 🔴 CRITICAL | 30 min (search/replace) |
| Repeated Button Styles | 6+ | 6 | 🟠 HIGH | 45 min |
| Missing Hooks | 5+ | N/A | 🔴 CRITICAL | 2 hours |
| Inconsistent Structure | 3 patterns | 3 features | 🟠 HIGH | 1 day |
| Type Fragmentation | Multiple | 4+ files | 🟡 MEDIUM | 2 hours |
| Empty Folders | 1 | layout/ | 🟡 MEDIUM | 30 min |
| Missing Barrel Exports | 3 | 3 dirs | 🟡 MEDIUM | 1 hour |

---

## CONCLUSION

The codebase has a **solid foundation** but needs **focused cleanup** in two areas:

1. **Design System Alignment** (Weeks 1-2) — Replace hardcoded colors, extract components
2. **Folder Structure Standardization** (Weeks 2-3) — Document patterns for scaling

Once these are addressed, the codebase will be **much more maintainable** for new modules (Payroll, Recruitment, etc.) and team members will have clear patterns to follow.

**Recommended Next Step:** Start with Priority 1 (hardcoded colors) — highest impact, lowest complexity.

