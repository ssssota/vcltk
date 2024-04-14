import type { AssignmentOperator } from "./assignment_operator.js";
import type { Node } from "./base.js";
import type { Expr } from "./expr.js";
import type { Literal } from "./literal.js";
import type { StringToken } from "./string_token.js";
import type { Type } from "./type.js";
import type { Variable } from "./variable.js";

export type ReturnStateKind =
	| "lookup"
	| "pass"
	| "error"
	| "restart"
	| "upgrade"
	| "hash"
	| "deliver"
	| "fetch"
	| "deliver_stale";

export type Case = Node<"case", { expr: Expr; fallthrough: boolean }>;

export namespace Stmt {
	export type If = Node<
		"if",
		{ condition: Expr; body: Block; else?: If | Block }
	>;
	export type Switch = Node<"switch", { value: Expr; cases: Case[] }>;
	export type Set = Node<
		"set",
		{ target: Variable; operator: AssignmentOperator; value: Expr }
	>;
	export type Unset = Node<"unset", { target: Variable }>;
	export type Add = Node<"add", { target: Variable; value: Expr }>;
	export type Call = Node<"call", { target: Variable }>;
	export type Declare = Node<"declare", { target: Variable; type: Type }>;
	export type Error = Node<
		"error",
		{ status?: number; message?: Literal.String }
	>;
	export type Esi = Node<"esi">;
	export type Include = Node<"include", { path: StringToken }>;
	export type Log = Node<"log", { message: Expr }>;
	export type Restart = Node<"restart">;
	export type Return = Node<"return", { value?: Expr }>;
	export type ReturnState = Node<"return-state", { state: ReturnStateKind }>;
	export type Synthetic = Node<"synthetic", { value: Expr; base64: boolean }>;
	export type Block = Node<"block", { body: Stmt[] }>;
	export type Label = Node<"label", { name: string }>;
	export type Goto = Node<"goto", { label: string }>;
}

export type Stmt =
	| Stmt.If
	| Stmt.Set
	| Stmt.Unset
	| Stmt.Add
	| Stmt.Call
	| Stmt.Declare
	| Stmt.Error
	| Stmt.Esi
	| Stmt.Include
	| Stmt.Log
	| Stmt.Restart
	| Stmt.Return
	| Stmt.ReturnState
	| Stmt.Synthetic
	| Stmt.Block
	| Stmt.Label
	| Stmt.Goto;
