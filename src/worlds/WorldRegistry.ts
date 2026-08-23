import { AssetId } from "@assets/registry";

export type WorldId = "grove" | "missions" | "taleTrails" | "treasureHunt" | "theBeyond" | "closet" | "vault";

export interface WorldDefinition {
  id: WorldId;
  displayName: string;
  backgroundAssetId: AssetId;
}

/**
 * Central registry of WONDERKIN Worlds. Each World is a WING of one
 * world, not a separate mini-app — do not give Worlds independent
 * theming. Adding a World means registering it here; screen-level
 * implementation happens in /src/worlds/worlds/<World>.tsx.
 */
export const worldRegistry: Record<WorldId, WorldDefinition> = {
  grove: { id: "grove", displayName: "The Grove", backgroundAssetId: "GROVE_BACKGROUND" },
  missions: { id: "missions", displayName: "Missions", backgroundAssetId: "MISSIONS_BACKGROUND" },
  taleTrails: { id: "taleTrails", displayName: "Tale Trails", backgroundAssetId: "TALE_TRAILS_BACKGROUND" },
  treasureHunt: { id: "treasureHunt", displayName: "Treasure Hunt", backgroundAssetId: "TREASURE_HUNT_BACKGROUND" },
  theBeyond: { id: "theBeyond", displayName: "The Beyond", backgroundAssetId: "THE_BEYOND_BACKGROUND" },
  closet: { id: "closet", displayName: "Companion's Closet", backgroundAssetId: "CLOSET_BACKGROUND" },
  vault: { id: "vault", displayName: "The Vault", backgroundAssetId: "VAULT_BACKGROUND" },
};
