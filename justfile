set dotenv-load := true

repo := justfile_directory()
pi := env_var_or_default("PI_BIN", "pi")
installer := repo / "scripts" / "install.sh"
shim_node_modules := repo / "scripts" / "shim-node-modules.sh"

_default:
    @just --list

# Link this repository into every detected agent harness configuration.
install harness='':
    @if [ -n '{{harness}}' ]; then {{installer}} install --target '{{harness}}'; else {{installer}} install; fi

# Remove spellbook links from every agent harness configuration.
uninstall harness='':
    @if [ -n '{{harness}}' ]; then {{installer}} uninstall --target '{{harness}}'; else {{installer}} uninstall; fi

# Alias for uninstall.
remove: uninstall

# List pi packages.
list:
    {{pi}} list

# Run pi's package config UI.
config:
    {{pi}} config

# Create node_modules shims to Pi's bundled modules (useful on NixOS).
shim-node-modules:
    @PI_BIN="{{pi}}" {{shim_node_modules}}
