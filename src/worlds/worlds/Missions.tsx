import React from "react";
import { WorldId } from "@worlds/WorldRegistry";
import { MissionsFlow } from "@missions/MissionsFlow";

interface MissionsWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * Missions World entry point (Batch 04). Renders the full Missions
 * system via `MissionsFlow` — reachable only through its Grove
 * gateway, same as every other World (see WorldGateway / RootNavigator).
 * `MissionsHomeScreen`'s own "Back to The Grove" link is the way home,
 * mirroring `ReturnToGrove` used by the other still-placeholder Worlds.
 */
export default function MissionsWorld({ onNavigateToWorld }: MissionsWorldProps) {
  return <MissionsFlow onReturnToGrove={() => onNavigateToWorld?.("grove")} />;
}
