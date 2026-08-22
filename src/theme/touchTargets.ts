/**
 * WONDERKIN Touch Target Rules
 * Child users (ages 6-9) require generous, forgiving touch areas.
 * Never size an interactive element below `minimum`.
 */
export const touchTarget = {
  minimum: 48,
  comfortable: 56,
  primary: 64,
} as const;

export type TouchTargetToken = typeof touchTarget;
