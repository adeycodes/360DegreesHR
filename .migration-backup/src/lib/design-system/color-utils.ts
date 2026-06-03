/** Mix a hex color with white (0 = base, 1 = white). */
export function mixWithWhite(hex: string, whiteRatio: number): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const mix = Math.min(1, Math.max(0, whiteRatio));
  const toHex = (value: number) =>
    Math.round(value).toString(16).padStart(2, "0");
  return `#${toHex(r + (255 - r) * mix)}${toHex(g + (255 - g) * mix)}${toHex(b + (255 - b) * mix)}`;
}

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
};

/** Build a 50–500 scale from a base color (500). Matches design-system tint rows. */
export function createColorScale(base500: string): ColorScale {
  return {
    50: mixWithWhite(base500, 0.92),
    100: mixWithWhite(base500, 0.84),
    200: mixWithWhite(base500, 0.68),
    300: mixWithWhite(base500, 0.52),
    400: mixWithWhite(base500, 0.36),
    500: base500,
  };
}

export type ColorScaleKey = keyof ColorScale;
