import React from "react";
import { WorldId } from "@worlds/WorldRegistry";
import { TaleTrailsFlow } from "@taletrails/TaleTrailsFlow";

interface TaleTrailsWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * Tale Trails World entry point (Batch 05). Renders the full Tale
 * Trails system via `TaleTrailsFlow` — reachable only through its
 * Grove gateway, same as every other World (see WorldGateway /
 * RootNavigator). The discovery screen's own "Return to the Grove"
 * link is the way home, same `ReturnToGrove` affordance every other
 * World uses.
 */
export default function TaleTrailsWorld({ onNavigateToWorld }: TaleTrailsWorldProps) {
  return <TaleTrailsFlow onReturnToGrove={() => onNavigateToWorld?.("grove")} />;
}
