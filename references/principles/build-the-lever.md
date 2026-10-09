# Build the lever

## Rule

Use a small rerunnable tool when it makes work more reliable or cheaper to verify.

## When to use

Repeated edits or checks are costly or error prone by hand, or a reviewer needs
to repeat an analysis that would otherwise depend on your notes.

## How to apply

1. Look for an existing command or tool that performs the work.
2. If none fits, perform one unit to establish the recipe, then automate it with
   the smallest script or codemod that handles the actual inputs.
3. Compare the tool's output with the verified unit. Make mutations safe to
   rerun and keep writes within the intended scope.
4. Keep the tool when the work outlives the session; otherwise use a temporary
   artifact and report the command and result.

For example, a migration across dozens of files can use a codemod with a dry
run and a check for remaining callers.

## Boundaries

Use direct edits for a few obvious changes when tooling would cost more than
it saves. Automation does not authorize broader writes or replace judgment.
A script deserves the same review as the changes it makes.

## Check

Can the tool rerun on representative inputs and expose a wrong result? Does it
reduce the work or uncertainty enough to justify maintaining it?

## Related references

- [Make operations idempotent](make-operations-idempotent.md)
- [Prove it works](prove-it-works.md)
