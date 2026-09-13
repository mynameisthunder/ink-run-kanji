export const THEME_STORAGE_KEY = "ink-run-theme";

export function resolveTheme(storedTheme, prefersDark = false) {
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return prefersDark ? "dark" : "light";
}

export function nextTheme(theme) {
  return theme === "dark" ? "light" : "dark";
}
