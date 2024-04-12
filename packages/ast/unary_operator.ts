import type { Node } from "./base.js";

export namespace UnaryOperator {
	export type Not = Node<"!">;
}

export type UnaryOperator = UnaryOperator.Not;
