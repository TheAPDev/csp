/**
 * WONDERKIN Typography System
 * A storybook-cinematic display face paired with a highly legible
 * body face for young readers (ages 6-9). Swap font families here
 * only — never inline font sizes/weights in components.
 */

export const fontFamily = {
  display: "System", // Replace with licensed storybook display font when available
  body: "System",
  mono: "System",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const typography = {
  display: { fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38, fontWeight: fontWeight.bold },
  title: { fontFamily: fontFamily.display, fontSize: 24, lineHeight: 30, fontWeight: fontWeight.bold },
  heading: { fontFamily: fontFamily.body, fontSize: 20, lineHeight: 26, fontWeight: fontWeight.semibold },
  bodyLarge: { fontFamily: fontFamily.body, fontSize: 18, lineHeight: 26, fontWeight: fontWeight.regular },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 22, fontWeight: fontWeight.regular },
  caption: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18, fontWeight: fontWeight.medium },
  label: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 18, fontWeight: fontWeight.semibold },
} as const;

export type TypographyToken = typeof typography;
