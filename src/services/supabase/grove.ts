import { supabase } from "./client";
import { GroveState } from "@apptypes";

export async function getGroveState(profileId: string): Promise<GroveState | null> {
  const { data, error } = await supabase.from("grove_state").select("*").eq("profile_id", profileId).single();
  if (error) return null;
  return data as GroveState;
}

export async function upsertGroveState(
  profileId: string,
  evolutionStage: GroveState["evolution_stage"]
) {
  return supabase.from("grove_state").upsert({
    profile_id: profileId,
    evolution_stage: evolutionStage,
    last_visited_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}
