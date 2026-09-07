import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../dungeon-game/index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../dungeon-game/dungeon-game.js", import.meta.url), "utf8");

test("dungeon hints expose dictionary and kana lookup icons", () => {
  assert.match(html, /id="hintJishoLink"[^>]+target="_blank"[^>]+rel="noopener noreferrer"/);
  assert.match(html, /id="hintKanaLink"[^>]+target="_blank"[^>]+rel="noopener noreferrer"/);
  assert.match(html, /Jisho dictionary/);
  assert.match(html, /Kana and reading lookup/);
  assert.match(script, /jisho\.org\/search\/\$\{encodedWord\}/);
  assert.match(script, /romajidesu\.com\/kanji\/\$\{encodedWord\}/);
});
