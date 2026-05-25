# Styles - Design System

This folder contains all CSS design system definitions and utilities.

## Files

### `colors.css` ⭐ PRIMARY SOURCE

**Single source of truth for all colors.**

- Defines CSS custom properties (CSS variables) for all design tokens
- Generates color scales using CSS `color-mix()` function
- Values are consumed by:
  - Tailwind CSS utilities (`text-primary-500`, `bg-error-50`)
  - Direct CSS var usage (`var(--ds-primary-500)`)
  - Display page reference (`/design-system`)

**Structure:**
```css
:root {
  --ds-primary-500: #274376;
  --ds-primary-50: color-mix(in srgb, var(--ds-primary-500) 8%, white);
  /* ... all scales generated */
}
```

### `typography.css`

Defines Tailwind utilities for typography:
- Heading utilities: `text-h1` through `text-h6`
- Body utilities: `text-body-1`, `text-body-2`, `text-body-3`
- Special utilities: `text-quote`, `font-brand`, `text-specimen`

### `icons.css`

Defines icon-related utilities and styling.

### `index.css`

Main import file that bundles all design system styles.

**Imported by:** `src/app/globals.css`

## How It Works

1. **CSS Variables Defined** → `colors.css` defines `--ds-*` variables
2. **Mapped by Tailwind** → `src/app/globals.css` @theme maps them to Tailwind colors
3. **Used in Templates** → Components use `className="text-primary-500"`
4. **No Duplication** → Change in `colors.css` = change everywhere

## Example Flow

```
colors.css
  ↓
--ds-primary-500: #274376
  ↓
globals.css @theme
  ↓
--color-primary: var(--ds-primary-500)
  ↓
Component
  ↓
className="text-primary"  ✅ Works!
```

## Adding New Colors

1. Edit `src/styles/design-system/colors.css`
2. Add to `:root` CSS variables
3. Update `src/config/design-system/colors.ts` (reference file only)
4. Colors automatically available as Tailwind classes

## Key Principle

**CSS is the source of truth.** All color values, typography specs, and icon definitions live here first, then are referenced elsewhere.
