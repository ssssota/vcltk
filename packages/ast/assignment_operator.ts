import { Node } from "./base.ts";

// deno-lint-ignore no-namespace
export namespace AssignmentOperator {
  export type Set = Node<"=">;
  export type Add = Node<"+=">;
  export type Sub = Node<"-=">;
  export type Mul = Node<"*=">;
  export type Div = Node<"/=">;
  export type Mod = Node<"%=">;
  export type BitAnd = Node<"&=">;
  export type BitOr = Node<"|=">;
  export type BitXor = Node<"^=">;
  export type LShift = Node<"<<=">;
  export type RShift = Node<">>=">;
  export type Ror = Node<"ror=">;
  export type Rol = Node<"rol=">;
  export type LogicalAnd = Node<"&&=">;
  export type LogicalOr = Node<"||=">;
}

export type AssignmentOperator =
  | AssignmentOperator.Set
  | AssignmentOperator.Add
  | AssignmentOperator.Sub
  | AssignmentOperator.Mul
  | AssignmentOperator.Div
  | AssignmentOperator.Mod
  | AssignmentOperator.BitAnd
  | AssignmentOperator.BitOr
  | AssignmentOperator.BitXor
  | AssignmentOperator.LShift
  | AssignmentOperator.RShift
  | AssignmentOperator.Ror
  | AssignmentOperator.Rol
  | AssignmentOperator.LogicalAnd
  | AssignmentOperator.LogicalOr;
