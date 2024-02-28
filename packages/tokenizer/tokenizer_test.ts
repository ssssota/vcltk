import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import type { Token } from "./token.ts";
import { Tokenizer } from "./tokenizer.ts";

Deno.test("If input is blank, return only eof token", () => {
  assertEquals(
    Array.from(new Tokenizer("")),
    [{ token: "eof", start: 0, end: 0 }] satisfies Token[],
  );
});

Deno.test("Parse special tokens", () => {
  assertEquals(
    Array.from(new Tokenizer("\n")),
    [
      { token: "lf", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(" ")),
    [
      { token: "ws", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
});

Deno.test("Parse conditional operators", () => {
  assertEquals(
    Array.from(new Tokenizer("==")),
    [
      { token: "==", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("!=")),
    [
      { token: "!=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("~")),
    [
      { token: "~", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("!~")),
    [
      { token: "!~", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(">")),
    [
      { token: ">", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("<")),
    [
      { token: "<", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(">=")),
    [
      { token: ">=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("<=")),
    [
      { token: "<=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
});

Deno.test("Parse assignment operators", () => {
  assertEquals(
    Array.from(new Tokenizer("=")),
    [
      { token: "=", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("+=")),
    [
      { token: "+=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("-=")),
    [
      { token: "-=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("*=")),
    [
      { token: "*=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("/=")),
    [
      { token: "/=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("%=")),
    [
      { token: "%=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("|=")),
    [
      { token: "|=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("&=")),
    [
      { token: "&=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("^=")),
    [
      { token: "^=", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("<<=")),
    [
      { token: "<<=", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(">>=")),
    [
      { token: ">>=", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("rol=")),
    [
      { token: "rol=", start: 0, end: 4 },
      { token: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("ror=")),
    [
      { token: "ror=", start: 0, end: 4 },
      { token: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("&&=")),
    [
      { token: "&&=", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("||=")),
    [
      { token: "||=", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
});

Deno.test("Parse special punctuation", () => {
  assertEquals(
    Array.from(new Tokenizer("(")),
    [
      { token: "(", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(")")),
    [
      { token: ")", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("{")),
    [
      { token: "{", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("}")),
    [
      { token: "}", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("[")),
    [
      { token: "[", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("]")),
    [
      { token: "]", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(",")),
    [
      { token: ",", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(".")),
    [
      { token: ".", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(";")),
    [
      { token: ";", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(":")),
    [
      { token: ":", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("/")),
    [
      { token: "/", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("!")),
    [
      { token: "!", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("+")),
    [
      { token: "+", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("-")),
    [
      { token: "-", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("*")),
    [
      { token: "*", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("%")),
    [
      { token: "%", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("|")),
    [
      { token: "|", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("&")),
    [
      { token: "&", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("<<")),
    [
      { token: "<<", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(">>")),
    [
      { token: ">>", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("++")),
    [
      { token: "++", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("--")),
    [
      { token: "--", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
});

Deno.test("Parse special keywords", () => {
  assertEquals(
    Array.from(new Tokenizer("acl")),
    [
      { token: "acl", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("backend")),
    [
      { token: "backend", start: 0, end: 7 },
      { token: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("declare")),
    [
      { token: "declare", start: 0, end: 7 },
      { token: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("director")),
    [
      { token: "director", start: 0, end: 8 },
      { token: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("import")),
    [
      { token: "import", start: 0, end: 6 },
      { token: "eof", start: 6, end: 6 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("include")),
    [
      { token: "include", start: 0, end: 7 },
      { token: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("table")),
    [
      { token: "table", start: 0, end: 5 },
      { token: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("add")),
    [
      { token: "add", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("call")),
    [
      { token: "call", start: 0, end: 4 },
      { token: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("sub")),
    [
      { token: "sub", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("error")),
    [
      { token: "error", start: 0, end: 5 },
      { token: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("return")),
    [
      { token: "return", start: 0, end: 6 },
      { token: "eof", start: 6, end: 6 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("set")),
    [
      { token: "set", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("unset")),
    [
      { token: "unset", start: 0, end: 5 },
      { token: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("log")),
    [
      { token: "log", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("esi")),
    [
      { token: "esi", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("synthetic")),
    [
      { token: "synthetic", start: 0, end: 9 },
      { token: "eof", start: 9, end: 9 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("if")),
    [
      { token: "if", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("else")),
    [
      { token: "else", start: 0, end: 4 },
      { token: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("elsif")),
    [
      { token: "elsif", start: 0, end: 5 },
      { token: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("elseif")),
    [
      { token: "elseif", start: 0, end: 6 },
      { token: "eof", start: 6, end: 6 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("penaltybox")),
    [
      { token: "penaltybox", start: 0, end: 10 },
      { token: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("ratecounter")),
    [
      { token: "ratecounter", start: 0, end: 11 },
      { token: "eof", start: 11, end: 11 },
    ] satisfies Token[],
  );
});

Deno.test("Parse identities", () => {
  assertEquals(
    Array.from(new Tokenizer("ident")),
    [
      { token: "ident", start: 0, end: 5 },
      { token: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("ident123")),
    [
      { token: "ident", start: 0, end: 8 },
      { token: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("ide.nt_12:3-")),
    [
      { token: "ident", start: 0, end: 12 },
      { token: "eof", start: 12, end: 12 },
    ] satisfies Token[],
  );
});

Deno.test("Parse literals (numbers)", () => {
  assertEquals(
    Array.from(new Tokenizer("200")),
    [
      { token: "number", start: 0, end: 3 },
      { token: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("0xDeadBeef")),
    [
      { token: "number", start: 0, end: 10 },
      { token: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("-134")),
    [
      { token: "number", start: 0, end: 4 },
      { token: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("0.2e3")),
    [
      { token: "number", start: 0, end: 5 },
      { token: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("01.5e-10")),
    [
      { token: "number", start: 0, end: 8 },
      { token: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("0x101.ABCp2")),
    [
      { token: "number", start: 0, end: 11 },
      { token: "eof", start: 11, end: 11 },
    ] satisfies Token[],
  );
});

Deno.test("Parse literals (strings)", () => {
  assertEquals(
    Array.from(new Tokenizer(`""`)),
    [
      { token: "string", start: 0, end: 2 },
      { token: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(`"string"`)),
    [
      { token: "string", start: 0, end: 8 },
      { token: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(`{""}`)),
    [
      { token: "string", start: 0, end: 4 },
      { token: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer(`{a"a"a}`)),
    [
      { token: "string", start: 0, end: 7 },
      { token: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
});

Deno.test("Parse comments", () => {
  assertEquals(
    Array.from(new Tokenizer("// comment")),
    [
      { token: "comment", start: 0, end: 10 },
      { token: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("// comment\n")),
    [
      { token: "comment", start: 0, end: 10 },
      { token: "lf", start: 10, end: 11 },
      { token: "eof", start: 11, end: 11 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("/*\n  comment\n */\n")),
    [
      { token: "comment", start: 0, end: 16 },
      { token: "lf", start: 16, end: 17 },
      { token: "eof", start: 17, end: 17 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("#")),
    [
      { token: "comment", start: 0, end: 1 },
      { token: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    Array.from(new Tokenizer("# comment\n")),
    [
      { token: "comment", start: 0, end: 9 },
      { token: "lf", start: 9, end: 10 },
      { token: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
});
