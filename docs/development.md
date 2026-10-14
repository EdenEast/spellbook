# Develop Spellbook

Use Node.js 24.2 or newer. To get Node, Git, and Just through Nix, enter the
development shell:

```sh
nix develop
```

## Run checks

Install development dependencies, then run the TypeScript check and tests:

```sh
npm ci
npm run check
npm test
```

`just check` runs both checks. `nix flake check` runs the script tests in
`scripts/tests/`.
Node executes the TypeScript scripts directly; no build step is required.

After changing TypeScript tooling, run both `npm run check` and `npm test`.
Installer tests must use temporary homes. Do not test installation against your
active agent configuration.

## Edit resources

Choose the guide for the resource you want to change:

- [Maintain skills](skills.md), including source metadata and update workflows.
- [Maintain shared references](maintenance.md).
- [Create and load Pi extensions](pi-extensions.md).
- [Repository layout](layout.md).

Edit global agent instructions in `instructions/AGENTS.md`. Follow the root
[AGENTS.md](../AGENTS.md) when maintaining this repository.
