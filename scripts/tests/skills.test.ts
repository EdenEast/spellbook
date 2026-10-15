import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, cp, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { run } from "../install.ts";

const fixtures = join(import.meta.dirname, "fixtures");

async function makeWritable(path: string): Promise<void> {
  const info = await stat(path);
  await chmod(path, info.mode | 0o200);
  if (info.isDirectory()) {
    for (const entry of await readdir(path)) await makeWritable(join(path, entry));
  }
}

async function copyTree(source: string, destination: string): Promise<void> {
  await cp(source, destination, { recursive: true });
  // Store-backed fixtures retain read-only permissions; only edit temporary copies.
  await makeWritable(destination);
}

// Exercise the documented agent-assisted recipe against a real local upstream,
// then observe the result through installer links. No network or active homes.
test("adapted and adopted skills remain usable through a reviewed upstream update", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "spellbook-lifecycle-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const repository = join(directory, "upstream");
  const root = join(directory, "checkout");
  const home = join(directory, "home");
  await mkdir(repository);
  await mkdir(home);
  await copyTree(join(fixtures, "upstream/example"), join(repository, "example"));
  const git = (...args: string[]) => {
    const result = spawnSync("git", args, {
      cwd: repository, encoding: "utf8",
      env: { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" },
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git("init", "--quiet");
  git("add", ".");
  git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-m", "baseline");
  const base = git("rev-parse", "HEAD");
  const adopted = join(root, "skills/example");
  await copyTree(join(repository, "example"), adopted);
  const baseSkill = await readFile(join(adopted, "SKILL.md"), "utf8");
  const localSkill = baseSkill.replace("Use the upstream harness", "Use any available harness");
  await writeFile(join(adopted, "SKILL.md"), localSkill);
  const metadata = (revision: string) => `schema_version = 1\nmode = "adopt"\n\n[upstream]\nrepository = ${JSON.stringify(repository)}\npath = "example"\nbase_revision = "${revision}"\n`;
  await writeFile(join(adopted, "SOURCE.toml"), metadata(base));
  await writeFile(join(adopted, "ADAPTATIONS.md"), "Preserve workflow and identity; execute with any available harness.\n");
  await copyTree(join(fixtures, "skills/adapted-checks"), join(root, "skills/adapted-checks"));
  await copyTree(join(fixtures, "sources"), join(root, "sources"));
  const options = { root, home, targets: ["codex", "claude", "pi"] as const, log: () => {} };
  // A mutable list is required by the install API.
  const installOptions = { ...options, targets: [...options.targets] };
  await run("install", installOptions);
  assert.equal(await readFile(join(home, ".agents/skills/example/SKILL.md"), "utf8"), localSkill);
  assert.match(await readFile(join(home, ".claude/skills/adapted-checks/SKILL.md"), "utf8"), /current harness/);

  const targetSkill = baseSkill.replace("Report the result.", "Report the result and failed checks.");
  await writeFile(join(repository, "example/SKILL.md"), targetSkill);
  await writeFile(join(repository, "example/scripts/check.sh"), "#!/bin/sh\nprintf 'checked upstream update\\n'\n");
  git("add", ".");
  git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-m", "upstream update");
  const target = git("rev-parse", "HEAD");
  const baseFile = join(directory, "base.md");
  const targetFile = join(directory, "target.md");
  await writeFile(baseFile, git("show", `${base}:example/SKILL.md`) + "\n");
  await writeFile(targetFile, git("show", `${target}:example/SKILL.md`) + "\n");
  const merge = spawnSync("git", ["merge-file", "-p", join(adopted, "SKILL.md"), baseFile, targetFile], { encoding: "utf8" });
  assert.equal(merge.status, 0, merge.stderr);
  assert.match(merge.stdout, /Report the result and failed checks/);
  assert.match(merge.stdout, /Use any available harness/);
  await writeFile(join(adopted, "SKILL.md"), merge.stdout);
  await cp(join(repository, "example/scripts/check.sh"), join(adopted, "scripts/check.sh"));
  await writeFile(join(adopted, "SOURCE.toml"), metadata(target));
  assert.equal(await readFile(join(home, ".agents/skills/example/SKILL.md"), "utf8"), merge.stdout);
  const check = spawnSync("sh", [join(home, ".claude/skills/example/scripts/check.sh")], { encoding: "utf8" });
  assert.equal(check.status, 0, check.stderr);
  assert.equal(check.stdout, "checked upstream update\n");

  // Competing changes to the same instruction require a decision, not a pin advance.
  await writeFile(targetFile, baseSkill.replace("Use the upstream harness", "Use only the new upstream harness"));
  const conflict = spawnSync("git", ["merge-file", "-p", join(adopted, "SKILL.md"), baseFile, targetFile], { encoding: "utf8" });
  assert.ok(conflict.status !== null && conflict.status > 0 && conflict.status < 128);
  assert.match(conflict.stdout, /<<<<<<<[\s\S]*=======/);
  assert.equal(await readFile(join(adopted, "SOURCE.toml"), "utf8"), metadata(target));
  assert.equal(await readFile(join(home, ".agents/skills/example/SKILL.md"), "utf8"), merge.stdout);
  await run("uninstall", installOptions);
});
