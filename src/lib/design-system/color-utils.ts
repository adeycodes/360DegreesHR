export type ColorScaleKey = 50 | 100 | 200 | 300 | 400 | 500;
export type ColorScale = {
  name: string;
  scale: Record<ColorScaleKey, string>;
  tokenPrefix: string;
};
