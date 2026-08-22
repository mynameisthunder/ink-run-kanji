import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = globalThis;
vm.runInThisContext(readFileSync(join(projectRoot, "numbers-data.js"), "utf8"));

const outputDir = join(projectRoot, "audio", "numbers");
const workDir = mkdtempSync(join(tmpdir(), "ink-run-number-audio-"));
mkdirSync(outputDir, { recursive: true });

try {
  for (const item of globalThis.INK_RUN_NUMBER_IMPORTS) {
    const aiffPath = join(workDir, "voice.aiff");
    const wavPath = join(projectRoot, item.audioSrc);
    execFileSync("say", ["-v", "Kyoko", "-r", "165", "-o", aiffPath, "--", item.reading]);
    execFileSync("afconvert", ["-f", "WAVE", "-d", "LEI16@22050", "-c", "1", aiffPath, wavPath]);
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

console.log(`Generated ${globalThis.INK_RUN_NUMBER_IMPORTS.length} Japanese number audio files.`);
