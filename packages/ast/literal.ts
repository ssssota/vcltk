import type { Node } from "./base.ts";

export type ObjectProperty = Node<"object-property", {
  key: string;
  value: Literal;
}>;

// deno-lint-ignore no-namespace
export namespace Literal {
  export type String = Node<"string", { tokens: string[] }>;
  export type Integer = Node<"integer", { value: bigint }>;
  export type Float = Node<"float", { value: number }>;
  export type Bool = Node<"bool", { value: boolean }>;
  export type RTime = Node<"rtime", { ns: bigint }>;
  export type Object = Node<"object", { properties: ObjectProperty[] }>;
}

export type Literal =
  | Literal.String
  | Literal.Integer
  | Literal.Float
  | Literal.Bool
  | Literal.RTime
  | Literal.Object;
