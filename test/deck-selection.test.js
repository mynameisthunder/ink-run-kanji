import test from "node:test";
import assert from "node:assert/strict";

import { dynamicDeckIsDisabled } from "../src/deck-selection.js";

test("an empty dynamic deck stays enabled while selected so it can be removed", () => {
  assert.equal(dynamicDeckIsDisabled(0, true), false);
});

test("an unselected dynamic deck is disabled until it contains words", () => {
  assert.equal(dynamicDeckIsDisabled(0, false), true);
  assert.equal(dynamicDeckIsDisabled(1, false), false);
});
