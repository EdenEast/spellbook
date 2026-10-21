// Renders the principle trigger list in the global instructions from the
// principles index, so agents see every trigger without reading the index.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
export const indexPath = join(root, "references/principles/README.md");
export const instructionsPath = join(root, "instructions/AGENTS.md");

const begin = "<!-- principles:begin -->";
const end = "<!-- principles:end -->";
const row = /^\| \[[^\]]+\]\(([a-z0-9-]+)\.md\) \| ([^|]+?) \| [^|]+ \|$/;

/** One line per index row: the document name and its "When to use" trigger. */
export function renderTriggers(index: string): string {
  const lines = index.split("\n").filter((line) => line.startsWith("| ["));
  if (lines.length === 0) throw new Error("principles index has no principle rows");
  return lines.map((line) => {
    const match = row.exec(line);
    if (!match) throw new Error(`unrecognized principles index row: ${line}`);
    return `- \`${match[1]}\`: ${match[2]}`;
  }).join("\n");
}

/** Replaces the generated block between the markers, keeping surrounding text. */
export function withTriggers(instructions: string, triggers: string): string {
  const start = instructions.indexOf(begin);
  const stop = instructions.indexOf(end);
  if (start === -1 || stop < start) throw new Error("instructions lack the principles trigger markers");
  return `${instructions.slice(0, start)}${begin}\n${triggers}\n${instructions.slice(stop)}`;
}

if (import.meta.main) {
  const current = await readFile(instructionsPath, "utf8");
  await writeFile(instructionsPath, withTriggers(current, renderTriggers(await readFile(indexPath, "utf8"))));
}
