import { AssetId } from "@assets/registry";

export type CameraEffect = "push" | "pull" | "drift" | "none";
export type BeatHaptic = "light" | "medium" | "success" | "none";

/**
 * A single cinematic story beat. This is the reusable contract for
 * any interactive-story sequence in WONDERKIN — Batch 02's intro uses
 * it, and Batch 05 (full Tale Trails) should compose the same shape
 * rather than invent a parallel one.
 */
export interface StoryBeat {
  id: string;
  backgroundAssetId: AssetId;
  speaker?: string;
  line?: string;
  cameraEffect?: CameraEffect;
  particles?: boolean;
  haptic?: BeatHaptic;
}
