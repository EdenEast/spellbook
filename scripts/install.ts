import { lstat, mkdir, readdir, readlink, symlink, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { selectSkills } from "./select-skills.ts";

export type Target = "codex" | "claude" | "pi";
type Action = "install" | "uninstall" | "status";
type State = "installed" | "missing" | "conflict" | "stale";
type Link = { source: string; destination: string; state: State };
type Collection = { source: string; destination: string; kind: "skills" | "extensions" };

export type Options = {
  root: string;
  home: string;
  targets: Target[];
  dryRun?: boolean;
  skills?: readonly string[];
  log?: (message: string) => void;
};

async function stat(path: string) {
  try {
    return await lstat(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

async function entries(path: string) {
  try {
    return await readdir(path, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function collections({ root, home, targets }: Options): Collection[] {
  const result: Collection[] = [];
  // Codex and Pi both discover this directory; install the shared skills once.
  if (targets.includes("codex") || targets.includes("pi")) {
    result.push({ source: join(root, "skills"), destination: join(home, ".agents/skills"), kind: "skills" });
  }
  if (targets.includes("claude")) {
    result.push({ source: join(root, "skills"), destination: join(home, ".claude/skills"), kind: "skills" });
  }
  if (targets.includes("pi")) {
    result.push({ source: join(root, "pi/extensions"), destination: join(home, ".pi/agent/extensions"), kind: "extensions" });
  }
  return result;
}

function installedName(collection: Collection, name: string): string {
  return collection.kind === "extensions" ? `spellbook-${name}` : name;
}

async function discover(collection: Collection): Promise<string[]> {
  const names: string[] = [];
  for (const entry of await entries(collection.source)) {
    if (entry.name.startsWith(".")) continue;
    const path = join(collection.source, entry.name);
    if (collection.kind === "skills") {
      if (entry.isDirectory() && (await stat(join(path, "SKILL.md")))?.isFile()) names.push(entry.name);
    } else if (
      (entry.isFile() && /\.(ts|js)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) ||
      (entry.isDirectory() && ((await stat(join(path, "index.ts")))?.isFile() || (await stat(join(path, "index.js")))?.isFile()))
    ) {
      names.push(entry.name);
    }
  }
  return names.sort();
}

export function availableSkills(root: string): Promise<string[]> {
  return discover({ source: join(root, "skills"), destination: "", kind: "skills" });
}

export async function installedSkills(options: Options): Promise<string[]> {
  const links = await plan({ ...options, skills: undefined });
  return [...new Set(links.filter((link) => link.state === "installed" && dirname(link.source) === resolve(options.root, "skills"))
    .map((link) => basename(link.source)))].sort();
}

async function linkTarget(path: string): Promise<string | undefined> {
  if (!(await stat(path))?.isSymbolicLink()) return undefined;
  return resolve(dirname(path), await readlink(path));
}

async function instructionLinks({ root, home, targets }: Options): Promise<Link[]> {
  const source = resolve(root, "instructions/AGENTS.md");
  const available = (await stat(source))?.isFile();
  const destinations: Record<Target, string> = {
    codex: ".codex/AGENTS.md",
    claude: ".claude/CLAUDE.md",
    pi: ".pi/agent/AGENTS.md",
  };
  const links: Link[] = [];
  for (const target of new Set(targets)) {
    const destination = join(home, destinations[target]);
    const owned = (await linkTarget(destination)) === source;
    if (available || owned) {
      const state = owned ? (available ? "installed" : "stale")
        : (await stat(destination)) ? "conflict" : "missing";
      links.push({ source, destination, state });
    }
  }
  return links;
}

async function referenceLinks({ root, home, targets }: Options): Promise<Link[]> {
  if (!targets.length) return [];
  const source = resolve(root, "references");
  const destination = join(home, ".agents/references/spellbook");
  const available = (await stat(source))?.isDirectory();
  const owned = (await linkTarget(destination)) === source;
  if (!available && !owned) return [];
  const parent = await stat(dirname(destination));
  if (parent && !parent.isDirectory()) {
    throw new Error(`Expected a real resource directory: ${dirname(destination)}. Resolve the existing file or directory symlink first.`);
  }
  const state = owned ? (available ? "installed" : "stale")
    : (await stat(destination)) ? "conflict" : "missing";
  return [{ source, destination, state }];
}

export async function plan(options: Options): Promise<Link[]> {
  const links = [...await instructionLinks(options), ...await referenceLinks(options)];
  const selected = options.skills === undefined ? undefined : new Set(options.skills);
  for (const collection of collections(options)) {
    const names = await discover(collection);
    const destinationStat = await stat(collection.destination);
    if (destinationStat && !destinationStat.isDirectory()) {
      throw new Error(`Expected a real resource directory: ${collection.destination}. Resolve the existing file or directory symlink first.`);
    }
    const wanted = new Set<string>();
    for (const name of names) {
      const source = resolve(collection.source, name);
      const destination = join(collection.destination, installedName(collection, name));
      wanted.add(destination);
      const state = (await linkTarget(destination)) === source ? "installed"
        : (await stat(destination)) ? "conflict" : "missing";
      if (collection.kind === "skills" && selected !== undefined && !selected.has(name) && state !== "installed") continue;
      links.push({ source, destination, state });
    }
    // Inspect link text, so deleted source files can still be uninstalled.
    for (const entry of await entries(collection.destination)) {
      const destination = join(collection.destination, entry.name);
      if (wanted.has(destination)) continue;
      const source = await linkTarget(destination);
      if (source && dirname(source) === resolve(collection.source) && entry.name === installedName(collection, basename(source))) {
        links.push({ source, destination, state: "stale" });
      }
    }
  }
  return links;
}

export async function run(action: Action, options: Options): Promise<void> {
  const links = await plan(options);
  const log = options.log ?? console.log;
  const conflicts = links.filter((link) => link.state === "conflict");
  // Preflight every target before changing any links.
  if (action === "install" && conflicts.length) {
    throw new Error(`Existing paths conflict with installation:\n${conflicts.map((link) => link.destination).join("\n")}`);
  }
  if (!links.length) log("No instructions, references, skills, or extensions to manage.");
  for (const link of links) {
    const deselected = action === "install" && options.skills !== undefined
      && dirname(link.source) === resolve(options.root, "skills") && !options.skills.includes(basename(link.source));
    const remove = ((action === "uninstall" || deselected) && link.state === "installed") || (action !== "status" && link.state === "stale");
    const add = action === "install" && link.state === "missing";
    log(`${options.dryRun ? "DRY RUN " : ""}${remove ? "remove" : add ? "link" : link.state}: ${link.destination} -> ${link.source}`);
    if (options.dryRun) continue;
    if (remove) {
      if (await linkTarget(link.destination) !== link.source) throw new Error(`Link changed during operation: ${link.destination}`);
      await unlink(link.destination);
    }
    if (add) {
      await mkdir(dirname(link.destination), { recursive: true });
      await symlink(link.source, link.destination, (await stat(link.source))?.isDirectory() ? "dir" : "file");
    }
  }
}

export async function cli(args = process.argv.slice(2)): Promise<void> {
  try {
    const [action, ...flags] = args;
    if (action === "--help" || action === "-h" || flags.includes("--help") || flags.includes("-h")) {
      console.log("Usage: spellbook install|uninstall|status [--target codex|claude|pi]... [--dry-run]\n       spellbook install --select [--target codex|claude|pi]... [--dry-run]\n\n--select starts with installed skills checked. Unchecking removes this checkout's skill links from the selected targets.");
    } else {
      if (action !== "install" && action !== "uninstall" && action !== "status") throw new Error("Expected install, uninstall, or status. Use --help for usage.");
      const targets: Target[] = [];
      let dryRun = false;
      let select = false;
      for (let index = 0; index < flags.length; index++) {
        const arg = flags[index];
        if (arg === "--dry-run") dryRun = true;
        else if (arg === "--select") {
          if (action !== "install") throw new Error("--select is only supported by install.");
          select = true;
        } else if (arg === "--target") {
          const target = flags[++index];
          if (target !== "codex" && target !== "claude" && target !== "pi") throw new Error(`Unknown target: ${target}`);
          targets.push(target);
        } else throw new Error(`Unknown argument: ${arg}`);
      }
      const root = resolve(import.meta.dirname, "..");
      const options: Options = { root, home: homedir(), targets: targets.length ? targets : ["codex", "claude", "pi"], dryRun };
      const skills = select ? await selectSkills(await availableSkills(root), await installedSkills(options)) : undefined;
      if (select && skills === undefined) {
        console.log("Installation cancelled.");
        return;
      }
      await run(action, { ...options, skills });
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (import.meta.main) await cli();
