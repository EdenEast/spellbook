---
name: html-communication
description: Create readable HTML plans, specifications, reports, comparisons, or UI mock variants, and publish through Postplan when authorized. Use for communication documents, not product HTML.
---

# HTML Communication

## When to Use

Use this skill when the user wants to plan, spec, write-up, findings, summary, report, comparison or set of UI mocks
presented as readable HTML.

Do not use it for HTML that ships as part of the product or project.

## Document

Create one self-contained HTML file, capped at 512 KB.

- Write it like a spec, not a landing page: clear and scannable, without hero sections, decorative chrome, marketing voice or em dashes.
- Make it mobile-readable with responsive viewport and no fixed-width layout.
- Use semantic HTML, inline CSS, inline SVG, and https or data-URL images.
- Use an inline classic script only when interactivity materially helps. Keep scripted pages useful without JavaScript;
  the sandbox blocks storage, fetch, workers, frames, forms, and popups.
- In script-free files, give external links `target="_blank"` and `rel="noopener noreferrer"`. If any script exists,
  omit `target="_blank"`.

Never include external or module scripts, inline event handlers, `javascript:` URLs, forms, frames, embeds, objects,
applets, meta refresh, linked stylesheets, secrets, private URLs, or local filesystem paths.

## Reading accessibility

For communication documents, including reports accompanying UI mocks:

- Start with a brief overview. Use short paragraphs, descriptive headings, flat lists, and numbered steps.
  Keep essential outcomes, risks, and decisions visible; place supporting detail in native `details`/`summary`
  sections. Use semantic headings and lists, selectable text, and text explanations for diagrams.
- Use one left-aligned text column, roughly `65ch` wide, that shrinks on mobile. Start with a system sans-serif
  font at `1.125rem`, line height `1.6`, and clear paragraph spacing. Allow browser zoom and reflow at 200%;
  wrap prose while keeping long code or tables in their own scrollable containers.
- Provide labelled controls for text size, line spacing, and light/dark appearance. Respect the system colour
  preference initially. Maintain readable contrast in both themes and visible keyboard focus.
- Implement controls with native buttons or labelled inputs outside forms and an inline classic script using
  `addEventListener`. Expose current values or states accessibly. Keep adjustments in memory; storage is blocked.
  With scripts disabled, retain readable defaults and working disclosure sections; hide inactive controls.
- Keep the reading order useful for screen readers and read-aloud tools. Use ordinary text and selective bold;
  offer specialist fonts or word-by-word emphasis only when requested.

UI mock designs retain their intended layout and typography; apply these defaults to the surrounding report.
Before publishing, check the controls, keyboard access, narrow layout, zoom, and script-free fallback where
permitted. Report any checks not performed; browser verification still requires a user request.

## UI Mocks

When user asks for variants:

- Render real styled variants, not descriptions.
- Label them `A`, `B`, `C`,... for easy selection.
- Lay them out for direct comparison.
- Keep one file across iterations so its Postplan URL stays stable.

## Publish

Upload when the user requests publication or existing instructions authorize
Postplan delivery. A request to format material as HTML is not, by itself,
permission to upload it. Without publication authorization, write the local HTML
file, report its path, and stop before upload. Confidential content must stay
local unless its external publication is authorized.

For authorized uploads, use the installed `postplan` command or `npx postplan`.

1. Write the HTML file locally.
2. Run `postplan upload <file_path>`, or `npx postplan upload <file_path>` if the CLI is not installed globally.
3. Report the local path and returned Postplan URL.

Re-upload the same absolute path to update the existing URL. Use `postplan upload <file_path> --new` only when a new
draft is wanted.

If validation fails, fix the markup and retry. If a scripted upload needs authentication, ask the user to run `postplan
auth login`, then retry without removing the requested interactivity.

Never open a browser or claim the document is hosted before upload succeeds. Do not verify in a browser unless the user
asks.
