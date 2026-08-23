import React from "react";
import { WorldId } from "@worlds/WorldRegistry";
import { ClosetFlow } from "@closet/ClosetFlow";

interface ClosetWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * Companion's Closet World entry point (Batch 07). Renders the full
 * store via `ClosetFlow` — reachable only through its Grove gateway,
 * same as every other World.
 */
export default function ClosetWorld({ onNavigateToWorld }: ClosetWorldProps) {
  return <ClosetFlow onReturnToGrove={() => onNavigateToWorld?.("grove")} />;
}
