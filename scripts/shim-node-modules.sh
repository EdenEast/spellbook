#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
pi_cmd="${PI_BIN:-pi}"
pi_bin="$(readlink -f "$(command -v "$pi_cmd")")"
pi_prefix="$(dirname "$(dirname "$pi_bin")")"

pi_root=""
for candidate in \
  "$pi_prefix/lib/node_modules/@earendil-works/pi-coding-agent" \
  "$pi_prefix/lib/node_modules/@mariozechner/pi-coding-agent" \
  "$pi_prefix/lib/node_modules/pi-monorepo"
do
  if [ -d "$candidate" ]; then
    pi_root="$candidate"
    break
  fi
done

if [ -z "$pi_root" ]; then
  echo "Could not find Pi module root under: $pi_prefix/lib/node_modules" >&2
  exit 1
fi

find_pi_dep() {
  local name="$1"
  local dep

  for dep in \
    "$pi_root/node_modules/@earendil-works/$name" \
    "$pi_root/node_modules/@mariozechner/$name"
  do
    if [ -d "$dep" ]; then
      printf '%s\n' "$dep"
      return
    fi
  done

  echo "Could not find Pi dependency: $name" >&2
  exit 1
}

pi_ai="$(find_pi_dep pi-ai)"
pi_tui="$(find_pi_dep pi-tui)"
pi_agent_core="$(find_pi_dep pi-agent-core)"
typebox="$pi_root/node_modules/typebox"

if [ ! -d "$typebox" ]; then
  echo "Could not find Pi dependency: typebox" >&2
  exit 1
fi

for base in "$repo_root/node_modules" "$HOME/.pi/agent/node_modules"; do
  mkdir -p "$base/@earendil-works" "$base/@mariozechner"

  for scope in @earendil-works @mariozechner; do
    ln -sfn "$pi_root" "$base/$scope/pi-coding-agent"
    ln -sfn "$pi_ai" "$base/$scope/pi-ai"
    ln -sfn "$pi_tui" "$base/$scope/pi-tui"
    ln -sfn "$pi_agent_core" "$base/$scope/pi-agent-core"
  done

  ln -sfn "$typebox" "$base/typebox"
  echo "Created Pi module shims in $base"
done
