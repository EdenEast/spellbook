import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { formatReports, upstreamStatus } from "../upstream.ts";

async function write(root: string, files: Record<string, string>) {
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), content);
  }
}

// A local upstream stands in for a remote; no network or active homes are used.
test("reports upstream changes since an adopted skill's baseline", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "spellbook-upstream-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const upstream = join(directory, "upstream");
  const root = join(directory, "checkout");
  const git = (...args: string[]) => {
    const result = spawnSync("git", ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", ...args], {
      cwd: upstream, encoding: "utf8",
      env: { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" },
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const commit = async (files: Record<string, string>, remove: string[] = []) => {
    await write(upstream, files);
    for (const path of remove) git("rm", "--quiet", path);
    git("add", ".");
    git("commit", "--quiet", "-m", "change");
    return git("rev-parse", "HEAD");
  };

  await mkdir(upstream);
  git("init", "--quiet");
  const base = await commit({
    "LICENSE": "MIT\n",
    "skills/example/SKILL.md": "---\nname: example\ndescription: Example.\n---\nUse the upstream harness.\n",
    "skills/example/helper.sh": "echo old\n",
    "skills/example/notes.md": "Notes.\n",
    "skills/unrelated/SKILL.md": "Elsewhere.\n",
  });
  const target = await commit({
    "LICENSE": "MIT, revised\n",
    "skills/example/SKILL.md": "---\nname: example\ndescription: Example.\n---\nUse the upstream harness and report.\n",
    "skills/example/references/new.md": "New dependency.\n",
    "skills/unrelated/SKILL.md": "Elsewhere, changed.\n",
  }, ["skills/example/notes.md"]);

  await write(root, {
    "skills/example/SKILL.md": "---\nname: example\ndescription: Example.\n---\nUse any available harness.\n",
    "skills/example/helper.sh": "echo old\n",
    "skills/example/notes.md": "Notes.\n",
    "skills/example/SOURCE.toml": [
      "schema_version = 1", 'mode = "adopt"', "", "[upstream]",
      `repository = ${JSON.stringify(upstream)}`, 'path = "skills/example"',
      `base_revision = "${base}"`, 'license = "../../licenses/fixture.txt"',
    ].join("\n"),
    "licenses/fixture.txt": "MIT\n",
    "licenses/README.md": `| [fixture.txt](fixture.txt) | [fixture](https://example.invalid) \`LICENSE\` | \`${base}\` | \`skills/example\` |\n`,
  });

  const reports = await upstreamStatus({ root, cacheDir: join(directory, "cache"), paths: ["skills/example"] });
  assert.deepEqual(reports, [{
    directory: "skills/example",
    kind: "adopt",
    source: undefined,
    repository: upstream,
    from: base,
    to: target,
    changes: [
      { status: "modified", upstream: "skills/example/SKILL.md", local: "SKILL.md", localEdits: true },
      { status: "deleted", upstream: "skills/example/notes.md", local: "notes.md", localEdits: false },
      { status: "added", upstream: "skills/example/references/new.md", local: undefined },
    ],
    unmappedChanges: 0,
    license: "changed upstream",
  }]);

  // Pinning the target at the baseline reports nothing to integrate.
  const current = await upstreamStatus({ root, cacheDir: join(directory, "cache"), to: base, offline: true });
  assert.equal(formatReports(current), `skills/example (adopt) ${upstream} ${base.slice(0, 12)}..${base.slice(0, 12)}: up to date`);
});
