import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { fuzzyFilter, Key, matchesKey, truncateToWidth } from "@earendil-works/pi-tui";

type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";

const THINKING_LEVELS: ThinkingLevel[] = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
];

function modelLabel(ctx: { model?: { provider: string; id: string } }): string {
	return ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "current model";
}

async function fuzzySelectThinkingLevel(ctx: ExtensionContext, current: ThinkingLevel): Promise<ThinkingLevel | null> {
	return await ctx.ui.custom<ThinkingLevel | null>((tui, theme, _keybindings, done) => {
		let query = "";
		let selectedIndex = Math.max(0, THINKING_LEVELS.indexOf(current));

		const getMatches = (): ThinkingLevel[] => {
			return query.trim()
				? fuzzyFilter(THINKING_LEVELS, query.trim(), (level) => level)
				: THINKING_LEVELS;
		};

		const clampSelection = (): void => {
			const matches = getMatches();
			selectedIndex = Math.max(0, Math.min(selectedIndex, matches.length - 1));
		};

		return {
			render(width: number): string[] {
				const matches = getMatches();
				const lines = [
					truncateToWidth(theme.fg("accent", theme.bold(`Thinking level for ${modelLabel(ctx)}`)), width),
					truncateToWidth(
						`Filter: ${query || theme.fg("dim", "type to fuzzy search")}`,
						width,
					),
					"",
				];

				if (matches.length === 0) {
					lines.push(truncateToWidth(theme.fg("warning", "No matching thinking levels"), width));
				} else {
					for (const [index, level] of matches.entries()) {
						const selected = index === selectedIndex;
						const suffix = level === current ? " (current)" : "";
						const text = `${selected ? "→" : " "} ${level}${suffix}`;
						lines.push(truncateToWidth(selected ? theme.fg("accent", text) : text, width));
					}
				}

				lines.push("", truncateToWidth(theme.fg("dim", "type to filter • ↑↓ select • enter apply • esc cancel"), width));
				return lines;
			},
			invalidate() {},
			handleInput(data: string): void {
				const matches = getMatches();

				if (matchesKey(data, Key.up)) {
					selectedIndex = selectedIndex === 0 ? Math.max(0, matches.length - 1) : selectedIndex - 1;
				} else if (matchesKey(data, Key.down)) {
					selectedIndex = selectedIndex >= matches.length - 1 ? 0 : selectedIndex + 1;
				} else if (matchesKey(data, Key.enter)) {
					done(matches[selectedIndex] ?? null);
					return;
				} else if (matchesKey(data, Key.escape) || matchesKey(data, Key.ctrl("c"))) {
					done(null);
					return;
				} else if (matchesKey(data, Key.backspace)) {
					query = query.slice(0, -1);
					selectedIndex = 0;
				} else if (matchesKey(data, Key.ctrl("u"))) {
					query = "";
					selectedIndex = 0;
				} else if (data.length === 1 && data >= " " && data !== "\x7f") {
					query += data;
					selectedIndex = 0;
				}

				clampSelection();
				tui.requestRender();
			},
		};
	});
}

async function selectThinkingLevel(pi: ExtensionAPI, ctx: ExtensionContext): Promise<void> {
	const current = pi.getThinkingLevel() as ThinkingLevel;
	const requested = await fuzzySelectThinkingLevel(ctx, current);

	if (!requested) return;

	pi.setThinkingLevel(requested);
	const applied = pi.getThinkingLevel();

	if (applied === requested) {
		ctx.ui.notify(`Thinking level set to ${applied}`, "info");
	} else {
		ctx.ui.notify(
			`Thinking level set to ${applied} (${requested} is not available for this model)`,
			"warning",
		);
	}
}

export default function (pi: ExtensionAPI): void {
	pi.registerCommand("thinking", {
		description: "Select the current model's thinking level",
		handler: async (_args, ctx) => {
			await selectThinkingLevel(pi, ctx);
		},
	});

	pi.registerShortcut("ctrl+e", {
		description: "Select thinking level",
		handler: async (ctx) => {
			await selectThinkingLevel(pi, ctx);
		},
	});

	pi.on("thinking_level_select", async (_event, ctx) => {
		ctx.ui.setStatus("thinking-level", `thinking: ${pi.getThinkingLevel()}`);
	});

	pi.on("session_start", async (_event, ctx) => {
		ctx.ui.setStatus("thinking-level", `thinking: ${pi.getThinkingLevel()}`);
	});
}
