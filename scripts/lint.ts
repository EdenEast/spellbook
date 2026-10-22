// Checks the mechanical repository rules from docs/agents/skills.md and
// docs/agents/external-sources.md. Run with `spellbook lint`; the content test
// runs it against this checkout.
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { citedLicenses, loadSourceRecords, parseLicenseIndex, type LicenseEntry, type SourceRecord } from "./sources.ts";

export async function lint(root: string): Promise<string[]> {
  const { records, problems } = await loadSourceRecords(root);
  problems.push(...await lintSkills(root));
  for (const record of records) problems.push(...await lintRecord(root, record));
  problems.push(...await lintLicenses(root, records));
  problems.push(...await lintLinks(root));
  return problems;
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function lintSkills(root: string): Promise<string[]> {
  const problems: string[] = [];
  const catalog = await readFile(join(root, "skills/README.md"), "utf8").catch(() => "");
  for (const entry of await readdir(join(root, "skills"), { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const where = `skills/${entry.name}`;
    if (!/^[a-z0-9-]+$/.test(entry.name)) problems.push(`${where}: directory name must use lowercase letters, digits, and hyphens`);
    let text: string;
    try {
      text = await readFile(join(root, where, "SKILL.md"), "utf8");
    } catch {
      problems.push(`${where}: missing SKILL.md`);
      continue;
    }
    if (!catalog.includes(`](${entry.name}/SKILL.md)`)) problems.push(`skills/README.md: catalog does not link ${entry.name}/SKILL.md`);
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1];
    if (frontmatter === undefined) {
      problems.push(`${where}/SKILL.md: missing frontmatter`);
      continue;
    }
    const name = /^name:\s*["']?([^"'\n]*?)["']?\s*$/m.exec(frontmatter)?.[1];
    if (name !== entry.name) problems.push(`${where}/SKILL.md: frontmatter name must be "${entry.name}"${name ? `, found "${name}"` : ""}`);
    // A value on the same line, or an indented block scalar on the following lines.
    if (!/^description:[ \t]*(?:[^\s>|].*|[>|][-+]?[ \t]*\n[ \t]+\S.*)$/m.test(frontmatter)) {
      problems.push(`${where}/SKILL.md: frontmatter needs a non-empty description`);
    }
  }
  return problems;
}

async function lintRecord(root: string, record: SourceRecord): Promise<string[]> {
  const problems: string[] = [];
  const where = `${record.directory}/SOURCE.toml`;
  for (const license of citedLicenses(record)) {
    if (dirname(license) !== "licenses") problems.push(`${where}: license must point into licenses/, found ${license}`);
    else if (!await exists(join(root, license))) problems.push(`${where}: license ${license} does not exist`);
  }
  const files = record.kind === "adapt" ? undefined : record.files;
  for (const local of Object.keys(files ?? {})) {
    if (!await exists(join(root, record.directory, local))) problems.push(`${where}: mapped file ${local} does not exist`);
  }
  if (record.kind === "collection") {
    const index = await readFile(join(root, record.directory, "README.md"), "utf8").catch(() => "");
    for (const entry of await readdir(join(root, record.directory))) {
      if (!entry.endsWith(".md") || entry === "README.md" || entry === "ADAPTATIONS.md") continue;
      if (!(entry in record.files)) problems.push(`${where}: ${entry} is not mapped in [files]`);
      if (!index.includes(`](${entry})`)) problems.push(`${record.directory}/README.md: index does not link ${entry}`);
    }
  }
  return problems;
}

async function lintLicenses(root: string, records: SourceRecord[]): Promise<string[]> {
  const problems: string[] = [];
  let entries: LicenseEntry[];
  try {
    entries = parseLicenseIndex(await readFile(join(root, "licenses/README.md"), "utf8"));
  } catch (error) {
    return [`licenses/README.md: ${(error as Error).message}`];
  }
  for (const file of await readdir(join(root, "licenses"))) {
    if (file !== "README.md" && !entries.some((entry) => entry.file === join("licenses", file))) {
      problems.push(`licenses/README.md: licenses/${file} is not listed`);
    }
  }
  for (const entry of entries) {
    if (!await exists(join(root, entry.file))) problems.push(`licenses/README.md: ${entry.file} does not exist`);
    for (const user of entry.usedBy) {
      const record = records.find((candidate) => candidate.directory === user);
      if (!record || !citedLicenses(record).includes(entry.file)) {
        problems.push(`licenses/README.md: ${user} is listed as using ${entry.file}, but its SOURCE.toml does not cite it`);
      }
    }
  }
  for (const record of records) {
    for (const license of citedLicenses(record)) {
      const entry = entries.find((candidate) => candidate.file === license);
      if (entry && !entry.usedBy.includes(record.directory)) {
        problems.push(`licenses/README.md: ${license} row must list ${record.directory} under "Used by"`);
      }
    }
  }
  // One copy per source lives in licenses/; resource directories hold none.
  for (const top of ["skills", "references"]) {
    for (const entry of await readdir(join(root, top), { withFileTypes: true, recursive: true })) {
      if (/^(licen[cs]es?|copying)(\.|$)/i.test(entry.name)) {
        problems.push(`${relative(root, join(entry.parentPath, entry.name))}: keep licenses in licenses/, not beside resources`);
      }
    }
  }
  return problems;
}

/** Relative Markdown links outside code must resolve to an existing path. */
async function lintLinks(root: string): Promise<string[]> {
  const problems: string[] = [];
  const ignored = new Set([".git", "node_modules", "result"]);
  const files = (await readdir(root, { withFileTypes: true, recursive: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((file) => !relative(root, file).split("/").some((part) => ignored.has(part)));
  for (const file of files.sort()) {
    const prose = (await readFile(file, "utf8"))
      .replace(/^(```|~~~)[\s\S]*?^\1/gm, "")
      .replace(/`[^`\n]*`/g, "");
    for (const [, target] of prose.matchAll(/\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#") || target.startsWith("~")) continue;
      // Placeholders in prompt templates, such as `[PR #123](url)`, are not paths.
      if (!/[./]/.test(target)) continue;
      const path = decodeURIComponent(target.split("#")[0]);
      if (!await exists(resolve(dirname(file), path))) problems.push(`${relative(root, file)}: broken link ${target}`);
    }
  }
  return problems;
}
