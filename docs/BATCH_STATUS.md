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
