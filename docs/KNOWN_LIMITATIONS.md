# WONDERKIN — Known Limitations & Mock vs. Production Status

Every mocked/placeholder piece listed here is mocked **behind a real
interface** — the master protocol's "no fake APIs that require a
rewrite" rule was followed throughout Batches 01–09 (verified in this
audit, not just claimed). Swapping any of these for the real thing
means implementing that interface, not restructuring callers.

## Legend

- 🟢 **PRODUCTION READY** — real, tested, no known gap.
- 🟡 **MOCKED** — real interface, deliberately fake implementation
  behind it, documented swap point.
- ⚪ **PLACEHOLDER** — non-functional stand-in with no logic behind it
  yet (usually art/copy).
- 🔴 **EXTERNAL INTEGRATION REQUIRED** — cannot be completed without a
  third-party service, credential, or native module this environment
  can't provide.

## Core App Shell

| Item | Status | Notes |
|---|---|---|
| Navigation, World system, transitions | 🟢 | 7 Worlds, all reachable/returnable, all typechecked and bundle-tested |
| Design token system | 🟢 | Zero raw hex/hardcoded spacing found outside `theme/` in this audit |
| Local state persistence | 🟢 | 9 of 10 stores persist via AsyncStorage; survives restart/backgrounding |
| `profileStore.ts` | 🔴 dead code | Has `progression`/`currencies` fields that mirror `progressionStore` but are **never read or written anywhere** (confirmed by repo-wide grep in Batch 09's audit, reconfirmed this batch). Not an active bug, but a landmine — do not build on these fields; delete or wire them deliberately in a future batch, don't extend them by accident. |

## Auth / Identity

| Item | Status | Notes |
|---|---|---|
| Supabase schema + RLS | 🟢 | Real, matches client state shapes, policy-scoped to `auth.uid()` |
| Real sign-in flow | 🔴 EXTERNAL INTEGRATION REQUIRED | No batch built a login/signup screen. Every Supabase write in the app uses the literal string `"local-guest"` as `profile_id` (11 call sites, grepped this batch) instead of a real authenticated user id. |
| Supabase writes | 🟡 MOCKED (structurally real, never exercised live) | Every write is wrapped best-effort and never blocks the UI. The typed access layer is production-shaped but has never run against a live project with real auth — it's tested via `tsc`/bundle only, not integration-tested against Supabase. |

## AI Verification (Missions)

| Item | Status | Notes |
|---|---|---|
| `MissionVerificationService` interface | 🟢 | Clean interface (`verify(input) -> Promise<VerificationResult>`), zero technical AI language ever reaches the child |
| Verification logic | 🟡 MOCKED | `MockMissionVerificationService` returns a randomized approve/retry after an artificial delay — no real image/content analysis happens. |
| Failure/timeout handling | ⚪ gap found this batch | If the (mocked) verification promise never resolves, `VerificationScreen` has no timeout — it would sit on "Your Companion is looking closely…" indefinitely. Today's mock always resolves, so this has never surfaced in testing, but a real AI backend **will** occasionally time out or error, and this screen has no fallback path yet. Flagged, not fixed this batch (see rationale in `BATCH_STATUS.md`). |
| 🔴 EXTERNAL INTEGRATION REQUIRED | — | A real vision/content-moderation API + credentials to replace the mock. |

## AR (Treasure Hunt)

| Item | Status | Notes |
|---|---|---|
| `ARSessionProvider` interface | 🟢 | Clean contract (`ARCapabilities`, `ARAnchor`, `ARHitTestResult`) a real ARKit/ARCore provider can implement without touching callers |
| `CameraFallbackARProvider` | 🟡 MOCKED | Live rear camera feed, but placement is deterministic screen-space points (seeded by a string hash), **not** real plane detection or world tracking. This is the explicitly-sanctioned "polished camera fallback mode," not a bug. |
| Camera permission handling | 🟢 | Dedicated `CameraPermissionGate` covers denied/can't-ask-again/loading states, reused identically by Missions and Treasure Hunt |
| 🔴 EXTERNAL INTEGRATION REQUIRED | — | Native ARKit (iOS) / ARCore (Android) modules to implement real world tracking. |

## Location (Treasure Hunt)

| Item | Status | Notes |
|---|---|---|
| Coarse-location biome flavoring | 🟢 | Real `expo-location` foreground request, immediately reduced to one of 3 biome buckets in memory, never stored/logged/shown — matches the master protocol's location rule exactly. Permission denial falls back to a default biome rather than blocking the World. |

## Content

| Item | Status | Notes |
|---|---|---|
| All narrative/mission/story/region copy | ⚪ PLACEHOLDER (final-quality copy, not final art) | Every batch wrote real, in-voice copy — this is not lorem ipsum — but no illustrated art, audio, or licensed display typeface exists anywhere. Every visual asset resolves through `AssetImage` to a themed placeholder block. See `ASSET_REPLACEMENT_GUIDE.md`. |
| Reward economy (coins/tickets/tokens/XP) | 🟢 | Fully wired, currency-safe (client + DB constraints), no path from money to XP |
| Vault redemption fulfillment | 🔴 EXTERNAL INTEGRATION REQUIRED | `ParentHandoffScreen` only logs a `redemption_requests` row — there is no Parent Space to view/fulfill it (explicitly out of scope per every batch's instructions, including this one: "Do not add Parent Space"). No real-money or physical-fulfillment logic exists anywhere, by design. |

## Accessibility

| Item | Status | Notes |
|---|---|---|
| `accessibilityRole`/`accessibilityLabel` on interactive elements | 🟢 (after this batch) | Audited every `Pressable` in the app (22 total); found and fixed 2 missing on `MissionsHomeScreen`'s filter chips (now have role, label, and `accessibilityState.selected`). |
| Screen reader flow, dynamic type, reduced motion | 🔴 not audited | No batch has tested with VoiceOver/TalkBack live, or verified behavior under the OS "reduce motion" accessibility setting (the app leans heavily on Reanimated transitions). Flagged as untested, not confirmed broken. |

## Testing

| Item | Status |
|---|---|
| `tsc --noEmit` | 🟢 0 errors, verified this batch |
| `expo export` (Android + iOS) | 🟢 clean bundle both platforms, verified this batch |
| `npm run lint` | 🔴 non-functional | Found this batch: `package.json` has a `lint` script (`eslint . --ext .ts,.tsx`) but **no ESLint config file exists anywhere in the repo**, and `eslint` isn't even a listed `devDependency` — running it installs a fresh ESLint 10 which then fails immediately with no config found. No prior batch ever actually ran lint; `tsc` + bundle export have been the only automated checks. Left undocumented-no-longer but unfixed this batch — adding a real config is a real (if small) decision about lint rules that deserves its own review, not a rushed addition inside a QA batch. |
| `expo-doctor` | 🟡 14/17 — the 3 failures are this sandbox's network policy blocking Expo's remote registry, not project defects (consistent across every batch) |
| Unit/integration test suite | 🔴 none exists | No batch added Jest/RNTL tests. All verification to date is `tsc` + bundle export + manual code-path tracing documented in each batch's `BATCH_STATUS.md` entry. A real pre-launch QA pass should add automated tests, especially around the reward/currency-safety logic in Closet/Vault. |
| Device/simulator testing | 🔴 none | This sandbox has no iOS/Android runtime — every batch's "testing" is static (typecheck + bundle), never an actual running app on a device or simulator. This is the single biggest gap between "builds clean" and "confirmed working" in the entire project. |
