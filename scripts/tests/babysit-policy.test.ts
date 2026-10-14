import assert from "node:assert/strict";
import { test } from "node:test";
import { assess } from "../../skills/babysit-pr/scripts/policy.ts";
import type { Snapshot } from "../../skills/babysit-pr/scripts/watch-pr.ts";

function snapshot(): Snapshot {
  return {
    schemaVersion: 1,
    facts: { url: "https://github.com/owner/repo/pull/42", head: "abc", base: "base", state: "OPEN",
      draft: false, mergeable: "MERGEABLE", mergeState: "CLEAN", reviewDecision: "" },
    checks: [{ name: "build", required: true, state: "SUCCESS", bucket: "pass", link: "url", workflow: "CI" }],
    comments: [], reviews: [], threads: [],
  };
}

test("required failures and pending checks prevent babysit completion", () => {
  for (const [bucket, status] of [["pending", "waiting"], ["fail", "blocked"], ["cancel", "blocked"]] as const) {
    const current = snapshot();
    current.checks[0]!.bucket = bucket;
    assert.equal(assess(current).status, status);
    assert.equal(assess(current).babysitComplete, false);
  }
});
test("optional CI does not prolong babysitting, including optional failure", () => {
  for (const bucket of ["pending", "fail", "cancel"]) {
    const current = snapshot();
    current.checks.push({ ...current.checks[0]!, name: "coverage", required: false, bucket });
    assert.deepEqual(assess(current), { status: "complete", babysitComplete: true, mergeReady: true, reasons: [] });
  }
});
test("human approval, drafts, and Code Review Gate do not prolong automation work", () => {
  const current = snapshot();
  current.facts.draft = true;
  current.facts.reviewDecision = "REVIEW_REQUIRED";
  current.facts.mergeState = "BLOCKED";
  current.checks.push({ ...current.checks[0]!, name: "Code Review Gate", bucket: "pending" });
  assert.deepEqual(assess(current), { status: "complete", babysitComplete: true, mergeReady: false, reasons: [] });
});
test("optional review automation still must finish", () => {
  for (const name of ["Bugbot", "CodeRabbit", "Greptile", "Copilot Review", "AI review", "Security Review", "Review Automation", "PR Review Automation"]) {
    const current = snapshot();
    current.checks.push({ ...current.checks[0]!, name, required: false, bucket: "pending" });
    assert.equal(assess(current).status, "waiting", name);
    current.checks[1]!.bucket = "fail";
    assert.equal(assess(current).status, "blocked", name);
  }
});
test("missing required metadata remains conservative", () => {
  const current = snapshot();
  delete current.checks[0]!.required;
  current.checks[0]!.bucket = "pending";
  assert.equal(assess(current).status, "waiting");
});
test("configured custom review checks wait until scheduled and completed", () => {
  const current = snapshot();
  assert.deepEqual(assess(current, ["Acme Reviewer"]), {
    status: "unknown", babysitComplete: false, mergeReady: true, reasons: ["check-unreported:Acme Reviewer"],
  });
  current.checks.push({ ...current.checks[0]!, name: "Acme Reviewer", required: false, bucket: "pending" });
  assert.equal(assess(current).babysitComplete, true);
  assert.deepEqual(assess(current, ["Acme Reviewer"]), {
    status: "waiting", babysitComplete: false, mergeReady: true, reasons: ["check-pending:Acme Reviewer"],
  });
  current.checks[1]!.bucket = "pass";
  assert.equal(assess(current, ["Acme Reviewer"]).babysitComplete, true);
  current.checks[1]!.bucket = "fail";
  assert.equal(assess(current, ["Acme Reviewer"]).status, "blocked");
});
test("unresolved threads, changes requested, and conflicts block completion", () => {
  for (const blocker of ["threads", "review", "conflicts", "conflicting-state"]) {
    const current = snapshot();
    if (blocker === "threads") current.threads.push({ id: "thread", resolved: false });
    if (blocker === "review") current.facts.reviewDecision = "CHANGES_REQUESTED";
    if (blocker === "conflicts") current.facts.mergeable = "CONFLICTING";
    if (blocker === "conflicting-state") current.facts.mergeState = "CONFLICTING";
    assert.equal(assess(current).status, "blocked", blocker);
    assert.equal(assess(current).babysitComplete, false, blocker);
  }
});
test("empty checks are unknown and closed PRs are terminal", () => {
  const current = snapshot();
  current.checks = [];
  assert.deepEqual(assess(current), { status: "unknown", babysitComplete: false, mergeReady: false, reasons: ["checks-unreported"] });
  current.facts.state = "MERGED";
  assert.deepEqual(assess(current), { status: "closed", babysitComplete: false, mergeReady: false, reasons: ["merged"] });
});
