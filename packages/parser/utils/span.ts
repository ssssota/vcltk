import type { LOC, Span } from "@vcltk/ast";

export function getSpan(text: string, start: number, end: number): Span {
	return { start: getLOC(text, start), end: getLOC(text, end) };
}

export function getLOC(text: string, index: number): LOC {
	const lines = text.slice(0, index).split("\n");
	return { line: lines.length - 1, column: lines.pop()?.length ?? 0, index };
}
