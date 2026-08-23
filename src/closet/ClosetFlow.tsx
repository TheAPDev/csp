import React, { useState } from "react";
import { WorldScene } from "@worlds/WorldScene";
import { worldRegistry } from "@worlds/WorldRegistry";
import { CosmeticItemDefinition } from "@apptypes";
import { useProgressionStore } from "@state/progressionStore";
import { useClosetStore } from "@state/closetStore";
import { ClosetHomeScreen } from "./screens/ClosetHomeScreen";
import { ItemPreviewScreen } from "./screens/ItemPreviewScreen";

type Step = { name: "home" } | { name: "preview"; item: CosmeticItemDefinition };

interface ClosetFlowProps {
  onReturnToGrove: () => void;
}

/**
 * Orchestrates Companion's Closet: browse → preview → buy/equip →
 * back to browse. Mirrors `MissionsFlow`'s single-owner-of-sequencing
 * pattern (see WONDERKIN_CONTINUITY §9 note on World flows).
 */
export function ClosetFlow({ onReturnToGrove }: ClosetFlowProps) {
  const [step, setStep] = useState<Step>({ name: "home" });

  const coins = useProgressionStore((s) => s.coins);
  const adventureTickets = useProgressionStore((s) => s.adventureTickets);
  const collectorTokens = useProgressionStore((s) => s.collectorTokens);

  const isOwned = useClosetStore((s) => s.isOwned);
  const equipped = useClosetStore((s) => s.equipped);
  const purchase = useClosetStore((s) => s.purchase);
  const equip = useClosetStore((s) => s.equip);

  function isEquipped(item: CosmeticItemDefinition) {
    return equipped[item.category] === item.id;
  }

  return (
    <WorldScene backgroundAssetId={worldRegistry.closet.backgroundAssetId}>
      {step.name === "home" && (
        <ClosetHomeScreen
          coins={coins}
          adventureTickets={adventureTickets}
          collectorTokens={collectorTokens}
          isOwned={isOwned}
          isEquipped={isEquipped}
          onSelectItem={(item) => setStep({ name: "preview", item })}
          onReturnToGrove={onReturnToGrove}
        />
      )}

      {step.name === "preview" && (
        <ItemPreviewScreen
          item={step.item}
          owned={isOwned(step.item.id)}
          equipped={isEquipped(step.item)}
          onPurchase={purchase}
          onEquip={(item) => equip(item.id)}
          onBack={() => setStep({ name: "home" })}
        />
      )}
    </WorldScene>
  );
}
