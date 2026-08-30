#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/pi-agents.sh install|uninstall [--dry-run] [--force] [--backup]

Installs spellbook's global AGENTS.md for pi:
  ${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/AGENTS.md -> source/AGENTS.md

Options:
  --dry-run  Print actions without changing files.
  --force    Replace a conflicting target.
  --backup   Move a conflicting target aside with a .bak.<timestamp> suffix.
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
source_root="${SPELLBOOK_PI_SOURCE:-$repo_root}"
source_root="$(cd "$source_root" && pwd -P)"
agents_file="$source_root/source/AGENTS.md"
pi_dir="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
target="$pi_dir/AGENTS.md"

if [ ! -f "$agents_file" ]; then
  echo "AGENTS.md source does not exist: $agents_file" >&2
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

install_agents() {
  local backup_path ts

  do_cmd mkdir -p "$pi_dir"

  if [ -e "$target" ] || [ -L "$target" ]; then
    if link_points_to "$target" "$agents_file"; then
      echo "Already installed: $target -> $agents_file"
      return
    fi

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
  fi

  echo "Installing global AGENTS.md: $target -> $agents_file"
  do_cmd ln -s "$agents_file" "$target"
}

uninstall_agents() {
  if link_points_to "$target" "$agents_file"; then
    echo "Uninstalling global AGENTS.md: $target"
    do_cmd rm "$target"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "Skipping non-spellbook path: $target"
  fi
}

case "$action" in
  install) install_agents ;;
  uninstall) uninstall_agents ;;
esac
