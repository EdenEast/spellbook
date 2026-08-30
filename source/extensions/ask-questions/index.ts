import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { getAgentDir, SettingsManager } from "@earendil-works/pi-coding-agent";
import { truncateToWidth } from "@earendil-works/pi-tui";
import { Type } from "typebox";

type Question = {
	id: string;
	title: string;
	body: string;
	recommendedAnswer?: string;
};

type Answer = Question & { answer: string };

type ExternalEditResult =
	| { status: "complete"; content: string }
	| { status: "failed" };

function answerStart(id: string): string {
	return `<!-- pi-answer:${id}:start -->`;
}

function answerEnd(id: string): string {
	return `<!-- pi-answer:${id}:end -->`;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getExternalEditorCommand(ctx: ExtensionContext): string {
	return SettingsManager.create(ctx.cwd, getAgentDir()).getExternalEditorCommand();
}

async function editInExternalEditor(command: string, content: string): Promise<ExternalEditResult> {
	const directory = mkdtempSync(join(tmpdir(), "pi-ask-questions-"));
	const filePath = join(directory, "questions.md");

	try {
		writeFileSync(filePath, content, "utf-8");
		const [editor, ...editorArgs] = command.split(" ");

		process.stdout.write(`Launching external editor: ${command}\nPi will resume when the editor exits.\n`);

		const exitCode = await new Promise<number | null>((resolve) => {
			const child = spawn(editor || command, [...editorArgs, filePath], {
				stdio: "inherit",
				shell: process.platform === "win32",
			});

			child.on("error", () => resolve(null));
			child.on("close", (code) => resolve(code));
		});

		if (exitCode !== 0) {
			return { status: "failed" };
		}

		return {
			status: "complete",
			content: readFileSync(filePath, "utf-8").replace(/\n$/, ""),
		};
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
}

async function openExternalEditor(ctx: ExtensionContext, content: string): Promise<string | null> {
	const command = getExternalEditorCommand(ctx);

	return await ctx.ui.custom<string | null>((tui, theme, _keybindings, done) => {
		void (async () => {
			let edited: string | null = null;

			tui.stop();
			try {
				const result = await editInExternalEditor(command, content);
				edited = result.status === "complete" ? result.content : null;
			} finally {
				tui.start();
				tui.requestRender(true);
				done(edited);
			}
		})();

		return {
			render(width: number): string[] {
				return [truncateToWidth(theme.fg("accent", `Opening ${command}...`), width)];
			},
			invalidate() {},
		};
	});
}

function normalizeQuestions(questions: Question[]): Question[] {
	return questions.map((question, index) => ({
		id: question.id?.trim() || `Q${index + 1}`,
		title: question.title?.trim() || `Question ${index + 1}`,
		body: question.body?.trim() || question.title?.trim() || `Question ${index + 1}`,
		recommendedAnswer: question.recommendedAnswer?.trim() || undefined,
	}));
}

function buildQuestionTemplate(questions: Question[], title = "Answer questions"): string {
	const sections = questions.map((question) => {
		const recommended = question.recommendedAnswer
			? `\nRecommended answer:\n${question.recommendedAnswer}\n`
			: "";

		return `## ${question.id} - ${question.title}

Question:
${question.body}
${recommended}
Answer:
`;
	});

	return `# ${title}

Type each answer under its Answer: line. Save and quit to send the answers to pi.

${sections.join("\n\n---\n\n")}`;
}

function extractAnswerFromSection(content: string, question: Question): string {
	const start = answerStart(question.id);
	const end = answerEnd(question.id);
	const startIndex = content.indexOf(start);
	const endIndex = content.indexOf(end);

	if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
		return content.slice(startIndex + start.length, endIndex).trim();
	}

	const headingPattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(question.id)}\\s+-\\s+[^\\n]+\\n`, "m");
	const headingMatch = headingPattern.exec(content);
	if (!headingMatch || headingMatch.index === undefined) return "";

	const sectionStart = headingMatch.index + headingMatch[0].length;
	const sectionRemainder = content.slice(sectionStart);
	const nextSectionMatch = /\n---\n|\n##\s+/.exec(sectionRemainder);
	const section = nextSectionMatch === null
		? sectionRemainder
		: sectionRemainder.slice(0, nextSectionMatch.index);

	let answerStartIndex = -1;
	const answerLabelPattern = /(?:^|\n)Answer:[ \t]*(?:\n[ \t]*)?/g;
	let answerLabelMatch: RegExpExecArray | null;
	while ((answerLabelMatch = answerLabelPattern.exec(section)) !== null) {
		answerStartIndex = answerLabelMatch.index + answerLabelMatch[0].length;
	}

	if (answerStartIndex === -1) return "";

	return section.slice(answerStartIndex)
		.replace(/<!--\s*pi-answer:[^>]+-->/g, "")
		.trim();
}

function collectAnswers(content: string, questions: Question[]): Answer[] {
	return questions.map((question) => ({
		...question,
		answer: extractAnswerFromSection(content, question),
	}));
}

function formatAnswers(answers: Answer[]): string {
	return answers
		.map((answer) => `${answer.id} - ${answer.title}: ${answer.answer || "[no answer provided]"}`)
		.join("\n\n");
}

export default function (pi: ExtensionAPI): void {
	pi.registerTool({
		name: "ask_questions",
		label: "Ask questions",
		description: "Ask the user a structured round of questions in their external editor and return their answers.",
		promptGuidelines: [
			"Use ask_questions when a skill needs the user to answer several questions before continuing.",
			"Pass each question as structured data instead of printing a prose questionnaire for later parsing.",
		],
		parameters: Type.Object({
			title: Type.Optional(Type.String({ description: "Short title for the question round." })),
			questions: Type.Array(
				Type.Object({
					id: Type.String({ description: "Stable question id, for example Q1." }),
					title: Type.String({ description: "Short question title." }),
					body: Type.String({ description: "Full question body, including choices or context the user needs." }),
					recommendedAnswer: Type.Optional(Type.String({ description: "Your recommended answer and rationale." })),
				}),
				{ description: "Questions to ask in this round." },
			),
		}),
		executionMode: "sequential",
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			if (ctx.mode !== "tui") {
				return {
					content: [{ type: "text", text: "ask_questions requires interactive TUI mode. Ask the questions in ordinary Markdown instead." }],
					details: { status: "unavailable", reason: "not-tui" },
				};
			}

			const questions = normalizeQuestions(params.questions);
			if (questions.length === 0) {
				return {
					content: [{ type: "text", text: "No questions were provided." }],
					details: { status: "empty", answers: [] },
				};
			}

			const edited = await openExternalEditor(ctx, buildQuestionTemplate(questions, params.title));
			if (edited === null) {
				return {
					content: [{ type: "text", text: "The user cancelled the question editor or the editor failed. Stop and ask whether they want to try again." }],
					details: { status: "cancelled", answers: [] },
				};
			}

			const answers = collectAnswers(edited, questions);
			const answeredCount = answers.filter((answer) => answer.answer.trim()).length;
			const markdown = formatAnswers(answers);

			return {
				content: [{ type: "text", text: markdown || "No answers were provided." }],
				details: {
					status: "answered",
					answeredCount,
					questionCount: answers.length,
					answers,
				},
			};
		},
	});
}
