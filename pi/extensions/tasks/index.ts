import type { ExtensionAPI, ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";
import { Text, truncateToWidth } from "@earendil-works/pi-tui";
import { Type, type Static } from "typebox";
import { Value } from "typebox/value";

const TaskSchema = Type.Object({
  step: Type.String({ minLength: 1, maxLength: 300 }),
  status: Type.Union([Type.Literal("pending"), Type.Literal("in_progress"), Type.Literal("completed")]),
});
const PlanSchema = Type.Array(TaskSchema, { maxItems: 50 });
const StateSchema = Type.Object({ plan: PlanSchema });
type Task = Static<typeof TaskSchema>;
const Parameters = Type.Object({
  explanation: Type.Optional(Type.String({ maxLength: 1000, description: "Why the plan changed." })),
  plan: Type.Optional(PlanSchema),
});

function validatePlan(plan: Task[]): void {
  if (plan.some((task) => !task.step.trim() || /[\x00-\x1f\x7f-\x9f]/u.test(task.step))) {
    throw new Error("Steps must be nonblank, single-line text without terminal control characters.");
  }
  if (plan.filter((task) => task.status === "in_progress").length > 1) {
    throw new Error("Only one step may be in_progress at a time.");
  }
}

function summary(plan: Task[]): string {
  const done = plan.filter((task) => task.status === "completed").length;
  const current = plan.find((task) => task.status === "in_progress") ?? plan.find((task) => task.status === "pending");
  return `${done}/${plan.length} completed${current ? ` · ${current.step}` : " · All tasks complete"}`;
}

function taskLine(task: Task, theme: Theme): string {
  switch (task.status) {
    case "completed": return theme.fg("success", "✓") + " " + theme.fg("dim", task.step);
    case "in_progress": return theme.fg("accent", "◉ " + theme.bold(task.step));
    case "pending": return theme.fg("muted", "○ " + task.step);
  }
}

export default function tasks(pi: ExtensionAPI) {
  let plan: Task[] = [];
  let collapsed = false;

  function refresh(ctx: ExtensionContext): void {
    if (ctx.mode !== "tui") return;
    if (!plan.length) {
      ctx.ui.setWidget("spellbook-tasks", undefined);
      return;
    }
    ctx.ui.setWidget("spellbook-tasks", (_tui, theme) => ({
      render(width: number) {
        const heading = theme.fg("accent", "Tasks ") + summary(plan) + theme.fg("dim", `  /tasks ${collapsed ? "▸" : "▾"}`);
        const lines = [heading];
        if (!collapsed) {
          // Keep the active step visible without letting a long plan consume the terminal.
          const active = plan.findIndex((task) => task.status === "in_progress");
          const next = plan.findIndex((task) => task.status === "pending");
          const focus = active >= 0 ? active : next >= 0 ? next : plan.length - 1;
          const start = Math.max(0, Math.min(focus - 2, plan.length - 5));
          if (start > 0) lines.push(theme.fg("dim", `  … ${start} earlier`));
          lines.push(...plan.slice(start, start + 5).map((task) => "  " + taskLine(task, theme)));
          const remaining = plan.length - start - 5;
          if (remaining > 0) lines.push(theme.fg("dim", `  … ${remaining} more`));
        }
        return lines.map((line) => truncateToWidth(line, width));
      },
      invalidate() {},
    }), { placement: "aboveEditor" });
  }

  function restore(ctx: ExtensionContext): void {
    plan = [];
    for (const entry of ctx.sessionManager.getBranch()) {
      if (entry.type !== "message" || entry.message.role !== "toolResult" ||
          entry.message.toolName !== "update_plan" || entry.message.isError) continue;
      const details: unknown = entry.message.details;
      if (!Value.Check(StateSchema, details)) continue;
      try {
        validatePlan(details.plan);
        plan = details.plan.map((task) => ({ ...task }));
      } catch {
        // Ignore invalid snapshots from old or externally edited sessions.
      }
    }
    refresh(ctx);
  }

  pi.on("session_start", async (_event, ctx) => restore(ctx));
  pi.on("session_tree", async (_event, ctx) => restore(ctx));

  pi.registerTool({
    name: "update_plan",
    label: "Tasks",
    description: "Track a multi-step task plan shown above the editor. Supply the complete ordered plan to replace it; omit plan to read it. Statuses: pending, in_progress, completed. At most one step may be in_progress. Use an empty plan to clear it. This tracks progress; it does not execute tasks.",
    promptGuidelines: [
      "Use update_plan for work with several meaningful steps, not trivial single-step requests. Keep it current as work progresses, marking completed steps and the current in_progress step. Do not mark unverified work completed.",
    ],
    parameters: Parameters,
    outputSchema: StateSchema,
    executionMode: "sequential",
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async execute(_id, params, signal, _onUpdate, ctx) {
      signal?.throwIfAborted();
      if (params.plan !== undefined) {
        validatePlan(params.plan);
        plan = params.plan.map((task) => ({ ...task, step: task.step.trim() }));
      }
      refresh(ctx);
      const snapshot = { plan: plan.map((task) => ({ ...task })) };
      return {
        content: [{ type: "text", text: plan.length
          ? `${summary(plan)}\n${plan.map((task) => `[${task.status}] ${task.step}`).join("\n")}`
          : "No tasks." }],
        details: snapshot,
        structuredContent: snapshot,
      };
    },
    renderCall(_args, theme) {
      return new Text(theme.fg("toolTitle", theme.bold("Tasks")), 0, 0);
    },
    renderResult(result, { expanded }, theme) {
      if (!Value.Check(StateSchema, result.details)) {
        return new Text(result.content.filter((item) => item.type === "text").map((item) => item.text).join("\n"), 0, 0);
      }
      const tasks = result.details.plan;
      const text = tasks.length ? summary(tasks) : "No tasks.";
      return new Text(expanded ? [text, ...tasks.map((task) => taskLine(task, theme))].join("\n") : text, 0, 0);
    },
  });

  pi.registerCommand("tasks", {
    description: "Collapse or expand the task widget (use /tasks list to show every step)",
    async handler(args, ctx) {
      if (args.trim() === "list") {
        ctx.ui.notify(plan.length ? plan.map((task) => `[${task.status}] ${task.step}`).join("\n") : "No tasks.", "info");
        return;
      }
      if (ctx.mode !== "tui") {
        ctx.ui.notify("The task widget requires terminal mode. Use /tasks list or update_plan to read the plan.", "info");
        return;
      }
      collapsed = !collapsed;
      refresh(ctx);
      if (!plan.length) ctx.ui.notify("No tasks yet. The agent can create a plan with update_plan.", "info");
    },
  });
}
