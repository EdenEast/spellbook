# Repository layout

The repository uses these paths:

| Path | Contents |
| --- | --- |
| `AGENTS.md` | Repository maintenance instructions. |
| `docs/GLOSSARY.md` | Shared domain terminology, independent of implementation. |
| `instructions/AGENTS.md` | Shared global agent instructions, including generated principle triggers. |
| `skills/` | Active skills with adapt/adopt provenance and optional supporting files. |
| `docs/README.md` | Documentation index for both audiences. |
| `docs/user/` | User-facing setup, usage, and contributor guides. |
| `docs/agents/` | Agent maintenance procedures and repository guidance. |
| `references/` | Shared documents loaded on demand. |
| `references/README.md` | Reference catalog. |
| `references/principles/` | Principles, index, and provenance. |
| `licenses/` | One license file per external source, with an index of what uses it. |
| `pi/extensions/` | Pi extension files or directories with `index.ts` or `index.js`. |
| `scripts/` | Command-line entry points and installer tooling. |
| `scripts/tests/` | Script tests and their fixtures. |
| `nix/` | Home Manager integration. |
| `package.json` | Pi skill and extension package declaration and Node tooling. |
| `flake.nix` | Development environment, checks, and module exports. |
| `.github/workflows/` | CI that runs `npm run check` and `npm test`. |
