import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSnapshot, readSnapshot } from "../../skills/babysit-pr/scripts/github.ts";
import type { Command } from "../../skills/babysit-pr/scripts/github.ts";

const facts = { url: "https://github.com/o/r/pull/42", headRefOid: "head", baseRefOid: "base", state: "OPEN", isDraft: false, mergeable: "MERGEABLE", mergeStateStatus: "BLOCKED", reviewDecision: "REVIEW_REQUIRED" };
const build = { name: "build", workflow: "CI", link: "https://github.com/o/r/actions/runs/1", bucket: "pass", state: "SUCCESS" };
const optional = { ...build, name: "optional", bucket: "pending", state: "IN_PROGRESS" };
const rawComment = { id: 100, updated_at: "now", body: "Fix this", html_url: "https://github.com/o/r/pull/42#discussion_r100", user: { login: "bot" }, commit_id: "head", path: "src/a.ts", line: 12, start_line: 10, side: "RIGHT" };
const thread = (id: string, root: number) => ({ id, isResolved: false, comments: { nodes: [{ databaseId: root, url: `https://github.com/o/r/pull/42#discussion_r${root}` }] } });
const graph = (nodes: unknown[]) => ({ data: { repository: { pullRequest: { reviewThreads: { nodes } } } } });
function fixture(overrides: { noRequired?: boolean; noAll?: boolean; moving?: "head" | "base"; badThread?: boolean } = {}): Command {
  let views = 0;
  return async (args) => {
    let value: unknown;
    if (args[1] === "view") {
      value = { ...facts, ...(views++ > 0 && overrides.moving ? { [overrides.moving === "head" ? "headRefOid" : "baseRefOid"]: "changed" } : {}) };
    } else if (args[1] === "checks") {
      if (overrides.noAll || (overrides.noRequired && args.includes("--required"))) return { code: 1, stdout: "", stderr: `no ${args.includes("--required") && !overrides.noAll ? "required " : ""}checks reported on the 'branch' branch` };
      value = args.includes("--required") ? [build] : [build, optional];
    } else if (args[1] === "graphql") value = [graph([overrides.badThread ? { ...thread("T1", 100), isResolved: "false" } : thread("T1", 100)]), graph([thread("T2", 300)])];
    else if (args[1]?.includes("/pulls/42/comments")) value = [[rawComment], [{ ...rawComment, id: 101, body: "Reply", in_reply_to_id: 100 }, { ...rawComment, id: 300, body: "Other thread" }]];
    else if (args[1]?.includes("/issues/")) value = [[{ id: 77, updated_at: "now", body: "Summary", html_url: "issue-url", user: null }]];
    else value = [[]];
    return { code: 0, stdout: JSON.stringify(value), stderr: "" };
  };
}
test("paginated inline feedback includes location and reply/resolve IDs for roots and replies", async () => {
  const snapshot = await readSnapshot("o/r", 42, fixture());
  assert.deepEqual(snapshot.comments.map((comment) => [comment.databaseId, comment.threadId, comment.inReplyTo]), [[77, null, null], [100, "T1", null], [101, "T1", 100], [300, "T2", null]]);
  assert.deepEqual(snapshot.comments[1], { id: "inline:100", updatedAt: "now", body: "Fix this", url: rawComment.html_url, author: "bot", commit: "head", databaseId: 100, path: "src/a.ts", line: 12, startLine: 10, side: "RIGHT", inReplyTo: null, threadId: "T1", originalLine: null, originalStartLine: null, originalCommit: null });
  assert.deepEqual(snapshot.threads[0], { id: "T1", resolved: false, rootCommentId: 100, url: rawComment.html_url });
});
test("required checks remain distinguishable while optional checks stay in context", async () => {
  assert.deepEqual((await readSnapshot("o/r", 42, fixture())).checks.map(({ name, required }) => ({ name, required })), [{ name: "build", required: true }, { name: "optional", required: false }]);
  assert.deepEqual((await readSnapshot("o/r", 42, fixture({ noRequired: true }))).checks.map(({ required }) => required), [false, false]);
  assert.deepEqual((await readSnapshot("o/r", 42, fixture({ noAll: true }))).checks, []);
});
test("legacy saved snapshots retain unknown required status and tolerate missing metadata", () => {
  const result = parseSnapshot({ schemaVersion: 1, facts: { url: facts.url, head: "head", base: "base", state: "OPEN", draft: false, mergeable: "MERGEABLE", mergeState: "BLOCKED", reviewDecision: "" }, checks: [build], comments: [{ id: "inline:100", updatedAt: "now", body: "Fix", url: "url", author: null, commit: "head" }], reviews: [], threads: [{ id: "T1", resolved: false }] });
  assert.equal(result.checks[0]?.required, undefined);
  assert.equal(result.comments[0]?.threadId, null);
  assert.equal(result.comments[0]?.databaseId, null);
  assert.deepEqual(result.threads, [{ id: "T1", resolved: false, rootCommentId: null, url: null }]);
  assert.throws(() => parseSnapshot({ ...result, checks: [{ ...build, required: "true" }] }), /Expected a boolean/);
});
test("moving head/base and malformed thread booleans are rejected at the boundary", async () => {
  for (const moving of ["head", "base"] as const) await assert.rejects(readSnapshot("o/r", 42, fixture({ moving })), /PR changed while reading/);
  await assert.rejects(readSnapshot("o/r", 42, fixture({ badThread: true })), /Expected a boolean/);
});
test("required-only newer run is retained instead of dropping a required gate", async () => {
  const run = fixture();
  const snapshot = await readSnapshot("o/r", 42, async (args) => args[1] === "checks" && args.includes("--required")
    ? { code: 0, stdout: JSON.stringify([{ ...build, link: "new-run", bucket: "pending", state: "IN_PROGRESS" }]), stderr: "" } : run(args));
  assert.deepEqual(snapshot.checks.filter(({ required }) => required).map(({ link, bucket }) => ({ link, bucket })), [{ link: "new-run", bucket: "pending" }]);
});

test("outdated inline feedback preserves explicit original location after pushes", async () => {
  const base = fixture();
  const result = await readSnapshot("o/r", 42, async (args) => args[1]?.includes("/pulls/42/comments")
    ? { code: 0, stdout: JSON.stringify([[{ ...rawComment, line: null, start_line: null, original_line: 12, original_start_line: 10, original_commit_id: "old-head" }]]), stderr: "" }
    : base(args));
  const inline = result.comments.find((comment) => comment.id === "inline:100")!;
  assert.equal(inline.line, null);
  assert.equal(inline.startLine, null);
  assert.equal(inline.originalLine, 12);
  assert.equal(inline.originalStartLine, 10);
  assert.equal(inline.originalCommit, "old-head");
  assert.equal(parseSnapshot(result).comments.find((comment) => comment.id === "inline:100")?.originalCommit, "old-head");
});
