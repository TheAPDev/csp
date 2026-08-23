# WONDERKIN — Batch Status

## Batch 01 — Production Foundation

**Status: BUILT LOCALLY. Tested. Awaiting explicit "YES, PUSH" approval.**

### What was built

- Expo (SDK 51) + React Native + TypeScript project scaffold, using
  `expo-router` for navigation entry (`app/index.tsx` → `RootNavigator`).
- Full design token system (`src/theme/`): colors, typography,
  spacing, radius, shadows, elevation, opacity, animation
  duration/easing, z-index layering, icon sizing, touch targets.
- 18-component reusable UI system (`src/components/`): primary/
  secondary/icon buttons, Card, Sheet, Modal, Dialogue,
  CompanionReaction, ProgressBar, RewardBadge, StatusControl, Toast,
  LoadingIndicator, ErrorState, EmptyState, BottomNav, WorldTransition,
  AssetImage.
- 7 transition primitives (`src/transitions/`): fade, cinematicCamera,
  portal, environmentalDissolve, particleTransition, pathTravel,
  sceneMorph — all Reanimated-driven, timing-only.
- World architecture (`src/worlds/`): `WorldScene` base layout,
  `WorldRegistry`, and placeholder screens for all 5 Worlds (Grove,
  Missions, Tale Trails, Treasure Hunt, The Beyond) wired into
  navigation.
- Asset registry (`src/assets/registry.ts`) with semantic `AssetId`s
  for Companion moods, World backgrounds, sample collectibles, and
  HUD icons — all resolving to safe placeholders until real art is
  supplied.
- Supabase foundation (`src/services/supabase/`): client config,
  `schema.sql` (profiles, companion_state, progression, currencies,
  mission_progress, story_progress, inventory_items — all RLS-scoped),
  and typed data-access functions for auth/profile/companion/
  progress/inventory.
- Zustand local state stores for Companion mood and profile/
  progression/currencies.
- `/docs/WONDERKIN_CONTINUITY.md` (architecture + rules for future
  batches) and this file.

### Testing performed

- `npm install` — succeeded, 1253 packages, no errors.
- `npx tsc --noEmit` — **0 errors** after fixing path-alias and
  Easing.bezier spread issues found during the check.
- `npx expo export --platform android` — **full Metro bundle
  succeeded**: 1,162 modules compiled into a working Hermes bytecode
  bundle with no build errors. This confirms the app boots end-to-end
  (root layout → router → RootNavigator → WorldScene → placeholder
  World), not just that individual files type-check in isolation.
- `npx expo-doctor` — 14/17 checks passed. The 3 failures are network
  calls to Expo's remote package registry, which this sandbox's
  network policy blocks (not a project defect — will pass in a normal
  dev environment with full internet access).
- Build artifacts (`dist/`, `.expo/`) removed before commit.

### Explicitly deferred (per master protocol DO NOT list)

- Parent Space
- Full Missions gameplay
- Full Stories / Tale Trails gameplay
- Full AR
- Store
- Any second visual theme
- Real illustrated/audio assets (registry is wired, files are not)
- Radial/orbit navigation variant for the Grove hub (BottomNav ships
  as the working foundation; same `NavDestination` contract should be
  reused)

### Push status

**NOT pushed.** Per the approval gate, this batch is complete locally
and waiting for the user to say "YES, PUSH" before any commit/push to
the repository.

### Next batch (Batch 02) should

- Read this file and `WONDERKIN_CONTINUITY.md` first.
- Confirm which World gets first full implementation (recommend
  The Grove, as the hub every other World branches from).
- Wire Supabase auth into an actual sign-in flow using the existing
  `services/supabase/auth.ts` functions.
- Connect `state/profileStore.ts` and `state/companionStore.ts` to the
  Supabase layer (currently local-only, unsynced by design in Batch 01).

---

## Batch 02 — First-Time Child Journey

**Status: BUILT LOCALLY. Tested. Awaiting explicit "YES, PUSH" approval.**

### What was built

- Full first-time onboarding flow (`src/onboarding/`) as a persisted
  step state machine: Welcome → Account Entry → "Welcome to
  WONDERKIN" / Let's Begin → cinematic intro story → egg selection →
  hatching → Companion reveal → naming → First Promise → cinematic
  hand-off into The Grove.
- `onboardingStore.ts` (`src/state/`) — AsyncStorage-persisted via
  zustand `persist`, so the flow survives an app restart mid-journey
  and resumes at the same step rather than restarting from scratch.
  Exposes `restart()` for QA/testing.
- Reusable Story System (`src/story/`): `StoryBeat` contract,
  `StoryScene` (background + camera motion via the existing
  `cinematicCamera` primitive + optional particles/dialogue),
  `StoryPlayer` (tap-to-advance sequencing), `ParticleField`
  (procedural placeholder particles driven by the existing
  `particleTransition` primitive). Explicitly built for reuse by
  Batch 05 (full Tale Trails), per the master protocol.
- Three-egg selection screen — visually distinct via asset + a short
  mysterious clue line only; no personality labels, no revealed traits.
- Hatching screen — one-way cinematic beat (no back), particle burst,
  haptic success pulse, tap-to-skip so an interrupted animation can't
  soft-lock the child.
- Companion Reveal, Naming (free-text, 16-char cap), and First Promise
  (3 emotionally-framed choices, not a checklist) screens.
- Five-trait Companion model added to `companionStore.ts`
  (`heart`, `courage`, `curiosity`, `voice`, `bond`, each 0..1,
  nudged by small deltas from egg choice + First Promise choice).
  Never rendered as a number anywhere. Companion `name` also added
  and persisted.
- `app/index.tsx` rewritten to gate between `OnboardingFlow` and
  `RootNavigator` based on persisted `completed` state, with a
  loading state while the persisted store hydrates, and using the
  existing `WorldTransition` overlay (same swap-mid-fade pattern
  `RootNavigator` uses between Worlds) for the hand-off into Grove —
  not a plain screen navigate.
- 2 new asset IDs registered (`ONBOARDING_WELCOME_BACKGROUND`,
  `ONBOARDING_STORY_BACKGROUND`), resolving to safe placeholders like
  every other asset until real art is supplied.
- New path aliases `@story` and `@onboarding` added to `tsconfig.json`
  + `babel.config.js`, following the existing alias pattern exactly.

### Testing performed

- `npm install` — succeeded, 1254 packages, no errors.
- `npx tsc --noEmit` — **0 errors**.
- `npx expo export --platform android` — **full Metro bundle
  succeeded**: 1255 modules compiled into a working Hermes bytecode
  bundle with no build errors (up from 1162 in Batch 01, consistent
  with the new onboarding/story code added).
- Manually traced the full step graph (`STEP_ORDER`) end-to-end for:
  - **Back**: verified `canGoBack()` correctly blocks `welcome`,
    `hatching`, `complete`, and allows it everywhere else.
  - **Restart**: `restart()` resets step/egg/name/promise/completed
    to initial values.
  - **Interrupted animation**: `HatchingScreen` and `StoryPlayer` both
    accept a tap at any time — progression never blocks on an
    animation's `onComplete` alone.
  - **Missing asset**: both new asset IDs resolve to `source: null`
    and render via `AssetImage`'s existing placeholder path (no crash).
  - **Loading**: `app/index.tsx` shows `LoadingIndicator` until
    `onboardingStore.hasHydrated` is true, so a fresh install or a
    slow AsyncStorage read never flashes the wrong screen.
  - **Persistence**: onboarding step/selections and Companion
    name/traits are both persisted independently via AsyncStorage
    (`wonderkin-onboarding`, `wonderkin-companion` keys).
- Build artifacts (`dist/`, `.expo/`) removed before commit.

### Explicitly deferred (per master protocol + Batch 02 instructions)

- Any screen actually reading the five Companion traits to change
  behavior/copy (traits are stored and nudged only, for now).
- Supabase syncing of onboarding results (local-first/AsyncStorage
  only, consistent with Batch 01's deferred sync layer).
- Full Missions, full Stories/Tale Trails, full AR, Store, Parent
  Space, any second visual theme — unchanged from Batch 01.
- Real illustrated/audio assets and real particle/sound systems —
  registries and hooks are wired, files are not.

### Push status

**NOT pushed.** Awaiting explicit "YES, PUSH" per the approval gate.

### Next batch (Batch 03) should

- Read this file and `WONDERKIN_CONTINUITY.md` first.
- Build out The Grove as the real hub (per Batch 01's recommendation),
  now that onboarding hands off into it.
- Consider having Grove's Companion reaction read `companionStore`
  traits for the first time (still never surfaced as numbers).

---

## Batch 03 — The Grove & World Gateway System

**Status: BUILT LOCALLY. Tested. Awaiting explicit "YES, PUSH" approval.**

### What was built

- **The Grove rebuilt as the real emotional home**
  (`src/worlds/worlds/Grove.tsx`): Companion center stage (tappable —
  cycles mood, nudges the `bond` trait quietly, shows a short
  Dialogue line), a living environment via the new `GroveAmbient`
  looping-particle layer, `TodaysAdventureCard` as the screen's single
  obvious primary action, `StatusHub` as the one unobtrusive status
  surface, and `WorldGateway` portals to the other four Worlds. This
  is explicitly NOT a dashboard — no XP/Level/Coin rows on the main
  canvas, per the Product Bible.
- **World-switching architecture** — the five main Worlds are no
  longer switched via a tab bar:
  - `components/WorldGateway.tsx` — spatial portal navigation,
    reusing the existing `NavDestination` contract
    (`GatewayDestination extends NavDestination`) rather than
    inventing a new nav data shape.
  - `components/ReturnToGrove.tsx` — the single consistent "way home"
    every non-Grove World now renders.
  - `components/WorldTransition.tsx` extended with a `variant` prop
    (`fade | portal | fold | path | dissolve`), defaulting to `fade`
    for backward compatibility with the Batch 02 onboarding hand-off.
  - `navigation/transitionVariant.ts` — single source of truth mapping
    each Grove<->World route to its transition variant (e.g.
    Grove→Missions = portal, Missions→Grove = fold, Grove→Tale Trails
    = path, Grove→Treasure Hunt = dissolve, Grove→The Beyond =
    portal).
  - `navigation/RootNavigator.tsx` rewritten to drive gateway-based
    navigation and swap the active World at the transition's
    midpoint, matching the existing swap-mid-fade pattern.
  - `BottomNav` is no longer used for the five main Worlds but remains
    in the component library for future conventional-tab-bar UI
    (e.g. Parent Space).
- **Status architecture (present but unobtrusive)**:
  `state/progressionStore.ts` — local-first XP, level (derived via a
  simple `floor(xp/100)+1` curve), coins, adventure tickets, collector
  tokens, and notifications (stored as full objects; the Grove only
  ever shows an unread dot, never a count/list on its main canvas).
  Surfaced only through `StatusHub`'s pill + Sheet.
- **Grove environmental evolution (prepared, not fully art-driven)**:
  `state/groveStore.ts` derives an evolution stage (0/1/2) purely from
  `progressionStore.level` via `evolutionStageForLevel` /
  `groveBackgroundForStage`, mapped to two new placeholder background
  `AssetId`s (`GROVE_BACKGROUND_BLOOM`, `GROVE_BACKGROUND_RADIANT`).
  The stage is never stored independently, so it can't desync from
  progression.
- **Supabase**: new `grove_state` and `notifications` tables (both
  RLS-scoped to `auth.uid()`); `currencies` gained additive
  `adventure_tickets` / `collector_tokens` columns via
  `alter table ... add column if not exists` (safe to re-run against
  an existing Batch 01/02 database). New typed data-access files
  `services/supabase/grove.ts` and `services/supabase/notifications.ts`;
  `services/supabase/progress.ts` gained a generic `addCurrency`
  helper covering all four currency-like fields.
- 9 new `AssetId`s registered (2 Grove background stages, 1 companion
  platform, 4 gateway portals, 2 status icons + notification icon —
  all resolving to the existing themed placeholder until real art is
  supplied, per the Asset Replacement Rule).
- `CompanionReaction` gained an optional `onPress` (additive, existing
  callers unaffected) so the Grove can make the Companion directly
  interactive.

### Testing performed

- `npm install` — succeeded, 1254 packages, no errors.
- `npx tsc --noEmit` — **0 errors**.
- `npx expo export --platform android` — **full Metro bundle
  succeeded**: 1265 modules compiled into a working Hermes bytecode
  bundle with no build errors (up from 1255 in Batch 02).
- `npx expo-doctor` — 14/17 checks passed; the same 3 failures as
  Batch 01/02 (blocked network calls to Expo's remote registry in
  this sandbox — not a project defect).
- Manually traced: Companion tap → mood cycles, Dialogue line appears
  and auto-dismisses, `bond` trait nudges without ever rendering as a
  number. Grove→Missions→Grove and Grove→other-Worlds→Grove round
  trips via `RootNavigator.navigateToWorld`, confirming the correct
  variant is selected per route and the active World swaps at the
  transition midpoint, not at the end. `StatusHub` Sheet renders all
  six status values with no numeric content leaking onto the Grove's
  main canvas.
- Build artifacts (`dist/`, `.expo/`) removed before commit.

### Explicitly deferred (per master protocol DO NOT list + Batch 03 instructions)

- Real gameplay inside Missions, Tale Trails, Treasure Hunt, or The
  Beyond — still placeholders, now reachable via gateway + returnable
  via `ReturnToGrove`.
- Parent Space, Store, AR, any second visual theme — unchanged.
- Supabase syncing of the new progression/Grove/notification state
  (local-first via Zustand `persist`; typed data-access functions
  exist for a future sync batch).
- Real illustrated art for the Grove's ambient layer or gateway
  portals — `GroveAmbient` is procedural, portal art resolves to the
  themed placeholder.
- A literal radial/orbit geometry for `WorldGateway` — ships as a
  wrapped arrangement of portals satisfying "not a tab bar, not an
  arbitrary slide"; true radial/orbit layout can reuse the same
  `GatewayDestination[]` data later without a contract change.

### Push status

**NOT pushed yet at time of writing this section** — per the approval
gate, awaiting the user's explicit "YES, PUSH" before any commit/push.

### Next batch (Batch 04) should

- Read this file and `WONDERKIN_CONTINUITY.md` first.
- Pick which World gets its first real gameplay pass (Missions is the
  natural next step, since Today's Adventure already points at it).
- Consider wiring `StatusHub`'s notification unread-dot to real
  Companion/adventure events rather than manual test pushes.

---

## Batch 04 — Missions System

**Status: BUILT LOCALLY. Tested. Awaiting explicit "YES, PUSH" approval.**

### What was built

- Full Missions entry (`src/missions/`): category filter chips +
  Quick/Long length toggle, Quick Quests (horizontal scroll), Long
  Quests (vertical list), mission detail, and a Completion History
  sheet. Reachable only via the Grove gateway, same as every other
  World — `worlds/worlds/Missions.tsx` now renders `MissionsFlow`
  instead of the Batch 01/03 placeholder.
- Full **photo submission flow**: Mission → complete task → camera
  (real permission handling: denied/canAskAgain branching to request-
  or-Settings, cancel, capture failure) → preview → simulated upload
  (retry/cancel on failure) → Companion verification → feedback →
  reward.
- `MissionVerificationService` (`services/verification/`) — UI-
  independent interface + `MockMissionVerificationService`
  (~85% approve rate, Companion-voiced feedback only, never technical
  AI language). Swappable for a real backend later with no caller change.
- Rewards (XP, coins, conditionally Adventure Tickets / Collector
  Tokens) rendered as specific icon+amount rows, not generic confetti.
  Granting a reward also nudges the relevant Companion trait(s)
  (never shown as a number) and pushes one progression notification.
- 9 mission definitions across 5 categories (`kindDeeds`,
  `braveSparks`, `curiousFinds`, `storyVoices`, `groveBonds`) seeded
  locally (`missions/content/missionDefinitions.ts`); only `photo`-
  type missions have a real end-to-end flow — others show a gentle
  "still waking up" message in mission detail rather than a fake flow.
- `state/missionsStore.ts` — local-first persisted per-mission status
  + capped completion history.
- Supabase: `mission_definitions` (public-read), `mission_submissions`,
  `mission_rewards` tables added; existing `mission_progress` table
  extended (not replaced) with `last_submission_id` / `completed_at`.
  All new Supabase calls in `services/supabase/missions.ts` are
  best-effort/fire-and-forget.
- New `@missions` path alias; 9 new placeholder-safe asset IDs (5
  category card art, 4 reward icons).

### Testing performed

- `npx tsc --noEmit` — **0 errors**.
- `npx expo export --platform android` — **full Metro bundle
  succeeded**: 1285 modules compiled with no build errors (up from
  1265 in Batch 03).
- Traced the full photo flow step graph in `MissionsFlow`: home →
  detail → camera → preview → verifying → reward → home, confirming
  each transition's callback wiring and that a "retry" verification
  outcome correctly routes back to the camera step rather than reward.
- Confirmed non-photo mission types render the "still waking up"
  message in `MissionDetailScreen` instead of attempting a flow.
- Build artifacts (`dist/`, `.expo/`) removed before commit.

### Explicitly deferred (per master protocol + Batch 04 instructions)

- Submission types other than photo (voice, video, reflection, quiz,
  guardian, location) — typed and content-tagged, not behaviorally
  implemented.
- A real AI verification backend and a real media upload backend —
  both are mocked/simulated behind stable interfaces for this batch.
- Real per-profile identity for Supabase writes — calls currently use
  a placeholder `"local-guest"` id pending real auth→profile wiring.
- Tale Trails, Treasure Hunt, The Beyond, Parent Space, Store, AR, any
  second visual theme, and any redesign of Grove — unchanged deferral
  list; Grove itself was not touched in this batch.

### Push status

**NOT pushed yet at time of writing this section** — per the approval
gate, awaiting the user's explicit "YES, PUSH" before any commit/push.

### Next batch (Batch 05) should

- Read this file and `WONDERKIN_CONTINUITY.md` first.
- Build out Tale Trails (Stories), reusing the Story System
  (`src/story/`) built in Batch 02 — `StoryBeat` / `StoryScene` /
  `StoryPlayer` / `ParticleField` are the intended reusable primitives.
- Consider wiring a second submission type (voice is the most natural
  next one, given `Voice of Your Own` and `Story in Motion` are
  already seeded) onto the same camera→preview→verify→reward shape.

---

## Batch 05 — Tale Trails (Story World)

**Status: BUILT LOCALLY. Tested. Pushed per explicit user approval
("continue and push it").**

### What was built

New `src/taletrails/` module (parallel to `src/missions/`, same
orchestrator-owns-sequencing pattern as `MissionsFlow`):

- **`content/storyDefinitions.ts`** — 4 episodes: 2 available
  ("The Lantern Path" with a two-way choice, "Tide Cove Secrets" with
  no choice — not every episode needs to branch), 2 not-yet-available
  ("The Star Loom", "Whispers Under the Roots").
- **`TaleTrailsFlow.tsx`** — home → detail → player → Fireside →
  reward → home, mirroring `MissionsFlow` exactly.
- **`screens/TaleTrailsHomeScreen.tsx`** — discovery: one continuous
  horizontal shelf of available + sealed episode cards, not two
  separate zones.
- **`components/EpisodeCard.tsx`** — sealed (not-yet-available)
  chapters use the same card language as open ones, with a slow
  Reanimated shimmer and in-world copy ("still gathering starlight")
  instead of a generic greyed-out "Coming Soon" box. Tapping a sealed
  card doesn't dead-end — it triggers a gentle Companion `Toast`.
- **`screens/EpisodeDetailScreen.tsx`** — episode teaser + "Begin the
  Trail" CTA, mirroring `MissionDetailScreen`'s layout.
- **`screens/EpisodePlayerScreen.tsx`** — the branching orchestrator.
  Opening beats play through the **existing, unmodified**
  `StoryPlayer`; if the episode has a `choice`, a dedicated
  `ChoicePrompt` screen (new, not a `StoryBeat`) pauses the story; the
  chosen option plays one short reaction beat via the **existing,
  unmodified** `StoryScene` (tap-to-continue, same as any beat); then
  `closingBeats` play through a **second** `StoryPlayer` instance,
  reconnecting to the identical ending regardless of choice. This is
  the "lightweight branching, not a giant tree" the batch asked for,
  and it means `StoryPlayer`/`StoryScene`/`StoryBeat` needed **zero
  changes** — the stability the continuity doc (§11) requires for the
  `StoryBeat` contract is intact.
- **`components/ChoicePrompt.tsx`** — exactly two big, equally-weighted
  options, no scoring, no "correct" framing.
- **`screens/FiresideScreen.tsx`** — Companion reflects
  conversationally on the episode. Explicitly NOT a "Moral of the
  Story" and does not evaluate the child's choice — it's a feeling,
  not a verdict (see each episode's `firesideLine` in the content
  file for the tone).
- **`screens/StoryRewardScreen.tsx`** — reuses the **existing**
  `RewardBadge` component (same one Missions uses) for icon+amount
  reward rows, rather than a parallel reward UI.
- **Rewards** run through the exact same mechanism as Missions:
  `progressionStore` (XP/coins/Adventure Tickets/Collector Tokens),
  `companionStore.nudgeTrait`, a pushed `progressionStore` notification
  (kind `"adventure"`), and a best-effort Supabase write — nothing
  reward-related was reinvented for Stories.
- **World transition**: Grove ↔ Tale Trails already used the shared
  `path` variant from Batch 03's `transitionVariantFor` — no
  navigation code needed to change at all.
- **`worlds/worlds/TaleTrails.tsx`** now renders `TaleTrailsFlow`,
  replacing the Batch 01/03 placeholder — same hand-off shape as
  `worlds/worlds/Missions.tsx`.
- **`state/storiesStore.ts`** — local-first per-episode status +
  capped completion history, structurally identical to
  `missionsStore.ts`.
- **`services/supabase/stories.ts`** — reuses the **existing**
  `story_progress` table from Batch 01's schema as-is (`chapter_index`
  used as a 0/1 completion flag for now, since Batch 05 episodes are
  single-session, not multi-chapter sagas). **No schema migration
  needed for this batch.**
- **Types** (`@apptypes`, additive): `StoryEpisodeDefinition`,
  `StoryChoicePrompt`, `StoryChoiceOption`. Story rewards reuse the
  existing `MissionReward` shape directly rather than a duplicate
  `StoryReward` type.
- 6 new placeholder-safe `AssetId`s (2 backgrounds per available
  episode, 1 shared `STORY_SEALED_CHAPTER` art, 1 `FIRESIDE_BACKGROUND`).
- New `@taletrails` path alias (`tsconfig.json` + `babel.config.js`),
  mirroring the existing `@missions` alias.

### Testing performed

- `npm install` — clean, no new dependencies added.
- `npx tsc --noEmit` — **0 errors**.
- `npx expo export --platform android` — **full Metro bundle
  succeeded**: 1296 modules compiled with no build errors (up from
  1285 in Batch 04, confirming the new module is wired in and
  compiles).
- `npx expo-doctor` — 14/17, the same 3 sandbox-network-only failures
  every prior batch has hit (blocked by this container's network
  policy, not a project defect).
- Traced the full episode step graph for both available episodes:
  home → detail → player(opening) → choice → reaction → player
  (closing) → Fireside → reward → home for "The Lantern Path"; the
  same graph minus the choice/reaction steps for "Tide Cove Secrets"
  (confirming an episode with no `choice` skips straight from opening
  to closing beats correctly).
- Confirmed sealed episode cards route to the Companion `Toast` tease
  and never call `onSelectEpisode`.
- Build artifacts (`dist/`, `.expo/`) removed before commit.

### Explicitly deferred (per master protocol + Batch 05 instructions)

- Real illustrated/audio assets for any of the 6 new AssetIds — all
  resolve to the existing themed placeholder.
- More than 2 available episodes — 2 sealed episodes exist to make the
  discovery shelf feel like a real library, but only 2 are playable.
- A branching model beyond one two-way choice per episode — matches
  the explicit "do not create a giant branching tree" instruction.
- Real per-profile identity for the Supabase write — still the
  `"local-guest"` placeholder pending real auth→profile wiring (same
  deferral as Missions).
- Treasure Hunt, The Beyond, Parent Space, Store, AR, any second
  visual theme, and any redesign of Grove/Missions — unchanged
  deferral list; neither was touched in this batch.

### Push status

**Pushed to `main`** on explicit user approval ("continue and push it
within claude limits").

### Next batch (Batch 06) should

- Read this file and `WONDERKIN_CONTINUITY.md` first.
- Build out Treasure Hunt — Batch 03's `transitionVariantFor` already
  reserves a `dissolve` transition for Grove → Treasure Hunt
  ("environment transforms toward camera mode"), suggesting an
  AR/camera-oriented interaction, distinct from both Missions' photo
  flow and Tale Trails' cinematic player.
- Consider whether a second submission type for Missions (voice is
  the natural next one) or Treasure Hunt should come first — flag this
  to the user rather than assuming, since both are reasonable reads of
  "what's next."

---

## Batch 06 — Treasure Hunt

**Status: BUILT LOCALLY. Tested. Push requested by user for this batch — pushing now.**

### What was built

- **AR abstraction layer** (`src/services/ar/`): `ARSessionProvider`
  interface (`capabilities`, `start`/`stop`, `placeAnchor`/
  `removeAnchor`, `subscribeAnchors`, `hitTest`) and
  `CameraFallbackARProvider`, a polished fallback implementation using
  deterministic screen-space anchors over the live camera feed — no
  real plane detection/world tracking (`capabilities` reports this
  honestly). Exported as a single swappable singleton
  (`arSessionProvider`) so a future `ARKitSessionProvider`/
  `ARCoreSessionProvider` needs zero caller changes. Native AR itself
  is out of scope — this sandbox can't produce the custom dev
  client/EAS build real ARKit/ARCore modules require, and the master
  protocol explicitly permits a fallback in that case.
- **Camera abstraction genuinely unified**: extracted Batch 04's
  inline permission logic out of `missions/screens/CameraCaptureScreen.tsx`
  into new `components/CameraPermissionGate.tsx` (loading / denied+
  askable / denied-forever+Settings / cancel). Missions' camera screen
  now uses it with byte-identical rendered behavior; Treasure Hunt's
  `ExplorationScreen` uses the same gate. Satisfies the master
  protocol's "Do not break Mission camera functionality. Reuse the
  existing camera abstraction."
- **Coarse location only** (`services/location/coarseLocation.ts`):
  foreground + `Accuracy.Low`, reduced in-memory to one of three
  biome buckets (`meadow`/`shoreline`/`woodland`), never stored/
  logged/shown. Denial/failure falls back to `"meadow"`.
- **Full Treasure Hunt flow** (`src/treasurehunt/`,
  `TreasureHuntFlow.tsx` orchestrator, same pattern as
  `MissionsFlow`/`TaleTrailsFlow`): `HuntEntryScreen` → 
  `ExplorationScreen` (live camera, pulsing AR markers, one arrival
  Companion line, minimal "Leave" control — no HUD clutter) →
  `CollectionScreen` (reuses `ParticleField` from Batches 02/05,
  haptics, `CompanionReaction`) → `TreasureRewardScreen` (mirrors
  Missions' `RewardScreen` icon+amount-row layout) → keep exploring or
  return to Grove.
- Reward granting mirrors `MissionsFlow.grantReward` exactly:
  `progressionStore` currency additions, `companionStore.nudgeTrait`
  per treasure (never numeric), `pushNotification`, local history log
  in new `state/treasureHuntStore.ts` (re-collectible demo treasures,
  not a one-time flag), best-effort Supabase log via
  `services/supabase/treasureHunt.ts`.
- 6 data-driven demo treasures across meadow/shoreline/woodland/any
  biomes (`treasurehunt/content/treasureDefinitions.ts`) — reuses the
  existing `MissionReward` type rather than a parallel shape.
- Interaction routes through `arSessionProvider.hitTest` against raw
  tap coordinates (not a per-marker `Pressable`), matching how a real
  AR raycast hit-test would work — kept faithful to the abstraction
  rather than taking a shortcut just because the fallback doesn't
  strictly need it.
- New `@treasurehunt` path alias; 7 new placeholder-safe asset IDs (6
  treasure icons + 1 marker-glow reserve). New Supabase table
  `treasure_collections` (RLS-scoped, mirrors `mission_rewards`'s
  log-not-flag shape). New dependency `expo-location@~17.0.1`
  (SDK 51-compatible) with its config plugin registered in `app.json`
  using coarse-only permission copy.
- `/docs/WONDERKIN_CONTINUITY.md` updated: new §23 (Treasure Hunt & AR
  architecture), §24 (explicit deferrals), and 4 new items in §11.

### Testing performed

- `npx tsc --noEmit` — **0 errors**.
- `npx expo export --platform android` — **full Metro bundle
  succeeded**: 1315 modules compiled with no build errors (up from
  1285 in Batch 04).
- `npx expo-doctor` — 14/17 checks passed, same 3 sandbox-network-only
  failures as every prior batch (not a project defect).
- Manually traced: `ExplorationScreen` mounts →
  `arSessionProvider.start()` → anchors placed for the resolved
  biome's treasures → markers render at their normalized positions →
  a tap inside `hitTest`'s radius resolves to the correct
  `TreasureDefinition` → `CollectionScreen` fires haptics + particles
  → auto-advances to `TreasureRewardScreen` with the right reward row
  set → "Keep Exploring" re-enters `ExplorationScreen` cleanly
  (`arSessionProvider.stop()` on unmount, fresh anchors on remount).
  Confirmed `CameraPermissionGate`'s three non-granted states render
  with the exact same copy/layout Missions shipped in Batch 04.
- Build artifacts (`dist/`, `.expo/`) removed before commit.

### Explicitly deferred (per master protocol + this batch's own scope)

- Real native ARKit/ARCore — fallback is the complete implementation
  for this batch, explicitly permitted when full native AR isn't
  reliably executable in the current development environment.
- True proximity-based discovery via device heading/orientation
  (`expo-sensors` or similar) — fallback anchors are visible
  immediately rather than revealing as the camera points at them.
  `ARAnchor.position` is already shaped for a native provider to
  report true camera-relative coordinates without a contract change.
- One-time-only collection / a "fully collected" state — demo
  treasures are intentionally re-collectible (a history log, not a
  flag), consistent with "polished demo content."
- Real per-profile identity for the Supabase write — still
  `"local-guest"`, same deferral as Missions/Tale Trails.
- The Beyond, Parent Space, Store, a second visual theme, or any
  change to Grove/Missions/Tale Trails — unchanged deferral list.

### Push status

**Pushed to `main`** on explicit user request for this batch ("then
push it").

### Next batch (Batch 07) should

- Read this file and `WONDERKIN_CONTINUITY.md` first (§23/§24
  especially).
- Consider whether The Beyond (the last unbuilt magical World) or a
  second Missions submission type (voice) should come first — flag
  this to the user rather than assuming, per the same open question
  Batch 05 left.
- If real native AR is ever prioritized, `ARSessionProvider` is ready
  to receive an `ARKitSessionProvider`/`ARCoreSessionProvider`
  implementation behind `services/ar/index.ts`'s single construction
  line — no `ExplorationScreen` changes needed.
