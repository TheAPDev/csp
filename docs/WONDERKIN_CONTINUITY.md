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

If a later batch believes one of these must change, **stop and ask
the user** rather than redesigning silently, per the master protocol's
Conflict Rule.

## 12. Explicitly Out of Scope for Batch 01

Per the master protocol's DO NOT list: Parent Space, full Missions,
full Stories, full AR, Store, and any second visual theme. World
screens beyond placeholders are intentionally deferred.
