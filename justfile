set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

_default:
    @just --list

# Install global instructions, references, and Pi extensions; pass --target codex|claude|pi or --dry-run.
install *args:
    node scripts/install.ts install {{args}}

# Remove only links pointing into this checkout.
uninstall *args:
    node scripts/install.ts uninstall {{args}}

# Show installed, missing, conflicting, and stale links.
status *args:
    node scripts/install.ts status {{args}}

check:
    npm run check
    npm test
