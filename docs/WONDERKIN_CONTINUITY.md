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
`WorldTransition`, `AssetImage`.

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
  on this shape being stable.
- The `onboardingStore` `STEP_ORDER` sequencing and persisted-field
  shape — extend with new steps if needed, don't reorder/rename
  existing ones without checking `NO_BACK_STEPS` and `app/index.tsx`.
- The rule that Companion traits (`CompanionTraits`) are never
  rendered as a visible number/score.

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
