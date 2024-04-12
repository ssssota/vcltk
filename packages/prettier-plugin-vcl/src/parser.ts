import { parse } from "@vcltk/parser";
import type { Parser } from "prettier";
import type { FastlyVclNode } from "./types.js";

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
} as const satisfies Parser<FastlyVclNode | undefined>;
