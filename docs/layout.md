# Repository layout

Each skill has one editable copy in the repository. Global skills live in
`skills/`, regardless of origin. Repository-only skills live in `.agents/skills/`.

The repository uses these paths:

| Path | Contents |
| --- | --- |
| `AGENTS.md` | Repository maintenance instructions. |
| `instructions/AGENTS.md` | Shared global agent instructions. |
| `docs/` | Project guides and reference pages. |
| `references/` | Shared documents loaded on demand. |
| `references/README.md` | Reference catalog. |
| `references/principles/` | Principles, index, provenance, and license. |
| `skills/<name>/SKILL.md` | Globally installed skill instructions. |
| `skills/<name>/SOURCE.toml` | Provenance for an imported skill. |
| `skills/<name>/references/` | Optional supporting files for a skill. |
| `.agents/skills/` | Repository-only skills for Codex and Pi. |
| `.claude/skills/` | Links to repository-only skills for Claude Code. |
| `pi/extensions/` | Pi extension files or directories with `index.ts` or `index.js`. |
| `scripts/` | Installer and tests. |
| `nix/` | Home Manager integration. |
| `package.json` | Pi extension package declaration and Node tooling. |
| `flake.nix` | Development environment, checks, and module exports. |
