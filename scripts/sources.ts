// Parses provenance records (SOURCE.toml) and the license index into typed
// values. The contracts are documented in docs/agents/external-sources.md.
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

type Table = { [key: string]: Value };
type Value = string | number | boolean | Table | Table[];

/**
 * Parses the TOML subset used by provenance records: comments, tables, arrays of
 * tables, and bare or quoted keys with string, integer, or boolean values.
 * Anything else is rejected so a record cannot be silently misread.
 */
export function parseToml(text: string): Table {
  const root: Table = {};
  let current = root;
  const lines = text.split("\n");
  for (let index = 0; index < lines.length; index++) {
    const fail = (message: string): never => { throw new Error(`line ${index + 1}: ${message}`); };
    const line = stripComment(lines[index]).trim();
    if (!line) continue;
    const header = /^(\[\[?)\s*([^\]]+?)\s*(\]\]?)$/.exec(line);
    if (header) {
      const array = header[1] === "[[";
      if (array !== (header[3] === "]]")) fail("unbalanced table header");
      const path = header[2].split(".").map((key) => parseKey(key.trim()) ?? fail(`invalid key: ${key}`));
      let table = root;
      for (const [position, key] of path.entries()) {
        const last = position === path.length - 1;
        const existing = table[key];
        if (last && array) {
          if (existing !== undefined && !Array.isArray(existing)) fail(`${key} is not an array of tables`);
          const entry: Table = {};
          table[key] = [...(existing as Table[] | undefined ?? []), entry];
          table = entry;
        } else if (existing === undefined) {
          table = table[key] = {};
        } else if (Array.isArray(existing)) {
          table = existing[existing.length - 1];
        } else if (typeof existing === "object" && !last) {
          table = existing;
        } else fail(`duplicate table: ${header[2]}`);
      }
      current = table;
      continue;
    }
    const pair = /^("(?:[^"\\]|\\.)*"|[A-Za-z0-9_-]+)\s*=\s*(.+)$/.exec(line);
    if (!pair) return fail(`unsupported syntax: ${line}`);
    const key = parseKey(pair[1]) ?? fail(`invalid key: ${pair[1]}`);
    if (key in current) fail(`duplicate key: ${key}`);
    current[key] = parseValue(pair[2]) ?? fail(`unsupported value: ${pair[2]}`);
  }
  return root;
}

function stripComment(line: string): string {
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    if (line[index] === "\\" && quoted) index++;
    else if (line[index] === '"') quoted = !quoted;
    else if (line[index] === "#" && !quoted) return line.slice(0, index);
  }
  return line;
}

function parseKey(key: string): string | undefined {
  if (/^[A-Za-z0-9_-]+$/.test(key)) return key;
  return key.startsWith('"') ? parseString(key) : undefined;
}

function parseValue(value: string): Value | undefined {
  if (value === "true" || value === "false") return value === "true";
  if (/^[+-]?\d+$/.test(value)) return Number(value);
  return parseString(value);
}

function parseString(value: string): string | undefined {
  if (!/^"(?:[^"\\]|\\.)*"$/.test(value)) return undefined;
  try {
    return JSON.parse(value) as string;
  } catch {
    return undefined;
  }
}

/** Git source pinned to a full commit. Locators are repository-relative paths. */
export type AdoptRecord = {
  kind: "adopt";
  repository: string;
  path: string;
  baseRevision: string;
  license?: string;
  /** Local path (relative to the record) to upstream path; absent maps the whole tree. */
  files?: Record<string, string>;
};

export type GitSource = { id: string; url: string; path?: string; revision: string; license?: string };
export type PageSource = { id: string; url: string; reviewedAt: string; contentSha256: string; license?: string };
export type AdaptRecord = { kind: "adapt"; sources: (GitSource | PageSource)[] };

/** Older reference-collection shape; see "Existing reference collections". */
export type CollectionRecord = {
  kind: "collection";
  repository: string;
  path: string;
  commit: string;
  license?: string;
  files: Record<string, string>;
};

export type SourceRecord = (AdoptRecord | AdaptRecord | CollectionRecord) & {
  /** Repository-relative directory that holds SOURCE.toml. */
  directory: string;
};

const sha = /^[0-9a-f]{40}$/;
const digest = /^[0-9a-f]{64}$/;

/** Validates a parsed record; throws one message listing every problem. */
export function toSourceRecord(table: Table, directory: string): SourceRecord {
  const problems: string[] = [];
  const text = (from: Table, key: string, where: string, optional = false): string => {
    const value = from[key];
    if (typeof value === "string" && value) return value;
    if (value !== undefined || !optional) problems.push(`${where}${key} must be a non-empty string`);
    return "";
  };
  const revision = (from: Table, key: string, where: string): string => {
    const value = text(from, key, where);
    if (value && !sha.test(value)) problems.push(`${where}${key} must be a full 40-character commit SHA`);
    return value;
  };
  const mapping = (value: Value | undefined, where: string): Record<string, string> | undefined => {
    if (value === undefined) return undefined;
    if (typeof value !== "object" || Array.isArray(value)) {
      problems.push(`${where} must be a table`);
      return undefined;
    }
    for (const [key, path] of Object.entries(value)) {
      if (typeof path !== "string") problems.push(`${where}.${JSON.stringify(key)} must be a string`);
    }
    return value as Record<string, string>;
  };
  const asTable = (value: Value | undefined): Table => value && typeof value === "object" && !Array.isArray(value) ? value : {};

  let record: AdoptRecord | AdaptRecord | CollectionRecord;
  if (table.mode === "adopt") {
    if (table.schema_version !== 1) problems.push("schema_version must be 1");
    const upstream = asTable(table.upstream);
    if (!table.upstream) problems.push("adopt records need an [upstream] table");
    record = {
      kind: "adopt",
      repository: text(upstream, "repository", "upstream."),
      path: text(upstream, "path", "upstream."),
      baseRevision: revision(upstream, "base_revision", "upstream."),
      license: text(upstream, "license", "upstream.", true) || undefined,
      files: mapping(upstream.files, "upstream.files"),
    };
  } else if (table.mode === "adapt") {
    if (table.schema_version !== 1) problems.push("schema_version must be 1");
    const sources = Array.isArray(table.sources) ? table.sources : [];
    if (!sources.length) problems.push("adapt records need at least one [[sources]] entry");
    const ids = new Set<string>();
    record = {
      kind: "adapt",
      sources: sources.map((source, index) => {
        const where = `sources[${index}].`;
        const id = text(source, "id", where);
        if (ids.has(id)) problems.push(`${where}id duplicates ${id}`);
        ids.add(id);
        const url = text(source, "url", where);
        text(source, "incorporated", where);
        const license = text(source, "license", where, true) || undefined;
        if (source.reviewed_revision !== undefined) {
          return { id, url, path: text(source, "path", where, true) || undefined, revision: revision(source, "reviewed_revision", where), license };
        }
        const contentSha256 = text(source, "content_sha256", where);
        if (contentSha256 && !digest.test(contentSha256)) problems.push(`${where}content_sha256 must be a SHA-256 hex digest`);
        const reviewedAt = text(source, "reviewed_at", where);
        if (reviewedAt && !/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt)) problems.push(`${where}reviewed_at must be YYYY-MM-DD`);
        return { id, url, reviewedAt, contentSha256, license };
      }),
    };
  } else if (table.mode === undefined && table.commit !== undefined) {
    record = {
      kind: "collection",
      repository: text(table, "repository", ""),
      path: text(table, "path", ""),
      commit: revision(table, "commit", ""),
      license: text(table, "license", "", true) || undefined,
      files: mapping(table.files, "files") ?? {},
    };
  } else {
    problems.push('mode must be "adopt" or "adapt", or the record must be a reference collection with a commit');
    record = { kind: "adapt", sources: [] };
  }
  if (problems.length) throw new Error(problems.join("; "));
  return { ...record, directory };
}

/** Every license path a record cites, resolved to a repository-relative path. */
export function citedLicenses(record: SourceRecord): string[] {
  const paths = record.kind === "adapt" ? record.sources.map((source) => source.license) : [record.license];
  return paths.filter((path) => path !== undefined).map((path) => join(record.directory, path));
}

/** Finds and parses every SOURCE.toml under skills/ and references/. */
export async function loadSourceRecords(root: string): Promise<{ records: SourceRecord[]; problems: string[] }> {
  const records: SourceRecord[] = [];
  const problems: string[] = [];
  for (const top of ["skills", "references"]) {
    for (const file of await findFiles(join(root, top), "SOURCE.toml")) {
      const directory = relative(root, dirname(file));
      try {
        records.push(toSourceRecord(parseToml(await readFile(file, "utf8")), directory));
      } catch (error) {
        problems.push(`${directory}/SOURCE.toml: ${(error as Error).message}`);
      }
    }
  }
  return { records, problems };
}

export async function findFiles(directory: string, name: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true, recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return entries.filter((entry) => entry.isFile() && entry.name === name).map((entry) => join(entry.parentPath, entry.name)).sort();
}

/** One row of licenses/README.md. Paths are repository-relative. */
export type LicenseEntry = { file: string; repository: string; upstreamFile: string; checkedAt: string; usedBy: string[] };

const licenseRow = /^\| \[([^\]]+)\]\(([^)]+)\) \| \[[^\]]+\]\(([^)]+)\) `([^`]+)` \| `([0-9a-f]+)` \| (.+) \|$/;

export function parseLicenseIndex(text: string): LicenseEntry[] {
  return text.split("\n").filter((line) => line.startsWith("| [")).map((line) => {
    const match = licenseRow.exec(line);
    if (!match) throw new Error(`unrecognized license index row: ${line}`);
    return {
      file: join("licenses", match[2]),
      repository: match[3],
      upstreamFile: match[4],
      checkedAt: match[5],
      usedBy: [...match[6].matchAll(/`([^`]+)`/g)].map((used) => used[1]),
    };
  });
}

/** Treats `https://host/a/b` and `https://host/a/b.git` as one repository. */
export function sameRepository(left: string, right: string): boolean {
  const normalize = (url: string) => (url.includes("://") ? url : resolve(url)).replace(/\/$/, "").replace(/\.git$/, "");
  return normalize(left) === normalize(right);
}
