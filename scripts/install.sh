#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/install.sh install|uninstall|status [--target pi|codex|claude]...
                                              [--dry-run] [--force|--backup]

Without --target, install detects available Pi, Codex, and Claude Code CLIs.
All resources are linked into each harness's own configuration directory.

Options:
  --target NAME  Select pi, codex, or claude. May be repeated.
  --dry-run      Print actions without changing files.
  --force        Replace conflicting files, directories, or symlinks.
  --backup       Move conflicting paths aside with a .bak.<timestamp> suffix.
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
declare -a requested_targets=()

while [ $# -gt 0 ]; do
  case "$1" in
    --target)
      [ $# -ge 2 ] || { echo "Missing value for --target." >&2; exit 2; }
      case "$2" in pi|codex|claude) requested_targets+=("$2") ;; *) echo "Unknown target: $2" >&2; exit 2 ;; esac
      shift
      ;;
    --dry-run) dry_run=1 ;;
    --force) force=1 ;;
    --backup) backup=1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

case "$action" in install|uninstall|status) ;; *) echo "Unknown action: $action" >&2; usage >&2; exit 2 ;; esac
[ "$force" -eq 0 ] || [ "$backup" -eq 0 ] || { echo "Use only one of --force or --backup." >&2; exit 2; }
[ "$action" = "install" ] || { [ "$force" -eq 0 ] && [ "$backup" -eq 0 ] || { echo "--force and --backup only apply to install." >&2; exit 2; }; }

canonical_path() {
  local path="$1"
  (cd "$(dirname "$path")" && printf '%s/%s\n' "$(pwd -P)" "$(basename "$path")")
}

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
common_source="${SPELLBOOK_SOURCE:-$repo_root}"
pi_source="${SPELLBOOK_PI_SOURCE:-$common_source}"
codex_source="${SPELLBOOK_CODEX_SOURCE:-$common_source}"
pi_source="$(canonical_path "$pi_source")"
codex_source="$(canonical_path "$codex_source")"
skills_source="${SPELLBOOK_SKILLS_SOURCE:-$common_source/source/skills}"
skills_source="$(canonical_path "$skills_source")"

agents_source="$codex_source/source/AGENTS.md"
pi_agents_source="$pi_source/source/AGENTS.md"
pi_dir="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
codex_home="${CODEX_HOME:-$HOME/.codex}"
codex_skills_dir="${CODEX_SKILLS_DIR:-$codex_home/skills}"
claude_skills_dir="${CLAUDE_CODE_DIR:-$HOME/.claude}/skills"

declare -a selected_targets=()
declare -a sources=()
declare -a targets=()
declare -a labels=()

add_target_once() {
  local candidate="$1" target
  for target in "${selected_targets[@]}"; do [ "$target" = "$candidate" ] && return; done
  selected_targets+=("$candidate")
}

is_available() {
  local target="$1" command_name
  case "$target" in
    pi) command_name="${PI_BIN:-pi}" ;;
    codex) command_name="${CODEX_BIN:-codex}" ;;
    claude) command_name="${CLAUDE_BIN:-claude}" ;;
  esac
  command -v "$command_name" >/dev/null 2>&1
}

select_targets() {
  local target
  if [ "${#requested_targets[@]}" -gt 0 ]; then
    for target in "${requested_targets[@]}"; do add_target_once "$target"; done
    return
  fi

  if [ "$action" = "uninstall" ] || [ "$action" = "status" ]; then
    selected_targets=(pi codex claude)
    return
  fi

  for target in pi codex claude; do
    if is_available "$target"; then
      selected_targets+=("$target")
    else
      echo "Skipping $target: command not found."
    fi
  done
}

add_link() {
  sources+=("$1")
  targets+=("$2")
  labels+=("$3")
}

add_skills() {
  local destination="$1" harness="$2" skill
  while IFS= read -r skill; do
    add_link "$skill" "$destination/$(basename "$skill")" "$harness skill: $(basename "$skill")"
  done < <(find "$skills_source" -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/SKILL.md' ';' -print | sort)
}

build_plan() {
  local target resource
  for target in "${selected_targets[@]}"; do
    case "$target" in
      pi)
        add_link "$pi_agents_source" "$pi_dir/AGENTS.md" "Pi AGENTS.md"
        for resource in extensions skills prompts themes; do
          add_link "$pi_source/source/$resource" "$pi_dir/$resource/spellbook" "Pi $resource"
        done
        ;;
      codex)
        add_link "$agents_source" "$codex_home/AGENTS.md" "Codex AGENTS.md"
        add_link "$skills_source" "$codex_skills_dir" "Codex skills"
        ;;
      claude) add_skills "$claude_skills_dir" "Claude Code" ;;
    esac
  done
}

validate_target() {
  local target="$1"
  case "$target" in
    /*) ;;
    *) echo "Target must be an absolute path: $target" >&2; return 1 ;;
  esac
  [ "$target" != "/" ] || { echo "Refusing to manage the filesystem root." >&2; return 1; }
}

link_points_to() {
  local link="$1" source="$2"
  [ -L "$link" ] && [ "$(readlink -f "$link")" = "$source" ]
}

do_cmd() {
  if [ "$dry_run" -eq 1 ]; then
    printf 'DRY-RUN: '
    printf '%q ' "$@"
    printf '\n'
  else
    "$@"
  fi
}

preflight_install() {
  local index target source failed=0
  for index in "${!targets[@]}"; do
    target="${targets[$index]}"
    source="${sources[$index]}"
    [ -e "$source" ] || { echo "Source does not exist: $source" >&2; failed=1; continue; }
    validate_target "$target" || { failed=1; continue; }
    if { [ -e "$target" ] || [ -L "$target" ]; } && ! link_points_to "$target" "$source" && [ "$force" -eq 0 ] && [ "$backup" -eq 0 ]; then
      echo "Conflict: $target already exists. Re-run with --backup or --force." >&2
      failed=1
    fi
  done
  return "$failed"
}

backup_target() {
  local target="$1" backup_target="$target.bak.$(date +%Y%m%d%H%M%S)" suffix=0
  while [ -e "$backup_target" ] || [ -L "$backup_target" ]; do
    suffix=$((suffix + 1))
    backup_target="$target.bak.$(date +%Y%m%d%H%M%S).$suffix"
  done
  echo "Backing up conflict: $target -> $backup_target"
  do_cmd mv "$target" "$backup_target"
}

install_link() {
  local source="$1" target="$2" label="$3"
  if [ -e "$target" ] || [ -L "$target" ]; then
    if link_points_to "$target" "$source"; then
      echo "Already installed: $label"
      return
    elif [ "$backup" -eq 1 ]; then
      backup_target "$target"
    else
      echo "Removing conflict: $target"
      do_cmd rm -rf "$target"
    fi
  fi
  echo "Installing: $label ($target -> $source)"
  do_cmd mkdir -p "$(dirname "$target")"
  do_cmd ln -s "$source" "$target"
}

uninstall_link() {
  local source="$1" target="$2" label="$3"
  if link_points_to "$target" "$source"; then
    echo "Uninstalling: $label"
    do_cmd rm "$target"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "Skipping non-spellbook path: $target"
  else
    echo "Not installed: $label"
  fi
}

report_link() {
  local source="$1" target="$2" label="$3"
  if link_points_to "$target" "$source"; then
    echo "Installed: $label ($target -> $source)"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "Conflict: $label ($target)"
  else
    echo "Not installed: $label"
  fi
}

select_targets
build_plan

if [ "${#selected_targets[@]}" -eq 0 ]; then
  echo "No supported agent harnesses found on PATH. Use --target to configure one explicitly."
  exit 0
fi

case "$action" in
  install)
    if ! preflight_install; then
      exit 1
    fi
    for index in "${!targets[@]}"; do install_link "${sources[$index]}" "${targets[$index]}" "${labels[$index]}"; done
    ;;
  uninstall)
    for index in "${!targets[@]}"; do uninstall_link "${sources[$index]}" "${targets[$index]}" "${labels[$index]}"; done
    ;;
  status)
    for index in "${!targets[@]}"; do report_link "${sources[$index]}" "${targets[$index]}" "${labels[$index]}"; done
    ;;
esac
