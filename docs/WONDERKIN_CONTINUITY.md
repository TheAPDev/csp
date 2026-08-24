# WONDERKIN — Continuity Document

**Read this before writing any code.** This file is the single source
of truth for architecture, conventions, and rules every future batch
(and every future Claude session) must follow. If your plan conflicts
with anything here, STOP and ask the user — do not silently redesign.

---

## 1. Technology Stack

- **React Native + Expo (SDK 51) + TypeScript**, using `expo-router`
  for file-based navigation at the `app/` root.
- **Supabase** for auth, database, and future storage.
- **Zustand** for local client state (`src/state/`).
- **react-native-reanimated** for all animation/transition timing.
- **expo-haptics** for touch feedback on primary/secondary actions.

This is a **mobile-first, real native app** — not a web-only build.
Do not introduce web-only APIs (e.g. `localStorage`, DOM events)
anywhere in `src/` or `app/`.

## 2. Project Structure

```
app/                      expo-router routes (entry: app/index.tsx)
src/
  theme/                  Design tokens — colors, type, spacing, etc.
  components/             Reusable component system (see §4)
  transitions/            Reusable transition primitives (see §5)
  worlds/                 World/scene architecture (see §6)
  assets/                 Asset registry + real asset files (see §7)
  navigation/             RootNavigator + nav types
  services/supabase/      Supabase client + typed data access (see §8)
  state/                  Zustand stores
  types/                  Shared TypeScript types
docs/
  WONDERKIN_CONTINUITY.md This file
  BATCH_STATUS.md         What's built, what's next
```

Path aliases (see `tsconfig.json` + `babel.config.js`):
`@theme`, `@components`, `@transitions`, `@worlds/*`, `@assets/*`,
`@navigation/*`, `@services/*`, `@state/*`, `@apptypes`.

> Note: the alias is `@apptypes`, not `@types` — `@types` collides
> with TypeScript's own `@types/*` package convention and produced a
> compiler error (TS6137) when used. Do not rename it back.

## 3. Design Tokens (`src/theme/`)

All visual values MUST come from `src/theme`. Never hardcode a hex
color, raw pixel spacing value, or font size inside a component.

- **Palette**: deep bluish "night-storybook" foundation
  (`midnight900`→`midnight500`) with **restrained, muted jewel-tone**
  accents (amethyst, sapphire, emerald, ruby, topaz). No rainbow
  saturation, no neon, no generic SaaS blues/purples.
- **Typography**: `display` (storybook headers) / `body` (legible for
  ages 6–9) / `mono`. Font family is currently system font —
  swap in a licensed display face later via `src/theme/typography.ts`
  only.
- **Spacing**: 4px-based scale (`xs`=4 … `huge`=64).
- **Radius**: `sm`=8 → `pill`=999. WONDERKIN favors soft, rounded
  shapes throughout (see Card, buttons, Sheet).
- **Shadows/Elevation**: soft, cinematic, low-contrast. Never a hard
  drop shadow. `shadows.glow` exists for Companion/reward emphasis.
- **Animation**: `duration.*` and `easing.*` — favor slower, more
  cinematic pacing than typical mobile apps. `duration.worldTransition`
  (900ms) is reserved for World-to-World transitions specifically.
- **Touch targets**: minimum 48px, comfortable 56px, primary CTA 64px
  — required for the 6–9 age target (see Child UX Rules, §10).

**Do not** add a second color palette, a second spacing scale, or a
parallel typography system for a "different" World. Worlds may vary
their *background art* and *narrative tone*, never the token system.

## 4. Component System (`src/components/`)

Single import surface: `src/components/index.ts`. Current inventory:

`PrimaryButton`, `SecondaryButton`, `IconButton`, `Card`, `Sheet`,
`WonderkinModal` (exported from `Modal.tsx`), `Dialogue`,
`CompanionReaction`, `ProgressBar`, `RewardBadge`, `StatusControl`,
`Toast`, `LoadingIndicator`, `ErrorState`, `EmptyState`, `BottomNav`,
`WorldTransition`, `AssetImage`, `StatusHub`, `GroveAmbient`,
`WorldGateway`, `TodaysAdventureCard`, `ReturnToGrove` (last five
added Batch 03 — see §17).

**Rule**: before adding a new component, check this list. If an
existing component covers the need (even with new props), extend it
— do not create a near-duplicate.

`BottomNav` takes a generic `NavDestination[]` + `activeKey` +
`onSelect` contract. A future **radial/orbit nav** for the Grove hub
should consume the *same* `NavDestination` shape rather than invent a
new data contract.

## 5. Transition Primitives (`src/transitions/`)

Each primitive is a pure function `(progress: SharedValue<number>,
config?) => void` that drives a Reanimated shared value via
`withTiming`/`withSequence`. Available: `fade`, `cinematicCamera`,
`portal`, `environmentalDissolve`, `particleTransition`, `pathTravel`,
`sceneMorph`.

They own **timing/easing only** — rendering the visual result (e.g.
`WorldTransition` component, future particle renderer) is a separate
concern. Future batches building AR, particle systems, or new World
transitions should call these primitives rather than writing new
`withTiming` calls inline.

## 6. World System (`src/worlds/`)

- `WorldScene.tsx` — base layout every World renders through
  (background layer + content layer, both token-driven).
- `WorldRegistry.ts` — central registry of `WorldId` → display name +
  background asset ID. **Register new Worlds here first.**
- `worlds/*.tsx` — one file per World. Batch 01 ships **placeholder**
  screens for all five Worlds (Grove, Missions, Tale Trails, Treasure
  Hunt, The Beyond) so navigation and the World system are provably
  wired end-to-end. None of them have real gameplay yet — that is
  intentionally out of scope per the batch rules.

**WONDERKIN is one world; these are wings of it**, per the master
protocol. Do not give a World its own color palette, its own button
style, or its own navigation chrome. A World may only vary:
background art, narrative copy, and which primitives/components it
composes.

## 7. Asset System (`src/assets/`)

`registry.ts` maps semantic `AssetId`s (e.g. `COMPANION_IDLE`,
`GROVE_BACKGROUND`, `EGG_ONE`) to a `require()`d source. **No
component or business logic may reference a raw filename.** Always go
through `getAsset(id)` or the `<AssetImage id={...} />` component.

Until real art exists, every registry entry resolves to `source:
null`, and `AssetImage` renders a themed placeholder block instead of
crashing. When real art is supplied:

1. Drop the file into `src/assets/images/` or `src/assets/audio/`.
2. Add a literal `require("./images/x.png")` in `registry.ts` (must
   be a static literal — Metro cannot resolve dynamic `require()`
   paths).

This keeps business logic decoupled from any specific temporary or
final graphic, per the Asset Replacement Rule in the master protocol.

## 8. Supabase Foundation (`src/services/supabase/`)

- `client.ts` — configured Supabase client using
  `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` env
  vars (see `.env.example`). Warns to console if unset; does not
  crash.
- `schema.sql` — foundation tables only: `profiles`,
  `companion_state`, `progression` (XP/level), `currencies`,
  `mission_progress`, `story_progress`, `inventory_items`. All have
  Row Level Security scoped to `auth.uid()`. Run this in the
  Supabase SQL editor for a new project, or via migrations.
- `auth.ts`, `profile.ts`, `companion.ts`, `progress.ts`,
  `inventory.ts` — typed data-access functions. Gameplay-complete
  logic (full mission trees, story chapter unlock rules, treasure map
  state machines) is **not** implemented yet — these are read/write
  primitives for future batches to build on.

Local-first state (`src/state/companionStore.ts`,
`src/state/profileStore.ts`) is kept separate from the Supabase layer
so the app is never blocked by network calls; sync logic connecting
the two is a future batch's responsibility.

## 9. Navigation (`src/navigation/RootNavigator.tsx`)

Minimal shell: renders the active World inside `WorldScene`, a
`BottomNav` built from `WorldRegistry`, and triggers `WorldTransition`
on switch. This is deliberately simple — it is the foundation a
radial Grove-hub nav, deep linking, and modal flows (Parent Space,
Store) will extend in later batches, not a finished nav system.

## 10. Child UX Rules (must hold on every screen)

1. One primary action per screen.
2. Progressive disclosure — don't reveal complexity upfront.
3. No unexplained icons — pair icons with labels or Companion cues.
4. Companion reactions can teach mechanics contextually.
5. Sound-off mode must remain understandable (no audio-only cues).
6. Reading stays simple — short, plain language.
7. Keep navigation depth from the Grove low.
8. No unnecessary numerical overload (see `StatusControl` — compact,
   not a stats dashboard).
9. No visible school-style correctness grading.
10. No streak anxiety / FOMO mechanics.

## 11. What Future Sessions MUST NOT Change

- The token system's *structure* (file names, the `theme` export
  shape) — extend values, don't restructure.
- The `AssetId` → `require()` indirection pattern in `assets/registry.ts`.
- The `NavDestination` contract used by `BottomNav`.
- The `WorldScene` base layout contract (background layer +
  content layer).
- The transition primitive signature
  `(progress: SharedValue<number>, config?) => void`.
- RLS-scoped-to-owner pattern in Supabase tables.
- The `@apptypes` alias name (not `@types`).
- The `StoryBeat` contract (`src/story/types.ts`) — Batch 05 depends
  on this shape being stable, and Batch 05 itself changed nothing in
  it, proving the contract holds: branching was built entirely at the
  orchestration layer (`taletrails/screens/EpisodePlayerScreen.tsx`)
  by sequencing two `StoryPlayer` instances around a separate
  `ChoicePrompt` screen.
- The `onboardingStore` `STEP_ORDER` sequencing and persisted-field
  shape — extend with new steps if needed, don't reorder/rename
  existing ones without checking `NO_BACK_STEPS` and `app/index.tsx`.
- The rule that Companion traits (`CompanionTraits`) are never
  rendered as a visible number/score.
- The `MissionVerificationService` interface shape
  (`services/verification/MissionVerificationService.ts`) — a real AI
  backend must implement `verify()` with the same signature, so no
  screen needs to change when it's swapped in.
- Mission category labels (`categoryLabel`) must stay flavor words,
  never a literal trait name — that reads as a school-style score.
- The Grove's single-status-surface rule — `StatusHub` is the only
  place XP/Level/Coins/Adventure Tickets/Collector Tokens/
  Notifications render; don't add a second status readout to the
  Grove's main canvas (Batch 03).
- `WorldGateway`/`ReturnToGrove` as the only world-switching mechanism
  for the five main Worlds — do not reintroduce a tab bar for them
  (Batch 03).
- The `GatewayDestination extends NavDestination` contract and the
  `transitionVariantFor(from, to)` single-source-of-truth mapping for
  transition variants (Batch 03).
- `groveStore`'s evolution stage being *derived* from
  `progressionStore.level`, never stored/set independently (Batch 03).
- Story rewards reuse the existing `MissionReward` shape (`@apptypes`)
  rather than a parallel `StoryReward` type — any future reward-
  granting World should do the same unless the shape genuinely can't
  fit (Batch 05).
- `story_progress` (Batch 01's table) is reused as-is for Tale Trails
  completion — do not add a new table for this until Tale Trails
  actually needs true multi-chapter tracking; `chapter_index` as a 0/1
  flag is intentional, not an oversight (Batch 05).
- The `ARSessionProvider` interface (`services/ar/ARSessionProvider.ts`)
  — a native ARKit/ARCore provider must implement it with the same
  method signatures (`start`/`stop`/`placeAnchor`/`removeAnchor`/
  `subscribeAnchors`/`hitTest`) so `ExplorationScreen` needs zero
  changes when it's swapped in via `services/ar/index.ts`'s single
  construction line. Never add a Treasure-Hunt-specific escape hatch
  that bypasses this interface (Batch 06).
- `CameraPermissionGate` (`components/CameraPermissionGate.tsx`) is
  now THE camera permission UI for the whole app — Missions'
  `CameraCaptureScreen` and Treasure Hunt's `ExplorationScreen` both
  use it. A third camera-using World must reuse it too, not fork a
  new permission flow (Batch 06).
- Treasure/Mission/Story reward-granting shape stays aligned: XP/
  coins/currencies via `progressionStore`, then a single
  `triggerCompanionMoment(kind, { traitLean, notification })` call
  (`@companion/companionMoments.ts`) — NOT a direct
  `nudgeTrait`/`setMood`/`pushNotification` sequence inlined in the
  flow. This was refactored in Batch 08 from three near-identical
  inlined blocks into one centralized function specifically so a
  future reward-granting World adds one call, not a fourth copy of
  the same logic (Batch 06 established the shape; Batch 08
  centralized it — see §27).
- Coarse location: `services/location/coarseLocation.ts` never
  returns or stores the raw coordinate past the function's own scope
  — it returns only a coarse biome label. Do not add a caller that
  reads `position.coords` directly instead of going through this
  function (Batch 06).
- `triggerCompanionMoment` (`@companion/companionMoments.ts`) is the
  ONLY place that decides which `CompanionMood` a moment uses. Adding
  a new kind of moment means adding one `CompanionMomentKind` + one
  `momentMood` entry — never call `useCompanionStore.getState().setMood`
  directly from a World flow or store action (Batch 08).
- `leanFor` (`@companion/evolution.ts`) is always derived live from
  current trait values, never stored, never rendered as a label,
  chart, or score anywhere in the UI. Do not persist a "lean"/
  "disposition" field or expose it in any child-facing copy (Batch 08).
- `ReturnToGrove` is the ONLY "way home" affordance any World screen
  renders — a screen must not build its own inline link/button that
  merely looks similar. (Batch 09 found and fixed exactly one
  violation of this in Missions' home screen — see §29.)
- `inventory_items` (Batch 01's table) is the one general-purpose
  unlockable-collectible log — a future World with its own unlockable
  content should log to it via `services/supabase/inventory.ts`
  rather than creating a fourth parallel "inventory" concept
  alongside it, `cosmetic_inventory` (Closet), and `ownedItemIds`
  (`closetStore`) (Batch 09).
- `profileStore`'s `progression`/`currencies` fields are dead
  scaffolding from Batch 01 — `progressionStore` is the only real
  source of truth for XP/level/currencies. Do not start writing to
  `profileStore.progression`/`currencies`; if profile-synced
  progression is ever needed, sync FROM `progressionStore` INTO
  Supabase, not through this unused mirror (Batch 09).

If a later batch believes one of these must change, **stop and ask
the user** rather than redesigning silently, per the master protocol's
Conflict Rule.

## 12. Explicitly Out of Scope for Batch 01

Per the master protocol's DO NOT list: Parent Space, full Missions,
full Stories, full AR, Store, and any second visual theme. World
screens beyond placeholders are intentionally deferred.

## 13. First-Time Child Journey (`src/onboarding/`) — Batch 02

The onboarding flow is a single-screen state machine, mirroring
`RootNavigator`'s World-switch pattern rather than expo-router
sub-routes (there's no back-stack to fight — the flow is strictly
linear except for the deliberate back affordance).

- `onboardingStore.ts` (`src/state/`) — persisted (AsyncStorage) step
  state machine. `STEP_ORDER` is the single source of truth for
  sequencing: `welcome → account → begin → introStory → eggSelection
  → hatching → companionReveal → naming → firstPromise → complete`.
- `OnboardingFlow.tsx` — renders the current step's screen + the
  shared back affordance. `hatching`, `welcome`, and `complete` are
  intentionally not back-able (`canGoBack()`).
- `app/index.tsx` gates between `OnboardingFlow` and `RootNavigator`
  based on `onboardingStore.completed`, waiting for `hasHydrated`
  before deciding — a fresh install never flashes the wrong screen,
  and an app restart mid-flow resumes at the same step instead of
  restarting. The hand-off into The Grove reuses the exact same
  `WorldTransition` overlay + swap-mid-fade pattern `RootNavigator`
  uses between Worlds — do not replace this with a plain navigate.
- Account entry (`AccountEntryScreen`) always falls forward to
  `advance()` even if Supabase is unconfigured or the request fails
  (guest continuation) — onboarding must never dead-end a child on a
  backend hiccup.
- `restart()` exists on the store for QA/testing; it is not currently
  wired to any UI.

## 14. Story System (`src/story/`) — Batch 02, reusable for Batch 05

A cinematic-story primitive pair, intentionally decoupled from the
onboarding flow so **Batch 05 (full Tale Trails)** can reuse it as-is:

- `StoryBeat` (`types.ts`) — `{ id, backgroundAssetId, speaker?, line?,
  cameraEffect?, particles?, haptic? }`. Any future story sequence
  should produce an array of these rather than inventing a new shape.
- `StoryScene.tsx` — renders one beat: background + camera motion
  (via the existing `cinematicCamera` transition primitive — no new
  ad-hoc `withTiming` calls), optional `ParticleField`, optional
  `Dialogue`.
- `StoryPlayer.tsx` — sequences beats via **tap-to-advance as the
  primary interaction**. Progression never depends solely on an
  animation completing, so an interrupted/slow beat can never
  soft-lock a child.
- `ParticleField.tsx` — procedural placeholder particle renderer
  driven by the existing `particleTransition` primitive. A future
  batch's real particle system can swap the renderer without callers
  (`StoryScene`, `HatchingScreen`) changing.

## 15. Companion Trait Model (`src/state/companionStore.ts`) — Batch 02

`CompanionTraits` (`@apptypes`) adds five continuous internal traits
— `heart`, `courage`, `curiosity`, `voice`, `bond`, each `0..1`,
default `0.5` (`bond` starts at `0.3`). Rules for every future batch:

- **Never render a trait as a number or grade anywhere in UI.** No
  "Heart: 72", no bar chart of traits. They are read internally only
  (e.g. to pick a Companion reaction line or animation later).
- Nudge traits with `nudgeTrait(trait, amount)` — small signed deltas
  only (Batch 02 uses ±0.03–0.08 from egg choice + First Promise
  choice), never a hard `set`.
- `traits` and `name` are additive to the existing `mood`/`bondLevel`
  contract — that contract is unchanged, just persisted now (see
  §11: extend, don't restructure).

## 16. What Batch 02 Explicitly Did NOT Implement

Per the master protocol and to stay in scope for this batch only:

- Real Companion mood-reaction authoring driven by the five traits
  (traits are stored and nudged, but no screen yet reads them to
  change behavior/copy — that's a natural Grove-batch follow-up).
- Supabase profile/session syncing of onboarding results (Companion
  name + traits persist locally via AsyncStorage only for now,
  consistent with Batch 01's "local-first, sync is a future batch's
  responsibility").
- Any second visual theme, Parent Space, full Missions/Stories/AR/
  Store — unchanged from Batch 01's deferral list.

## 17. The Grove & World Gateway System — Batch 03

The Grove is now the real hub Batch 01/02 deferred to. Its structure
is deliberately NOT a dashboard — the Product Bible replaces
XP/Level/Currency rows with a Companion-centered scene plus one
unobtrusive status surface.

- `worlds/worlds/Grove.tsx` — Companion center stage (`CompanionReaction`
  is now tappable, cycles mood + nudges the `bond` trait quietly),
  `GroveAmbient` (looping decorative motes, no interaction required),
  `TodaysAdventureCard` (the screen's one primary action), `StatusHub`
  (the one status surface), and `WorldGateway` (portals to the other
  four Worlds).
- **`components/StatusHub.tsx`** — the single unobtrusive status access
  pattern. A small level-badge pill with a quiet unread dot; expands
  into a `Sheet` showing XP/Coins/Adventure Tickets/Collector
  Tokens/Notifications. This is the ONLY place those values render —
  never on the Grove's main canvas. Do not add a second status
  surface; extend this Sheet's contents instead.
- **`components/WorldGateway.tsx`** — spatial world-switching nav.
  Consumes `GatewayDestination extends NavDestination` (same contract
  as `BottomNav`, per §4 — no parallel nav data shape), rendered as
  portal artwork + label + one-line hint, NOT a tab bar. **`BottomNav`
  is no longer used to switch between the five main Worlds** — it
  remains available in the component library for other future UI
  (e.g. Parent Space) that genuinely needs a conventional tab bar.
- **`components/ReturnToGrove.tsx`** — the single consistent "way
  home" affordance every non-Grove World renders now that a tab bar
  no longer does this job. Do not invent a per-World variant.
- **`components/WorldTransition.tsx`** now takes an optional `variant:
  "fade" | "portal" | "fold" | "path" | "dissolve"` (defaults to
  `"fade"` for backward compatibility with the onboarding hand-off).
  **`navigation/transitionVariant.ts`** is the single place that maps a
  Grove<->World route to a variant — do not inline ad-hoc transition
  choices in a screen. Current mapping: Grove→Missions = portal,
  Missions→Grove = fold, Grove→Tale Trails = path, Grove→Treasure Hunt
  = dissolve, Grove→The Beyond = portal, everything else returning to
  Grove = fade.
- **`navigation/RootNavigator.tsx`** — `navigateToWorld(target)` swaps
  the active World at the transition's midpoint (same swap-mid-fade
  pattern as the onboarding→Grove hand-off in §13), not at the end.
- **`state/progressionStore.ts`** — local-first XP/level/coins/
  adventure tickets/collector tokens/notifications. XP→level uses a
  simple `floor(xp / 100) + 1` curve; notifications are stored as full
  objects but the Grove only ever surfaces an unread dot, never a
  count or list on the main canvas.
- **`state/groveStore.ts`** — persists only visit timestamps. The
  evolution *stage* (0/1/2) is always derived from
  `progressionStore.level` via `evolutionStageForLevel` /
  `groveBackgroundForStage` — never stored independently, so the Grove
  can't desync from progression. Stage only ever increases visually.
- **Supabase**: `grove_state` and `notifications` tables added (both
  RLS-scoped to `auth.uid()`); `currencies` gained additive
  `adventure_tickets` / `collector_tokens` columns via
  `alter table ... add column if not exists` so the migration is safe
  to re-run against an existing Batch 01/02 database. New
  `services/supabase/grove.ts` and `services/supabase/notifications.ts`
  follow the existing typed data-access pattern.
- `Currencies` (`@apptypes`) gained the two fields above additively —
  the existing `primary_currency`/`premium_currency` fields are
  unchanged, per §11.

## 18. What Batch 03 Explicitly Did NOT Implement

- Real gameplay inside Missions, Tale Trails, Treasure Hunt, or The
  Beyond — they remain placeholders, now reachable via their Grove
  gateway and returnable via `ReturnToGrove`, per the master protocol.
- Parent Space, Store, AR, any second visual theme — unchanged
  deferral list from Batch 01/02.
- Supabase syncing of the new progression/Grove/notification state
  (local-first via Zustand `persist`, consistent with Batches 01-02;
  the typed data-access functions exist for a future sync batch).
- Real particle/illustration art for the Grove's ambient layer or
  gateway portals — `GroveAmbient` is a procedural placeholder driven
  purely by Reanimated math, and gateway art resolves to the existing
  themed placeholder via the asset registry.
- A literal radial/orbit layout for `WorldGateway` — Batch 03 ships a
  wrapped horizontal arrangement of portals satisfying "not a tab bar,
  not an arbitrary slide"; a true radial/orbit geometry can be layered
  onto the same `GatewayDestination[]` data in a later batch without
  changing the contract (per the original Batch 01 `BottomNav` note).

## 19. Missions System (`src/missions/`) — Batch 04

Missions is the first World with real gameplay (replacing the Batch
01/03 placeholder at `worlds/worlds/Missions.tsx`, which now just
renders `MissionsFlow`). It follows the same orchestrator pattern as
`OnboardingFlow`: one component owns step sequencing, each step owns
its own screen.

- **Content** (`missions/content/missionDefinitions.ts`) — a static
  local seed of `MissionDefinition[]`, mirroring the shape of the new
  `mission_definitions` Supabase table. `services/supabase/missions.ts`
  reads Supabase first and falls back to this seed on any error/empty
  result — Missions must stay playable with no backend, same
  philosophy as onboarding's guest-continuation path.
- **Categories are flavor, not a scoreboard**: `kindDeeds`,
  `braveSparks`, `curiousFinds`, `storyVoices`, `groveBonds` map
  loosely to the five Companion traits but are never named as traits
  in any child-facing copy — see `categoryLabel` vs. each mission's
  internal-only `traitLean`. Never add a filter/label that says a
  trait name directly (e.g. never a "Courage" chip) — that reads as a
  school-style score, per the master protocol's §VALUES rule.
- **Submission architecture**: `SubmissionType` (`@apptypes`) covers
  photo/voice/video/reflection/quiz/guardian/location. **Only `photo`
  has a real flow in Batch 04** — `MissionDetailScreen` shows a gentle
  "still waking up" message for any other type rather than crashing
  or faking a flow. When implementing another type, follow the same
  camera→preview→verify→reward shape; don't invent a parallel one.
- **`MissionVerificationService`** (`services/verification/`) — UI-
  independent interface + `MockMissionVerificationService`. Approves
  ~85% of the time with a Companion-voiced line; a real AI backend
  swaps in behind the same `verify()` signature later with **no
  caller change**. Never render technical AI language (confidence
  scores, model names) anywhere near this — only `companionLine`.
- **Camera flow** (`missions/screens/CameraCaptureScreen.tsx`) — uses
  `expo-camera`'s `CameraView` + `useCameraPermissions`. Explicitly
  handles: permission denied (with `canAskAgain` branching to either
  a request button or "Open Settings" via `Linking.openSettings()`),
  cancel, and capture failure (try/catch around `takePictureAsync`).
- **Upload failure** is handled one step later, in
  `PhotoPreviewScreen`, via a simulated `services/missions/
  submissionUpload.ts` (no real media backend exists yet — this
  stands in for that network call, including an occasional simulated
  failure, so the retry/cancel UI is exercised for real).
- **Rewards** are specific per mission (XP, coins, and conditionally
  Adventure Tickets / Collector Tokens), rendered as individual
  icon+amount rows in `RewardScreen` — never one generic confetti
  burst for every mission. Granting a reward also nudges the relevant
  Companion trait(s) via the same `nudgeTrait` used by onboarding, and
  pushes one `progressionStore` notification (surfaced only through
  the Grove's existing `StatusHub` unread dot).
- **`state/missionsStore.ts`** — local-first, persisted: per-mission
  status (`not_started` / `in_progress` / `complete`) and a capped
  completion history (most-recent-first), read by
  `CompletionHistorySheet`.
- **Supabase**: `mission_definitions` (public-read reference content),
  `mission_submissions`, `mission_rewards` added; the existing Batch 01
  `mission_progress` table is extended (not replaced) with
  `last_submission_id` / `completed_at` columns. All three new
  data-access functions in `services/supabase/missions.ts` are
  best-effort/fire-and-forget — they never block or throw into the UI.
- New `@missions` path alias; 9 new placeholder-safe asset IDs (5
  mission-category card art, 4 reward icons).

## 20. What Batch 04 Explicitly Did NOT Implement

- Any submission type other than `photo` behaviorally (voice, video,
  reflection, quiz, guardian, location are typed/content-tagged only).
- A real AI verification backend — `MockMissionVerificationService`
  only, behind the stable `MissionVerificationService` interface.
- A real media upload backend — `submissionUpload.ts` simulates the
  network call so failure/retry handling is real and testable.
- Any per-profile identity plumbing for Supabase writes — calls
  currently pass a placeholder `"local-guest"` profile id since
  Supabase auth→profile wiring hasn't landed yet (see Batch 01/02's
  deferred sync layer). A future batch should thread the real
  authenticated profile id through here once it exists.
- Tale Trails, Treasure Hunt, The Beyond, Parent Space, Store, AR, any
  second visual theme — unchanged deferral list.

## 21. Tale Trails / Story World (`src/taletrails/`) — Batch 05

The second World with real gameplay, following `MissionsFlow`'s
orchestrator-owns-sequencing pattern exactly (`TaleTrailsFlow.tsx`:
home → detail → player → Fireside → reward → home).

- **Reuses Batch 02's Story System unmodified**: `StoryPlayer`,
  `StoryScene`, `StoryBeat`, `ParticleField` all needed **zero**
  changes. Branching (the "lightweight branching model" the batch
  brief asked for) is built entirely one layer up, in
  `taletrails/screens/EpisodePlayerScreen.tsx`: opening beats play
  through one `StoryPlayer`; an optional two-way `choice` pauses via a
  new `ChoicePrompt` screen (not a `StoryBeat` — deliberately kept out
  of that contract); the chosen option plays one reaction beat through
  a plain `StoryScene`; then `closingBeats` play through a *second*
  `StoryPlayer`, reconnecting to the same ending regardless of choice.
  Not every episode needs a `choice` at all ("Tide Cove Secrets" has
  none) — `EpisodePlayerScreen` skips straight from opening to closing
  beats when `episode.choice` is undefined.
- **Content** (`taletrails/content/storyDefinitions.ts`) — a static
  local seed of `StoryEpisodeDefinition[]`. 2 available episodes, 2
  not-yet-available ("sealed") ones, so the discovery shelf reads as a
  real library rather than a single lonely item. `{companionName}`
  is a template token substituted at runtime (`withCompanionName`) so
  content authors don't need to know the Companion's name ahead of
  time.
- **Sealed chapters are not a generic "Coming Soon" box**
  (`taletrails/components/EpisodeCard.tsx`): same card layout as an
  available episode, a slow Reanimated shimmer, in-world copy
  ("still gathering starlight"). Tapping one never dead-ends — it
  triggers a Companion `Toast` tease instead of navigating anywhere.
- **Companion Fireside** (`screens/FiresideScreen.tsx`) — the
  Companion reflects conversationally on the episode via each
  episode's `firesideLine`. Explicitly not a "Moral of the Story" and
  never evaluates the child's choice — any future episode's
  `firesideLine` should read like a feeling, not a verdict.
- **Rewards** reuse the exact Missions mechanism: `progressionStore`
  (XP/coins/tickets/tokens), `companionStore.nudgeTrait`, a pushed
  notification (`kind: "adventure"`), and a best-effort Supabase
  write via `services/supabase/stories.ts`. `StoryRewardScreen` reuses
  the existing `RewardBadge` component rather than a parallel reward
  UI, and story rewards reuse the `MissionReward` type directly.
- **Supabase**: no schema change. Reuses Batch 01's `story_progress`
  table as-is; `chapter_index` is used as a simple 0/1 completion flag
  for now (see §11) since Batch 05 episodes are single-session, not
  multi-chapter sagas.
- **World transition**: Grove ↔ Tale Trails already resolved to the
  `path` variant via Batch 03's `transitionVariantFor` — no navigation
  code changed for this batch.
- New `@taletrails` path alias, mirroring `@missions`. 6 new
  placeholder-safe asset IDs.

## 22. What Batch 05 Explicitly Did NOT Implement

- More than one two-way choice per episode, or any choice with more
  than two options — matches the explicit "not a giant branching
  tree" instruction.
- Real illustrated/audio art for the 6 new asset IDs.
- True multi-chapter stories (`chapter_index` beyond a 0/1 flag).
- Real per-profile identity for the Supabase write — still the
  `"local-guest"` placeholder, same deferral as Missions.
- Treasure Hunt, The Beyond, Parent Space, Store, AR, a second visual
  theme, or any change to Grove/Missions — unchanged deferral list;
  neither was touched in this batch.

## 23. Treasure Hunt & AR Architecture (`src/treasurehunt/`, `src/services/ar/`) — Batch 06

The camera becomes the exploration surface. Structure, and what
future batches must not break:

- **AR abstraction layer** (`services/ar/`). `ARSessionProvider` is a
  backend-agnostic interface: `capabilities`, `start`/`stop`,
  `placeAnchor`/`removeAnchor`, `subscribeAnchors`, `hitTest`.
  `CameraFallbackARProvider` implements it today with fixed,
  deterministic screen-space anchors over the live camera feed — no
  real plane detection or world tracking, and `capabilities` reports
  that honestly (`planeDetection: false`, `worldTracking: false`).
  This is the master protocol's "polished camera fallback mode"
  explicitly permitted when full native AR isn't reliably executable
  in the current development environment (no custom dev client / EAS
  build available in this sandbox for real ARKit/ARCore native
  modules). `services/ar/index.ts` exports a single
  `arSessionProvider` singleton — swapping to a native provider is
  one constructor call, not a rewrite.
- **Camera abstraction is now genuinely shared.** Batch 04's inline
  permission-handling in `MissionsCameraCaptureScreen` was extracted
  into `components/CameraPermissionGate.tsx` (loading / denied+askable
  / denied-forever+Settings-link / cancel — same copy pattern,
  parameterized by a `reason` line). `CameraCaptureScreen` was
  refactored to use it with byte-identical rendered behavior; Treasure
  Hunt's `ExplorationScreen` uses the same gate with its own reason
  line. This satisfies the master protocol's explicit "Do not break
  Mission camera functionality. Reuse the existing camera
  abstraction."
- **Coarse location only** (`services/location/coarseLocation.ts`).
  Requests foreground + `Accuracy.Low` only, reduces the coordinate to
  one of three `TreasureBiome` buckets in memory, and returns just the
  label — the raw coordinate is never stored, logged, sent to
  Supabase, or shown to the child. Denial/failure falls back to
  `"meadow"` rather than blocking entry.
- **Treasure Hunt flow** (`src/treasurehunt/`, orchestrated by
  `TreasureHuntFlow.tsx`, same single-owner-of-sequencing pattern as
  `MissionsFlow`/`TaleTrailsFlow`): Hunt entry → camera exploration
  (`ExplorationScreen`, full-bleed, skips `WorldScene` like Missions'
  camera step) → discovery (markers pulse into place, one arrival
  `Dialogue` line, no counters/coordinates in the HUD) → interaction
  (tap routes through `arSessionProvider.hitTest`, not a per-marker
  `Pressable`, so the interaction model matches how a real AR raycast
  hit-test would work) → collection (`CollectionScreen`, reusing
  `ParticleField` from Batches 02/05 rather than a new particle
  system, plus haptics + `CompanionReaction`) → reward
  (`TreasureRewardScreen`, mirrors `missions/screens/RewardScreen.tsx`'s
  icon+amount-row layout) → keep exploring or return to Grove.
- **Reward granting mirrors Missions exactly**:
  `TreasureHuntFlow.grantReward` calls `progressionStore`'s
  add-currency actions, `companionStore.nudgeTrait` per
  `TreasureDefinition.traitLean` (never shown as a number),
  `pushNotification`, records to the local `treasureHuntStore`
  (a history log, not a one-time flag — demo treasures are
  re-collectible), and best-effort logs to the new
  `treasure_collections` Supabase table via
  `services/supabase/treasureHunt.ts`.
- **Dummy content is fully data-driven**:
  `treasurehunt/content/treasureDefinitions.ts` — 6 treasures across
  `meadow` / `shoreline` / `woodland` / `any` biomes, each with a
  name, discovery line, collect line, `MissionReward` (reused type,
  not a parallel shape), and trait lean. Adding a treasure is a
  content-file change, never a new screen.
- **No new visual language**: markers reuse the same jewel-glow
  language as `WorldGateway`'s portal glow (`shadows.glow` /
  `colors.accent.secondary`), the "Leave" control mirrors Missions'
  camera-screen cancel button styling exactly, and every non-camera
  screen renders through the same `WorldScene` /
  `TREASURE_HUNT_BACKGROUND` every other World uses.
- New `@treasurehunt` path alias. 7 new placeholder-safe asset IDs (6
  treasure icons + 1 unused marker-glow reserve). New Supabase table
  `treasure_collections` (RLS-scoped to `auth.uid()`, mirrors
  `mission_rewards`'s log-not-flag shape).

## 24. What Batch 06 Explicitly Did NOT Implement

- Real native ARKit/ARCore integration — `CameraFallbackARProvider` is
  the full implementation for this batch; a native provider needs a
  custom dev client / EAS build this sandbox can't produce, and the
  master protocol explicitly permits the fallback in that case.
- True proximity-based discovery (device heading/orientation via
  gyroscope/magnetometer, e.g. `expo-sensors`) — fallback anchors are
  visible immediately on entering exploration rather than revealing as
  the camera physically points at them. Documented simplification of
  the fallback, not a contract gap: `ARAnchor.position` is already
  structured for a native provider to report true camera-relative
  coordinates without a shape change.
- One-time-only treasure collection / a "fully collected" end state —
  demo treasures are intentionally re-collectible each visit (history
  log, see `treasureHuntStore`), consistent with "polished demo
  content" rather than a scarcity mechanic.
- Real per-profile identity for the Supabase write — still the
  `"local-guest"` placeholder, same deferral as Missions/Tale Trails.
- The Beyond, Parent Space, Store, a second visual theme, or any
  change to Grove/Missions/Tale Trails — unchanged deferral list;
  none were touched in this batch.

## 25. Companion's Closet & The Vault Architecture (Batch 07)

- **Three currencies, three distinct roles** — enforced in code, not
  just copy: `coins` (frequent, small/cosmetic), `adventureTickets`
  (aspirational, story/event unlocks), `collectorTokens` (rare,
  prestige/physical). `CosmeticItemDefinition.currency` and
  `VaultRewardDefinition` (Vault is Collector-Tokens-only) are the
  single source of truth for which currency an item costs — never a
  mixed-currency price anywhere in either catalog.
- **XP stays non-purchasable.** Batch 07 adds no path from any
  currency to XP or level — mastery/progression is earned only
  through Missions/Tale Trails/Treasure Hunt completion, unchanged
  from Batch 01/04/05/06.
- **`src/closet/`** — `content/catalog.ts` (dummy `CosmeticItemDefinition[]`
  across all 8 categories from the master protocol: outfits,
  accessories, expressions, titles, badges, homeDecor, profileThemes,
  collectorCards), `components/ItemCard.tsx`, `screens/ClosetHomeScreen.tsx`
  (categories + grid), `screens/ItemPreviewScreen.tsx` (preview → buy
  → equip), `ClosetFlow.tsx` orchestrator — same single-owner-of-
  sequencing pattern as `MissionsFlow`.
- **`src/vault/`** — `content/vaultCatalog.ts` (dummy `VaultRewardDefinition[]`),
  `components/VaultRewardCard.tsx` (the "340 / 500 Collector Tokens"
  card from the spec, built on the existing `ProgressBar`),
  `screens/VaultHomeScreen.tsx`, `screens/VaultRewardDetailScreen.tsx`
  (locked vs. eligible), `screens/ParentHandoffScreen.tsx` (explicit
  placeholder — collects nothing from the child), `VaultFlow.tsx`.
- **Two new registered Worlds**: `closet` and `vault` in
  `WorldRegistry`, each with a Grove gateway (`GATEWAY_CLOSET`,
  `GATEWAY_VAULT`) and a `transitionVariantFor` entry (`closet` uses
  `fold` both ways, mirroring Missions' Companion-adjacent feel;
  `vault` uses `portal` in / `fade` out, matching Beyond's aspirational
  weight). New `@closet`/`@vault` path aliases added to both
  `tsconfig.json` and `babel.config.js`, following the exact existing
  alias pattern.
- **Currency safety (client)**: `closetStore.purchase` and
  `vaultStore.requestRedemption` both check ownership/active-request
  state AND balance BEFORE calling any `progressionStore.add*`
  method — a purchase or redemption can never be attempted twice for
  the same item/reward, and a balance can never be driven negative
  from the Closet/Vault, because insufficient funds short-circuits
  before any deduction happens.
- **Currency safety (database)**: `currencies` gets a new
  `check (... >= 0)` constraint (Batch 01/03's table, extended not
  restructured); `cosmetic_inventory` has a `unique (profile_id,
  item_id)` constraint (blocks a duplicate purchase at the DB layer,
  not just client-side); `redemption_requests` has a partial unique
  index on `(profile_id, reward_id) where status != 'fulfilled'`
  (blocks a duplicate *active* redemption request while still
  allowing a future request after fulfillment).
- **`equipped_cosmetics`** is one row per profile with a `slots` jsonb
  column (one item per `CosmeticCategory`) — mirrors the "equip"
  concept without a parallel per-category table.
- **Reward celebration variety**: `ParticleField` (Batch 02/05) gained
  a `tone` prop (`"secondary" | "positive" | "caution"` — all existing
  `colors.accent` values, no new palette) so `RewardCelebration`
  (`src/components/`) can give Closet purchases, Vault progress, and
  Vault redemption three visibly different celebrations (particle
  count, Companion mood, haptic weight) without inventing a second
  animation system or a new color palette. Existing `ParticleField`
  callers (story beats, egg hatching) are unaffected — `tone` defaults
  to `"secondary"`, the prior hardcoded color.
- **No Store payment collection anywhere** — `ParentHandoffScreen` is
  explicitly a placeholder per the master protocol's "Do NOT collect
  payment information from the child" / "Do NOT implement real-money
  purchases" rules; it only confirms the request was logged.

## 26. What Batch 07 Explicitly Did NOT Implement

- Parent Space itself — `redemption_requests` rows exist for a future
  Parent Space batch to list/fulfill, but no parent-facing UI exists
  yet.
- A second economy or a fourth currency — exactly the existing three
  (coins, adventureTickets, collectorTokens) are used; no new balance
  type was added anywhere.
- Any redesign of Grove, Missions, Tale Trails, or Treasure Hunt —
  Grove gained two more `WorldGateway` entries (additive, same
  component/props shape) and nothing else changed on that screen.
- Real per-profile identity for the Supabase writes — still the
  `"local-guest"` placeholder, same deferral as every prior batch.
- Real illustrated art for any of the 26 new `AssetId`s — all resolve
  to the existing themed placeholder via `AssetImage`.
- The Beyond, a second visual theme, or real-money payment rails of
  any kind.

## 27. Living Companion Progression System — Batch 08

The Companion gains a fuller emotional vocabulary and a real
(internal-only) developmental identity, and every World's reward path
now runs through one shared mechanism instead of five copies of the
same logic.

- **`CompanionMood` grew from 5 to 12 states**
  (`components/CompanionReaction.tsx`), additively — `idle`, `happy`,
  `curious`, `sleepy`, `celebrating` are unchanged; new: `thinking`,
  `encouraging`, `questReaction`, `storyReaction`, `rewardReaction`,
  `interaction`, `reflective`. Every new state is wired to a real
  trigger site (see below), not left as a dead enum value. The two
  places that exhaustively switch on `CompanionMood`
  (`moodToAsset` in `CompanionReaction.tsx`, `REACTION_LINES` in
  `Grove.tsx`) were both updated — any third exhaustive
  `Record<CompanionMood, ...>` added later must cover all 12 states
  or TypeScript will catch the gap at compile time.
- **`src/companion/companionMoments.ts`** — `triggerCompanionMoment
  (kind, { traitLean?, notification? })` is now the single place that
  decides which mood a given kind of moment uses AND performs the
  trait-nudge + notification side effects. Before this batch,
  `MissionsFlow.grantReward`, `TaleTrailsFlow.grantReward`, and
  `TreasureHuntFlow.grantReward` each independently inlined an
  identical "loop `traitLean` entries → `nudgeTrait`,
  `setMood('celebrating')`, `pushNotification`" block — that
  triplication is now this one function, called with a different
  `CompanionMomentKind` (`"quest"` / `"story"` / `"treasure"`) so each
  World's completion still feels distinct (`questReaction` /
  `storyReaction` / `rewardReaction` respectively) without three
  separate implementations. This is what the master protocol's
  "connect missions/stories/treasure/Beyond/XP/level/rewards/
  Companion state — use centralized state, do not create duplicate
  progression systems" means concretely in this codebase.
- **Closet and Vault gained Companion awareness they never had**:
  `closetStore.purchase` now fires `triggerCompanionMoment("purchase")`
  (mood `encouraging`) at its existing single mutation point;
  `vaultStore.requestRedemption` fires `triggerCompanionMoment
  ("vaultRedeem")` (mood `celebrating`); `VaultFlow.handleSelectReward`
  fires `triggerCompanionMoment("vaultProgress")` (mood `thinking`)
  when the child opens a reward that isn't eligible yet — a quiet
  "still dreaming about it" beat, never a nag or countdown. All three
  are additive calls at points that already existed; no purchase/
  redemption logic itself changed.
- **`TaleTrailsFlow`'s Fireside now uses `reflective`, not
  `celebrating`**: `FiresideScreen` previously hardcoded
  `mood="celebrating"` as a static prop, ignoring the live store mood
  entirely. It now reads the live `companionStore.mood` and fires
  `triggerCompanionMoment("reflection")` on mount, so the sequence
  is: episode completes → brief `storyReaction` (from `grantReward`) →
  settles to `reflective` once Fireside actually renders → the
  following `StoryRewardScreen` still hardcodes `celebrating`
  independently. This keeps Fireside's "reflection, not a report
  card" framing (§21) visually distinct from the reward screen's
  actual celebration.
- **`src/companion/evolution.ts`** — `leanFor(traits):
  CompanionLean` (`"ember" | "tide" | "whisper"`, named after the
  three onboarding eggs — see `onboarding/content/eggs.ts`) is a pure
  function of live trait values: `emberScore = courage + voice*0.5`,
  `tideScore = heart + bond*0.5`, `whisperScore = curiosity +
  voice*0.5`, highest wins with a fixed tide→ember→whisper tie-break.
  Verified in isolation that choosing each egg (which nudges traits at
  hatching) immediately resolves to that egg's own matching lean, and
  that the lean can shift later as Missions/Tale Trails/Treasure Hunt
  keep nudging traits — this is the concrete mechanism behind "the
  initial egg influences starting direction, but final development
  also responds to the child's journey." Like the traits it reads,
  the lean is NEVER stored, NEVER shown as a number/label/chart
  anywhere in the UI — see §11.
- **Grove decoration layer**: `components/GroveDecor.tsx` renders 1-2
  small ornament images (`groveDecorForLean` in `evolution.ts` picks
  the pair for the current lean) gated by the *existing*
  `evolutionStageForLevel` stage (0 = none, 1 = one ornament, 2 = both)
  — reuses Batch 03's stage-gating exactly rather than adding a
  second unlock timeline. Purely decorative
  (`pointerEvents="none"`), mirrors `GroveAmbient`'s "no interaction
  required" pattern, never labels which lean it reflects. This is the
  "subtle Grove evolution... this is MY place" requirement: the same
  Grove background-stage system from Batch 03 now also quietly
  reflects the child's own accumulated choices, not just their XP
  level.
- **Grove's Companion tap now uses `interaction`, not a happy/idle
  toggle**: `handleCompanionTap` previously flipped `mood` between
  `"happy"` and `"idle"` and called `nudgeTrait("bond", 0.01)`
  directly; it now calls `triggerCompanionMoment("interaction", {
  traitLean: { bond: 0.01 } })` — same trigger (direct tap), same
  trait nudge amount, now using the dedicated `interaction` mood and
  going through the centralized function like every other Companion
  reaction in the app.
- 14 new placeholder-safe `AssetId`s: 7 Companion mood portraits
  (`COMPANION_THINKING` / `_ENCOURAGING` / `_QUEST_REACTION` /
  `_STORY_REACTION` / `_REWARD_REACTION` / `_INTERACTION` /
  `_REFLECTIVE`) + 6 Grove decoration ornaments (`GROVE_DECOR_EMBER_1/2`,
  `GROVE_DECOR_TIDE_1/2`, `GROVE_DECOR_WHISPER_1/2`). New `@companion`
  path alias.

## 28. What Batch 08 Explicitly Did NOT Implement

- Any UI that names, charts, scores, or labels a trait or lean —
  every mechanism in this batch is read internally only, per the
  master protocol's explicit "do not show personality scores, do not
  turn this into a badge dashboard."
- A fourth Grove evolution stage or any change to
  `evolutionStageForLevel`'s thresholds/derivation — stage gating is
  reused exactly as Batch 03 built it; only what renders *within* an
  existing stage (the decoration layer) is new.
- Real illustrated art for any of the 14 new `AssetId`s — all resolve
  to the existing themed placeholder via `AssetImage`.
- The Beyond (still unbuilt) — `triggerCompanionMoment` is ready for
  it to plug into (a `"beyond"` `CompanionMomentKind` is a one-line
  addition when that World is built), but no Beyond-specific wiring
  exists yet.
- Parent Space, Store, a second visual theme, real per-profile
  Supabase identity (still the `"local-guest"` placeholder) — all
  unchanged from every prior batch's deferral list.
- A literal "future evolution stage" beyond the existing 0/1/2 — the
  master protocol's "Egg → hatching → early Companion → later
  development → future evolution stages" progression is satisfied by
  onboarding's hatching (stage-independent) plus the existing 3 Grove
  stages; a 4th/5th stage is a natural follow-up, not built here to
  avoid inventing thresholds with no gameplay yet to justify them.

## 29. The Beyond & Full World Connectivity / State Audit — Batch 09

The seventh and final placeholder World gets real content, and this
batch's second half is a genuine audit of everything built so far —
not a new feature.

### The Beyond (`src/beyond/`)

Same single-owner-of-sequencing `Flow` pattern as every other World
(`BeyondFlow.tsx`: browse → explore → complete → browse).

- **Content** (`beyond/content/regions.ts`) — 5 `BeyondRegionDefinition`s
  covering all four categories the master protocol names (`region`,
  `quest`, `seasonal`, `premium`). Only `whispering-deep` is
  `available: true` — a real interactive region with 3 tappable
  points of interest. The other 4 demonstrate sealed content across
  every category, so The Beyond reads as one expansive, half-open
  place rather than a single lonely feature with some grey boxes
  around it.
- **Sealed regions reuse Tale Trails' exact shimmer-card language**
  (`beyond/components/BeyondRegionCard.tsx` mirrors
  `taletrails/components/EpisodeCard.tsx`'s shimmer + in-world copy
  pattern, plus a small `kindLabel` pill for region/quest/seasonal/
  premium flavor) — not a new "Coming Soon" visual language. Tapping
  one never dead-ends: it triggers the same Companion `Toast` tease
  pattern `TaleTrailsFlow` established, never a navigation.
- **Interactive region exploration** (`RegionExplorationScreen.tsx`) —
  a full-bleed background with a handful of glowing, pulsing points of
  interest (reusing the exact jewel-glow language `WorldGateway`/
  Treasure Hunt markers already use — `shadows.glow` /
  `colors.accent.secondary`), each revealing one Companion/narrator
  line via `Dialogue` on tap. Deliberately NOT built on the
  `ARSessionProvider`/camera abstraction from Batch 06 — Beyond
  regions are an in-world map surface, not a camera/AR surface, so
  this is a genuinely different interaction modality rather than a
  competing implementation of the same one. No counters, coordinates,
  or HUD numbers, matching Treasure Hunt's discovery-screen rule even
  though the mechanism differs.
- **`state/beyondStore.ts`** — local-first, persisted: discovered
  point-of-interest ids per region, plus a capped completion history
  (same shape/philosophy as `missionsStore`/`storiesStore`/
  `treasureHuntStore`). A region's reward is only ever granted on its
  *first* completion (`BeyondFlow` checks `completions` before
  granting) — revisiting an already-explored region still lets the
  child walk through it again (points stay marked discovered), just
  without a second reward, so nothing here can be farmed.
- **Rewards reuse the exact established mechanism**: `progressionStore`
  add-currency actions, `triggerCompanionMoment("beyond", ...)` (one
  new `CompanionMomentKind`, mapped to the existing `rewardReaction`
  mood — no new `CompanionMood` needed), and `RewardBadge` (the same
  component Missions/Tale Trails use) in `RegionCompleteScreen.tsx`.
- **Unlockable content reuses `inventory_items` (Batch 01) for real,
  for the first time.** That table existed since Batch 01 with zero
  actual callers; `whispering-deep`'s completion is the first thing in
  the whole app to call `services/supabase/inventory.ts`'s
  `addInventoryItem`. This was a deliberate audit fix, not incidental
  — see the STATE AUDIT section below.
- **Supabase**: new `beyond_region_completions` table, shaped to
  exactly mirror `treasure_collections` (RLS-scoped, log-not-flag).
  `services/supabase/beyond.ts` is best-effort/fire-and-forget, same
  as every other reward-logging service.
- **World transition**: Grove ↔ The Beyond already resolved to
  `portal` in / `fade` out via Batch 03's `transitionVariantFor` — no
  navigation code changed for this batch, confirming the mapping
  really was complete already.
- New `@beyond` path alias. 5 new placeholder-safe asset IDs (one per
  region card).

### World Connectivity Audit — findings

Checked every World against Grove for: reachability (`WorldGateway`
entry exists), a working way back (`ReturnToGrove`), and a resolved
`transitionVariantFor` mapping both directions.

- **All 6 non-Grove Worlds** (missions, taleTrails, treasureHunt,
  theBeyond, closet, vault) were already correctly gatewayed from
  Grove and had a resolved transition variant both ways (the "world →
  grove" default case correctly covers treasureHunt/theBeyond/vault as
  `fade`, matching the code comments documenting that intent — this
  was a correct implicit default, not a gap).
- **Found and fixed one real inconsistency**: `MissionsHomeScreen`
  had its own inline "← Back to The Grove" text link instead of the
  shared `ReturnToGrove` component every other World uses — the only
  World that didn't visually match. Fixed to use `ReturnToGrove`
  directly.
- **Reviewed, not changed**: `TreasureRewardScreen` renders "Return to
  the Grove" via its own `SecondaryButton` call rather than importing
  `ReturnToGrove` — but the rendered output (same component, same
  label) is already pixel-identical; it's positioned in a stacked
  two-button layout where `ReturnToGrove`'s own hardcoded margin
  styling would need overriding anyway. Left as-is: this is not a
  design inconsistency, just a different call site producing the same
  visual result.

### State Audit — findings

Checked for competing sources of truth in XP, level, currency,
inventory, Companion state, mission completion, and story progress,
per the master protocol's explicit list.

- **XP / level / currencies**: single source of truth confirmed —
  `progressionStore` everywhere (Missions, Tale Trails, Treasure Hunt,
  Closet, Vault, Beyond, Grove's `StatusHub`). No duplicate balance
  ever found.
- **Companion state**: single source of truth confirmed —
  `companionStore` (mood, traits, name), always mutated through
  `nudgeTrait`/`setMood` or (since Batch 08) `triggerCompanionMoment`.
- **Per-World completion tracking**: `missionsStore`, `storiesStore`,
  `treasureHuntStore`, now `beyondStore` — four independent stores,
  correctly so (a Mission's completion and a Story's completion are
  genuinely different facts), all following the identical shape/
  pattern. Not a duplication problem — this is "one store per concept,"
  not "multiple stores for one concept."
- **Found one latent risk, fixed**: `profileStore.ts` (Batch 01) has
  `progression`/`currencies` fields that mirror exactly what
  `progressionStore` already owns, but grepping the entire codebase
  confirmed **zero** reads or writes to them anywhere outside their
  own file's definition. Not an active bug today, but a real landmine
  — a future session could plausibly start writing progression there,
  thinking it's live state, creating a genuine second source of truth.
  Documented in §11 rather than deleted outright this batch (the
  fields are harmless dead code today; removing them is a one-line
  follow-up if a future batch wants to tidy it, but doing so wasn't
  load-bearing for The Beyond and this batch's budget went to
  documenting the risk clearly enough that no one accidentally builds
  on it).
- **Found one duplication risk, resolved by reuse rather than
  refactor**: `inventory_items` (Batch 01, generic, always empty) vs.
  `cosmetic_inventory` (Batch 07, Closet-specific, actually used) vs.
  `closetStore.ownedItemIds` (client-local) looked like three
  competing "inventory" shapes. Resolution: `inventory_items` was
  simply unused, not conflicting — Batch 09 gave it its first real
  purpose (Beyond's unlockable collectibles) rather than adding a
  fourth shape, which is what "refactor only when necessary" means
  here: the necessary fix was *using* the existing architecture, not
  restructuring it.

## 30. What Batch 09 Explicitly Did NOT Implement

- Real native ARKit/ARCore or any camera/AR surface for The Beyond —
  intentionally a different (map-tap) interaction modality, not an
  extension of Treasure Hunt's AR abstraction.
- More than one real interactive region — `starlit-crossing`,
  `forgotten-archive`, `the-far-shore`, and `ember-hollow` are
  polished sealed content only, per the batch's own "polished dummy
  content where necessary" instruction.
- Deleting `profileStore`'s dead `progression`/`currencies` fields —
  flagged as a landmine in §11/§29 but left in place; a genuine
  cleanup a future batch can do in one line if desired.
- Any change to `TreasureRewardScreen`'s `ReturnToGrove`-equivalent
  button — reviewed and judged not to be an actual inconsistency (see
  §29).
- Parent Space, Store, a second visual theme, real per-profile
  Supabase identity (still the `"local-guest"` placeholder) — all
  unchanged from every prior batch's deferral list.

## 31. Final Productization Audit — Batch 10

Batch 10 was explicitly not a feature batch — it audited Batches
01–09 as a whole and produced the four ship-readiness documents now
living in `docs/`: `FINAL_ARCHITECTURE.md`, `KNOWN_LIMITATIONS.md`,
`ASSET_REPLACEMENT_GUIDE.md`, `DEPLOYMENT_GUIDE.md`. Read those for
the full picture — this section only records what changed in `src/`
and what the audit confirmed vs. found broken.

### Confirmed holding (verified, not assumed)

- **Design token discipline**: zero raw hex colors outside
  `src/theme/`, zero `require()` calls outside
  `src/assets/registry.ts`, across all 155 source files.
- **One World Test**: all 7 Worlds correctly registered, all 6
  non-Grove Worlds use `ReturnToGrove` consistently.
- **One ambient animation loop at rest**: repo-wide `withRepeat` grep
  returns exactly one hit (`GroveAmbient`) — the Grove has never
  accumulated a second competing "alive" layer across 9 batches of
  independent work.
- **Environment variables**: already handled correctly since Batch 01
  (`services/supabase/client.ts` reads `process.env`, `.env.example`
  documents the two required keys) — the Deployment Guide originally
  drafted a claim that this was missing; corrected after checking the
  actual file.

### Fixed this batch

- `app.json`'s icon path
  (`src/assets/images/icon-placeholder.png`) pointed at a file that
  didn't exist (only a `.gitkeep` was present). A real, theme-colored
  (`#0B1026` background / `#7C6FE0` accent) placeholder PNG now exists
  there. This is a **real fix**, not a placeholder-for-a-placeholder —
  it makes `app.json` internally consistent; swapping in a final icon
  later still just replaces this one file, per the Asset Replacement
  Rule.
- `MissionsHomeScreen`'s category and length filter chips were missing
  `accessibilityRole`/`accessibilityLabel`/`accessibilityState` — now
  match every other interactive element's accessibility baseline in
  the app.

### Found and documented, deliberately not fixed

- `VerificationScreen` has no timeout if `MissionVerificationService`
  never resolves. Unreachable today (the mock always resolves) but
  will matter the moment a real backend replaces the mock. A future
  batch adding a real verification backend should design the
  timeout/failure Companion copy at the same time, not retrofit it —
  see `KNOWN_LIMITATIONS.md`.
- `npm run lint` has no ESLint config anywhere in the repo and
  `eslint` isn't a `devDependency` — has been non-functional since
  Batch 01, only surfaced by this batch actually trying to run it.
  Adding a real config is a rules decision that deserves its own
  review pass, not a default bolted on inside a QA batch.

### Rule for future batches

Both of the above are exactly the kind of finding this continuity doc
exists to prevent from being silently rediscovered: check
`docs/KNOWN_LIMITATIONS.md` before assuming either gap is new, and
update that file (not just this one) if either is ever actually
addressed.

## 32. What Batch 10 Explicitly Did NOT Do

Per its own DO NOT list:

- No Parent Space (explicitly forbidden this batch, despite
  `redemption_requests` data waiting since Batch 07).
- No new features of any kind.
- No rewrite, no second design system, no framework change — every
  code change this batch was a small, independently-verifiable fix
  (2 files touched: `app.json`'s referenced icon + `MissionsHomeScreen`).
- No fix for the verification-timeout gap or the missing ESLint
  config — documented as findings, deliberately not code-fixed (see
  §31 rationale).
- No real device testing, no live Supabase project exercised, no EAS
  Build invoked — none are possible in this sandbox; documented as
  exactly what's left in `DEPLOYMENT_GUIDE.md`.
- No push to the remote — including the Batch 09 merge, which was
  performed locally as a audit prerequisite but held back pending
  explicit "YES, PUSH," per this batch's own restated instruction.
