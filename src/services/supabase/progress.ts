import { supabase } from "./client";
import { Progression, Currencies } from "@apptypes";

export async function getProgression(profileId: string): Promise<Progression | null> {
  const { data, error } = await supabase.from("progression").select("*").eq("profile_id", profileId).single();
  if (error) return null;
  return data as Progression;
}

export async function addXp(profileId: string, amount: number) {
  return supabase.rpc("increment_xp", { p_profile_id: profileId, p_amount: amount }).then(
    async (res) => {
      // Fallback if RPC not yet defined in this Supabase project:
      if (res.error) {
        const current = await getProgression(profileId);
        const nextXp = (current?.xp ?? 0) + amount;
        return supabase.from("progression").update({ xp: nextXp, updated_at: new Date().toISOString() }).eq("profile_id", profileId);
      }
      return res;
    }
  );
}

export async function getCurrencies(profileId: string): Promise<Currencies | null> {
  const { data, error } = await supabase.from("currencies").select("*").eq("profile_id", profileId).single();
  if (error) return null;
  return data as Currencies;
}
