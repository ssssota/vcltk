import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import type { Token } from "./deps.ts";
import { tokenize } from "./tokenizer.ts";

Deno.test("If input is blank, return only eof token", () => {
  assertEquals(
    tokenize(""),
    [{ kind: "eof", start: 0, end: 0 }] satisfies Token[],
  );
});

Deno.test("Tokenize special tokens", () => {
  assertEquals(
    tokenize("\n"),
    [
      { kind: "lf", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(" "),
    [
      { kind: "ws", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize conditional operators", () => {
  assertEquals(
    tokenize("=="),
    [
      { kind: "==", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("!="),
    [
      { kind: "!=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("~"),
    [
      { kind: "~", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("!~"),
    [
      { kind: "!~", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(">"),
    [
      { kind: ">", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("<"),
    [
      { kind: "<", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(">="),
    [
      { kind: ">=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("<="),
    [
      { kind: "<=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize assignment operators", () => {
  assertEquals(
    tokenize("="),
    [
      { kind: "=", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("+="),
    [
      { kind: "+=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("-="),
    [
      { kind: "-=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("*="),
    [
      { kind: "*=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("/="),
    [
      { kind: "/=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("%="),
    [
      { kind: "%=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("|="),
    [
      { kind: "|=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("&="),
    [
      { kind: "&=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("^="),
    [
      { kind: "^=", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("<<="),
    [
      { kind: "<<=", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(">>="),
    [
      { kind: ">>=", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("rol="),
    [
      { kind: "rol=", start: 0, end: 4 },
      { kind: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("ror="),
    [
      { kind: "ror=", start: 0, end: 4 },
      { kind: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("&&="),
    [
      { kind: "&&=", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("||="),
    [
      { kind: "||=", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize special punctuation", () => {
  assertEquals(
    tokenize("("),
    [
      { kind: "(", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(")"),
    [
      { kind: ")", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("{"),
    [
      { kind: "{", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("}"),
    [
      { kind: "}", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("["),
    [
      { kind: "[", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("]"),
    [
      { kind: "]", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(","),
    [
      { kind: ",", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("."),
    [
      { kind: ".", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(";"),
    [
      { kind: ";", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(":"),
    [
      { kind: ":", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("/"),
    [
      { kind: "/", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("!"),
    [
      { kind: "!", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("+"),
    [
      { kind: "+", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("-"),
    [
      { kind: "-", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("*"),
    [
      { kind: "*", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("%"),
    [
      { kind: "%", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("|"),
    [
      { kind: "|", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("&"),
    [
      { kind: "&", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("<<"),
    [
      { kind: "<<", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(">>"),
    [
      { kind: ">>", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("++"),
    [
      { kind: "++", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("--"),
    [
      { kind: "--", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize special keywords", () => {
  assertEquals(
    tokenize("acl"),
    [
      { kind: "keyword", value: "acl", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("backend"),
    [
      { kind: "keyword", value: "backend", start: 0, end: 7 },
      { kind: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("declare"),
    [
      { kind: "keyword", value: "declare", start: 0, end: 7 },
      { kind: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("director"),
    [
      { kind: "keyword", value: "director", start: 0, end: 8 },
      { kind: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("import"),
    [
      { kind: "keyword", value: "import", start: 0, end: 6 },
      { kind: "eof", start: 6, end: 6 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("include"),
    [
      { kind: "keyword", value: "include", start: 0, end: 7 },
      { kind: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("table"),
    [
      { kind: "keyword", value: "table", start: 0, end: 5 },
      { kind: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("add"),
    [
      { kind: "keyword", value: "add", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("call"),
    [
      { kind: "keyword", value: "call", start: 0, end: 4 },
      { kind: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("sub"),
    [
      { kind: "keyword", value: "sub", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("error"),
    [
      { kind: "keyword", value: "error", start: 0, end: 5 },
      { kind: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("return"),
    [
      { kind: "keyword", value: "return", start: 0, end: 6 },
      { kind: "eof", start: 6, end: 6 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("set"),
    [
      { kind: "keyword", value: "set", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("unset"),
    [
      { kind: "keyword", value: "unset", start: 0, end: 5 },
      { kind: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("log"),
    [
      { kind: "keyword", value: "log", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("esi"),
    [
      { kind: "keyword", value: "esi", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("synthetic"),
    [
      { kind: "keyword", value: "synthetic", start: 0, end: 9 },
      { kind: "eof", start: 9, end: 9 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("if"),
    [
      { kind: "keyword", value: "if", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("else"),
    [
      { kind: "keyword", value: "else", start: 0, end: 4 },
      { kind: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("elsif"),
    [
      { kind: "keyword", value: "elsif", start: 0, end: 5 },
      { kind: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("elseif"),
    [
      { kind: "keyword", value: "elseif", start: 0, end: 6 },
      { kind: "eof", start: 6, end: 6 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("penaltybox"),
    [
      { kind: "keyword", value: "penaltybox", start: 0, end: 10 },
      { kind: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("ratecounter"),
    [
      { kind: "keyword", value: "ratecounter", start: 0, end: 11 },
      { kind: "eof", start: 11, end: 11 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize identities", () => {
  assertEquals(
    tokenize("ident"),
    [
      { kind: "keyword", value: "ident", start: 0, end: 5 },
      { kind: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("ident123"),
    [
      { kind: "keyword", value: "ident123", start: 0, end: 8 },
      { kind: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("ide.nt_12:3-"),
    [
      { kind: "keyword", value: "ide.nt_12:3-", start: 0, end: 12 },
      { kind: "eof", start: 12, end: 12 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize literals (numbers)", () => {
  assertEquals(
    tokenize("200"),
    [
      { kind: "number", start: 0, end: 3 },
      { kind: "eof", start: 3, end: 3 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("0xDeadBeef"),
    [
      { kind: "number", start: 0, end: 10 },
      { kind: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("-134"),
    [
      { kind: "number", start: 0, end: 4 },
      { kind: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("0.2e3"),
    [
      { kind: "number", start: 0, end: 5 },
      { kind: "eof", start: 5, end: 5 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("01.5e-10"),
    [
      { kind: "number", start: 0, end: 8 },
      { kind: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("0x101.ABCp2"),
    [
      { kind: "number", start: 0, end: 11 },
      { kind: "eof", start: 11, end: 11 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize literals (strings)", () => {
  assertEquals(
    tokenize(`""`),
    [
      { kind: "string", start: 0, end: 2 },
      { kind: "eof", start: 2, end: 2 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(`"string"`),
    [
      { kind: "string", start: 0, end: 8 },
      { kind: "eof", start: 8, end: 8 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(`{""}`),
    [
      { kind: "string", start: 0, end: 4 },
      { kind: "eof", start: 4, end: 4 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize(`{a"a"a}`),
    [
      { kind: "string", start: 0, end: 7 },
      { kind: "eof", start: 7, end: 7 },
    ] satisfies Token[],
  );
});

Deno.test("Tokenize comments", () => {
  assertEquals(
    tokenize("// comment"),
    [
      { kind: "comment", start: 0, end: 10 },
      { kind: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("// comment\n"),
    [
      { kind: "comment", start: 0, end: 10 },
      { kind: "lf", start: 10, end: 11 },
      { kind: "eof", start: 11, end: 11 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("/*\n  comment\n */\n"),
    [
      { kind: "comment", start: 0, end: 16 },
      { kind: "lf", start: 16, end: 17 },
      { kind: "eof", start: 17, end: 17 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("#"),
    [
      { kind: "comment", start: 0, end: 1 },
      { kind: "eof", start: 1, end: 1 },
    ] satisfies Token[],
  );
  assertEquals(
    tokenize("# comment\n"),
    [
      { kind: "comment", start: 0, end: 9 },
      { kind: "lf", start: 9, end: 10 },
      { kind: "eof", start: 10, end: 10 },
    ] satisfies Token[],
  );
});
