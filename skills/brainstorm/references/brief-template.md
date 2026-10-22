# Brief template

Read when writing the brief. Fill every section. Write "None" rather than
deleting a section; an empty section is a decision a reader can check.

Build the intent, success, and scope sections from the confirmed restate,
keeping the user's words where they were precise. Mark each choice you made, rather
than the user, with **(my call)**. Keep file paths and code out unless a
prototype produced a small snippet, such as a state machine or schema, that
states a decision more precisely than prose.

```markdown
# <Name>

## Intent

What this is and why it should exist, in two or three sentences. Name who it is
for and the moment they reach for it.

## Success

How the user will know it worked. Make each line observable, so a builder can
check it: "I can see every running experiment on one page", not "better
visibility".

## Scope

The smallest version that delivers the intent. List what it does, in the
order a user meets it.

## Not doing

What is deliberately left out, each with a one-line reason. Include anti-goals:
results that would count as failure even if the feature technically works.

## Decisions

Choices already made, each with its reason. Include the platform, language,
libraries, storage, and interaction choices the user made or delegated.

- <decision>: <reason>
- <decision>: <reason> **(my call)**

## Constraints

Fixed limits: existing systems to build on, deadlines, budgets, environments,
and anything the user said must not change.

## Assumptions to check

What the plan bets is true but nobody has verified, riskiest first. Give each a
cheap way to check it.

- [ ] <assumption>: <how to check>

## Left to the builder

Decisions the user explicitly does not care about, so the builder can settle
them without asking.

## First slices

Two to four independently checkable steps, riskiest unknown first. Each step
names what it proves.

1. <slice>: proves <what>

## Glossary

Terms that have a specific meaning in this brief. Omit terms with their
ordinary meaning.
```
