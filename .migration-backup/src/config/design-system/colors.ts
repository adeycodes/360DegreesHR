/**
 * Color Reference — For Design System Display Page Only
 * 
 * ⚠️ SOURCE OF TRUTH: src/styles/design-system/colors.css
 * 
 * This file is ONLY used to render the design system reference page.
 * All color values come from the CSS variables defined in colors.css.
 * 
 * Components use CSS variable classes: text-primary-500, bg-secondary-50, etc.
 */

/** Main colors */
export const primaryBase = "#274376" as const;
export const secondaryBase = "#F7A316" as const;

/** Alert colors */
export const successBase = "#0CAF60" as const;
export const warningBase = "#FFD023" as const;
export const errorBase = "#E03137" as const;

/** Greyscale - matches CSS variables */
export const greyscale = {
  50: "#FAFAFA",
  100: "#FBFBFB",
  200: "#F1F2F4",
  300: "#E9EAEC",
  400: "#CBD5E0",
  500: "#A0AEC0",
  600: "#6B7588",
  700: "#525B6E",
  800: "#3D4556",
  900: "#282E3C",
} as const;

export type GreyscaleKey = keyof typeof greyscale;

/** Additional accent colors */
export const additional = {
  white: "#FFFFFF",
  orange: "#FE984A",
  blue: "#2F7BEE",
  purple: "#8C62FF",
} as const;

export type AdditionalColorKey = keyof typeof additional;

/** Display data for design system page */
export const mainColors = [
  {
    name: "Primary",
    scale: {
      50: "color-mix(in srgb, #274376 8%, white)",
      100: "color-mix(in srgb, #274376 16%, white)",
      200: "color-mix(in srgb, #274376 32%, white)",
      300: "color-mix(in srgb, #274376 48%, white)",
      400: "color-mix(in srgb, #274376 64%, white)",
      500: primaryBase,
    },
    tokenPrefix: "primary",
  },
  {
    name: "Secondary",
    scale: {
      50: "color-mix(in srgb, #F7A316 8%, white)",
      100: "color-mix(in srgb, #F7A316 16%, white)",
      200: "color-mix(in srgb, #F7A316 32%, white)",
      300: "color-mix(in srgb, #F7A316 48%, white)",
      400: "color-mix(in srgb, #F7A316 64%, white)",
      500: secondaryBase,
    },
    tokenPrefix: "secondary",
  },
] as const;

export const alertColors = [
  {
    name: "Success",
    scale: {
      50: "color-mix(in srgb, #0CAF60 8%, white)",
      100: "color-mix(in srgb, #0CAF60 16%, white)",
      200: "color-mix(in srgb, #0CAF60 32%, white)",
      300: "color-mix(in srgb, #0CAF60 48%, white)",
      400: "color-mix(in srgb, #0CAF60 64%, white)",
      500: successBase,
    },
    tokenPrefix: "success",
  },
  {
    name: "Warning",
    scale: {
      50: "color-mix(in srgb, #FFD023 8%, white)",
      100: "color-mix(in srgb, #FFD023 16%, white)",
      200: "color-mix(in srgb, #FFD023 32%, white)",
      300: "color-mix(in srgb, #FFD023 48%, white)",
      400: "color-mix(in srgb, #FFD023 64%, white)",
      500: warningBase,
    },
    tokenPrefix: "warning",
  },
  {
    name: "Error",
    scale: {
      50: "color-mix(in srgb, #E03137 8%, white)",
      100: "color-mix(in srgb, #E03137 16%, white)",
      200: "color-mix(in srgb, #E03137 32%, white)",
      300: "color-mix(in srgb, #E03137 48%, white)",
      400: "color-mix(in srgb, #E03137 64%, white)",
      500: errorBase,
    },
    tokenPrefix: "error",
  },
] as const;

export const greyscaleSteps = Object.entries(greyscale).map(([step, hex]) => ({
  step: Number(step) as GreyscaleKey,
  hex,
  token: `grey-${step}`,
}));

export const additionalColors = Object.entries(additional).map(([name, hex]) => ({
  name: name as AdditionalColorKey,
  hex,
  token: name,
}));
