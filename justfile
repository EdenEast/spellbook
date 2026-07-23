set dotenv-load := true

repo := justfile_directory()
pi := env_var_or_default("PI_BIN", "pi")
source := env_var_or_default("SPELLBOOK_PI_SOURCE", repo)
claude_skills := repo / "scripts" / "claude-skills.sh"
spellbook_skills := repo / "scripts" / "spellbook-skills.mjs"
shim_node_modules := repo / "scripts" / "shim-node-modules.sh"

_default:
    @just --list

# Install this repository as a pi local-path package.
install:
    npm install
    {{pi}} install {{source}}

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

# Manage external skill repositories under source/skills.
skills *args:
    {{spellbook_skills}} {{args}}

# Create node_modules shims to Pi's bundled modules (useful on NixOS).
shim-node-modules:
    @PI_BIN="{{pi}}" {{shim_node_modules}}
