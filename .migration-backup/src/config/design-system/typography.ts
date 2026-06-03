export const fontFamilies = {
  brand: "var(--font-manrope)",
  sans: "var(--font-open-sans)",
  heading: "var(--font-open-sans)",
} as const;

export const fontWeights = {
  light: "300",
  regular: "400",
  semibold: "600",
} as const;

/** Heading styles — Open Sans per design system */
export const headings = {
  h1: {
    label: "Heading 1",
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.light,
    fontSize: "2.5rem", // 40px
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
  },
  h2: {
    label: "Heading 2",
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.light,
    fontSize: "2rem", // 32px
    lineHeight: "1.25",
    letterSpacing: "-0.02em",
  },
  h3: {
    label: "Heading 3",
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.light,
    fontSize: "1.5rem", // 24px
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
  },
  h4: {
    label: "Heading 4",
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "1.125rem", // 18px
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  h5: {
    label: "Heading 5",
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "1rem", // 16px
    lineHeight: "1.5",
    letterSpacing: "0",
  },
  h6: {
    label: "Heading 6",
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: "0.75rem", // 12px
    lineHeight: "1.5",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
} as const;

export type HeadingLevel = keyof typeof headings;

/** Paragraph styles — Open Sans */
export const textStyles = {
  text1: {
    label: "Text 1",
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: "1rem", // 16px
    lineHeight: "1.6",
  },
  text2: {
    label: "Text 2",
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: "0.875rem", // 14px
    lineHeight: "1.6",
  },
  text3: {
    label: "Text 3",
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: "0.75rem", // 12px
    lineHeight: "1.5",
  },
} as const;

export type TextStyle = keyof typeof textStyles;

export const quoteStyle = {
  label: "Quote",
  fontFamily: fontFamilies.sans,
  fontWeight: fontWeights.light,
  fontStyle: "italic" as const,
  fontSize: "1.5rem", // 24px
  lineHeight: "1.5",
} as const;

export const manropeSpecimen = {
  label: "Manrope",
  description: "Brand typeface for logo lockups and display moments.",
  fontFamily: fontFamilies.brand,
  weights: [300, 400, 500, 600, 700, 800] as const,
} as const;
