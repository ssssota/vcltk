import type { Node } from "./base.js";
import type { Literal, ObjectProperty } from "./literal.js";
import type { Stmt } from "./stmt.js";
import type { StringToken } from "./string_token.js";
import type { Type } from "./type.js";
import type { Variable } from "./variable.js";

export type AclEntry = Node<
	"acl-entry",
	{ negated: boolean; address: StringToken; cidr: number }
>;

export type TableEntry = Node<
	"table-entry",
	{ key: Literal.String; value: Variable | Literal }
>;

export namespace Declaration {
	export type IncludeDeclaration = Node<"include", { path: StringToken }>;
	export type ImportDeclaration = Node<"import", { ident: string }>;
	export type SubroutineDeclaration = Node<
		"sub",
		{ name: string; returnType?: Type; body: Stmt.Block }
	>;
	export type AclDeclaration = Node<
		"acl",
		{ name: string; entries: AclEntry[] }
	>;
	export type BackendDeclaration = Node<
		"backend",
		{ name: string; properties: ObjectProperty[] }
	>;
	export type DirectorDeclaration = Node<
		"director",
		{
			name: string;
			type: "random" | "fallback" | "content" | "client" | "consistent_hashing";
			properties: ObjectProperty[];
			directions: Literal.Object[];
		}
	>;
	export type PenaltyboxDeclaration = Node<"penaltybox", { name: string }>;
	export type RatecounterDeclaration = Node<"ratecounter", { name: string }>;
	export type TableDeclaration = Node<
		"table",
		{ name: string; type?: Type; entries: TableEntry[] }
	>;
}

export type Declaration =
	| Declaration.IncludeDeclaration
	| Declaration.ImportDeclaration
	| Declaration.SubroutineDeclaration
	| Declaration.AclDeclaration
	| Declaration.BackendDeclaration
	| Declaration.DirectorDeclaration
	| Declaration.PenaltyboxDeclaration
	| Declaration.RatecounterDeclaration
	| Declaration.TableDeclaration;
