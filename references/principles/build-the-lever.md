# Build the lever

## Rule

For nontrivial work, default to a small rerunnable tool that does the work or
proves the result.

## When to use

Nontrivial edits, migrations, analyses, or checks. Repetition is not required:
a one-off task also benefits when a tool makes the result checkable.

## How to apply

1. Look for an existing command or tool that performs the work.
2. If none fits, perform one unit to establish the recipe, then automate it with
   the smallest script or codemod that handles the actual inputs.
3. Compare the tool's output with the verified unit. Make mutations safe to
   rerun and keep writes within the intended scope.
4. Prefer a deterministic tool over delegate fan-out when it can process every
   unit in one pass.
5. If delegation is authorized and useful, give delegates one shared recipe
   with verification criteria and explicit write boundaries. Keep that recipe
   outside their write scope.
6. Produce a file: a script, codemod, generator, check, or shared delegate recipe.
   Keep it reviewable with its command and result. Include it in the deliverable
   when the work outlives the session; otherwise use a temporary artifact.

For example, a migration across dozens of files can use a codemod with a dry
run and a check for remaining callers.

## Boundaries

Skip tooling for trivial work, such as a couple of obvious edits. Build the
smallest tool that does or proves the job; reuse existing tools and avoid a new
framework. Automation does not authorize broader writes, delegation, or commits.
A script deserves the same review as the changes it makes.

## Check

Where is the rerunnable artifact? Does its output match the verified first unit,
and can it expose a wrong result? A claim that this principle was applied needs
an actual tool or recipe, not only a description of manual work.

## Related references

- [Make operations idempotent](make-operations-idempotent.md)
- [Prove it works](prove-it-works.md)
