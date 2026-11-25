import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("real Pi loads the tasks extension and returns structured progress over RPC", { timeout: 20_000 }, async (t) => {
  const home = await mkdtemp(join(tmpdir(), "spellbook-tasks-rpc-"));
  const extension = fileURLToPath(new URL("../../pi/extensions/tasks/index.ts", import.meta.url));
  const probe = join(home, "probe.ts");
  await writeFile(probe, `
import tasks from ${JSON.stringify(extension)};
export default function(pi) {
  let tool;
  tasks({ ...pi, registerTool(value) { tool = value; pi.registerTool(value); } });
  pi.registerCommand("tasks-probe", {
    description: "Exercise tasks without a model call",
    async handler(_args, ctx) {
      const plan = [{ step: "Load in Pi", status: "completed" }, { step: "Check RPC", status: "in_progress" }];
      await tool.execute("write", { plan }, undefined, undefined, ctx);
      const result = await tool.execute("read", {}, undefined, undefined, ctx);
      ctx.ui.notify(JSON.stringify(result.structuredContent), "info");
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
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGKILL");
      await exited;
    }
    await rm(home, { recursive: true, force: true });
  });
  let stderr = "";
  child.stderr.setEncoding("utf8").on("data", (data: string) => { stderr += data; });
  const result = await new Promise<unknown>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`RPC probe timed out: ${stderr}`)), 15_000);
    const finish = (error?: Error, value?: unknown) => {
      clearTimeout(timer);
      if (error) reject(error); else resolve(value);
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
          if (event.type === "extension_ui_request" && event.method === "notify") {
            finish(undefined, JSON.parse(event.message));
          } else if (event.type === "response" && event.success === false) {
            finish(new Error(JSON.stringify(event)));
          }
        } catch (error) { finish(error as Error); }
      }
    });
    child.stdin.write(JSON.stringify({ type: "prompt", id: "probe", message: "/tasks-probe" }) + "\n");
  });
  assert.deepEqual(result, { plan: [
    { step: "Load in Pi", status: "completed" },
    { step: "Check RPC", status: "in_progress" },
  ] });
});
