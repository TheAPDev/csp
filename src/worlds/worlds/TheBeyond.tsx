import React from "react";
import { WorldId } from "@worlds/WorldRegistry";
import { BeyondFlow } from "@beyond/BeyondFlow";

interface TheBeyondWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * The Beyond World entry point (Batch 09). Renders the full Beyond
 * system via `BeyondFlow` — reachable only through its Grove gateway
 * (portal transition), same as every other World.
 */
export default function TheBeyondWorld({ onNavigateToWorld }: TheBeyondWorldProps) {
  return <BeyondFlow onReturnToGrove={() => onNavigateToWorld?.("grove")} />;
}
