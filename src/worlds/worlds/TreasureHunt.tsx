import React from "react";
import { WorldId } from "@worlds/WorldRegistry";
import { TreasureHuntFlow } from "@treasurehunt/TreasureHuntFlow";

interface TreasureHuntWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * Treasure Hunt World entry point (Batch 06). Renders the full AR/
 * camera exploration system via `TreasureHuntFlow` — reachable only
 * through its Grove gateway, same as every other World (see
 * WorldGateway / RootNavigator). The flow's own entry and reward
 * screens use `ReturnToGrove`, same affordance every other World
 * uses; the live exploration screen uses its own minimal "Leave"
 * control instead (a full-width button would clutter a camera view).
 */
export default function TreasureHuntWorld({ onNavigateToWorld }: TreasureHuntWorldProps) {
  return <TreasureHuntFlow onReturnToGrove={() => onNavigateToWorld?.("grove")} />;
}
