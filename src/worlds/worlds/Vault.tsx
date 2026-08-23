import React from "react";
import { WorldId } from "@worlds/WorldRegistry";
import { VaultFlow } from "@vault/VaultFlow";

interface VaultWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * The Vault World entry point (Batch 07). Renders the physical reward
 * progression experience via `VaultFlow` — reachable only through its
 * Grove gateway, same as every other World.
 */
export default function VaultWorld({ onNavigateToWorld }: VaultWorldProps) {
  return <VaultFlow onReturnToGrove={() => onNavigateToWorld?.("grove")} />;
}
