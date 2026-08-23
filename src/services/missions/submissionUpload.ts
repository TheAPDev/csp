/**
 * Simulates uploading a captured submission. There is no real media
 * backend yet, so this stands in for that network call — including
 * an occasional simulated failure — so the app's upload-failure /
 * retry handling is real, testable behavior rather than dead code
 * that only runs once a backend exists.
 */
export async function uploadMissionPhoto(_localUri: string): Promise<{ ok: true } | { ok: false }> {
  await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 500));
  const succeeded = Math.random() < 0.9;
  return succeeded ? { ok: true } : { ok: false };
}
