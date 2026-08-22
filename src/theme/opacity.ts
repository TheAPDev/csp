/** WONDERKIN Opacity Scale */
export const opacity = {
  disabled: 0.38,
  pressed: 0.72,
  hover: 0.88,
  full: 1,
  overlaySubtle: 0.4,
  overlayStrong: 0.72,
} as const;

export type OpacityToken = typeof opacity;
