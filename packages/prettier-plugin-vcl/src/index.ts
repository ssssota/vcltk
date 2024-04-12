import type { Plugin } from "prettier";
import { languages } from "./languages.js";
import { parser } from "./parser.js";
import { printer } from "./printer.js";
import type { FastlyVclNode } from "./types.js";

export const plugin: Plugin<FastlyVclNode | undefined> = {
	languages,
	parsers: { "fastly-vcl": parser },
	printers: { "fastly-vcl-ast": printer },
};

export { languages, parser, printer };
