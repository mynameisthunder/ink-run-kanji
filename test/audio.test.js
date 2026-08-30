import test from "node:test";
import assert from "node:assert/strict";

import { pickJapaneseVoice } from "../src/audio.js";

const voice = (name, lang = "ja-JP", voiceURI = name) => ({ name, lang, voiceURI });

test("natural Kyoko is preferred over Apple's novelty Japanese voices", () => {
  const selected = pickJapaneseVoice([
    voice("Eddy (Japanese (Japan))"),
    voice("Grandma (Japanese (Japan))"),
    voice("Kyoko"),
  ]);
  assert.equal(selected.name, "Kyoko");
});

test("a natural Japanese voice is used when a preferred voice is unavailable", () => {
  const selected = pickJapaneseVoice([
    voice("Flo (Japanese (Japan))"),
    voice("Standard Japanese"),
    voice("Samantha", "en-US"),
  ]);
  assert.equal(selected.name, "Standard Japanese");
});

test("Google Japanese is preferred across non-Apple platforms", () => {
  const selected = pickJapaneseVoice([
    voice("Generic Japanese"),
    voice("Google 日本語"),
  ]);
  assert.equal(selected.name, "Google 日本語");
});
