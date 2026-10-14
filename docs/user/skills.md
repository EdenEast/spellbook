# Work with skills

Spellbook supports two ways to bring external ideas and skills into your collection:

- **Adapt** when you want your own skill, informed by one or more sources.
  You decide its behavior and future direction.
- **Adopt** when you want to preserve an existing skill's workflow and identity,
  with local adjustments for your environment. Upstream remains the basis for updates.

You can ask an agent to carry out either workflow in the Spellbook checkout:

- "Adapt these articles and example skills into a skill for my review workflow."
- "Adopt this skill and make its tool instructions work with my harnesses."
- "Review the sources for this adapted skill and suggest useful changes."
- "Update this adopted skill from upstream while preserving my local adjustments."

The agent records sources and local decisions alongside the skill. An adapted
skill receives a source review; an adopted skill receives an upstream integration.
Both produce repository changes you can inspect. See the [shared glossary](../GLOSSARY.md)
for these distinctions and [agent maintenance procedures](../agents/skills.md)
for the detailed workflow.

## Make skills available

After adding skills to the checkout, preview and install their links:

```sh
spellbook install --dry-run
spellbook install
spellbook status
```

Use `--target codex`, `--target claude`, or `--target pi` to select installation
targets. Installation manages availability; it does not fetch or merge upstream
changes. Reload or restart the harness session and confirm that the skill is
discovered. See [installation paths and behavior](installation-reference.md)
for shared destinations and T3 Code usage.
