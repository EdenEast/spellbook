import { lstat, mkdir, mkdtemp, readFile, readdir, readlink, rename, rm, symlink, unlink, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { isDeepStrictEqual, parseEnv } from "node:util";

export type Target = "codex" | "claude" | "pi";
type Action = "install" | "uninstall" | "status";
type State = "installed" | "missing" | "conflict" | "stale";
type Link = { source: string; destination: string; state: State };
type Collection = { source: string; destination: string; kind: "skill" | "extension" };

export type Options = {
  root: string;
  home: string;
  targets: Target[];
  t3Home?: string;
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
  const skillDestinations: Record<Target, string> = {
    codex: ".agents/skills",
    claude: ".claude/skills",
    pi: ".agents/skills",
  };
  const result: Collection[] = [...new Set(targets.map((target) => skillDestinations[target]))].map((destination) => ({
    source: join(root, "skills"), destination: join(home, destination), kind: "skill",
  }));
  if (targets.includes("pi")) {
    result.push({ source: join(root, "pi/extensions"), destination: join(home, ".pi/agent/extensions"), kind: "extension" });
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
    if (collection.kind === "skill") {
      if (entry.isDirectory() && (await stat(join(path, "SKILL.md")))?.isFile()) names.push(entry.name);
      continue;
    }
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
    const nameAtDestination = (name: string) => collection.kind === "skill" ? name : installedName(name);
    const wanted = new Set<string>();
    for (const name of names) {
      const source = resolve(collection.source, name);
      const destination = join(collection.destination, nameAtDestination(name));
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
      if (source && dirname(source) === resolve(collection.source) && entry.name === nameAtDestination(basename(source))) {
        links.push({ source, destination, state: "stale" });
      }
    }
  }
  return links;
}

async function piSettings(options: Options) {
  if (!options.targets.includes("pi")) return undefined;
  const path = join(options.home, ".pi/agent/settings.json");
  const existing = await stat(path);
  if (existing && !existing.isFile()) throw new Error(`Expected a regular Pi settings file: ${path}`);
  const original = existing ? await readFile(path, "utf8") : undefined;
  let settings: Record<string, unknown>;
  try {
    const parsed: unknown = original === undefined ? {} : JSON.parse(original);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("expected a JSON object");
    settings = parsed as Record<string, unknown>;
    for (const key of ["defaultTools", "extensions"]) {
      const value = settings[key];
      if (value !== undefined && (!Array.isArray(value) || !value.every((entry) => typeof entry === "string"))) {
        throw new Error(`${key} must be an array of strings`);
      }
    }
  } catch (error) {
    throw new Error(`Invalid Pi settings at ${path}: ${error instanceof Error ? error.message : error}`);
  }
  const tools = settings.defaultTools as string[] | undefined;
  const extensions = settings.extensions as string[] | undefined;
  const enabled = tools?.some((tool) => tool === "codemode" || tool === "+codemode") && !tools.includes("-codemode");
  if (!enabled) {
    const remaining = (tools ?? []).filter((tool) => !["codemode", "+codemode", "-codemode"].includes(tool));
    const replacement = tools?.some((tool) => !tool.startsWith("+") && !tool.startsWith("-"));
    // An explicit empty selection must not acquire Pi's other default tools.
    settings.defaultTools = [...remaining, replacement || tools?.length === 0 ? "codemode" : "+codemode"];
  }
  const disabledExtension = extensions?.includes("-builtin:codemode");
  if (extensions && disabledExtension) settings.extensions = extensions.filter((entry) => entry !== "-builtin:codemode");
  return { path, content: `${JSON.stringify(settings, null, 2)}\n`, changed: !enabled || disabledExtension };
}

async function claudeSettings(options: Options) {
  if (!options.targets.includes("claude")) return undefined;
  const path = join(options.home, ".claude/settings.json");
  const existing = await stat(path);
  if (existing && !existing.isFile()) throw new Error(`Expected a regular Claude settings file: ${path}`);
  const original = existing ? await readFile(path, "utf8") : undefined;
  let settings: Record<string, unknown>;
  let env: Record<string, unknown>;
  try {
    const parsed: unknown = original === undefined ? {} : JSON.parse(original);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("expected a JSON object");
    settings = parsed as Record<string, unknown>;
    const value = settings.env;
    if (value !== undefined && (!value || typeof value !== "object" || Array.isArray(value))) {
      throw new Error("env must be a JSON object");
    }
    env = (value ?? {}) as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Invalid Claude settings at ${path}: ${error instanceof Error ? error.message : error}`);
  }
  const changed = env.CLAUDE_CODE_EXPERIMENTAL_CODE_MODE !== "1";
  settings.env = { ...env, CLAUDE_CODE_EXPERIMENTAL_CODE_MODE: "1" };
  return { path, content: `${JSON.stringify(settings, null, 2)}\n`, changed };
}

async function t3ServiceEnvironment({ home, t3Home, targets }: Options) {
  if (!targets.length) return undefined;
  const directory = t3Home ?? join(home, ".t3");
  const existingDirectory = await stat(directory);
  if (existingDirectory && !existingDirectory.isDirectory()) {
    throw new Error(`Expected a real T3 Code data directory: ${directory}`);
  }
  const path = join(directory, "service.env");
  const existing = await stat(path);
  if (existing && !existing.isFile()) throw new Error(`Expected a regular T3 Code service environment file: ${path}`);
  const original = existing ? await readFile(path, "utf8") : "";
  const env = parseEnv(original);
  if (env.T3CODE_TELEMETRY_ENABLED === "false") return { path, content: original, changed: false };

  // T3's launcher uses Node's dotenv parser: the last assignment wins.
  // Append rather than risk editing an assignment inside a multiline value.
  const newline = original.includes("\r\n") ? "\r\n" : "\n";
  const separator = original && !original.endsWith("\n") ? newline : "";
  const content = `${original}${separator}T3CODE_TELEMETRY_ENABLED=false${newline}`;
  if (!isDeepStrictEqual(parseEnv(content), { ...env, T3CODE_TELEMETRY_ENABLED: "false" })) {
    throw new Error(`Cannot safely set T3 Code telemetry in ${path}. Check the dotenv syntax.`);
  }
  return { path, content, changed: true };
}

export async function run(action: Action, options: Options): Promise<void> {
  const links = await plan(options);
  const log = options.log ?? console.log;
  const conflicts = links.filter((link) => link.state === "conflict");
  // Preflight every target before changing any links.
  if (action === "install" && conflicts.length) {
    throw new Error(`Existing paths conflict with installation:\n${conflicts.map((link) => link.destination).join("\n")}`);
  }
  // Validate settings before creating any links, just like resource conflicts.
  const settings = action !== "uninstall"
    ? [await piSettings(options), await claudeSettings(options)].filter((entry) => entry !== undefined)
    : [];
  for (const entry of settings) {
    log(`${options.dryRun ? "DRY RUN " : ""}${entry.changed ? action === "install" ? "enable codemode" : "codemode not configured" : "codemode configured"}: ${entry.path}`);
  }
  const t3 = action !== "uninstall" ? await t3ServiceEnvironment(options) : undefined;
  if (t3) {
    const message = t3.changed
      ? action === "install" ? "disable T3 Code service telemetry" : "T3 Code service telemetry opt-out not configured"
      : "T3 Code service telemetry opt-out configured";
    log(`${options.dryRun ? "DRY RUN " : ""}${message}: ${t3.path}`);
    settings.push(t3);
  }
  if (!links.length && !settings.length) log("No instructions, skills, references, or extensions to manage.");
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
  for (const entry of settings) {
    if (action !== "install" || !entry.changed || options.dryRun) continue;
    await mkdir(dirname(entry.path), { recursive: true });
    const temporary = await mkdtemp(join(dirname(entry.path), ".spellbook-settings-"));
    try {
      const path = join(temporary, basename(entry.path));
      await writeFile(path, entry.content, { mode: 0o600 });
      await rename(path, entry.path);
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  }
}

export async function cli(args = process.argv.slice(2)): Promise<void> {
  try {
    const [action, ...flags] = args;
    if (action === "--help" || action === "-h" || flags.includes("--help") || flags.includes("-h")) {
      console.log("Usage: spellbook install|uninstall|status [--target codex|claude|pi]... [--dry-run]\n       spellbook lint\n       spellbook upstream [record-directory]... [--to <revision>] [--offline]");
    } else {
      if (action !== "install" && action !== "uninstall" && action !== "status") throw new Error("Expected install, uninstall, status, lint, or upstream. Use --help for usage.");
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
      const home = homedir();
      const configuredT3Home = process.env.T3CODE_HOME?.trim();
      const t3Home = configuredT3Home === "~" ? home
        : configuredT3Home?.match(/^~[\\/]/) ? resolve(home, configuredT3Home.slice(2))
        : configuredT3Home ? resolve(configuredT3Home) : undefined;
      const options: Options = { root, home, t3Home, targets: targets.length ? targets : ["codex", "claude", "pi"], dryRun };
      await run(action, options);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (import.meta.main) await cli();
