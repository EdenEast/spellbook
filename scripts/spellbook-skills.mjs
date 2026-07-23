#!/usr/bin/env node
import { mkdtempSync, rmSync, existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename, dirname, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as readline from 'node:readline';
import { Writable } from 'node:stream';

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DEFAULT_DIR = join(repoRoot, 'source', 'skills');
const DEFAULT_LOCK_FILE = join(repoRoot, 'skills-lock.json');
const DISCOVERY_DIRS = [
  '.', 'skills', 'skills/.curated', 'skills/.experimental', 'skills/.system',
  '.agents/skills', '.claude/skills', '.pi/skills', '.codex/skills'
];

function usage() {
  console.log(`Usage: spellbook-skills <command> [options]

Commands:
  add <source>        Install skills from a git repo, GitHub shorthand, URL, or local path
  list [source]       List installed skills, or available skills from a source
  remove <skills...>  Remove installed skills by name
  update [skills...]  Reinstall installed skills from their original sources

Options:
  -d, --dir <path>      Directory to store skills (default: ./source/skills)
  -s, --skill <name>    Skill to install from source; repeatable. Defaults to all discovered skills
  --all                 Install all discovered skills without prompting
  -l, --list            With add, list available source skills without installing
  -f, --force           Replace existing skill directories
  --dry-run             Print changes without writing
  --lock-file <path>    Lock file to update (default: ./skills-lock.json)
  -h, --help            Show help

Source examples:
  spellbook-skills add vercel-labs/agent-skills --skill web-design-guidelines
  spellbook-skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/frontend-design
  spellbook-skills add ./some/local/repo --dir ./source/skills

Dependency support:
  If SKILL.md frontmatter contains dependencies: [...], each dependency is resolved and installed too.
  Dependency entries may be strings (owner/repo, owner/repo@skill, ./path) or objects with source and skill/skills.`);
}

function fail(msg, code = 1) { console.error(msg); process.exit(code); }
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: opts.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', encoding: 'utf8', ...opts });
  if (res.status !== 0) fail(opts.capture ? (res.stderr || `${cmd} failed`) : `${cmd} failed`);
  return res.stdout?.trim() ?? '';
}

function parseArgs(argv) {
  const out = { _: [], skills: [], all: false, dir: process.env.SPELLBOOK_SKILLS_DIR || DEFAULT_DIR, lockFile: process.env.SPELLBOOK_SKILLS_LOCK || DEFAULT_LOCK_FILE, force: false, dryRun: false, listOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-d' || a === '--dir') out.dir = argv[++i] ?? fail(`${a} needs a value`, 2);
    else if (a === '--lock-file') out.lockFile = argv[++i] ?? fail(`${a} needs a value`, 2);
    else if (a === '-s' || a === '--skill') out.skills.push(argv[++i] ?? fail(`${a} needs a value`, 2));
    else if (a === '--all') out.all = true;
    else if (a === '-f' || a === '--force') out.force = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '-l' || a === '--list') out.listOnly = true;
    else if (a === '-h' || a === '--help') out.help = true;
    else out._.push(a);
  }
  out.dir = resolve(out.dir);
  out.lockFile = resolve(out.lockFile);
  return out;
}

function parseSource(raw) {
  if (!raw) fail('Missing source', 2);
  if (existsSync(raw) || raw.startsWith('.') || raw.startsWith('/')) return { raw, type: 'local', sourceType: 'local', lockSource: raw, path: resolve(raw) };

  let directPath;
  const tree = raw.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)$/);
  if (tree) {
    const [, owner, repo, ref, path] = tree;
    return { raw, type: 'git', sourceType: 'github', lockSource: `${owner}/${repo}`, url: `https://github.com/${owner}/${repo}.git`, ref, directPath: path };
  }

  const gh = raw.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:@(.*))?$/);
  if (gh) {
    const [, owner, repo, ref] = gh;
    return { raw, type: 'git', sourceType: 'github', lockSource: `${owner}/${repo}`, url: `https://github.com/${owner}/${repo}.git`, ref };
  }

  const url = raw.replace(/^https:\/\/github\.com\/([^/]+)\/([^/#]+)$/, 'https://github.com/$1/$2.git');
  const githubUrl = url.match(/^https:\/\/github\.com\/([^/]+)\/(.+)\.git$/);
  if (githubUrl) return { raw, type: 'git', sourceType: 'github', lockSource: `${githubUrl[1]}/${githubUrl[2]}`, url };
  if (/^(git@|https?:\/\/|ssh:\/\/)/.test(url)) return { raw, type: 'git', sourceType: 'git', lockSource: raw, url };
  fail(`Unsupported source: ${raw}`, 2);
}

function checkout(source) {
  if (source.type === 'local') return { root: source.path, cleanup: () => {} };
  const dir = mkdtempSync(join(tmpdir(), 'spellbook-skills-'));
  const args = ['clone', '--depth', '1'];
  if (source.ref) args.push('--branch', source.ref);
  args.push(source.url, dir);
  run('git', args);
  return { root: dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

function readFrontmatter(skillMd) {
  const text = readFileSync(skillMd, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  return parseYamlish(m[1]);
}

function parseYamlish(yaml) {
  const obj = {};
  const lines = yaml.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1]; let val = kv[2].trim();
    if (val === '') {
      const arr = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        const rawItem = lines[++i].replace(/^\s*-\s+/, '').trim();
        const firstPair = rawItem.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!firstPair) { arr.push(unquote(rawItem)); continue; }
        const item = { [firstPair[1]]: parseScalar(firstPair[2]) };
        while (i + 1 < lines.length && /^\s{2,}[A-Za-z0-9_-]+:\s*/.test(lines[i + 1])) {
          const pair = lines[++i].trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
          item[pair[1]] = parseScalar(pair[2]);
        }
        arr.push(item);
      }
      obj[key] = arr.length ? arr : '';
    } else obj[key] = parseScalar(val);
  }
  return obj;
}
function parseScalar(val) {
  val = val.trim();
  if (val.startsWith('[') && val.endsWith(']')) return val.slice(1, -1).split(',').map(s => unquote(s.trim())).filter(Boolean);
  return unquote(val);
}
function unquote(s) { return String(s).replace(/^['"]|['"]$/g, ''); }

function findSkills(root, directPath) {
  const found = new Map();
  const roots = directPath ? [directPath] : DISCOVERY_DIRS;
  for (const d of roots) {
    const base = join(root, d);
    if (!existsSync(base)) continue;
    if (existsSync(join(base, 'SKILL.md'))) addSkill(base);
    for (const child of safeDirs(base)) {
      if (existsSync(join(child, 'SKILL.md'))) addSkill(child);
      else for (const grand of safeDirs(child)) if (existsSync(join(grand, 'SKILL.md'))) addSkill(grand);
    }
  }
  if (found.size === 0 && !directPath) walk(root, 5, p => existsSync(join(p, 'SKILL.md')) && addSkill(p));
  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));

  function addSkill(dir) {
    const fm = readFrontmatter(join(dir, 'SKILL.md'));
    const name = fm.name || basename(dir);
    if (!found.has(name)) found.set(name, { name, dir, rel: relative(root, dir), description: fm.description || '', dependencies: fm.dependencies || fm.deps || [] });
  }
}
function safeDirs(path) { try { return readdirSync(path).map(n => join(path, n)).filter(p => statSync(p).isDirectory()); } catch { return []; } }
function walk(path, depth, cb) { if (depth < 0) return; cb(path); for (const d of safeDirs(path)) walk(d, depth - 1, cb); }

function loadLock(lockFile) {
  if (!existsSync(lockFile)) return { version: 1, skills: {} };
  return JSON.parse(readFileSync(lockFile, 'utf8'));
}
function saveLock(lockFile, lock, dryRun) {
  if (dryRun) return console.log(`DRY-RUN write ${relative(process.cwd(), lockFile)}`);
  mkdirSync(dirname(lockFile), { recursive: true });
  writeFileSync(lockFile, JSON.stringify(lock, null, 2) + '\n');
}

function gitRevision(root) {
  const res = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' });
  return res.status === 0 ? res.stdout.trim() : null;
}

function selectSkills(all, names) {
  if (!names.length || names.includes('*')) return all;
  const byName = new Map(all.map(s => [s.name, s]));
  return names.map(n => byName.get(n) || fail(`Skill not found: ${n}`));
}

async function chooseSkills(all, opts) {
  if (opts.all || opts.skills.includes('*')) return all;
  if (opts.skills.length) return selectSkills(all, opts.skills);
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    fail('No --skill values provided and stdin is not interactive. Pass --skill <name> or --all.', 2);
  }
  const selected = await interactiveMultiselect({
    message: 'Select skills to add',
    items: all.map(s => ({ value: s, label: s.name, detail: s.description })),
    maxVisible: 12,
    required: true,
  });
  if (selected === null) {
    console.log('Installation cancelled');
    process.exit(0);
  }
  return selected;
}

function visibleLength(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, '').length;
}

function truncate(text, width) {
  return visibleLength(text) > width ? `${text.slice(0, Math.max(0, width - 1))}…` : text;
}

function interactiveMultiselect({ message, items, maxVisible = 10, required = false }) {
  return new Promise(resolve => {
    const silentOutput = new Writable({ write(_chunk, _encoding, callback) { callback(); } });
    const rl = readline.createInterface({ input: process.stdin, output: silentOutput, terminal: false });
    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    let query = '';
    let cursor = 0;
    let lastHeight = 0;
    const selected = new Set();

    const green = s => `\x1b[32m${s}\x1b[0m`;
    const cyan = s => `\x1b[36m${s}\x1b[0m`;
    const dim = s => `\x1b[2m${s}\x1b[0m`;
    const bold = s => `\x1b[1m${s}\x1b[0m`;
    const underline = s => `\x1b[4m${s}\x1b[0m`;

    const filtered = () => {
      const q = query.toLowerCase();
      return q
        ? items.filter(item => item.label.toLowerCase().includes(q) || (item.detail || '').toLowerCase().includes(q))
        : items;
    };

    const render = (state = 'active') => {
      const rows = [];
      const matches = filtered();
      if (cursor >= matches.length) cursor = Math.max(0, matches.length - 1);
      const icon = state === 'cancel' ? '\x1b[31m■\x1b[0m' : state === 'submit' ? green('◇') : green('◆');
      rows.push(`${icon}  ${bold(message)} ${dim('(space to toggle, enter to confirm, esc to cancel)')}`);

      if (state === 'active') {
        rows.push(`${dim('│')}  ${dim('Search:')} ${query}\x1b[7m \x1b[0m`);
        rows.push(`${dim('│')}`);
        if (matches.length === 0) {
          rows.push(`${dim('│')}  ${dim('No matches')}`);
        } else {
          const start = Math.max(0, Math.min(cursor - Math.floor(maxVisible / 2), matches.length - maxVisible));
          const visible = matches.slice(start, start + maxVisible);
          for (let i = 0; i < visible.length; i++) {
            const actual = start + i;
            const item = visible[i];
            const isCursor = actual === cursor;
            const checked = selected.has(item.value) ? green('●') : dim('○');
            const pointer = isCursor ? cyan('❯') : ' ';
            const label = isCursor ? underline(item.label) : item.label;
            rows.push(`${dim('│')} ${pointer} ${checked} ${label}`);
          }
          const hiddenBefore = start;
          const hiddenAfter = Math.max(0, matches.length - start - visible.length);
          if (hiddenBefore || hiddenAfter) rows.push(`${dim('│')}  ${dim([hiddenBefore ? `↑ ${hiddenBefore} more` : '', hiddenAfter ? `↓ ${hiddenAfter} more` : ''].filter(Boolean).join('  '))}`);
        }

        const current = matches[cursor];
        rows.push(`${dim('│')}`);
        rows.push(`${dim('│')}  ${dim('Description')}`);
        rows.push(`${dim('│')}  ${dim(truncate((current?.detail || '').replace(/\s+/g, ' ').trim(), Math.max(20, (process.stdout.columns || 80) - 5)))}`);
        rows.push(`${dim('│')}`);
        const names = items.filter(item => selected.has(item.value)).map(item => item.label);
        rows.push(`${dim('│')}  ${green('Selected:')} ${names.length ? names.slice(0, 4).join(', ') + (names.length > 4 ? ` +${names.length - 4} more` : '') : dim('(none)')}`);
        rows.push(dim('└'));
      } else if (state === 'submit') {
        const names = items.filter(item => selected.has(item.value)).map(item => item.label);
        rows.push(`${dim('│')}  ${dim(names.join(', '))}`);
      } else {
        rows.push(`${dim('│')}  ${dim('Cancelled')}`);
      }

      const clear = lastHeight > 0 ? `\x1b[${lastHeight}A\x1b[J` : '';
      process.stdout.write(clear + rows.join('\n') + '\n');
      lastHeight = rows.length;
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      rl.close();
    };

    const submit = () => {
      if (required && selected.size === 0) return;
      render('submit');
      cleanup();
      resolve(items.filter(item => selected.has(item.value)).map(item => item.value));
    };

    const cancel = () => {
      render('cancel');
      cleanup();
      resolve(null);
    };

    const onKeypress = (str, key = {}) => {
      const matches = filtered();
      if (key.name === 'return' || str === '\r' || str === '\n') return submit();
      if (key.name === 'escape' || (key.ctrl && key.name === 'c')) return cancel();
      if (key.name === 'up') { cursor = Math.max(0, cursor - 1); return render(); }
      if (key.name === 'down') { cursor = Math.min(Math.max(0, matches.length - 1), cursor + 1); return render(); }
      if (key.name === 'space') {
        const item = matches[cursor];
        if (item) selected.has(item.value) ? selected.delete(item.value) : selected.add(item.value);
        return render();
      }
      if (key.name === 'backspace') { query = query.slice(0, -1); cursor = 0; return render(); }
      if (str && !key.ctrl && !key.meta && str.length === 1) { query += str; cursor = 0; return render(); }
    };

    process.stdin.on('keypress', onKeypress);
    render();
  });
}

function dependencySpecs(deps, currentSource) {
  if (!Array.isArray(deps)) return [];
  return deps.map(dep => {
    if (typeof dep !== 'string') return dep;
    const atSkill = dep.match(/^(.+)@([^/@]+)$/);
    if (atSkill && !atSkill[1].match(/\.git$/)) return { source: atSkill[1], skills: [atSkill[2]] };
    return { source: dep, skills: [] };
  }).map(d => {
    let depSource = d.source || currentSource;
    let skills = Array.isArray(d.skills) ? d.skills : (d.skill ? [d.skill] : []);
    if (typeof depSource === 'string' && depSource.startsWith('.')) {
      if (!skills.length) skills = [basename(depSource)];
      depSource = currentSource;
    }
    return { source: depSource, skills };
  });
}

async function add(rawSource, opts, seen = new Set()) {
  const source = parseSource(rawSource);
  const key = `${source.raw}|${opts.skills.join(',')}`;
  if (seen.has(key)) return;
  seen.add(key);
  const co = checkout(source);
  try {
    const revision = gitRevision(co.root);
    const all = findSkills(co.root, source.directPath);
    if (!all.length) fail(`No skills found in ${rawSource}`);
    if (opts.listOnly) {
      for (const s of all) console.log(`${s.name}${s.description ? ` - ${s.description}` : ''}`);
      return;
    }
    const chosen = await chooseSkills(all, opts);
    mkdirSync(opts.dir, { recursive: true });
    let lock = loadLock(opts.lockFile);
    for (const s of chosen) {
      for (const dep of dependencySpecs(s.dependencies, rawSource)) await add(dep.source, { ...opts, skills: dep.skills, all: dep.skills.length === 0, listOnly: false }, seen);
      lock = loadLock(opts.lockFile);
      const target = join(opts.dir, s.name);
      if (existsSync(target)) {
        if (!opts.force) fail(`Refusing to replace ${target}; pass --force`);
        console.log(`Replace ${relative(process.cwd(), target)}`);
        if (!opts.dryRun) rmSync(target, { recursive: true, force: true });
      }
      console.log(`Install ${s.name} -> ${relative(process.cwd(), target)}`);
      if (!opts.dryRun) cpSync(s.dir, target, { recursive: true, dereference: true });
      lock.skills[s.name] = {
        source: source.lockSource,
        sourceType: source.sourceType,
        skillPath: s.rel,
        destinationPath: relative(repoRoot, target),
        revision,
      };
      saveLock(opts.lockFile, lock, opts.dryRun);
    }
  } finally { co.cleanup(); }
}

async function list(opts, source) {
  if (source) return add(source, { ...opts, listOnly: true });
  const lock = loadLock(opts.lockFile);
  for (const [name, meta] of Object.entries(lock.skills).sort()) console.log(`${name}\t${meta.source}${meta.skillPath ? ` (${meta.skillPath})` : ''}`);
}

function remove(names, opts) {
  if (!names.length) fail('No skills specified', 2);
  const lock = loadLock(opts.lockFile);
  for (const name of names) {
    const destinationPath = lock.skills[name]?.destinationPath;
    const target = destinationPath ? join(repoRoot, destinationPath) : join(opts.dir, name);
    if (existsSync(target)) {
      console.log(`Remove ${relative(process.cwd(), target)}`);
      if (!opts.dryRun) rmSync(target, { recursive: true, force: true });
    } else {
      console.warn(`Missing: ${name}`);
    }
    delete lock.skills[name];
  }
  saveLock(opts.lockFile, lock, opts.dryRun);
}

async function update(names, opts) {
  const lock = loadLock(opts.lockFile);
  const targets = names.length ? names : Object.keys(lock.skills);
  for (const name of targets) {
    const meta = lock.skills[name] || fail(`Unknown installed skill: ${name}`);
    await add(meta.source, { ...opts, skills: [name], force: true });
  }
}

const [cmd, ...rest] = process.argv.slice(2);
if (!cmd || cmd === '-h' || cmd === '--help') { usage(); process.exit(cmd ? 0 : 2); }
const opts = parseArgs(rest);
if (opts.help) { usage(); process.exit(0); }
if (cmd === 'add') await add(opts._[0], opts);
else if (cmd === 'list' || cmd === 'ls') await list(opts, opts._[0]);
else if (cmd === 'remove' || cmd === 'rm') remove(opts._, opts);
else if (cmd === 'update') await update(opts._, opts);
else fail(`Unknown command: ${cmd}`, 2);
