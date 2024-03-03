import type { Node } from "./base.ts";
import type { BinaryOperator } from "./binary_operator.ts";
import type { Literal } from "./literal.ts";
import type { UnaryOperator } from "./unary_operator.ts";
import type { Variable } from "./variable.ts";

// deno-lint-ignore no-namespace
export namespace Expr {
  export type Call = Node<"call", {
    target: Variable;
    arguments: Expr[];
  }>;
  export type Binary = Node<"binary", {
    lhs: Expr;
    operator: BinaryOperator;
    rhs: Expr;
  }>;
  export type Unary = Node<"unary", {
    operator: UnaryOperator;
    rhs: Expr;
  }>;
}

export type Expr =
  | Expr.Binary
  | Expr.Unary
  | Expr.Call
  | Variable
  | Literal;
