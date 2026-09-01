import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { JLPT_SAMPLE_GROUPS } from "../jlpt-sample-data.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectRoot, "audio", "jlpt-samples");
const workDir = mkdtempSync(join(tmpdir(), "ink-run-jlpt-sample-audio-"));
mkdirSync(outputDir, { recursive: true });

try {
  JLPT_SAMPLE_GROUPS.forEach((group) => group.audioReadings.forEach((reading, index) => {
    const aiffPath = join(workDir, "voice.aiff");
    const wavPath = join(outputDir, `${group.key}-${String(index + 1).padStart(2, "0")}.wav`);
    execFileSync("say", ["-v", "Kyoko", "-r", "165", "-o", aiffPath, "--", reading]);
    execFileSync("afconvert", ["-f", "WAVE", "-d", "LEI16@22050", "-c", "1", aiffPath, wavPath]);
  }));
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

console.log(`Generated ${JLPT_SAMPLE_GROUPS.length * 10} Japanese JLPT starter audio files.`);
