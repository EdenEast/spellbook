# Installation paths and behavior

The checkout installer uses the current user's standard home paths.
[Home Manager](home-manager.md) exposes options for custom resource locations.

## Destinations

The selected targets determine which links the installer manages:

| Resource | Destination | Selected target |
| --- | --- | --- |
| Codex global instructions | `~/.codex/AGENTS.md` | Codex |
| Claude Code global instructions | `~/.claude/CLAUDE.md` | Claude Code |
| Pi global instructions | `~/.pi/agent/AGENTS.md` | Pi |
| Shared skills | `~/.agents/skills/<name>/` | Codex or Pi |
| Claude Code skills | `~/.claude/skills/<name>/` | Claude Code |
| Shared references | `~/.agents/references/spellbook/` | Any target |
| Pi extensions | `~/.pi/agent/extensions/spellbook-<name>` | Pi |

All instruction links point to `instructions/AGENTS.md`. The root `AGENTS.md`
contains repository maintenance instructions.

The reference destination is shared by all three agents and remains fixed even
when Home Manager customizes their configuration paths.

## Command options

`spellbook` accepts `install`, `uninstall`, and `status`. The repeatable
`--target codex|claude|pi` option selects agents. Without it, all three are
selected. `--dry-run` reports planned operations without changing links.

## Link handling

The checkout installer links individual instructions, skill directories, and extensions.
Skills are visible, immediate child directories of `skills/` containing a regular
`SKILL.md`; supporting files travel with the directory. Other entries are ignored.
Both adapted and adopted skills install identically. Installed skill names and
contents preserve upstream identity.
Codex and Pi share one destination, so selecting both creates one link per skill.
A skill installed for either is visible to both harnesses on that account.
It links the shared reference directory as one resource.

The installer checks all selected destinations for conflicts before creating
links. Resource containers, including `~/.agents/references/`, must be real
directories rather than files or directory symlinks. Conflicting files and
foreign links are preserved.

Reinstalling removes stale links to resources deleted from this checkout.
Uninstall removes only managed links pointing into this checkout, including
broken links. Neither action claims legacy links from the old `source/` layout.

When no resources exist, the installer creates no agent directories. It does
not change settings or credentials, and it does not install agent executables.

## Agent documentation

These upstream pages describe instruction files and skill discovery:

- [Codex instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
- [Claude Code instructions](https://code.claude.com/docs/en/memory).

## T3 Code

Install for the harness and execution account used by the T3 backend: select
`--target codex` for Codex or `--target claude` for Claude Code. T3 Code is not a
separate skill target. For remote execution, install on the remote machine as
that account; a local install does not configure it. If the backend overrides
its harness configuration directory, use the matching Home Manager directory
option for instructions and Claude skills; the shared skill location stays fixed.
Restart or reload the harness session after installation and confirm
that a skill appears in its discovered skills before relying on it.

Skill discovery follows the upstream [Codex skill locations](https://learn.chatgpt.com/docs/build-skills),
[Claude Code skill locations](https://code.claude.com/docs/en/skills), and
[Pi skill discovery](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md).
