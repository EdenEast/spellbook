import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { lint } from "../lint.ts";

const sha = "a".repeat(40);

async function write(root: string, files: Record<string, string>) {
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), content);
  }
}

// A checkout with one adopted skill, one reference collection, and their license.
const valid: Record<string, string> = {
  "skills/README.md": "# Skills\n\n| Skill | Use when |\n| --- | --- |\n| [example](example/SKILL.md) | Reviewing examples. |\n",
  "skills/example/SKILL.md": "---\nname: example\ndescription: Use for examples.\n---\n\nSee [the helper](scripts/check.sh) and [docs](https://example.org).\n",
  "skills/example/scripts/check.sh": "#!/bin/sh\n",
  "skills/example/SOURCE.toml": [
    "schema_version = 1", 'mode = "adopt"', "", "[upstream]",
    'repository = "https://example.org/project.git"', 'path = "skills/example"',
    `base_revision = "${sha}"`, 'license = "../../licenses/project.txt"',
  ].join("\n"),
  "references/notes/README.md": "| Note | When |\n| --- | --- |\n| [First](first.md) | Always. |\n",
  "references/notes/first.md": "# First\n",
  "references/notes/SOURCE.toml": [
    'repository = "https://example.org/project"', 'path = "notes"', `commit = "${sha}"`,
    'license = "../../licenses/project.txt"', "", "[files]", '"first.md" = "notes/first.md"',
  ].join("\n"),
  "licenses/project.txt": "MIT License\n",
  "licenses/README.md": [
    "| License | Upstream file | Checked at | Used by |", "| --- | --- | --- | --- |",
    `| [project.txt](project.txt) | [example/project](https://example.org/project) \`LICENSE\` | \`${sha}\` | \`references/notes\`, \`skills/example\` |`,
  ].join("\n"),
};

async function checkout(t: { after: (fn: () => Promise<void>) => void }, files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), "spellbook-content-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await write(root, files);
  return root;
}

test("this checkout satisfies the content rules", async () => {
  assert.deepEqual(await lint(join(import.meta.dirname, "../..")), []);
});

test("a consistent checkout has no problems", async (t) => {
  assert.deepEqual(await lint(await checkout(t, valid)), []);
});

test("each broken rule is reported with its location", async (t) => {
  const root = await checkout(t, {
    ...valid,
    "skills/example/SKILL.md": "---\nname: sample\n---\n\nSee [the helper](scripts/missing.sh).\n",
    "skills/example/SOURCE.toml": valid["skills/example/SOURCE.toml"]
      .replace(sha, "abc1234").replace("../../licenses/project.txt", "LICENSE"),
    "skills/example/LICENSE": "MIT License\n",
    "skills/other/SOURCE.toml": 'schema_version = 1\nmode = "adapt"\nsources = [1]\n',
    "skills/other/SKILL.md": "---\nname: other\ndescription: >\n  Folded description.\n---\n",
    "references/notes/second.md": "# Second\n",
    "licenses/stray.txt": "Unlisted\n",
  });
  // Report order is not part of the contract.
  assert.deepEqual((await lint(root)).sort(), [
    "skills/other/SOURCE.toml: line 3: unsupported value: [1]",
    "skills/README.md: catalog does not link other/SKILL.md",
    'skills/example/SKILL.md: frontmatter name must be "example", found "sample"',
    "skills/example/SKILL.md: frontmatter needs a non-empty description",
    "references/notes/SOURCE.toml: second.md is not mapped in [files]",
    "references/notes/README.md: index does not link second.md",
    "skills/example/SOURCE.toml: upstream.base_revision must be a full 40-character commit SHA",
    "licenses/README.md: licenses/stray.txt is not listed",
    "licenses/README.md: skills/example is listed as using licenses/project.txt, but its SOURCE.toml does not cite it",
    "skills/example/LICENSE: keep licenses in licenses/, not beside resources",
    "skills/example/SKILL.md: broken link scripts/missing.sh",
  ].sort());
});

test("the active-skill catalog must include every discovered skill", async (t) => {
  const root = await checkout(t, { ...valid, "skills/README.md": "# Skills\n" });
  assert.deepEqual(await lint(root), ["skills/README.md: catalog does not link example/SKILL.md"]);
  await write(root, { "skills/README.md": valid["skills/README.md"] });
  assert.deepEqual(await lint(root), []);
});

test("a license outside licenses/ is reported once the record parses", async (t) => {
  const root = await checkout(t, {
    ...valid,
    "skills/example/SOURCE.toml": valid["skills/example/SOURCE.toml"].replace("../../licenses/project.txt", "LICENSE"),
  });
  assert.deepEqual(await lint(root), [
    "skills/example/SOURCE.toml: license must point into licenses/, found skills/example/LICENSE",
    "licenses/README.md: skills/example is listed as using licenses/project.txt, but its SOURCE.toml does not cite it",
  ]);
});
