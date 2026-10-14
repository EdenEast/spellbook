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

The checkout installer links individual instructions and extensions.
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
