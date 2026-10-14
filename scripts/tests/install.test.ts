import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, readlink, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { plan, run } from "../install.ts";
import type { Options } from "../install.ts";
import { spawnSync } from "node:child_process";

async function fixture(t: TestContext): Promise<Options> {
  const directory = await mkdtemp(join(tmpdir(), "spellbook-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const root = join(directory, "checkout");
  const home = join(directory, "home");
  await mkdir(join(root, "pi/extensions"), { recursive: true });
  await mkdir(home);
  return { root, home, targets: ["codex", "claude", "pi"], log: () => {} };
}

async function instructions(options: Options) {
  const source = join(options.root, "instructions/AGENTS.md");
  await mkdir(join(options.root, "instructions"));
  await writeFile(source, "Global preferences\n");
  return source;
}

async function references(options: Options) {
  const source = join(options.root, "references");
  await mkdir(join(source, "principles"), { recursive: true });
  await writeFile(join(source, "README.md"), "[Principles](principles/README.md)\n");
  await writeFile(join(source, "principles/README.md"), "[Prove it works](prove-it-works.md)\n");
  await writeFile(join(source, "principles/prove-it-works.md"), "Check the actual result.\n");
  return source;
}

test("each target shares readable references", async (t) => {
  for (const target of ["codex", "claude", "pi"] as const) {
    const options = { ...await fixture(t), targets: [target, target] };
    const source = await references(options);
    const destination = join(options.home, ".agents/references/spellbook");
    await run("install", { ...options, dryRun: true });
    assert.deepEqual(await readdir(options.home), []);
    await run("install", options);
    await run("install", options);
    assert.equal(await readlink(destination), source);
    assert.equal(await readFile(join(destination, "principles/prove-it-works.md"), "utf8"), "Check the actual result.\n");
    assert.deepEqual(await plan(options), [{ source, destination, state: "installed" }]);
    await run("status", options);
    assert.deepEqual(await readdir(join(options.home, ".agents")), ["references"]);
    await run("uninstall", options);
    assert.deepEqual(await readdir(join(options.home, ".agents/references")), []);
  }
});

test("reference conflicts prevent all writes and preserve foreign resources", async (t) => {
  const options = await fixture(t);
  await references(options);
  await instructions(options);
  const parent = join(options.home, ".agents/references");
  const destination = join(parent, "spellbook");
  await mkdir(parent, { recursive: true });
  await writeFile(destination, "personal reference");
  await assert.rejects(run("install", options), /conflict/);
  assert.deepEqual(await readdir(options.home), [".agents"]);
  await run("uninstall", options);
  assert.equal(await readFile(destination, "utf8"), "personal reference");
  await rm(destination);
  const foreign = join(options.root, "foreign-references");
  await symlink(foreign, destination, "dir");
  await assert.rejects(run("install", options), /conflict/);
  await run("uninstall", options);
  assert.equal(await readlink(destination), foreign);
});

test("deleted reference directories leave owned links that install and uninstall remove", async (t) => {
  for (const action of ["install", "uninstall"] as const) {
    const options = await fixture(t);
    const source = await references(options);
    await run("install", options);
    await rm(source, { recursive: true });
    assert.deepEqual(await plan(options), [{
      source,
      destination: join(options.home, ".agents/references/spellbook"),
      state: "stale",
    }]);
    await run(action, options);
    assert.deepEqual(await plan(options), []);
    assert.deepEqual(await readdir(join(options.home, ".agents/references")), []);
  }
});

test("references respect empty target selection and reject a symlinked parent", async (t) => {
  const options = await fixture(t);
  const source = await references(options);
  await run("install", { ...options, targets: [] });
  assert.deepEqual(await readdir(options.home), []);
  await mkdir(join(options.home, ".agents"));
  await symlink(source, join(options.home, ".agents/references"), "dir");
  await assert.rejects(run("install", options), /real resource directory/);
  assert.deepEqual((await readdir(source)).sort(), ["README.md", "principles"]);
});

test("global instructions follow target selection and support dry run, status, and uninstall", async (t) => {
  const options = await fixture(t);
  const source = await instructions(options);
  await run("install", { ...options, dryRun: true });
  assert.deepEqual(await readdir(options.home), []);
  for (const [target, destination] of [
    ["codex", ".codex/AGENTS.md"],
    ["claude", ".claude/CLAUDE.md"],
    ["pi", ".pi/agent/AGENTS.md"],
  ] as const) {
    const selected = { ...options, targets: [target, target] };
    await run("install", selected);
    await run("install", selected);
    assert.equal(await readlink(join(options.home, destination)), source);
    assert.deepEqual(await plan(selected), [{ source, destination: join(options.home, destination), state: "installed" }]);
    await run("status", selected);
    await run("uninstall", selected);
    assert.deepEqual(await readdir(join(options.home, destination, "..")), []);
  }
});

test("instruction conflicts preflight all resources and preserve existing files and foreign links", async (t) => {
  const options = await fixture(t);
  await instructions(options);
  await mkdir(join(options.home, ".pi/agent"), { recursive: true });
  const destination = join(options.home, ".pi/agent/AGENTS.md");
  await writeFile(destination, "personal instructions");
  await assert.rejects(run("install", options), /conflict/);
  assert.deepEqual(await readdir(options.home), [".pi"]);
  await run("uninstall", options);
  assert.equal(await readFile(destination, "utf8"), "personal instructions");
  await rm(destination);
  await symlink(join(options.root, "source/AGENTS.md"), destination);
  await assert.rejects(run("install", options), /conflict/);
  await run("uninstall", options);
  assert.equal(await readlink(destination), join(options.root, "source/AGENTS.md"));
});

test("deleted global instructions leave stale links that install and uninstall remove", async (t) => {
  const options = await fixture(t);
  const source = await instructions(options);
  await run("install", options);
  await rm(source);
  assert.equal((await plan(options)).length, 3);
  assert.ok((await plan(options)).every((link) => link.state === "stale"));
  await run("install", { ...options, targets: ["codex"] });
  await run("uninstall", options);
  assert.deepEqual(await plan(options), []);
});

test("empty collections do not create harness configuration", async (t) => {
  const options = await fixture(t);
  await writeFile(join(options.root, "pi/extensions/.gitkeep"), "");
  for (const action of ["install", "status", "uninstall"] as const) await run(action, options);
  assert.deepEqual(await readdir(options.home), []);
});

test("Pi extensions install supported entry points and remove broken owned links", async (t) => {
  const options = await fixture(t);
  const source = join(options.root, "pi/extensions/hello.ts");
  await writeFile(source, "export default () => {};\n");
  await writeFile(join(options.root, "pi/extensions/types.d.ts"), "export {};\n");
  await mkdir(join(options.root, "pi/extensions/tools"));
  await writeFile(join(options.root, "pi/extensions/tools/index.js"), "export default () => {};\n");
  await run("install", { ...options, dryRun: true });
  assert.deepEqual(await readdir(options.home), []);
  await run("install", options);
  await run("install", options);
  const destination = join(options.home, ".pi/agent/extensions");
  assert.deepEqual((await readdir(destination)).sort(), ["spellbook-hello.ts", "spellbook-tools"]);
  assert.ok((await plan(options)).every((link) => link.state === "installed"));
  await rm(source);
  await symlink(join(options.root, "foreign.ts"), join(destination, "foreign.ts"));
  await run("uninstall", options);
  assert.deepEqual(await readdir(destination), ["foreign.ts"]);
});

test("CLI exposes resource options and rejects the removed selector without writing", async (t) => {
  const options = await fixture(t);
  const executable = join(import.meta.dirname, "..", "spellbook.ts");
  const invoke = (args: string[]) => spawnSync(process.execPath, [executable, ...args], {
    env: { ...process.env, HOME: options.home }, encoding: "utf8",
  });
  const help = invoke(["--help"]);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--target codex\|claude\|pi/);
  assert.doesNotMatch(help.stdout, /--select/);
  const result = invoke(["install", "--select"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown argument: --select/);
  assert.deepEqual(await readdir(options.home), []);
});

async function skill(options: Options, name = "example") {
  const source = join(options.root, "skills", name);
  await mkdir(join(source, "scripts"), { recursive: true });
  await writeFile(join(source, "SKILL.md"), `---\nname: ${name}\ndescription: Example workflow.\n---\nRead scripts/check.txt.\n`);
  await writeFile(join(source, "scripts/check.txt"), "supporting resource\n");
  return source;
}

test("skills install complete trees for selected targets without exposing references as skills", async (t) => {
  for (const [target, directory] of [
    ["codex", ".agents/skills"], ["claude", ".claude/skills"], ["pi", ".agents/skills"],
  ] as const) {
    const options = { ...await fixture(t), targets: [target, target] };
    const source = await skill(options);
    await mkdir(join(options.root, "skills/not-a-skill"));
    await mkdir(join(options.root, "skills/directory-entry/SKILL.md"), { recursive: true });
    await symlink(source, join(options.root, "skills/linked-skill"), "dir");
    await mkdir(join(options.root, "skills/.hidden"));
    await writeFile(join(options.root, "skills/.hidden/SKILL.md"), "hidden");
    await writeFile(join(options.root, "skills/README.md"), "catalog");
    await mkdir(join(options.root, "references/reading"), { recursive: true });
    await writeFile(join(options.root, "references/reading/SKILL.md"), "reading only");
    await run("install", { ...options, dryRun: true });
    assert.deepEqual(await readdir(options.home), []);
    await run("install", options);
    await run("install", options);
    const destination = join(options.home, directory, "example");
    assert.equal(await readlink(destination), source);
    assert.equal(await readFile(join(destination, "scripts/check.txt"), "utf8"), "supporting resource\n");
    assert.deepEqual(await readdir(join(options.home, directory)), ["example"]);
    assert.equal((await plan(options)).length, 2);
    assert.ok((await plan(options)).every((link) => link.state === "installed"));
    await run("uninstall", options);
    assert.deepEqual(await readdir(join(options.home, directory)), []);
  }
});

test("skill conflicts prevent all writes and preserve foreign paths", async (t) => {
  const options = await fixture(t);
  await skill(options);
  await instructions(options);
  const parent = join(options.home, ".claude/skills");
  await mkdir(parent, { recursive: true });
  const destination = join(parent, "example");
  await writeFile(destination, "personal skill");
  await assert.rejects(run("install", options), /conflict/);
  assert.deepEqual(await readdir(options.home), [".claude"]);
  await run("uninstall", options);
  assert.equal(await readFile(destination, "utf8"), "personal skill");
  await rm(destination);
  await symlink(join(options.root, "foreign"), destination, "dir");
  await assert.rejects(run("install", options), /conflict/);
  await run("uninstall", options);
  assert.equal(await readlink(destination), join(options.root, "foreign"));
});

test("deleted skills and removed entry points leave owned links that can be cleaned", async (t) => {
  for (const action of ["install", "uninstall"] as const) {
    for (const removeEntryOnly of [true, false]) {
      const options = await fixture(t);
      const source = await skill(options);
      await run("install", options);
      await rm(removeEntryOnly ? join(source, "SKILL.md") : source, { recursive: true });
      assert.equal((await plan(options)).length, 2);
      assert.ok((await plan(options)).every((link) => link.state === "stale"));
      await run(action, options);
      assert.deepEqual(await plan(options), []);
    }
  }
});

test("skills reject symlinked containers and empty target selections do nothing", async (t) => {
  const options = await fixture(t);
  const source = await skill(options);
  await run("install", { ...options, targets: [] });
  assert.deepEqual(await readdir(options.home), []);
  await mkdir(join(options.home, ".agents"));
  await symlink(source, join(options.home, ".agents/skills"), "dir");
  await assert.rejects(run("install", options), /real resource directory/);
  assert.deepEqual((await readdir(source)).sort(), ["SKILL.md", "scripts"]);
});


test("Codex and Pi reconcile one shared skill link while Claude has its own", async (t) => {
  const options = await fixture(t);
  await skill(options);
  await run("install", options);
  assert.equal((await plan(options)).length, 2);
  await run("uninstall", { ...options, targets: ["pi"] });
  assert.deepEqual(await readdir(join(options.home, ".agents/skills")), []);
  assert.equal(await readFile(join(options.home, ".claude/skills/example/scripts/check.txt"), "utf8"), "supporting resource\n");
  await run("install", { ...options, targets: ["codex"] });
  assert.ok((await plan(options)).every((link) => link.state === "installed"));
});
