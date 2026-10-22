import { execFile, spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile, chmod, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const execute = promisify(execFile);
export async function runHarnessCase(scenario: "comment" | "ci", idleMs = 600, started: () => void = () => {}) {
  const directory = await mkdtemp(join(tmpdir(), "babysit-harness-"));
  try {
    const dataPath = join(directory, "data.json"), callsPath = join(directory, "calls.jsonl");
    const data = {
      facts: { url: "https://github.com/owner/repo/pull/42", headRefOid: "head", baseRefOid: "base", baseRefName: "main", state: "OPEN",
        isDraft: false, mergeable: "MERGEABLE", mergeStateStatus: "BLOCKED", reviewDecision: "REVIEW_REQUIRED" },
      checks: [{ name: "CI", state: "IN_PROGRESS", bucket: "pending", link: "https://example.com/check", workflow: "CI" }],
      comments: [] as object[],
    };
    await writeFile(dataPath, JSON.stringify(data));
    const fakeGh = join(directory, "gh");
    await writeFile(fakeGh, `#!${process.execPath}
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(callsPath)}, JSON.stringify(args) + '\\n');
const data = JSON.parse(fs.readFileSync(${JSON.stringify(dataPath)}, 'utf8'));
let result;
if (args[0] === 'pr' && args[1] === 'view') result = data.facts;
else if (args[0] === 'pr') result = data.checks;
else if (args[1] === 'graphql') result = [{ data: { repository: { pullRequest: { baseRef: { branchProtectionRule: null }, reviewThreads: { nodes: [] } } } } }];
else if (args[1].includes('/rules/branches/')) result = [[]];
else if (args[1].includes('/issues/')) result = [data.comments];
else result = [[]];
process.stdout.write(JSON.stringify(result));
`);
    await chmod(fakeGh, 0o755);
    const env = { ...process.env, PATH: `${directory}:${process.env.PATH}` };
    const script = fileURLToPath(new URL("../../skills/babysit-pr/scripts/watch-pr.ts", import.meta.url));
    const args = [script, "--repo", "owner/repo", "--pr", "42", "--state", join(directory, "state.json"), "--interval", "0.1", "--timeout", "10"];
    const initial = JSON.parse((await execute(process.execPath, args, { env })).stdout);
    const child = spawn(process.execPath, [...args, "--ack", initial.deliveryToken], { env, stdio: ["ignore", "pipe", "pipe"] });
    let output = "", errors = "";
    child.stdout.on("data", (value) => { output += value.toString(); });
    child.stderr.on("data", (value) => { errors += value.toString(); });
    const completed = new Promise<number | null>((resolve, reject) => {
      child.on("error", reject);
      child.on("close", resolve);
    });
    started();
    try {
      await delay(idleMs);
      const idleHadNoOutput = output === "" && child.exitCode === null;
      const idleQueries = (await readFile(callsPath, "utf8")).trim().split("\n").length;
      if (scenario === "comment") data.comments.push({ id: 7, updated_at: "2026-10-13T12:00:00Z", body: "A new finding", html_url: "https://example.com/comment", user: { login: "bot" } });
      else data.checks[0] = { ...data.checks[0]!, state: "SUCCESS", bucket: "pass" };
      const update = `${dataPath}.next`;
      await writeFile(update, JSON.stringify(data));
      await rename(update, dataPath);
      const exitCode = await completed;
      if (exitCode !== 0) throw new Error(`Watcher exited ${exitCode}: ${errors} ${output}`);
      return { scenario, idleHadNoOutput, idleQueries, outputLines: output.trim().split("\n").length, event: JSON.parse(output) };
    } finally {
      if (child.exitCode === null) child.kill();
      await completed;
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const scenario = process.argv[2] === "ci" ? "ci" : "comment";
  const report = await runHarnessCase(scenario, 3000, () => process.stdout.write("Watcher started; waiting for simulated activity.\n"));
  process.stdout.write(`${JSON.stringify(report)}\n`);
}
