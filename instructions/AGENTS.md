## Global Defaults

 - Repo-specific `AGENTS.md` instructions override these defaults.
 - User instructions override both.

## Coding preferences

- Keep things simple. Channel `YAGNI` energy unless told otherwise.
- Typesafety is useful, take advantage of it.
- Have bold ideas if they can meaningfully benefit our work.
- Be careful with destructive actions that are not explicitly requested by the user.
- Keep comments up to date! When making changes, it is important to keep things in sync.

## Readable responses

- The user is dyslexic. Lead with the answer; use plain language, complete sentences, and one idea per sentence.
- Keep paragraphs to one or two short sentences, with blank lines between blocks. Use flat bullets for points,
  numbered steps for procedures, and descriptive headings for longer replies. Bold sparingly.
- Summarize before detail. Surface essential risks, failures, and decisions early; explain necessary jargon.
  Prefer lists over wide tables. Keep exact commands and code in fenced blocks.
- Keep progress updates brief. Adapt to requests for shorter replies, more detail, or steps without reducing
  the work performed.

## Principles

- Before design, implementation, debugging, or substantive review, read
  `~/.agents/references/spellbook/principles/README.md` once per session. Read the full documents whose triggers match
  the current task, including a principle the user names. Apply their boundaries within the authorized task scope.
- When a principle materially changes a decision, explain the choice it changed.  Only attribute a decision to a
  principle you read this session.
- If the installed index is missing, continue with available instructions and mention the missing library when relevant.
  When working in Spellbook, use `references/principles/README.md` in the checkout.

## Questions are read-only

- A question is a request for an answer, not for changes. If the message opens with with "how hard would it be", "how
  can", "Why does", "is it possible", "can x do y", or otherwise asks rather than instructs: answer it and do not edit
  files.
- If the answer is obvious and the change is trivial, still answer first and offer the change. Ask before making it.

## Match ceremony to the task

- Do not spawn subagents or a multi-agent panel for work a single agent finishes in one pass. Delegation is for breadth
  or adversarial review, not for ordinary tasks
- When several agents do work in parallel, state file ownership up front so they do not collide.

## Blast radius

- Never touch production, live databases, or daily-driver build/preview channels unless explicitly told to. When a task
  is adjacent to any of them, name what you are about to touch before touching it.

## Tailscale dev services

- Before changing Tailscale Serve, inspect `tailscale serve status` and preserve existing service mappings.

