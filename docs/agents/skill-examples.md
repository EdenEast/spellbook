# Worked skill examples

These examples use original synthetic material under
[`scripts/tests/fixtures/`](../../scripts/tests/fixtures). They are not active skills
and are never discovered by the installer from this checkout.

## Adapt multiple sources

The [adapted-checks skill](../../scripts/tests/fixtures/skills/adapted-checks/SKILL.md)
combines two short source documents: outcome-based verification and environment
selection. Its `SOURCE.toml` identifies both reviewed sources with content
digests. Relative source locators resolve from the skill directory. Its
`ADAPTATIONS.md` explains the resulting behavior and a source recommendation
that would be declined. These local fixture locators demonstrate provenance;
real imports should use durable URLs, repository revisions, or archive locators.

A source update does not replace this skill. Review its changes, select useful
ideas, document declined or incorporated changes, and then advance that source's
review record. The skill's behavior remains a local decision.

## Adopt and update

The [lifecycle test](../../scripts/tests/skills.test.ts) creates a temporary Git
upstream from the example skill and its helper. It copies the skill into a
separate checkout, records the actual upstream repository and full baseline SHA,
and changes the harness instruction locally while preserving identity.

A second upstream commit improves reporting and changes the helper. The test
reconstructs the old and new upstream entry points with `git show`, then runs
the three-way recipe from [Maintain skills](skills.md). The clean merge retains
the local harness adjustment and includes the reporting improvement. The helper
update is applied separately. Installed links expose both changes immediately;
the updated helper is executed through the installed path.

A competing upstream harness instruction produces conflict markers. The
candidate stays outside the skill and the baseline remains unchanged. This
exercises the staging recipe; it is not an automatic semantic conflict resolver.
For real updates, an agent also reviews additions, deletions, renames, binary
files, licenses, and dependency changes before advancing provenance.

Run the examples and installer checks with:

```sh
npm run check
npm test
```

All installation and upstream repositories used by the tests are temporary.
Git must be available for the lifecycle example. No external source is fetched.
