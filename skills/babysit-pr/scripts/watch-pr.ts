#!/usr/bin/env node
import { isDeepStrictEqual, parseArgs } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { readSnapshot, parseSnapshot } from "./github.ts";
import type { Snapshot } from "./github.ts";
import { assess, humanGate, isReviewAutomationCheck } from "./policy.ts";
import { loadDelivery, stageDelivery, withDeliveryLock } from "./delivery.ts";

export { readSnapshot, parseSnapshot } from "./github.ts";
export type { Snapshot, Check, Comment, Review, Thread, Facts, Command } from "./github.ts";
export type Event = {
  schemaVersion: 1; kind: "SNAPSHOT" | "ACTIVITY" | "READY" | "CLOSED" | "TIMEOUT";
  reasons: string[]; snapshot: Snapshot | null; assessment: ReturnType<typeof assess> | null;
};
function canonical<T>(rows: T[], key: (row: T) => string): string {
  return JSON.stringify([...rows].sort((a, b) => key(a).localeCompare(key(b))));
}
export function renderEvent(event: Event, previous: Snapshot | null): string {
  if (event.snapshot === null) return JSON.stringify(event);
  const { comments, reviews, ...snapshot } = event.snapshot;
  const changed = <T extends { id: string }>(before: T[], after: T[]): T[] => {
    const old = new Map(before.map((row) => [row.id, JSON.stringify(row)]));
    return after.filter((row) => old.get(row.id) !== JSON.stringify(row));
  };
  return JSON.stringify({ ...event, snapshot,
    comments: previous === null ? comments : changed(previous.comments, comments),
    reviews: previous === null ? reviews : changed(previous.reviews, reviews),
  });
}
export function changes(previous: Snapshot, current: Snapshot): string[] {
  const reasons: string[] = [];
  if (previous.facts.head !== current.facts.head) reasons.push("head");
  if (previous.facts.base !== current.facts.base) reasons.push("base");
  if (canonical(previous.checks, (row) => `${row.workflow}:${row.name}:${row.link}`) !== canonical(current.checks, (row) => `${row.workflow}:${row.name}:${row.link}`)) reasons.push("checks");
  if (canonical(previous.comments, (row) => row.id) !== canonical(current.comments, (row) => row.id)) reasons.push("comments");
  if (canonical(previous.reviews, (row) => row.id) !== canonical(current.reviews, (row) => row.id)) reasons.push("reviews");
  if (canonical(previous.threads, (row) => row.id) !== canonical(current.threads, (row) => row.id)) reasons.push("threads");
  if (!isDeepStrictEqual(previous.facts, current.facts) && !reasons.includes("head") && !reasons.includes("base")) reasons.push("pr-state");
  return reasons;
}
export async function watch(options: {
  previous: Snapshot | null; interval: number; timeout: number; maxErrors: number;
  reviewChecks?: readonly string[];
  read: () => Promise<Snapshot>; sleep?: (ms: number) => Promise<void>; now?: () => number;
}): Promise<Event> {
  const sleep = options.sleep ?? delay;
  const now = options.now ?? Date.now;
  const started = now();
  const expectedReviewChecks = new Set([
    ...(options.previous?.expectedReviewChecks ?? []), ...(options.reviewChecks ?? []),
    ...(options.previous?.checks.filter(isReviewAutomationCheck).map((check) => check.name) ?? []),
  ]);
  let expectedRequiredChecks = options.previous?.expectedRequiredChecks ?? options.previous?.checks.filter((check) => check.required !== false).map((check) => check.name) ?? [];
  let lastAssessment: ReturnType<typeof assess> | null = null;
  let errors = 0;
  while (true) {
    if (options.timeout > 0 && now() - started >= options.timeout)
      return { schemaVersion: 1, kind: "TIMEOUT", reasons: lastAssessment?.reasons ?? [], snapshot: null, assessment: lastAssessment };
    let snapshot: Snapshot;
    try {
      snapshot = await options.read();
      errors = 0;
    } catch (error) {
      errors += 1;
      if (errors >= options.maxErrors) throw error;
      const backoff = Math.min(Math.max(options.interval, 1000) * 2 ** (errors - 1), 300_000);
      await sleep(options.timeout > 0 ? Math.min(backoff, Math.max(0, options.timeout - (now() - started))) : backoff);
      continue;
    }
    for (const check of snapshot.checks)
      if (isReviewAutomationCheck(check)) expectedReviewChecks.add(check.name);
    // A live requirements read supersedes history; legacy snapshots retain known gates.
    expectedRequiredChecks = [...new Set([
      ...(snapshot.expectedRequiredChecks ?? expectedRequiredChecks),
      ...snapshot.checks.filter((check) => check.required !== false).map((check) => check.name),
    ])].filter((name) => !humanGate(name)).sort();
    snapshot = { ...snapshot, expectedRequiredChecks, expectedReviewChecks: [...expectedReviewChecks].sort() };
    const assessment = assess(snapshot, snapshot.expectedReviewChecks);
    lastAssessment = assessment;
    const reasons = options.previous === null ? [] : changes(options.previous, snapshot);
    // Feedback must reach the agent even when checks turn green in the same poll.
    const kind = snapshot.facts.state !== "OPEN" ? "CLOSED"
      : reasons.length > 0 ? "ACTIVITY"
      : options.previous === null ? "SNAPSHOT"
      : assessment.babysitComplete ? "READY" : null;
    if (kind !== null) return { schemaVersion: 1, kind, reasons, snapshot, assessment };
    const remaining = options.timeout > 0 ? options.timeout - (now() - started) : options.interval;
    await sleep(Math.max(0, Math.min(options.interval, remaining)));
  }
}

const help = `Usage: node watch-pr.ts --repo OWNER/REPO --pr NUMBER --state PATH [options]

First invocation returns SNAPSHOT and creates the state file. Handle the event, then pass
--ack DELIVERY_TOKEN on the next call to acknowledge it and wait for activity.
Without acknowledgment, the pending event is replayed without querying GitHub.

--ack TOKEN           Acknowledge the handled event and continue watching
--review-check NAME   Additional review check to await (repeat for each name)
--interval SECONDS    Poll interval (default 60)
--timeout SECONDS     Maximum wait (default 900; 0 for unlimited)
--max-errors COUNT    Consecutive query error limit (default 5)
--help               Show this help

One JSON event is printed on return. Exit codes: 0 event, 5 timeout, 7 error,
64 invalid arguments. Requires Node.js 24+ and authenticated GitHub CLI.
`;
export async function main(argv: string[]): Promise<number> {
  let options;
  try {
    const { values } = parseArgs({ args: argv, options: {
      ack: { type: "string" }, repo: { type: "string" }, pr: { type: "string" }, state: { type: "string" },
      "review-check": { type: "string", multiple: true },
      interval: { type: "string", default: "60" }, timeout: { type: "string", default: "900" },
      "max-errors": { type: "string", default: "5" }, help: { type: "boolean" },
    } });
    if (values.help) { process.stdout.write(help); return 0; }
    const pr = Number(values.pr), interval = Number(values.interval), timeout = Number(values.timeout), maxErrors = Number(values["max-errors"]);
    if (!values.repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(values.repo) ||
      !Number.isSafeInteger(pr) || pr <= 0 || !values.state ||
      !Number.isFinite(interval) || interval <= 0 || !Number.isFinite(timeout) || timeout < 0 ||
      !Number.isSafeInteger(maxErrors) || maxErrors <= 0) throw new Error("Invalid arguments. Use --help.");
    if (values["review-check"]?.some((name) => name.trim().length === 0)) throw new Error("Review check names must not be empty");
    options = { ack: values.ack, reviewChecks: values["review-check"], repo: values.repo, pr, state: values.state, interval: interval * 1000, timeout: timeout * 1000, maxErrors };
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 64;
  }
  try {
    const expectedUrl = `https://github.com/${options.repo}/pull/${options.pr}`;
    const result = await withDeliveryLock(options.state, async () => {
      const delivery = await loadDelivery(options.state, expectedUrl, parseSnapshot, options.ack);
      if (delivery.pending !== null) {
        return { output: delivery.pending.output, exitCode: delivery.pending.exitCode };
      }
      const previous = delivery.previous;
      const event = await watch({ ...options, previous, read: () => readSnapshot(options.repo, options.pr) });
      if (event.snapshot !== null) {
        if (event.snapshot.facts.url.toLowerCase() !== expectedUrl.toLowerCase()) throw new Error("Watcher supports github.com repositories only");
        event.snapshot = parseSnapshot(event.snapshot);
        const pending = await stageDelivery(options.state, delivery, event.snapshot, renderEvent(event, previous), 0);
        return { output: pending.output, exitCode: pending.exitCode };
      }
      return { output: renderEvent(event, previous), exitCode: event.kind === "TIMEOUT" ? 5 : 0 };
    });
    process.stdout.write(`${result.output}\n`);
    return result.exitCode;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ schemaVersion: 1, kind: "ERROR", message: error instanceof Error ? error.message : String(error) })}\n`);
    return 7;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = await main(process.argv.slice(2));
