/** WONDERKIN z-index layering — use instead of raw numbers */
export const zIndex = {
  base: 0,
  world: 10,
  companion: 20,
  hud: 30,
  sheet: 40,
  modal: 50,
  toast: 60,
  transitionOverlay: 70,
} as const;

export type ZIndexToken = typeof zIndex;
