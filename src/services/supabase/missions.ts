import { supabase } from "./client";
import { MissionDefinition, MissionReward } from "@apptypes";
import { missionDefinitions as localMissionDefinitions } from "@missions/content/missionDefinitions";

/**
 * Reads mission definitions from Supabase, falling back to the local
 * seed (`missions/content/missionDefinitions.ts`) if the table is
 * empty or unreachable — Missions must stay playable offline / before
 * a backend exists, consistent with the guest-continuation pattern
 * established in onboarding's account entry.
 */
export async function getMissionDefinitions(): Promise<MissionDefinition[]> {
  try {
    const { data, error } = await supabase.from("mission_definitions").select("*");
    if (error || !data || data.length === 0) return localMissionDefinitions;
    return data as unknown as MissionDefinition[];
  } catch {
    return localMissionDefinitions;
  }
}

/** Best-effort submission log — never blocks or throws into the UI. */
export async function logMissionSubmission(
  profileId: string,
  missionId: string,
  submissionType: string,
  status: "pending" | "approved" | "retry",
  companionFeedback?: string
) {
  try {
    return await supabase.from("mission_submissions").insert({
      profile_id: profileId,
      mission_id: missionId,
      submission_type: submissionType,
      status,
      companion_feedback: companionFeedback,
    });
  } catch {
    return null;
  }
}

/** Best-effort completion + reward log — never blocks or throws into the UI. */
export async function recordMissionCompletion(profileId: string, missionId: string, reward: MissionReward) {
  try {
    await supabase.from("mission_progress").upsert(
      {
        profile_id: profileId,
        mission_id: missionId,
        status: "complete",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,mission_id" }
    );
    return await supabase.from("mission_rewards").insert({
      profile_id: profileId,
      mission_id: missionId,
      xp: reward.xp,
      coins: reward.coins,
      adventure_tickets: reward.adventureTickets ?? 0,
      collector_tokens: reward.collectorTokens ?? 0,
    });
  } catch {
    return null;
  }
}
