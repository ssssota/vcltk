import type { Plugin } from "prettier";
import { language } from "./languages.js";
import { parser } from "./parser.js";
import { printer } from "./printer.js";
import type { FastlyVclNode } from "./types.js";

const plugin = {
	languages: [language],
	parsers: { [language.parsers[0]]: parser },
	printers: { [parser.astFormat]: printer },
} as const satisfies Plugin<FastlyVclNode | undefined>;

export { language, parser, printer, plugin };
export default plugin;
