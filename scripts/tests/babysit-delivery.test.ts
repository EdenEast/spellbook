import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { loadDelivery, stageDelivery } from "../../skills/babysit-pr/scripts/delivery.ts";
import type { Snapshot } from "../../skills/babysit-pr/scripts/watch-pr.ts";

const url = "https://github.com/owner/repo/pull/12";
function snapshot(head = "head"): Snapshot {
  return {
    schemaVersion: 1,
    facts: { url, head, base: "base", state: "OPEN", draft: false, mergeable: "MERGEABLE", mergeState: "CLEAN", reviewDecision: "" },
    checks: [], comments: [], reviews: [], threads: [],
  };
}
function parse(value: unknown): Snapshot {
  const row = value as Snapshot;
  assert.equal(row.schemaVersion, 1);
  assert.equal(typeof row.facts.url, "string");
  assert.ok(Array.isArray(row.checks));
  return row;
}
async function fixture(run: (path: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "babysit-delivery-"));
  try { await run(join(directory, "state.json")); }
  finally { await rm(directory, { recursive: true, force: true }); }
}
const output = JSON.stringify({ schemaVersion: 1, kind: "ACTIVITY", reasons: ["comments"], snapshot: snapshot(), comments: [{ body: "Please fix this" }] });

test("an event interrupted before stdout remains pending and replays identical feedback", async () => {
  await fixture(async (path) => {
    const initial = await loadDelivery(path, url, parse);
    const pending = await stageDelivery(path, initial, snapshot(), output);
    // The process exits here without printing or acknowledging its event.
    const restarted = await loadDelivery(path, url, parse);
    assert.equal(restarted.previous, null);
    assert.equal(restarted.pending?.output, pending.output);
    assert.equal(JSON.parse(restarted.pending!.output).comments[0].body, "Please fix this");
    assert.equal(JSON.parse(restarted.pending!.output).deliveryToken, pending.token);
    assert.equal((await loadDelivery(path, url, parse)).pending?.output, pending.output);
    assert.equal((await stat(path)).mode & 0o777, 0o600);
  });
});

test("acknowledgment advances the cursor and retries after interruption preserve the next event", async () => {
  await fixture(async (path) => {
    const first = await stageDelivery(path, await loadDelivery(path, url, parse), snapshot("first"), output);
    const acknowledged = await loadDelivery(path, url, parse, first.token);
    assert.equal(acknowledged.pending, null);
    assert.equal(acknowledged.previous?.facts.head, "first");
    // Crash after accepting --ack, before the next wait completes.
    const retried = await loadDelivery(path, url, parse, first.token);
    assert.equal(retried.previous?.facts.head, "first");
    const second = await stageDelivery(path, retried, snapshot("second"), output);
    const retryWithPriorAck = await loadDelivery(path, url, parse, first.token);
    assert.equal(retryWithPriorAck.pending?.output, second.output);
    assert.equal(retryWithPriorAck.previous?.facts.head, "first");
    const final = await loadDelivery(path, url, parse, second.token);
    assert.equal(final.previous?.facts.head, "second");
    assert.equal(final.pending, null);
  });
});

test("wrong and stale acknowledgments cannot discard pending feedback", async () => {
  await fixture(async (path) => {
    await assert.rejects(loadDelivery(path, url, parse, "unknown"), /without saved state/);
    const first = await stageDelivery(path, await loadDelivery(path, url, parse), snapshot("first"), output);
    const before = await readFile(path, "utf8");
    await assert.rejects(loadDelivery(path, url, parse, "wrong"), /does not match/);
    assert.equal(await readFile(path, "utf8"), before);
    const state = await loadDelivery(path, url, parse, first.token);
    const second = await stageDelivery(path, state, snapshot("second"), output);
    await loadDelivery(path, url, parse, second.token);
    const third = await stageDelivery(path, await loadDelivery(path, url, parse), snapshot("third"), output);
    await assert.rejects(loadDelivery(path, url, parse, first.token), /does not match/);
    assert.equal((await loadDelivery(path, url, parse)).pending?.output, third.output);
  });
});

test("timeouts preserve the acknowledged cursor and legacy snapshots remain usable", async () => {
  await fixture(async (path) => {
    await writeFile(path, JSON.stringify(snapshot("legacy")));
    const baseline = await loadDelivery(path, url, parse);
    assert.equal(baseline.previous?.facts.head, "legacy");
    await assert.rejects(stageDelivery(path, baseline, snapshot(), JSON.stringify({ schemaVersion: 1, kind: "TIMEOUT" }), 5), /Only snapshot/);
    assert.equal((await loadDelivery(path, url, parse)).previous?.facts.head, "legacy");
    const event = await stageDelivery(path, baseline, snapshot("new"), output);
    await loadDelivery(path, url, parse, event.token);
    const saved = await readFile(path, "utf8");
    const timeoutBaseline = await loadDelivery(path, url, parse);
    assert.equal(timeoutBaseline.previous?.facts.head, "new");
    assert.equal(await readFile(path, "utf8"), saved);
  });
});

test("state is PR-bound and malformed pending delivery is rejected", async () => {
  await fixture(async (path) => {
    const event = await stageDelivery(path, await loadDelivery(path, url, parse), snapshot(), output);
    await assert.rejects(loadDelivery(path, "https://github.com/owner/repo/pull/13", parse), /another PR/);
    const saved = JSON.parse(await readFile(path, "utf8"));
    saved.pending.output = JSON.stringify({ ...JSON.parse(event.output), deliveryToken: "different" });
    await writeFile(path, JSON.stringify(saved));
    await assert.rejects(loadDelivery(path, url, parse, event.token), /Invalid pending/);
    saved.pending.output = event.output;
    saved.pending.snapshot.facts.url = "https://github.com/owner/repo/pull/13";
    await writeFile(path, JSON.stringify(saved));
    await assert.rejects(loadDelivery(path, url, parse), /another PR/);
  });
});
