import type { AST } from "@vcltk/ast";
import { parse } from "@vcltk/parser";
import type { Parser } from "prettier";

export const parser = {
	parse(text, _options) {
		return parse(text);
	},
	astFormat: "fastly-vcl-ast",
	locStart(node) {
		return node?.span.start.index ?? 0;
	},
	locEnd(node) {
		return node?.span.end.index ?? 0;
	},
} as const satisfies Parser<AST | undefined>;
