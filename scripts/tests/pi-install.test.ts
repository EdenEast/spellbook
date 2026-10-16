import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { TestContext } from "node:test";
import { run } from "../install.ts";
import type { Options } from "../install.ts";

async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "spellbook-pi-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const root = join(directory, "checkout");
  const home = join(directory, "home");
  await mkdir(join(root, "instructions"), { recursive: true });
  await writeFile(join(root, "instructions/AGENTS.md"), "instructions\n");
  await mkdir(join(home, ".pi/agent"), { recursive: true });
  const path = join(home, ".pi/agent/settings.json");
  const options: Options = { root, home, targets: ["pi"], log: () => {} };
  return { path, options };
}

test("Pi install preserves settings and tool selection while enabling codemode", async (t) => {
  for (const [tools, expected] of [
    [undefined, ["+codemode"]],
    [[], ["codemode"]],
    [["read", "bash"], ["read", "bash", "codemode"]],
    [["-write", "-codemode"], ["-write", "+codemode"]],
    [["codemode", "-codemode"], ["codemode"]],
    [["+codemode", "-codemode", "+grep"], ["+grep", "+codemode"]],
  ] as const) {
    const { options, path } = await fixture(t);
    await writeFile(path, JSON.stringify({ theme: "dark", defaultTools: tools, codemode: { mode: "only" } }));
    await run("install", options);
    assert.deepEqual(JSON.parse(await readFile(path, "utf8")), {
      theme: "dark", defaultTools: expected, codemode: { mode: "only" },
    });
    const installed = await readFile(path, "utf8");
    await run("install", options);
    assert.equal(await readFile(path, "utf8"), installed);
    await run("uninstall", options);
    assert.equal(await readFile(path, "utf8"), installed);
  }
});

test("already enabled Pi settings are left byte-for-byte unchanged", async (t) => {
  const { options, path } = await fixture(t);
  const original = '{"defaultTools":["read","codemode"],"theme":"light"}';
  await writeFile(path, original);
  await run("install", options);
  assert.equal(await readFile(path, "utf8"), original);
});

test("Pi install re-enables an explicitly disabled built-in codemode extension", async (t) => {
  const { options, path } = await fixture(t);
  await writeFile(path, JSON.stringify({ defaultTools: ["+codemode"], extensions: ["-builtin:codemode", "./custom.ts"] }));
  await run("install", options);
  assert.deepEqual(JSON.parse(await readFile(path, "utf8")), {
    defaultTools: ["+codemode"], extensions: ["./custom.ts"],
  });
});

test("dry run and status report missing codemode without writing", async (t) => {
  const { options, path } = await fixture(t);
  const logs: string[] = [];
  await run("install", { ...options, dryRun: true, log: (line) => logs.push(line) });
  await run("status", { ...options, log: (line) => logs.push(line) });
  assert.ok(logs.includes(`DRY RUN enable codemode: ${path}`));
  assert.ok(logs.includes(`codemode not configured: ${path}`));
  assert.deepEqual(await readdir(join(options.home, ".pi/agent")), []);
});

test("invalid Pi settings stop installation before links or settings are changed", async (t) => {
  for (const original of ["{", "null", "[]", '{"defaultTools":false}', '{"defaultTools":[1]}', '{"extensions":42}']) {
    const { options, path } = await fixture(t);
    await writeFile(path, original);
    await assert.rejects(run("install", options), /Invalid Pi settings/);
    assert.equal(await readFile(path, "utf8"), original);
    assert.deepEqual(await readdir(join(options.home, ".pi/agent")), ["settings.json"]);
  }
});

test("Pi settings symlinks are preserved and rejected rather than replaced", async (t) => {
  const { options, path } = await fixture(t);
  const foreign = join(options.home, "personal-settings.json");
  await writeFile(foreign, "{}");
  await symlink(foreign, path);
  await assert.rejects(run("install", options), /regular Pi settings file/);
  assert.equal(await readFile(foreign, "utf8"), "{}");
  assert.deepEqual(await readdir(join(options.home, ".pi/agent")), ["settings.json"]);
});
