import type { Node } from "./base.ts";

// deno-lint-ignore no-namespace
export namespace BinaryOperator {
  export type Eq = Node<"==">;
  export type Ne = Node<"!=">;
  export type Lt = Node<"<">;
  export type Le = Node<"<=">;
  export type Gt = Node<">">;
  export type Ge = Node<">=">;
  export type AmpAmp = Node<"&&">;
  export type BarBar = Node<"||">;
  export type Add = Node<"+">;
  export type Sub = Node<"-">;
  export type Mul = Node<"*">;
  export type Div = Node<"/">;
  export type Tilde = Node<"~">;
  export type NotTilde = Node<"!~">;
}

export type BinaryOperator =
  | BinaryOperator.Eq
  | BinaryOperator.Ne
  | BinaryOperator.Lt
  | BinaryOperator.Le
  | BinaryOperator.Gt
  | BinaryOperator.Ge
  | BinaryOperator.AmpAmp
  | BinaryOperator.BarBar
  | BinaryOperator.Add
  | BinaryOperator.Sub
  | BinaryOperator.Mul
  | BinaryOperator.Div
  | BinaryOperator.Tilde
  | BinaryOperator.NotTilde;
