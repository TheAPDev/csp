# WONDERKIN — Asset Replacement Guide

WONDERKIN currently ships with **zero real illustrated art or audio**.
Every one of the 97 registered `AssetId`s (`src/assets/registry.ts`)
resolves to `source: null`, and `<AssetImage>` renders a themed
placeholder block instead of crashing. This guide is how to replace
any of them with final art — and confirms, as this batch's audit, that
doing so never touches navigation, business logic, state, progression,
or the database.

## The rule every batch has followed

> No component or business logic may reference a raw filename. Always
> go through an `AssetId` and `<AssetImage id={...} />` (or
> `getAsset(id)` for non-Image uses).

This audit re-verified it: a repo-wide grep for `require(` outside
`src/assets/registry.ts` returns **zero results**. Every image
reference in all 155 source files goes through the registry.

## How to replace one asset

1. Drop the real file into `src/assets/images/` (or
   `src/assets/audio/` — no audio is wired to any player yet, but the
   registry already reserves the category for when it is).
2. Open `src/assets/registry.ts` and find the `AssetId`'s entry, e.g.:
   ```ts
   COMPANION_HAPPY: { kind: "image", source: null },
   ```
3. Change `source: null` to a **static literal** `require(...)`:
   ```ts
   COMPANION_HAPPY: { kind: "image", source: require("./images/companion-happy.png") },
   ```
   Metro cannot resolve a dynamic `require()` path — it must be a
   literal string at that exact call site. Do not build a helper that
   constructs the path from the `AssetId` string.
4. That's it. No other file changes. `<AssetImage id="COMPANION_HAPPY">`
   call sites across Grove, Missions, onboarding, etc. all pick up the
   new art automatically — none of them know or care whether the id
   resolves to a placeholder or final art.

## Batches of assets, grouped by what they're for

Real art can be commissioned/dropped in incrementally, in any order —
nothing requires all 97 at once. Suggested priority if sequencing:

1. **Companion portraits** (`COMPANION_*`, 12 mood states) — highest
   visual impact, appears on nearly every screen.
2. **World backgrounds** (`GROVE_BACKGROUND`, `MISSIONS_BACKGROUND`,
   `TALE_TRAILS_BACKGROUND`, `TREASURE_HUNT_BACKGROUND`,
   `THE_BEYOND_BACKGROUND`, `CLOSET_BACKGROUND`, `VAULT_BACKGROUND`,
   plus the 3 Grove evolution-stage variants) — second highest impact.
3. **World gateway portal art** (`GATEWAY_*`, 6 entries) — the Grove's
   primary navigation surface.
4. **Per-World content thumbnails** (mission category icons, Tale
   Trails episode backgrounds, Beyond region cards, Closet catalog
   items, Vault reward cards) — largest count, lowest individual
   impact, safe to batch over time.
5. **Reward/UI iconography** (`REWARD_*`, `ICON_*`) — small, numerous,
   low individual risk.
6. **Grove decoration ornaments** (`GROVE_DECOR_*`, 6 entries) — purely
   decorative, zero functional risk if delayed indefinitely.

## What replacing art does NOT require touching

Verified this batch by inspection, not just asserted:

- **Navigation** — `WorldRegistry`/`RootNavigator`/`transitionVariant.ts`
  reference `AssetId`s, never filenames.
- **Business logic** — reward, progression, and completion logic never
  branches on which asset is loaded.
- **State** — no Zustand store stores an asset path.
- **Database** — `schema.sql` never stores an asset filename; the one
  place content references art (`content/*.ts` seed files, e.g.
  `missionDefinitions.ts`) stores an `AssetId`, which is exactly the
  indirection this system exists for.
- **Component architecture** — swapping `source: null` for a real
  `require()` requires zero prop/type changes anywhere, since
  `AssetImage`'s contract (`{ id: AssetId }`) never changes.

## Typography

`src/theme/typography.ts` is the only file that should ever set
`fontFamily`. It currently uses the system font. Swapping in a
licensed display face (per the continuity doc's original plan) means
adding the font file, loading it via `expo-font` in the app root, and
changing the `fontFamily` values in that one file — no component
should hardcode a font family.
