# INK RUN

A focused kanji reading game with frequency decks, 60 Extra 1 words, and the complete 150-word RealKana JLPT N5 set.

## Study loop

- See the kanji and type its reading in hiragana or romaji.
- Correct answers reveal the full meaning.
- Missed answers reveal the reading and character breakdown, then return later.
- Study focused ten-word decks before testing recall.
- Hear every word pronounced in Japanese.
- Click any displayed kanji to open its Jisho entry.
- Star words to build a persistent Favorites deck with a dedicated Study Starred route.
- Review every seen word in the Done deck, with per-word attempts and recall accuracy.
- Practice misses in a Needs Work deck until recall reaches 75% or two correct answers in a row.
- Sign in by email to sync stars, recall history, recovery streaks, and manual Needs Work removals across devices.

## Persistence

INK RUN always saves favorites, seen words, correct recalls, misses, recovery streaks, and Needs Work state in browser `localStorage`, so the core game keeps working offline. Optional sign-in syncs that progress to Supabase. Existing local progress is migrated on first sign-in, and per-device snapshots safely upload later offline recalls without counting the same recall twice.

The public browser key in `cloud-config.js` is intentionally publishable. Privileged keys are never shipped to the client. Database access is protected by Row Level Security, and writes are limited to the authenticated RPC functions in `supabase/schema.sql`.

## Architecture

The app uses native browser modules with no framework or build step:

- `app.js` — UI and game-flow orchestration
- `src/vocabulary.js` — vocabulary assembly, deduplication, and deck definitions
- `src/progress.js` — mastery and Needs Work rules
- `src/storage.js` — local progress and sync snapshots
- `src/cloud-sync.js` — offline-first Supabase reconciliation
- `src/kana.js` — romaji conversion and answer normalization
- `src/audio.js` — bundled pronunciation, speech fallback, and feedback tones
- `src/effects.js` — visual effects

Generated vocabulary files export data directly into the module graph. `cloud.js` remains the small Supabase SDK adapter loaded before the application module.

## Run locally

```bash
npm run dev
```

Then open <http://localhost:4173>.

The game has no runtime dependencies and can also be served as a static site.
