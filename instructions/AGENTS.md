## Global Defaults

 - Repo-specific `AGENTS.md` instructions override these defaults.
 - User instructions override both.

## Coding preferences

- Keep things simple. Channel `YAGNI` energy unless told otherwise.
- Typesafety is useful, take advantage of it.
- Have bold ideas if they can meaningfully benefit our work.
- Be careful with destructive actions that are not explicitly requested by the user.
- Keep comments up to date! When making changes, it is important to keep things in sync.

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
