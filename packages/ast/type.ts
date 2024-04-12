import type { Node } from "./base.js";

// deno-lint-ignore no-namespace
export namespace Type {
	export type Acl = Node<"ACL">;
	export type Backend = Node<"BACKEND">;
	export type Bool = Node<"BOOL">;
	export type Float = Node<"FLOAT">;
	export type ID = Node<"ID">;
	export type Integer = Node<"INTEGER">;
	export type IP = Node<"IP">;
	export type RTime = Node<"RTIME">;
	export type String = Node<"STRING">;
	export type Time = Node<"TIME">;
	export type Void = Node<"VOID">;
	export type Unknown = Node<"UNKNOWN", { value: string }>;
}

export type Type =
	| Type.Acl
	| Type.Backend
	| Type.Bool
	| Type.Float
	| Type.ID
	| Type.Integer
	| Type.IP
	| Type.RTime
	| Type.String
	| Type.Time
	| Type.Void
	| Type.Unknown;
