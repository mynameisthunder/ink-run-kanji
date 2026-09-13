import test from "node:test";
import assert from "node:assert/strict";

import { nextTheme, resolveTheme } from "../src/theme.js";

test("a saved theme wins over the dark default", () => {
  assert.equal(resolveTheme("light"), "light");
  assert.equal(resolveTheme("dark"), "dark");
});

test("dark is the initial theme when no preference is saved", () => {
  assert.equal(resolveTheme(null), "dark");
  assert.equal(resolveTheme(undefined), "dark");
});

test("theme toggling alternates between light and dark", () => {
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("dark"), "light");
});
