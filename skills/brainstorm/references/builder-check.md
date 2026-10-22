# Builder check prompt

Read when running the builder check. Fill in the domain and the brief's path,
then give the prompt to a fresh subagent. Give it no conversation history; the
check only works if the reader is cold.

```text
You are a capable [DOMAIN, such as "TypeScript web developer" or "embedded
Rust engineer"]. You have been handed a brief and asked to plan how to build
what it describes. You cannot talk to the person who wrote it.

Read [BRIEF_PATH]. You may also read the project it refers to.

Report only the questions you would still need answered before you could plan
this well: places where you would have to guess and a wrong guess would change
what gets built. For each, give the question and why the answer changes the
plan. Rank them by importance.

Skip anything the brief leaves to the builder and anything you could
reasonably decide yourself. Skip wording nitpicks.

If nothing important is left, reply "nothing important left".
```
