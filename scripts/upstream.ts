// Reports what changed upstream since each provenance record's pinned revision,
// using one cached bare clone per repository. It reads the cache and checkout
// only; integrating changes stays agent-assisted (docs/agents/skills.md).
import { execFile } from "node:child_process";
import { mkdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { loadSourceRecords, parseLicenseIndex, sameRepository, type SourceRecord } from "./sources.ts";

const run = promisify(execFile);

export type UpstreamOptions = {
  root: string;
  cacheDir: string;
  /** Repository-relative record directories; empty selects every record. */
  paths?: string[];
  /** Target revision in the upstream repository; defaults to its default branch. */
  to?: string;
  /** Skip fetching repositories that are already cached. */
  offline?: boolean;
};

export type FileChange = {
  status: "added" | "modified" | "deleted" | "renamed";
  upstream: string;
  /** Local path relative to the record directory when the upstream file is mapped. */
  local?: string;
  /** For adopted files: the local copy differs from the pinned upstream file. */
  localEdits?: boolean;
};

export type Report = {
  directory: string;
  kind: SourceRecord["kind"];
  source?: string;
  repository?: string;
  from?: string;
  to?: string;
  changes: FileChange[];
  /** Changed upstream files under the path that the record does not map. */
  unmappedChanges: number;
  license?: "unchanged" | "changed upstream" | "local copy differs";
  note?: string;
};

type Pin = { repository: string; path: string; revision: string; files?: Record<string, string>; license?: string; source?: string };

function pins(record: SourceRecord): (Pin | { note: string; source: string })[] {
  if (record.kind === "adopt") return [{ repository: record.repository, path: record.path, revision: record.baseRevision, files: record.files, license: record.license }];
  if (record.kind === "collection") return [{ repository: record.repository, path: record.path, revision: record.commit, files: record.files, license: record.license }];
  return record.sources.map((source) => "revision" in source
    ? { repository: source.url, path: source.path ?? ".", revision: source.revision, license: source.license, source: source.id }
    : { source: source.id, note: `unversioned page reviewed ${source.reviewedAt}; compare its content digest manually` });
}

async function git(repository: string, ...args: string[]): Promise<string> {
  const { stdout } = await run("git", ["-C", repository, ...args], { maxBuffer: 64 * 1024 * 1024, encoding: "utf8" });
  return stdout;
}

async function show(repository: string, revision: string, path: string): Promise<string | undefined> {
  try {
    return await git(repository, "show", `${revision}:${path}`);
  } catch {
    return undefined;
  }
}

export function defaultCacheDir(): string {
  return join(process.env.XDG_CACHE_HOME || join(homedir(), ".cache"), "spellbook/upstream");
}

export async function upstreamStatus(options: UpstreamOptions): Promise<Report[]> {
  const { records, problems } = await loadSourceRecords(options.root);
  if (problems.length) throw new Error(problems.join("\n"));
  const wanted = (options.paths ?? []).map((path) => relative(options.root, resolve(options.root, path)));
  const unknown = wanted.filter((path) => !records.some((record) => record.directory === path));
  if (unknown.length) throw new Error(`No SOURCE.toml in: ${unknown.join(", ")}`);
  const selected = records.filter((record) => !wanted.length || wanted.includes(record.directory));
  const licenses = parseLicenseIndex(await readFile(join(options.root, "licenses/README.md"), "utf8"));
  const clones = new Map<string, Promise<string>>();
  const clone = (url: string) => {
    const key = [...clones.keys()].find((known) => sameRepository(known, url)) ?? url;
    if (!clones.has(key)) clones.set(key, ensureClone(options, url));
    return clones.get(key)!;
  };

  const reports: Report[] = [];
  for (const record of selected) {
    for (const pin of pins(record)) {
      const base = { directory: record.directory, kind: record.kind, source: pin.source, changes: [], unmappedChanges: 0 };
      if ("note" in pin) {
        reports.push({ ...base, note: pin.note });
        continue;
      }
      const repository = await clone(pin.repository);
      const to = (await git(repository, "rev-parse", "--verify", `${options.to ?? "HEAD"}^{commit}`)).trim();
      const report: Report = { ...base, repository: pin.repository, from: pin.revision, to };
      reports.push(report);
      try {
        await git(repository, "cat-file", "-e", `${pin.revision}^{commit}`);
      } catch {
        report.note = "pinned revision is not in the upstream repository";
        continue;
      }
      await compare(options.root, record, pin, repository, report);
      if (pin.license) {
        const entry = licenses.find((candidate) => candidate.file === join(record.directory, pin.license!));
        if (entry) {
          const [old, current] = await Promise.all([show(repository, pin.revision, entry.upstreamFile), show(repository, to, entry.upstreamFile)]);
          const local = await readFile(join(options.root, entry.file), "utf8");
          report.license = old !== current ? "changed upstream" : current !== local ? "local copy differs" : "unchanged";
        }
      }
    }
  }
  return reports;
}

async function compare(root: string, record: SourceRecord, pin: Pin, repository: string, report: Report) {
  let files = pin.files;
  // Without explicit mappings, an adopted tree maps by relative path.
  if (!files && record.kind === "adopt") {
    const tree = (await git(repository, "ls-tree", "-r", "--name-only", pin.revision, "--", pin.path)).split("\n").filter(Boolean);
    files = Object.fromEntries(tree.map((path) => [relative(pin.path, path), path]));
  }
  const local = new Map(Object.entries(files ?? {}).map(([localPath, upstream]) => [upstream, localPath]));
  const scope = [...new Set([pin.path, ...local.keys()])];
  const diff = await git(repository, "diff", "--name-status", "-M", pin.revision, report.to!, "--", ...scope);
  const statuses = { A: "added", M: "modified", D: "deleted", R: "renamed" } as const;
  for (const line of diff.split("\n").filter(Boolean)) {
    const [code, from, renamed] = line.split("\t");
    const status = statuses[code[0] as keyof typeof statuses] ?? "modified";
    const localPath = local.get(from);
    // Adapted sources are reviewed as a whole; other records manage mapped files
    // but must surface upstream additions, which may be new dependencies.
    if (record.kind !== "adapt" && !localPath && status !== "added") {
      report.unmappedChanges++;
      continue;
    }
    const change: FileChange = { status, upstream: renamed ? `${from} -> ${renamed}` : from, local: localPath };
    if (record.kind === "adopt" && localPath) {
      const current = await readFile(join(root, record.directory, localPath), "utf8").catch(() => undefined);
      change.localEdits = current !== await show(repository, pin.revision, from);
    }
    report.changes.push(change);
  }
}

async function ensureClone(options: UpstreamOptions, url: string): Promise<string> {
  const directory = join(options.cacheDir, url.replace(/^[a-z]+:\/\//, "").replace(/\.git$/, "").replace(/[^A-Za-z0-9._-]+/g, "-"));
  const cached = await stat(directory).then(() => true, () => false);
  if (!cached) {
    await mkdir(options.cacheDir, { recursive: true });
    await run("git", ["clone", "--bare", "--quiet", url, directory]);
  } else if (!options.offline) {
    await git(directory, "fetch", "--quiet", "--prune", "origin", "+refs/heads/*:refs/heads/*");
  }
  return directory;
}

export function formatReports(reports: Report[]): string {
  return reports.map((report) => {
    const title = `${report.directory}${report.source ? ` [${report.source}]` : ""} (${report.kind})`;
    if (!report.from) return `${title}: ${report.note}`;
    const range = `${report.repository} ${report.from.slice(0, 12)}..${report.to!.slice(0, 12)}`;
    if (report.note) return `${title} ${range}: ${report.note}`;
    const lines = report.changes.map((change) => {
      const local = change.local ? ` (local ${change.local}${change.localEdits ? ", has local edits" : ""})` : "";
      return `  ${change.status} ${change.upstream}${change.local || report.kind === "adapt" ? local : " (unmapped)"}`;
    });
    if (report.unmappedChanges) lines.push(`  ${report.unmappedChanges} other unmapped upstream file(s) changed under ${report.kind === "collection" ? "the collection path" : "the skill path"}`);
    if (report.license && report.license !== "unchanged") lines.push(`  license ${report.license}`);
    return `${title} ${range}: ${lines.length ? `\n${lines.join("\n")}` : "up to date"}`;
  }).join("\n");
}

const usage = "Usage: spellbook upstream [record-directory]... [--to <revision>] [--offline]";

export async function cli(args: string[]): Promise<void> {
  const paths: string[] = [];
  let to: string | undefined;
  let offline = false;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") return console.log(usage);
    if (arg === "--offline") offline = true;
    else if (arg === "--to") to = args[++index] ?? (() => { throw new Error("--to needs a revision"); })();
    else if (arg.startsWith("-")) throw new Error(`Unknown argument: ${arg}\n${usage}`);
    else paths.push(arg);
  }
  const root = resolve(import.meta.dirname, "..");
  console.log(formatReports(await upstreamStatus({ root, cacheDir: defaultCacheDir(), paths, to, offline })));
}
