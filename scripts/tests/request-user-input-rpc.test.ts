import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("real Pi RPC carries question dialogs and answers without a model call", { timeout: 20_000 }, async (t) => {
  const home = await mkdtemp(join(tmpdir(), "spellbook-question-rpc-"));
  t.after(() => rm(home, { recursive: true, force: true }));
  const extension = fileURLToPath(new URL("../../pi/extensions/request-user-input/index.ts", import.meta.url));
  const probe = join(home, "probe.ts");
  await writeFile(probe, `
import requestUserInput from ${JSON.stringify(extension)};
export default function(pi) {
  let questionTool;
  requestUserInput({ ...pi, registerTool(tool) { questionTool = tool; pi.registerTool(tool); } });
  pi.registerCommand("question-probe", {
    description: "Test RPC dialogs without calling a model",
    async handler(_args, ctx) {
      const result = await questionTool.execute("probe", { questions: [{
        id: "scope", header: "Scope", question: "Which scope?",
        options: [{ label: "Small", description: "Only this task" }]
      }] }, undefined, undefined, ctx);
      ctx.ui.notify(JSON.stringify(result), "info");
    }
  });
}
`);
  const env = Object.fromEntries(Object.entries(process.env)
    .filter(([key]) => !key.startsWith("PI_") && !key.startsWith("T3_")));
  const child = spawn(process.execPath, [
    fileURLToPath(new URL("./cli.js", import.meta.resolve("@earendil-works/pi-coding-agent"))),
    "--mode", "rpc", "--no-session", "--no-extensions", "--no-skills",
    "--no-prompt-templates", "--no-themes", "--no-mcp", "--extension", probe,
  ], { cwd: home, env: { ...env, HOME: home, PI_CODING_AGENT_DIR: home }, stdio: "pipe" });
  t.after(() => { child.kill(); });
  let stderr = "";
  child.stderr.setEncoding("utf8").on("data", (data: string) => { stderr += data; });
  const methods: string[] = [];
  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`RPC probe timed out: ${stderr}`)), 15_000);
    const finish = (error?: Error, value?: Record<string, unknown>) => {
      clearTimeout(timer);
      if (error) reject(error); else resolve(value!);
    };
    child.on("error", (error) => finish(error));
    child.on("exit", (code) => finish(new Error(`Pi exited (${code}): ${stderr}`)));
    let buffer = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
      buffer += chunk;
      let end: number;
      while ((end = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (event.type === "extension_ui_request") {
            methods.push(event.method);
            if (event.method === "select") {
              assert.equal(event.title, "Scope\n\nWhich scope?");
              assert.deepEqual(event.options, ["1. Small — Only this task", "Other (write an answer)"]);
              child.stdin.write(JSON.stringify({ type: "extension_ui_response", id: event.id,
                value: "Other (write an answer)" }) + "\n");
            } else if (event.method === "input") {
              child.stdin.write(JSON.stringify({ type: "extension_ui_response", id: event.id,
                value: "Medium" }) + "\n");
            } else if (event.method === "notify") {
              finish(undefined, JSON.parse(event.message));
            }
          } else if (event.type === "response" && event.success === false) {
            finish(new Error(JSON.stringify(event)));
          }
        } catch (error) { finish(error as Error); }
      }
    });
    child.stdin.write(JSON.stringify({ type: "prompt", id: "probe", message: "/question-probe" }) + "\n");
  });
  assert.deepEqual(methods, ["select", "input", "notify"]);
  const content = result.content as Array<{ text: string }>;
  assert.deepEqual(JSON.parse(content[0]!.text), {
    answers: { scope: { answers: ["Medium"] } }, cancelled: false,
  });
});
