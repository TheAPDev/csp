import { supabase } from "./client";
import { MissionReward } from "@apptypes";

/** Best-effort completion log — never blocks or throws into the UI, same pattern as every other World's reward log. */
export async function recordBeyondCompletion(profileId: string, regionId: string, reward: MissionReward) {
  try {
    return await supabase.from("beyond_region_completions").insert({
      profile_id: profileId,
      region_id: regionId,
      xp: reward.xp,
      coins: reward.coins,
      adventure_tickets: reward.adventureTickets ?? 0,
      collector_tokens: reward.collectorTokens ?? 0,
    });
  } catch {
    return null;
  }
}
