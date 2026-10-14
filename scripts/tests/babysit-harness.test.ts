import assert from "node:assert/strict";
import { test } from "node:test";
import { runHarnessCase } from "./babysit-harness.fixture.ts";

test("a long-lived command stays quiet and returns new feedback without caller-side GitHub queries", async () => {
  const result = await runHarnessCase("comment");
  assert.equal(result.idleHadNoOutput, true);
  assert.ok(result.idleQueries > 8, "The command performed internal polling during the wait");
  assert.equal(result.outputLines, 1);
  assert.equal(result.event.kind, "ACTIVITY");
  assert.deepEqual(result.event.reasons, ["comments"]);
  assert.equal(result.event.comments[0].body, "A new finding");
  assert.equal(typeof result.event.deliveryToken, "string");
});
test("CI completion returns the stopping decision in the same event despite pending human approval", async () => {
  const result = await runHarnessCase("ci");
  assert.equal(result.idleHadNoOutput, true);
  assert.equal(result.outputLines, 1);
  assert.equal(result.event.kind, "ACTIVITY");
  assert.equal(result.event.assessment.babysitComplete, true);
  assert.equal(result.event.assessment.mergeReady, false);
  assert.equal(typeof result.event.deliveryToken, "string");
});
