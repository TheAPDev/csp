import { supabase } from "./client";
import { RedemptionRequest } from "@apptypes";

export async function listRedemptionRequests(profileId: string): Promise<RedemptionRequest[]> {
  const { data, error } = await supabase.from("redemption_requests").select("*").eq("profile_id", profileId);
  if (error) return [];
  return data as RedemptionRequest[];
}

/**
 * Creates a redemption request row (status starts at "requested" —
 * see schema.sql default). A partial unique index on
 * (profile_id, reward_id) WHERE status != 'fulfilled' prevents a
 * duplicate *active* request for the same reward at the database
 * layer, mirroring the client-side `hasActiveRequest` guard in
 * `vaultStore`. No payment information is collected or stored here —
 * this only queues a parent hand-off.
 */
export async function recordRedemptionRequest(profileId: string, rewardId: string) {
  return supabase
    .from("redemption_requests")
    .insert({ profile_id: profileId, reward_id: rewardId })
    .select()
    .single();
}
