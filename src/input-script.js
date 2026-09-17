import { romajiToKana } from "./kana.js";

const INPUT_SCRIPT_STORAGE_KEY = "ink-run-input-script-v1";
const HIRAGANA_INPUT = "hiragana";
const KATAKANA_INPUT = "katakana";

function availableStorage() {
  try {
    return globalThis.window?.localStorage ?? null;
  } catch {
    return null;
  }
}

function loadInputScript(storage = availableStorage()) {
  try {
    return storage?.getItem(INPUT_SCRIPT_STORAGE_KEY) === KATAKANA_INPUT
      ? KATAKANA_INPUT
      : HIRAGANA_INPUT;
  } catch {
    return HIRAGANA_INPUT;
  }
}

function saveInputScript(script, storage = availableStorage()) {
  try {
    storage?.setItem(INPUT_SCRIPT_STORAGE_KEY, script);
  } catch {
    // The setting still works for this session when storage is unavailable.
  }
}

function toggleInputScript(script) {
  return script === KATAKANA_INPUT ? HIRAGANA_INPUT : KATAKANA_INPUT;
}

function convertReadingInput(value, script, finalize = false) {
  return romajiToKana(value, script, finalize);
}

export {
  HIRAGANA_INPUT,
  INPUT_SCRIPT_STORAGE_KEY,
  KATAKANA_INPUT,
  convertReadingInput,
  loadInputScript,
  saveInputScript,
  toggleInputScript,
};
