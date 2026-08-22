import { supabase } from "./client";
import { CompanionState } from "@apptypes";

export async function getCompanionState(profileId: string): Promise<CompanionState | null> {
  const { data, error } = await supabase
    .from("companion_state")
    .select("*")
    .eq("profile_id", profileId)
    .single();
  if (error) return null;
  return data as CompanionState;
}

export async function updateCompanionMood(profileId: string, mood: CompanionState["mood"]) {
  return supabase.from("companion_state").update({ mood, updated_at: new Date().toISOString() }).eq("profile_id", profileId);
}
