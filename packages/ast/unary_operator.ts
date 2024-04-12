import type { Node } from "./base.js";

// deno-lint-ignore no-namespace
export namespace UnaryOperator {
	export type Not = Node<"!">;
}

export type UnaryOperator = UnaryOperator.Not;
