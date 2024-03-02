import type { Node } from "./base.ts";
import type { DirectorType } from "./director_type.ts";
import type { Literal } from "./literal.ts";
import type { Stmt } from "./stmt.ts";
import type { Type } from "./type.ts";
import type { Variable } from "./variable.ts";

export type AclEntry = Node<"acl-entry", {
  negated: boolean;
  address: string;
  cidr: number;
}>;

export type TableEntry = Node<"table-entry", {
  key: Literal.String;
  value: Variable | Literal;
}>;

// deno-lint-ignore no-namespace
export namespace Declaration {
  export type IncludeDeclaration = Node<"include", { path: string }>;
  export type ImportDeclaration = Node<"import", { ident: string }>;
  export type SubroutineDeclaration = Node<"sub", {
    name: string;
    returnType: Type;
    body: Stmt[];
  }>;
  export type AclDeclaration = Node<"acl", {
    name: string;
    entries: AclEntry[];
  }>;
  export type BackendDeclaration = Node<"backend", {
    name: string;
    config: Record<string, Literal>;
  }>;
  export type DirectorDeclaration = Node<"director", {
    name: string;
    type: DirectorType;
    config?: Record<string, Literal>;
    directions: Literal.Object[];
  }>;
  export type PenaltyBoxDeclaration = Node<"penaltybox", { name: string }>;
  export type RateCounterDeclaration = Node<"ratecounter", { name: string }>;
  export type TableDeclaration = Node<"table", {
    name: string;
    type: Type;
    entries: TableEntry[];
  }>;
}

export type Declaration =
  | Declaration.IncludeDeclaration
  | Declaration.ImportDeclaration
  | Declaration.SubroutineDeclaration
  | Declaration.AclDeclaration
  | Declaration.BackendDeclaration
  | Declaration.DirectorDeclaration
  | Declaration.PenaltyBoxDeclaration
  | Declaration.RateCounterDeclaration
  | Declaration.TableDeclaration;
