import { supabase } from "./client";
import { CosmeticCategory, OwnedCosmeticItem } from "@apptypes";

export async function listOwnedCosmetics(profileId: string): Promise<OwnedCosmeticItem[]> {
  const { data, error } = await supabase.from("cosmetic_inventory").select("*").eq("profile_id", profileId);
  if (error) return [];
  return data as OwnedCosmeticItem[];
}

/**
 * Records a purchase. `cosmetic_inventory` has a unique constraint on
 * (profile_id, item_id) — see schema.sql — so a duplicate purchase
 * (e.g. a retried request) is rejected by the database itself, not
 * just by the client-side ownership check in `closetStore`.
 */
export async function recordCosmeticPurchase(profileId: string, itemId: string) {
  return supabase
    .from("cosmetic_inventory")
    .insert({ profile_id: profileId, item_id: itemId })
    .select()
    .single();
}

export async function saveEquippedSlots(profileId: string, slots: Partial<Record<CosmeticCategory, string>>) {
  return supabase
    .from("equipped_cosmetics")
    .upsert({ profile_id: profileId, slots, updated_at: new Date().toISOString() }, { onConflict: "profile_id" });
}
