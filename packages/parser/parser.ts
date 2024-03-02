import type { AclEntry, Declaration, VCL } from "jsr:@vcltk/ast@^0.1.0";
import type { Token } from "jsr:@vcltk/token@^0.1.0";
import { parseNumber } from "./utils/parse_number.ts";
import { unescape } from "./utils/unescape.ts";

export class Parser {
  private cursor = 0;
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
    let token = this.tokens[this.cursor];
    while (
      token.token === "ws" ||
      token.token === "lf" ||
      token.token === "comment"
    ) {
      token = this.tokens[++this.cursor];
    }
  }

  parseDeclarations(): Declaration[] {
    const declarations: Declaration[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      if (this.peekToken().token === "eof") break;
      declarations.push(this.parseDeclaration());
    }
    return declarations;
  }

  parseDeclaration(): Declaration {
    this.skipWhitespacesAndComments();
    const token = this.peekToken();

    switch (token.token) {
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

    throw new Error(`Unexpected token: ${token.token}`);
  }

  parseAcl(): Declaration.AclDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // acl
    this.skipWhitespacesAndComments();
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    const openBrace = this.nextToken(); // {
    Parser.assertToken(openBrace.token, "{");
    this.skipWhitespacesAndComments();
    const entries = this.parseAclEntries();
    return {
      kind: "acl",
      name,
      entries,
      span: [start, this.tokens[this.cursor - 1].end],
    };
  }

  parseBackend(): Declaration.BackendDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // backend
    this.skipWhitespacesAndComments();
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    const openBrace = this.nextToken(); // {
    Parser.assertToken(openBrace.token, "{");
    this.skipWhitespacesAndComments();

    // TODO
    throw new Error("Not implemented");
  }

  parseDirector(): Declaration.DirectorDeclaration {
    // TODO
    throw new Error("Not implemented");
  }

  parseImport(): Declaration.ImportDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // import
    this.skipWhitespacesAndComments();
    const ident = this.parseIdent();
    this.skipWhitespacesAndComments();
    const semicolon = this.nextToken(); // ;
    Parser.assertToken(semicolon.token, ";");
    return {
      kind: "import",
      ident,
      span: [start, semicolon.end],
    };
  }

  parseInclude(): Declaration.IncludeDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // include
    this.skipWhitespacesAndComments();
    const path = this.parseString();
    this.skipWhitespacesAndComments();
    const semicolon = this.nextToken(); // ;
    Parser.assertToken(semicolon.token, ";");
    return {
      kind: "include",
      path,
      span: [start, semicolon.end],
    };
  }

  parsePenaltybox(): Declaration.PenaltyBoxDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // penaltybox
    this.skipWhitespacesAndComments();
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken().token, "{");
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken().token, "}");
    return {
      kind: "penaltybox",
      name,
      span: [start, this.tokens[this.cursor - 1].end],
    };
  }

  parseRatecounter(): Declaration.RateCounterDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // ratecounter
    this.skipWhitespacesAndComments();
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken().token, "{");
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken().token, "}");
    return {
      kind: "ratecounter",
      name,
      span: [start, this.tokens[this.cursor - 1].end],
    };
  }

  parseSubroutine(): Declaration.SubroutineDeclaration {
    // TODO
    throw new Error("Not implemented");
  }

  parseTable(): Declaration.TableDeclaration {
    this.skipWhitespacesAndComments();
    const start = this.nextToken().start; // table
    this.skipWhitespacesAndComments();
    const name = this.parseIdent();
    this.skipWhitespacesAndComments();
    Parser.assertToken(this.nextToken().token, "{");
    // TODO
    throw new Error("Not implemented");
  }

  parseIdent(): string {
    const token = this.nextToken();
    Parser.assertToken(token.token, "ident");
    return this.source.slice(token.start, token.end);
  }

  parseAclEntries(): AclEntry[] {
    const entries: AclEntry[] = [];
    while (this.cursor < this.tokens.length) {
      this.skipWhitespacesAndComments();
      if (this.peekToken().token === "}") {
        this.cursor++;
        break;
      }
      entries.push(this.parseAclEntry());
      this.skipWhitespacesAndComments();
      const token = this.nextToken();
      if (token.token === "}") break;
      Parser.assertToken(token.token, ";");
    }
    return entries;
  }

  parseAclEntry(): AclEntry {
    let token = this.peekToken();
    const start = token.start;
    let negated = false;
    let cidr = 0;
    if (token.token === "!") {
      negated = true;
      this.cursor++;
      this.skipWhitespacesAndComments();
      token = this.peekToken();
    }
    const address = this.parseString();
    this.skipWhitespacesAndComments();
    token = this.peekToken();
    if (token.token === "/") {
      this.cursor++;
      this.skipWhitespacesAndComments();
      cidr = Number(this.parseNumber());
    }
    return {
      kind: "acl-entry",
      negated,
      address,
      cidr,
      span: [start, this.tokens[this.cursor - 1].end],
    };
  }

  parseString(): string {
    const token = this.nextToken();
    Parser.assertToken(token.token, "string");
    const quoted = this.source.slice(token.start, token.end);
    if (quoted.startsWith('"') && quoted.endsWith('"')) {
      return unescape(quoted.slice(1, -1));
    }
    const opening = quoted.match(/^{.*?"/)?.[0];
    if (!opening) throw new Error(`Invalid string: ${quoted}`);
    return quoted.slice(opening.length, -opening.length);
  }

  parseNumber(): bigint | number {
    const token = this.nextToken();
    Parser.assertToken(token.token, "number");
    return parseNumber(this.source.slice(token.start, token.end));
  }

  private static assertToken(actual: Token["token"], expected: Token["token"]) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  }
}
