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
