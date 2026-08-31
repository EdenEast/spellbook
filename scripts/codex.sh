#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/codex.sh install|uninstall [--dry-run] [--force] [--backup]

Installs spellbook resources for Codex:
  ${CODEX_HOME:-$HOME/.codex}/AGENTS.md -> source/AGENTS.md
  ${CODEX_SKILLS_DIR:-${CODEX_HOME:-$HOME/.codex}/skills} -> source/skills

Options:
  --dry-run  Print actions without changing files.
  --force    Replace conflicting files/directories/symlinks.
  --backup   Move conflicting paths aside with a .bak.<timestamp> suffix.
USAGE
}

if [ $# -lt 1 ]; then
  usage >&2
  exit 2
fi

action="$1"
shift

dry_run=0
force=0
backup=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) dry_run=1 ;;
    --force) force=1 ;;
    --backup) backup=1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

case "$action" in
  install|uninstall) ;;
  *) echo "Unknown action: $action" >&2; usage >&2; exit 2 ;;
esac

if [ "$force" -eq 1 ] && [ "$backup" -eq 1 ]; then
  echo "Use only one of --force or --backup." >&2
  exit 2
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
source_root="${SPELLBOOK_CODEX_SOURCE:-$repo_root}"
source_root="$(cd "$source_root" && pwd -P)"
agents_file="$source_root/source/AGENTS.md"
skills_source="${SPELLBOOK_SKILLS_SOURCE:-$source_root/source/skills}"

codex_home="${CODEX_HOME:-$HOME/.codex}"
agents_target="$codex_home/AGENTS.md"
skills_target_dir="${CODEX_SKILLS_DIR:-$codex_home/skills}"

if [ ! -f "$agents_file" ]; then
  echo "AGENTS.md source does not exist: $agents_file" >&2
  exit 1
fi

if [ ! -d "$skills_source" ]; then
  echo "Skills source directory does not exist: $skills_source" >&2
  exit 1
fi

do_cmd() {
  if [ "$dry_run" -eq 1 ]; then
    printf 'DRY-RUN: '
    printf '%q ' "$@"
    printf '\n'
  else
    "$@"
  fi
}

link_points_to() {
  local link="$1"
  local dest="$2"
  [ -L "$link" ] && [ "$(readlink "$link")" = "$dest" ]
}

handle_conflict() {
  local target="$1"
  local backup_path ts

  if [ "$backup" -eq 1 ]; then
    ts="$(date +%Y%m%d%H%M%S)"
    backup_path="$target.bak.$ts"
    echo "Backing up conflict: $target -> $backup_path"
    do_cmd mv "$target" "$backup_path"
  elif [ "$force" -eq 1 ]; then
    echo "Removing conflict: $target"
    do_cmd rm -rf "$target"
  else
    echo "Conflict: $target already exists. Re-run with --backup or --force." >&2
    return 1
  fi
}

install_link() {
  local source="$1"
  local target="$2"
  local label="$3"

  if [ -e "$target" ] || [ -L "$target" ]; then
    if link_points_to "$target" "$source"; then
      echo "Already installed: $label"
      return
    fi

    handle_conflict "$target"
  fi

  echo "Installing: $label"
  do_cmd ln -s "$source" "$target"
}

uninstall_link() {
  local source="$1"
  local target="$2"
  local label="$3"

  if link_points_to "$target" "$source"; then
    echo "Uninstalling: $label"
    do_cmd rm "$target"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "Skipping non-spellbook path: $target"
  fi
}

case "$action" in
  install)
    do_cmd mkdir -p "$codex_home"

    install_link "$agents_file" "$agents_target" "global AGENTS.md: $agents_target -> $agents_file"
    install_link "$skills_source" "$skills_target_dir" "skills directory: $skills_target_dir -> $skills_source"
    ;;
  uninstall)
    uninstall_link "$agents_file" "$agents_target" "global AGENTS.md: $agents_target"
    uninstall_link "$skills_source" "$skills_target_dir" "skills directory: $skills_target_dir"
    ;;
esac
