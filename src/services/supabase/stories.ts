import { supabase } from "./client";

/**
 * Reuses the Batch 01 `story_progress` table as-is (`profile_id`,
 * `story_id`, `chapter_index`, `updated_at`) — no schema change, per
 * the batch's "reuse Supabase architecture" instruction. Since Batch
 * 05 episodes are single-session experiences rather than multi-
 * chapter sagas, `chapter_index` is used simply as a 0/1 completion
 * flag for now; a future batch adding true multi-chapter stories can
 * start using it as a real index without a migration.
 */
export async function recordEpisodeCompletion(profileId: string, episodeId: string) {
  try {
    return await supabase.from("story_progress").upsert(
      {
        profile_id: profileId,
        story_id: episodeId,
        chapter_index: 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,story_id" }
    );
  } catch {
    return null;
  }
}

export async function getStoryProgress(profileId: string) {
  try {
    const { data, error } = await supabase.from("story_progress").select("*").eq("profile_id", profileId);
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
