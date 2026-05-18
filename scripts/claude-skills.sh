#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/claude-skills.sh install|uninstall [--dry-run] [--force] [--backup]

Installs spellbook skills from source/skills into Claude Code's user skills directory:
  ${CLAUDE_CODE_DIR:-$HOME/.claude}/skills

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

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="${SPELLBOOK_SKILLS_SOURCE:-$repo_root/source/skills}"

if [ ! -d "$source_dir" ]; then
  echo "Skills source directory does not exist: $source_dir" >&2
  exit 1
fi

claude_dir="${CLAUDE_CODE_DIR:-$HOME/.claude}"

target_dir="$claude_dir/skills"
manifest="$target_dir/.spellbook-manifest"

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

install_skill() {
  local skill_path="$1"
  local skill_name target backup_path ts
  skill_name="$(basename "$skill_path")"
  target="$target_dir/$skill_name"

  if [ -e "$target" ] || [ -L "$target" ]; then
    if link_points_to "$target" "$skill_path"; then
      echo "Already installed: $skill_name"
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

  echo "Installing: $skill_name"
  do_cmd ln -s "$skill_path" "$target"
}

uninstall_skill() {
  local skill_path="$1"
  local skill_name target
  skill_name="$(basename "$skill_path")"
  target="$target_dir/$skill_name"

  if link_points_to "$target" "$skill_path"; then
    echo "Uninstalling: $skill_name"
    do_cmd rm "$target"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "Skipping non-spellbook path: $target"
  fi
}

mapfile -t skills < <(find "$source_dir" -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/SKILL.md' ';' -print | sort)

if [ "${#skills[@]}" -eq 0 ]; then
  echo "No skills with SKILL.md found in $source_dir" >&2
  exit 1
fi

case "$action" in
  install)
    do_cmd mkdir -p "$target_dir"
    for skill in "${skills[@]}"; do
      install_skill "$skill"
    done
    if [ "$dry_run" -eq 0 ]; then
      {
        echo "# spellbook Claude Code skills manifest"
        echo "source=$source_dir"
        echo "target=$target_dir"
        printf 'skills='
        printf '%s ' "${skills[@]##*/}"
        printf '\n'
      } > "$manifest"
    else
      echo "DRY-RUN: write manifest $manifest"
    fi
    ;;
  uninstall)
    for skill in "${skills[@]}"; do
      uninstall_skill "$skill"
    done
    if [ -f "$manifest" ]; then
      echo "Removing manifest: $manifest"
      do_cmd rm "$manifest"
    fi
    ;;
esac
