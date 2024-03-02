import type { AssignmentOperator } from "./assignment_operator.ts";
import type { Node } from "./base.ts";
import { Expression } from "./expression.ts";
import type { Type } from "./type.ts";
import type { Variable } from "./variable.ts";

// deno-lint-ignore no-namespace
export namespace Stmt {
  export type If = Node<"if", {
    condition: Expression;
    body: Stmt[];
    else?: Else;
  }>;
  export type Else =
    | Node<"elseif", { condition: Expression; body: Stmt[]; else?: Else }>
    | Node<"else", { body: Stmt[] }>;
  export type Set = Node<"set", {
    target: Variable;
    operator: AssignmentOperator;
    value: Expression;
  }>;
  export type Unset = Node<"unset", { target: Variable }>;
  export type Add = Node<"add", { target: Variable; value: Expression }>;
  export type Call = Node<"call", { target: Variable }>;
  export type Declare = Node<"declare", { target: Variable; type: Type }>;
  export type Error = Node<"error", {
    status?: Expression;
    message?: Expression;
  }>;
  export type Esi = Node<"esi">;
  export type Include = Node<"include", { path: string }>;
  export type Log = Node<"log", { message: Expression }>;
  export type Restart = Node<"restart">;
  export type Return = Node<"return", { value?: Expression }>;
  export type Synthetic = Node<"synthetic", {
    value: Expression;
    base64: boolean;
  }>;
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
  | Stmt.Synthetic;
