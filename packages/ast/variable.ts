import type { Node } from "./base.js";

export type Variable = Node<
	"variable",
	{ name: string; properties: string[]; subField?: string }
>;
