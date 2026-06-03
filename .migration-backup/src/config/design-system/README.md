# Design System Files Organization

## Overview

The design system is organized to eliminate redundancy while keeping source of truth clear.

## Files

### `src/styles/design-system/colors.css` ⭐ PRIMARY SOURCE

This is the **single source of truth** for all color tokens.

- Defines CSS custom properties: `--ds-primary-500`, `--ds-grey-50`, etc.
- Used directly in all components via Tailwind classes: `text-primary-500`, `bg-error-50`
- Generates all color scales using CSS `color-mix()`
- **No duplication** — values defined once, reused everywhere

### `src/config/design-system/colors.ts` (Reference Only)

Used ONLY by the design-system reference page (`/design-system`).

- Mirrors the CSS values for documentation purposes
- Not used in any actual app components
- Exports data structures for displaying the color palette reference

## How Components Use Colors

✅ **Correct: Use Tailwind classes (from CSS)**

```tsx
<div className="text-primary-500 bg-error-50">
  Content
</div>
```

❌ **Avoid: Importing from colors.ts**

```tsx
// DON'T do this in app components:
import { primary } from "@/config/design-system/colors";
```

## Folder Structure

```
src/
├── styles/design-system/
│   ├── colors.css             ⭐ PRIMARY SOURCE
│   ├── typography.css
│   ├── icons.css
│   └── index.css
├── config/design-system/
│   ├── colors.ts              (Reference only - for display page)
│   ├── typography.ts          (Used by component system)
│   ├── icons.ts               (Used by icon system)
│   └── index.ts
└── lib/design-system/
    ├── color-utils.ts         (Utility functions)
    └── ...
```

## When to Use What

| Purpose | File | How |
|---------|------|-----|
| Style components | CSS | `className="text-primary-500"` |
| Display color reference | `colors.ts` | For `/design-system` page |
| Type-safe typography | `typography.ts` | `Heading` and `Text` components |
| Icon metadata | `icons.ts` | Icon component system |

## Key Rule

**CSS is the source of truth. TypeScript files are for tooling and documentation.**

If you need to change a color, edit `src/styles/design-system/colors.css` and the change works everywhere.
