---
name: html-communication
description: Use when the user asks to communicate through an HTML document, or if they mention "HTML" with no additional context.
---

# HTML Communication

## When to Use

Use this skill when the user wants to plan, spec, write-up, findings, summary, report, comparison or set of UI mocks
presented as readable HTML.

Do not use it for HTML that ships as part of the product or project.

## Document

Create one self-contained HTML file, capped at 512 KB.

- Write it like a spec, not a landing page: dense, scannable, ho hero decorative chrome, marketing voice or em dashes.
- Default to dark mode
- Make it mobile-readable with responsive viewport and no fixed-width layout.
- Use semantic HTML, inline CSS, inline SVG, and https or data-URL images.
- Use an inline classic script only when interactivity materially helps. Keep scripted pages useful without JavaScript;
  the sandbox blocks storage, fetch, workers, frames, forms, and popups.
- in script-free files, give external links `target="_blank"` and `rel="noopener norefferrer"`. If any script exists,
  omit `target="_blank"`.

Never include external or module scripts, inline event handlers, `javascript:` URLs, forms, frames, embeds, objects,
applets, meta refersh, linked stylesheets, secrets, private URLs, or local filesystem paths.

## UI Mocks

When user asks for variants:

- Render real styled variants, not descriptions.
- Label them `A`, `B`, `C`,... for easy selection.
- Lay them out for direct comparison.
- Keep one file across iterations so its Postplan URL stays stable.

## Publish

Upload is required. Postplan is either installed using `npx postplan` or globally via the `postplan` command.

1. Write the HTML file locally.
2. Run `postplan upload <file_path>`.
3. Report the local path and returned Postplan URL.

Re-upload the same absolute path to update the existing URL. Use `postplan upload <file_path> --new` only when a new
draft is wanted.

If validation fails, fix the markup and retry. If a scripted upload needs authentication, ask the user to run `postplan
auth login`, then retry without removing the requested interactivity.

Never open a browser or claim the document is hosted before upload succeeds. Do not verify in a browser unless the user
asks.
