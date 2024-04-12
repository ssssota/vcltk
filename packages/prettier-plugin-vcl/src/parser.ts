import { parse } from "@vcltk/parser";
import type { Parser } from "prettier";
import type { FastlyVclNode } from "./types.js";

export const parser: Parser<FastlyVclNode | undefined> = {
	parse(text, _options) {
		return parse(text);
	},
	astFormat: "fastly-vcl-ast",
	locEnd(_node) {
		return 0;
	},
	locStart(_node) {
		return 0;
	},
};
