# Migrate from the previous layout

The previous `source/` layout, bundled content, shell and PowerShell installers,
module-shim script, and `programs.pi-spellbook` module have been removed.

## Update Nix configuration

Switch to `programs.spellbook` and import
`inputs.spellbook.homeManagerModules.default`. See
[Install with Home Manager](home-manager.md) for the configuration.

## Resolve legacy links

Before installing, inspect links created by the old Spellbook installer.
Possible legacy destinations include these paths:

- `~/.codex/skills`.
- `~/.codex/AGENTS.md`.
- `~/.pi/agent/AGENTS.md`.
- Pi resource links ending in `/spellbook`.
- Individual Claude Code skill links.

Remove or replace a link only after verifying that it points into the old
`source/` tree. The new installer does not claim legacy links. Resolve legacy
instruction links at managed destinations before installation.

After resolving the links, follow [Install from a checkout](install.md) or
[Install with Home Manager](home-manager.md). The repository rewrite itself
does not modify your home configuration.
