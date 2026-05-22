import {
  createColorScale,
  type ColorScale,
  type ColorScaleKey,
} from "@/lib/design-system/color-utils";

/** Main — Primary deep blue */
export const primary = createColorScale("#274376");

/** Main — Secondary golden yellow */
export const secondary = createColorScale("#F7A316");

/** Alerts */
export const success = createColorScale("#0CAF60");
export const warning = createColorScale("#FFD023");
export const error = createColorScale("#E03137");

/**
 * Greyscale — steps 700–900 use corrected darker values
 * (source labels for 700–900 were duplicated; swatches are darker greys).
 */
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

export const colorScales = {
  primary,
  secondary,
  success,
  warning,
  error,
} as const;

export type SemanticColorScale = keyof typeof colorScales;

export const mainColors = [
  { name: "Primary", scale: primary, tokenPrefix: "primary" },
  { name: "Secondary", scale: secondary, tokenPrefix: "secondary" },
] as const;

export const alertColors = [
  { name: "Success", scale: success, tokenPrefix: "success" },
  { name: "Warning", scale: warning, tokenPrefix: "warning" },
  { name: "Error", scale: error, tokenPrefix: "error" },
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

export function getScaleCssVars(
  prefix: string,
  scale: ColorScale,
): Record<string, string> {
  const keys: ColorScaleKey[] = [50, 100, 200, 300, 400, 500];
  return keys.reduce(
    (acc, key: ColorScaleKey) => {
      acc[`--color-${prefix}-${key}`] = scale[key];
      return acc;
    },
    {} as Record<string, string>,
  );
}
