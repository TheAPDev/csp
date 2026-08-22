/**
 * WONDERKIN Color System
 * ------------------------------------------------------------------
 * Foundation: deep bluish "night-storybook" base with restrained,
 * muted jewel-tone accents. Never rainbow-saturated. Never neon.
 *
 * DO NOT add new base hues without updating this file and
 * /docs/WONDERKIN_CONTINUITY.md. All screens must draw color from
 * this file — no ad-hoc hex values in components.
 */

export const palette = {
  // Deep bluish foundation (backgrounds, base surfaces)
  midnight900: "#05070F",
  midnight800: "#0B1026",
  midnight700: "#121A3A",
  midnight600: "#1B2650",
  midnight500: "#283569",

  // Muted jewel tones (accents only — used sparingly)
  jewelAmethyst: "#6E5A9E",
  jewelSapphire: "#3E6E9E",
  jewelEmerald: "#4C8C7D",
  jewelRuby: "#9E5A6A",
  jewelTopaz: "#B8925A",

  // Neutral / storybook parchment (text on dark, cards)
  parchment100: "#F5F0E6",
  parchment200: "#E4DCC9",
  parchment300: "#C9BFA8",

  // Functional
  success: "#4C8C7D",
  warning: "#B8925A",
  danger: "#9E5A6A",
  info: "#3E6E9E",

  // Pure
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

export const colors = {
  background: {
    primary: palette.midnight800,
    elevated: palette.midnight700,
    surface: palette.midnight600,
    overlay: "rgba(5,7,15,0.72)",
  },
  text: {
    primary: palette.parchment100,
    secondary: palette.parchment300,
    inverse: palette.midnight900,
    disabled: "rgba(245,240,230,0.38)",
  },
  border: {
    subtle: "rgba(245,240,230,0.10)",
    default: "rgba(245,240,230,0.18)",
    focus: palette.jewelSapphire,
  },
  accent: {
    primary: palette.jewelAmethyst,
    secondary: palette.jewelSapphire,
    positive: palette.jewelEmerald,
    caution: palette.jewelTopaz,
    negative: palette.jewelRuby,
  },
  companion: {
    // Reserved namespace — future batches may extend per-companion tint
    glow: palette.jewelSapphire,
  },
  feedback: {
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    info: palette.info,
  },
} as const;

export type ColorToken = typeof colors;
