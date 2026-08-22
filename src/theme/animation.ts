/**
 * WONDERKIN Animation Timing
 * Cinematic pacing — avoid snappy "SaaS UI" easing.
 */
export const duration = {
  instant: 100,
  fast: 180,
  base: 280,
  slow: 420,
  cinematic: 650,
  worldTransition: 900,
} as const;

// Bezier curves as [x1, y1, x2, y2] for use with Reanimated Easing.bezier
export const easing = {
  standard: [0.4, 0.0, 0.2, 1] as const,
  decelerate: [0.0, 0.0, 0.2, 1] as const,
  accelerate: [0.4, 0.0, 1, 1] as const,
  cinematicGlide: [0.22, 1, 0.36, 1] as const,
} as const;

export type DurationToken = typeof duration;
