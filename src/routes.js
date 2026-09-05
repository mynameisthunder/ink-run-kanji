const ROUTE_PARAMS = ["decks", "view", "card", "word"];

function appUrl(href) {
  return new URL(href, "https://ink-run.invalid/");
}

function normalizedDeckKeys(deckKeys) {
  const unique = [...new Set(deckKeys)];
  return unique.includes("all") ? ["all"] : unique;
}

function setDeckParams(url, deckKeys) {
  const keys = normalizedDeckKeys(deckKeys);
  if (keys.length === 1 && keys[0] === "all") url.searchParams.delete("decks");
  else url.searchParams.set("decks", keys.join(","));
}

export function parseRoute(href, validDeckKeys) {
  const url = appUrl(href);
  const valid = new Set(validDeckKeys);
  const requestedDecks = (url.searchParams.get("decks") ?? "")
    .split(",")
    .filter((key) => valid.has(key));
  const decks = normalizedDeckKeys(requestedDecks.length ? requestedDecks : ["all"]);
  const requestedCard = Number.parseInt(url.searchParams.get("card") ?? "0", 10);

  return {
    decks,
    view: url.searchParams.get("view") === "study" ? "study" : null,
    card: Number.isFinite(requestedCard) && requestedCard >= 0 ? requestedCard : 0,
    word: url.searchParams.get("word") || null,
  };
}

export function selectionUrl(href, deckKeys) {
  const url = appUrl(href);
  ROUTE_PARAMS.forEach((param) => url.searchParams.delete(param));
  setDeckParams(url, deckKeys);
  return url;
}

export function studyUrl(href, deckKeys, card = 0) {
  const url = selectionUrl(href, deckKeys);
  url.searchParams.set("view", "study");
  if (card > 0) url.searchParams.set("card", String(card));
  return url;
}

export function dungeonUrl(href, deckKeys) {
  const current = appUrl(href);
  const url = new URL("dungeon-game/", current);
  url.search = "";
  url.hash = "";
  setDeckParams(url, deckKeys);
  return url;
}

export function wordUrl(href, wordKey) {
  const url = appUrl(href);
  ROUTE_PARAMS.forEach((param) => url.searchParams.delete(param));
  url.searchParams.set("word", wordKey);
  return url;
}
