import { execFile } from "node:child_process";

export type Check = { name: string; state: string; bucket: string; link: string; workflow: string; required?: boolean };
export type Comment = { id: string; updatedAt: string; body: string; url: string; author: string | null; commit: string | null; databaseId?: number | null; path?: string | null; line?: number | null; startLine?: number | null; side?: string | null; inReplyTo?: number | null; threadId?: string | null; originalLine?: number | null; originalStartLine?: number | null; originalCommit?: string | null };
export type Review = { id: string; submittedAt: string | null; state: string; body: string; url: string; author: string | null; commit: string };
export type Thread = { id: string; resolved: boolean; rootCommentId?: number | null; url?: string | null };
export type Facts = {
  url: string; head: string; base: string; baseName?: string; state: string; draft: boolean;
  mergeable: string; mergeState: string; reviewDecision: string;
};
export type Snapshot = {
  schemaVersion: 1; facts: Facts; checks: Check[]; comments: Comment[]; reviews: Review[]; threads: Thread[]; expectedReviewChecks?: string[]; expectedRequiredChecks?: string[];
};
export type CommandResult = { code: number; stdout: string; stderr: string };
export type Command = (args: string[]) => Promise<CommandResult>;
const command: Command = (args) => new Promise((resolve, reject) => {
  execFile("gh", args, { timeout: 30_000, maxBuffer: 32 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error && typeof error.code !== "number") reject(error);
    else resolve({ code: error?.code as number ?? 0, stdout, stderr });
  });
});

function object(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected a JSON object");
  return value as Record<string, unknown>;
}
function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Expected a JSON array");
  return value;
}
function string(value: unknown): string {
  if (typeof value !== "string") throw new Error("Expected a string");
  return value;
}
function boolean(value: unknown): boolean {
  if (typeof value !== "boolean") throw new Error("Expected a boolean");
  return value;
}
function id(value: unknown): string {
  if (typeof value === "number" && Number.isSafeInteger(value)) return String(value);
  return string(value);
}
function nullableString(value: unknown): string | null {
  return value === null ? null : string(value);
}
function author(value: unknown): string | null {
  return value === null ? null : string(object(value).login);
}
async function json(run: Command, args: string[]): Promise<unknown> {
  const result = await run(args);
  if (result.code !== 0) throw new Error(result.stderr.trim() || `gh exited with ${result.code}`);
  return JSON.parse(result.stdout);
}
function facts(value: unknown): Facts & { baseName: string } {
  const row = object(value);
  return {
    url: string(row.url), head: string(row.headRefOid), base: string(row.baseRefOid), baseName: string(row.baseRefName),
    state: string(row.state), draft: boolean(row.isDraft), mergeable: string(row.mergeable),
    mergeState: string(row.mergeStateStatus), reviewDecision: nullableString(row.reviewDecision) ?? "",
  };
}
function optionalNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Expected a nonnegative integer");
  return value;
}
function optionalString(value: unknown): string | null {
  return value === undefined || value === null ? null : string(value);
}
function comment(value: unknown): Comment {
  const row = object(value);
  return {
    id: `${row.commit_id === undefined ? "issue" : "inline"}:${id(row.id)}`, updatedAt: string(row.updated_at), body: string(row.body),
    url: string(row.html_url), author: author(row.user),
    commit: row.commit_id === undefined ? null : nullableString(row.commit_id),
    databaseId: optionalNumber(row.id), path: optionalString(row.path), line: optionalNumber(row.line),
    startLine: optionalNumber(row.start_line), side: optionalString(row.side), inReplyTo: optionalNumber(row.in_reply_to_id), threadId: null,
    originalLine: optionalNumber(row.original_line), originalStartLine: optionalNumber(row.original_start_line), originalCommit: optionalString(row.original_commit_id),
  };
}
const threadQuery = `query($owner:String!,$repo:String!,$number:Int!,$endCursor:String) {
  repository(owner:$owner,name:$repo) { pullRequest(number:$number) {
    baseRef { branchProtectionRule { requiredStatusCheckContexts } }
    reviewThreads(first:100,after:$endCursor) {
      nodes { id isResolved comments(first:1) { nodes { databaseId url } } } pageInfo { hasNextPage endCursor }
    }
  } }
}`;
export async function readSnapshot(repo: string, pr: number, run: Command = command): Promise<Snapshot> {
  const [owner, name] = repo.split("/");
  const viewArgs = ["pr", "view", String(pr), "--repo", repo, "--json",
    "url,headRefOid,baseRefOid,baseRefName,state,isDraft,mergeable,mergeStateStatus,reviewDecision"];
  const before = facts(await json(run, viewArgs));
  if (before.state !== "OPEN") return { schemaVersion: 1, facts: before, checks: [], comments: [], reviews: [], threads: [] };
  const endpoint = `repos/${repo}`;
  const results = await Promise.allSettled([
    run(["pr", "checks", String(pr), "--repo", repo, "--json", "name,state,bucket,link,workflow"]),
    run(["pr", "checks", String(pr), "--repo", repo, "--required", "--json", "name,state,bucket,link,workflow"]),
    json(run, ["api", `${endpoint}/issues/${pr}/comments?per_page=100`, "--paginate", "--slurp"]),
    json(run, ["api", `${endpoint}/pulls/${pr}/comments?per_page=100`, "--paginate", "--slurp"]),
    json(run, ["api", `${endpoint}/pulls/${pr}/reviews?per_page=100`, "--paginate", "--slurp"]),
    json(run, ["api", "graphql", "--paginate", "--slurp", "-f", `query=${threadQuery}`,
      "-f", `owner=${owner}`, "-f", `repo=${name}`, "-F", `number=${pr}`]),
    json(run, ["api", `${endpoint}/rules/branches/${encodeURIComponent(before.baseName)}?per_page=100`, "--paginate", "--slurp"]),
  ]);
  const values = results.map((result) => {
    if (result.status === "rejected") throw result.reason;
    return result.value;
  });
  const parseChecks = (value: unknown, required: boolean): Check[] => {
    const result = object(value);
    const code = optionalNumber(result.code), stdout = string(result.stdout), stderr = string(result.stderr);
    if (code === 1 && !stdout.trim() && (required ? /no (?:required )?checks reported/i : /no checks reported/i).test(stderr)) return [];
    if (code === null || ![0, 1, 8].includes(code)) throw new Error(stderr || "Cannot read checks");
    return array(JSON.parse(stdout)).map((value) => {
      const row = object(value), bucket = string(row.bucket);
      if (!["pass", "fail", "pending", "skipping", "cancel"].includes(bucket)) throw new Error(`Unknown check bucket ${bucket}`);
      return { name: string(row.name), state: string(row.state), bucket, link: string(row.link), workflow: string(row.workflow), required };
    });
  };
  const allChecks = parseChecks(values[0], false), requiredChecks = parseChecks(values[1], true);
  const key = (check: Check) => JSON.stringify([check.workflow, check.name, check.link]);
  const checksByKey = new Map(allChecks.map((check) => [key(check), check]));
  // The required read can see a newer run; retain it rather than silently losing a required gate.
  for (const check of requiredChecks) checksByKey.set(key(check), check);
  const checks = [...checksByKey.values()];
  const pages = (value: unknown) => array(value).flatMap(array);
  const comments = [...pages(values[2]), ...pages(values[3])].map(comment);
  const reviews = pages(values[4]).map((value): Review => {
    const row = object(value);
    return { id: id(row.id), submittedAt: nullableString(row.submitted_at), state: string(row.state),
      body: string(row.body), url: string(row.html_url), author: author(row.user), commit: string(row.commit_id) };
  });
  // Read requirements, not just reported runs: both classic protection and rulesets apply.
  const requiredContexts = new Set(checks.filter((check) => check.required).map((check) => check.name));
  for (const value of pages(values[6])) {
    const rule = object(value);
    if (rule.type === "required_status_checks") {
      for (const check of array(object(rule.parameters).required_status_checks)) requiredContexts.add(string(object(check).context));
    }
  }
  const threads = array(values[5]).flatMap((value) => {
    const page = object(value);
    if (page.errors !== undefined) throw new Error("GraphQL returned review-thread errors");
    const pull = object(object(object(page.data).repository).pullRequest);
    const protection = object(pull.baseRef).branchProtectionRule;
    if (protection !== null) {
      for (const context of array(object(protection).requiredStatusCheckContexts ?? [])) requiredContexts.add(string(context));
    }
    const connection = object(pull.reviewThreads);
    return array(connection.nodes).map((value): Thread => {
      const row = object(value);
      const roots = array(object(row.comments).nodes);
      if (roots.length !== 1) throw new Error("Review thread must include its root comment");
      const root = object(roots[0]);
      return { id: string(row.id), resolved: boolean(row.isResolved), rootCommentId: optionalNumber(root.databaseId), url: string(root.url) };
    });
  });
  const threadByComment = new Map(threads.flatMap((thread) => thread.rootCommentId === null || thread.rootCommentId === undefined ? [] : [[thread.rootCommentId, thread.id] as const]));
  const inlineComments = new Map(comments.filter((row) => row.commit !== null && row.databaseId !== null && row.databaseId !== undefined).map((row) => [row.databaseId!, row]));
  for (const row of inlineComments.values()) {
    let current: Comment | undefined = row;
    const visited = new Set<number>();
    while (current?.databaseId !== null && current?.databaseId !== undefined && !visited.has(current.databaseId)) {
      visited.add(current.databaseId);
      const thread = threadByComment.get(current.databaseId);
      if (thread !== undefined) { row.threadId = thread; break; }
      current = current.inReplyTo === null || current.inReplyTo === undefined ? undefined : inlineComments.get(current.inReplyTo);
    }
  }
  const after = facts(await json(run, viewArgs));
  if (before.head !== after.head || before.base !== after.base || before.baseName !== after.baseName || before.state !== after.state)
    throw new Error("PR changed while reading; retrying a fresh snapshot");
  return { schemaVersion: 1, facts: after, checks, comments, reviews, threads, expectedRequiredChecks: [...requiredContexts].sort() };
}

export function parseSnapshot(value: unknown): Snapshot {
  const row = object(value);
  if (row.schemaVersion !== 1) throw new Error("Unsupported state schema");
  const f = object(row.facts);
  const parsedFacts: Facts = {
    url: string(f.url), head: string(f.head), base: string(f.base), state: string(f.state),
    draft: boolean(f.draft), mergeable: string(f.mergeable), mergeState: string(f.mergeState), reviewDecision: string(f.reviewDecision),
    ...(f.baseName === undefined ? {} : { baseName: string(f.baseName) }),
  };
  return {
    schemaVersion: 1, facts: parsedFacts,
    ...(row.expectedReviewChecks === undefined ? {} : { expectedReviewChecks: array(row.expectedReviewChecks).map(string) }),
    ...(row.expectedRequiredChecks === undefined ? {} : { expectedRequiredChecks: array(row.expectedRequiredChecks).map(string) }),
    checks: array(row.checks).map((v) => { const r = object(v); return { name: string(r.name), state: string(r.state), bucket: string(r.bucket), link: string(r.link), workflow: string(r.workflow), ...(r.required === undefined ? {} : { required: boolean(r.required) }) }; }),
    comments: array(row.comments).map((v) => { const r = object(v); return { id: string(r.id), updatedAt: string(r.updatedAt), body: string(r.body), url: string(r.url), author: nullableString(r.author), commit: nullableString(r.commit), databaseId: optionalNumber(r.databaseId), path: optionalString(r.path), line: optionalNumber(r.line), startLine: optionalNumber(r.startLine), side: optionalString(r.side), inReplyTo: optionalNumber(r.inReplyTo), threadId: optionalString(r.threadId), originalLine: optionalNumber(r.originalLine), originalStartLine: optionalNumber(r.originalStartLine), originalCommit: optionalString(r.originalCommit) }; }),
    reviews: array(row.reviews).map((v) => { const r = object(v); return { id: string(r.id), submittedAt: nullableString(r.submittedAt), state: string(r.state), body: string(r.body), url: string(r.url), author: nullableString(r.author), commit: string(r.commit) }; }),
    threads: array(row.threads).map((v) => { const r = object(v); return { id: string(r.id), resolved: boolean(r.resolved), rootCommentId: optionalNumber(r.rootCommentId), url: optionalString(r.url) }; }),
  };
}
