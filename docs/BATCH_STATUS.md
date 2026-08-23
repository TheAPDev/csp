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
