import assert from "node:assert/strict";
import test from "node:test";
import type { ExtensionAPI, ExtensionToolContext } from "@earendil-works/pi-coding-agent";
import requestUserInput from "../../pi/extensions/request-user-input/index.ts";

type Tool = Parameters<ExtensionAPI["registerTool"]>[0];
const question = {
  id: "scope", header: "Scope", question: "Which scope?",
  options: [{ label: "Small (Recommended)", description: "Only this task" }, { label: "Large", description: "All tasks" }],
};

function setup(replies: Array<string | undefined> = [], hasUI = true) {
  let tool: Tool | undefined;
  requestUserInput({ registerTool(value: Tool) { tool = value; } } as ExtensionAPI);
  assert.ok(tool);
  const registered = tool;
  const dialogs: Array<{ method: string; title: string; options?: string[] }> = [];
  const ctx = {
    hasUI,
    ui: {
      async select(title: string, options: string[]) {
        dialogs.push({ method: "select", title, options });
        return replies.shift();
      },
      async input(title: string) {
        dialogs.push({ method: "input", title });
        return replies.shift();
      },
    },
  } as unknown as ExtensionToolContext;
  return { tool: registered, dialogs, run: (questions = [question], signal?: AbortSignal) =>
    registered.execute("test", { questions }, signal, undefined, ctx) };
}

function payload(result: Awaited<ReturnType<Tool["execute"]>>) {
  const content = result.content[0];
  assert.equal(content?.type, "text");
  if (content?.type !== "text") throw new Error("Missing text");
  return JSON.parse(content.text);
}

test("registers a model-only sequential Codex-style tool", () => {
  const { tool } = setup();
  assert.equal(tool.name, "request_user_input");
  assert.equal(tool.exposure, "model-only");
  assert.equal(tool.executionMode, "sequential");
});

test("shows question and option descriptions and returns the selected label", async () => {
  const { run, dialogs } = setup(["1. Small (Recommended) — Only this task"]);
  assert.deepEqual(payload(await run()), {
    answers: { scope: { answers: ["Small (Recommended)"] } }, cancelled: false,
  });
  assert.equal(dialogs[0]?.title, "Scope\n\nWhich scope?");
  assert.equal(dialogs[0]?.options?.[1], "2. Large — All tasks");
});

test("supports Other and maps multiple answers by ID", async () => {
  const { run, dialogs } = setup(["Other (write an answer)", "Medium", "Large"]);
  const result = await run([question, { ...question, id: "next" }]);
  assert.deepEqual(payload(result), {
    answers: { scope: { answers: ["Medium"] }, next: { answers: ["Large"] } }, cancelled: false,
  });
  assert.deepEqual(dialogs.map((d) => d.method), ["select", "input", "select"]);
});

test("free text preserves empty answers and unusual question IDs", async () => {
  const { run } = setup([""]);
  assert.deepEqual(payload(await run([{ ...question, id: "__proto__", options: [] }])), {
    answers: { ["__proto__"]: { answers: [""] } }, cancelled: false,
  });
});

test("cancellation preserves partial answers without inventing the rest", async () => {
  const { run } = setup(["Large", undefined]);
  assert.deepEqual(payload(await run([question, { ...question, id: "next" }])), {
    answers: { scope: { answers: ["Large"] } }, cancelled: true,
  });
});

test("non-interactive runs fail before showing UI", async () => {
  const { run, dialogs } = setup([], false);
  assert.equal((await run()).isError, true);
  assert.equal(dialogs.length, 0);
});

test("invalid question batches fail before opening any dialog", async () => {
  for (const questions of [
    [question, question],
    [question, { ...question, id: "secret", isSecret: true }],
    [{ ...question, options: [question.options[0]!, question.options[0]!] }],
  ]) {
    const { run, dialogs } = setup();
    assert.equal((await run(questions)).isError, true);
    assert.equal(dialogs.length, 0);
  }
});

test("isOther=false omits custom choice", async () => {
  const { tool, dialogs } = setup(["2. Large — All tasks"]);
  // Use the registered handler to include optional schema properties.
  const ctx = { hasUI: true, ui: { async select(title: string, options: string[]) {
    dialogs.push({ method: "select", title, options });
    return options[1];
  } } } as unknown as ExtensionToolContext;
  await tool.execute("test", { questions: [{ ...question, isOther: false }] }, undefined, undefined, ctx);
  assert.equal(dialogs[0]?.options?.length, 2);
});

test("aborted runs never open a question", async () => {
  const { run, dialogs } = setup();
  await assert.rejects(run([question], AbortSignal.abort()), { name: "AbortError" });
  assert.equal(dialogs.length, 0);
});
