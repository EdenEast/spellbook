# Sources and local decisions

This locally owned adapted skill combines ideas from the external sources below.
[SOURCE.toml](SOURCE.toml) records their reviewed versions; [LICENSES](LICENSES)
retains the complete Git-source copyright and license notices. These sources
inform the skill's behavior without governing its future direction.

## Source decisions

### Matt Pocock: writing-for-agents

Reviewed `SKILL.md` and `SKILL-MECHANICS.md` at the recorded revision.
Incorporated explicit loading conditions, separation of ordered work from
reference material, branch-based disclosure, grouping related rules, checkable
completion criteria, and removal of stale or redundant guidance.

**Declined**

- Pretrained "leading words" as the primary technique: use clear domain
  terminology and observable conditions.
- Guaranteed effects of negation or attention: treat these claims as hypotheses
  to evaluate.
- Required sequence splitting or delegation to hide later steps: first improve
  completion criteria.
- Claude-specific invocation fields and router restrictions as portable rules:
  use controls supported by the target harness.
- Explicit-only invocation as the default: retain automatic discovery unless
  the user requests otherwise.

### Superpowers: writing-skills

Reviewed its `SKILL.md`; companion documents and required companion skills were
not imported. Incorporated comparison with baseline behavior, realistic
application and retrieval scenarios, pressure testing for demonstrated compliance
failures, and instruction forms matched to failure types.

**Declined**

- Mandatory failing-test-first evaluation for every edit: match validation to
  the behavioral change.
- Mandatory subagents: use evaluation mechanisms available and authorized in
  the current environment.
- Universal loophole tables: address demonstrated compliance failures.
- Fixed word budgets: size guidance around its reading path and useful content.
- Mandatory section templates: choose structure for the task.
- Automatic commit/push deployment steps: respect the user's authorized scope.
- Trigger-only descriptions: include capability and triggers under the
  specification, keeping detailed workflow in the body.
- Synonym padding for discovery: use terms identifying distinct task branches.
- Source-reported experiments as proof of local effectiveness: use them to
  motivate evaluation of this skill.

### Anthropic: overview and authoring best practices

The requested overview links to the best-practices page, which was reviewed as
an additional source. Incorporated staged loading, conditional resources,
specificity matched to fragility, useful examples, clear script execution intent,
and evaluation before extensive behavioral guidance.

**Declined**

- Fixed line limits: size resources around the task's reading needs.
- Comprehensive bundled manuals by default: include supporting material with
  a concrete use.
- Claude runtime, reserved names, tool behavior, and packaging as cross-harness
  requirements: separate portable guidance from environment-specific controls.

### Agent Skills specification

Incorporated required frontmatter, naming and description constraints, optional
resource conventions, and compatibility considerations. The mechanics reference
contains the compact format contract needed during authoring, so routine work
does not require retrieving the external specification.

**Declined**

- Recommended headings and directories as mandatory structure: choose the
  body layout and supporting resources for the task.
- Portable support or additional permissions inferred from experimental tool
  metadata: check harness support and preserve session authorization.

### Addy Osmani: context-engineering

Incorporated selective loading of project evidence, preserving live task context,
explicit conflict handling, and durable handoffs containing status, working-tree
state, verification, and unresolved decisions.

**Declined**

- Copied stack/command inventories: point to current configuration and retain
  non-obvious conventions.
- Universal trust by file type: keep local and retrieved material subject to
  the instruction hierarchy.
- Fixed context-capacity or line thresholds: use relevant evidence and the
  harness's available context controls.
- Mandatory session resets: hand off at meaningful task boundaries when useful.
- Escalation for every unspecified implementation detail: exercise routine
  judgment and ask about material scope, behavior, or authorization gaps.
- MCP product recommendations and process supervision: keep these outside the
  writing workflow.

### OpenAI: skill metadata and validation

Reviewed the skill-building documentation and the skill metadata section of the
plugin validation reference. Incorporated `agents/openai.yaml` as an optional
OpenAI extension with UI metadata, invocation policy, and actual MCP dependencies.
The local mechanics reference includes field guidance and a compact example.
This skill omits the optional UI metadata file and retains automatic invocation.

**Declined**

- OpenAI metadata as a universal Agent Skills requirement: keep the portable
  format distinct from harness extensions and plugin validation requirements.
- UI metadata, icons, branding, or tool dependencies without a concrete need:
  this workflow needs no separate presentation metadata or MCP integration.
- Explicit-only invocation based on packaging examples: preserve automatic
  discovery unless the user requests otherwise.
- Plugin publication procedures as part of writing: packaging metadata does not
  authorize submission or deployment.

### Claude Code: invocation metadata

Reviewed the frontmatter and invocation-control sections of the skill reference.
Incorporated `disable-model-invocation` into the compact metadata reference,
including its boolean default, manual invocation behavior, and discovery effect.

**Declined**

- `disable-model-invocation` as a portable or Codex field: label it as a Claude
  Code extension and distinguish Codex's optional policy control.
- Explicit-only invocation as a universal default: preserve automatic discovery
  unless the user requests otherwise.

## Web retrieval limitations

The Anthropic, OpenAI validation, and Claude Code digests identify downloaded
HTML bytes, including page markup. The specification and OpenAI skill-building digests
identify the downloaded Markdown responses at `snapshot_url`. These live URLs
are retrieval locations, not immutable archives.
Their content and rendering may change independently of substantive guidance.

Downloads were retained temporarily for this review, not bundled into the skill.
No permanent snapshot or redistribution permission for the web documents was
established. The digests identify the review downloads but cannot reconstruct
them after those temporary files are gone. Future source reviews must retrieve
the current pages and assess them against these documented decisions; byte
differences alone are not evidence of changed guidance.
