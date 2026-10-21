import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { indexPath, instructionsPath, renderTriggers, withTriggers } from "../principles.ts";

test("global instructions list every principle trigger from the index", async () => {
  const instructions = await readFile(instructionsPath, "utf8");
  const triggers = renderTriggers(await readFile(indexPath, "utf8"));
  assert.equal(withTriggers(instructions, triggers), instructions, "run `npm run principles:sync`");
});

test("a changed trigger replaces only the generated block", () => {
  const index = [
    "| Principle | When to use | Rule |",
    "| --- | --- | --- |",
    "| [Prove it works](prove-it-works.md) | Before claiming success. | Check the result. |",
  ].join("\n");
  const instructions = [
    "## Principles",
    "<!-- principles:begin -->",
    "- `prove-it-works`: Stale trigger.",
    "<!-- principles:end -->",
    "## Next",
  ].join("\n");
  const updated = withTriggers(instructions, renderTriggers(index));
  assert.equal(updated, instructions.replace("Stale trigger.", "Before claiming success."));
});
