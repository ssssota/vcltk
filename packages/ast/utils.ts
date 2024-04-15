import type { AssignmentOperator } from "./assignment_operator.js";
import type { Node, VisitorKey } from "./base.js";
import type { BinaryOperator } from "./binary_operator.js";
import type { Comment } from "./comment.js";
import type { AclEntry, Declaration, TableEntry } from "./declaration.js";
import type { Expr } from "./expr.js";
import type { Literal, ObjectProperty } from "./literal.js";
import type { Case, Stmt } from "./stmt.js";
import type { StringToken } from "./string_token.js";
import type { Type } from "./type.js";
import type { UnaryOperator } from "./unary_operator.js";
import type { Variable } from "./variable.js";
import type { VCL } from "./vcl.js";

export type AST =
	| AssignmentOperator
	| BinaryOperator
	| Comment
	| AclEntry
	| Declaration
	| TableEntry
	| Expr
	| Literal
	| ObjectProperty
	| Case
	| Stmt
	| StringToken
	| Type
	| UnaryOperator
	| Variable
	| VCL extends infer T
	? T extends Node<string>
		? T
		: never
	: never;

export type VisitorKeyMap = { [K in AST as K["kind"]]: VisitorKey<K> };
