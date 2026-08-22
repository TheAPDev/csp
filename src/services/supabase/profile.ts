import { supabase } from "./client";
import { Profile } from "@apptypes";

export async function getProfile(profileId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", profileId).single();
  if (error) return null;
  return data as Profile;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  return supabase.from("profiles").upsert(profile);
}
