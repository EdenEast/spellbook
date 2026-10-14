import type { Snapshot } from "./github.ts";

type Result = { reasons: string[]; mergeReady: boolean };
export type Assessment = Result & (
  | { status: "complete"; babysitComplete: true }
  | { status: "waiting" | "blocked" | "unknown" | "closed"; babysitComplete: false }
);

const humanGate = (name: string) => /^code review gate$/i.test(name.trim());
const reviewAutomation = (name: string) => /bugbot|coderabbit|code rabbit|greptile|copilot|review.?bot|ai.?review|security.?review|review.?automation|pr.?review/i.test(name);
export const isReviewAutomationCheck = (check: Snapshot["checks"][number]) =>
  !humanGate(check.name) && reviewAutomation(`${check.workflow} ${check.name}`);

/** Completion covers automation work; GitHub's human merge gates are separate. */
export function assess(snapshot: Snapshot, reviewChecks: readonly string[] = []): Assessment {
  const { facts, checks, threads } = snapshot;
  const successful = (bucket: string) => bucket === "pass" || bucket === "skipping";
  const mergeReady = facts.state === "OPEN" && !facts.draft && facts.mergeable === "MERGEABLE" &&
    ["CLEAN", "HAS_HOOKS"].includes(facts.mergeState) &&
    !["CHANGES_REQUESTED", "REVIEW_REQUIRED"].includes(facts.reviewDecision) &&
    checks.length > 0 && checks.filter((check) => check.required !== false).every((check) => successful(check.bucket)) &&
    threads.every((thread) => thread.resolved);
  if (facts.state !== "OPEN") return { status: "closed", babysitComplete: false, mergeReady: false, reasons: [facts.state.toLowerCase()] };
  const blockers: string[] = [];
  if (facts.mergeable === "CONFLICTING" || ["DIRTY", "CONFLICTING"].includes(facts.mergeState)) blockers.push("conflicts");
  if (facts.reviewDecision === "CHANGES_REQUESTED") blockers.push("changes-requested");
  if (threads.some((thread) => !thread.resolved)) blockers.push("unresolved-threads");
  // Unknown legacy metadata remains conservative until a fresh live read.
  const work = checks.filter((check) => !humanGate(check.name) &&
    (check.required !== false || reviewChecks.includes(check.name) || isReviewAutomationCheck(check)));
  for (const check of work) {
    if (["fail", "cancel"].includes(check.bucket)) blockers.push(`check-failed:${check.name}`);
  }
  if (blockers.length > 0) return { status: "blocked", babysitComplete: false, mergeReady, reasons: blockers };
  const missing = reviewChecks.filter((name) => !humanGate(name) && !checks.some((check) => check.name === name)).map((name) => `check-unreported:${name}`);
  if (missing.length > 0) return { status: "unknown", babysitComplete: false, mergeReady, reasons: missing };
  if (checks.length === 0) return { status: "unknown", babysitComplete: false, mergeReady: false, reasons: ["checks-unreported"] };
  const pending = work.filter((check) => !successful(check.bucket)).map((check) => `check-pending:${check.name}`);
  if (pending.length > 0) return { status: "waiting", babysitComplete: false, mergeReady, reasons: pending };
  return { status: "complete", babysitComplete: true, mergeReady, reasons: [] };
}
