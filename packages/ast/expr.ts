import type { Node } from "./base.js";
import type { BinaryOperator } from "./binary_operator.js";
import type { Literal } from "./literal.js";
import type { UnaryOperator } from "./unary_operator.js";
import type { Variable } from "./variable.js";

// deno-lint-ignore no-namespace
export namespace Expr {
	export type Call = Node<
		"call",
		{
			target: Variable;
			arguments: Expr[];
		}
	>;
	export type Binary = Node<
		"binary",
		{
			lhs: Expr;
			operator: BinaryOperator;
			rhs: Expr;
		}
	>;
	export type Unary = Node<
		"unary",
		{
			operator: UnaryOperator;
			rhs: Expr;
		}
	>;
	export type StringConcat = Node<
		"string_concat",
		{
			tokens: Expr[];
		}
	>;
}

export type Expr =
	| Expr.Binary
	| Expr.Unary
	| Expr.Call
	| Expr.StringConcat
	| Variable
	| Literal;
