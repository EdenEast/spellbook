import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const Option = Type.Object({
  label: Type.String({ minLength: 1 }),
  description: Type.String(),
});

const Parameters = Type.Object({
  questions: Type.Array(Type.Object({
    id: Type.String({ minLength: 1, description: "Unique ID used in the answer map." }),
    header: Type.String({ minLength: 1, description: "Short topic label." }),
    question: Type.String({ minLength: 1, description: "The full question to ask." }),
    options: Type.Optional(Type.Array(Option, { minItems: 1 })),
    isOther: Type.Optional(Type.Boolean({ description: "Offer a custom answer (default true)." })),
    isSecret: Type.Optional(Type.Boolean({ description: "Must be false. Use T3 request_secret for secrets." })),
  }), { minItems: 1, maxItems: 3 }),
});

export default function requestUserInput(pi: ExtensionAPI) {
  pi.registerTool({
    name: "request_user_input",
    label: "Ask user",
    description: "Ask the user 1–3 questions about decisions, requirements, or missing information. " +
      "Returns answers keyed by question ID. Put the recommended choice first and mark its label '(Recommended)'. " +
      "Use only when exploration cannot answer the question. Never request passwords, tokens, or permission approvals.",
    parameters: Parameters,
    executionMode: "sequential",
    // Dialogs belong to the user, not to scripts orchestrating other tools.
    exposure: "model-only",
    async execute(_id, params, signal, _onUpdate, ctx) {
      const answers: Record<string, { answers: string[] }> = Object.create(null);
      const result = (cancelled: boolean, error?: string) => ({
        content: [{ type: "text" as const, text: error ?? JSON.stringify({ answers, cancelled }) }],
        details: { answers, cancelled },
        ...(error === undefined ? {} : { isError: true }),
      });

      if (!ctx.hasUI) return result(false, "User questions require an interactive Pi or RPC host. Ask in chat instead.");
      const ids = new Set<string>();
      // Validate the entire batch before opening any dialogs.
      for (const question of params.questions) {
        if (ids.has(question.id)) return result(false, "Question IDs must be unique.");
        ids.add(question.id);
        if (question.isSecret) return result(false, "Do not request secrets here. Use T3 request_secret instead.");
        const labels = question.options?.map((option) => option.label) ?? [];
        if (new Set(labels).size !== labels.length) return result(false, "Option labels must be unique within a question.");
      }

      for (const question of params.questions) {
        signal?.throwIfAborted();
        const title = `${question.header}\n\n${question.question}`;
        const options = question.options ?? [];
        let answer: string | undefined;
        if (options.length === 0) {
          answer = await ctx.ui.input(title, "Your answer", { signal });
        } else {
          // Pi RPC only supports strings, so preserve descriptions in the display
          // value and translate selected values back to Codex-style labels.
          const choices = options.map((option, index) =>
            `${index + 1}. ${option.label}${option.description ? ` — ${option.description}` : ""}`);
          const other = "Other (write an answer)";
          const selected = await ctx.ui.select(title,
            question.isOther === false ? choices : [...choices, other], { signal });
          signal?.throwIfAborted();
          if (selected === other && question.isOther !== false) {
            answer = await ctx.ui.input(title, "Your answer", { signal });
          } else if (selected !== undefined) {
            const index = choices.indexOf(selected);
            // T3's question card can also return a directly entered answer.
            answer = index < 0 ? selected : options[index]!.label;
          }
        }
        signal?.throwIfAborted();
        if (answer === undefined) return result(true);
        answers[question.id] = { answers: [answer] };
      }
      return result(false);
    },
  });
}
