# WONDERKIN — Final Architecture (Batch 10)

This is the ship-state architecture summary after Batches 01–09. For
the full decision-by-decision history and rules future work must
follow, `WONDERKIN_CONTINUITY.md` remains the source of truth — this
file is a map of where things live, not a replacement for it.

## 1. Stack

React Native + Expo SDK 51 + TypeScript, `expo-router` (file-based
routing, single entry `app/index.tsx`), Supabase (auth/DB), Zustand
(client state), `react-native-reanimated` (all animation), and
`expo-haptics`. Mobile-first native app — no web-only APIs anywhere
in `src/`.

## 2. Directory Map

```
app/                    expo-router entry
src/
  theme/                Design tokens — the ONLY source of colors,
                         spacing, typography, radius, shadows, motion.
  components/            Shared component library (src/components/index.ts)
  transitions/            Pure timing/easing primitives (fade, portal,
                         cinematicCamera, pathTravel, sceneMorph,
                         environmentalDissolve, particleTransition)
  navigation/             RootNavigator + transitionVariant.ts (the one
                         place Grove<->World transition choices live)
  worlds/                 WorldRegistry + WorldScene + one thin entry
                         file per World (worlds/worlds/*.tsx), each
                         just rendering that World's Flow orchestrator
  companion/              Companion evolution (leanFor) + the single
                         centralized reward/reaction trigger
                         (companionMoments.triggerCompanionMoment)
  story/                  Reusable cinematic story primitives
                         (StoryBeat/StoryScene/StoryPlayer/ParticleField)
  onboarding/             First-run flow (egg -> hatch -> name -> Grove)
  missions/               Missions World (photo-submission quests)
  taletrails/             Tale Trails World (branching story episodes)
  treasurehunt/           Treasure Hunt World (AR-abstraction + camera)
  beyond/                 The Beyond World (map-tap region exploration)
  closet/                 Companion's Closet (cosmetic economy)
  vault/                  The Vault (Collector-Token redemption)
  state/                  Zustand stores, one per concept (see §4)
  services/supabase/      Typed Supabase access, one file per concept
  assets/                 AssetId registry — the only place a raw
                         filename may appear
  types/                  Shared TypeScript types (@apptypes)
```

Every one of the 7 World-specific modules (`missions/`, `taletrails/`,
`treasurehunt/`, `beyond/`, `closet/`, `vault/`, plus `grove` living
directly in `worlds/worlds/Grove.tsx`) follows the **same shape**:
`content/` (static seed data) → `<World>Flow.tsx` (single owner of
step sequencing) → `screens/` (one file per step) → `components/`
(World-specific UI, e.g. its own card). This is the one structural
pattern every future World should copy.

## 3. The One-World System

`WorldRegistry.ts` is the single list of Worlds. `WorldScene.tsx` is
the shared background+content shell every World renders through.
`navigation/transitionVariant.ts` is the single place that resolves a
Grove↔World route to one of `WorldTransition`'s variants (`fade` /
`portal` / `fold` / `path` / `dissolve`). `WorldGateway` (spatial
portal cards, not a tab bar) is how a child leaves the Grove;
`ReturnToGrove` is how they come back — every non-Grove World uses
both, unchanged from Batch 03. No World has its own color palette,
button shape, or navigation chrome — Worlds vary only background art,
narrative copy, and which shared primitives they compose.

## 4. State — One Store Per Concept

| Store | Owns |
|---|---|
| `companionStore` | name, mood, 5 internal traits (never shown as numbers) |
| `progressionStore` | XP, level, coins, Adventure Tickets, Collector Tokens, notifications — **the single balance authority** for every World |
| `groveStore` | visit timestamps only; evolution stage is *derived*, never stored |
| `missionsStore` / `storiesStore` / `treasureHuntStore` / `beyondStore` | per-World completion status + capped history — four stores because these are four genuinely different facts, not duplication |
| `closetStore` | owned cosmetics + equipped slots |
| `vaultStore` | redemption request state |
| `onboardingStore` | first-run flow progress |
| `profileStore` | **dead code** — see `KNOWN_LIMITATIONS.md` |

All ten are Zustand + `persist` into AsyncStorage except `profileStore`
(unused, see limitations doc) — every meaningful piece of app state
survives an app restart today, local-first, with Supabase as a
best-effort sync layer underneath (see §5).

Rewards (XP/currency/trait-nudge/notification/Companion-reaction) run
through exactly two centralized functions app-wide:
`progressionStore`'s `add*` actions for the numbers, and
`companion/companionMoments.ts`'s `triggerCompanionMoment(kind, ...)`
for the Companion side of it. Every World's `grantReward`/equivalent
calls these — none reimplements the sequence.

## 5. Supabase — What's Real vs. What's a Stub

The schema (`services/supabase/schema.sql`) and every
`services/supabase/*.ts` typed-access file are real, RLS-scoped, and
match what the client stores locally. **What's missing is auth
identity**: every write uses the literal string `"local-guest"` as
`profile_id` instead of a real authenticated user id, because no
sign-in flow has been built yet. This means:

- The database schema, RLS policies, and query functions are
  production-shaped and ready to use.
- No batch has actually exercised them against a live Supabase project
  with a real user — they're **typed, unused-in-anger client code**
  until a real auth/profile flow exists.
- Every write is wrapped best-effort (try/catch swallowed, or a
  `.catch(() => null)` equivalent) so the app **never blocks on
  Supabase** — local Zustand state is always the source of truth the
  UI reads from.

See `KNOWN_LIMITATIONS.md` and `DEPLOYMENT_GUIDE.md` for exactly what
turning this from stub to real requires.

## 6. Asset System

`assets/registry.ts` maps every `AssetId` to a `require()`d source (or
`null` today). No component or business logic references a raw
filename — always `AssetId` + `<AssetImage id={...} />`. See
`ASSET_REPLACEMENT_GUIDE.md` for the exact swap procedure.

## 7. What "Done" Means Per World

| World | Status |
|---|---|
| Grove | Real — hub, Companion, ambient life, gateways, status |
| Missions | Real — photo-submission quest loop, mock AI verification |
| Tale Trails | Real — cinematic player, 1 branching choice model, 2 playable + 2 sealed episodes |
| Treasure Hunt | Real — camera-based hunt, mock AR abstraction (see limitations) |
| The Beyond | Real — 1 fully interactive region, 4 sealed regions across all 4 content categories |
| Companion's Closet | Real — cosmetic browse/buy/equip, 3-currency-safe |
| The Vault | Real — Collector-Token redemption browse/request, explicit no-payment placeholder hand-off |

"Real" means: reachable from Grove, fully navigable, state persists,
rewards connect to the shared progression/Companion system, no dead
buttons. It does **not** mean production art, production AI, or a
live backend — see `KNOWN_LIMITATIONS.md` for the honest line between
those.
