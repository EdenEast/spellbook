import { lstat, mkdir, readdir, readlink, symlink, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

export type Target = "codex" | "claude" | "pi";
type Action = "install" | "uninstall" | "status";
type State = "installed" | "missing" | "conflict" | "stale";
type Link = { source: string; destination: string; state: State };
type Collection = { source: string; destination: string };

export type Options = {
  root: string;
  home: string;
  targets: Target[];
  dryRun?: boolean;
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
  if (targets.includes("pi")) {
    result.push({ source: join(root, "pi/extensions"), destination: join(home, ".pi/agent/extensions") });
  }
  return result;
}

function installedName(name: string): string {
  return `spellbook-${name}`;
}

async function discover(collection: Collection): Promise<string[]> {
  const names: string[] = [];
  for (const entry of await entries(collection.source)) {
    if (entry.name.startsWith(".")) continue;
    const path = join(collection.source, entry.name);
    if (
      (entry.isFile() && /\.(ts|js)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) ||
      (entry.isDirectory() && ((await stat(join(path, "index.ts")))?.isFile() || (await stat(join(path, "index.js")))?.isFile()))
    ) {
      names.push(entry.name);
    }
  }
  return names.sort();
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
  for (const collection of collections(options)) {
    const names = await discover(collection);
    const destinationStat = await stat(collection.destination);
    if (destinationStat && !destinationStat.isDirectory()) {
      throw new Error(`Expected a real resource directory: ${collection.destination}. Resolve the existing file or directory symlink first.`);
    }
    const wanted = new Set<string>();
    for (const name of names) {
      const source = resolve(collection.source, name);
      const destination = join(collection.destination, installedName(name));
      wanted.add(destination);
      const state = (await linkTarget(destination)) === source ? "installed"
        : (await stat(destination)) ? "conflict" : "missing";
      links.push({ source, destination, state });
    }
    // Inspect link text, so deleted source files can still be uninstalled.
    for (const entry of await entries(collection.destination)) {
      const destination = join(collection.destination, entry.name);
      if (wanted.has(destination)) continue;
      const source = await linkTarget(destination);
      if (source && dirname(source) === resolve(collection.source) && entry.name === installedName(basename(source))) {
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
  if (!links.length) log("No instructions, references, or extensions to manage.");
  for (const link of links) {
    const remove = (action === "uninstall" && link.state === "installed") || (action !== "status" && link.state === "stale");
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
      console.log("Usage: spellbook install|uninstall|status [--target codex|claude|pi]... [--dry-run]");
    } else {
      if (action !== "install" && action !== "uninstall" && action !== "status") throw new Error("Expected install, uninstall, or status. Use --help for usage.");
      const targets: Target[] = [];
      let dryRun = false;
      for (let index = 0; index < flags.length; index++) {
        const arg = flags[index];
        if (arg === "--dry-run") dryRun = true;
        else if (arg === "--target") {
          const target = flags[++index];
          if (target !== "codex" && target !== "claude" && target !== "pi") throw new Error(`Unknown target: ${target}`);
          targets.push(target);
        } else throw new Error(`Unknown argument: ${arg}`);
      }
      const root = resolve(import.meta.dirname, "..");
      const options: Options = { root, home: homedir(), targets: targets.length ? targets : ["codex", "claude", "pi"], dryRun };
      await run(action, options);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (import.meta.main) await cli();
