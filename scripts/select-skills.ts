import { emitKeypressEvents } from "node:readline";
import type { Key } from "node:readline";

export async function selectSkills(names: readonly string[], installed: readonly string[] = []): Promise<string[] | undefined> {
  const input = process.stdin;
  const output = process.stdout;
  if (!input.isTTY || !output.isTTY) throw new Error("--select requires an interactive terminal. Run install without --select to install all skills.");
  if (!names.length) return [];

  const selected = new Set(names.filter((name) => installed.includes(name)));
  let cursor = 0;
  let lines = 0;
  const wasRaw = input.isRaw;

  function render() {
    if (lines) output.write(`\x1b[${lines}A\r\x1b[0J`);
    const size = Math.max(1, Math.min(12, (output.rows || 24) - 5));
    const start = Math.floor(cursor / size) * size;
    const visible = names.slice(start, start + size);
    const text = [
      "Select skills to keep installed. Unchecking removes this checkout's links.",
      "Up/down move. Space toggles. A toggles all. Enter syncs. Q or Esc quits.",
      ...visible.map((name, index) => `${start + index === cursor ? ">" : " "} [${selected.has(name) ? "x" : " "}] ${name}`),
      `${selected.size} selected. Skills ${start + 1}-${start + visible.length} of ${names.length}.`,
    ];
    output.write(text.join("\n") + "\n");
    lines = text.length;
  }

  emitKeypressEvents(input);
  input.setRawMode(true);
  input.resume();
  output.write("\x1b[?25l");
  try {
    return await new Promise<string[] | undefined>((resolve) => {
      function finish(result: string[] | undefined) {
        input.off("keypress", onKey);
        input.off("end", onEnd);
        resolve(result);
      }
      function onEnd() { finish(undefined); }
      function onKey(_text: string, key: Key) {
        if ((key.ctrl && key.name === "c") || key.name === "escape" || key.name === "q") return finish(undefined);
        if (key.name === "return") return finish(names.filter((name) => selected.has(name)));
        if (key.name === "up") cursor = (cursor + names.length - 1) % names.length;
        else if (key.name === "down") cursor = (cursor + 1) % names.length;
        else if (key.name === "space") {
          const name = names[cursor]!;
          if (selected.has(name)) selected.delete(name);
          else selected.add(name);
        } else if (key.name === "a") {
          if (selected.size === names.length) selected.clear();
          else for (const name of names) selected.add(name);
        }
        render();
      }
      input.on("keypress", onKey);
      input.once("end", onEnd);
      render();
    });
  } finally {
    input.setRawMode(wasRaw);
    input.pause();
    output.write("\x1b[?25h");
  }
}
