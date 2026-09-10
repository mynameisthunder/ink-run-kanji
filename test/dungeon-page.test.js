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

test("a defeated enemy reveals its complete study card until Next is clicked", () => {
  assert.match(html, /id="victoryRecap"[^>]+aria-live="polite"[^>]+hidden/);
  assert.match(html, /id="victoryRecapReading"/);
  assert.match(html, /id="victoryRecapMeaning"/);
  assert.match(html, /id="victoryRecapBreakdown"/);
  assert.match(html, /id="victoryRecapMemory"/);
  assert.match(html, /id="victoryRecapContinue"[^>]*>NEXT/);
  assert.match(script, /showVictoryRecap\(enemy, result\.state\)/);
  assert.match(script, /victoryRecapContinue\.addEventListener\("click", finishVictoryRecap\)/);
  assert.doesNotMatch(script, /setTimeout\(finishVictoryRecap/);
});
