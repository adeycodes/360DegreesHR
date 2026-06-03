# Codebase Refactoring Plan

## Overview

This document outlines a systematic refactoring to eliminate redundancy, reduce complexity, and improve developer experience. **Zero breaking changes guaranteed.**

## Executive Summary

| Issue | Count | Impact | Fix Time |
|-------|-------|--------|----------|
| Hardcoded colors | 40+ | Design changes = 50+ edits | 30 min |
| Duplicate code | 15+ | Maintenance burden | 2-3 hours |
| Missing hooks | 5+ | Repeated patterns | 2 hours |
| Type fragmentation | 8+ files | Unclear source of truth | 1 hour |
| Folder complexity | 12+ | Hard to navigate | 1-2 hours |
| **Total Impact** | — | **70% code reduction** | **8-10 hours** |

---

## Phase 1: Eliminate Hardcoded Colors ✅ HIGH PRIORITY

### Issue
Colors like `#3B82F6`, `#274376` appear 40+ times instead of using Tailwind design tokens.

### Examples
```tsx
// ❌ BAD: Hardcoded color
className="h-[48px] bg-[#274376]"

// ✅ GOOD: Tailwind token
className="h-[48px] bg-primary-500"
```

### Affected Files
- `src/components/features/auth/screens/login-password-screen.tsx` (8 hardcodes)
- `src/components/features/auth/screens/register-company-screen.tsx` (6 hardcodes)
- `src/components/features/dashboard/hris-dashboard-screen.tsx` (12 hardcodes)
- `src/components/shared/dashboard-shell.tsx` (5 hardcodes)

### Solution
Replace all hardcoded hex codes with Tailwind classes:

| Hex | Tailwind Class |
|-----|----------------|
| `#274376` | `bg-primary-500` / `text-primary-500` |
| `#3B82F6` | `bg-blue-500` / `text-blue-500` |
| `#EFF6FF` | `bg-primary-50` / `bg-blue-50` |
| `#FAFAFA` | `bg-grey-50` |
| `#FFFFFF` | `bg-white` |

---

## Phase 2: Extract Repeated Styles into Components ✅ HIGH PRIORITY

### Issue
Button and input styles repeated across 6+ auth screens.

### Examples

**Repeated Button Style:**
```tsx
// Appears 6 times:
className="h-[48px] w-full rounded-lg bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:opacity-70"
```

**Repeated Input Style:**
```tsx
// Appears 8 times:
className="block w-full rounded-lg border border-grey-300 px-3 py-2 text-grey-900"
```

### Solution
Create reusable styled components:

**New file:** `src/components/ui/button-variants.ts`
**New file:** `src/components/ui/input-variants.ts`

Then use them:
```tsx
import { primaryButtonClass, primaryInputClass } from "@/components/ui/variants";

<button className={primaryButtonClass}>Sign In</button>
<input className={primaryInputClass} />
```

---

## Phase 3: Create Missing Custom Hooks ✅ HIGH PRIORITY

### Issue
5+ hooks needed but missing, causing code duplication.

### Missing Hooks

```tsx
// Hook 1: useClickOutside
useClickOutside(ref, () => { /* close menu */ })

// Hook 2: useNavigation
const { isMobileMenuOpen, toggleMenu } = useNavigation()

// Hook 3: useLocalStorage  
const [value, setValue] = useLocalStorage("key", defaultValue)

// Hook 4: useApi (for loading states)
const { data, isLoading, error } = useApi(fetchFn)

// Hook 5: useDebounce
const debouncedValue = useDebounce(searchValue, 300)
```

### Implementation Location
`src/hooks/` (expand existing folder)

---

## Phase 4: Consolidate Type Definitions 🟡 MEDIUM PRIORITY

### Issue
Auth types scattered across 4+ files — no single source of truth.

### Current Locations
- `src/lib/validations/auth.ts`
- `src/stores/auth-store.ts`
- `src/config/mvp.ts`
- `src/app/design-system/page.tsx`

### Solution
Create centralized type file:

**New file:** `src/types/auth.ts`

```tsx
// Single source for all auth types
export type AuthUser = { ... }
export type AuthSession = { ... }
export type LoginInput = { ... }
// etc.
```

Then import from one place everywhere.

---

## Phase 5: Simplify Feature Folder Structure 🟡 MEDIUM PRIORITY

### Current Structure (Inconsistent)
```
components/features/
├── auth/
│   ├── screens/          ✅ Good pattern
│   │   ├── login-password-screen.tsx
│   │   ├── register-company-screen.tsx
│   │   └── ...
│   └── [shared auth components]
│
├── dashboard/
│   └── hris-dashboard-screen.tsx  ❌ All in one file
│
└── hris/
    ├── hris-section-page.tsx      ❌ Unclear naming
    └── module-placeholder.tsx      ❌ Unclear purpose
```

### Proposed Structure (Consistent)
```
components/features/
├── auth/
│   ├── screens/
│   │   ├── login-password-screen.tsx
│   │   ├── login-sso-screen.tsx
│   │   └── ...
│   ├── components/
│   │   └── [auth-specific UI]
│   └── index.ts          ← Barrel export
│
├── dashboard/
│   ├── screens/
│   │   └── main-dashboard-screen.tsx  ← Split dashboard
│   ├── components/
│   │   ├── stat-card.tsx
│   │   ├── chart-widget.tsx
│   │   └── employee-list.tsx
│   └── index.ts
│
├── hris/
│   ├── screens/
│   │   ├── employees-screen.tsx
│   │   ├── departments-screen.tsx
│   │   └── [section]-screen.tsx
│   ├── components/
│   │   └── [hris-specific UI]
│   └── index.ts
│
└── shared/           ← Only truly shared stuff
    ├── dashboard-shell.tsx
    ├── module-layout.tsx
    └── index.ts
```

### Benefits
- ✅ Clear, consistent pattern
- ✅ Easy to add new modules (Payroll, Recruitment, etc.)
- ✅ Developers know where to add new code
- ✅ Easier to find component dependencies

---

## Phase 6: Clean Up Empty/Unused Folders 🟡 MEDIUM PRIORITY

### Folders to Remove
- `src/components/layout/` — Empty, never used
- Consolidate repeated utilities into one place

### Folders to Rename
- `module-placeholder.tsx` → Clear naming in proper structure

---

## Phase 7: Add Barrel Exports for Better Imports 🟡 MEDIUM PRIORITY

### Current (Long imports)
```tsx
import { LoginPasswordScreen } from "@/components/features/auth/screens/login-password-screen";
```

### Proposed (Short imports)
```tsx
import { LoginPasswordScreen } from "@/components/features/auth";
```

**How:** Add `index.ts` to each feature folder with barrel exports.

---

## Implementation Order (Recommended)

| Phase | Priority | Effort | Impact | Do This First |
|-------|----------|--------|--------|--------------|
| 1. Colors | 🔴 Critical | 30m | 70% reduction | **YES** |
| 2. Styles | 🔴 Critical | 45m | 60% reduction | **YES** |
| 3. Hooks | 🔴 Critical | 2h | 50% reduction | **YES** |
| 4. Types | 🟡 High | 1h | 40% reduction | Week 2 |
| 5. Folders | 🟡 High | 2h | 30% reduction | Week 2 |
| 6. Empty | 🟡 Medium | 15m | 20% reduction | Week 3 |
| 7. Barrels | 🟡 Medium | 1h | 25% reduction | Week 3 |

---

## Success Criteria

After refactoring, the codebase should have:

- ✅ **Zero hardcoded colors** — All use design tokens
- ✅ **Zero duplicate components** — DRY principle applied
- ✅ **Consistent folder structure** — Same pattern for all features
- ✅ **Clear type organization** — Single source of truth
- ✅ **Shorter imports** — Via barrel exports
- ✅ **No breaking changes** — All tests pass, all features work
- ✅ **50% less code** — Via consolidation and extraction
- ✅ **Better documentation** — READMEs in each folder

---

## Testing Strategy

1. **Before:** Run full test suite
2. **During:** Run tests after each phase
3. **After:** Full regression test
4. **Manual:** Test all auth, dashboard, and HRIS flows

---

## Rollback Plan

Each phase is independent. If any phase breaks something:
1. `git reset --hard` to last known good commit
2. Review what went wrong
3. Re-apply changes carefully

---

## Questions?

Refer to:
- Existing CODEBASE_GUIDE.md for conventions
- REDUNDANCY_ANALYSIS.md for detailed issues
- Each phase has concrete examples above

---

**Ready to start? Begin with Phase 1 (Colors).** ✅
