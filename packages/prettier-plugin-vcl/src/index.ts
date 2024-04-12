import type { Plugin } from "prettier";
import { language } from "./languages.js";
import { parser } from "./parser.js";
import { printer } from "./printer.js";
import type { FastlyVclNode } from "./types.js";

export const plugin: Plugin<FastlyVclNode | undefined> = {
	languages: [language],
	parsers: { [language.parsers[0]]: parser },
	printers: { [parser.astFormat]: printer },
};

export { language, parser, printer };
