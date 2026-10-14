# Skill mechanics

Use this reference when creating or changing a skill's packaging or invocation.

## Compact format reference

A skill requires `SKILL.md` with YAML frontmatter containing `name` and
`description`, followed by Markdown instructions.

| Field | Required | Constraints |
| --- | --- | --- |
| `name` | Yes | 1–64 lowercase letters (`a-z`), digits, or hyphens; matches the directory name; no leading, trailing, or consecutive hyphens. |
| `description` | Yes | 1–1,024 characters; describes the capability and when it applies. |
| `license` | No | License name or reference to a bundled license file. |
| `compatibility` | No | 1–500 characters when present; environment requirements such as packages or network access. |
| `metadata` | No | Mapping of string keys to string values. |
| `allowed-tools` | No | Space-separated tool list; experimental, with support varying by harness. |

The Markdown body has no required section layout. Supporting directories are
optional. Add optional fields only for concrete needs, and keep detailed
execution steps in the body. Harness extensions are separate from this format;
a validator or harness may implement only part of it. Tool metadata does not
expand the user's authorization.

## Discovery

Test description boundaries with a request that should select the skill and a
nearby request that should not. Add exclusions only to prevent plausible
misrouting. Ordinary documentation intended for people should not trigger this
skill solely because it is Markdown.

## Invocation and portability

Preserve existing invocation behavior unless the user asks to change it. For a
new skill, use normal automatic discovery unless explicit-only invocation is
requested. Explain any meaningful tradeoff: automatic discovery helps the agent
find relevant guidance; explicit invocation makes the user responsible for
selecting it.

Invocation controls are harness-specific. Verify the target harness's mechanism
before adding a field or claiming that a skill can invoke another skill. Phrase
portable instructions in terms of reading material or using available
capabilities. Refer to another skill only when it is needed and available.

## Supporting resources

Start with `SKILL.md`; add resources for concrete needs:

| Resource | Use |
| --- | --- |
| `references/` | Substantial conditional instructions, schemas, or examples |
| `scripts/` | Reusable or fragile deterministic operations |
| `assets/` | Material copied into an output, such as a template or image |

Give references descriptive names and loading conditions. Keep navigation
shallow; avoid chains that conceal necessary rules. Longer references benefit
from a contents list or useful search terms.

State dependencies and execution intent for scripts, and check their behavior.
Use an explicit interpreter in command examples where packaging may lose
executable permissions. Keep script output focused on results and actionable
errors.

Keep skill-specific references beside the skill. Give shared references a stable,
accessible location and explicit loading triggers. Avoid duplicating shared
guidance into each consuming skill.

## Packaging checks

Check frontmatter, directory/name agreement, relative links, resource presence,
and documented dependencies. Preserve applicable source attribution and license
notices. Preview discovery or installation in a temporary home
when that behavior needs verification. Structural validity establishes packaging,
not behavioral effectiveness or support in an untested harness.
