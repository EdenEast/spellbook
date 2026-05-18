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
