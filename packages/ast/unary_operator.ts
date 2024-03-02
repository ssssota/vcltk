import type { Node } from "./base.ts";

// deno-lint-ignore no-namespace
export namespace UnaryOperator {
  export type Not = Node<"!">;
}

export type UnaryOperator = UnaryOperator.Not;
