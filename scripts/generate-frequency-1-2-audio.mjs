import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FREQUENCY_2_IMPORTS } from "../frequency2-data.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectRoot, "audio", "frequency-1-2");
const workDir = mkdtempSync(join(tmpdir(), "ink-run-frequency-1-2-audio-"));
mkdirSync(outputDir, { recursive: true });

try {
  for (const item of FREQUENCY_2_IMPORTS) {
    const aiffPath = join(workDir, "voice.aiff");
    const wavPath = join(projectRoot, item.audioSrc);
    execFileSync("say", ["-v", "Kyoko", "-r", "165", "-o", aiffPath, "--", item.reading]);
    execFileSync("afconvert", ["-f", "WAVE", "-d", "LEI16@22050", "-c", "1", aiffPath, wavPath]);
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

console.log(`Generated ${FREQUENCY_2_IMPORTS.length} Japanese Frequency Level 1:2 audio files.`);
