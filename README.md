# Spellbook

Personal global instructions, references, and skills for Codex, Claude Code,
and Pi, plus Pi extensions.

The shared skill collection contains six personal skills restored from the
previous layout: `babysit-pr`, `commit`, `file-pr`, `html-communication`,
`postplan-read`, and `summarization`. It also includes 16 adapted external
skills: `diagnosing-bugs`, `writing-for-agents`, `unslop`, `retro`,
`blast-radius`, `grill-me`, `grilling`, `grill-with-docs`, `domain-modeling`,
`how`, `why`, `teach`, `bro`, `technical-writing`, `create-verification-skill`,
and `maintain-verification-skill`.
The adapted `automate-me` skill is repository-only and excluded from global
installation. Supporting files and imported license notices are included.
Pi extensions remain empty; other previous content is in Git history.

See the [skill catalog](skills/README.md) for invocation groups, descriptions,
and use cases. The [reference catalog](references/README.md) contains all 24
adapted pstack principles used across workflows.

## Layout

```text
instructions/AGENTS.md   Shared global instructions restored from source/AGENTS.md
references/              Shared documents loaded on demand
  README.md              Reference catalog
  principles/            Index, decision rules, provenance, and license
skills/                  Globally installed skills, regardless of origin
  <name>/
    SKILL.md
    SOURCE.toml          Only for skills imported from elsewhere
    references/          Optional supporting files
.agents/skills/          Canonical repository-only skills for Codex and Pi
.claude/skills/          Links to .agents/skills/ for Claude Code
pi/
  extensions/            Pi extension files or directories with index.ts/index.js
scripts/                 Installation tooling and tests
nix/                     Home Manager integration
package.json             Pi extension package and Node tooling
flake.nix                Development environment and checks
```

The paths above describe the structure. There is one editable copy of each
skill, versioned in this repo.

## Development

Use Node.js 24.2 or newer, or enter `nix develop` for Node, Git, and Just:

```sh
npm ci
npm run check
npm test
```

`just check` runs both checks. `nix flake check` also runs the installer tests.
Node runs the TypeScript scripts directly; installation has no npm runtime
dependencies and needs no build step.

## Install from a checkout

Run on the machine and user account where the harness processes execute:

```sh
just install --dry-run
just install
just status
just uninstall
```

Without Just, use `node scripts/install.ts install` (or `status` / `uninstall`).
The npm shortcuts are `npm run skills:install`, `npm run status`, and
`npm run skills:uninstall`. `npm install` only installs development dependencies.

All three targets are selected by default. Select a subset with repeatable
`--target codex`, `--target claude`, or `--target pi` flags.

| Resource | Destination |
| --- | --- |
| Codex global instructions | `~/.codex/AGENTS.md` |
| Claude Code global instructions | `~/.claude/CLAUDE.md` |
| Pi global instructions | `~/.pi/agent/AGENTS.md` |
| Shared references for any selected target | `~/.agents/references/spellbook/` |
| Codex and Pi skills | `~/.agents/skills/<name>` |
| Claude Code skills | `~/.claude/skills/<name>` |
| Pi extensions | `~/.pi/agent/extensions/spellbook-<name>` |

The editable global instruction file lives at `instructions/AGENTS.md`; the root
`AGENTS.md` contains instructions for maintaining this repository. All selected
targets link to the same global file, with Claude using its `CLAUDE.md` filename.
See the [Codex instruction documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
and [Claude instruction documentation](https://code.claude.com/docs/en/memory).

Codex and Pi share skill discovery: installing or uninstalling their shared
links affects both, even when only one target is selected. Extensions are only
managed with the Pi target. See the [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills),
[Claude skill documentation](https://code.claude.com/docs/en/skills), and
[Pi skill documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md).

Repository-only skills live in `.agents/skills/<name>/`, with
`.claude/skills/<name>` linking to that directory. Both global installers read
only `skills/`, so repository-only skills stay local.

References use one shared location for all three harnesses. Installing or
uninstalling with any selected target manages that shared link and therefore
affects every harness using it. The installer requires the containing
`~/.agents/references/` to be a real directory and preserves conflicting files
and foreign links.

The installer links individual resources to this checkout. It refuses existing
conflicting paths before writing any links. Reinstalling removes stale links to
resources deleted from this checkout. Uninstall only removes links pointing
into this checkout, including broken links; unrelated resources are preserved.
Keep the checkout at a stable path and uninstall before moving it.

When no resources exist, the installer creates no harness directories. It
manages instruction links but does not change settings, credentials, or install
harness executables. It uses the current user's standard home paths; use the Home Manager options below
for custom resource locations. Existing sessions may need a reload or restart.

## Shared references

Keep documents used across workflows in `references/`. The global instructions
direct agents to read the [principles index](references/principles/README.md)
before design, implementation, debugging, or substantive review, then read the
full documents whose triggers match the task. You can steer a task by naming a
principle, such as "prove it works" or "subtract before you add". Agents explain
the choice a principle changed when that explanation helps assess the work.

The library uses ordinary Markdown. Each principle contains its rule, triggers,
application guidance, boundaries, check, and related references. It does not
add skill invocation entries. A skill that needs shared guidance can point to
`~/.agents/references/spellbook/principles/<name>.md` at the relevant step;
supporting material unique to that skill stays in its own directory.

The shared destination is fixed so the same instruction file works for all
harnesses, including when their configuration directories are customized.
When using the checkout directly, the index is `references/principles/README.md`.
If installation is missing, agents continue with available instructions and
report the gap when relevant.

Adapted documents retain a collection-level `SOURCE.toml`, mapping each local
document to its upstream file, and the applicable license. Follow the
[external reference workflow](EXTERNAL_SKILLS.md#external-references) when
checking or updating them. The collection adapts all 24 principles at
`ccb5507cec1546dc88135c1139c811e6c59115ba`, with scope boundaries and verification
guidance suited to Spellbook.

## External skills

Copy the complete skill directory, including its references, scripts, and
required license notices, into `skills/<name>/`. Add `SOURCE.toml` beside
`SKILL.md`:

```toml
repository = "https://github.com/cursor/plugins"
path = "pstack/skills/architect"
commit = "60c641e4fad674784b30abcf9f8915dea39df38d"
```

Use a full upstream commit SHA. `path` is relative to the repository root.
`commit` records the upstream version last integrated into your skill. Skills
you write yourself do not need a source record. Edit imported files directly and
commit your changes normally.

Follow [Updating external skills](EXTERNAL_SKILLS.md) to check upstream changes,
merge them with local adaptations, validate the result, and advance the source
pin. This is a manual workflow; automated diff/check/update commands are not yet
implemented. Keep upstream snapshots and generated patches outside this repo.

## Pi extensions

Put a standalone `.ts` or `.js` extension in `pi/extensions/`, or use
`pi/extensions/<name>/index.ts` (or `index.js`) for a multi-file extension. The
installer ignores dotfiles and TypeScript declaration files. Add runtime npm
dependencies only when needed; keep Pi host modules in `peerDependencies` as
specified in the [Pi package documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md).

Pi can create and test extensions in this writable checkout. Try one without
installing it globally with `pi --extension ./pi/extensions/<name>.ts`. Commit the
extension and dependency lock changes when you want to keep it. On NixOS, keep
experiments in a writable checkout, outside the Nix store.

The root is also a native Pi package for extensions. As an alternative to the
extension links, use `pi install /absolute/path/to/spellbook`. Use one extension
loading method at a time. The package declares no skills, prompts, or themes;
the shared skill installation above remains their source of skills.

External prepackaged extensions can be tried with Pi's native `pi install`
command using an exact npm version or Git commit. Those declarations live in
Pi's settings and are not yet managed by Spellbook. Reproducible adoption of
external packages and Nix packaging of extension dependencies are future work.
No external Pi packages are installed by this scaffold.

## Home Manager

Add Spellbook as a flake input and import its module:

```nix
{
  imports = [ inputs.spellbook.homeManagerModules.default ];

  programs.spellbook = {
    enable = true;
    targets = [ "codex" "claude" "pi" ];
    # Defaults, relative to your home directory:
    # agentSkillsDir = ".agents/skills";
    # codexDir = ".codex";
    # claudeDir = ".claude";
    # piDir = ".pi/agent";
  };
}
```

`homeManagerModules.spellbook` is an alias of `default`. The module installs
individual resource links from the pinned flake source, including the shared
reference directory whenever at least one target is selected. It does not install
harness executables or manage their settings. Use Home Manager or the checkout
installer to own a destination, not both. The module currently exposes source
files; extensions requiring npm dependencies need packaging before deployment
through Nix.

For T3 remote development, configure the remote execution account. Ensure the
T3 backend can find the required executables; a local development shell does
not configure the remote service environment.

## Moving from the previous layout

The `source/` layout, bundled content, shell/PowerShell installers, module-shim
script, and `programs.pi-spellbook` module have been removed. Switch Nix
configuration to `programs.spellbook` and the new module export.

Before installing, inspect old links created by Spellbook. These may include
`~/.codex/skills`, `~/.codex/AGENTS.md`, `~/.pi/agent/AGENTS.md`, the Pi
`*/spellbook` resource links, and individual Claude skill links. Remove or
replace a link only after verifying that it points into the old `source/` tree.
The new installer does not claim legacy links. Legacy instruction links at the
managed destinations must be resolved before installation. No changes to your
existing home configuration are made by this repository rewrite.
