import test from "node:test";
import assert from "node:assert/strict";

import { parseRoute, selectionUrl, studyUrl, wordUrl } from "../src/routes.js";

const deckKeys = ["all", "41-50", "n5-1-10", "favorites"];

test("deck selections round-trip through the URL", () => {
  const url = selectionUrl("https://example.com/ink-run/?old=1", ["41-50", "n5-1-10"]);
  assert.equal(url.search, "?old=1&decks=41-50%2Cn5-1-10");
  assert.deepEqual(parseRoute(url, deckKeys).decks, ["41-50", "n5-1-10"]);
});

test("study routes preserve the selected decks and card", () => {
  const url = studyUrl("https://example.com/ink-run/", ["41-50"], 7);
  assert.deepEqual(parseRoute(url, deckKeys), {
    decks: ["41-50"],
    view: "study",
    card: 7,
    word: null,
  });
});

test("word routes are standalone and support namespaced word keys", () => {
  const url = wordUrl("https://example.com/ink-run/?decks=41-50&view=study&card=3", "numbers:一日");
  assert.equal(url.searchParams.get("word"), "numbers:一日");
  assert.equal(url.searchParams.has("decks"), false);
  assert.equal(url.searchParams.has("view"), false);
  assert.equal(url.searchParams.has("card"), false);
});

test("invalid route values fall back safely", () => {
  assert.deepEqual(parseRoute("https://example.com/?decks=nope&view=recall&card=-9", deckKeys), {
    decks: ["all"],
    view: null,
    card: 0,
    word: null,
  });
});
