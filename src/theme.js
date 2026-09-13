export const THEME_STORAGE_KEY = "ink-run-theme";

export function resolveTheme(storedTheme) {
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return "dark";
}

export function nextTheme(theme) {
  return theme === "dark" ? "light" : "dark";
}
