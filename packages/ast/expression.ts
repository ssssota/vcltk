import type { Node } from "./base.ts";
import type { BinaryOperator } from "./binary_operator.ts";
import type { Literal } from "./literal.ts";
import type { UnaryOperator } from "./unary_operator.ts";
import type { Variable } from "./variable.ts";

// deno-lint-ignore no-namespace
export namespace Expression {
  export type Call = Node<"call", {
    target: Variable;
    arguments: Expression[];
  }>;
  export type Binary = Node<"binary", {
    lhs: Expression;
    operator: BinaryOperator;
    rhs: Expression;
  }>;
  export type Unary = Node<"unary", {
    operator: UnaryOperator;
    rhs: Expression;
  }>;
}

export type Expression =
  | Expression.Binary
  | Expression.Unary
  | Expression.Call
  | Variable
  | Literal;
