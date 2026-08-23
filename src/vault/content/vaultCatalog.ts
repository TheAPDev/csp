import { VaultRewardDefinition } from "@apptypes";

/**
 * Dummy Vault catalog — the physical reward progression track. Every
 * reward is priced in Collector Tokens only (the rare, prestige
 * currency), per the master protocol's "different visual identities
 * and purposes" rule for the three currencies. Real-money purchase
 * and payment collection are explicitly out of scope everywhere in
 * this file and the screens that read it.
 */
export const vaultCatalog: VaultRewardDefinition[] = [
  {
    id: "vault-explorer-box",
    name: "Explorer Box",
    description: "A physical box of trinkets for real-world exploring.",
    previewAssetId: "VAULT_REWARD_EXPLORER_BOX",
    costCollectorTokens: 500,
  },
  {
    id: "vault-stargazer-kit",
    name: "Stargazer Kit",
    description: "A little kit for looking up at the night sky.",
    previewAssetId: "VAULT_REWARD_STARGAZER_KIT",
    costCollectorTokens: 850,
  },
  {
    id: "vault-companion-plush",
    name: "Companion Plush",
    description: "A soft, huggable version of your Companion.",
    previewAssetId: "VAULT_REWARD_COMPANION_PLUSH",
    costCollectorTokens: 1500,
  },
];

export function findVaultReward(id: string): VaultRewardDefinition | undefined {
  return vaultCatalog.find((r) => r.id === id);
}
