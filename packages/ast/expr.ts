import type { Node } from "./base.js";
import type { BinaryOperator } from "./binary_operator.js";
import type { Literal } from "./literal.js";
import type { UnaryOperator } from "./unary_operator.js";
import type { Variable } from "./variable.js";

export namespace Expr {
	export type FunctionCall = Node<
		"function-call",
		{ target: Variable; arguments: Expr[] }
	>;
	export type Binary = Node<
		"binary",
		{ lhs: Expr; operator: BinaryOperator; rhs: Expr }
	>;
	export type Unary = Node<"unary", { operator: UnaryOperator; rhs: Expr }>;
	export type StringConcat = Node<"string_concat", { tokens: Expr[] }>;
	export type Parenthesized = Node<"parenthesized", { expr: Expr }>;
}

export type Expr =
	| Expr.Binary
	| Expr.Unary
	| Expr.FunctionCall
	| Expr.StringConcat
	| Expr.Parenthesized
	| Variable
	| Literal;
