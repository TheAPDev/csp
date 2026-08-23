import { ARAnchor, ARCapabilities, ARHitTestResult, ARPosition, ARSessionProvider } from "./ARSessionProvider";

/** Tap must land within this normalized-distance radius of an anchor to count as a hit. */
const HIT_RADIUS = 0.09;

/** Deterministic 0..1 pseudo-random value from a string seed, so a treasure always anchors to roughly the same spot for a session rather than jittering between renders. */
function seededUnit(seed: string, salt: number): number {
  let hash = salt;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

/**
 * Camera fallback AR provider. The rear camera feed is the
 * exploration surface, but placement is fixed deterministic
 * screen-space points rather than real-world plane/anchor tracking —
 * this is the "polished camera fallback mode" the master protocol
 * calls for when full native AR isn't reliably executable in the
 * current development environment. `capabilities` reports this
 * honestly so calling code never assumes real spatial tracking is
 * happening.
 */
export class CameraFallbackARProvider implements ARSessionProvider {
  readonly capabilities: ARCapabilities = {
    planeDetection: false,
    worldTracking: false,
    anchors: true,
    objectPlacement: true,
    spatialInteraction: true,
  };

  private anchors: Map<string, ARAnchor> = new Map();
  private listeners: Set<(anchors: ARAnchor[]) => void> = new Set();

  async start(): Promise<void> {
    // Nothing to warm up for the fallback — camera permission/session
    // lifecycle is owned by CameraPermissionGate / CameraView, not
    // this provider. A native provider's start() would begin its
    // real AR session here.
  }

  stop(): void {
    this.anchors.clear();
    this.notify();
  }

  placeAnchor(treasureId: string): ARAnchor {
    const existing = this.anchors.get(treasureId);
    if (existing) return existing;

    // Keep placements within a comfortable reach zone, not screen
    // edges — "nearby treasure", not "treasure you can't tap".
    const x = 0.22 + seededUnit(treasureId, 17) * 0.56;
    const y = 0.3 + seededUnit(treasureId, 91) * 0.4;

    const anchor: ARAnchor = { id: `anchor-${treasureId}`, treasureId, position: { x, y } };
    this.anchors.set(treasureId, anchor);
    this.notify();
    return anchor;
  }

  removeAnchor(treasureId: string) {
    if (this.anchors.delete(treasureId)) this.notify();
  }

  subscribeAnchors(callback: (anchors: ARAnchor[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentAnchors());
    return () => this.listeners.delete(callback);
  }

  hitTest(point: ARPosition): ARHitTestResult {
    let closest: ARAnchor | null = null;
    let closestDist = Infinity;
    for (const anchor of this.anchors.values()) {
      const dx = anchor.position.x - point.x;
      const dy = anchor.position.y - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closest = anchor;
      }
    }
    return { anchorId: closest && closestDist <= HIT_RADIUS ? closest.id : null };
  }

  private currentAnchors(): ARAnchor[] {
    return Array.from(this.anchors.values());
  }

  private notify() {
    const snapshot = this.currentAnchors();
    this.listeners.forEach((cb) => cb(snapshot));
  }
}
