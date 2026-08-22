/** WONDERKIN Elevation / Z-Layer scale (paired with shadows.ts) */
export const elevation = {
  base: 0,
  raised: 1,
  card: 2,
  sheet: 3,
  modal: 4,
  toast: 5,
  companionOverlay: 6,
} as const;

export type ElevationToken = typeof elevation;
