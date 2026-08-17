# INK RUN

A focused kanji reading game for frequency words 41–150, plus 60 words in separate Extra 1 vocabulary decks.

## Study loop

- See the kanji and type its reading in hiragana or romaji.
- Correct answers reveal the full meaning.
- Missed answers reveal the reading and character breakdown, then return later.
- Study focused ten-word decks before testing recall.
- Hear every word pronounced in Japanese.
- Click any displayed kanji to open its Jisho entry.
- Star words to build a persistent Favorites deck with a dedicated Study Starred route.
- Sign in by email to sync stars and recall history across devices.

## Persistence

INK RUN always saves favorites in browser `localStorage`, so the core game keeps working offline. Optional sign-in syncs favorites plus correct/missed recall counts to Supabase. Existing local favorites are migrated on first sign-in and reconciled against the last successful cloud snapshot on later visits.

The public browser key in `cloud-config.js` is intentionally publishable. Privileged keys are never shipped to the client. Database access is protected by Row Level Security, and writes are limited to the authenticated RPC functions in `supabase/schema.sql`.

## Run locally

```bash
npm run dev
```

Then open <http://localhost:4173>.

The game has no runtime dependencies and can also be served as a static site.
