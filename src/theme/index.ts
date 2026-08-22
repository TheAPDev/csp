/**
 * WONDERKIN Design Token System — single import surface.
 * Components must import tokens from "@theme" and never hardcode
 * raw color/spacing/typography values.
 */
export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./radius";
export * from "./shadows";
export * from "./elevation";
export * from "./opacity";
export * from "./animation";
export * from "./layering";
export * from "./iconSizing";
export * from "./touchTargets";

import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { elevation } from "./elevation";
import { opacity } from "./opacity";
import { duration, easing } from "./animation";
import { zIndex } from "./layering";
import { iconSize } from "./iconSizing";
import { touchTarget } from "./touchTargets";

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  elevation,
  opacity,
  duration,
  easing,
  zIndex,
  iconSize,
  touchTarget,
} as const;

export type Theme = typeof theme;
