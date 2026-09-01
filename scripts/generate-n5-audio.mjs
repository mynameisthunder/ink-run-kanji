import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { KANJI_BY_WORD, REAL_KANA_N5_WORDS } from "../src/vocabulary.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectRoot, "audio", "n5");
const workDir = mkdtempSync(join(tmpdir(), "ink-run-n5-audio-"));
mkdirSync(outputDir, { recursive: true });

try {
  REAL_KANA_N5_WORDS.forEach((word, index) => {
    const item = KANJI_BY_WORD.get(word);
    if (!item) throw new Error(`Missing N5 card for ${word}`);
    const reading = (item.kana ?? [item.reading])[0];
    const aiffPath = join(workDir, "voice.aiff");
    const wavPath = join(outputDir, `${String(index + 1).padStart(3, "0")}.wav`);
    execFileSync("say", ["-v", "Kyoko", "-r", "165", "-o", aiffPath, "--", reading]);
    execFileSync("afconvert", ["-f", "WAVE", "-d", "LEI16@22050", "-c", "1", aiffPath, wavPath]);
  });
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

console.log(`Generated ${REAL_KANA_N5_WORDS.length} Japanese N5 audio files.`);
