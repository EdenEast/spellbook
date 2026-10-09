import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, readlink, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { plan, run } from "./install.ts";
import type { Options } from "./install.ts";

async function fixture(t: TestContext): Promise<Options> {
  const directory = await mkdtemp(join(tmpdir(), "spellbook-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const root = join(directory, "checkout");
  const home = join(directory, "home");
  await mkdir(join(root, "skills"), { recursive: true });
  await mkdir(join(root, "pi/extensions"), { recursive: true });
  await mkdir(home);
  return { root, home, targets: ["codex", "claude", "pi"], log: () => {} };
}

async function skill(options: Options, name = "example") {
  const directory = join(options.root, "skills", name);
  await mkdir(directory);
  await writeFile(join(directory, "SKILL.md"), `---\nname: ${name}\ndescription: Test fixture\n---\n`);
  return directory;
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

test("each target shares readable references without discovering them as skills", async (t) => {
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
  await skill(options);
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
  await skill(options);
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
  await writeFile(join(options.root, "skills/.gitkeep"), "");
  await writeFile(join(options.root, "pi/extensions/.gitkeep"), "");
  for (const action of ["install", "status", "uninstall"] as const) await run(action, options);
  assert.deepEqual(await readdir(options.home), []);
});

test("all targets share skills and expose supported extension entry points", async (t) => {
  const options = await fixture(t);
  const source = await skill(options);
  await writeFile(join(options.root, "pi/extensions/hello.ts"), "export default () => {};\n");
  await writeFile(join(options.root, "pi/extensions/types.d.ts"), "export {};\n");
  await mkdir(join(options.root, "pi/extensions/tools"));
  await writeFile(join(options.root, "pi/extensions/tools/index.js"), "export default () => {};\n");
  await run("install", options);
  await run("install", options);
  assert.equal(await readlink(join(options.home, ".agents/skills/example")), source);
  assert.equal(await readlink(join(options.home, ".claude/skills/example")), source);
  assert.deepEqual((await readdir(join(options.home, ".pi/agent/extensions"))).sort(), ["spellbook-hello.ts", "spellbook-tools"]);
  assert.equal((await plan(options)).length, 4);
  assert.ok((await plan(options)).every((link) => link.state === "installed"));
});

test("a conflict on a later target prevents earlier writes", async (t) => {
  const options = await fixture(t);
  await skill(options);
  const destination = join(options.home, ".claude/skills");
  await mkdir(destination, { recursive: true });
  await writeFile(join(destination, "example"), "user content");
  await assert.rejects(run("install", options), /conflict/);
  assert.deepEqual(await readdir(options.home), [".claude"]);
  assert.equal(await readFile(join(destination, "example"), "utf8"), "user content");
});

test("dry run leaves the home untouched", async (t) => {
  const options = await fixture(t);
  await skill(options);
  await run("install", { ...options, dryRun: true });
  assert.deepEqual(await readdir(options.home), []);
});

test("uninstall removes broken owned links and preserves foreign files and links", async (t) => {
  const options = await fixture(t);
  const source = await skill(options);
  await run("install", options);
  const destination = join(options.home, ".agents/skills");
  await writeFile(join(destination, "personal"), "keep me");
  await symlink(join(options.root, "elsewhere"), join(destination, "foreign"), "dir");
  await rm(source, { recursive: true });
  assert.ok((await plan(options)).every((link) => link.state === "stale"));
  await run("uninstall", options);
  assert.deepEqual((await readdir(destination)).sort(), ["foreign", "personal"]);
});

test("install prunes links to removed skills", async (t) => {
  const options = await fixture(t);
  const source = await skill(options);
  await run("install", options);
  await rm(source, { recursive: true });
  await run("install", options);
  assert.deepEqual(await readdir(join(options.home, ".agents/skills")), []);
});

test("target selection and whole-directory symlink conflicts", async (t) => {
  const options = await fixture(t);
  await skill(options);
  await run("install", { ...options, targets: ["claude"] });
  assert.deepEqual(await readdir(options.home), [".claude"]);
  await mkdir(join(options.home, ".agents"));
  await symlink(join(options.root, "skills"), join(options.home, ".agents/skills"), "dir");
  await assert.rejects(run("install", options), /real resource directory/);
  assert.deepEqual(await readdir(join(options.root, "skills")), ["example"]);
});
