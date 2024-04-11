import type { Node } from "./base.ts";
import { Variable } from "./variable.ts";

export type ObjectProperty = Node<"object-property", {
  key: string;
  value: Literal | Variable;
}>;

// deno-lint-ignore no-namespace
export namespace Literal {
  export type String = Node<"string", { tokens: string[] }>;
  export type Integer = Node<"integer", { value: bigint }>;
  export type Float = Node<"float", { value: number }>;
  export type Bool = Node<"bool", { value: boolean }>;
  export type RTime = Node<
    "rtime",
    { value: bigint | number; unit: "ms" | "s" | "m" | "h" | "d" | "y" }
  >;
  export type Object = Node<"object", { properties: ObjectProperty[] }>;
  // parcent literal is used in the director declaration
  export type Parcent = Node<"parcent", { value: bigint }>;
}

export type Literal =
  | Literal.String
  | Literal.Integer
  | Literal.Float
  | Literal.Bool
  | Literal.RTime
  | Literal.Parcent
  | Literal.Object;
