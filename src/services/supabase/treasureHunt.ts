import { supabase } from "./client";
import { MissionReward } from "@apptypes";

/** Best-effort collection log — never blocks or throws into the UI, same as recordMissionCompletion. */
export async function recordTreasureCollection(profileId: string, treasureId: string, reward: MissionReward) {
  try {
    return await supabase.from("treasure_collections").insert({
      profile_id: profileId,
      treasure_id: treasureId,
      xp: reward.xp,
      coins: reward.coins,
      adventure_tickets: reward.adventureTickets ?? 0,
      collector_tokens: reward.collectorTokens ?? 0,
    });
  } catch {
    return null;
  }
}
