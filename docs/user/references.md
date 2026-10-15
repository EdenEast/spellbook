# Use shared references

References provide reading material for agent tasks without registering another
skill. Browse the [reference catalog](../../references/README.md) to find a
collection and its loading guidance.

The global instructions direct agents to read the
[principles index](../../references/principles/README.md) before design,
implementation, debugging, or substantive review. Agents then read the full
documents whose triggers match the task. You can name a principle, such as
"prove it works" or "subtract before you add", to apply it to a task.

The principles collection adapts 24 pstack principles. Each document has a rule,
triggers, application guidance, boundaries, a check, and related references.

The [agent usage policy](../../references/agent-usage.md) is loaded by `how` and
`why`. They work inline on the current model and follow relevant evidence leads;
additional agents or model changes require an explicit request. Their coverage
notes distinguish unsearched sources from empty searches.

Installed references use `~/.agents/references/spellbook/` for all three harnesses.
If the installed library is missing, agents continue with available instructions
and report the gap when relevant. Agents explain a principle's effect on a
decision when that explanation helps assess the work.

To add or change shared material, ask an agent to follow the
[reference maintenance procedure](../agents/maintenance.md). Material used only
by one skill can stay with that skill; material useful across workflows belongs
in the shared reference library.
