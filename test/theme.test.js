import test from "node:test";
import assert from "node:assert/strict";

import { nextTheme, resolveTheme } from "../src/theme.js";

test("a saved theme wins over the device preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("the device preference supplies the initial theme", () => {
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
});

test("theme toggling alternates between light and dark", () => {
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("dark"), "light");
});
