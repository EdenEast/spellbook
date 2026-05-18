set dotenv-load := true

repo := justfile_directory()
pi := env_var_or_default("PI_BIN", "pi")
source := env_var_or_default("SPELLBOOK_PI_SOURCE", repo)

_default:
    @just --list

# Install this repository as a pi local-path package.
install:
    {{pi}} install {{source}}

# Remove this repository as a pi local-path package.
uninstall:
    {{pi}} remove {{source}}

# Alias for uninstall.
remove: uninstall

# List pi packages.
list:
    {{pi}} list

# Install this repository as a project-local pi package in the current directory.
install-local:
    {{pi}} install {{source}} -l

# Remove this repository as a project-local pi package in the current directory.
uninstall-local:
    {{pi}} remove {{source}} -l

# Run pi's package config UI.
config:
    {{pi}} config

# Create node_modules shims to Pi's bundled modules (useful on NixOS).
shim-node-modules:
    @set -eu; \
    PI_BIN=$(readlink -f "$(command -v {{pi}})"); \
    PI_ROOT=$(dirname "$(dirname "$PI_BIN")")/lib/node_modules/pi-monorepo; \
    if [ ! -d "$PI_ROOT" ]; then \
      echo "Could not find Pi module root: $PI_ROOT" >&2; \
      exit 1; \
    fi; \
    for BASE in "{{repo}}/node_modules" "$HOME/.pi/agent/node_modules"; do \
      mkdir -p "$BASE/@mariozechner" "$BASE/@earendil-works"; \
      ln -sfn "$PI_ROOT" "$BASE/@mariozechner/pi-coding-agent"; \
      ln -sfn "$PI_ROOT/node_modules/@mariozechner/pi-ai" "$BASE/@mariozechner/pi-ai"; \
      ln -sfn "$PI_ROOT/node_modules/@mariozechner/pi-tui" "$BASE/@mariozechner/pi-tui"; \
      ln -sfn "$PI_ROOT/node_modules/@mariozechner/pi-agent-core" "$BASE/@mariozechner/pi-agent-core"; \
      ln -sfn "$PI_ROOT/node_modules/typebox" "$BASE/typebox"; \
      ln -sfn "$PI_ROOT" "$BASE/@earendil-works/pi-coding-agent"; \
      ln -sfn "$PI_ROOT/node_modules/@mariozechner/pi-ai" "$BASE/@earendil-works/pi-ai"; \
      ln -sfn "$PI_ROOT/node_modules/@mariozechner/pi-tui" "$BASE/@earendil-works/pi-tui"; \
      ln -sfn "$PI_ROOT/node_modules/@mariozechner/pi-agent-core" "$BASE/@earendil-works/pi-agent-core"; \
      echo "Created Pi module shims in $BASE"; \
    done
