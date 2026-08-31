set dotenv-load := true

repo := justfile_directory()
pi := env_var_or_default("PI_BIN", "pi")
source := env_var_or_default("SPELLBOOK_PI_SOURCE", repo)
pi_agents := repo / "scripts" / "pi-agents.sh"
claude_skills := repo / "scripts" / "claude-skills.sh"
codex := repo / "scripts" / "codex.sh"
shim_node_modules := repo / "scripts" / "shim-node-modules.sh"

_default:
    @just --list

# Install this repository as a pi local-path package and global AGENTS.md.
install:
    npm install
    {{pi}} install {{source}}
    {{pi_agents}} install --backup

# Remove this repository as a pi local-path package.
uninstall:
    {{pi}} remove {{source}}

# Alias for uninstall.
remove: uninstall

# List pi packages.
list:
    {{pi}} list

# Run pi's package config UI.
config:
    {{pi}} config

# Install source/skills into Claude Code's user skills directory.
install-claude:
    {{claude_skills}} install

# Remove source/skills from Claude Code's user skills directory.
uninstall-claude:
    {{claude_skills}} uninstall

# Install source/AGENTS.md and source/skills into Codex's user locations.
install-codex:
    {{codex}} install

# Remove spellbook resources from Codex's user locations.
uninstall-codex:
    {{codex}} uninstall

# Create node_modules shims to Pi's bundled modules (useful on NixOS).
shim-node-modules:
    @PI_BIN="{{pi}}" {{shim_node_modules}}
