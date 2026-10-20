import assert from "node:assert/strict";
import test from "node:test";
import type { ExtensionAPI, ExtensionContext, ExtensionToolContext, Theme } from "@earendil-works/pi-coding-agent";
import { visibleWidth } from "@earendil-works/pi-tui";
import tasks from "../../pi/extensions/tasks/index.ts";

type Tool = Parameters<ExtensionAPI["registerTool"]>[0];
type Component = { render(width: number): string[]; invalidate(): void };
const theme = { fg: (_color: string, text: string) => text, bold: (text: string) => text } as Theme;
const initial = [
  { step: "Inspect the repository", status: "completed" },
  { step: "Build the extension", status: "in_progress" },
  { step: "Run the tests", status: "pending" },
];
function setup(mode = "tui") {
  let tool: Tool | undefined;
  let command: { handler(args: string, ctx: ExtensionContext): Promise<void> } | undefined;
  const handlers = new Map<string, (event: unknown, ctx: ExtensionContext) => Promise<void>>();
  let widget: Component | undefined;
  let branch: unknown[] = [];
  const notices: string[] = [];
  tasks({
    registerTool(value: Tool) { tool = value; },
    registerCommand(_name: string, value: typeof command) { command = value; },
    on(name: string, handler: (event: unknown, ctx: ExtensionContext) => Promise<void>) { handlers.set(name, handler); },
  } as unknown as ExtensionAPI);
  assert.ok(tool);
  assert.ok(command);
  const registeredTool = tool;
  const registeredCommand = command;
  const ctx = {
    mode,
    sessionManager: { getBranch: () => branch },
    ui: {
      setWidget(_key: string, factory: ((_tui: unknown, theme: Theme) => Component) | undefined) {
        widget = factory?.({}, theme);
      },
      notify(text: string) { notices.push(text); },
    },
  } as unknown as ExtensionToolContext;
  return {
    tool, notices,
    run: (params: Record<string, unknown> = {}, signal?: AbortSignal) => registeredTool.execute("test", params, signal, undefined, ctx),
    command: (args = "") => registeredCommand.handler(args, ctx),
    lines: (width = 100) => widget?.render(width) ?? [],
    async restore(entries: unknown[], event = "session_start") {
      branch = entries;
      const handler = handlers.get(event);
      assert.ok(handler);
      await handler({}, ctx);
    },
  };
}
function entry(details: unknown, isError = false) {
  return { type: "message", message: { role: "toolResult", toolName: "update_plan", details, isError } };
}

test("update_plan returns structured progress, displays statuses, reads and clears the plan", async () => {
  const app = setup();
  assert.equal(app.tool.executionMode, "sequential");
  const result = await app.run({ plan: initial });
  assert.deepEqual(result.structuredContent, { plan: initial });
  assert.match(app.lines()[0]!, /1\/3 completed · Build the extension/);
  assert.deepEqual(app.lines().slice(1), ["  ✓ Inspect the repository", "  ◉ Build the extension", "  ○ Run the tests"]);
  assert.deepEqual((await app.run()).structuredContent, { plan: initial });
  await app.run({ plan: [] });
  assert.deepEqual(app.lines(), []);
  assert.deepEqual((await app.run()).structuredContent, { plan: [] });
});

test("invalid or aborted updates leave the previous plan intact", async () => {
  const app = setup();
  await app.run({ plan: initial });
  for (const plan of [
    [{ step: " ", status: "pending" }],
    [{ step: "bad\nline", status: "pending" }],
    [{ step: "\x1b[2J", status: "pending" }],
    [{ step: "first", status: "in_progress" }, { step: "second", status: "in_progress" }],
  ]) await assert.rejects(app.run({ plan }));
  await assert.rejects(app.run({ plan: [] }, AbortSignal.abort()), { name: "AbortError" });
  assert.deepEqual((await app.run()).structuredContent, { plan: initial });
});

test("snapshots do not change when a later plan is written", async () => {
  const app = setup();
  const first = await app.run({ plan: initial });
  await app.run({ plan: [{ step: "New work", status: "pending" }] });
  assert.deepEqual(first.details, { plan: initial });
});

test("restores only valid successful snapshots on the current branch and resets on new sessions", async () => {
  const app = setup();
  await app.restore([entry({ plan: initial }), entry({ plan: [] }, true), entry({ plan: [{ step: "bad", status: "unknown" }] })]);
  assert.deepEqual((await app.run()).structuredContent, { plan: initial });
  await app.restore([entry({ plan: [] })], "session_tree");
  assert.deepEqual(app.lines(), []);
  await app.restore([entry({ plan: initial })]);
  await app.restore([]);
  assert.deepEqual((await app.run()).structuredContent, { plan: [] });
});

test("widget collapses and expands; list command exposes every step in long plans", async () => {
  const app = setup();
  const plan = Array.from({ length: 20 }, (_, i) => ({ step: `Step ${i + 1}`, status: i === 15 ? "in_progress" : "pending" }));
  await app.run({ plan });
  assert.ok(app.lines().length <= 8);
  assert.ok(app.lines().some((line) => line.includes("◉ Step 16")));
  await app.command();
  assert.equal(app.lines().length, 1);
  await app.command();
  assert.ok(app.lines().length > 1);
  await app.command("list");
  assert.match(app.notices[0]!, /\[pending\] Step 1\n/);
  assert.match(app.notices[0]!, /\[pending\] Step 20$/);
});

test("wide text and resizing respect terminal columns; completion stays visible", async () => {
  const app = setup();
  await app.run({ plan: [{ step: "界面 👩‍💻 check the output", status: "completed" }] });
  for (const width of [1, 2, 8, 40, 120]) {
    assert.ok(app.lines(width).every((line) => visibleWidth(line) <= width));
  }
  assert.match(app.lines()[0]!, /1\/1 completed · All tasks complete/);
});

test("RPC and print modes track tasks without attempting terminal widgets", async () => {
  for (const mode of ["rpc", "print", "json"]) {
    const app = setup(mode);
    assert.deepEqual((await app.run({ plan: initial })).structuredContent, { plan: initial });
    assert.deepEqual(app.lines(), []);
    await app.command("list");
    assert.match(app.notices[0]!, /\[in_progress\] Build the extension/);
  }
});
