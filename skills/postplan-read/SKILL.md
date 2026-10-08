---
name: postplan-read
description: Use when the user provides a postplan.dev URL to read
---

# Postplan Read

Fetch the uploaded HTML with the shell. Do not use web search or a browser.

1. Remove the trailing slash, then ensure the url ends in `/raw`.
2. Run `curl --fail --silent --show-error --location --max-time 30 --output /tmp/postplan.html '<raw-url>'`.
3. Read `/tmp/postplan.html` and continue the users request from its content.

if `curl` fails, report its actual status or network error. Do not substitute search results.
