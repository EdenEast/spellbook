import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, rm, writeFile, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { changes, readSnapshot, renderEvent, watch } from "../../skills/babysit-pr/scripts/watch-pr.ts";
import type { Command, Snapshot } from "../../skills/babysit-pr/scripts/watch-pr.ts";

function snapshot(): Snapshot {
  return {
    schemaVersion: 1,
    facts: { url: "https://github.com/owner/repo/pull/42", head: "abc", base: "base", state: "OPEN",
      draft: false, mergeable: "MERGEABLE", mergeState: "UNSTABLE", reviewDecision: "" },
    checks: [{ name: "build", state: "IN_PROGRESS", bucket: "pending", link: "https://example.com/build", workflow: "CI" }],
    comments: [], reviews: [], threads: [],
  };
}
function clock() {
  let time = 0;
  const sleeps: number[] = [];
  return { sleeps, now: () => time, sleep: async (ms: number) => { sleeps.push(ms); time += ms; } };
}
test("an unchanged PR waits silently until a new comment arrives", async () => {
  const previous = snapshot();
  const current = snapshot();
  current.comments.push({ id: "comment-1", body: "Please fix this", author: "bot", updatedAt: "2026-10-13T00:00:00Z", url: "https://example.com/comment", commit: null });
  const time = clock();
  let reads = 0;
  const event = await watch({ previous, interval: 60_000, timeout: 0, maxErrors: 5, ...time,
    read: async () => ++reads < 3 ? snapshot() : current });
  assert.equal(event.kind, "ACTIVITY");
  assert.deepEqual(event.reasons, ["comments"]);
  assert.equal(event.snapshot?.comments[0]?.body, "Please fix this");
  assert.deepEqual(time.sleeps, [60_000, 60_000]);
});
test("feedback wins over readiness in the same poll; rearming can report READY", async () => {
  const previous = snapshot(), current = snapshot();
  current.facts.mergeState = "CLEAN";
  current.checks[0] = { ...current.checks[0]!, bucket: "pass", state: "SUCCESS" };
  current.comments.push({ id: "1", body: "Finding", updatedAt: "now", author: "bot", url: "url", commit: "abc" });
  const options = { interval: 1, timeout: 100, maxErrors: 1, read: async () => current };
  const event = await watch({ ...options, previous });
  assert.equal(event.kind, "ACTIVITY");
  assert.equal(event.assessment?.babysitComplete, true);
  assert.equal((await watch({ ...options, previous: current })).kind, "READY");
});
test("empty checks and unresolved threads never report completion", async () => {
  for (const gate of ["checks", "threads"]) {
    const previous = snapshot();
    previous.facts.mergeState = "CLEAN";
    previous.checks[0] = { ...previous.checks[0]!, bucket: "pass", state: "SUCCESS" };
    if (gate === "checks") previous.checks = [];
    if (gate === "threads") previous.threads = [{ id: "thread", resolved: false }];
    const time = clock();
    assert.equal((await watch({ previous, interval: 60_000, timeout: 1000, maxErrors: 1, ...time, read: async () => previous })).kind, "TIMEOUT", gate);
    assert.deepEqual(time.sleeps, [1000]);
  }
});
test("observed review bots remain expected across head changes and acknowledged restarts", async () => {
  const previous = snapshot();
  previous.checks = [{ ...previous.checks[0]!, name: "Bugbot", state: "SUCCESS", bucket: "pass", required: false }];
  const current = snapshot();
  current.facts.head = "new-head";
  current.checks = [{ ...current.checks[0]!, state: "SUCCESS", bucket: "pass", required: true }];
  const first = await watch({ previous, interval: 1, timeout: 0, maxErrors: 1, read: async () => current });
  assert.equal(first.kind, "ACTIVITY");
  assert.equal(first.assessment?.babysitComplete, false);
  assert.deepEqual(first.snapshot?.expectedReviewChecks, ["Bugbot"]);
  const time = clock();
  const second = await watch({ previous: first.snapshot, interval: 100, timeout: 200, maxErrors: 1, ...time, read: async () => current });
  assert.equal(second.kind, "TIMEOUT");
});
test("required contexts survive a push and a restart before the new checks register", async () => {
  const previous = snapshot();
  previous.checks[0]!.required = true;
  const current = snapshot();
  current.facts.head = "new-head";
  current.checks = [{ ...current.checks[0]!, name: "format", required: false, bucket: "pass", state: "SUCCESS" }];
  const first = await watch({ previous, interval: 1, timeout: 100, maxErrors: 1, read: async () => current });
  assert.equal(first.assessment?.babysitComplete, false);
  assert.deepEqual(first.snapshot?.expectedRequiredChecks, ["build"]);
  const second = await watch({ previous: first.snapshot, interval: 100, timeout: 200, maxErrors: 1, ...clock(), read: async () => current });
  assert.equal(second.kind, "TIMEOUT");
  assert.deepEqual(second.reasons, ["check-unreported:build"]);
  assert.equal(second.assessment?.babysitComplete, false);
  const reported = structuredClone(current);
  reported.checks.push({ ...previous.checks[0]!, bucket: "pass", state: "SUCCESS" });
  assert.equal((await watch({ previous: first.snapshot, interval: 1, timeout: 100, maxErrors: 1, read: async () => reported })).assessment?.babysitComplete, true);
});
test("a fresh authoritative requirements read replaces historical required contexts", async () => {
  const previous = snapshot();
  previous.expectedRequiredChecks = ["retired-build"];
  const current = snapshot();
  current.expectedRequiredChecks = [];
  current.checks = [{ ...current.checks[0]!, name: "format", required: false, bucket: "pass", state: "SUCCESS" }];
  const event = await watch({ previous, interval: 1, timeout: 100, maxErrors: 1, read: async () => current });
  assert.deepEqual(event.snapshot?.expectedRequiredChecks, []);
  assert.equal(event.assessment?.babysitComplete, true);
});
test("missing bot checks return an actionable timeout instead of silent success", async () => {
  const previous = snapshot();
  previous.expectedReviewChecks = ["Optional Reviewer"];
  const event = await watch({ previous, interval: 100, timeout: 200, maxErrors: 1, ...clock(), read: async () => snapshot() });
  assert.equal(event.kind, "TIMEOUT");
  assert.deepEqual(event.reasons, ["check-unreported:Optional Reviewer"]);
  assert.equal(event.assessment?.babysitComplete, false);
});
test("human gates in review workflows are not persisted as expected bot work", async () => {
  const previous = snapshot();
  previous.checks = [{ ...previous.checks[0]!, name: "Code Review Gate", workflow: "PR Review", required: true }];
  const current = snapshot();
  current.facts.head = "new-head";
  current.checks = [{ ...current.checks[0]!, state: "SUCCESS", bucket: "pass", required: true }];
  const event = await watch({ previous, reviewChecks: ["Code Review Gate"], interval: 1, timeout: 0, maxErrors: 1, read: async () => current });
  assert.equal(event.assessment?.babysitComplete, true);
  const withoutExplicitHuman = await watch({ previous, interval: 1, timeout: 0, maxErrors: 1, read: async () => current });
  assert.deepEqual(withoutExplicitHuman.snapshot?.expectedReviewChecks, []);
});
test("changed checks, edited comments, reviews, threads, and head wake the watcher", () => {
  const previous = snapshot(), current = snapshot();
  previous.comments = [{ id: "1", updatedAt: "before", body: "old", url: "url", author: null, commit: null }];
  current.comments = [{ ...previous.comments[0]!, body: "edited", updatedAt: "after" }];
  current.facts.head = "new";
  current.checks[0] = { ...current.checks[0]!, state: "FAILURE", bucket: "fail" };
  current.reviews = [{ id: "2", submittedAt: "now", state: "CHANGES_REQUESTED", body: "Fix", url: "url", author: "reviewer", commit: "new" }];
  current.threads = [{ id: "3", resolved: false }];
  assert.deepEqual(changes(previous, current), ["head", "checks", "comments", "reviews", "threads"]);
  const { reviewDecision, ...otherFacts } = current.facts;
  const reorderedFacts = { ...current, facts: { reviewDecision, ...otherFacts } };
  assert.deepEqual(changes(current, reorderedFacts), []);
  current.comments.push({ ...current.comments[0]!, id: "other" });
  const reordered = structuredClone(current);
  reordered.comments.reverse();
  assert.deepEqual(changes(current, reordered), []);
});
test("public events include only new or edited feedback after the initial snapshot", async () => {
  const previous = snapshot();
  previous.comments = [{ id: "old", updatedAt: "then", body: "already handled", url: "url", author: null, commit: null }];
  const current = structuredClone(previous);
  current.comments.push({ ...previous.comments[0]!, id: "new", body: "new finding" });
  const event = await watch({ previous, interval: 1, timeout: 0, maxErrors: 1, read: async () => current });
  const output = JSON.parse(renderEvent(event, previous));
  assert.deepEqual(output.comments.map((row: { id: string }) => row.id), ["new"]);
  assert.equal(output.snapshot.comments, undefined);
  assert.equal(output.snapshot.facts.head, "abc");
  assert.equal(JSON.parse(renderEvent(event, null)).comments.length, 2);
});
test("query errors back off, recover, and stop after the consecutive error budget", async () => {
  const time = clock();
  let calls = 0;
  const event = await watch({ previous: null, interval: 1000, timeout: 0, maxErrors: 3, ...time,
    read: async () => { if (++calls < 3) throw new Error("unavailable"); return snapshot(); } });
  assert.equal(event.kind, "SNAPSHOT");
  assert.deepEqual(time.sleeps, [1000, 2000]);
  await assert.rejects(watch({ previous: null, interval: 1, timeout: 0, maxErrors: 2, ...clock(), read: async () => { throw new Error("unavailable"); } }), /unavailable/);
});
test("merged and closed PRs return terminal state even with an existing cursor", async () => {
  for (const state of ["CLOSED", "MERGED"]) {
    const current = snapshot();
    current.facts.state = state;
    const event = await watch({ previous: snapshot(), interval: 1, timeout: 0, maxErrors: 1, read: async () => current });
    assert.equal(event.kind, "CLOSED");
    assert.equal(event.snapshot?.facts.state, state);
  }
});

const rawFacts = { url: "https://github.com/owner/repo/pull/42", headRefOid: "abc", baseRefOid: "base", baseRefName: "main", state: "OPEN",
  isDraft: false, mergeable: "MERGEABLE", mergeStateStatus: "UNSTABLE", reviewDecision: "" };
function fakeCommand(headMoves = false): Command {
  let views = 0;
  return async (args) => {
    let data: unknown;
    if (args[0] === "pr" && args[1] === "view") data = { ...rawFacts, headRefOid: headMoves && ++views > 1 ? "new" : "abc" };
    else if (args[0] === "pr") data = snapshot().checks;
    else if (args[1] === "graphql") data = [
      { data: { repository: { pullRequest: { baseRef: { branchProtectionRule: null }, reviewThreads: { nodes: [{ id: "a", isResolved: true, comments: { nodes: [{ databaseId: 10, url: "url" }] } }] } } } } },
      { data: { repository: { pullRequest: { baseRef: { branchProtectionRule: null }, reviewThreads: { nodes: [{ id: "b", isResolved: false, comments: { nodes: [{ databaseId: 11, url: "url" }] } }] } } } } },
    ];
    else if (args[1]?.includes("/reviews")) data = [[{ id: 12, submitted_at: "now", state: "APPROVED", body: "good", html_url: "url", user: { login: "reviewer" }, commit_id: "abc" }]];
    else if (args[1]?.includes("/rules/branches/")) data = [[]];
    else data = [[{ id: 10, updated_at: "before", body: "first", html_url: "url", user: null }], [{ id: 11, updated_at: "now", body: "second", html_url: "url", user: { login: "bot" } }]];
    return { code: 0, stdout: JSON.stringify(data), stderr: "" };
  };
}
test("GitHub adapter reads paginated feedback and threads and rejects a moving head", async () => {
  const result = await readSnapshot("owner/repo", 42, fakeCommand());
  assert.equal(result.comments.length, 4);
  assert.equal(result.comments[1]?.body, "second");
  assert.equal(result.reviews[0]?.commit, "abc");
  assert.deepEqual(result.threads, [{ id: "a", resolved: true, rootCommentId: 10, url: "url" }, { id: "b", resolved: false, rootCommentId: 11, url: "url" }]);
  await assert.rejects(readSnapshot("owner/repo", 42, fakeCommand(true)), /PR changed while reading/);
});
test("GitHub adapter rejects partial GraphQL errors and malformed successful JSON", async () => {
  const fake = fakeCommand();
  for (const bad of [JSON.stringify([{ errors: [{ message: "denied" }], data: null }]), "not json"]) {
    const run: Command = (args) => args[1] === "graphql" ? Promise.resolve({ code: 0, stdout: bad, stderr: "" }) : fake(args);
    await assert.rejects(readSnapshot("owner/repo", 42, run));
  }
});
test("an empty check list remains unknown and check-query failures are not green", async () => {
  const fake = fakeCommand();
  const noChecks: Command = (args) => args[0] === "pr" && args[1] === "checks"
    ? Promise.resolve({ code: 1, stdout: "", stderr: "no checks reported on the branch" }) : fake(args);
  assert.deepEqual((await readSnapshot("owner/repo", 42, noChecks)).checks, []);
  const unavailable: Command = (args) => args[0] === "pr" && args[1] === "checks"
    ? Promise.resolve({ code: 1, stdout: "", stderr: "authentication failed" }) : fake(args);
  await assert.rejects(readSnapshot("owner/repo", 42, unavailable));
});
test("CLI persists the cursor, waits quietly on rearm, and preserves state on timeout", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "babysit-watch-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const fakeGh = join(directory, "gh"), state = join(directory, "state.json"), feedback = join(directory, "feedback.json");
  await writeFile(feedback, "[[]]");
  await writeFile(fakeGh, `#!${process.execPath}\nconst args = process.argv.slice(2);
const fs = require('node:fs');
let result;
if (args[0] === 'pr' && args[1] === 'view') result = ${JSON.stringify(rawFacts)};
else if (args[0] === 'pr') result = ${JSON.stringify(snapshot().checks)};
else if (args[1] === 'graphql') result = [{data:{repository:{pullRequest:{baseRef:{branchProtectionRule:null},reviewThreads:{nodes:[]}}}}}];
else if (args[1].includes('/rules/branches/')) result = [[]];
else if (args[1].includes('/issues/')) result = JSON.parse(fs.readFileSync(${JSON.stringify(feedback)}, 'utf8'));
else result = [[]];
console.log(JSON.stringify(result));\n`);
  await chmod(fakeGh, 0o755);
  const script = fileURLToPath(new URL("../../skills/babysit-pr/scripts/watch-pr.ts", import.meta.url));
  const run = (extra: string[] = []) => spawnSync(process.execPath, [script, "--repo", "owner/repo", "--pr", "42", "--state", state, ...extra],
    { encoding: "utf8", env: { ...process.env, PATH: `${directory}:${process.env.PATH}` }, timeout: 15_000 });
  const first = run();
  assert.equal(first.status, 0, first.stderr + first.stdout);
  assert.equal(JSON.parse(first.stdout).kind, "SNAPSHOT");
  const token = JSON.parse(first.stdout).deliveryToken;
  const replay = run();
  assert.equal(replay.stdout, first.stdout);
  const second = run(["--ack", token, "--timeout", "0.5", "--interval", "0.1"]);
  assert.equal(second.status, 5, second.stderr + second.stdout);
  assert.equal(JSON.parse(second.stdout).kind, "TIMEOUT");
  assert.equal(second.stdout.trim().split("\n").length, 1);
  const acknowledged = JSON.parse(await readFile(state, "utf8"));
  assert.equal(acknowledged.pending, null);
  assert.equal(acknowledged.previous.facts.head, "abc");
  await writeFile(feedback, JSON.stringify([[{ id: 123, updated_at: "now", body: "new finding", html_url: "url", user: { login: "bot" } }]]));
  const interruptedArgs = ["--repo", "owner/repo", "--pr", "42", "--state", state];
  const interruptBeforeOutput = `import { main } from ${JSON.stringify(pathToFileURL(script).href)};
const write = process.stdout.write.bind(process.stdout);
process.stdout.write = (chunk, ...rest) => {
  if (String(chunk).includes('"kind":"ACTIVITY"')) process.kill(process.pid, 'SIGKILL');
  return write(chunk, ...rest);
};
process.exitCode = await main(${JSON.stringify(interruptedArgs)});`;
  const interrupted = spawnSync(process.execPath, ["--input-type=module", "-e", interruptBeforeOutput],
    { encoding: "utf8", env: { ...process.env, PATH: `${directory}:${process.env.PATH}` }, timeout: 15_000 });
  assert.equal(interrupted.signal, "SIGKILL");
  assert.equal(interrupted.stdout, "");
  const third = run();
  assert.equal(third.status, 0, third.stderr + third.stdout);
  assert.equal(JSON.parse(third.stdout).kind, "ACTIVITY");
  assert.equal(JSON.parse(third.stdout).comments[0].body, "new finding");
  assert.equal(JSON.parse(await readFile(state, "utf8")).pending.snapshot.comments[0].id, "issue:123");
  const fourth = run(["--ack", JSON.parse(third.stdout).deliveryToken, "--timeout", "0.5", "--interval", "0.1"]);
  assert.equal(fourth.status, 5, fourth.stderr + fourth.stdout);
  const otherPr = spawnSync(process.execPath, [script, "--repo", "other/repo", "--pr", "42", "--state", state], { encoding: "utf8" });
  assert.equal(otherPr.status, 7);
  assert.match(JSON.parse(otherPr.stdout).message, /another PR/);
  const beforeOverlap = await readFile(state, "utf8");
  await writeFile(`${state}.lock`, JSON.stringify({ pid: process.pid, hostname: "test-owner" }));
  const overlapping = run();
  assert.equal(overlapping.status, 7);
  assert.match(JSON.parse(overlapping.stdout).message, /state is locked/);
  assert.equal(await readFile(state, "utf8"), beforeOverlap);
  await rm(`${state}.lock`);
  await writeFile(state, "{}");
  const corrupt = run();
  assert.equal(corrupt.status, 7);
  assert.match(JSON.parse(corrupt.stdout).message, /Unsupported delivery state schema/);
  const invalid = run(["--interval", "0"]);
  assert.equal(invalid.status, 64);
});
