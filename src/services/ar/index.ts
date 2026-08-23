export * from "./ARSessionProvider";
export { CameraFallbackARProvider } from "./CameraFallbackARProvider";

import { ARSessionProvider } from "./ARSessionProvider";
import { CameraFallbackARProvider } from "./CameraFallbackARProvider";

/**
 * Single shared instance — swap this export's construction for
 * `new ARKitSessionProvider()` / `new ARCoreSessionProvider()` (or a
 * `Platform.select` between them) once native AR is available. No
 * caller should need to change beyond this line, per the AR
 * Architecture contract.
 */
export const arSessionProvider: ARSessionProvider = new CameraFallbackARProvider();
