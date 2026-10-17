# Shared references

Reference documents provide guidance across workflows and ordinary tasks. Global
instructions supply the loading triggers; these files are read on demand.

| Reference | Description | Use cases |
| --- | --- | --- |
| [Model roles](models/README.md) | Model, effort, and fallback order for each subagent role, adapted from pstack's model rule. | Before spawning a subagent for a role named in `how`, `why`, or another skill. |
| [Principles](principles/README.md) | All 24 pstack principles with concrete application guidance, triggers, checks, and documented Spellbook boundaries. | Design, implementation, debugging, substantive review, or a principle named by the user. |

For maintenance in this repository, read the principles’
[source and adaptation notes](principles/ADAPTATIONS.md) when reviewing
provenance or updating the collection.

The installers expose this directory at `~/.agents/references/spellbook/` for
Codex, Claude Code, and Pi. Relative links within the library work through that
shared location. References have no skill frontmatter or invocation metadata.

Keep guidance used across workflows here. Add a collection to this catalog and give
it a loading pointer when adopting it.
