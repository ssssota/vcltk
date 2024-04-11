import type {
  AclEntry,
  AssignmentOperator,
  BinaryOperator,
  Declaration,
  Expr,
  Literal,
  ObjectProperty,
  ReturnState,
  Stmt,
  TableEntry,
  Token,
  Type,
  UnaryOperator,
  Variable,
  VCL,
} from "./deps.ts";
import { tokenize } from "./deps.ts";
import { parseNumber } from "./utils/parse_number.ts";
import { unescape } from "./utils/unescape.ts";

/**
 * Parse Fastly VCL source code
 * @param input Fastly VCL source code
 * @returns AST
 */
export function parse(source: string): VCL {
  const tokens = tokenize(source);
  return new Parser(source, tokens).parse();
}

export class Parser {
  private cursor = 0;
  private _comments: string[] = [];
  get comments(): readonly string[] {
    return this._comments;
  }
  constructor(private source: string, private tokens: Token[]) {}

  parse(): VCL {
    return {
      kind: "vcl",
      declarations: this.parseDeclarations(),
      span: [0, this.source.length],
    };
  }

  private peekToken(): Token {
    return this.tokens[this.cursor];
  }

  private nextToken(): Token {
    return this.tokens[this.cursor++];
  }

  private skipWhitespacesAndComments() {
    let token = this.peekToken();
    while (
      token.kind === "ws" ||
      token.kind === "lf" ||
      token.kind === "comment"
    ) {
      if (token.kind === "comment") {
        this._comments.push(this.source.slice(token.start, token.end));
      }
      token = this.tokens[++this.cursor];
    }
  }

  private getSpanWithLastToken(start: number): [number, number] {
    return [start, this.tokens[this.cursor - 1].end];
  }

  parseDeclarations(): Declaration[] {
    const declarations: Declaration[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      if (this.peekToken().kind === "eof") break;
      declarations.push(this.parseDeclaration());
    }
    return declarations;
  }

  parseDeclaration(): Declaration {
    this.skipWhitespacesAndComments();
    const token = this.peekToken();
    Parser.assertToken(token, "keyword");

    switch (token.value) {
      case "acl":
        return this.parseAcl();
      case "backend":
        return this.parseBackend();
      case "director":
        return this.parseDirector();
      case "import":
        return this.parseImport();
      case "include":
        return this.parseInclude();
      case "penaltybox":
        return this.parsePenaltybox();
      case "ratecounter":
        return this.parseRatecounter();
      case "sub":
        return this.parseSubroutine();
      case "table":
        return this.parseTable();
    }

    throw new Error(`Unexpected token: ${token.kind}`);
  }

  parseAcl(): Declaration.AclDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // acl
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    this.skipWhitespacesAndComments();
    const entries = this.parseAclEntries();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "}");
    return {
      kind: "acl",
      name,
      entries,
      span: this.getSpanWithLastToken(start),
    };
  }

  parseBackend(): Declaration.BackendDeclaration {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "backend");
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    return {
      kind: "backend",
      name,
      properties: this.parseObjectProperties(),
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseDirector(): Declaration.DirectorDeclaration {
    this.skipWhitespacesAndComments();
    let token = this.nextToken();
    Parser.assertKeywordToken(token, "director");
    const start = token.start;
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    const type = this.parseIdentAsDirectorType();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    this.skipWhitespacesAndComments();
    const properties: ObjectProperty[] = [];
    const directions: Literal.Object[] = [];

    token = this.peekToken();
    while (this.cursor < this.tokens.length) {
      if (token.kind === "}" || token.kind === "{") break;
      if (token.kind === ".") {
        properties.push(this.parseObjectProperty());
        this.skipWhitespacesAndComments();
        Parser.assertToken(this.nextToken(), ";");
        this.skipWhitespacesAndComments();
        token = this.peekToken();
        continue;
      }
    }
    while (this.cursor < this.tokens.length) {
      if (token.kind === "}") {
        token = this.nextToken();
        break;
      }
      if (token.kind === "{") {
        directions.push(this.parseObjectLiteral());
        this.skipWhitespacesAndComments();
        token = this.peekToken();
        continue;
      }
    }
    return {
      kind: "director",
      name,
      type,
      properties,
      directions,
      span: this.getSpanWithLastToken(start),
    };
  }

  parseImport(): Declaration.ImportDeclaration {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "import");
    const ident = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "import",
      ident,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseInclude(): Declaration.IncludeDeclaration | Stmt.Include {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "include");
    const path = this.parseStringToken();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "include",
      path,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parsePenaltybox(): Declaration.PenaltyboxDeclaration {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "penaltybox");
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "}");
    return {
      kind: "penaltybox",
      name,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseRatecounter(): Declaration.RatecounterDeclaration {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "ratecounter");
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "}");
    return {
      kind: "ratecounter",
      name,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseSubroutine(): Declaration.SubroutineDeclaration {
    this.skipWhitespacesAndComments();
    let token = this.nextToken();
    Parser.assertKeywordToken(token, "sub");
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    token = this.peekToken();
    const returnType = token.kind === "keyword"
      ? this.parseIdentAsType()
      : undefined;
    this.skipWhitespacesAndComments();
    const body = this.parseBlock();
    return {
      kind: "sub",
      name,
      returnType,
      body,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseTable(): Declaration.TableDeclaration {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "table");
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    const type = this.peekToken().kind === "keyword"
      ? this.parseIdentAsType()
      : undefined;
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    const entries = this.parseTableEntries();
    return {
      kind: "table",
      name,
      type,
      entries,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseIdent(): string {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertToken(token, "keyword");
    return token.value;
  }

  parseIdentAsVariable(): Variable {
    this.skipWhitespacesAndComments();
    const token = this.peekToken();
    const [variable, subField] = this.parseIdent().split(":");
    const [name, ...properties] = variable.split(".");
    return {
      kind: "variable",
      name,
      properties,
      subField,
      span: [token.start, token.end],
    };
  }

  parseIdentAsExpr(): Expr.Call | Variable {
    const variable = this.parseIdentAsVariable();
    this.skipWhitespacesAndComments();
    const token = this.peekToken();
    if (token.kind === "(") {
      return {
        kind: "call",
        target: variable,
        arguments: this.parseArguments(),
        span: [variable.span[0], this.tokens[this.cursor - 1].end],
      };
    }
    return variable;
  }

  parseIdentAsType(): Type {
    this.skipWhitespacesAndComments();
    const token = this.peekToken();
    const span: Type["span"] = [token.start, token.end];
    const ident = this.parseIdent();
    switch (ident) {
      case "ACL":
      case "BACKEND":
      case "BOOL":
      case "FLOAT":
      case "ID":
      case "INTEGER":
      case "IP":
      case "RTIME":
      case "STRING":
      case "TIME":
      case "VOID":
        return { kind: ident, span };
    }
    return { kind: "UNKNOWN", span, value: ident };
  }

  parseIdentAsDirectorType(): Declaration.DirectorDeclaration["type"] {
    this.skipWhitespacesAndComments();
    const ident = this.parseIdent();
    switch (ident) {
      case "random":
        return "random";
      case "fallback":
        return "fallback";
      case "hash":
        return "content";
      case "client":
        return "client";
      case "chash":
        return "consistent_hashing";
    }
    throw new Error(`Unexpected director type: ${ident}`);
  }

  parseIdentAsReturnState(): ReturnState {
    this.skipWhitespacesAndComments();
    const ident = this.parseIdent();
    switch (ident) {
      case "lookup":
      case "pass":
      case "error":
      case "restart":
      case "upgrade":
      case "hash":
      case "deliver":
      case "fetch":
      case "deliver_stale":
        return ident;
    }
    throw new Error(`Unexpected return state: ${ident}`);
  }

  parseAclEntries(): AclEntry[] {
    const entries: AclEntry[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      if (this.peekToken().kind === "}") break;
      entries.push(this.parseAclEntry());
      this.skipWhitespacesAndComments();
      const token = this.nextToken();
      if (token.kind === "}") break;
      Parser.assertToken(token, ";");
    }
    return entries;
  }

  parseAclEntry(): AclEntry {
    this.skipWhitespacesAndComments();
    let token = this.peekToken();
    const start = token.start;
    let negated = false;
    let cidr = 0;
    if (token.kind === "!") {
      negated = true;
      this.cursor++;
      this.skipWhitespacesAndComments();
      token = this.peekToken();
    }
    const address = this.parseStringToken();
    this.skipWhitespacesAndComments();
    token = this.peekToken();
    if (token.kind === "/") {
      this.cursor++;
      this.skipWhitespacesAndComments();
      cidr = Number(this.parseNumber());
    }
    return {
      kind: "acl-entry",
      negated,
      address,
      cidr,
      span: this.getSpanWithLastToken(start),
    };
  }

  parseTableEntries(): TableEntry[] {
    const entries: TableEntry[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      if (this.peekToken().kind === "}") {
        this.cursor++;
        break;
      }
      entries.push(this.parseTableEntry());
      this.skipWhitespacesAndComments();
      const token = this.nextToken();
      if (token.kind === "}") break;
      Parser.assertToken(token, ",");
    }
    return entries;
  }

  parseTableEntry(): TableEntry {
    this.skipWhitespacesAndComments();
    const key = this.parseStringLiteral();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ":");
    this.skipWhitespacesAndComments();
    const valueToken = this.peekToken();
    const value = valueToken.kind === "keyword"
      ? this.parseIdentAsVariable()
      : this.parseLiteral();
    return {
      kind: "table-entry",
      key,
      value,
      span: [key.span[0], value.span[1]],
    };
  }

  parseBlock(): Stmt[] {
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "{");
    const body = this.parseStatements();
    Parser.assertToken(this.nextToken(), "}");
    return body;
  }

  parseStatements(): Stmt[] {
    const statements: Stmt[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      const token = this.peekToken();
      if (token.kind === "}") break;
      Parser.assertToken(token, "keyword");
      switch (token.value) {
        case "if":
          statements.push(this.parseIf());
          break;
        case "set":
          statements.push(this.parseSet());
          break;
        case "unset":
          statements.push(this.parseUnset(false));
          break;
        case "remove":
          statements.push(this.parseUnset(true));
          break;
        case "add":
          statements.push(this.parseAdd());
          break;
        case "call":
          statements.push(this.parseCall());
          break;
        case "declare":
          statements.push(this.parseDeclare());
          break;
        case "error":
          statements.push(this.parseError());
          break;
        case "esi":
          statements.push(this.parseError());
          break;
        case "include":
          statements.push(this.parseInclude());
          break;
        case "log":
          statements.push(this.parseLog());
          break;
        case "restart":
          statements.push(this.parseRestart());
          break;
        case "return":
        case "synthetic":
          statements.push(this.parseSynthetic(false));
          break;
        case "synthetic.base64":
          statements.push(this.parseSynthetic(true));
          break;
      }
    }
    return statements;
  }

  parseIf(): Stmt.If {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // if
    return this.parseIfConditionAndBody(start);
  }

  parseIfConditionAndBody(start: number): Stmt.If {
    const condition = this.parseIfCondition();
    const body = this.parseBlock();
    this.skipWhitespacesAndComments();
    let token = this.peekToken();
    Parser.assertToken(token, "keyword");
    switch (token.value) {
      case "else":
        this.cursor++;
        this.skipWhitespacesAndComments();
        token = this.peekToken();
        if (token.kind === "{") {
          return {
            kind: "if",
            condition,
            body,
            else: {
              kind: "else",
              body: this.parseBlock(),
              span: this.getSpanWithLastToken(token.start),
            },
            span: this.getSpanWithLastToken(start),
          };
        }
        Parser.assertKeywordToken(token, "if");
        this.cursor++;
      /* falls through */
      case "elsif":
      case "elseif": {
        this.skipWhitespacesAndComments();
        return {
          kind: "if",
          condition,
          body,
          else: this.parseIfConditionAndBody(token.start),
          span: this.getSpanWithLastToken(start),
        };
      }
    }
    return {
      kind: "if",
      condition,
      body,
      span: this.getSpanWithLastToken(start),
    };
  }

  parseIfCondition(): Expr {
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "(");
    const condition = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ")");
    return condition;
  }

  parseAdd(): Stmt.Add {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "add");
    const target = this.parseIdentAsVariable();
    const value = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "add",
      target,
      value,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseCall(): Stmt.Call {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "call");
    const target = this.parseIdentAsVariable();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "call",
      target,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseDeclare(): Stmt.Declare {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "declare");
    const scope = this.parseIdent();
    if (scope !== "local") {
      throw new Error(`Expected local, got ${scope} (variable scope)`);
    }
    const target = this.parseIdentAsVariable();
    const type = this.parseIdentAsType();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "declare",
      target,
      type,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseError(): Stmt.Error {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "error");
    this.skipWhitespacesAndComments();
    let status = undefined;
    let message = undefined;
    if (this.peekToken().kind === "number") {
      status = Number(this.parseNumber());
      this.skipWhitespacesAndComments();
    }
    if (this.peekToken().kind === "string") {
      message = this.parseStringLiteral();
      this.skipWhitespacesAndComments();
    }
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "error",
      status,
      message,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseEsi(): Stmt.Esi {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "esi");
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "esi",
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseLog(): Stmt.Log {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "log");
    const message = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "log",
      message,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseRestart(): Stmt.Restart {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "restart");
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "restart",
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseSet(): Stmt.Set {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, "set");
    const target = this.parseIdentAsVariable();
    this.skipWhitespacesAndComments();
    const operator = this.parseAssignmentOperator();
    const value = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "set",
      target,
      operator,
      value,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseReturn(): Stmt.Return {
    this.skipWhitespacesAndComments();
    let token = this.nextToken();
    Parser.assertKeywordToken(token, "return");
    const start = token.start;
    this.skipWhitespacesAndComments();
    token = this.peekToken();
    if (token.kind === ";") {
      this.cursor++;
      return { kind: "return", span: [token.start, token.end] };
    }
    if (token.kind === "(") {
      this.cursor++;
      this.skipWhitespacesAndComments();
      const state = this.parseIdentAsReturnState();
      this.skipWhitespacesAndComments();
      Parser.assertToken(this.nextToken(), ")");
      this.skipWhitespacesAndComments();
      Parser.assertToken(this.nextToken(), ";");
      return {
        kind: "return",
        state,
        span: this.getSpanWithLastToken(start),
      };
    }
    const value = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "return",
      value,
      span: this.getSpanWithLastToken(start),
    };
  }

  parseSynthetic(base64: boolean): Stmt.Synthetic {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, base64 ? "synthetic.base64" : "synthetic");
    const value = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "synthetic",
      value,
      base64: false,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseUnset(remove: boolean): Stmt.Unset {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertKeywordToken(token, remove ? "remove" : "unset");
    const target = this.parseIdentAsVariable();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ";");
    return {
      kind: "unset",
      target,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseAssignmentOperator(): AssignmentOperator {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    switch (token.kind) {
      case "=":
      case "+=":
      case "-=":
      case "*=":
      case "/=":
      case "%=":
      case "|=":
      case "&=":
      case "^=":
      case "<<=":
      case ">>=":
      case "rol=":
      case "ror=":
        return {
          kind: token.kind,
          span: [token.start, token.end],
        };
    }
    throw new Error(`Unexpected token: ${token.kind}`);
  }

  parseExpr(): Expr {
    const candidates: (BinaryOperator | UnaryOperator | Expr)[] = [];

    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      const token = this.peekToken();
      if (token.kind === ";") break;
      if (token.kind === "}") break;
      if (token.kind === ")") break;
      if (token.kind === ",") break;
      switch (token.kind) {
        case "keyword":
          candidates.push(this.parseIdentAsExpr());
          break;
        case "!":
        case "!=":
        case "!~":
        case "&&":
        case "||":
        case "<":
        case "<=":
        case "==":
        case ">=":
        case ">":
        case "~":
          candidates.push({ kind: token.kind, span: [token.start, token.end] });
          this.cursor++;
          break;
        case "(":
          candidates.push(this.parseParenthesizedExpr());
          break;
        case "number":
        case "string":
        case "bool":
        case "-":
          candidates.push(this.parseLiteral());
          break;
        default:
          throw new Error(`Unexpected token: ${token.kind}`);
      }
    }

    this.processOperatorsInPlace(candidates);
    const expressions: Expr[] = [];
    for (const candidate of candidates) {
      switch (candidate.kind) {
        case "variable":
        case "call":
        case "unary":
        case "binary":
        case "integer":
        case "float":
        case "bool":
        case "string":
        case "rtime":
          expressions.push(candidate);
          break;
        default:
          throw new Error(`Unexpected expression: ${candidate.kind}`);
      }
    }
    if (expressions.length === 1) return expressions[0];
    return {
      kind: "string_concat",
      tokens: expressions,
      span: [
        expressions[0].span[0],
        expressions[expressions.length - 1].span[1],
      ],
    };
  }

  private processOperatorsInPlace(
    candidates: (BinaryOperator | UnaryOperator | Expr)[],
  ) {
    let i = 0;
    // Process unary operators
    const unaryOperators = ["!"];
    while (
      (i = candidates.findIndex((c) => unaryOperators.includes(c.kind))) !== -1
    ) {
      const operator = candidates[i];
      const operand = candidates[i + 1];
      candidates.splice(i, 2, {
        kind: "unary",
        operator: {
          kind: operator.kind as UnaryOperator["kind"],
          span: [operator.span[0], operator.span[1]],
        },
        rhs: operand as Expr,
        span: [operator.span[0], operand.span[1]],
      });
    }
    // Process binary operators
    const binaryOperators = [
      "&&",
      "||",
      "<",
      "<=",
      "==",
      ">=",
      ">",
      "!=",
      "!~",
      "~",
    ];
    while (
      (i = candidates.findIndex((c) => binaryOperators.includes(c.kind))) !== -1
    ) {
      const left = candidates[i - 1];
      const operator = candidates[i];
      const right = candidates[i + 1];
      candidates.splice(i - 1, 3, {
        kind: "binary",
        operator: {
          kind: operator.kind as BinaryOperator["kind"],
          span: [operator.span[0], operator.span[1]],
        },
        lhs: left as Expr,
        rhs: right as Expr,
        span: [left.span[0], right.span[1]],
      });
      console.log(candidates);
    }
  }

  parseParenthesizedExpr(): Expr {
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "(");
    const expr = this.parseExpr();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), ")");
    return expr;
  }

  parseArguments(): Expr[] {
    this.skipWhitespacesAndComments();
    if (this.peekToken().kind === ")") {
      this.cursor++;
      return [];
    }
    const args: Expr[] = [];
    while (this.cursor < this.tokens.length) {
      args.push(this.parseExpr());
      this.skipWhitespacesAndComments();
      const token = this.nextToken();
      if (token.kind === ")") break;
      Parser.assertToken(token, ",");
    }
    return args;
  }

  parseLiteral(): Literal | Variable {
    this.skipWhitespacesAndComments();
    const token = this.peekToken();
    switch (token.kind) {
      case "keyword":
        return this.parseIdentAsVariable();
      case "string":
        return this.parseStringLiteral();
      case "number":
        return this.parseNumberLiteral();
      case "bool":
        return this.parseBoolLiteral();
      case "-":
        return this.parseRtimeLiteral();
      case "{":
        return this.parseObjectLiteral();
    }
    throw new Error(`Unexpected token: ${token.kind}`);
  }

  parseStringLiteral(): Literal.String {
    this.skipWhitespacesAndComments();
    const tokens: string[] = [];
    let token = this.peekToken();
    Parser.assertToken(token, "string");
    const start = token.start;
    while (token.kind === "string") {
      tokens.push(this.parseStringToken());
      this.skipWhitespacesAndComments();
      token = this.peekToken();
    }
    return {
      kind: "string",
      tokens: tokens,
      span: this.getSpanWithLastToken(start),
    };
  }

  parseStringToken(): string {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertToken(token, "string");
    const quoted = this.source.slice(token.start, token.end);
    if (quoted.startsWith('"') && quoted.endsWith('"')) {
      return unescape(quoted.slice(1, -1));
    }
    const opening = quoted.match(/^{.*?"/)?.[0];
    if (!opening) throw new Error(`Invalid string: ${quoted}`);
    return quoted.slice(opening.length, -opening.length);
  }

  parseNumberLiteral():
    | Literal.Integer
    | Literal.Float
    | Literal.RTime
    | Literal.Parcent {
    this.skipWhitespacesAndComments();
    const start = this.peekToken().start;
    const value = this.parseNumber();
    const span: Literal["span"] = this.getSpanWithLastToken(start);
    const literal = typeof value === "bigint"
      ? { kind: "integer", value, span } as const
      : { kind: "float", value, span } as const;
    this.skipWhitespacesAndComments();
    const token = this.peekToken();
    if (token.kind === "%") {
      if (typeof value === "bigint") {
        this.cursor++;
        return {
          kind: "parcent",
          value,
          span: this.getSpanWithLastToken(start),
        } as const;
      }
      throw new Error("Unexpected % token");
    }
    switch (token.kind === "keyword" && token.value) {
      case "ms":
      case "s":
      case "m":
      case "h":
      case "d":
      case "y":
        return this.parseRtimeLiteral(literal);
    }
    return literal;
  }

  parseNumber(): bigint | number {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertToken(token, "number");
    return parseNumber(this.source.slice(token.start, token.end));
  }

  parseBoolLiteral(): Literal.Bool {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertToken(token, "bool");
    return {
      kind: "bool",
      value: token.value,
      span: [token.start, token.end],
    };
  }

  parseRtimeLiteral(
    numberLiteral?: Literal.Float | Literal.Integer,
  ): Literal.RTime {
    const start = numberLiteral?.span[0] ?? this.peekToken().start;
    let sign = 1n;
    if (!numberLiteral) {
      if (this.peekToken().kind === "-") {
        sign = -1n;
        this.cursor++;
      }
    }
    const amount = numberLiteral?.value ?? this.parseNumber();
    const unit = this.parseIdent();
    const span: Literal["span"] = this.getSpanWithLastToken(start);
    switch (unit) {
      case "ms":
      case "s":
      case "m":
      case "h":
      case "d":
      case "y":
        return {
          kind: "rtime",
          value: typeof amount === "bigint"
            ? sign * amount
            : Number(sign) * amount,
          unit,
          span,
        };
    }
    throw new Error(`Unexpected rtime unit: ${unit}`);
  }

  parseObjectLiteral(): Literal.Object {
    const token = this.nextToken();
    Parser.assertToken(token, "{");
    return {
      kind: "object",
      properties: this.parseObjectProperties(),
      span: this.getSpanWithLastToken(token.start),
    };
  }

  parseObjectProperties(): ObjectProperty[] {
    const entries: ObjectProperty[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      if (this.peekToken().kind === "}") {
        this.cursor++;
        break;
      }
      entries.push(this.parseObjectProperty());
      this.skipWhitespacesAndComments();
      const token = this.nextToken();
      if (token.kind === "}") break;
      Parser.assertToken(token, ";");
    }
    return entries;
  }

  parseObjectProperty(): ObjectProperty {
    this.skipWhitespacesAndComments();
    const token = this.nextToken();
    Parser.assertToken(token, ".");
    const key = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken(), "=");
    this.skipWhitespacesAndComments();
    const value = this.peekToken().kind === "keyword"
      ? this.parseIdentAsVariable()
      : this.parseLiteral();
    return {
      kind: "object-property",
      key,
      value,
      span: this.getSpanWithLastToken(token.start),
    };
  }

  private static assertToken<T extends Token["kind"]>(
    actual: Token,
    expected: T,
  ): asserts actual is Token & { kind: T } {
    if (actual.kind !== expected) {
      throw new Error(
        `Expected ${expected}, got ${
          actual.kind === "keyword" ? actual.value : actual.kind
        }`,
      );
    }
  }

  private static assertKeywordToken<T extends Token.Keyword["value"]>(
    actual: Token,
    expected: T,
  ): asserts actual is Token & { kind: "keyword"; value: T } {
    if (actual.kind !== "keyword" || actual.value !== expected) {
      throw new Error(`Expected keyword ${expected}, got ${actual.value}`);
    }
  }
}
