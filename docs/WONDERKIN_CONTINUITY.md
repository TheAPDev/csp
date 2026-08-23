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
