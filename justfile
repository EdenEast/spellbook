set dotenv-load := true
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

repo := justfile_directory()
pi := env_var_or_default("PI_BIN", "pi")
installer := repo / "scripts" / "install.sh"
windows_installer := repo / "scripts" / "install.ps1"
shim_node_modules := repo / "scripts" / "shim-node-modules.sh"

_default:
    @just --list

# Link this repository into every detected agent harness configuration.
[unix]
install harness='':
    @if [ -n '{{harness}}' ]; then {{installer}} install --target '{{harness}}'; else {{installer}} install; fi

[windows]
install harness='':
    @powershell -NoProfile -ExecutionPolicy Bypass -File "{{windows_installer}}" install{{ if harness != "" { " --target " + harness } else { "" } }}

# Remove spellbook links from every agent harness configuration.
[unix]
uninstall harness='':
    @if [ -n '{{harness}}' ]; then {{installer}} uninstall --target '{{harness}}'; else {{installer}} uninstall; fi

[windows]
uninstall harness='':
    @powershell -NoProfile -ExecutionPolicy Bypass -File "{{windows_installer}}" uninstall{{ if harness != "" { " --target " + harness } else { "" } }}

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
