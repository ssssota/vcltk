import type { AssignmentOperator } from "./assignment_operator.ts";
import type { Node } from "./base.ts";
import type { Expr } from "./expr.ts";
import { Literal } from "./literal.ts";
import type { Type } from "./type.ts";
import type { Variable } from "./variable.ts";

export type ReturnState =
  | "lookup"
  | "pass"
  | "error"
  | "restart"
  | "upgrade"
  | "hash"
  | "deliver"
  | "fetch"
  | "deliver_stale";

// deno-lint-ignore no-namespace
export namespace Stmt {
  export type If = Node<"if", {
    condition: Expr;
    body: Stmt[];
    else?: Else;
  }>;
  export type Else = If | Node<"else", { body: Stmt[] }>;
  export type Set = Node<"set", {
    target: Variable;
    operator: AssignmentOperator;
    value: Expr;
  }>;
  export type Unset = Node<"unset", { target: Variable }>;
  export type Add = Node<"add", { target: Variable; value: Expr }>;
  export type Call = Node<"call", { target: Variable }>;
  export type Declare = Node<"declare", { target: Variable; type: Type }>;
  export type Error = Node<"error", {
    status?: number;
    message?: Literal.String;
  }>;
  export type Esi = Node<"esi">;
  export type Include = Node<"include", { path: string }>;
  export type Log = Node<"log", { message: Expr }>;
  export type Restart = Node<"restart">;
  export type Return = Node<
    "return",
    { value?: Expr } | { state?: ReturnState }
  >;
  export type Synthetic = Node<"synthetic", {
    value: Expr;
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
