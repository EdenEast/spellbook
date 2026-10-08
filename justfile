set positional-arguments

_default:
    @just --list

# Install skills and Pi extensions; pass --target codex|claude|pi or --dry-run.
install *args:
    node scripts/install.ts install "$@"

# Remove only links pointing into this checkout.
uninstall *args:
    node scripts/install.ts uninstall "$@"

# Show installed, missing, conflicting, and stale links.
status *args:
    node scripts/install.ts status "$@"

check:
    npm run check
    npm test
