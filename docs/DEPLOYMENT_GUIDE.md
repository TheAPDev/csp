# WONDERKIN — Deployment Guide

This describes what it takes to move WONDERKIN from "builds clean in
this sandbox" to "running on a real device" and eventually "shipped."
It is a checklist grounded in what this audit actually verified —
not a generic Expo tutorial.

## What's confirmed working today

- `npm install` — clean, no missing peer deps.
- `npx tsc --noEmit` — 0 errors across all 155 source files.
- `npx expo export --platform android` and `--platform ios` — both
  produce a clean Hermes bundle (1345 / ~1347 modules).
- `npx expo config --type public` — resolves without error, including
  the plugin-derived Android permission list (camera, audio, coarse +
  fine location) matching what `app.json`'s plugins declare.
- App icon — `app.json` pointed at
  `src/assets/images/icon-placeholder.png`, which **did not exist**
  (an empty `.gitkeep` was the only file in that directory). Fixed
  this batch: a real theme-matching placeholder PNG now exists there.
  This would have failed an actual `eas build`/`expo prebuild` even
  though it never surfaced in `expo export` (which doesn't validate
  the icon).

## What has never been tested

- **Running on an actual device or simulator.** This sandbox has no
  iOS/Android runtime. Every "test" performed across all 10 batches is
  static: typecheck + bundle export + manual code-tracing. Before any
  real release, someone needs to run this on a physical device or
  simulator and click through all 7 Worlds.
- **A live Supabase project.** The schema and typed access layer are
  real and match client state shapes, but no batch has run them
  against an actual Supabase instance — there could be a typo in a
  column name or a policy that's subtly wrong that only a live query
  would surface.
- **EAS Build.** Never invoked in this sandbox (no Apple/Google
  credentials, no EAS project configured — `app.json`'s
  `extra.eas` is empty).

## Steps to a real running build

1. **Supabase project.**
   - Create a project, run `src/services/supabase/schema.sql` against
     it.
   - Copy `.env.example` to `.env` and fill in `EXPO_PUBLIC_SUPABASE_URL`
     / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — `services/supabase/client.ts`
     already reads these from `process.env` and warns loudly at
     startup if they're missing, so this part needs no code change,
     just real values. For EAS builds, set the same two variables as
     EAS secrets rather than committing a `.env` file.
2. **Auth flow.** Build a real sign-in screen and wire it to Supabase
   Auth. Replace every `"local-guest"` literal (11 call sites,
   grep for it) with the real authenticated user's id. This is the
   single largest piece of unfinished plumbing in the app — see
   `KNOWN_LIMITATIONS.md`.
3. **Real art.** Follow `ASSET_REPLACEMENT_GUIDE.md`. The app is fully
   functional today with placeholder art, so this can happen in
   parallel with other work, not as a blocker.
4. **EAS setup.**
   ```
   npx eas login
   npx eas build:configure
   ```
   This will populate `app.json`'s `extra.eas.projectId`. Follow
   Expo's standard `eas build --platform ios` / `--platform android`
   from there — nothing WONDERKIN-specific changes this part.
5. **Device QA pass.** Before shipping, manually verify (none of this
   was possible in this sandbox):
   - Small phone + large phone/tablet-ish screens, portrait only
     (the app is portrait-locked in `app.json`).
   - Safe area insets on a notched device.
   - Camera permission: grant, deny, and "don't ask again" paths in
     both Missions and Treasure Hunt.
   - Location permission denial (Treasure Hunt should fall back to
     the default biome — verified in code, not on-device).
   - Airplane mode / slow network while a Supabase write is in flight
     — every write is wrapped best-effort and should not block the
     UI, but this has only been verified by reading the code, not by
     inducing real network failure on a device.
   - Force-quit and relaunch — confirm Zustand `persist` state (Grove
     progress, Companion, currencies, per-World completion) survives.
   - VoiceOver/TalkBack pass — flagged as untested in
     `KNOWN_LIMITATIONS.md`.
6. **Add a real test suite.** No Jest/RNTL tests exist. Before
   shipping, especially cover: currency-safety logic in
   `closetStore.purchase` / `vaultStore.requestRedemption` (the
   balance-can-never-go-negative guarantees are currently only
   verified by reading the code), and the reward/progression
   centralization in `companionMoments.ts`.
7. **Fix the `lint` script.** `npm run lint` currently fails — no
   ESLint config exists in the repo (see `KNOWN_LIMITATIONS.md`). Add
   a config before relying on it in CI.

## Environment variables / secrets checklist

`.env.example` already documents the two required variables
(`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) and
`services/supabase/client.ts` already reads them via `process.env`
with a startup warning if missing — this part of the deployment story
is already done correctly, just needs real values supplied at deploy
time (local `.env` for dev, EAS secrets for CI/build). The one
remaining credential need:

- Whatever credential a real `MissionVerificationService`
  implementation needs, once one replaces the mock.

## Do not do these things when deploying

Per the master protocol, still true at ship time:

- Do not add Parent Space, real-money payment rails, or collect any
  payment information from the child directly in-app — `Vault`'s
  `ParentHandoffScreen` is deliberately a dead-end placeholder for
  this reason.
- Do not store or transmit exact child location — only the coarse
  biome bucket `getCoarseBiome()` already produces.
- Do not surface any AI-confidence/technical verification language to
  the child, even once real AI verification replaces the mock.
