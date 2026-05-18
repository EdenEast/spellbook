# Design

## Goals

- Provide additive pi resources: extensions, skills, prompt templates, and themes.
- Support reproducible Home Manager installs.
- Support non-Nix local symlink installs for rapid iteration.
- Avoid taking ownership of existing user pi configuration.

## Non-goals for v1

- Managing `settings.json`, `keybindings.json`, `models.json`, `AGENTS.md`, `SYSTEM.md`, or `APPEND_SYSTEM.md`.
- Automatically installing npm dependencies.
- Profiles or resource groups.

## Install model

Resources are linked below a `spellbook` namespace inside pi's normal additive directories:

```text
$PI_DIR/extensions/spellbook
$PI_DIR/skills/spellbook
$PI_DIR/prompts/spellbook
$PI_DIR/themes/spellbook
```

This avoids replacing top-level pi directories and lets users keep their own resources alongside spellbook.

## Home Manager module

The module exposes `programs.pi-spellbook` and installs pi by default through a configurable `package` option. If `pkgs.pi-coding-agent` is not available, users must override `package` or disable package installation.

## Local installer

The installer uses `$PI_CODING_AGENT_DIR` when set, otherwise `~/.pi/agent`. It is intentionally conservative:

- creates parent directories
- creates symlinks
- refuses conflicts by default
- supports `--backup`, `--force`, and `--dry-run`
- writes a small manifest for human inspection

Uninstall only removes symlinks that still point at the current repo checkout.
