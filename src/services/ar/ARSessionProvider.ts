/**
 * WONDERKIN AR Architecture — backend-agnostic session contract.
 *
 * `CameraFallbackARProvider` (this batch) implements this today using
 * fixed, deterministic screen-space anchors over a live camera feed —
 * no real plane detection or world tracking. A future
 * `ARKitSessionProvider` / `ARCoreSessionProvider` implements the
 * SAME interface with real plane detection, world tracking, and
 * world-locked anchors. No caller (`ExplorationScreen`,
 * `TreasureHuntFlow`) should need to change when that swap happens —
 * see master protocol §AR ARCHITECTURE ("Do NOT build fake APIs that
 * would require rewriting the system").
 */

export interface ARCapabilities {
  planeDetection: boolean;
  worldTracking: boolean;
  anchors: boolean;
  objectPlacement: boolean;
  spatialInteraction: boolean;
}

/** Normalized 0..1 screen-space in the camera fallback; world-space meters once a native provider lands. */
export interface ARPosition {
  x: number;
  y: number;
  z?: number;
}

export interface ARAnchor {
  id: string;
  treasureId: string;
  position: ARPosition;
}

export interface ARHitTestResult {
  anchorId: string | null;
}

export interface ARSessionProvider {
  readonly capabilities: ARCapabilities;
  start(): Promise<void>;
  stop(): void;
  /** Places (or re-places) an anchor for a given treasure. Deterministic per `treasureId` so a session doesn't jitter. */
  placeAnchor(treasureId: string): ARAnchor;
  /** Detaches an anchor, e.g. once its treasure has been collected. */
  removeAnchor(treasureId: string): void;
  /** Fires immediately with the current anchor set, then on every change. Returns an unsubscribe function. */
  subscribeAnchors(callback: (anchors: ARAnchor[]) => void): () => void;
  /** Resolves which anchor (if any) a screen-space tap landed on. */
  hitTest(point: ARPosition): ARHitTestResult;
}
