import type { AST } from "@vcltk/ast";
import type { Plugin } from "prettier";
import { language } from "./languages.js";
import { parser } from "./parser.js";
import { printer } from "./printer.js";

const plugin = {
	languages: [language],
	parsers: { [language.parsers[0]]: parser },
	printers: { [parser.astFormat]: printer },
} as const satisfies Plugin<AST | undefined>;

export { language, parser, printer, plugin };
export default plugin;
