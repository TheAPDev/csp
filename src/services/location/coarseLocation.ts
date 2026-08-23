import * as Location from "expo-location";

export type TreasureBiome = "meadow" | "shoreline" | "woodland";

const DEFAULT_BIOME: TreasureBiome = "meadow";
const BIOMES: TreasureBiome[] = ["meadow", "shoreline", "woodland"];

/**
 * Requests foreground, LOW-accuracy location only, and immediately
 * reduces it to a coarse biome bucket used purely to flavor which
 * demo treasures spawn. The coordinate itself is read once, used in
 * memory, and discarded — never stored, logged, sent to Supabase, or
 * shown to the child (master protocol §LOCATION: "Use coarse
 * location only where necessary. Do not expose exact location to the
 * child."). Permission denial or any failure falls back to a default
 * biome rather than blocking Treasure Hunt.
 */
export async function getCoarseBiome(): Promise<TreasureBiome> {
  try {
    const existing = await Location.getForegroundPermissionsAsync();
    let status = existing.status;
    if (status !== Location.PermissionStatus.GRANTED) {
      const requested = await Location.requestForegroundPermissionsAsync();
      status = requested.status;
    }
    if (status !== Location.PermissionStatus.GRANTED) return DEFAULT_BIOME;

    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    const bucket = Math.floor(Math.abs(position.coords.latitude)) % BIOMES.length;
    return BIOMES[bucket];
  } catch {
    return DEFAULT_BIOME;
  }
}
