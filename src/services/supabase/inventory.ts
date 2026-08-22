import { supabase } from "./client";
import { InventoryItem } from "@apptypes";

export async function listInventory(profileId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase.from("inventory_items").select("*").eq("profile_id", profileId);
  if (error) return [];
  return data as InventoryItem[];
}

export async function addInventoryItem(profileId: string, itemAssetId: string, quantity = 1) {
  return supabase.from("inventory_items").insert({ profile_id: profileId, item_asset_id: itemAssetId, quantity });
}
